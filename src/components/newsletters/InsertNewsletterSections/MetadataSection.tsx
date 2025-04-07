
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SubscriptionTier } from '@/services/newsletterArchiveService';
import SubscriptionBadge from '@/components/newsletters/SubscriptionBadge';

interface MetadataSectionProps {
  author: string;
  setAuthor: (value: string) => void;
  minTier: SubscriptionTier;
  setMinTier: (value: SubscriptionTier) => void;
  category: string;
  setCategory: (value: string) => void;
  tags: string;
  setTags: (value: string) => void;
}

const MetadataSection: React.FC<MetadataSectionProps> = ({
  author,
  setAuthor,
  minTier,
  setMinTier,
  category,
  setCategory,
  tags,
  setTags
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="author">Author</Label>
        <Input 
          id="author" 
          value={author} 
          onChange={(e) => setAuthor(e.target.value)} 
          className="border-supernova-navy/30" 
          required 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="minTier">Minimum Tier</Label>
          <Select value={minTier} onValueChange={(value: SubscriptionTier) => setMinTier(value)}>
            <SelectTrigger className="border-supernova-navy/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="blaze">Blaze</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
          <div className="pt-2">
            <SubscriptionBadge tier={minTier} />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input 
            id="category" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            className="border-supernova-navy/30" 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input 
          id="tags" 
          value={tags} 
          onChange={(e) => setTags(e.target.value)} 
          className="border-supernova-navy/30" 
        />
      </div>
    </>
  );
};

export default MetadataSection;
