import { Request, Response } from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { ApiResponse } from "../../utils/apiResponse";

const UPLOAD_DIR = path.resolve(__dirname, "../../../uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// In-memory multer storage before sharp compression
const storage = multer.memoryStorage();

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg\+xml|svg/;
    const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
    const mime = file.mimetype;
    if (allowed.test(ext) || allowed.test(mime)) {
      return cb(null, true);
    }
    return cb(new Error("Only JPEG, PNG, WebP, and SVG images are allowed."));
  },
});

export class MediaController {
  static async uploadImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return ApiResponse.badRequest(res, "No image file provided.");
      }

      const isSvg = req.file.mimetype.includes("svg");
      const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${isSvg ? "svg" : "webp"}`;
      const outputPath = path.join(UPLOAD_DIR, filename);

      if (isSvg) {
        fs.writeFileSync(outputPath, req.file.buffer);
      } else {
        // Compress and optimize image to modern WebP
        await sharp(req.file.buffer)
          .resize({ width: 1920, height: 1080, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 82 })
          .toFile(outputPath);
      }

      const publicUrl = `/uploads/${filename}`;
      return ApiResponse.created(res, { url: publicUrl, filename }, "Image uploaded and optimized.");
    } catch (err: any) {
      return ApiResponse.badRequest(res, err.message || "Failed to upload image.");
    }
  }
}
