import React, { useState } from 'react';

const ImageUpload = ({ onImageUpload, maxImages = 5, useFormData = false }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > maxImages) {
      alert(`You can only upload a maximum of ${maxImages} images`);
      return;
    }

    if (useFormData) {
      // In FormData mode we do NOT upload here — we keep File objects and show previews.
      const newItems = files.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file)
      }));

      const updatedImages = [...images, ...newItems];
      setImages(updatedImages);
      onImageUpload(updatedImages.map((i) => i.file));
      return;
    }

    setUploading(true);
    
    try {
      // Upload each image to Cloudinary
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'olx_images'); // Use your unsigned upload preset
        formData.append('cloud_name', process.env.VITE_CLOUDINARY_CLOUD_NAME || 'dvzmuosqq'); // Use cloud name from env
        
        const response = await fetch(`https://api.cloudinary.com/v1_1/dvzmuosqq/image/upload`, {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        return data.secure_url; // Return the Cloudinary URL
      });

      const uploadedImageUrls = await Promise.all(uploadPromises);
      const updatedImages = [...images, ...uploadedImageUrls];
      setImages(updatedImages);
      onImageUpload(updatedImages);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const removed = images[index];
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);

    // Revoke object URLs to free memory
    if (useFormData && removed && typeof removed === 'object' && removed.previewUrl) {
      URL.revokeObjectURL(removed.previewUrl);
    }
    if (!useFormData && typeof removed === 'string' && removed.startsWith('blob:')) {
      URL.revokeObjectURL(removed);
    }

    // Parent expects File[] in FormData mode, else string[] URLs
    onImageUpload(useFormData ? updatedImages.map((i) => i.file) : updatedImages);
  };

  return (
    <div className="image-upload">
      <div className="image-preview">
        {images.map((image, index) => (
          <div key={index} className="image-container">
            <img src={useFormData ? image.previewUrl : image} alt={`Preview ${index + 1}`} />
            <button 
              className="remove-image" 
              onClick={() => removeImage(index)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      
      {images.length < maxImages && (
        <div className="upload-area">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            id="image-upload"
            disabled={uploading}
          />
          <label htmlFor="image-upload">
            <span>{uploading ? 'Uploading...' : '+'}</span> {uploading ? 'Uploading...' : 'Upload Images'}
          </label>
          <p>{images.length}/{maxImages} images uploaded</p>
        </div>
      )}
      {uploading && <p>Uploading images to Cloudinary...</p>}
    </div>
  );
};

export default ImageUpload;