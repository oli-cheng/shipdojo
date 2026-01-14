import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dumbbell, 
  ArrowRight, 
  Check,
  GitBranch,
  Settings,
  Play,
  Sparkles,
  Github
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createDemoRepo, saveDemoRepos, getDemoRepos, getDemoChecks, saveDemoChecks, DojoCheck } from "@/lib/demo-data";
import { Switch } from "@/components/ui/switch";

const steps = [
  { id: 1, title: 'Welcome', icon: Dumbbell },
  { id: 2, title: 'Connect Repo', icon: GitBranch },
  { id: 3, title: 'Configure Checks', icon: Settings },
  { id: 4, title: 'Start Run', icon: Play },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [checks, setChecks] = useState<DojoCheck[]>(getDemoChecks());
  
  const org = JSON.parse(localStorage.getItem('shipdojo_org') || '{}');
  
  const handleCreateDemoRepo = () => {
    const repos = getDemoRepos();
    if (repos.length === 0) {
      const newRepo = createDemoRepo(org.id);
      saveDemoRepos([newRepo]);
    }
    setCurrentStep(3);
  };
  
  const handleToggleCheck = (checkId: string) => {
    const updatedChecks = checks.map(check => {
      if (check.id === checkId && !check.required) {
        return { ...check, enabled: !check.enabled };
      }
      return check;
    });
    setChecks(updatedChecks);
    saveDemoChecks(updatedChecks);
  };
  
  const handleFinish = () => {
    navigate('/repos');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Progress */}
      <div className="w-64 border-r border-border p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <div className="p-2 rounded-lg bg-primary/10">
            <Dumbbell className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg">ShipDojo</span>
        </div>
        
        <nav className="space-y-2">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            
            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isCurrent ? 'bg-primary/10 text-primary' :
                  isCompleted ? 'text-success' : 'text-muted-foreground'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  isCompleted ? 'bg-success border-success' :
                  isCurrent ? 'border-primary' : 'border-border'
                }`}>
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-success-foreground" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                </div>
                <span className="font-medium">{step.title}</span>
              </div>
            );
          })}
        </nav>
        
        <div className="mt-auto">
          <Badge variant="info" className="w-full justify-center">
            <Sparkles className="w-3 h-3 mr-1" />
            Demo Mode
          </Badge>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="max-w-xl w-full">
          {/* Step 1: Welcome */}
          {currentStep === 1 && (
            <Card variant="glass" className="animate-fade-in">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
                  <Dumbbell className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">Welcome to ShipDojo!</CardTitle>
                <CardDescription className="text-base">
                  Let's get you set up to productionize your first AI-generated repository.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  In the next few steps, you'll connect a repository, configure your 
                  productionization checks, and start your first Dojo run.
                </p>
                <Button variant="hero" onClick={() => setCurrentStep(2)}>
                  Let's Go
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}
          
          {/* Step 2: Connect Repo */}
          {currentStep === 2 && (
            <Card variant="glass" className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-2xl">Connect a Repository</CardTitle>
                <CardDescription>
                  Choose how to connect your first repository
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-auto p-4"
                  disabled
                >
                  <Github className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Connect GitHub</p>
                    <p className="text-xs text-muted-foreground">Link a real GitHub repository</p>
                  </div>
                  <Badge variant="secondary" className="ml-auto">Coming Soon</Badge>
                </Button>
                
                <Button 
                  variant="hero" 
                  className="w-full justify-start h-auto p-4"
                  onClick={handleCreateDemoRepo}
                >
                  <Sparkles className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Create Demo Repo</p>
                    <p className="text-xs text-primary-foreground/70">Try with a simulated vibecoded app</p>
                  </div>
                </Button>
              </CardContent>
            </Card>
          )}
          
          {/* Step 3: Configure Checks */}
          {currentStep === 3 && (
            <Card variant="glass" className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-2xl">Configure Dojo Checks</CardTitle>
                <CardDescription>
                  Choose which productionization checks to run
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {checks.slice(0, 6).map((check) => (
                  <div 
                    key={check.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{check.name}</p>
                      <p className="text-xs text-muted-foreground">{check.description}</p>
                    </div>
                    <Switch
                      checked={check.enabled}
                      onCheckedChange={() => handleToggleCheck(check.id)}
                      disabled={check.required}
                    />
                  </div>
                ))}
                
                <p className="text-xs text-muted-foreground text-center pt-2">
                  You can adjust more checks later in Settings
                </p>
                
                <Button 
                  variant="hero" 
                  className="w-full mt-4"
                  onClick={() => setCurrentStep(4)}
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}
          
          {/* Step 4: Start Run */}
          {currentStep === 4 && (
            <Card variant="glass" className="animate-fade-in">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                  <Play className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl">You're All Set!</CardTitle>
                <CardDescription className="text-base">
                  Your demo repository is ready to be productionized.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground mb-6">
                  Head to your repos to start your first Dojo run and see ShipDojo 
                  upgrade your vibecoded app to production-ready code.
                </p>
                <Button variant="hero" size="lg" onClick={handleFinish}>
                  <Play className="w-5 h-5 mr-2" />
                  Go to Repos
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
