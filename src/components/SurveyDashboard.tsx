import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  BarChart3, 
  Users, 
  TrendingUp, 
  Calendar,
  MoreHorizontal,
  Eye,
  Edit,
  Share
} from "lucide-react";

const surveys = [
  {
    id: 1,
    title: "Customer Satisfaction Survey",
    status: "Active",
    responses: 1247,
    completion: 87,
    created: "2 days ago",
    type: "Customer Feedback"
  },
  {
    id: 2,
    title: "Product Feature Feedback",
    status: "Draft",
    responses: 0,
    completion: 0,
    created: "1 week ago",
    type: "Product Research"
  },
  {
    id: 3,
    title: "Market Research Q4 2024",
    status: "Completed",
    responses: 2156,
    completion: 100,
    created: "3 weeks ago",
    type: "Market Analysis"
  }
];

const quickStats = [
  {
    title: "Total Responses",
    value: "15,247",
    change: "+12.5%",
    icon: Users,
    trend: "up"
  },
  {
    title: "Active Surveys",
    value: "8",
    change: "+2",
    icon: BarChart3,
    trend: "up"
  },
  {
    title: "Avg. Completion Rate",
    value: "84.2%",
    change: "+5.3%",
    icon: TrendingUp,
    trend: "up"
  },
  {
    title: "This Month",
    value: "3,891",
    change: "+18.7%",
    icon: Calendar,
    trend: "up"
  }
];

const SurveyDashboard = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Survey Dashboard</h2>
            <p className="text-muted-foreground">Manage your surveys and track performance</p>
          </div>
          <Button variant="hero" size="lg" className="mt-4 md:mt-0">
            <Plus className="mr-2 h-5 w-5" />
            Create New Survey
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

        {/* Recent Surveys */}
        <Card className="shadow-medium">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">Recent Surveys</CardTitle>
                <CardDescription>Monitor your latest survey campaigns</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {surveys.map((survey) => (
                <div key={survey.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-smooth">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-foreground">{survey.title}</h3>
                      <Badge 
                        variant={survey.status === 'Active' ? 'default' : survey.status === 'Draft' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {survey.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {survey.type}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {survey.responses} responses
                      </span>
                      <span className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {survey.completion}% completion
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {survey.created}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SurveyDashboard;