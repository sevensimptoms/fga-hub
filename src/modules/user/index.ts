import { RequestHandler, Router } from "express";
import UserController from "./user.controller";
import multer from 'multer';

const controller = new UserController();
const router = Router();

const upload = multer({ dest: 'uploads/' });

router.post("/register", controller.signUp);
router.post('/login',  controller.signIn)
router.post('/upload', upload.single('file'), controller.uploadContent as unknown as RequestHandler)

export default router;