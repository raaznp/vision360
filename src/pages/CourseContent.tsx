import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2,
  AlertTriangle,
  Info,
  Download,
  PlayCircle,
  BookOpen
} from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const lessonContent = {
  title: "Emergency Response Protocols",
  lessonNumber: 7,
  totalLessons: 8,
  content: [
    {
      type: "intro",
      title: "Why Emergency Response Matters",
      text: "In warehouse and logistics environments, emergencies can occur without warning. Being prepared with proper response protocols can save lives and minimize injuries. This lesson covers essential emergency procedures for truck loading and unloading operations.",
    },
    {
      type: "section",
      title: "Types of Emergencies",
      items: [
        "Vehicle accidents or collisions",
        "Load shifts or falling cargo",
        "Fire or explosion hazards",
        "Chemical spills from damaged containers",
        "Medical emergencies (injuries, heat stress)",
        "Equipment malfunctions",
      ],
    },
    {
      type: "warning",
      title: "Critical Safety Protocol",
      text: "In ANY emergency, your first priority is personal safety. Never put yourself at risk to save cargo or equipment. Evacuate the area and alert others before attempting any response actions.",
    },
    {
      type: "section",
      title: "Immediate Response Steps",
      items: [
        "STOP all operations immediately",
        "ALERT others in the area - use horn, radio, or verbal warnings",
        "EVACUATE to the designated assembly point",
        "CALL emergency services (911) and notify supervisors",
        "SECURE the area - prevent others from entering",
        "ASSIST emergency responders with information about hazards",
      ],
    },
    {
      type: "info",
      title: "Emergency Contact Information",
      text: "Emergency: 911 | Site Security: Ext. 100 | Safety Manager: Ext. 205 | First Aid Station: Loading Bay A",
    },
    {
      type: "section",
      title: "Fire Emergency Procedures",
      items: [
        "Activate the nearest fire alarm pull station",
        "If safe to do so, use appropriate fire extinguisher (Class ABC for most warehouse fires)",
        "Never fight a fire that is larger than a small trash can",
        "Close doors behind you when evacuating to slow fire spread",
        "Report the fire location and any trapped personnel to emergency services",
      ],
    },
    {
      type: "section",
      title: "Medical Emergency Response",
      items: [
        "Do not move injured persons unless they are in immediate danger",
        "Call for trained first aid responders",
        "Apply pressure to wounds to control bleeding",
        "For heat-related illness, move to cool area and provide water if conscious",
        "Stay with the injured person until help arrives",
        "Document the incident for reporting purposes",
      ],
    },
  ],
};

export default function CourseContent() {
  const { courseId } = useParams();
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get("lesson") || "7";
  const [completed, setCompleted] = useState(false);

  const progress = (parseInt(lessonId) / lessonContent.totalLessons) * 100;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <Link 
            to={`/courses/${courseId}`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Course
          </Link>
          <div className="text-sm text-muted-foreground">
            Lesson {lessonContent.lessonNumber} of {lessonContent.totalLessons}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Course Progress</span>
            <span className="font-medium text-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Lesson Title */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{lessonContent.title}</h1>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {lessonContent.content.map((section, index) => (
            <div
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${(index + 3) * 100}ms` }}
            >
              {section.type === "intro" && (
                <div className="card-safety p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-3">{section.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{section.text}</p>
                </div>
              )}

              {section.type === "section" && (
                <div className="card-safety p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-accent" />
                    {section.title}
                  </h2>
                  <ul className="space-y-3">
                    {section.items?.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground">
                        <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {section.type === "warning" && (
                <div className="card-safety p-6 border-l-4 border-l-destructive bg-destructive/5">
                  <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">{section.text}</p>
                </div>
              )}

              {section.type === "info" && (
                <div className="card-safety p-6 border-l-4 border-l-accent bg-accent/5">
                  <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Info className="h-5 w-5 text-accent" />
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground font-mono text-sm">{section.text}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Resources */}
        <div className="card-safety p-6 mt-8 animate-fade-in" style={{ animationDelay: "1000ms" }}>
          <h3 className="font-semibold text-foreground mb-4">Downloadable Resources</h3>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Emergency Checklist (PDF)
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Quick Reference Card
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border animate-fade-in" style={{ animationDelay: "1100ms" }}>
          <Link to={`/courses/${courseId}/content?lesson=6`}>
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous Lesson
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <Button
              variant={completed ? "success" : "secondary"}
              onClick={() => setCompleted(!completed)}
            >
              {completed ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Completed
                </>
              ) : (
                "Mark as Complete"
              )}
            </Button>
            <Link to={`/courses/${courseId}/quiz`}>
              <Button variant="safety">
                Next: Final Quiz
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
