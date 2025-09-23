import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/` },
      });

      if (error) throw error;

      if ((data as any)?.url) {
        window.location.href = (data as any).url;
      }
    } catch (err: any) {
      toast({ title: "Google sign in failed", description: err?.message || String(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Password reset is handled on a dedicated page at /reset-password

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to TaskHub</CardTitle>
          <CardDescription>Start earning money by completing tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-center">
            <Button onClick={handleGoogleSignIn} variant="outline" className="w-full">
              Continue with Google
            </Button>
            <div className="text-sm text-muted-foreground mt-2">
              Or
            </div>
            <Button type="button" className="w-full mt-2" onClick={() => navigate('/')}>Go to Dashboard</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;