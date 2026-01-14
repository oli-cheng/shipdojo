import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, 
  GitPullRequest, 
  Play, 
  FileCheck, 
  Gauge, 
  Lock,
  Workflow,
  FileText
} from "lucide-react";

const features = [
  {
    icon: GitPullRequest,
    title: "PR-Only Changes",
    description: "All modifications happen through pull requests. Never commit directly to main."
  },
  {
    icon: Shield,
    title: "Dojo Gate Approval",
    description: "Human-in-the-loop approval before any changes merge. Stay in control."
  },
  {
    icon: Lock,
    title: "Auth Hardening",
    description: "Automatic security checklist: rate limiting, input validation, and auth best practices."
  },
  {
    icon: Workflow,
    title: "CI/CD Pipeline",
    description: "Auto-generated GitHub Actions workflows for testing, building, and deploying."
  },
  {
    icon: FileCheck,
    title: "Migration Checks",
    description: "Database migration sanity checks to prevent data loss and breaking changes."
  },
  {
    icon: Play,
    title: "E2E Testing",
    description: "Optional Playwright smoke tests to verify your app works before shipping."
  },
  {
    icon: Gauge,
    title: "ShipDojo Score",
    description: "Get a production-readiness score based on checks passed and best practices."
  },
  {
    icon: FileText,
    title: "Detailed Reports",
    description: "Exportable reports documenting all changes, security improvements, and recommendations."
  }
];

export function Features() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/50 to-transparent" />
      
      <div className="container relative z-10 px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to{" "}
            <span className="gradient-text">ship with confidence</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            ShipDojo runs a comprehensive productionization pipeline on your AI-generated code
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              variant="interactive"
              className="group opacity-0 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
            >
              <CardContent className="p-6">
                <div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
