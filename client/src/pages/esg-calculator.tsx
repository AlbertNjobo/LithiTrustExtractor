import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Leaf, Users, Briefcase, TrendingUp } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type ESGScores = {
  environmental: number;
  social: number;
  governance: number;
};

const ENVIRONMENTAL_QUESTIONS = [
  {
    id: "water",
    question: "How much water do you use per kg of lithium?",
    options: [
      { label: "Very little (< 50 liters/kg)", score: 90 },
      { label: "Low (50-100 liters/kg)", score: 75 },
      { label: "Moderate (100-200 liters/kg)", score: 60 },
      { label: "High (> 200 liters/kg)", score: 30 },
    ],
  },
  {
    id: "carbon",
    question: "What is your carbon intensity?",
    options: [
      { label: "Very low (< 1 ton CO2/ton ore)", score: 85 },
      { label: "Low (1-2 tons CO2/ton ore)", score: 70 },
      { label: "Moderate (2-4 tons CO2/ton ore)", score: 50 },
      { label: "High (> 4 tons CO2/ton ore)", score: 25 },
    ],
  },
  {
    id: "waste",
    question: "How do you manage waste?",
    options: [
      { label: "Recycling & zero-waste practices", score: 90 },
      { label: "Responsible disposal with monitoring", score: 70 },
      { label: "Basic disposal practices", score: 45 },
      { label: "No formal waste management", score: 10 },
    ],
  },
];

const SOCIAL_QUESTIONS = [
  {
    id: "childlabor",
    question: "Do you ensure no child labor?",
    options: [
      { label: "Yes, verified & documented", score: 95 },
      { label: "Yes, but not formally verified", score: 70 },
      { label: "Unsure", score: 40 },
      { label: "No formal policy", score: 10 },
    ],
  },
  {
    id: "community",
    question: "Do you have community agreements?",
    options: [
      { label: "Yes, signed & benefits shared", score: 90 },
      { label: "Yes, informal agreement", score: 65 },
      { label: "Limited engagement", score: 35 },
      { label: "No community agreement", score: 10 },
    ],
  },
  {
    id: "safety",
    question: "What safety practices do you follow?",
    options: [
      { label: "Professional safety equipment & training", score: 85 },
      { label: "Basic safety equipment", score: 60 },
      { label: "Minimal safety practices", score: 30 },
      { label: "No safety equipment", score: 5 },
    ],
  },
];

const GOVERNANCE_QUESTIONS = [
  {
    id: "license",
    question: "Do you have proper mining licenses?",
    options: [
      { label: "Yes, all licenses current", score: 95 },
      { label: "Yes, some in process", score: 70 },
      { label: "Pending licenses", score: 40 },
      { label: "No formal licenses", score: 10 },
    ],
  },
  {
    id: "transparency",
    question: "How transparent are your records?",
    options: [
      { label: "Complete documentation, audited", score: 90 },
      { label: "Good documentation", score: 70 },
      { label: "Basic records kept", score: 45 },
      { label: "Minimal record-keeping", score: 20 },
    ],
  },
  {
    id: "compliance",
    question: "Do you comply with regulations?",
    options: [
      { label: "Yes, fully compliant", score: 90 },
      { label: "Mostly compliant", score: 65 },
      { label: "Partial compliance", score: 40 },
      { label: "Non-compliant", score: 10 },
    ],
  },
];

export default function ESGCalculator() {
  const [stage, setStage] = useState<"intro" | "environmental" | "social" | "governance" | "results">("intro");
  const [scores, setScores] = useState<ESGScores>({
    environmental: 0,
    social: 0,
    governance: 0,
  });
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [batchWeight, setBatchWeight] = useState("");

  const handleAnswer = (questionId: string, score: number) => {
    setAnswers({ ...answers, [questionId]: score });
  };

  const calculateEnvironmental = () => {
    const envAnswers = Object.values(answers).filter((_, i) => i < 3);
    const avg = envAnswers.length > 0 ? envAnswers.reduce((a, b) => a + b) / envAnswers.length : 0;
    return Math.round(avg);
  };

  const calculateSocial = () => {
    const socialAnswers = Object.values(answers).filter((_, i) => i >= 3 && i < 6);
    const avg = socialAnswers.length > 0 ? socialAnswers.reduce((a, b) => a + b) / socialAnswers.length : 0;
    return Math.round(avg);
  };

  const calculateGovernance = () => {
    const govAnswers = Object.values(answers).filter((_, i) => i >= 6);
    const avg = govAnswers.length > 0 ? govAnswers.reduce((a, b) => a + b) / govAnswers.length : 0;
    return Math.round(avg);
  };

  const handleStageComplete = () => {
    if (stage === "environmental") {
      setScores({ ...scores, environmental: calculateEnvironmental() });
      setStage("social");
    } else if (stage === "social") {
      setScores({ ...scores, social: calculateSocial() });
      setStage("governance");
    } else if (stage === "governance") {
      setScores({ ...scores, governance: calculateGovernance() });
      setStage("results");
    }
  };

  const overallScore = Math.round((scores.environmental + scores.social + scores.governance) / 3);
  const greenPremium = Math.round((overallScore / 100) * 30);
  const totalPrice = batchWeight ? Math.round(parseInt(batchWeight) * 12 * (1 + greenPremium / 100)) : 0;
  const basePrice = batchWeight ? parseInt(batchWeight) * 12 : 0;

  const QuestionCard = ({ question, answered }: { question: any; answered: boolean }) => (
    <Card className={`mb-4 ${answered ? "border-green-500" : ""}`}>
      <CardContent className="pt-6">
        <p className="font-medium mb-4">{question.question}</p>
        <div className="space-y-2">
          {question.options.map((option: any, idx: number) => (
            <Button
              key={idx}
              variant={answers[question.id] === option.score ? "default" : "outline"}
              className="w-full justify-start text-left h-auto py-3 px-4"
              onClick={() => handleAnswer(question.id, option.score)}
              data-testid={`button-answer-${question.id}-${idx}`}
            >
              <div className="flex items-start gap-3 w-full">
                <div className="w-5 h-5 rounded border border-current flex items-center justify-center flex-shrink-0 mt-0.5">
                  {answers[question.id] === option.score && <div className="w-3 h-3 bg-current rounded-sm" />}
                </div>
                <span>{option.label}</span>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const allAnswered = (questions: any[]) => questions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">ESG Score Calculator</h1>
        <p className="text-muted-foreground">
          Answer simple questions to calculate your Environmental, Social, and Governance score
        </p>
      </div>

      {/* Intro */}
      {stage === "intro" && (
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>We'll guide you through 9 simple questions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You don't need to measure anything precise. Just answer based on your current practices.
                We'll calculate your ESG score and show your potential green premium!
              </AlertDescription>
            </Alert>
            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="text-center">
                <Leaf className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Environmental</p>
                <p className="text-xs text-muted-foreground">3 questions</p>
              </div>
              <div className="text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Social</p>
                <p className="text-xs text-muted-foreground">3 questions</p>
              </div>
              <div className="text-center">
                <Briefcase className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Governance</p>
                <p className="text-xs text-muted-foreground">3 questions</p>
              </div>
            </div>
            <Button onClick={() => setStage("environmental")} className="w-full" size="lg" data-testid="button-start-calculator">
              Start Calculator
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Environmental */}
      {stage === "environmental" && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Leaf className="w-5 h-5 text-green-600" />
              <div>
                <CardTitle>Environmental Score</CardTitle>
                <CardDescription>Your water, carbon, and waste practices</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {ENVIRONMENTAL_QUESTIONS.map((q) => (
              <QuestionCard key={q.id} question={q} answered={answers[q.id] !== undefined} />
            ))}
            <Button
              onClick={handleStageComplete}
              disabled={!allAnswered(ENVIRONMENTAL_QUESTIONS)}
              className="w-full"
              data-testid="button-next-social"
            >
              Continue to Social
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Social */}
      {stage === "social" && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <CardTitle>Social Score</CardTitle>
                <CardDescription>Child labor, community, and safety practices</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {SOCIAL_QUESTIONS.map((q) => (
              <QuestionCard key={q.id} question={q} answered={answers[q.id] !== undefined} />
            ))}
            <Button
              onClick={handleStageComplete}
              disabled={!allAnswered(SOCIAL_QUESTIONS)}
              className="w-full"
              data-testid="button-next-governance"
            >
              Continue to Governance
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Governance */}
      {stage === "governance" && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-purple-600" />
              <div>
                <CardTitle>Governance Score</CardTitle>
                <CardDescription>Licenses, transparency, and compliance</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {GOVERNANCE_QUESTIONS.map((q) => (
              <QuestionCard key={q.id} question={q} answered={answers[q.id] !== undefined} />
            ))}
            <Button
              onClick={handleStageComplete}
              disabled={!allAnswered(GOVERNANCE_QUESTIONS)}
              className="w-full"
              data-testid="button-calculate-results"
            >
              Calculate Results
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {stage === "results" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Your ESG Score</CardTitle>
              <CardDescription>Based on your answers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score Breakdown */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{scores.environmental}</div>
                  <p className="text-sm text-muted-foreground">Environmental</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{scores.social}</div>
                  <p className="text-sm text-muted-foreground">Social</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{scores.governance}</div>
                  <p className="text-sm text-muted-foreground">Governance</p>
                </div>
              </div>

              {/* Overall Score */}
              <Card className="border-2 border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Overall ESG Score</p>
                    <div className="text-5xl font-bold text-primary">{overallScore}</div>
                    <Progress value={overallScore} className="h-2 mt-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Green Premium */}
              <Card className="border-green-500/30 bg-green-50 dark:bg-green-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Your Green Premium
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Premium Percentage</p>
                      <p className="text-2xl font-bold text-green-600">+{greenPremium}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Base Price</p>
                      <p className="text-2xl font-bold">${totalPrice > 0 ? basePrice.toLocaleString() : "-"}</p>
                    </div>
                  </div>

                  {/* Price Calculator */}
                  {totalPrice > 0 && (
                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span>Base price ({batchWeight}kg × $12)</span>
                        <span className="font-medium">${basePrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Green premium amount (+{greenPremium}%)</span>
                        <span className="font-medium text-green-600">+${(totalPrice - basePrice).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-base font-bold border-t pt-2 mt-2">
                        <span>Your selling price</span>
                        <span className="text-green-600">${totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Batch Weight */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Batch Weight (kg)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={batchWeight}
                    onChange={(e) => setBatchWeight(e.target.value)}
                    placeholder="e.g., 5000"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    data-testid="input-batch-weight"
                  />
                </div>
              </div>

              {/* Recommendations */}
              {overallScore < 70 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Improvement Opportunities:</strong> Improving your ESG score can increase your green premium
                    significantly. Focus on safety, community agreements, and documentation.
                  </AlertDescription>
                </Alert>
              )}

              {overallScore >= 80 && (
                <Alert className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Excellent Practices!</strong> Your strong ESG score qualifies you for government certification
                    and the maximum 30% green premium.
                  </AlertDescription>
                </Alert>
              )}

              <Button onClick={() => setStage("intro")} variant="outline" className="w-full" data-testid="button-restart-calculator">
                Restart Calculator
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
