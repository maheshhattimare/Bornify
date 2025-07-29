// middlewares/multer.js
import multer from "multer";

// Memory storage for cloudinary
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
