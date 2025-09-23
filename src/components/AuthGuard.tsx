import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Props = {
  children: JSX.Element | JSX.Element[];
  requireEmailVerified?: boolean;
};

const AuthGuard = ({ children, requireEmailVerified = false }: Props) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const check = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          toast({ title: "Authentication required", description: "Please sign in to continue.", variant: "destructive" });
          navigate("/auth");
          return;
        }

        if (requireEmailVerified) {
          const { data: { user }, error } = await supabase.auth.getUser();
          if (error) throw error;

          // Some Supabase setups include an `email_confirmed_at` field; guard conservatively
          const emailVerified = !!(user && ((user as any).email_confirmed_at || (user as any).confirmed_at));
          if (!emailVerified) {
            toast({ title: "Email not verified", description: "Please verify your email before accessing this page.", variant: "destructive" });
            navigate("/auth");
            return;
          }
        }

        if (mounted) setLoading(false);
      } catch (err: any) {
        toast({ title: "Auth check failed", description: err?.message || String(err), variant: "destructive" });
        navigate("/auth");
      }
    };

    check();

    return () => { mounted = false; };
  }, [navigate, toast, requireEmailVerified]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return <>{children}</>;
};

export default AuthGuard;
