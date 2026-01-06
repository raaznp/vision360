import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Clock, Users, CheckCircle2, PlayCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const courses = [
  {
    id: "truck-loading",
    title: "Truck Loading and Unloading Safety",
    description: "Comprehensive training on safe procedures for loading and unloading trucks in warehouse environments.",
    duration: "4 hours",
    modules: 8,
    enrolled: 245,
    progress: 75,
    status: "in-progress" as const,
    category: "Logistics",
    image: "🚛",
  },
  {
    id: "forklift-ops",
    title: "Forklift Operations & Safety",
    description: "Learn safe forklift operation techniques, maintenance checks, and hazard awareness.",
    duration: "3 hours",
    modules: 6,
    enrolled: 312,
    progress: 30,
    status: "in-progress" as const,
    category: "Equipment",
    image: "🏗️",
  },
  {
    id: "ppe-fundamentals",
    title: "PPE Fundamentals",
    description: "Essential training on selecting, using, and maintaining personal protective equipment.",
    duration: "2 hours",
    modules: 5,
    enrolled: 520,
    progress: 100,
    status: "completed" as const,
    category: "Safety Basics",
    image: "🦺",
  },
  {
    id: "hazmat-handling",
    title: "Hazardous Materials Handling",
    description: "Safe handling, storage, and transportation of hazardous materials in the workplace.",
    duration: "5 hours",
    modules: 10,
    enrolled: 189,
    progress: 100,
    status: "completed" as const,
    category: "Compliance",
    image: "☢️",
  },
  {
    id: "emergency-response",
    title: "Emergency Response Procedures",
    description: "Training on emergency protocols, evacuation procedures, and first response actions.",
    duration: "3 hours",
    modules: 7,
    enrolled: 402,
    progress: 0,
    status: "not-started" as const,
    category: "Emergency",
    image: "🚨",
  },
  {
    id: "ergonomics",
    title: "Workplace Ergonomics",
    description: "Prevent injuries through proper lifting techniques and ergonomic workstation setup.",
    duration: "2 hours",
    modules: 4,
    enrolled: 278,
    progress: 0,
    status: "not-started" as const,
    category: "Health",
    image: "💪",
  },
];

const statusColors = {
  "not-started": { bg: "bg-secondary", text: "text-secondary-foreground", label: "Not Started" },
  "in-progress": { bg: "bg-accent/10", text: "text-accent", label: "In Progress" },
  "completed": { bg: "bg-success/10", text: "text-success", label: "Completed" },
};

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !filterStatus || course.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
                <span className="text-5xl">{course.image}</span>
              </div>

              <div className="p-5">
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {course.category}
                  </Badge>
                  <Badge className={`${statusColors[course.status].bg} ${statusColors[course.status].text} border-0`}>
                    {statusColors[course.status].label}
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
                    {course.enrolled}
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
                <div className="mt-4">
                  <Button 
                    variant={course.status === "completed" ? "outline" : "safety"} 
                    className="w-full"
                  >
                    {course.status === "completed" ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Review Course
                      </>
                    ) : course.status === "in-progress" ? (
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
