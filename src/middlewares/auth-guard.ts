import { expressjwt } from "express-jwt";

export const jwtGuard = (params: { credentialsRequired: boolean}) => expressjwt({
  secret: process.env.JWT_SECRET || "SECRET",
  algorithms: ['HS256'],
  credentialsRequired: params.credentialsRequired,
});