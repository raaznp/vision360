import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Clock, Users, CheckCircle2, PlayCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const statusColors: any = {
  "not-started": { bg: "bg-secondary", text: "text-secondary-foreground", label: "Not Started" },
  "in-progress": { bg: "bg-accent/10", text: "text-accent", label: "In Progress" },
  "completed": { bg: "bg-success/10", text: "text-success", label: "Completed" },
};

export default function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCoursesAndEnrollments() {
      try {
        setLoading(true);
        // Fetch all courses with enrollment count
        const { data: coursesData, error: coursesError } = await supabase
          .from("courses")
          .select("*, enrollments(count)");
        
        if (coursesError) throw coursesError;

        let enrichedCourses = coursesData?.map(course => ({
           ...course,
           status: "not-started",
           progress: 0,
           enrolled: course.enrollments ? course.enrollments[0].count : 0
        })) || [];

        // If user is logged in, fetch their enrollments to update status
        if (user) {
          const { data: enrollments, error: enrollError } = await supabase
            .from("enrollments")
            .select("course_id, status, progress")
            .eq("user_id", user.id);

          if (!enrollError && enrollments) {
            enrichedCourses = enrichedCourses.map(course => {
              const enrollment = enrollments.find(e => e.course_id === course.id);
              if (enrollment) {
                return { 
                  ...course, 
                  status: enrollment.status, 
                  progress: enrollment.progress 
                };
              }
              return course;
            });
          }
        }

        setCourses(enrichedCourses);
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCoursesAndEnrollments();
  }, [user]);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterStatus || course.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">Safety Training Courses</h1>
          <p className="text-muted-foreground mt-1">Browse and enroll in available safety training programs</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === null ? "safety" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(null)}
            >
              All
            </Button>
            <Button
              variant={filterStatus === "in-progress" ? "safety" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("in-progress")}
            >
              In Progress
            </Button>
            <Button
              variant={filterStatus === "completed" ? "safety" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("completed")}
            >
              Completed
            </Button>
            <Button
              variant={filterStatus === "not-started" ? "safety" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("not-started")}
            >
              Not Started
            </Button>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="card-safety overflow-hidden group animate-fade-in"
              style={{ animationDelay: `${(index + 2) * 100}ms` }}
            >
              {/* Course Image/Icon Header */}
              <div className="h-32 gradient-primary flex items-center justify-center">
                <span className="text-5xl">{course.image_emoji || "📚"}</span>
              </div>

              <div className="p-5">
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {course.category || "General"}
                  </Badge>
                  <Badge className={`${statusColors[course.status]?.bg || statusColors["not-started"].bg} ${statusColors[course.status]?.text || statusColors["not-started"].text} border-0`}>
                    {statusColors[course.status]?.label || "Not Started"}
                  </Badge>
                </div>

                {/* Title & Description */}
                <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {course.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {course.enrolled || 0}
                  </span>
                </div>

                {/* Progress */}
                {course.status !== "not-started" && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                )}

                {/* Action Button */}
                {course.status !== "completed" && (
                  <div className="mt-4">
                    <Button 
                      variant={course.status === "in-progress" ? "safety" : "safety"} 
                      className="w-full"
                    >
                      {course.status === "in-progress" ? (
                        <>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Continue
                        </>
                      ) : (
                        <>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Start Course
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No courses found matching your criteria.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
