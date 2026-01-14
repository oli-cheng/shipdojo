import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GitBranch, 
  Plus,
  Github,
  Sparkles,
  Play,
  ExternalLink
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getDemoRepos, saveDemoRepos, createDemoRepo, Repo } from "@/lib/demo-data";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Repos() {
  const navigate = useNavigate();
  const [repos, setRepos] = useState<Repo[]>(getDemoRepos());
  const [isAddingRepo, setIsAddingRepo] = useState(false);
  
  const org = JSON.parse(localStorage.getItem('shipdojo_org') || '{}');
  
  const handleCreateDemoRepo = () => {
    const newRepo = createDemoRepo(org.id);
    const updatedRepos = [...repos, newRepo];
    saveDemoRepos(updatedRepos);
    setRepos(updatedRepos);
    setIsAddingRepo(false);
  };

  return (
    <AppLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Repositories</h1>
            <p className="text-muted-foreground">Connect and manage your repositories</p>
          </div>
          
          <Dialog open={isAddingRepo} onOpenChange={setIsAddingRepo}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Repo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect a Repository</DialogTitle>
                <DialogDescription>
                  Choose how to connect your repository
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-3 pt-4">
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
                    <p className="text-xs text-primary-foreground/70">Try with a simulated repository</p>
                  </div>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Repos Grid */}
        {repos.length === 0 ? (
          <Card variant="glass" className="max-w-lg mx-auto">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <GitBranch className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No repositories yet</h2>
              <p className="text-muted-foreground mb-6">
                Connect a GitHub repository or create a demo repo to get started
              </p>
              <Button variant="hero" onClick={() => setIsAddingRepo(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Repo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo) => (
              <Card key={repo.id} variant="interactive">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-secondary">
                        {repo.provider === 'demo' ? (
                          <Sparkles className="w-5 h-5 text-primary" />
                        ) : (
                          <Github className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-base">{repo.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {repo.owner} · {repo.default_branch}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={repo.provider === 'demo' ? 'info' : 'secondary'}>
                      {repo.provider}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2">
                    <Link to={`/repos/${repo.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="w-3 h-3 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    <Link to={`/repos/${repo.id}/run`}>
                      <Button size="sm">
                        <Play className="w-3 h-3 mr-2" />
                        Run
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add new repo card */}
            <Card 
              variant="interactive" 
              className="border-dashed cursor-pointer"
              onClick={() => setIsAddingRepo(true)}
            >
              <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[160px] text-muted-foreground hover:text-foreground transition-colors">
                <Plus className="w-8 h-8 mb-2" />
                <p className="text-sm font-medium">Add Repository</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
