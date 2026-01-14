import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GitBranch, 
  Play,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Settings
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getDemoRepos, getDemoRuns, getDemoChecks, DojoRun, saveDemoRuns, saveDemoEvents } from "@/lib/demo-data";
import { useState, useEffect } from "react";

export default function RepoDetail() {
  const { repoId } = useParams();
  const navigate = useNavigate();
  const [repos] = useState(getDemoRepos());
  const [runs, setRuns] = useState(getDemoRuns());
  const [checks] = useState(getDemoChecks());
  
  const repo = repos.find(r => r.id === repoId);
  const repoRuns = runs.filter(r => r.repo_id === repoId).reverse();
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRuns(getDemoRuns());
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  if (!repo) {
    return (
      <AppLayout>
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Repository not found</p>
          <Link to="/repos">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Repos
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }
  
  const handleStartRun = () => {
    // Create new run
    const newRun: DojoRun = {
      id: `run-${Date.now()}`,
      repo_id: repo.id,
      status: 'queued',
      created_at: new Date().toISOString()
    };
    
    const updatedRuns = [...runs, newRun];
    saveDemoRuns(updatedRuns);
    saveDemoEvents([]); // Clear previous events
    
    // Navigate to run detail
    navigate(`/runs/${newRun.id}`);
  };
  
  const enabledChecks = checks.filter(c => c.enabled);

  return (
    <AppLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/repos">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                {repo.provider === 'demo' ? (
                  <Sparkles className="w-5 h-5 text-primary" />
                ) : (
                  <GitBranch className="w-5 h-5 text-primary" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{repo.name}</h1>
                <p className="text-muted-foreground">{repo.owner} · {repo.default_branch}</p>
              </div>
              <Badge variant={repo.provider === 'demo' ? 'info' : 'secondary'}>
                {repo.provider}
              </Badge>
            </div>
          </div>
          
          <Button variant="hero" onClick={handleStartRun}>
            <Play className="w-4 h-4 mr-2" />
            Start Dojo Run
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Dojo Checks Summary */}
          <Card variant="glass" className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Dojo Checks</CardTitle>
                <CardDescription>{enabledChecks.length} of {checks.length} enabled</CardDescription>
              </div>
              <Link to="/checks">
                <Button variant="ghost" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {checks.slice(0, 6).map((check) => (
                  <div key={check.id} className="flex items-center justify-between py-1">
                    <span className="text-sm truncate pr-2">{check.name}</span>
                    {check.enabled ? (
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                ))}
                {checks.length > 6 && (
                  <Link to="/checks" className="text-sm text-primary hover:underline">
                    View all {checks.length} checks →
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Runs */}
          <Card variant="glass" className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Recent Runs</CardTitle>
              <CardDescription>Dojo runs for this repository</CardDescription>
            </CardHeader>
            <CardContent>
              {repoRuns.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Play className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No runs yet</p>
                  <p className="text-sm">Start a Dojo run to productionize this repo</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {repoRuns.slice(0, 5).map((run) => (
                    <Link 
                      key={run.id} 
                      to={`/runs/${run.id}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`status-dot ${
                          run.status === 'completed' ? 'status-dot-success' :
                          run.status === 'failed' ? 'status-dot-error' :
                          run.status === 'awaiting_approval' ? 'status-dot-warning' :
                          run.status === 'running' ? 'status-dot-running' :
                          ''
                        }`} />
                        <div>
                          <p className="text-sm font-medium">
                            Run #{run.id.split('-').pop()?.slice(-6)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(run.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {run.shipdojo_score && (
                          <span className="text-sm font-medium text-success">
                            Score: {run.shipdojo_score}
                          </span>
                        )}
                        <Badge variant={run.status as any}>
                          {run.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
