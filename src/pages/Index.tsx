import SurveyHeader from "@/components/SurveyHeader";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TaskDashboard from "@/components/TaskDashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SurveyHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TaskDashboard />
      </main>
    </div>
  );
};

export default Index;