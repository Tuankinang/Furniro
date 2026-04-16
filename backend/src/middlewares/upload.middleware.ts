import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "furniro/products",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 800, height: 800, crop: "limit" }],
    };
  },
});

export const uploadProductImage = multer({ storage: productStorage });

const blogStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "furniro/blog",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 2000, height: 1050, crop: "limit", quality: "auto" }],
    };
  },
});

export const uploadBlogImage = multer({ storage: blogStorage });
