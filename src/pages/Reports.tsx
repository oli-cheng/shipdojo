import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText,
  Download,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { getDemoRepos, getDemoRuns } from "@/lib/demo-data";
import { useState, useEffect } from "react";

export default function Reports() {
  const [repos] = useState(getDemoRepos());
  const [runs, setRuns] = useState(getDemoRuns());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setRuns(getDemoRuns());
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  const completedRuns = runs.filter(r => r.status === 'completed' && r.report_md).reverse();

  return (
    <AppLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-muted-foreground">ShipDojo reports from completed runs</p>
          </div>
        </div>
        
        {/* Reports List */}
        {completedRuns.length === 0 ? (
          <Card variant="glass" className="max-w-lg mx-auto">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No reports yet</h2>
              <p className="text-muted-foreground mb-6">
                Complete a Dojo run to generate your first ShipDojo report
              </p>
              <Link to="/repos">
                <Button variant="hero">
                  Start a Dojo Run
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {completedRuns.map((run) => {
              const repo = repos.find(r => r.id === run.repo_id);
              return (
                <Link key={run.id} to={`/reports/${run.id}`}>
                  <Card variant="interactive" className="hover:border-primary/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium">{repo?.name || 'Unknown repo'}</p>
                            <p className="text-sm text-muted-foreground">
                              Generated {new Date(run.finished_at || run.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <Badge variant="success" className="text-lg px-3">
                            Score: {run.shipdojo_score}
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
