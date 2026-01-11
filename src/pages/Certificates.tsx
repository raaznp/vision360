
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Award, Download, Calendar, ExternalLink } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { jsPDF } from "jspdf";

export default function Certificates() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCertificates() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("enrollments")
          .select(`
            *,
            course:courses(*)
          `)
          .eq("user_id", user.id)
          .gte("quiz_score", 80); // Only passed courses

        if (error) throw error;
        setCertificates(data || []);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCertificates();
  }, [user]);

  const generateCertificate = (courseTitle: string, userName: string) => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4"
    });

    // Brand Colors
    const primaryColor = "#F97316"; 
    const secondaryColor = "#111827"; 

    // Background Border
    doc.setLineWidth(2);
    doc.setDrawColor(primaryColor);
    doc.rect(10, 10, 277, 190);
    
    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(40);
    doc.setTextColor(secondaryColor);
    doc.text("CERTIFICATE", 148.5, 50, { align: "center" });
    
    doc.setFontSize(20);
    doc.setFont("helvetica", "normal");
    doc.text("OF COMPLETION", 148.5, 60, { align: "center" });

    // Logo / Brand Name
    doc.setFontSize(16);
    doc.setTextColor(primaryColor);
    doc.text("VISION 360 SAFETY TRAINING", 148.5, 30, { align: "center" });

    // Recipient
    doc.setTextColor(secondaryColor);
    doc.setFontSize(14);
    doc.text("This certifies that", 148.5, 85, { align: "center" });

    doc.setFontSize(32);
    doc.setFont("helvetica", "bold");
    doc.text(userName, 148.5, 105, { align: "center" });
    doc.setLineWidth(0.5);
    doc.line(70, 108, 227, 108);

    // Course Info
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("has successfully completed the course", 148.5, 125, { align: "center" });

    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(courseTitle, 148.5, 140, { align: "center" });

    // Date & Signature
    const today = new Date().toLocaleDateString();
    const lineY = 175;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(today, 80, lineY - 5, { align: "center" }); 
    doc.line(50, lineY, 110, lineY); 
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Date", 80, lineY + 5, { align: "center" }); 

    doc.setFont("times", "italic");
    doc.setFontSize(14);
    doc.setTextColor(secondaryColor);
    doc.text("Vision 360 Team", 220, lineY - 5, { align: "center" });
    doc.setLineWidth(0.5);
    doc.setDrawColor(0); 
    doc.line(180, lineY, 260, lineY); 
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Instructor / Administrator", 220, lineY + 5, { align: "center" }); 

    // Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Certificate ID: " + Math.random().toString(36).substr(2, 9).toUpperCase(), 148.5, 195, { align: "center" });

    doc.save(`certificate-${courseTitle.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  const handleDownload = async (certificate: any) => {
    let userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Student";
    
    // Fetch latest profile name if available
    const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user!.id).single();
    if (profile?.full_name) userName = profile.full_name;

    generateCertificate(certificate.course.title, userName);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-2">My Certificates</h1>
        <p className="text-muted-foreground mb-8">View and download certificates for your completed courses.</p>

        {certificates.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-lg border border-border">
            <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center mb-4">
              <Award className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No certificates yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Complete the final assessment of a course with a score of 80% or higher to earn a certificate.
            </p>
            <Link to="/courses">
              <Button variant="safety">Browse Courses</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div key={cert.id} className="card-safety p-6 flex flex-col animate-fade-in">
                <div className="flex-1">
                  <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{cert.course.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Calendar className="h-4 w-4" />
                    <span>Completed on {new Date().toLocaleDateString()}</span> 
                    {/* Note: In a real app we'd save 'completed_at' date. Using current date for now or we could use updated_at if available */}
                  </div>
                  <div className="flex items-center justify-between text-sm mb-4 bg-secondary/50 p-2 rounded">
                    <span className="text-muted-foreground">Score</span>
                    <span className="font-bold text-success">{cert.quiz_score}%</span>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleDownload(cert)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Link to={`/courses/${cert.course_id}`}>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
