import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Loader2,
  FileText,
  Play
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { 
  getDemoRepos, 
  getDemoRuns, 
  getDemoEvents, 
  saveDemoRuns,
  RUN_STEPS,
  DojoRun,
  DojoEvent
} from "@/lib/demo-data";
import { useState, useEffect, useCallback } from "react";
import { startRunSimulation, continueAfterApproval } from "@/lib/run-simulation";
import { cn } from "@/lib/utils";

export default function RunDetail() {
  const { runId } = useParams();
  const [repos] = useState(getDemoRepos());
  const [run, setRun] = useState<DojoRun | null>(null);
  const [events, setEvents] = useState<DojoEvent[]>([]);
  const [isApproving, setIsApproving] = useState(false);
  
  // Load initial data
  useEffect(() => {
    const runs = getDemoRuns();
    const currentRun = runs.find(r => r.id === runId);
    setRun(currentRun || null);
    setEvents(getDemoEvents().filter(e => e.run_id === runId));
  }, [runId]);
  
  // Handle run updates
  const handleRunUpdate = useCallback((updatedRun: DojoRun) => {
    setRun({ ...updatedRun });
  }, []);
  
  // Handle new events
  const handleNewEvent = useCallback((event: DojoEvent) => {
    setEvents(prev => [...prev, event]);
  }, []);
  
  // Start simulation when run is queued
  useEffect(() => {
    if (run?.status === 'queued' && runId) {
      startRunSimulation(runId, handleRunUpdate, handleNewEvent);
    }
  }, [run?.status, runId, handleRunUpdate, handleNewEvent]);
  
  // Poll for updates
  useEffect(() => {
    const interval = setInterval(() => {
      const runs = getDemoRuns();
      const currentRun = runs.find(r => r.id === runId);
      if (currentRun) {
        setRun(currentRun);
      }
      setEvents(getDemoEvents().filter(e => e.run_id === runId));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [runId]);
  
  const handleApprove = () => {
    if (!runId) return;
    setIsApproving(true);
    continueAfterApproval(runId, handleRunUpdate, handleNewEvent);
  };
  
  const repo = run ? repos.find(r => r.id === run.repo_id) : null;
  
  if (!run) {
    return (
      <AppLayout>
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Run not found</p>
          <Link to="/runs">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Runs
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const getStepStatus = (stepNumber: number) => {
    if (!run.current_step) return 'pending';
    if (stepNumber < run.current_step) return 'completed';
    if (stepNumber === run.current_step) {
      if (run.status === 'awaiting_approval' && stepNumber === 8) return 'awaiting';
      return 'running';
    }
    return 'pending';
  };

  return (
    <AppLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/runs">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{repo?.name || 'Unknown Repo'}</h1>
              <Badge variant={run.status as any}>
                {run.status.replace('_', ' ')}
              </Badge>
              {run.shipdojo_score && (
                <Badge variant="success" className="text-lg px-3">
                  Score: {run.shipdojo_score}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              Run #{run.id.split('-').pop()?.slice(-6)} · Started {new Date(run.created_at).toLocaleString()}
            </p>
          </div>
          
          {run.status === 'awaiting_approval' && (
            <Button 
              variant="hero" 
              onClick={handleApprove}
              disabled={isApproving}
            >
              {isApproving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve at Dojo Gate
                </>
              )}
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline */}
          <Card variant="glass" className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Run Timeline</CardTitle>
              <CardDescription>Step-by-step productionization progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {RUN_STEPS.map((step, index) => {
                  const status = getStepStatus(step.step);
                  const isLast = index === RUN_STEPS.length - 1;
                  
                  return (
                    <div key={step.step} className="flex gap-4 pb-6 last:pb-0">
                      {/* Step indicator */}
                      <div className="relative flex flex-col items-center">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all",
                          status === 'completed' && "bg-success border-success",
                          status === 'running' && "bg-primary/20 border-primary animate-pulse",
                          status === 'awaiting' && "bg-warning/20 border-warning",
                          status === 'pending' && "bg-muted border-border"
                        )}>
                          {status === 'completed' && <CheckCircle className="w-4 h-4 text-success-foreground" />}
                          {status === 'running' && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
                          {status === 'awaiting' && <AlertCircle className="w-4 h-4 text-warning" />}
                          {status === 'pending' && <span className="text-xs text-muted-foreground">{step.step}</span>}
                        </div>
                        {!isLast && (
                          <div className={cn(
                            "w-0.5 flex-1 min-h-[24px] mt-2",
                            status === 'completed' ? "bg-success" : "bg-border"
                          )} />
                        )}
                      </div>
                      
                      {/* Step content */}
                      <div className="flex-1 pt-1">
                        <p className={cn(
                          "font-medium",
                          status === 'pending' && "text-muted-foreground"
                        )}>
                          {step.name}
                        </p>
                        {status === 'awaiting' && (
                          <p className="text-sm text-warning mt-1">
                            Waiting for approval...
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          {/* Right column */}
          <div className="space-y-6">
            {/* Artifacts */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-base">Artifacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {run.pr_url ? (
                  <a 
                    href={run.pr_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <span className="text-sm">Pull Request</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                ) : (
                  <div className="p-3 rounded-lg bg-secondary/30 text-muted-foreground text-sm">
                    Pull Request - pending
                  </div>
                )}
                
                {run.ci_url ? (
                  <a 
                    href={run.ci_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <span className="text-sm">CI Pipeline</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                ) : (
                  <div className="p-3 rounded-lg bg-secondary/30 text-muted-foreground text-sm">
                    CI Pipeline - pending
                  </div>
                )}
                
                {run.preview_url ? (
                  <a 
                    href={run.preview_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <span className="text-sm">Preview URL</span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                ) : (
                  <div className="p-3 rounded-lg bg-secondary/30 text-muted-foreground text-sm">
                    Preview URL - pending
                  </div>
                )}
                
                {run.report_md && (
                  <Link 
                    to={`/reports/${run.id}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-primary"
                  >
                    <span className="text-sm font-medium">View Report</span>
                    <FileText className="w-4 h-4" />
                  </Link>
                )}
              </CardContent>
            </Card>
            
            {/* Event Log */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="text-base">Event Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="log-container max-h-[300px] space-y-2">
                  {events.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Waiting for events...
                    </p>
                  ) : (
                    events.map((event) => (
                      <div 
                        key={event.id}
                        className={cn(
                          "flex items-start gap-2 text-xs",
                          event.level === 'error' && "text-destructive",
                          event.level === 'warn' && "text-warning",
                          event.level === 'info' && "text-muted-foreground"
                        )}
                      >
                        <span className="opacity-50 flex-shrink-0">
                          {new Date(event.ts).toLocaleTimeString()}
                        </span>
                        <span>{event.message}</span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
