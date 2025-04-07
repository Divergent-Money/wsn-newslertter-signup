
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ContentSectionProps {
  title: string;
  setTitle: (value: string) => void;
  slug: string;
  setSlug: (value: string) => void;
  summary: string;
  setSummary: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
}

const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  setTitle,
  slug,
  setSlug,
  summary,
  setSummary,
  content,
  setContent
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          className="border-supernova-navy/30" 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="slug">Slug (URL-friendly name)</Label>
        <Input 
          id="slug" 
          value={slug} 
          onChange={(e) => setSlug(e.target.value)} 
          className="border-supernova-navy/30" 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Textarea 
          id="summary" 
          value={summary} 
          onChange={(e) => setSummary(e.target.value)} 
          className="border-supernova-navy/30" 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="content">Content (HTML)</Label>
        <Textarea 
          id="content" 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          className="border-supernova-navy/30 min-h-[200px]" 
          required 
        />
      </div>
    </>
  );
};

export default ContentSection;
