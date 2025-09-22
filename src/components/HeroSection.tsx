import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, ArrowRight, Users, BarChart3, Target } from "lucide-react";
import heroImage from "@/assets/hero-survey-analytics.jpg";

const HeroSection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block">
                <span className="bg-gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-soft">
                  #1 Survey Platform for Businesses
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Turn Customer
                <span className="bg-gradient-hero bg-clip-text text-transparent"> Insights</span>
                <br />
                Into Business Growth
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Create professional surveys, collect valuable data, and make data-driven decisions that grow your business. Trusted by 10,000+ companies worldwide.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" className="group">
                Start Creating Surveys
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button variant="outline" size="xl" className="group">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Active Companies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">2M+</div>
                <div className="text-sm text-muted-foreground">Surveys Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-strong">
              <img 
                src={heroImage} 
                alt="Survey analytics dashboard showing data insights and business intelligence" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-card opacity-20"></div>
            </div>
            
            {/* Floating Cards */}
            <Card className="absolute -left-4 top-16 p-4 shadow-medium bg-card/90 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-accent p-2 rounded-lg">
                  <Users className="h-4 w-4 text-accent-foreground" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Response Rate</div>
                  <div className="text-lg font-bold text-accent">+127%</div>
                </div>
              </div>
            </Card>
            
            <Card className="absolute -right-4 bottom-16 p-4 shadow-medium bg-card/90 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-primary p-2 rounded-lg">
                  <BarChart3 className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Data Quality</div>
                  <div className="text-lg font-bold text-primary">96.8%</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;