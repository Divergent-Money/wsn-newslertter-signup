
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const PremiumVersion = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-supernova-navy to-black text-white">
      {/* Header */}
      <header className="py-8 px-8 md:px-16">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <svg viewBox="0 0 260 260" className="h-12 w-12 text-supernova-gold">
                <path d="M130,10L170,90L250,130L170,170L130,250L90,170L10,130L90,90L130,10Z" fill="currentColor"/>
              </svg>
            </div>
            <Button 
              variant="outline" 
              className="border-supernova-gold/30 text-supernova-gold hover:bg-supernova-gold/10"
              onClick={() => navigate('/')}
            >
              View Original
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-8 md:px-16">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col items-center">
            <h1 className="font-display font-bold text-5xl md:text-7xl max-w-4xl text-center mb-6">
              <span className="bg-gradient-to-r from-white to-supernova-gold bg-clip-text text-transparent">
                Exclusive Financial Intelligence
              </span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl text-center text-white/70 mb-12">
              Join the world's most sophisticated investors receiving bi-weekly insights from WealthSuperNova's elite financial analysts.
            </p>
            <Button 
              className="text-lg px-8 py-6 h-auto bg-supernova-gold hover:bg-supernova-gold/90 text-black font-bold"
              onClick={() => document.getElementById('request-access')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Request Private Access
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-8 md:px-16">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col items-center mb-16">
            <div className="w-24 h-[1px] bg-supernova-gold/30 mb-8"></div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-center">
              The WealthSuperNova Advantage
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "Precision Market Analysis",
                description: "Our team of analysts leverages proprietary data models that consistently outperform traditional market indicators.",
                icon: (
                  <svg className="w-6 h-6 text-supernova-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                )
              },
              {
                title: "Exclusive Investment Opportunities",
                description: "Gain early access to investment opportunities typically reserved for institutional investors and family offices.",
                icon: (
                  <svg className="w-6 h-6 text-supernova-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                  </svg>
                )
              },
              {
                title: "Wealth Preservation Strategies",
                description: "Discover sophisticated strategies for wealth preservation and growth across market cycles and geopolitical shifts.",
                icon: (
                  <svg className="w-6 h-6 text-supernova-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10 p-8">
                <div className="h-12 w-12 rounded-full bg-supernova-gold/10 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-8 md:px-16 bg-white/5">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col items-center mb-16">
            <div className="w-24 h-[1px] bg-supernova-gold/30 mb-8"></div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-center">
              Client Testimonials
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                quote: "The caliber of analysis in WealthSuperNova is unparalleled. Their insights helped me navigate the recent market turbulence with confidence and precision.",
                author: "Jonathan R.",
                position: "Managing Director, Private Equity"
              },
              {
                quote: "As someone who manages significant family assets, I find the depth and quality of WealthSuperNova's research to be exceptional. Their contrarian perspectives have proven invaluable.",
                author: "Elizabeth M.",
                position: "Family Office Principal"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-supernova-navy/50 backdrop-blur-sm border-white/10 p-8">
                <svg className="w-12 h-12 text-supernova-gold/30 mb-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-white/80 text-lg mb-8">{testimonial.quote}</p>
                <div>
                  <p className="font-bold text-white">{testimonial.author}</p>
                  <p className="text-supernova-gold text-sm">{testimonial.position}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Request Access Form */}
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

      {/* Footer */}
      <footer className="py-12 px-8 md:px-16 border-t border-white/10">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <svg viewBox="0 0 260 260" className="h-10 w-10 text-supernova-gold">
                <path d="M130,10L170,90L250,130L170,170L130,250L90,170L10,130L90,90L130,10Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="text-white/60 text-sm">
              © {new Date().getFullYear()} WealthSuperNova. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PremiumVersion;
