import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2,
  XCircle,
  Award,
  RefreshCw,
  AlertCircle,
  Download
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

import { jsPDF } from "jspdf";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const quizQuestions = [
  {
    id: 1,
    question: "What is the FIRST priority in any emergency situation?",
    options: [
      { id: "a", text: "Secure the cargo" },
      { id: "b", text: "Personal safety and evacuation" },
      { id: "c", text: "Notify management" },
      { id: "d", text: "Document the incident" },
    ],
    correct: "b",
  },
  {
    id: 2,
    question: "Before loading or unloading a truck, you should always:",
    options: [
      { id: "a", text: "Start immediately to save time" },
      { id: "b", text: "Wait for supervisor approval only" },
      { id: "c", text: "Perform a pre-operation safety inspection" },
      { id: "d", text: "Check the weather forecast" },
    ],
    correct: "c",
  },
  {
    id: 3,
    question: "Which PPE is mandatory for all loading dock operations?",
    options: [
      { id: "a", text: "Hard hat only" },
      { id: "b", text: "Safety glasses only" },
      { id: "c", text: "High-visibility vest, safety shoes, and gloves" },
      { id: "d", text: "Ear protection only" },
    ],
    correct: "c",
  },
  {
    id: 4,
    question: "True or False: It is acceptable to stand under a suspended load if you're watching carefully.",
    options: [
      { id: "a", text: "True - if you maintain visual contact" },
      { id: "b", text: "False - never stand under suspended loads" },
      { id: "c", text: "True - if the load is secured" },
      { id: "d", text: "Depends on the weight of the load" },
    ],
    correct: "b",
  },
  {
    id: 5,
    question: "What should you do if you discover damaged cargo that may contain hazardous materials?",
    options: [
      { id: "a", text: "Continue working but report it at the end of shift" },
      { id: "b", text: "Clean it up immediately" },
      { id: "c", text: "Stop work, evacuate the area, and report immediately" },
      { id: "d", text: "Take photos for documentation only" },
    ],
    correct: "c",
  },
];

const PASS_THRESHOLD = 80;

export default function Quiz() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft] = useState("40:00");
  const [courseTitle, setCourseTitle] = useState("");
  const [userName, setUserName] = useState("");

  const [dbScore, setDbScore] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (courseId) {
        const { data } = await supabase.from("courses").select("title").eq("id", courseId).single();
        if (data) setCourseTitle(data.title);
      }
      if (user) {
        // Try profile first, then metadata
        const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
        if (profile?.full_name) {
          setUserName(profile.full_name);
        } else {
           setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || "Student");
        }

        if (courseId) {
          const { data: enrollment } = await supabase
            .from("enrollments")
            .select("quiz_score")
            .eq("user_id", user.id)
            .eq("course_id", courseId)
            .single();
          
          if (enrollment?.quiz_score !== null && enrollment?.quiz_score !== undefined) {
             setDbScore(enrollment.quiz_score);
             setShowResults(true);
          }
        }
      }
    }
    fetchData();
  }, [courseId, user]);

  const handleAnswer = (questionId: number, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };


  const calculateScore = () => {
    let correct = 0;
    quizQuestions.forEach((q) => {
      if (answers[q.id] === q.correct) correct++;
    });
    return Math.round((correct / quizQuestions.length) * 100);
  };

  const handleSubmit = async () => {
    const finalScore = calculateScore();
    setDbScore(finalScore);
    setShowResults(true);

    if (user && courseId) {
       const { error } = await supabase
        .from("enrollments")
        .update({ quiz_score: finalScore })
        .eq("user_id", user.id)
        .eq("course_id", courseId);
        
       if (error) {
         console.error("Error saving quiz score:", error);
         toast({
           variant: "destructive",
           title: "Error saving progress",
           description: "Could not save your exam score. Please check your connection."
         });
       } else {
         toast({
           title: "Assessment Completed",
           description: "Your results have been saved successfully."
         });
       }
    }
  };

  const score = dbScore !== null ? dbScore : calculateScore();
  const passed = score >= PASS_THRESHOLD;

  const generateCertificate = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4"
    });

    // Brand Colors
    const primaryColor = "#F97316"; // Brand orange
    const secondaryColor = "#111827"; // Dark gray

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
    doc.line(70, 108, 227, 108); // Underline name

    // Course Info
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("has successfully completed the course", 148.5, 125, { align: "center" });

    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(courseTitle, 148.5, 140, { align: "center" });

    // Date & Signature Aligned
    const today = new Date().toLocaleDateString();
    const lineY = 175;
    
    // Left: Date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(today, 80, lineY - 5, { align: "center" }); // Date Value above line
    doc.line(50, lineY, 110, lineY); // Line
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Date", 80, lineY + 5, { align: "center" }); // Label below

    // Right: Signature
    doc.setFont("times", "italic");
    doc.setFontSize(14);
    doc.setTextColor(secondaryColor);
    doc.text("Vision 360 Team", 220, lineY - 5, { align: "center" }); // Signature above
    doc.setLineWidth(0.5);
    doc.setDrawColor(0); // Black line
    doc.line(180, lineY, 260, lineY); // Line
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Instructor / Administrator", 220, lineY + 5, { align: "center" }); // Label below

    // Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Certificate ID: " + Math.random().toString(36).substr(2, 9).toUpperCase(), 148.5, 195, { align: "center" });

    doc.save("vision360-certificate.pdf");
  };

  if (showResults) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="card-safety p-8 text-center animate-scale-in">
            {passed ? (
              <>
                <div className="w-20 h-20 mx-auto rounded-full gradient-accent flex items-center justify-center mb-6">
                  <Award className="h-10 w-10 text-accent-foreground" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Congratulations!</h1>
                <p className="text-muted-foreground mb-6">
                  You have successfully completed the safety assessment.
                </p>
                <Button onClick={generateCertificate} className="mb-6 w-full sm:w-auto" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Certificate
                </Button>
              </>
            ) : (
              <>
                <div className="w-20 h-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center mb-6">
                  <XCircle className="h-10 w-10 text-destructive" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Assessment Not Passed</h1>
                <p className="text-muted-foreground mb-6">
                  You need {PASS_THRESHOLD}% to pass. Please review the course material and try again.
                </p>
              </>
            )}

            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-border mb-6">
              <div className="text-center">
                <div className={`text-4xl font-bold ${passed ? "text-success" : "text-destructive"}`}>
                  {score}%
                </div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              {passed ? (
                <>
                  <Button variant="outline" onClick={() => navigate(`/courses/${courseId}`)}>
                    Back to Course
                  </Button>
                  <Button variant="safety" onClick={() => navigate("/dashboard")}>
                    Return to Dashboard
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => navigate(`/courses/${courseId}`)}>
                    Review Course
                  </Button>
                  <Button 
                    variant="safety" 
                    onClick={() => {
                      setShowResults(false);
                      setCurrentQuestion(0);
                      setAnswers({});
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry Assessment
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Results Breakdown */}
          <div className="card-safety p-6 mt-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <h3 className="font-semibold text-foreground mb-4">Answer Review</h3>
            <div className="space-y-3">
              {quizQuestions.map((q, index) => {
                const isCorrect = answers[q.id] === q.correct;
                return (
                  <div key={q.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">Question {index + 1}</span>
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                      <span className={`text-sm font-medium ${isCorrect ? "text-success" : "text-destructive"}`}>
                        {isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <Link 
            to={`/courses/${courseId}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Exit Quiz
          </Link>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="font-mono">{timeLeft}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Question {currentQuestion + 1} of {quizQuestions.length}</span>
            <span className="font-medium text-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <div className="card-safety p-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <h2 className="text-xl font-semibold text-foreground mb-6">{question.question}</h2>

          <RadioGroup
            value={answers[question.id] || ""}
            onValueChange={(value) => handleAnswer(question.id, value)}
            className="space-y-3"
          >
            {question.options.map((option) => (
              <div
                key={option.id}
                className={`flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer ${
                  answers[question.id] === option.id
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/50 hover:bg-secondary/50"
                }`}
                onClick={() => handleAnswer(question.id, option.id)}
              >
                <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                <Label 
                  htmlFor={`option-${option.id}`} 
                  className="flex-1 cursor-pointer text-foreground"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Question Navigation */}
        <div className="flex flex-wrap gap-2 mt-6 justify-center animate-fade-in" style={{ animationDelay: "300ms" }}>
          {quizQuestions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                index === currentQuestion
                  ? "gradient-accent text-accent-foreground"
                  : answers[quizQuestions[index].id]
                  ? "bg-success/10 text-success border border-success/20"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentQuestion === quizQuestions.length - 1 ? (
            <Button
              variant="safety"
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < quizQuestions.length}
            >
              Submit Assessment
            </Button>
          ) : (
            <Button variant="safety" onClick={handleNext}>
              Next Question
            </Button>
          )}
        </div>

        {/* Warning */}
        {Object.keys(answers).length < quizQuestions.length && currentQuestion === quizQuestions.length - 1 && (
          <div className="mt-4 p-4 rounded-lg bg-warning/10 border border-warning/20 flex items-center gap-3 animate-fade-in">
            <AlertCircle className="h-5 w-5 text-warning flex-shrink-0" />
            <p className="text-sm text-warning-foreground">
              Please answer all questions before submitting.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
