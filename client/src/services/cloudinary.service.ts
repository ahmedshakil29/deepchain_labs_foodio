// src/services/cloudinary.service.ts
export async function uploadImageToCloudinary(file: File): Promise<string> {
  if (
    !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  ) {
    throw new Error("Cloudinary config missing");
  }

  const data = new FormData();
  data.append("file", file);
  data.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  );

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
    {
      method: "POST",
      body: data,
    }
  );

  if (!res.ok) {
    throw new Error("Failed to upload image");
  }

  const result = await res.json();
  return result.secure_url;
}
