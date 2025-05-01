'use client';

import { useState } from 'react';

export default function ImageUploader({ onImageChange }) {
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImageChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      onImageChange(null);
      setPreview(null);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="w-full"
      />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="mt-2 max-w-xs rounded-md"
        />
      )}
    </div>
  );
}