import { Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Dumbbell className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg">ShipDojo</span>
          </div>
          
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/docs" className="hover:text-foreground transition-colors">Docs</Link>
            <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Twitter</a>
          </nav>
          
          <p className="text-sm text-muted-foreground">
            © 2024 ShipDojo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
