import bcrypt from "bcryptjs";
import User, { IUser } from "../../models/user.model";
import { BadRequestException } from "../../utils/service-exception";
import { Login, Signup } from "./interfaces/auth.types";
import { UploadAndSaveOptions } from "./interfaces/user.types";
import { loginResponse } from "../../utils/login-response";
import { EmailService } from "../../utils/email-service";
import { createClient } from "redis";
import { generateToken } from "../../utils/genrandom";
// import { v2 as cloudinary } from 'cloudinary';
import { ReadStream } from 'fs';
import Content from "../../models/content.model";
import cloudinary from "../../utils/cloudinary";

const redisClient = createClient();

redisClient.connect().catch(err => {
  console.error("Redis connection error:", err);
});

const ObjectId = require("mongoose").Types.ObjectId;


export default class UserService {
  private emailService: EmailService;
  constructor() {
    this.emailService = new EmailService();
  }

  async signUp(payload: Signup) {
    if (!payload.email || !payload.username || !payload.password) {
      throw new BadRequestException("Email, username, and password are required");
    }
    const email = payload.email.toLowerCase();

    const existingUser = await User.findOne({
      $or: [{ email }, { username: payload.username }],
    })
      .select("email username")
      .lean();

    if (existingUser) {
      if (existingUser.email === email) {
        throw new BadRequestException("An account with this email already exists");
      }
      if (existingUser.username === payload.username) {
        throw new BadRequestException(`The username '${payload.username}' is taken.`);
      }
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const userData: Partial<IUser> = {
      username: payload.username,
      bio: "",
      email: email,
      avatar: "",
      dob: payload.dob,
      password: hashedPassword,
      country: new ObjectId(payload.country),
      gender: payload.gender,
    };

    const user = await User.create(userData);

    const token = await generateToken(24);
    try {
      const redisPayload = JSON.stringify({ userId: user._id, verificationToken: token });
      await redisClient.set(`verify:${token}`, redisPayload, {
        EX: 60 * 60,
      });

    } catch (redisErr) {
      console.error("Redis error setting verification token:", redisErr);
      throw new Error("Failed to store verification token. Please try again.");
    }

    try {
      await this.emailService.sendWelcomeEmail(user.email, {
        hash: token,
        name: user.username,
      });
    } catch (emailError) {
      console.error("Email send error", emailError);
    }

    return {
      user: {
        _id: user.id,
        email: user.email,
      },
      emailVerificationRequired: true,
    };
  }

  async signIn(payload: Login) {
    // 1. Validate Input
        if (!payload.email || !payload.password) {
            throw new BadRequestException("Email and password are required");
        }
    const email = payload.email.toLowerCase();
    // 2. Fetch User (Optimized)
    const user = await User.findOne({
      $or: [{ email: email }, { username: email }], // Use the lowercased email
    }).select('+password'); // Select the password explicitly

    if (!user) {
      throw new BadRequestException("Invalid Credentials");
    }

    // 3. Validate Password
    const isPasswordValid = await bcrypt.compare(payload.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException("Invalid Credentials");
    }
    
    //Remove password before returning user object
    //user.password = undefined;

    // 4. Return
    return loginResponse(user.id);
  }

 async uploadAndSaveContent(payload: UploadAndSaveOptions) {
  try {
    const result = await cloudinary.uploader.upload(payload.filePath, {
      folder: 'fga-hub-content',
      resource_type: payload.resourceType || 'auto',
    });

    const saved = await Content.create({
      userId: payload.userId,
      url: result.secure_url,
      publicId: result.public_id,
      type: payload.resourceType || 'auto',
    });

    return saved;
  } catch (err) {
    console.error('Upload failed:', err);
    throw new Error('Content upload failed');
  }
}

}
