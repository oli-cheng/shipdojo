import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Connect Your Repo",
    description: "Link your GitHub repository or try with our demo repo. No configuration needed."
  },
  {
    number: "02",
    title: "Configure Dojo Checks",
    description: "Choose which productionization checks to run: security, CI, testing, and more."
  },
  {
    number: "03",
    title: "Start Dojo Run",
    description: "Our AI agent analyzes your code and creates a pull request with all improvements."
  },
  {
    number: "04",
    title: "Approve & Ship",
    description: "Review changes at the Dojo Gate, approve, and deploy your production-ready app."
  }
];

export function HowItWorks() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="container px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How it works
          </h2>
          <p className="text-muted-foreground text-lg">
            From prototype to production in four simple steps
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Connection line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-primary/30 hidden md:block" />
            
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div 
                  key={step.number}
                  className={`flex items-start gap-6 md:gap-12 opacity-0 animate-slide-up ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                  style={{ animationDelay: `${index * 0.15}s`, animationFillMode: 'forwards' }}
                >
                  {/* Number bubble */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg shadow-primary/30">
                      {step.number}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className={`flex-1 pt-3 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Final CTA */}
          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-4">Ready to productionize your code?</p>
            <a 
              href="/signup?demo=true" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Get started with demo mode
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
