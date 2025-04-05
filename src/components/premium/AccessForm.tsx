import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

const AccessForm = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Insert the form data into your Supabase table
      const { data, error } = await supabase
        .from('newsletter_subscribers') // Replace with your actual table name
        .insert([
          { 
            name,
            email,
            created_at: new Date().toISOString(),
            source: 'premium_access_form',
            page_location: window.location.href
          }
        ]);
      
      if (error) {
        throw error;
      }
      
      console.log('Form submission saved to Supabase:', data);
      
      toast({
        title: "Request Received",
        description: "Thank you for your interest in WealthSuperNova. We'll be in touch soon about early access.",
        duration: 5000,
      });
      
      // Reset form
      setEmail("");
      setName("");
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

  return (
    <section id="request-access" className="py-24 px-8 md:px-16">
      <div className="container mx-auto max-w-7xl">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Request <span className="text-supernova-gold">Private Access</span>
            </h2>
            <p className="text-white/70">
              WealthSuperNova is available by invitation only. Submit your details below to request access to our bi-weekly insights and market alerts.
            </p>
          </div>
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 p-8">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">Full Name</label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">Email Address</label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-supernova-gold hover:bg-supernova-gold/90 text-black font-bold"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Request Access"}
                </Button>
                <p className="text-center text-xs text-white/50 mt-4">
                  Our team will review your application and respond within 48 hours.
                </p>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AccessForm;
