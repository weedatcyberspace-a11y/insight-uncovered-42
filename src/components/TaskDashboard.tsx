import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users, 
  Star, 
  Video, 
  MessageSquare, 
  Smartphone,
  RefreshCw,
  Plus,
  ExternalLink,
  CheckCircle,
  User
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string | null;
  task_type: string;
  payout_amount: number;
  total_slots: number;
  completed_slots: number;
  expires_at: string | null;
  status: string;
  affiliate_link: string | null;
  content_url: string | null;
  client_name: string | null;
}

interface UserTask {
  id: string;
  task_id: string;
  status: string;
  proof_of_completion: string | null;
}

interface TaskWithCompletion extends Task {
  user_task?: UserTask;
}

const quickStats = [
  {
    title: "Today's Earnings",
    value: "$47.25",
    change: "+$12.75",
    icon: DollarSign,
    trend: "up"
  },
  {
    title: "Tasks Completed",
    value: "23",
    change: "+5 today",
    icon: Star,
    trend: "up"
  },
  {
    title: "Time Spent",
    value: "2h 45m",
    change: "+45m",
    icon: Clock,
    trend: "up"
  },
  {
    title: "This Week",
    value: "$234.80",
    change: "+18.2%",
    icon: TrendingUp,
    trend: "up"
  }
];

const TaskDashboard = () => {
  const [tasks, setTasks] = useState<TaskWithCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<TaskWithCompletion | null>(null);
  const [proofText, setProofText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchTasks();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchTasks();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  };

  const fetchTasks = async () => {
    setLoading(true);
    
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    const { data: tasksData, error: tasksError } = await supabase
      .from("tasks")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (tasksError) {
      console.error("Error fetching tasks:", tasksError);
      setLoading(false);
      return;
    }

    if (currentUser) {
      const { data: userTasksData, error: userTasksError } = await supabase
        .from("user_tasks")
        .select("*")
        .eq("user_id", currentUser.id);

      if (!userTasksError && userTasksData) {
        const tasksWithCompletion = tasksData.map(task => ({
          ...task,
          user_task: userTasksData.find(ut => ut.task_id === task.id)
        }));
        setTasks(tasksWithCompletion);
      } else {
        setTasks(tasksData);
      }
    } else {
      setTasks(tasksData);
    }
    
    setLoading(false);
  };

  const getTaskIcon = (taskType: string) => {
    switch (taskType.toLowerCase()) {
      case 'survey': return MessageSquare;
      case 'video': return Video;
      case 'app_testing': return Smartphone;
      case 'review': return Star;
      default: return MessageSquare;
    }
  };

  const getTaskColor = (taskType: string) => {
    switch (taskType.toLowerCase()) {
      case 'survey': return { text: "text-blue-600", bg: "bg-blue-100" };
      case 'video': return { text: "text-red-600", bg: "bg-red-100" };
      case 'app_testing': return { text: "text-green-600", bg: "bg-green-100" };
      case 'review': return { text: "text-yellow-600", bg: "bg-yellow-100" };
      default: return { text: "text-blue-600", bg: "bg-blue-100" };
    }
  };

  const handleStartTask = async (task: TaskWithCompletion) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (task.user_task) {
      if (task.user_task.status === 'completed') {
        toast({
          title: "Task already completed",
          description: "You have already completed this task.",
        });
        return;
      }
      
      if (task.user_task.status === 'in_progress') {
        setSelectedTask(task);
        return;
      }
    }

    // Check if task has available slots
    if (task.completed_slots >= task.total_slots) {
      toast({
        title: "Task full",
        description: "This task has reached its maximum capacity.",
        variant: "destructive",
      });
      return;
    }

    // Assign task to user
    const { error } = await supabase
      .from("user_tasks")
      .insert({
        user_id: user.id,
        task_id: task.id,
        status: 'in_progress',
        started_at: new Date().toISOString()
      });

    if (error) {
      toast({
        title: "Error starting task",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setSelectedTask(task);
      fetchTasks(); // Refresh tasks
    }
  };

  const handleSubmitProof = async () => {
    if (!selectedTask || !user || !proofText.trim()) {
      toast({
        title: "Invalid submission",
        description: "Please provide proof of completion.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    const { error } = await supabase
      .from("user_tasks")
      .update({
        status: 'completed',
        proof_of_completion: proofText,
        completed_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .eq('task_id', selectedTask.id);

    if (error) {
      toast({
        title: "Error submitting proof",
        description: error.message,
        variant: "destructive",
      });
    } else {
      // Update user balance
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          available_balance: selectedTask.payout_amount,
          total_earnings: selectedTask.payout_amount
        })
        .eq('user_id', user.id);

      if (!profileError) {
        toast({
          title: "Task completed!",
          description: `You earned $${selectedTask.payout_amount.toFixed(2)}`,
        });
      }

      setSelectedTask(null);
      setProofText("");
      fetchTasks();
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading tasks...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Available Tasks
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Complete real tasks and earn money instantly
          </p>
          <div className="flex justify-center space-x-4">
            <Button onClick={fetchTasks} disabled={loading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Tasks
            </Button>
            {user ? (
              <Button onClick={() => navigate("/profile")} variant="outline">
                <User className="w-4 h-4 mr-2" />
                My Profile
              </Button>
            ) : (
              <Button onClick={() => navigate("/auth")} variant="outline">
                Sign In to Start
              </Button>
            )}
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {tasks.map((task) => {
            const Icon = getTaskIcon(task.task_type);
            const colors = getTaskColor(task.task_type);
            const isCompleted = task.user_task?.status === 'completed';
            const isInProgress = task.user_task?.status === 'in_progress';
            const slotsRemaining = task.total_slots - task.completed_slots;
            
            return (
              <Card key={task.id} className={`group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary ${isCompleted ? 'bg-green-50' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-full ${colors.bg}`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge variant="secondary" className="text-xs">
                        {task.task_type}
                      </Badge>
                      {isCompleted && (
                        <Badge variant="default" className="text-xs bg-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                      {isInProgress && (
                        <Badge variant="outline" className="text-xs">
                          In Progress
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {task.description || 'Complete this task to earn money'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Reward:</span>
                      <span className="font-semibold text-green-600">${task.payout_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Slots left:</span>
                      <span className={slotsRemaining > 0 ? "text-green-600" : "text-red-600"}>
                        {slotsRemaining}/{task.total_slots}
                      </span>
                    </div>
                    {task.expires_at && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Expires:</span>
                        <span className="text-xs text-red-600">
                          {new Date(task.expires_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {task.client_name && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Client:</span>
                        <span className="text-xs">{task.client_name}</span>
                      </div>
                    )}
                    
                    <Button 
                      onClick={() => handleStartTask(task)}
                      className="w-full mt-4 group-hover:bg-primary/90 transition-colors"
                      size="sm"
                      disabled={slotsRemaining <= 0 || isCompleted}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Completed
                        </>
                      ) : isInProgress ? (
                        'Continue Task'
                      ) : slotsRemaining <= 0 ? (
                        'Task Full'
                      ) : (
                        'Start Task'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tasks available at the moment.</p>
            <Button onClick={fetchTasks} className="mt-4">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        )}

        {/* Info */}
        <div className="text-center space-y-2 text-sm text-muted-foreground">
          <p>📋 New tasks are added regularly</p>
          <p>⭐ Complete tasks honestly to maintain your account status</p>
          <p>💰 Payments processed via WhatsApp</p>
        </div>
      </div>

      {/* Task Execution Dialog */}
      <Dialog open={selectedTask !== null} onOpenChange={() => setSelectedTask(null)}>
        {selectedTask && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <span>{selectedTask.title}</span>
                <Badge>${selectedTask.payout_amount.toFixed(2)}</Badge>
              </DialogTitle>
              <DialogDescription>
                {selectedTask.description || 'Complete the task requirements below'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Task Instructions */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Task Requirements:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  {selectedTask.task_type === 'survey' && (
                    <>
                      <li>• Answer all survey questions honestly</li>
                      <li>• Provide detailed responses where required</li>
                      <li>• Complete the entire survey</li>
                    </>
                  )}
                  {selectedTask.task_type === 'video' && (
                    <>
                      <li>• Watch the entire video without skipping</li>
                      <li>• Take notes of key points</li>
                      <li>• Provide a summary of what you learned</li>
                    </>
                  )}
                  {selectedTask.task_type === 'app_testing' && (
                    <>
                      <li>• Download and install the app</li>
                      <li>• Test all major features</li>
                      <li>• Report any bugs or issues found</li>
                      <li>• Provide feedback on user experience</li>
                    </>
                  )}
                  {selectedTask.task_type === 'review' && (
                    <>
                      <li>• Visit the specified website/app</li>
                      <li>• Use the service or product</li>
                      <li>• Write an honest review</li>
                      <li>• Rate based on your experience</li>
                    </>
                  )}
                </ul>
              </div>

              {/* External Links */}
              {(selectedTask.content_url || selectedTask.affiliate_link) && (
                <div className="space-y-2">
                  {selectedTask.content_url && (
                    <Button
                      onClick={() => window.open(selectedTask.content_url!, '_blank')}
                      variant="outline"
                      className="w-full"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Task Content
                    </Button>
                  )}
                  {selectedTask.affiliate_link && (
                    <Button
                      onClick={() => window.open(selectedTask.affiliate_link!, '_blank')}
                      variant="outline"
                      className="w-full"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Link
                    </Button>
                  )}
                </div>
              )}

              {/* Proof Submission */}
              <div className="space-y-2">
                <Label htmlFor="proof">Proof of Completion *</Label>
                <Textarea
                  id="proof"
                  placeholder="Describe how you completed the task. Be specific and provide details..."
                  value={proofText}
                  onChange={(e) => setProofText(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Provide detailed proof of completion. Screenshots, summaries, or specific details help verify your work.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedTask(null)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitProof}
                disabled={submitting || !proofText.trim()}
              >
                {submitting ? 'Submitting...' : 'Submit Completion'}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
};

export default TaskDashboard;