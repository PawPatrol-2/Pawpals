import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import type { Express } from "express";

if (!process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

type UploadedImage = {
  url: string;
  publicId: string;
};

export const uploadAnimalImage = (
  file: Express.Multer.File,
): Promise<UploadedImage> =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "pawpals/animals",
        resource_type: "image",
      },
      (error, result?: UploadApiResponse) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    stream.end(file.buffer);
  });

export const deleteAnimalImage = async (publicId?: string) => {
  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId);
};
