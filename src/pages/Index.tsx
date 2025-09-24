import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LogIn, User } from "lucide-react";
import QuestionTask from "@/components/QuestionTask";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check auth state
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-primary">TaskHub</h1>
            <span className="text-sm text-muted-foreground">Earn Money by Answering Questions</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <Button onClick={() => navigate("/profile")} variant="outline" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button 
                  onClick={async () => {
                    await supabase.auth.signOut();
                    navigate("/auth");
                  }} 
                  variant="ghost" 
                  size="sm"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate("/auth")} size="sm">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Answer Questions, Earn Money
          </h2>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Complete our engaging question challenges and get paid instantly. 
            The more questions you answer correctly, the more you earn!
          </p>
          {!user && (
            <Button onClick={() => navigate("/auth")} size="lg" className="mb-8">
              Get Started - It's Free
            </Button>
          )}
        </div>

        {/* Question Task Component */}
        <QuestionTask />
      </main>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 TaskHub. Start earning money by answering questions today!</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;