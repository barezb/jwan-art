import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { UploadImageResponse } from "../types";

interface ImageUploadProps {
  onUpload: (data: UploadImageResponse) => void;
  onError: (error: string) => void;
  currentImage?: string;
  onRemove?: () => void;
  disabled?: boolean;
}

export default function ImageUpload({
  onUpload,
  onError,
  currentImage,
  onRemove,
  disabled = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      onError("Please upload a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      onError("File size must be less than 10MB");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onUpload(result.data);
      } else {
        onError(result.error || "Upload failed");
      }
    } catch (error) {
      onError("Network error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  if (currentImage) {
    return (
      <div className="relative group">
        <div className="relative overflow-hidden rounded-lg border-2 border-gray-200">
          <img
            src={currentImage}
            alt="Current artwork"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                disabled={disabled}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors duration-200 disabled:opacity-50"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
        transition-all duration-200 
        ${
          dragActive
            ? "border-purple-500 bg-purple-50"
            : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${isUploading ? "pointer-events-none" : ""}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleInputChange}
        disabled={disabled || isUploading}
      />

      {isUploading ? (
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="text-sm text-gray-600">Uploading image...</p>
          <p className="text-xs text-gray-500">
            Compressing for optimal quality
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-2">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100">
            {dragActive ? (
              <Upload className="h-6 w-6 text-purple-600" />
            ) : (
              <ImageIcon className="h-6 w-6 text-purple-600" />
            )}
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900">
              {dragActive ? "Drop image here" : "Upload artwork image"}
            </p>
            <p className="text-xs text-gray-500">
              Drag & drop or click to select
            </p>
            <p className="text-xs text-gray-400">JPEG, PNG, WebP up to 10MB</p>
          </div>
        </div>
      )}
    </div>
  );
}