
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Send, Mail } from "lucide-react";
import { sendNewsletterToSubscribers } from '@/services/emailService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface SendNewsletterButtonProps {
  newsletterId: string;
  newsletterTitle: string;
}

const SendNewsletterButton: React.FC<SendNewsletterButtonProps> = ({
  newsletterId,
  newsletterTitle
}) => {
  const [isSending, setIsSending] = useState(false);
  const [testEmailDialogOpen, setTestEmailDialogOpen] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState("");
  const { toast } = useToast();
  
  const handleSendToSubscribers = async () => {
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

  const handleSendSummary = async () => {
    if (!confirm(`Are you sure you want to send a SUMMARY of "${newsletterTitle}" to all eligible subscribers?`)) {
      return;
    }
    
    setIsSending(true);
    
    try {
      const result = await sendNewsletterToSubscribers(
        newsletterId, 
        { 
          emailSubject: `Summary: ${newsletterTitle}`,
          emailType: 'summary'
        }
      );
      
      toast({
        title: "Summary newsletter scheduled for delivery",
        description: `The newsletter summary will be sent to ${result.recipientCount} subscribers.`,
        duration: 5000,
      });
    } catch (error: any) {
      console.error("Error sending summary newsletter:", error);
      toast({
        title: "Failed to send newsletter summary",
        description: error.message,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSendTest = async () => {
    if (!testEmailAddress) {
      toast({
        title: "Email required",
        description: "Please enter an email address for the test newsletter.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      await sendNewsletterToSubscribers(
        newsletterId, 
        { 
          emailSubject: `[TEST] ${newsletterTitle}`,
          emailType: 'full',
          testEmailAddress: testEmailAddress
        }
      );
      
      toast({
        title: "Test newsletter sent",
        description: `A test newsletter has been sent to ${testEmailAddress}.`,
        duration: 5000,
      });
      setTestEmailDialogOpen(false);
    } catch (error: any) {
      console.error("Error sending test newsletter:", error);
      toast({
        title: "Failed to send test newsletter",
        description: error.message,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
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
                Send Newsletter
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuItem onClick={() => handleSendToSubscribers()}>
            <Send className="mr-2 h-4 w-4" />
            <span>Send to subscribers</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSendSummary()}>
            <Mail className="mr-2 h-4 w-4" />
            <span>Send summary only</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setTestEmailDialogOpen(true)}>
            <Mail className="mr-2 h-4 w-4" />
            <span>Send test email</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={testEmailDialogOpen} onOpenChange={setTestEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Test Newsletter</DialogTitle>
            <DialogDescription>
              Enter an email address to send a test version of this newsletter.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="testEmail">Email address</label>
              <Input
                id="testEmail"
                type="email"
                placeholder="name@example.com"
                value={testEmailAddress}
                onChange={(e) => setTestEmailAddress(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTestEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendTest} disabled={isSending}>
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Test"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SendNewsletterButton;
