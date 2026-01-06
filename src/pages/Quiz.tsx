import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2,
  XCircle,
  Award,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft] = useState("40:00");

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

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    quizQuestions.forEach((q) => {
      if (answers[q.id] === q.correct) correct++;
    });
    return Math.round((correct / quizQuestions.length) * 100);
  };

  const score = calculateScore();
  const passed = score >= PASS_THRESHOLD;

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
