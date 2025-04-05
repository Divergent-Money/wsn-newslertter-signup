
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  accessCode: z.string().optional(),
  investmentLevel: z.enum(["$100K-$500K", "$500K-$1M", "$1M-$5M", "$5M+"], {
    required_error: "Please select your investment level",
  }),
  interests: z.array(z.string()).optional(),
  referralSource: z.string().optional(),
});

const NewsletterSignup: React.FC<{ className?: string }> = ({ className }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      accessCode: "",
      interests: [],
      referralSource: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    
    try {
      // Insert the form data into your Supabase table
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([
          { 
            name: data.name,
            email: data.email,
            access_code: data.accessCode,
            investment_level: data.investmentLevel,
            interests: data.interests,
            referral_source: data.referralSource,
            created_at: new Date().toISOString(),
            source: 'homepage_newsletter_form',
            page_location: window.location.href
          }
        ]);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Request Received",
        description: "Thank you for your interest in WealthSuperNova. We'll review your application and be in touch soon.",
        duration: 5000,
      });
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
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

  const investmentOptions = [
    { value: "$100K-$500K", label: "$100K-$500K" },
    { value: "$500K-$1M", label: "$500K-$1M" },
    { value: "$1M-$5M", label: "$1M-$5M" },
    { value: "$5M+", label: "$5M+" },
  ];

  const interestOptions = [
    { id: "stocks", label: "Stocks & Equities" },
    { id: "crypto", label: "Cryptocurrency" },
    { id: "realestate", label: "Real Estate" },
    { id: "alternatives", label: "Alternative Investments" },
    { id: "retirement", label: "Retirement Planning" },
    { id: "wealthpres", label: "Wealth Preservation" },
  ];

  const referralOptions = [
    { value: "friend", label: "Friend or Colleague" },
    { value: "search", label: "Search Engine" },
    { value: "social", label: "Social Media" },
    { value: "event", label: "Financial Event" },
    { value: "other", label: "Other" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        <div className="flex flex-col space-y-4">
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
          
          <div className="space-y-2">
            <FormLabel className="text-sm font-medium text-white/80">Investment Interests</FormLabel>
            <div className="grid grid-cols-2 gap-2">
              {interestOptions.map((interest) => (
                <FormField
                  key={interest.id}
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem key={interest.id} className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(interest.id)}
                          onCheckedChange={(checked) => {
                            const currentValues = field.value || [];
                            const newValues = checked
                              ? [...currentValues, interest.id]
                              : currentValues.filter((value) => value !== interest.id);
                            field.onChange(newValues);
                          }}
                          className="border-supernova-gold/50 data-[state=checked]:bg-supernova-gold data-[state=checked]:text-black"
                        />
                      </FormControl>
                      <FormLabel className="text-sm text-white/80">{interest.label}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
          
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
