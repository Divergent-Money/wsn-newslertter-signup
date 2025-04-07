
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Send } from "lucide-react";
import { sendNewsletterToSubscribers } from '@/services/emailService';

interface SendNewsletterButtonProps {
  newsletterId: string;
  newsletterTitle: string;
}

const SendNewsletterButton: React.FC<SendNewsletterButtonProps> = ({
  newsletterId,
  newsletterTitle
}) => {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  
  const handleSend = async () => {
    if (!confirm(`Are you sure you want to send "${newsletterTitle}" to all eligible subscribers?`)) {
      return;
    }
    
    setIsSending(true);
    
    try {
      const result = await sendNewsletterToSubscribers(
        newsletterId, 
        { 
          emailSubject: newsletterTitle,
          emailType: 'full'
        }
      );
      
      toast({
        title: "Newsletter scheduled for delivery",
        description: `The newsletter will be sent to ${result.recipientCount} subscribers.`,
        duration: 5000,
      });
    } catch (error: any) {
      console.error("Error sending newsletter:", error);
      toast({
        title: "Failed to send newsletter",
        description: error.message,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <Button
      onClick={handleSend}
      disabled={isSending}
      className="bg-supernova-gold hover:bg-supernova-gold/90 text-black"
    >
      {isSending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          Send to Subscribers
        </>
      )}
    </Button>
  );
};

export default SendNewsletterButton;
