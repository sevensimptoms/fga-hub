import { Request, Response } from "express";
import UserService from "./user.service";
import { BadRequestException } from "../../utils/service-exception";

export default class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  signUp = async (req: Request, res: Response) => {
    try {
      const result = await this.userService.signUp(req.body);
  
      res.redirect('/registration-successful');
    } catch (err: any) {
      const errorMessage =
        err instanceof BadRequestException
          ? err.message
          : 'Something went wrong during registration.';
  
      req.flash('error', errorMessage);
      res.redirect('/register');
    }
  };

  signIn = async (req: Request, res: Response) => {
    try {
      const result = await this.userService.signIn(req.body);
  
      function hasAccessToken(result: any): result is { accessToken: string; user: any } {
        return 'accessToken' in result && 'user' in result; // Check for both accessToken and user
      }
  
      if (hasAccessToken(result)) {
        // Now TypeScript knows `result` has `accessToken` and `user` properties
        res.cookie('auth', result.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });
        // Pass user details to the render method
        res.redirect('/dashboard'); //  Include user data for the dashboard
      } else {
          //Handle scenario where access token is not present.
          req.flash('success', 'Logged in successfully.');
          res.redirect('/dashboard');
      }
  
  
    } catch (err: any) {
      const errorMessage =
        err instanceof BadRequestException
          ? err.message
          : 'Something went wrong during login.';
  
      req.flash('error', errorMessage);
      res.redirect('/login');
    }
  };
  
  uploadContent = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Missing file or user context' });
      }

      // Assuming you have user ID on req.user (from auth middleware)
      const userId = req.user?.id || req.body.userId || 1234567; // fallback if no auth

      if (!userId) {
        return res.status(400).json({ error: 'Missing user ID' });
      }

      // Content type from the form data
      const resourceType = req.body.type || 'auto';

      const savedContent = await this.userService.uploadAndSaveContent({
        filePath: req.file.path,
        userId,
        resourceType,
      });

      return res.status(201).json({
        message: 'Content uploaded successfully',
        data: savedContent,
      });
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ error: 'Failed to upload content' });
    }
  }

}