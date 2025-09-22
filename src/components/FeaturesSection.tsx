import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Zap, 
  BarChart3, 
  Users, 
  Shield, 
  Globe, 
  Target,
  TrendingUp,
  CheckCircle,
  Clock
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Quick Tasks",
    description: "Complete simple surveys, polls, and questionnaires in just 2-5 minutes each.",
    gradient: "gradient-primary"
  },
  {
    icon: BarChart3,
    title: "Video Watching",
    description: "Watch short videos and ads to earn money. Each video pays between $0.10-$0.50.",
    gradient: "gradient-accent"
  },
  {
    icon: Users,
    title: "App Testing",
    description: "Test new apps and websites, provide feedback and earn $2-$10 per test.",
    gradient: "gradient-primary"
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Get paid instantly via PayPal, bank transfer, or gift cards. Minimum payout $5.",
    gradient: "gradient-accent"
  },
  {
    icon: Globe,
    title: "Global Tasks",
    description: "Access tasks from companies worldwide. Available 24/7 with new tasks daily.",
    gradient: "gradient-primary"
  },
  {
    icon: Target,
    title: "Smart Matching",
    description: "AI matches you with high-paying tasks based on your profile and interests.",
    gradient: "gradient-accent"
  }
];

const stats = [
  {
    icon: TrendingUp,
    label: "Average Daily Earnings",
    value: "$25",
    description: "Active users earn daily"
  },
  {
    icon: Clock,
    label: "Tasks Available",
    value: "500+",
    description: "New tasks added daily"
  },
  {
    icon: CheckCircle,
    label: "Payment Success Rate",
    value: "99.9%",
    description: "On-time payments guaranteed"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Multiple Ways to
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Earn Money</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose from various task types that fit your schedule. From quick 2-minute surveys 
            to longer app testing sessions - there's always a way to earn.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-medium transition-smooth border-border/50 hover:border-primary/20">
              <CardHeader>
                <div className={`inline-flex w-12 h-12 items-center justify-center rounded-lg bg-${feature.gradient} mb-4 group-hover:shadow-glow transition-smooth`}>
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-smooth">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-gradient-card rounded-2xl p-8 shadow-soft">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-lg font-semibold text-foreground mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;