import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GitBranch, 
  Play, 
  TrendingUp, 
  Clock,
  ArrowRight,
  Sparkles,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import { getDemoRepos, getDemoRuns } from "@/lib/demo-data";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [repos, setRepos] = useState(getDemoRepos());
  const [runs, setRuns] = useState(getDemoRuns());
  
  const org = JSON.parse(localStorage.getItem('shipdojo_org') || '{}');
  
  useEffect(() => {
    // Refresh data periodically
    const interval = setInterval(() => {
      setRepos(getDemoRepos());
      setRuns(getDemoRuns());
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  const recentRuns = runs.slice(-5).reverse();
  const activeRuns = runs.filter(r => r.status === 'running' || r.status === 'awaiting_approval');
  
  const stats = [
    { 
      label: 'Total Repos', 
      value: repos.length, 
      icon: GitBranch,
      color: 'text-info'
    },
    { 
      label: 'Total Runs', 
      value: runs.length, 
      icon: Play,
      color: 'text-primary'
    },
    { 
      label: 'Active Runs', 
      value: activeRuns.length, 
      icon: Clock,
      color: 'text-warning'
    },
    { 
      label: 'Avg Score', 
      value: runs.length > 0 
        ? Math.round(runs.filter(r => r.shipdojo_score).reduce((acc, r) => acc + (r.shipdojo_score || 0), 0) / runs.filter(r => r.shipdojo_score).length) || '—'
        : '—', 
      icon: TrendingUp,
      color: 'text-success'
    },
  ];

  return (
    <AppLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back to ShipDojo</p>
          </div>
          
          {org.demo_mode && (
            <Badge variant="info" className="gap-1">
              <Sparkles className="w-3 h-3" />
              Demo Mode
            </Badge>
          )}
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} variant="glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-secondary ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with ShipDojo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {repos.length === 0 ? (
                <Link to="/repos" className="block">
                  <Button variant="hero" className="w-full justify-between group">
                    <span className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Connect Your First Repo
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/repos" className="block">
                    <Button variant="outline" className="w-full justify-between group">
                      <span className="flex items-center gap-2">
                        <GitBranch className="w-4 h-4" />
                        View Repos
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/runs" className="block">
                    <Button variant="hero" className="w-full justify-between group">
                      <span className="flex items-center gap-2">
                        <Play className="w-4 h-4" />
                        Start New Dojo Run
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </>
              )}
            </CardContent>
          </Card>
          
          {/* Recent Runs */}
          <Card variant="glass">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Runs</CardTitle>
                <CardDescription>Your latest Dojo runs</CardDescription>
              </div>
              <Link to="/runs">
                <Button variant="ghost" size="sm">View all</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentRuns.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Play className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No runs yet</p>
                  <p className="text-sm">Start a Dojo run to productionize your code</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentRuns.map((run) => {
                    const repo = repos.find(r => r.id === run.repo_id);
                    return (
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
                            'status-dot-running'
                          }`} />
                          <div>
                            <p className="text-sm font-medium">{repo?.name || 'Unknown repo'}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(run.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant={run.status as any}>
                          {run.status.replace('_', ' ')}
                        </Badge>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
