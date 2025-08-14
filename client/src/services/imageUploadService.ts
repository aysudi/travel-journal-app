import { apiConfig } from "./apiConfig";

export class ImageUploadService {
  // Upload image to Cloudinary via server
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);

    try {
      // For now, we'll create a simple upload endpoint
      // This is a temporary solution until we integrate destination uploads properly
      const response = await fetch(
        `${apiConfig.getBaseURL()}/api/upload-temp`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiConfig.getToken()}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data.secure_url || data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  // Upload multiple images
  async uploadImages(files: File[]): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }
}

export const imageUploadService = new ImageUploadService();
