import Joi from "joi";
import { Signup } from "../interfaces/auth.types";
import { validate } from "express-validation";


export const signUp = validate({
    body: Joi.object<Signup>({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      dob: Joi.string().required(),
      gender: Joi.string().optional(),
    })
  });