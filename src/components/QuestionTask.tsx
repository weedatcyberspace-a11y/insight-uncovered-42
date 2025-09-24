import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, CheckCircle, XCircle, DollarSign } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const questionBank: Question[] = [
  {
    id: '1',
    question: 'What is the capital of France?',
    options: ['London', 'Paris', 'Berlin', 'Rome'],
    correctAnswer: 1,
    reward: 0.50,
    difficulty: 'easy'
  },
  {
    id: '2',
    question: 'What is 15 + 27?',
    options: ['40', '42', '43', '45'],
    correctAnswer: 1,
    reward: 0.25,
    difficulty: 'easy'
  },
  {
    id: '3',
    question: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Jupiter', 'Mars', 'Saturn'],
    correctAnswer: 2,
    reward: 0.75,
    difficulty: 'medium'
  },
  {
    id: '4',
    question: 'What is the largest ocean on Earth?',
    options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
    correctAnswer: 3,
    reward: 0.60,
    difficulty: 'medium'
  },
  {
    id: '5',
    question: 'Who wrote "Romeo and Juliet"?',
    options: ['Charles Dickens', 'William Shakespeare', 'Mark Twain', 'Jane Austen'],
    correctAnswer: 1,
    reward: 0.80,
    difficulty: 'medium'
  },
  {
    id: '6',
    question: 'What is the chemical symbol for gold?',
    options: ['Go', 'Au', 'Ag', 'Gd'],
    correctAnswer: 1,
    reward: 1.00,
    difficulty: 'hard'
  },
  {
    id: '7',
    question: 'In what year did World War II end?',
    options: ['1944', '1945', '1946', '1947'],
    correctAnswer: 1,
    reward: 0.90,
    difficulty: 'hard'
  },
  {
    id: '8',
    question: 'What is the square root of 144?',
    options: ['11', '12', '13', '14'],
    correctAnswer: 1,
    reward: 0.40,
    difficulty: 'easy'
  },
  {
    id: '9',
    question: 'Which country is home to Machu Picchu?',
    options: ['Brazil', 'Chile', 'Peru', 'Bolivia'],
    correctAnswer: 2,
    reward: 0.70,
    difficulty: 'medium'
  },
  {
    id: '10',
    question: 'What is the fastest land animal?',
    options: ['Lion', 'Cheetah', 'Leopard', 'Tiger'],
    correctAnswer: 1,
    reward: 0.55,
    difficulty: 'easy'
  }
];

const QuestionTask = () => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    getNewQuestion();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  };

  const getNewQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questionBank.length);
    setCurrentQuestion(questionBank[randomIndex]);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = async () => {
    if (selectedAnswer === null || !currentQuestion) return;

    setShowResult(true);
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setQuestionsAnswered(prev => prev + 1);
      setTotalEarnings(prev => prev + currentQuestion.reward);

      if (user) {
        await updateUserBalance(currentQuestion.reward);
      }

      toast({
        title: "Correct! 🎉",
        description: `You earned $${currentQuestion.reward.toFixed(2)}!`,
        duration: 2000,
      });
    } else {
      toast({
        title: "Incorrect ❌",
        description: "Don't worry, try another question!",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const updateUserBalance = async (reward: number) => {
    if (!user) return;

    setLoading(true);
    
    // Get current profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("available_balance, total_earnings")
      .eq("user_id", user.id)
      .single();

    if (profile) {
      const newBalance = (profile.available_balance || 0) + reward;
      const newEarnings = (profile.total_earnings || 0) + reward;

      const { error } = await supabase
        .from("profiles")
        .update({
          available_balance: newBalance,
          total_earnings: newEarnings
        })
        .eq("user_id", user.id);

      if (!error) {
        // Log the transaction
        await supabase
          .from("transactions")
          .insert({
            user_id: user.id,
            amount: reward,
            transaction_type: 'earning',
            description: `Question answered correctly: "${currentQuestion?.question?.substring(0, 50)}..."`,
            status: 'completed'
          });
      }
    }
    
    setLoading(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!currentQuestion) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading questions...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Stats Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{questionsAnswered}</p>
                <p className="text-sm text-muted-foreground">Questions Answered</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">${totalEarnings.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Total Earned</p>
              </div>
            </div>
            {user && (
              <Button onClick={() => window.location.href = '/profile'} variant="outline" size="sm">
                View Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                {currentQuestion.difficulty.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-green-600">
                <DollarSign className="w-3 h-3 mr-1" />
                {currentQuestion.reward.toFixed(2)}
              </Badge>
            </div>
          </div>
          <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
          <CardDescription>
            Select the correct answer to earn ${currentQuestion.reward.toFixed(2)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = "w-full text-left p-4 border rounded-lg transition-all";
              
              if (showResult) {
                if (index === currentQuestion.correctAnswer) {
                  buttonClass += " bg-green-100 border-green-500 text-green-800";
                } else if (index === selectedAnswer && !isCorrect) {
                  buttonClass += " bg-red-100 border-red-500 text-red-800";
                } else {
                  buttonClass += " bg-gray-100 border-gray-300 text-gray-600";
                }
              } else {
                buttonClass += selectedAnswer === index 
                  ? " bg-primary/10 border-primary" 
                  : " hover:bg-muted border-border";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={buttonClass}
                  disabled={showResult}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && index === currentQuestion.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {showResult && index === selectedAnswer && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-3">
            {!showResult ? (
              <Button 
                onClick={submitAnswer}
                disabled={selectedAnswer === null}
                className="flex-1"
              >
                Submit Answer
              </Button>
            ) : (
              <Button 
                onClick={getNewQuestion}
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Next Question
              </Button>
            )}
          </div>

          {showResult && (
            <Card className={isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <p className={isCorrect ? "text-green-800" : "text-red-800"}>
                    {isCorrect 
                      ? `Correct! You earned $${currentQuestion.reward.toFixed(2)}`
                      : `Incorrect. The correct answer was: ${currentQuestion.options[currentQuestion.correctAnswer]}`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground text-center space-y-2">
          <p>💡 Answer questions correctly to earn money instantly</p>
          <p>🔄 Keep answering to accumulate more earnings</p>
          <p>💰 Higher difficulty questions offer better rewards</p>
          {!user && <p>🔒 Sign in to save your earnings to your account</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionTask;