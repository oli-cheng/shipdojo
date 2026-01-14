import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for trying out ShipDojo",
    features: [
      "1 repository",
      "5 Dojo runs / month",
      "Basic checks",
      "Community support"
    ],
    cta: "Get Started",
    variant: "outline" as const
  },
  {
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
    cta: "Start Free Trial",
    variant: "hero" as const,
    popular: true
  },
  {
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
    cta: "Contact Sales",
    variant: "outline" as const
  }
];

export function Pricing() {
  return (
    <section className="relative py-24 md:py-32" id="pricing">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/30 to-transparent" />
      
      <div className="container relative z-10 px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground text-lg">
            Start free, scale as you grow
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name}
              variant={plan.popular ? "glow" : "interactive"}
              className={`relative opacity-0 animate-slide-up ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
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
                
                <Link to="/signup" className="block">
                  <Button variant={plan.variant} className="w-full">
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
