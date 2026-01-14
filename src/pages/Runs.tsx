import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play,
  Filter,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { getDemoRepos, getDemoRuns } from "@/lib/demo-data";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Runs() {
  const [repos] = useState(getDemoRepos());
  const [runs, setRuns] = useState(getDemoRuns());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRuns(getDemoRuns());
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  const filteredRuns = runs
    .filter(r => statusFilter === 'all' || r.status === statusFilter)
    .reverse();

  return (
    <AppLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dojo Runs</h1>
            <p className="text-muted-foreground">View and manage your productionization runs</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Runs</SelectItem>
                <SelectItem value="queued">Queued</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="awaiting_approval">Awaiting Approval</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Runs List */}
        {filteredRuns.length === 0 ? (
          <Card variant="glass" className="max-w-lg mx-auto">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Play className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No runs yet</h2>
              <p className="text-muted-foreground mb-6">
                {statusFilter !== 'all' 
                  ? `No runs with status "${statusFilter.replace('_', ' ')}"`
                  : 'Start a Dojo run from a repository to productionize your code'
                }
              </p>
              <Link to="/repos">
                <Button variant="hero">
                  Go to Repos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredRuns.map((run) => {
              const repo = repos.find(r => r.id === run.repo_id);
              return (
                <Link key={run.id} to={`/runs/${run.id}`}>
                  <Card variant="interactive" className="hover:border-primary/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`status-dot ${
                            run.status === 'completed' ? 'status-dot-success' :
                            run.status === 'failed' ? 'status-dot-error' :
                            run.status === 'awaiting_approval' ? 'status-dot-warning' :
                            run.status === 'running' ? 'status-dot-running' :
                            ''
                          }`} />
                          <div>
                            <p className="font-medium">{repo?.name || 'Unknown repo'}</p>
                            <p className="text-sm text-muted-foreground">
                              Run #{run.id.split('-').pop()?.slice(-6)} · {new Date(run.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {run.shipdojo_score && (
                            <div className="text-right">
                              <p className="text-2xl font-bold text-success">{run.shipdojo_score}</p>
                              <p className="text-xs text-muted-foreground">ShipDojo Score</p>
                            </div>
                          )}
                          <Badge variant={run.status as any} className="min-w-[120px] justify-center">
                            {run.status.replace('_', ' ')}
                          </Badge>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
