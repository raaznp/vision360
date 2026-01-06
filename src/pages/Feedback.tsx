import { useState } from "react";
import { 
  AlertTriangle, 
  Send, 
  CheckCircle2,
  MessageSquare,
  Lightbulb,
  FileWarning
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

const feedbackTypes = [
  { 
    id: "safety-concern", 
    label: "Safety Concern", 
    icon: AlertTriangle,
    description: "Report a safety hazard or violation"
  },
  { 
    id: "improvement", 
    label: "Improvement Suggestion", 
    icon: Lightbulb,
    description: "Suggest ways to improve training or safety"
  },
  { 
    id: "incident", 
    label: "Incident / Near-Miss", 
    icon: FileWarning,
    description: "Report a safety incident or close call"
  },
  { 
    id: "general", 
    label: "General Feedback", 
    icon: MessageSquare,
    description: "Other comments or questions"
  },
];

export default function Feedback() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    subject: "",
    location: "",
    description: "",
    anonymous: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast({
        title: "Feedback Submitted",
        description: "Thank you for helping us maintain a safe workplace.",
      });
    }, 1500);
  };

  if (submitted) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 max-w-lg">
          <div className="card-safety p-8 text-center animate-scale-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Thank You!</h1>
            <p className="text-muted-foreground mb-6">
              Your feedback has been submitted successfully. Our safety team will review it and take appropriate action.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Reference Number: <span className="font-mono text-foreground">SR-2025-001234</span>
            </p>
            <Button variant="safety" onClick={() => setSubmitted(false)}>
              Submit Another Report
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">Feedback & Reporting</h1>
          <p className="text-muted-foreground mt-1">
            Help us maintain a safe workplace by reporting concerns or sharing suggestions
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Feedback Type */}
          <div className="card-safety p-6 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <Label className="text-foreground font-medium mb-4 block">
              What type of feedback would you like to submit?
            </Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
              className="grid sm:grid-cols-2 gap-3"
            >
              {feedbackTypes.map((type) => (
                <div
                  key={type.id}
                  className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                    formData.type === type.id
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50"
                  }`}
                  onClick={() => setFormData({ ...formData, type: type.id })}
                >
                  <RadioGroupItem value={type.id} id={type.id} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={type.id} className="flex items-center gap-2 cursor-pointer font-medium text-foreground">
                      <type.icon className={`h-4 w-4 ${
                        type.id === "safety-concern" || type.id === "incident" 
                          ? "text-destructive" 
                          : "text-accent"
                      }`} />
                      {type.label}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Subject */}
          <div className="card-safety p-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject" className="text-foreground font-medium">
                  Subject
                </Label>
                <Input
                  id="subject"
                  placeholder="Brief description of your feedback"
                  className="mt-2"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="location" className="text-foreground font-medium">
                  Location (if applicable)
                </Label>
                <Input
                  id="location"
                  placeholder="e.g., Loading Dock B, Warehouse Section 3"
                  className="mt-2"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-foreground font-medium">
                  Detailed Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Please provide as much detail as possible..."
                  className="mt-2 min-h-[150px]"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Anonymous Option */}
          <div className="card-safety p-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                id="anonymous"
                className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent"
                checked={formData.anonymous}
                onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
              />
              <div>
                <Label htmlFor="anonymous" className="font-medium text-foreground cursor-pointer">
                  Submit Anonymously
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Your identity will not be disclosed. Note: Anonymous reports may limit our ability to follow up.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="animate-fade-in" style={{ animationDelay: "400ms" }}>
            <Button
              type="submit"
              variant="safety"
              size="lg"
              className="w-full"
              disabled={isSubmitting || !formData.type || !formData.subject || !formData.description}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                  Submitting...
                </div>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Emergency Notice */}
        <div className="mt-8 card-safety p-6 border-l-4 border-l-destructive animate-fade-in" style={{ animationDelay: "500ms" }}>
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Emergency Situations
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            For immediate safety emergencies, please call <span className="font-semibold text-foreground">911</span> or your site's emergency number. This form is for non-emergency reporting only.
          </p>
        </div>
      </div>
    </Layout>
  );
}
