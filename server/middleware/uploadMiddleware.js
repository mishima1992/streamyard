import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userSpecificPath = `uploads/videos/${req.user.username}/`;
    fs.mkdirSync(userSpecificPath, { recursive: true });
    cb(null, userSpecificPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, req.user.id + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /mp4|mov|3gp|mkv|avi|webm|flv/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('File type not supported. Please upload a video file.'), false);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 * 1024 }, // 10 GB limit
  fileFilter: fileFilter,
});

export default upload;
