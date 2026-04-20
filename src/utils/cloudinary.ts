const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const hasCloudinaryConfig = Boolean(cloudName && uploadPreset);

interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
}

export async function uploadArtworkImage(file: File): Promise<{ publicId: string; url: string }> {
  if (!hasCloudinaryConfig) {
    throw new Error('Cloudinary is not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset as string);
  formData.append('folder', 'sienvera-artshop');

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Image upload failed. Please verify your Cloudinary upload preset.');
  }

  const data = (await response.json()) as CloudinaryUploadResponse;
  return { publicId: data.public_id, url: data.secure_url };
}
