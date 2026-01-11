import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  TrendingUp,
  ChevronRight,
  Target,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeCourses, setActiveCourses] = useState<any[]>([]);
  const [stats, setStats] = useState({
    enrolled: 0,
    completed: 0,
    hours: 0,
    progress: 0
  });

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;

      try {
        // Fetch enrollments with course details
        const { data: enrollments, error } = await supabase
          .from("enrollments")
          .select(`
            *,
            courses (
              id,
              title,
              modules_count,
              duration
            )
          `)
          .eq("user_id", user.id);

        if (error) throw error;

        if (enrollments) {
          // Process stats
          const totalEnrolled = enrollments.length;
          const completed = enrollments.filter(e => e.status === "completed").length;
          const totalProgress = enrollments.reduce((acc, curr) => acc + (curr.progress || 0), 0);
          const avgProgress = totalEnrolled > 0 ? Math.round(totalProgress / totalEnrolled) : 0;

          // Calculate total hours
          const totalMinutes = enrollments.reduce((acc, curr) => {
            const duration = curr.courses.duration || "";
            let minutes = 0;
            if (duration.includes("hour")) {
               const hours = parseInt(duration.split(" ")[0]) || 0;
               minutes = hours * 60;
            } else if (duration.includes("min")) {
               minutes = parseInt(duration.split(" ")[0]) || 0;
            }
            // Only count if progress > 0 (approximation of time spent)
            // Or just sum total duration of enrolled courses? Let's sum total duration of enrolled courses for "Planned Hours" 
            // but "Hours Trained" implies time spent.
            // Let's approximate: (progress / 100) * total_duration
            return acc + (minutes * ((curr.progress || 0) / 100));
          }, 0);

          setStats({
            enrolled: totalEnrolled,
            completed: completed,
            hours: Math.round(totalMinutes / 60), 
            progress: avgProgress
          });

          // Set active courses
          const active = enrollments
            .filter(e => e.status === "in-progress")
            .map(e => ({
              id: e.courses.id,
              title: e.courses.title,
              progress: e.progress,
              lessons: { completed: Math.round((e.progress / 100) * e.courses.modules_count), total: e.courses.modules_count }, // Approx calculation
              dueDate: "Dec 30, 2025" // Placeholder
            }));
          setActiveCourses(active);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

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
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
          <p className="text-muted-foreground mt-1">Continue your safety training journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card-safety p-5 animate-fade-in">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Courses Enrolled</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stats.enrolled}</p>
              </div>
              <div className="p-2 rounded-lg bg-secondary text-accent">
                <BookOpen className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="card-safety p-5 animate-fade-in" style={{ animationDelay: "100ms" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stats.completed}</p>
              </div>
              <div className="p-2 rounded-lg bg-secondary text-success">
                <Trophy className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="card-safety p-5 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hours Trained</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stats.hours}</p>
              </div>
              <div className="p-2 rounded-lg bg-secondary text-primary">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="card-safety p-5 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stats.progress}%</p>
              </div>
              <div className="p-2 rounded-lg bg-secondary text-accent">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Courses */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Active Courses</h2>
              <Link to="/courses">
                <Button variant="ghost" size="sm" className="text-accent">
                  View All <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>

            {activeCourses.length > 0 ? (
              activeCourses.map((course, index) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="block card-safety p-5 animate-fade-in group"
                  style={{ animationDelay: `${(index + 4) * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          {course.lessons.completed}/{course.lessons.total} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Due: {course.dueDate}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-accent">{course.progress}%</span>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors" />
                    </div>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </Link>
              ))
            ) : (
              <div className="card-safety p-8 text-center">
                <p className="text-muted-foreground">You are not enrolled in any courses yet.</p>
                <Link to="/courses">
                  <Button variant="link" className="text-accent mt-2">Browse Courses</Button>
                </Link>
              </div>
            )}

            {/* Quick Actions */}
            <div className="card-safety p-5 mt-6 animate-fade-in" style={{ animationDelay: "600ms" }}>
              <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <Link to="/courses">
                  <Button variant="safety" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Continue Learning
                  </Button>
                </Link>
                <Link to="/feedback">
                  <Button variant="outline" className="w-full justify-start">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Report Safety Concern
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
            <div className="card-safety p-5 animate-fade-in" style={{ animationDelay: "700ms" }}>
              <div className="space-y-4">
                 <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-1 rounded-full bg-accent/10">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">Logged in successfully</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {user?.last_sign_in_at 
                          ? new Date(user.last_sign_in_at).toLocaleString([], { 
                              weekday: 'short', 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            }) 
                          : "Just now"}
                      </p>
                    </div>
                  </div>
              </div>
            </div>

            {/* Safety Tip */}
            <div className="card-safety p-5 border-l-4 border-l-accent animate-fade-in" style={{ animationDelay: "800ms" }}>
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-accent" />
                Safety Tip of the Day
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Always inspect your PPE before starting work. Check for any damage, wear, or contamination that could compromise your safety.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
