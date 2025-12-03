import multer from "multer";

const storageEngine = multer.memoryStorage();
export const upload = multer({ storage: storageEngine });
