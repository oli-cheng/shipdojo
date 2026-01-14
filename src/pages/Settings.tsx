import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Settings as SettingsIcon,
  Sparkles,
  Github,
  CreditCard,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const [org, setOrg] = useState(JSON.parse(localStorage.getItem('shipdojo_org') || '{}'));
  const [orgName, setOrgName] = useState(org.name || '');
  const [isSaving, setIsSaving] = useState(false);
  
  const handleToggleDemoMode = () => {
    const updatedOrg = { ...org, demo_mode: !org.demo_mode };
    setOrg(updatedOrg);
    localStorage.setItem('shipdojo_org', JSON.stringify(updatedOrg));
  };
  
  const handleSaveOrgName = () => {
    setIsSaving(true);
    setTimeout(() => {
      const updatedOrg = { ...org, name: orgName };
      setOrg(updatedOrg);
      localStorage.setItem('shipdojo_org', JSON.stringify(updatedOrg));
      setIsSaving(false);
    }, 500);
  };

  const integrations = [
    {
      name: 'GitHub',
      icon: Github,
      status: org.demo_mode ? 'demo' : 'not_connected',
      description: 'Connect your GitHub account to link repositories'
    },
    {
      name: 'Stripe',
      icon: CreditCard,
      status: org.demo_mode ? 'demo' : 'not_connected',
      description: 'Connect Stripe for billing and payments'
    }
  ];

  return (
    <AppLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your organization settings</p>
          </div>
        </div>
        
        <div className="max-w-2xl space-y-6">
          {/* Organization Settings */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                Organization
              </CardTitle>
              <CardDescription>Manage your organization details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="orgName"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="My Organization"
                  />
                  <Button 
                    onClick={handleSaveOrgName}
                    disabled={isSaving || orgName === org.name}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Demo Mode */}
          <Card variant={org.demo_mode ? "glow" : "glass"}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Demo Mode
              </CardTitle>
              <CardDescription>
                Enable demo mode to use simulated repositories and runs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Demo Mode</p>
                  <p className="text-sm text-muted-foreground">
                    {org.demo_mode 
                      ? "All features work with simulated data"
                      : "Connect real integrations to use ShipDojo"
                    }
                  </p>
                </div>
                <Switch
                  checked={org.demo_mode}
                  onCheckedChange={handleToggleDemoMode}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Integrations */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-lg">Integrations</CardTitle>
              <CardDescription>Connect external services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.map((integration) => (
                <div 
                  key={integration.name}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-background">
                      <integration.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">{integration.name}</p>
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {integration.status === 'connected' && (
                      <Badge variant="success" className="gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Connected
                      </Badge>
                    )}
                    {integration.status === 'demo' && (
                      <Badge variant="info" className="gap-1">
                        <Sparkles className="w-3 h-3" />
                        Demo
                      </Badge>
                    )}
                    {integration.status === 'not_connected' && (
                      <>
                        <Badge variant="secondary" className="gap-1">
                          <XCircle className="w-3 h-3" />
                          Not Connected
                        </Badge>
                        <Button variant="outline" size="sm" disabled>
                          Connect
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Team Members */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Members
              </CardTitle>
              <CardDescription>Manage who has access to this organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-primary-foreground">
                    D
                  </div>
                  <div>
                    <p className="font-medium">Demo User</p>
                    <p className="text-sm text-muted-foreground">demo@shipdojo.dev</p>
                  </div>
                </div>
                <Badge>Owner</Badge>
              </div>
              
              <Button variant="outline" className="w-full mt-4" disabled>
                <Users className="w-4 h-4 mr-2" />
                Invite Team Member (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
