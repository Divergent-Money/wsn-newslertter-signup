
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SubscriptionTier } from '@/services/newsletterArchiveService';
import SubscriptionBadge from '@/components/newsletters/SubscriptionBadge';
import ContentSection from './InsertNewsletterSections/ContentSection';
import MetadataSection from './InsertNewsletterSections/MetadataSection';
import PublishingSection from './InsertNewsletterSections/PublishingSection';

interface NewsletterFormValues {
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: string;
  minTier: SubscriptionTier;
  category: string;
  tags: string;
  readTimeMinutes: number;
  isFeatured: boolean;
  featureImageUrl: string;
  publishDate: string;
}

interface InsertNewsletterFormProps {
  formValues: NewsletterFormValues;
  handleChange: {
    setTitle: (value: string) => void;
    setSlug: (value: string) => void;
    setSummary: (value: string) => void;
    setContent: (value: string) => void;
    setAuthor: (value: string) => void;
    setMinTier: (value: SubscriptionTier) => void;
    setCategory: (value: string) => void;
    setTags: (value: string) => void;
    setReadTimeMinutes: (value: number) => void;
    setIsFeatured: (value: boolean) => void;
    setFeatureImageUrl: (value: string) => void;
    setPublishDate: (value: string) => void;
  };
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const InsertNewsletterForm: React.FC<InsertNewsletterFormProps> = ({ 
  formValues, 
  handleChange, 
  handleSubmit, 
  isLoading 
}) => {
  const { 
    title, slug, summary, content, author, minTier, category,
    tags, readTimeMinutes, isFeatured, featureImageUrl, publishDate
  } = formValues;

  const { 
    setTitle, setSlug, setSummary, setContent, setAuthor, setMinTier,
    setCategory, setTags, setReadTimeMinutes, setIsFeatured, setFeatureImageUrl,
    setPublishDate 
  } = handleChange;

  return (
    <Card className="border-supernova-navy/20 shadow-md">
      <CardHeader className="bg-supernova-navy/10">
        <CardTitle className="text-2xl font-display text-supernova-navy">Insert New Newsletter</CardTitle>
        <CardDescription className="text-supernova-navy/80">Add a new newsletter article to the database</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          <ContentSection 
            title={title}
            setTitle={setTitle}
            slug={slug}
            setSlug={setSlug}
            summary={summary}
            setSummary={setSummary}
            content={content}
            setContent={setContent}
          />

          <MetadataSection 
            author={author}
            setAuthor={setAuthor}
            minTier={minTier}
            setMinTier={setMinTier}
            category={category}
            setCategory={setCategory}
            tags={tags}
            setTags={setTags}
          />

          <PublishingSection
            readTimeMinutes={readTimeMinutes}
            setReadTimeMinutes={setReadTimeMinutes}
            publishDate={publishDate}
            setPublishDate={setPublishDate}
            featureImageUrl={featureImageUrl}
            setFeatureImageUrl={setFeatureImageUrl}
            isFeatured={isFeatured}
            setIsFeatured={setIsFeatured}
          />
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading} className="w-full bg-supernova-navy hover:bg-supernova-navy/90">
            {isLoading ? "Inserting..." : "Insert Newsletter"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default InsertNewsletterForm;
