
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { newsletterFormSchema, NewsletterFormValues } from '@/schemas/newsletterSchema';
import { investmentOptions, referralOptions } from './newsletter/newsletterOptions';
import { submitNewsletterSignup } from '@/services/newsletterService';
import InterestsSection from './newsletter/InterestsSection';

const NewsletterSignup: React.FC<{ className?: string }> = ({ className }) => {
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const { toast } = useToast();

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: {
      name: "",
      email: "",
      accessCode: "",
      interests: [],
      investmentLevel: "$100K-$500K",  // Set a default value
      referralSource: "",
    },
  });

  const onSubmit = async (data: NewsletterFormValues) => {
    setLoading(true);
    setFormError("");
    
    try {
      console.log("Submitting newsletter form with:", data);
      
      // Make sure all required fields have values even if not filled by user
      const completeData = {
        ...data,
        accessCode: data.accessCode || "",
        investmentLevel: data.investmentLevel || "$100K-$500K",
        interests: data.interests || [],
        referralSource: data.referralSource || ""
      };
      
      const result = await submitNewsletterSignup(completeData);
      console.log("Submission result:", result);
      
      toast({
        title: "Request Received",
        description: "Thank you for your interest in WealthSuperNova. We'll review your application and be in touch soon.",
        duration: 5000,
      });
      
      form.reset();
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setFormError(error?.message || "There was an issue processing your request. Please try again.");
      toast({
        title: "Submission Error",
        description: "There was a problem submitting your request. Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        <div className="flex flex-col space-y-4">
          {formError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded text-sm">
              {formError}
            </div>
          )}
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Your Full Name"
                    className="h-12 bg-white/10 backdrop-blur-sm border-supernova-gold/30 text-white placeholder:text-white/50"
                    required
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Your Email Address"
                    className="h-12 bg-white/10 backdrop-blur-sm border-supernova-gold/30 text-white placeholder:text-white/50"
                    required
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="investmentLevel"
            render={({ field }) => (
              <FormItem>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-12 bg-white/10 backdrop-blur-sm border-supernova-gold/30 text-white">
                      <SelectValue placeholder="Investment Portfolio Size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-supernova-navy border-supernova-gold/30">
                    {investmentOptions.map((option) => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value}
                        className="text-white hover:bg-white/10"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <InterestsSection form={form} />
          
          <FormField
            control={form.control}
            name="referralSource"
            render={({ field }) => (
              <FormItem>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-12 bg-white/10 backdrop-blur-sm border-supernova-gold/30 text-white">
                      <SelectValue placeholder="How Did You Hear About Us?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-supernova-navy border-supernova-gold/30">
                    {referralOptions.map((option) => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value}
                        className="text-white hover:bg-white/10"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="accessCode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Access Code (if you have one)"
                    className="h-12 bg-white/10 backdrop-blur-sm border-supernova-gold/30 text-white placeholder:text-white/50"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="h-12 bg-supernova-gold hover:bg-supernova-gold/90 text-black font-bold transition-all"
            disabled={loading}
          >
            {loading ? "Processing..." : "Submit Application"}
          </Button>
        </div>
        <p className="text-xs text-white/60 mt-3 text-center">
          WealthSuperNova is currently invite-only. Submit your application for our exclusive bi-weekly newsletter with bonus market alerts.
        </p>
      </form>
    </Form>
  );
};

export default NewsletterSignup;
