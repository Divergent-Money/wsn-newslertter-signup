
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadArticleImage } from '@/services/newsletterInsertService';
import { Loader2 } from "lucide-react";

interface ImageUploaderProps {
  featureImageUrl: string;
  setFeatureImageUrl: (value: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  featureImageUrl,
  setFeatureImageUrl
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Reset states
    setIsUploading(true);
    setUploadError(null);
    
    try {
      // Upload the file to Supabase storage
      const publicUrl = await uploadArticleImage(file);
      setFeatureImageUrl(publicUrl);
    } catch (error: any) {
      console.error("Error uploading image:", error);
      setUploadError(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="featureImage">Feature Image URL</Label>
        <div className="flex gap-2">
          <Input 
            id="featureImage" 
            value={featureImageUrl} 
            onChange={(e) => setFeatureImageUrl(e.target.value)} 
            className="border-supernova-navy/30 flex-1" 
            placeholder="Image URL or upload below"
          />
          <Input 
            id="imageUpload" 
            type="file" 
            accept="image/*" 
            disabled={isUploading}
            onChange={handleFileUpload}
            className="hidden" 
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('imageUpload')?.click()}
            disabled={isUploading}
            className="whitespace-nowrap border-supernova-navy/30 text-supernova-navy"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {uploadError && <p className="text-red-500 text-sm mt-1">{uploadError}</p>}
      </div>
      
      {featureImageUrl && (
        <div className="rounded-md overflow-hidden border border-supernova-navy/20">
          <img 
            src={featureImageUrl} 
            alt="Feature image preview" 
            className="w-full h-auto max-h-[200px] object-cover" 
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
