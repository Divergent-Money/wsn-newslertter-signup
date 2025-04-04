
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const NewsletterSignup: React.FC<{ className?: string }> = ({ className }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Request Received",
        description: "Thank you for your interest in WealthSuperNova. We'll be in touch soon about early access.",
        duration: 5000,
      });
      setEmail("");
      setName("");
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col space-y-3">
        <Input
          type="text"
          placeholder="Your Name"
          className="h-12 bg-white/10 backdrop-blur-sm border-supernova-gold/30 text-white placeholder:text-white/50"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Your Email"
          className="h-12 bg-white/10 backdrop-blur-sm border-supernova-gold/30 text-white placeholder:text-white/50"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button 
          type="submit" 
          className="h-12 bg-supernova-gold hover:bg-supernova-gold/90 text-black font-bold transition-all"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Request Early Access"}
        </Button>
      </div>
      <p className="text-xs text-white/60 mt-3 text-center">
        WealthSuperNova is currently invite-only. Request access to our bi-weekly newsletter with bonus market alerts.
      </p>
    </form>
  );
};

export default NewsletterSignup;
