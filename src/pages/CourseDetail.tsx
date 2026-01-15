import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Target, 
  CheckCircle2,
  FileText,
  Lock,
  Award
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export default function CourseDetail() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollment, setEnrollment] = useState<any>(null);

  const handleEnroll = async () => {
    if (!user || !courseId) return;
    
    // Calculate existing progress if any
    const completedCount = lessons.filter(l => l.status === "completed").length;
    const initialProgress = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;
    const initialStatus = initialProgress === 100 ? 'completed' : 'in-progress';

    try {
      const { data, error } = await supabase
        .from("enrollments")
        .insert({
          user_id: user.id,
          course_id: courseId,
          status: initialStatus,
          progress: initialProgress,
          enrolled_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      setEnrollment(data);
    } catch (error) {
      console.error("Error enrolling:", error);
    }
  };

  useEffect(() => {
    async function fetchCourseDetails() {
      if (!courseId) return;
      
      try {
        setLoading(true);
        // Fetch course details
        const { data: courseData, error: courseError } = await supabase
          .from("courses")
          .select("*")
          .eq("id", courseId)
          .single();
        
        if (courseError) throw courseError;
        setCourse(courseData);

        // Fetch lessons
        const { data: lessonsData, error: lessonsError } = await supabase
          .from("lessons")
          .select("*")
          .eq("course_id", courseId)
          .order("order_index", { ascending: true });
        
        if (lessonsError) throw lessonsError;

        // Fetch user enrollment and lesson progress
        if (user) {
          const { data: enrollmentData } = await supabase
            .from("enrollments")
            .select("*")
            .eq("user_id", user.id)
            .eq("course_id", courseId)
            .single();
          
          setEnrollment(enrollmentData);

          const { data: progressData } = await supabase
            .from("lesson_progress")
            .select("lesson_id, status")
            .eq("user_id", user.id);

           const enrichedLessons = lessonsData?.map((lesson, index) => {
             const progress = progressData?.find(p => p.lesson_id === lesson.id);
             // Logic for locking: if previous lesson not completed, lock this one (unless it's the first one)
             // Simple version: just check status
             let status = progress?.status || "locked";
             if (index === 0 && status === "locked") status = "not-started";
             
             // Unlock if previous is completed
             if (index > 0) {
               const prevLessonId = lessonsData[index - 1].id;
               const prevProgress = progressData?.find(p => p.lesson_id === prevLessonId);
               if (prevProgress?.status === "completed" && status === "locked") {
                 status = "not-started";
               }
             }

             return { ...lesson, status };
           });
           setLessons(enrichedLessons || []);

        } else {
           setLessons(lessonsData?.map(l => ({ ...l, status: "locked" })) || []);
        }

      } catch (error) {
        console.error("Error loading course details:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCourseDetails();
  }, [courseId, user]);

  if (loading) {
    return (
       <Layout>
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold">Course not found</h2>
          <Link to="/courses" className="text-accent hover:underline mt-4 inline-block">Back to Courses</Link>
        </div>
      </Layout>
    );
  }

  const completedLessons = lessons.filter(l => l.status === "completed").length;
  const progressPercentage = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;

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
                  {course.category || "General Safety"}
                </Badge>
                <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground">{course.title}</h1>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-primary-foreground/80 text-sm">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    {lessons.length} module{lessons.length !== 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {course.enrolled || 0} enrolled
                  </span>
                </div>
              </div>
              <div className="text-center md:text-right space-y-4">
                {enrollment ? (
                  <>
                    <div className="text-4xl font-bold text-accent">{Math.round(progressPercentage)}%</div>
                    <div className="text-sm text-primary-foreground/80">Complete</div>
                  </>
                ) : (
                  <Button size="lg" variant="safety" onClick={handleEnroll} disabled={loading}>
                    Enroll Now
                  </Button>
                )}
              </div>
            </div>
            {enrollment && <Progress value={progressPercentage} className="mt-6 h-3 bg-sidebar-accent" />}
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
              {lessons.map((lesson, index) => (
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
                        : lesson.status === "in-progress" || lesson.status === "not-started" // treat not-started as potentially active
                        ? "bg-accent/10 text-accent"
                        : "bg-secondary text-muted-foreground"
                    }`}>
                      {lesson.status === "completed" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : lesson.status === "locked" ? (
                        <Lock className="h-5 w-5" />
                      ) : (
                        <span className="font-semibold">{index + 1}</span>
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
                  {enrollment?.quiz_score >= 80 ? (
                    <div className="flex flex-col items-end gap-2">
                       <span className="text-success font-semibold flex items-center gap-1">
                         <CheckCircle2 className="h-4 w-4" />
                         Passed ({enrollment.quiz_score}%)
                       </span>
                       <Button variant="outline" className="text-success border-success hover:bg-success/10 hover:text-success">
                         View Certificate
                       </Button>
                    </div>
                  ) : (
                    <Button variant="safety" disabled={completedLessons < lessons.length}>
                      Take Exam
                    </Button>
                  )}
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
                 {/* Placeholder for objectives as they are not in schema yet properly without array support or jsonb, using static placeholder or check if course has description */}
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                    Complete all modules to ensure full understanding.
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                    Pass the final assessment with 80% or higher.
                  </li>
              </ul>
            </div>

            {/* Prerequisites */}
            <div className="card-safety p-5 animate-fade-in" style={{ animationDelay: "500ms" }}>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-accent" />
                Prerequisites
              </h3>
              <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-accent">•</span>
                    Active Employee Account
                  </li>
              </ul>
            </div>

            {/* Progress Summary */}
            <div className="card-safety p-5 animate-fade-in" style={{ animationDelay: "600ms" }}>
              <h3 className="font-semibold text-foreground mb-4">Your Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Lessons Completed</span>
                  <span className="font-medium text-foreground">{completedLessons}/{lessons.length}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
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
