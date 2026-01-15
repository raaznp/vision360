import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import ThreeSixtyViewer from "@/components/ThreeSixtyViewer";
import { tourConfigs } from "@/config/tourConfig";

export default function CourseContent() {
  const { courseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Lesson ID from URL or default to first
  const activeLessonId = searchParams.get("lesson") 
    ? parseInt(searchParams.get("lesson")!) 
    : lessons.length > 0 ? lessons[0].id : null;

  useEffect(() => {
    async function fetchContent() {
      if (!courseId || !user) return;

      try {
        setLoading(true);
        
        // Fetch course info
        const { data: courseData } = await supabase
          .from("courses")
          .select("id, title")
          .eq("id", courseId)
          .single();
        setCourse(courseData);

        // Fetch lessons
        const { data: lessonsData } = await supabase
          .from("lessons")
          .select("*")
          .eq("course_id", courseId)
          .order("order_index", { ascending: true });
        
        // Fetch progress
        const { data: progressData } = await supabase
          .from("lesson_progress")
          .select("lesson_id, status")
          .eq("user_id", user.id);

        if (lessonsData) {
          const enrichedLessons = lessonsData.map(lesson => {
            const progress = progressData?.find(p => p.lesson_id === lesson.id);
            return { 
              ...lesson, 
              status: progress?.status || "locked", // Default logic, refine as needed
              completed: progress?.status === "completed"
            };
          });
          setLessons(enrichedLessons);
        }
      } catch (error) {
        console.error("Error loading content:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [courseId, user]);

  useEffect(() => {
    if (activeLessonId && lessons.length > 0) {
      const found = lessons.find(l => l.id === activeLessonId);
      if (found) setCurrentLesson(found);
    }
  }, [activeLessonId, lessons]);

  const handleComplete = async () => {
    if (!user || !currentLesson) return;
    
    try {
      setUpdating(true);
      
      // Update lesson progress
      const { error } = await supabase
        .from("lesson_progress")
        .upsert({
          user_id: user.id,
          lesson_id: currentLesson.id,
          status: "completed",
          completed_at: new Date().toISOString()
        }, { onConflict: 'user_id, lesson_id' });

      if (error) throw error;

      // Update local state
      setLessons(prev => prev.map(l => 
        l.id === currentLesson.id ? { ...l, status: "completed", completed: true } : l
      ));

      // Update enrollment progress
      const completedCount = lessons.filter(l => l.completed || l.id === currentLesson.id).length;
      const progressPercent = Math.round((completedCount / lessons.length) * 100);
      
      await supabase
        .from("enrollments")
        .upsert({ 
          user_id: user.id, 
          course_id: courseId, 
          progress: progressPercent, 
          status: progressPercent === 100 ? 'completed' : 'in-progress' 
          // We don't set enrolled_at to avoid resetting it, but if it's new it might be null? 
          // Actually schema says enrolled_at has default now(). So if we omit it on insert, it works.
        }, { onConflict: 'user_id, course_id' });

      // Navigate to next lesson
      const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
      if (currentIndex < lessons.length - 1) {
        const nextLesson = lessons[currentIndex + 1];
        setSearchParams({ lesson: nextLesson.id.toString() });
      } else {
        navigate(`/courses/${courseId}`);
      }

    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !course) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  const currentIndex = lessons.findIndex(l => l.id === activeLessonId);
  const progress = (lessons.filter(l => l.completed).length / lessons.length) * 100;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="h-16 border-b flex items-center justify-between px-4 bg-card shrink-0">
        <div className="flex items-center gap-4">
          <Link to={`/courses/${courseId}`} className="text-muted-foreground hover:text-foreground">
             <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="h-6 w-px bg-border" />
          <h1 className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-md">
            {course.title}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end mr-4">
            <span className="text-xs text-muted-foreground mb-1">Course Progress</span>
            <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
               <div 
                 className="h-full bg-accent transition-all duration-500"
                 style={{ width: `${progress}%` }}
               />
            </div>
          </div>
          
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
               {/* Mobile Sidebar Content */}
               <div className="h-full flex flex-col bg-sidebar">
                  <div className="p-4 border-b border-sidebar-border">
                    <h2 className="font-semibold text-sidebar-foreground">Course Content</h2>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {lessons.map((lesson, idx) => (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          setSearchParams({ lesson: lesson.id.toString() });
                           setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                          activeLessonId === lesson.id
                            ? "bg-accent/10 text-accent"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                        }`}
                      >
                        <div className={`
                          w-6 h-6 rounded-full flex items-center justify-center text-xs border
                          ${lesson.completed 
                            ? "bg-success border-success text-success-foreground" 
                            : activeLessonId === lesson.id
                            ? "border-accent text-accent"
                            : "border-muted-foreground text-muted-foreground"}
                        `}>
                          {lesson.completed ? <CheckCircle2 className="h-3 w-3" /> : idx + 1}
                        </div>
                        <span className="text-sm font-medium line-clamp-2">{lesson.title}</span>
                      </button>
                    ))}
                  </div>
               </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-80 flex-col border-r bg-sidebar">
          <div className="p-4 border-b border-sidebar-border">
            <h2 className="font-semibold text-sidebar-foreground">Course Content</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
             {lessons.map((lesson, idx) => (
                <button
                  key={lesson.id}
                  onClick={() => setSearchParams({ lesson: lesson.id.toString() })}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    activeLessonId === lesson.id
                      ? "bg-accent/10 text-accent"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
                >
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs border shrink-0
                    ${lesson.completed 
                      ? "bg-success border-success text-success-foreground" 
                      : activeLessonId === lesson.id
                      ? "border-accent text-accent"
                      : "border-muted-foreground text-muted-foreground"}
                  `}>
                    {lesson.completed ? <CheckCircle2 className="h-3 w-3" /> : idx + 1}
                  </div>
                  <span className="text-sm font-medium line-clamp-2">{lesson.title}</span>
                </button>
              ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {currentLesson ? (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-4">{currentLesson.title}</h1>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Lesson {currentIndex + 1} of {lessons.length}</span>
                    <span>•</span>
                    <span>{currentLesson.duration}</span>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  {/* Content Placeholder - in real app would be HTML/Markdown from DB */}
                  
                  {tourConfigs[currentLesson.title] ? (
                      <div className="mb-8">
                        <ThreeSixtyViewer 
                            imageUrl={tourConfigs[currentLesson.title].imageUrl}
                            hotspots={tourConfigs[currentLesson.title].hotspots}
                        />
                        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg text-sm text-blue-200">
                            <h4 className="font-semibold mb-1 flex items-center gap-2">Interactive 360° Tour</h4>
                            <p>Click and drag to look around. Click on the red hotspots to learn about safety hazards and protocols in the warehouse.</p>
                        </div>
                      </div>
                  ) : (
                    <div className="p-8 bg-card rounded-xl border border-border min-h-[400px]">
                        <h3 className="text-xl font-semibold mb-4">Lesson Content</h3>
                        <p>{currentLesson.content || "Content coming soon..."}</p>
                        <p className="mt-4">
                        This is a placeholder for the lesson content. In a real application, 
                        this would be rich text, video, or interactive elements stored in the database.
                        </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-border">
                  <Button
                    variant="ghost"
                    disabled={currentIndex === 0}
                    onClick={() => {
                       const prev = lessons[currentIndex - 1];
                       if (prev) setSearchParams({ lesson: prev.id.toString() });
                    }}
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  <Button 
                    variant="safety"
                    size="lg" 
                    onClick={handleComplete}
                    disabled={updating}
                  >
                    {updating ? "Saving..." : currentIndex === lessons.length - 1 ? "Finish Course" : "Complete & Next"}
                    {!updating && <ChevronRight className="h-4 w-4 ml-2" />}
                  </Button>
                </div>
              </div>
            ) : (
                <div className="text-center py-12 text-muted-foreground">Select a lesson to begin</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
