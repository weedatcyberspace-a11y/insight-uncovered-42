import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User, Wallet, MessageCircle, LogOut, TrendingUp, Clock, Award } from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  phone_number: string | null;
  available_balance: number;
  total_earnings: number;
  account_status: string;
  deriv_account: string | null;
  created_at: string;
}

interface TaskStats {
  total_completed: number;
  pending_tasks: number;
  total_earned: number;
}

const Profile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [withdrawing, setWithdrawing] = useState(false);
  const [taskStats, setTaskStats] = useState<TaskStats>({ total_completed: 0, pending_tasks: 0, total_earned: 0 });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchProfile();
    fetchTaskStats();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    } else {
      setProfile(data);
    }
    setLoading(false);
  };

  const fetchTaskStats = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: userTasks, error } = await supabase
      .from("user_tasks")
      .select("status, payout_amount")
      .eq("user_id", user.id);

    if (!error && userTasks) {
      const completed = userTasks.filter(task => task.status === 'completed').length;
      const pending = userTasks.filter(task => task.status === 'assigned' || task.status === 'in_progress').length;
      const earned = userTasks
        .filter(task => task.status === 'completed')
        .reduce((sum, task) => sum + (task.payout_amount || 0), 0);

      setTaskStats({
        total_completed: completed,
        pending_tasks: pending,
        total_earned: earned
      });
    }
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || withdrawAmount <= 0 || !profile || withdrawAmount > profile.available_balance) {
      toast({
        title: "Invalid withdrawal amount",
        description: "Please enter a valid amount to withdraw.",
        variant: "destructive",
      });
      return;
    }
    setWithdrawing(true);
    // Deduct amount from balance in Supabase
    supabase
      .from("profiles")
      .update({ available_balance: profile.available_balance - withdrawAmount })
      .eq("user_id", profile.user_id)
      .then(({ error }) => {
        if (error) {
          toast({
            title: "Withdrawal failed",
            description: error.message,
            variant: "destructive",
          });
          setWithdrawing(false);
        } else {
          setProfile({ ...profile, available_balance: profile.available_balance - withdrawAmount });
          const message = `Hi! I would like to withdraw $${withdrawAmount.toFixed(2)} from my TaskHub account. My account ID is: ${profile.id}`;
          const whatsappUrl = `https://wa.me/254114470612?text=${encodeURIComponent(message)}`;
          window.open(whatsappUrl, '_blank');
          toast({
            title: "Withdrawal initiated",
            description: `You requested $${withdrawAmount.toFixed(2)}. Your new balance is $${(profile.available_balance - withdrawAmount).toFixed(2)}.`,
          });
          setWithdrawAmount(0);
          setWithdrawing(false);
        }
      });
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/auth");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <p className="text-muted-foreground">Profile not found</p>
            <Button onClick={() => navigate("/")} className="mt-4">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">My Profile</h1>
                <p className="text-muted-foreground">Account ID: {profile.id.substring(0, 8)}...</p>
              </div>
            </div>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Balance Card */}
          <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wallet className="h-5 w-5" />
                <span>Account Balance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-green-600">
                      ${profile.available_balance?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-sm text-muted-foreground">Available to withdraw</p>
                  </div>
                  <Badge variant={profile.account_status === 'active' ? 'default' : 'secondary'}>
                    {profile.account_status || 'inactive'}
                  </Badge>
                </div>
                <Separator />
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="w-full md:w-auto">
                    <p className="text-lg font-semibold">
                      ${profile.total_earnings?.toFixed(2) || '0.00'}
                    </p>
                    <p className="text-sm text-muted-foreground">Total earnings</p>
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-2 w-full md:w-auto">
                    <input
                      type="number"
                      min={1}
                      max={profile.available_balance}
                      step={0.01}
                      value={withdrawAmount}
                      onChange={e => setWithdrawAmount(Number(e.target.value))}
                      placeholder="Amount to withdraw"
                      className="border rounded px-3 py-2 w-full md:w-32"
                      disabled={withdrawing}
                    />
                    <Button 
                      onClick={handleWithdraw} 
                      className="bg-green-600 hover:bg-green-700"
                      disabled={withdrawing || !profile.available_balance || profile.available_balance <= 0 || !withdrawAmount || withdrawAmount > profile.available_balance}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {withdrawing ? 'Processing...' : 'Withdraw via WhatsApp'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500/10 rounded-full">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{taskStats.total_completed}</p>
                    <p className="text-sm text-muted-foreground">Tasks Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-500/10 rounded-full">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{taskStats.pending_tasks}</p>
                    <p className="text-sm text-muted-foreground">Pending Tasks</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/10 rounded-full">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">${taskStats.total_earned.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Task Earnings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your personal account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Phone Number:</span>
                  <span className="text-sm text-muted-foreground">
                    {profile.phone_number || 'Not provided'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Deriv Account:</span>
                  <span className="text-sm text-muted-foreground">
                    {profile.deriv_account || 'Not linked'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Member Since:</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="text-center">
            <Button onClick={() => navigate("/")} variant="outline">
              Back to Tasks
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;