
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ImageUploader from './ImageUploader';

interface PublishingSectionProps {
  readTimeMinutes: number;
  setReadTimeMinutes: (value: number) => void;
  publishDate: string;
  setPublishDate: (value: string) => void;
  featureImageUrl: string;
  setFeatureImageUrl: (value: string) => void;
  isFeatured: boolean;
  setIsFeatured: (value: boolean) => void;
}

const PublishingSection: React.FC<PublishingSectionProps> = ({
  readTimeMinutes,
  setReadTimeMinutes,
  publishDate,
  setPublishDate,
  featureImageUrl,
  setFeatureImageUrl,
  isFeatured,
  setIsFeatured
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="readTime">Read Time (minutes)</Label>
          <Input 
            id="readTime" 
            type="number" 
            min="1" 
            value={readTimeMinutes} 
            onChange={(e) => setReadTimeMinutes(parseInt(e.target.value))} 
            className="border-supernova-navy/30" 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="publishDate">Publish Date</Label>
          <Input 
            id="publishDate" 
            type="date" 
            value={publishDate} 
            onChange={(e) => setPublishDate(e.target.value)} 
            className="border-supernova-navy/30" 
            required 
          />
        </div>
      </div>
      
      <ImageUploader
        featureImageUrl={featureImageUrl}
        setFeatureImageUrl={setFeatureImageUrl}
      />
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="isFeatured" 
          checked={isFeatured} 
          onCheckedChange={setIsFeatured} 
        />
        <Label htmlFor="isFeatured">Feature this article</Label>
      </div>
    </>
  );
};

export default PublishingSection;
