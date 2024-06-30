import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
export const multerUploadMiddleware = upload.single('photo');