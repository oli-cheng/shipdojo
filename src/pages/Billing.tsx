import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check,
  Sparkles,
  CreditCard
} from "lucide-react";
import { useState } from "react";

const plans = [
  {
    id: 'starter',
    name: "Starter",
    price: "Free",
    description: "Perfect for trying out ShipDojo",
    features: [
      "1 repository",
      "5 Dojo runs / month",
      "Basic checks",
      "Community support"
    ],
  },
  {
    id: 'pro',
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For indie hackers and small teams",
    features: [
      "10 repositories",
      "Unlimited Dojo runs",
      "All checks included",
      "Priority support",
      "Custom CI templates",
      "ShipDojo Reports"
    ],
    popular: true
  },
  {
    id: 'team',
    name: "Team",
    price: "$99",
    period: "/month",
    description: "For growing teams and agencies",
    features: [
      "Unlimited repositories",
      "Unlimited Dojo runs",
      "All checks included",
      "Dedicated support",
      "Team collaboration",
      "Custom policies",
      "SSO & audit logs"
    ],
  }
];

export default function Billing() {
  const [currentPlan, setCurrentPlan] = useState('starter');
  const [isUpgrading, setIsUpgrading] = useState<string | null>(null);
  
  const org = JSON.parse(localStorage.getItem('shipdojo_org') || '{}');
  
  const handleUpgrade = (planId: string) => {
    if (org.demo_mode) {
      // Simulate upgrade in demo mode
      setIsUpgrading(planId);
      setTimeout(() => {
        setCurrentPlan(planId);
        setIsUpgrading(null);
      }, 1500);
    }
  };

  return (
    <AppLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Billing</h1>
            <p className="text-muted-foreground">Manage your subscription and billing</p>
          </div>
          
          {org.demo_mode && (
            <Badge variant="info" className="gap-1">
              <Sparkles className="w-3 h-3" />
              Demo Mode - Upgrades are simulated
            </Badge>
          )}
        </div>
        
        {/* Current Plan Card */}
        <Card variant="glow" className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Plan</p>
                  <p className="text-2xl font-bold capitalize">{currentPlan}</p>
                </div>
              </div>
              
              <Badge variant="success">Active</Badge>
            </div>
          </CardContent>
        </Card>
        
        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            
            return (
              <Card 
                key={plan.id}
                variant={plan.popular ? "glow" : isCurrent ? "glass" : "interactive"}
                className={`relative ${plan.popular ? '' : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <Check className="w-4 h-4 text-success flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {isCurrent ? (
                    <Button variant="secondary" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button 
                      variant={plan.popular ? "hero" : "outline"} 
                      className="w-full"
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={isUpgrading !== null}
                    >
                      {isUpgrading === plan.id ? (
                        org.demo_mode ? "Simulating upgrade..." : "Processing..."
                      ) : (
                        plan.id === 'starter' ? 'Downgrade' : 'Upgrade'
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Info Card */}
        <Card variant="glass" className="mt-8">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">Payment Information</h3>
            <p className="text-sm text-muted-foreground">
              {org.demo_mode 
                ? "In demo mode, billing is simulated. No actual charges will occur. Connect Stripe to enable real payments."
                : "Manage your payment methods and view invoices in your account settings."
              }
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
