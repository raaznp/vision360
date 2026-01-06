import { Link, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Target, 
  CheckCircle2,
  PlayCircle,
  FileText,
  Lock,
  Award
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const courseData = {
  "truck-loading": {
    title: "Truck Loading and Unloading Safety",
    description: "This comprehensive course covers all aspects of safe truck loading and unloading procedures in warehouse and logistics environments. You'll learn proper techniques, hazard identification, and emergency procedures to ensure workplace safety.",
    duration: "4 hours",
    modules: 8,
    enrolled: 245,
    progress: 75,
    objectives: [
      "Understand proper PPE requirements for loading operations",
      "Identify and mitigate common loading hazards",
      "Apply safe loading and unloading techniques",
      "Respond appropriately to emergency situations",
      "Comply with OSHA and industry regulations",
    ],
    prerequisites: [
      "Basic safety orientation completed",
      "Valid employee ID and department assignment",
    ],
    lessons: [
      { id: 1, title: "Introduction to Loading Safety", duration: "20 min", status: "completed" },
      { id: 2, title: "Personal Protective Equipment (PPE)", duration: "30 min", status: "completed" },
      { id: 3, title: "Pre-Operation Inspection", duration: "25 min", status: "completed" },
      { id: 4, title: "Safe Loading Procedures", duration: "35 min", status: "completed" },
      { id: 5, title: "Safe Unloading Procedures", duration: "35 min", status: "completed" },
      { id: 6, title: "Hazard Identification", duration: "30 min", status: "completed" },
      { id: 7, title: "Emergency Response Protocols", duration: "25 min", status: "in-progress" },
      { id: 8, title: "Final Assessment", duration: "40 min", status: "locked" },
    ],
  },
};

export default function CourseDetail() {
  const { courseId } = useParams();
  const course = courseData["truck-loading"]; // Default to truck-loading for demo

  const completedLessons = course.lessons.filter(l => l.status === "completed").length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/courses" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 animate-fade-in">
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Link>

        {/* Course Header */}
        <div className="card-safety overflow-hidden mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="gradient-hero p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Badge variant="secondary" className="mb-3 bg-sidebar-accent text-sidebar-foreground">
                  Logistics Safety
                </Badge>
                <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground">{course.title}</h1>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-primary-foreground/80 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    {course.modules} modules
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {course.enrolled} enrolled
                  </span>
                </div>
              </div>
              <div className="text-center md:text-right">
                <div className="text-4xl font-bold text-accent">{course.progress}%</div>
                <div className="text-sm text-primary-foreground/80">Complete</div>
              </div>
            </div>
            <Progress value={course.progress} className="mt-6 h-3 bg-sidebar-accent" />
          </div>

          <div className="p-6">
            <p className="text-muted-foreground">{course.description}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Lessons List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Course Content</h2>
            
            <div className="space-y-3">
              {course.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className={`card-safety p-4 animate-fade-in ${
                    lesson.status === "locked" ? "opacity-60" : ""
                  }`}
                  style={{ animationDelay: `${(index + 2) * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      lesson.status === "completed" 
                        ? "bg-success/10 text-success" 
                        : lesson.status === "in-progress"
                        ? "bg-accent/10 text-accent"
                        : "bg-secondary text-muted-foreground"
                    }`}>
                      {lesson.status === "completed" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : lesson.status === "locked" ? (
                        <Lock className="h-5 w-5" />
                      ) : (
                        <span className="font-semibold">{lesson.id}</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground">{lesson.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {lesson.duration}
                      </p>
                    </div>

                    {lesson.status !== "locked" && (
                      <Link to={`/courses/${courseId}/content?lesson=${lesson.id}`}>
                        <Button 
                          variant={lesson.status === "completed" ? "outline" : "safety"}
                          size="sm"
                        >
                          {lesson.status === "completed" ? "Review" : "Continue"}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Final Exam Button */}
            <div className="card-safety p-6 border-2 border-accent/20 animate-fade-in" style={{ animationDelay: "1000ms" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center">
                    <Award className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Final Safety Assessment</h3>
                    <p className="text-sm text-muted-foreground">Complete all lessons to unlock</p>
                  </div>
                </div>
                <Link to={`/courses/${courseId}/quiz`}>
                  <Button variant="safety" disabled={completedLessons < course.lessons.length - 1}>
                    Take Exam
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Learning Objectives */}
            <div className="card-safety p-5 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Target className="h-4 w-4 text-accent" />
                Learning Objectives
              </h3>
              <ul className="space-y-3">
                {course.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                    {objective}
                  </li>
                ))}
              </ul>
            </div>

            {/* Prerequisites */}
            <div className="card-safety p-5 animate-fade-in" style={{ animationDelay: "500ms" }}>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-accent" />
                Prerequisites
              </h3>
              <ul className="space-y-2">
                {course.prerequisites.map((prereq, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-accent">•</span>
                    {prereq}
                  </li>
                ))}
              </ul>
            </div>

            {/* Progress Summary */}
            <div className="card-safety p-5 animate-fade-in" style={{ animationDelay: "600ms" }}>
              <h3 className="font-semibold text-foreground mb-4">Your Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Lessons Completed</span>
                  <span className="font-medium text-foreground">{completedLessons}/{course.lessons.length}</span>
                </div>
                <Progress value={(completedLessons / course.lessons.length) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Complete all lessons to access the final assessment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
