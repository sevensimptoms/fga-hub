
import { Router } from 'express';
import { jwtGuard } from '../middlewares/auth-guard';
import usersRoutes from './user';


const apiRouter = Router();
const route = Router();


const jwt = jwtGuard({ credentialsRequired: true }).unless({
    path: [
      '/',
      '/v1/register',
      '/v1/login',
      '/v1/upload',
      '/v1/users/google-login',
      '/v1/confirm-email',
      '/v1/users/forgot-password',
      '/v1/users/reset-password',
      '/v1/users/resend-confirm-email',
      '/v1/users/verify-phone',
      '/v1/users/verify-otp',
      '/v1/users/verify-invite',
      '/v1/countries'
    ]
  });

  apiRouter.use(usersRoutes);


    route.use('/v1', jwt, apiRouter);
    // route.use('/pub', publicRoutes);

export default route;