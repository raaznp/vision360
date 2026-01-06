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

const stats = [
  { label: "Courses Enrolled", value: "4", icon: BookOpen, color: "text-accent" },
  { label: "Completed", value: "2", icon: Trophy, color: "text-success" },
  { label: "Hours Trained", value: "12.5", icon: Clock, color: "text-primary" },
  { label: "Overall Progress", value: "65%", icon: TrendingUp, color: "text-accent" },
];

const activeCourses = [
  {
    id: "truck-loading",
    title: "Truck Loading and Unloading Safety",
    progress: 75,
    lessons: { completed: 6, total: 8 },
    status: "in-progress",
    dueDate: "Dec 25, 2025",
  },
  {
    id: "forklift-ops",
    title: "Forklift Operations & Safety",
    progress: 30,
    lessons: { completed: 2, total: 6 },
    status: "in-progress",
    dueDate: "Jan 5, 2026",
  },
];

const recentActivity = [
  { action: "Completed lesson: PPE Requirements", time: "2 hours ago", type: "success" },
  { action: "Started: Hazard Identification Module", time: "1 day ago", type: "info" },
  { action: "Scored 92% on Safety Quiz", time: "2 days ago", type: "success" },
  { action: "Enrolled in Forklift Operations", time: "1 week ago", type: "info" },
];

export default function Dashboard() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">Welcome back, Subasana Karki</h1>
          <p className="text-muted-foreground mt-1">Continue your safety training journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="card-safety p-5 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg bg-secondary ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
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

            {activeCourses.map((course, index) => (
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
            ))}

            {/* Quick Actions */}
            <div className="card-safety p-5 mt-6 animate-fade-in" style={{ animationDelay: "600ms" }}>
              <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <Link to="/courses/truck-loading/content">
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
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`mt-0.5 p-1 rounded-full ${
                      activity.type === "success" ? "bg-success/10" : "bg-accent/10"
                    }`}>
                      <CheckCircle2 className={`h-4 w-4 ${
                        activity.type === "success" ? "text-success" : "text-accent"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
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
