import { Button } from "@/components/ui/button";
import { BarChart3, Users, TrendingUp, Menu } from "lucide-react";

const SurveyHeader = () => {
  return (
    <header className="bg-card/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">TaskHub</h1>
              <p className="text-sm text-muted-foreground">Earn Money Online</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#tasks" className="text-foreground hover:text-primary font-medium transition-smooth">
              Available Tasks
            </a>
            <a href="#earnings" className="text-foreground hover:text-primary font-medium transition-smooth">
              My Earnings
            </a>
            <a href="#history" className="text-foreground hover:text-primary font-medium transition-smooth">
              Task History
            </a>
            <a href="#rewards" className="text-foreground hover:text-primary font-medium transition-smooth">
              Rewards
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              Login
            </Button>
            <Button variant="hero" size="sm">
              Start Earning
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SurveyHeader;