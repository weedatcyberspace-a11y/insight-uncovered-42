import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { BarChart3, Users, TrendingUp, Menu, User, LogOut } from "lucide-react";

const SurveyHeader = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };
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

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Badge variant="secondary" className="hidden sm:flex">
                  {user.email}
                </Badge>
                <Button 
                  onClick={() => navigate("/profile")} 
                  variant="outline" 
                  size="sm"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  onClick={() => navigate("/auth")} 
                  variant="outline" 
                  size="sm"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate("/auth")} 
                  size="sm"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SurveyHeader;