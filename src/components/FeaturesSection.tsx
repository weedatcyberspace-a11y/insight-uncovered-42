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
    title: "Lightning Fast Setup",
    description: "Create professional surveys in minutes with our intuitive drag-and-drop builder.",
    gradient: "gradient-primary"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Get real-time insights with powerful charts, graphs, and statistical analysis.",
    gradient: "gradient-accent"
  },
  {
    icon: Users,
    title: "Audience Management",
    description: "Target the right respondents with advanced demographic and behavioral filters.",
    gradient: "gradient-primary"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and GDPR compliance to protect your valuable data.",
    gradient: "gradient-accent"
  },
  {
    icon: Globe,
    title: "Global Distribution",
    description: "Reach audiences worldwide with multi-language support and localization.",
    gradient: "gradient-primary"
  },
  {
    icon: Target,
    title: "Smart Targeting",
    description: "AI-powered targeting ensures you get quality responses from your ideal audience.",
    gradient: "gradient-accent"
  }
];

const stats = [
  {
    icon: TrendingUp,
    label: "Higher Response Rates",
    value: "3x",
    description: "Compared to traditional methods"
  },
  {
    icon: Clock,
    label: "Faster Data Collection",
    value: "75%",
    description: "Reduce time to insights"
  },
  {
    icon: CheckCircle,
    label: "Data Accuracy",
    value: "99.2%",
    description: "Clean, validated responses"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Everything You Need for
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Market Research</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From survey creation to data analysis, our comprehensive platform provides all the tools 
            you need to gather insights and make informed business decisions.
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