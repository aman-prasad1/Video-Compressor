import { Router } from "express";
import { compressVideo } from "../controllers/video.controllers.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route('/compress-video').post(upload.single("video"), compressVideo);



export default router;