import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Shield,
  Lock
} from "lucide-react";
import { getDemoChecks, saveDemoChecks, DojoCheck } from "@/lib/demo-data";
import { useState } from "react";

export default function Checks() {
  const [checks, setChecks] = useState<DojoCheck[]>(getDemoChecks());
  
  const handleToggle = (checkId: string) => {
    const updatedChecks = checks.map(check => {
      if (check.id === checkId && !check.required) {
        return { ...check, enabled: !check.enabled };
      }
      return check;
    });
    setChecks(updatedChecks);
    saveDemoChecks(updatedChecks);
  };
  
  const enabledCount = checks.filter(c => c.enabled).length;

  return (
    <AppLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dojo Checks</h1>
            <p className="text-muted-foreground">Configure which productionization checks to run</p>
          </div>
          
          <Badge variant="info" className="text-sm">
            {enabledCount} of {checks.length} enabled
          </Badge>
        </div>
        
        {/* Checks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checks.map((check) => (
            <Card 
              key={check.id} 
              variant={check.enabled ? "glow" : "glass"}
              className="transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{check.name}</h3>
                      {check.required && (
                        <Badge variant="secondary" className="text-[10px]">
                          <Lock className="w-2 h-2 mr-1" />
                          Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {check.description}
                    </p>
                  </div>
                  
                  <Switch
                    checked={check.enabled}
                    onCheckedChange={() => handleToggle(check.id)}
                    disabled={check.required}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Info Card */}
        <Card variant="glass" className="mt-8">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="p-3 rounded-lg bg-info/10 text-info">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">About Dojo Checks</h3>
              <p className="text-sm text-muted-foreground">
                Dojo Checks are the productionization policies that ShipDojo applies to your code. 
                Each enabled check adds specific improvements to make your AI-generated code production-ready. 
                Required checks cannot be disabled as they are essential for safe deployments.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
