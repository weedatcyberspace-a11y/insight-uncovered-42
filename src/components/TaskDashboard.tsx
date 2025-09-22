import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Calendar,
  Play,
  Eye,
  Star,
  Smartphone,
  Video
} from "lucide-react";

// Generate random tasks that change
const generateRandomTasks = () => {
  const taskTypes = [
    { type: "Survey", icon: Eye, baseReward: 0.75, color: "bg-blue-500" },
    { type: "Video", icon: Video, baseReward: 0.25, color: "bg-green-500" },
    { type: "App Test", icon: Smartphone, baseReward: 3.50, color: "bg-purple-500" },
    { type: "Poll", icon: Star, baseReward: 0.50, color: "bg-orange-500" }
  ];
  
  const companies = ["Nike", "Spotify", "Netflix", "Amazon", "Apple", "Google", "Microsoft", "Tesla", "Disney", "Samsung"];
  const titles = [
    "Product Feedback Survey", "Brand Awareness Study", "User Experience Test", 
    "Market Research Poll", "Customer Satisfaction Survey", "App Beta Testing",
    "Video Ad Review", "Product Launch Survey", "Service Quality Poll", "Shopping Habits Study"
  ];
  
  return Array.from({ length: 8 }, (_, i) => {
    const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const title = titles[Math.floor(Math.random() * titles.length)];
    const reward = taskType.baseReward + (Math.random() * 2);
    const timeLeft = Math.floor(Math.random() * 48) + 1;
    
    return {
      id: i + 1,
      title: `${company} - ${title}`,
      type: taskType.type,
      icon: taskType.icon,
      reward: reward.toFixed(2),
      duration: Math.floor(Math.random() * 15) + 2,
      timeLeft: `${timeLeft}h`,
      difficulty: Math.random() > 0.5 ? "Easy" : "Medium",
      color: taskType.color
    };
  });
};

const tasks = generateRandomTasks();

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
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Available Tasks</h2>
            <p className="text-muted-foreground">Complete tasks to earn money - New tasks added every hour!</p>
          </div>
          <Button variant="hero" size="lg" className="mt-4 md:mt-0">
            <Plus className="mr-2 h-5 w-5" />
            Refresh Tasks
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-medium transition-smooth">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-accent font-medium">{stat.change}</p>
                  </div>
                  <div className="bg-gradient-primary p-3 rounded-lg">
                    <stat.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Available Tasks */}
        <Card className="shadow-medium">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">Available Tasks</CardTitle>
                <CardDescription>Click start to begin earning money instantly</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="animate-pulse">
                  {tasks.length} New Tasks
                </Badge>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-smooth">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`p-3 rounded-lg ${task.color}`}>
                      <task.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-foreground">{task.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {task.type}
                        </Badge>
                        <Badge 
                          variant={task.difficulty === 'Easy' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {task.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          ${task.reward}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          ~{task.duration} min
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Expires in {task.timeLeft}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="hero" size="sm" className="font-semibold">
                      <Play className="h-4 w-4 mr-2" />
                      Start Task
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                ✨ Tasks refresh every hour • Complete 5+ tasks daily for bonus rewards
              </p>
              <Button variant="outline" className="w-full md:w-auto">
                Load More Tasks
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default TaskDashboard;