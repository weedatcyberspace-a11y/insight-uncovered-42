import SurveyHeader from "@/components/SurveyHeader";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import SurveyDashboard from "@/components/SurveyDashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SurveyHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <SurveyDashboard />
      </main>
    </div>
  );
};

export default Index;