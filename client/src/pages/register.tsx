import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Package, Leaf, BarChart3, Shield, Check } from "lucide-react";
import { insertBatchSchema, insertEsgRecordSchema } from "@shared/schema";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useLocation } from "wouter";

const batchFormSchema = insertBatchSchema.extend({
  weight: z.string().min(1, "Weight is required"),
  lithiumContent: z.string().min(1, "Lithium content is required"),
});

const esgFormSchema = insertEsgRecordSchema.omit({ batchId: true }).extend({
  waterUsage: z.string().optional(),
  carbonIntensity: z.string().optional(),
});

type BatchFormValues = z.infer<typeof batchFormSchema>;
type EsgFormValues = z.infer<typeof esgFormSchema>;

const ESG_QUESTIONS = [
  {
    id: "water",
    category: "environmental",
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
    category: "environmental",
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
    category: "environmental",
    question: "How do you manage waste?",
    options: [
      { label: "Recycling & zero-waste practices", score: 90 },
      { label: "Responsible disposal with monitoring", score: 70 },
      { label: "Basic disposal practices", score: 45 },
      { label: "No formal waste management", score: 10 },
    ],
  },
  {
    id: "childlabor",
    category: "social",
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
    category: "social",
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
    category: "social",
    question: "What safety practices do you follow?",
    options: [
      { label: "Professional safety equipment & training", score: 85 },
      { label: "Basic safety equipment", score: 60 },
      { label: "Minimal safety practices", score: 30 },
      { label: "No safety equipment", score: 5 },
    ],
  },
  {
    id: "license",
    category: "governance",
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
    category: "governance",
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
    category: "governance",
    question: "Do you comply with regulations?",
    options: [
      { label: "Yes, fully compliant", score: 90 },
      { label: "Mostly compliant", score: 65 },
      { label: "Partial compliance", score: 40 },
      { label: "Non-compliant", score: 10 },
    ],
  },
];

export default function Register() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [batchData, setBatchData] = useState<BatchFormValues | null>(null);
  const [esgAnswers, setEsgAnswers] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const batchForm = useForm<BatchFormValues>({
    resolver: zodResolver(batchFormSchema),
    defaultValues: {
      mineName: "",
      mineLocation: "",
      minerName: "",
      minerContact: "",
      weight: "",
      grade: "",
      lithiumContent: "",
      currentStage: "mining",
      status: "active",
      createdBy: "",
    },
  });

  const esgForm = useForm<EsgFormValues>({
    resolver: zodResolver(esgFormSchema),
    defaultValues: {
      environmentalScore: 0,
      socialScore: 0,
      governanceScore: 0,
      childLabourCheck: true,
      communityAgreement: false,
      waterUsage: "",
      carbonIntensity: "",
      safetyPractices: "",
      rehabilitationPlan: "",
    },
  });

  const calculateScores = () => {
    const envAnswers = Object.values(esgAnswers).filter((_, i) => i < 3);
    const socialAnswers = Object.values(esgAnswers).filter((_, i) => i >= 3 && i < 6);
    const govAnswers = Object.values(esgAnswers).filter((_, i) => i >= 6);

    const env = envAnswers.length > 0 ? Math.round(envAnswers.reduce((a, b) => a + b) / envAnswers.length) : 0;
    const social = socialAnswers.length > 0 ? Math.round(socialAnswers.reduce((a, b) => a + b) / socialAnswers.length) : 0;
    const gov = govAnswers.length > 0 ? Math.round(govAnswers.reduce((a, b) => a + b) / govAnswers.length) : 0;

    return { env, social, gov };
  };

  const mutation = useMutation({
    mutationFn: async (data: { batch: BatchFormValues; esg: EsgFormValues }) => {
      const batchPayload = {
        ...data.batch,
        weight: data.batch.weight,
        lithiumContent: data.batch.lithiumContent,
      };
      const batchResponse = await apiRequest("POST", "/api/batches", batchPayload);
      const batch = await batchResponse.json();

      const esgPayload = {
        ...data.esg,
        batchId: batch.id,
        waterUsage: data.esg.waterUsage || null,
        carbonIntensity: data.esg.carbonIntensity || null,
      };
      await apiRequest("POST", "/api/batches/esg", esgPayload);

      return batch;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/batches"] });
      toast({
        title: "Success",
        description: "Batch registered successfully with ESG data",
      });
      setLocation("/batches");
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to register batch",
        variant: "destructive",
      });
    },
  });

  const onBatchSubmit = (data: BatchFormValues) => {
    setBatchData(data);
    setStep(2);
  };

  const onEsgSubmit = (data: EsgFormValues) => {
    if (batchData) {
      const scores = calculateScores();
      mutation.mutate({
        batch: batchData,
        esg: {
          ...data,
          environmentalScore: scores.env,
          socialScore: scores.social,
          governanceScore: scores.gov,
        },
      });
    }
  };

  const allQuestionsAnswered = ESG_QUESTIONS.every((q) => esgAnswers[q.id] !== undefined);
  const totalSteps = 2;
  const progressPercentage = (step / totalSteps) * 100;
  const scores = calculateScores();
  const overallScore = Math.round((scores.env + scores.social + scores.gov) / 3);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Register New Batch
        </h1>
        <p className="text-muted-foreground">
          Register a new lithium batch with ESG compliance questionnaire
        </p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {step === 1 ? "Batch Details" : "ESG Questionnaire"}
            </span>
          </div>
          <Progress value={progressPercentage} />
        </CardContent>
      </Card>

      {/* Step 1: Batch Details */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Batch Information</CardTitle>
                <CardDescription>Enter the basic details of your lithium batch</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...batchForm}>
              <form onSubmit={batchForm.handleSubmit(onBatchSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={batchForm.control}
                    name="mineName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mine Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Bikita Mine" {...field} data-testid="input-mine-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={batchForm.control}
                    name="mineLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mine Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Masvingo Province" {...field} data-testid="input-mine-location" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={batchForm.control}
                    name="minerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Miner Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Full name" {...field} data-testid="input-miner-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={batchForm.control}
                    name="minerContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Miner Contact (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone or email" {...field} data-testid="input-miner-contact" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={batchForm.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} data-testid="input-weight" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={batchForm.control}
                    name="lithiumContent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lithium Content (%)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} data-testid="input-lithium-content" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={batchForm.control}
                    name="grade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grade</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-grade">
                              <SelectValue placeholder="Select grade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="spodumene">Spodumene</SelectItem>
                            <SelectItem value="petalite">Petalite</SelectItem>
                            <SelectItem value="lepidolite">Lepidolite</SelectItem>
                            <SelectItem value="amblygonite">Amblygonite</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={batchForm.control}
                    name="currentStage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Stage</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-stage">
                              <SelectValue placeholder="Select stage" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="mining">Mining</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="export">Export</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" data-testid="button-next-step">
                    Next: ESG Calculator
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: ESG Calculator */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>ESG Questionnaire</CardTitle>
                <CardDescription>Answer 9 simple questions about your practices. No measurements needed - just select what describes you best.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...esgForm}>
              <form onSubmit={esgForm.handleSubmit(onEsgSubmit)} className="space-y-8">
                {/* Environmental Questions */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="text-2xl">🌍</span>
                    Environmental Practices
                  </h3>
                  <div className="space-y-4">
                    {ESG_QUESTIONS.filter((q) => q.category === "environmental").map((question) => (
                      <Card key={question.id} className="border">
                        <CardContent className="pt-4">
                          <p className="font-medium mb-3">{question.question}</p>
                          <div className="space-y-2">
                            {question.options.map((option, idx) => (
                              <Button
                                key={idx}
                                variant={esgAnswers[question.id] === option.score ? "default" : "outline"}
                                className="w-full justify-start text-left h-auto py-3 px-4"
                                type="button"
                                onClick={() => setEsgAnswers({ ...esgAnswers, [question.id]: option.score })}
                                data-testid={`button-answer-${question.id}-${idx}`}
                              >
                                <div className="flex items-start gap-3 w-full">
                                  <div className="w-5 h-5 rounded border border-current flex items-center justify-center flex-shrink-0 mt-0.5">
                                    {esgAnswers[question.id] === option.score && <div className="w-3 h-3 bg-current rounded-sm" />}
                                  </div>
                                  <span>{option.label}</span>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Social Questions */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="text-2xl">👥</span>
                    Social Practices
                  </h3>
                  <div className="space-y-4">
                    {ESG_QUESTIONS.filter((q) => q.category === "social").map((question) => (
                      <Card key={question.id} className="border">
                        <CardContent className="pt-4">
                          <p className="font-medium mb-3">{question.question}</p>
                          <div className="space-y-2">
                            {question.options.map((option, idx) => (
                              <Button
                                key={idx}
                                variant={esgAnswers[question.id] === option.score ? "default" : "outline"}
                                className="w-full justify-start text-left h-auto py-3 px-4"
                                type="button"
                                onClick={() => setEsgAnswers({ ...esgAnswers, [question.id]: option.score })}
                                data-testid={`button-answer-${question.id}-${idx}`}
                              >
                                <div className="flex items-start gap-3 w-full">
                                  <div className="w-5 h-5 rounded border border-current flex items-center justify-center flex-shrink-0 mt-0.5">
                                    {esgAnswers[question.id] === option.score && <div className="w-3 h-3 bg-current rounded-sm" />}
                                  </div>
                                  <span>{option.label}</span>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Governance Questions */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="text-2xl">📋</span>
                    Governance Practices
                  </h3>
                  <div className="space-y-4">
                    {ESG_QUESTIONS.filter((q) => q.category === "governance").map((question) => (
                      <Card key={question.id} className="border">
                        <CardContent className="pt-4">
                          <p className="font-medium mb-3">{question.question}</p>
                          <div className="space-y-2">
                            {question.options.map((option, idx) => (
                              <Button
                                key={idx}
                                variant={esgAnswers[question.id] === option.score ? "default" : "outline"}
                                className="w-full justify-start text-left h-auto py-3 px-4"
                                type="button"
                                onClick={() => setEsgAnswers({ ...esgAnswers, [question.id]: option.score })}
                                data-testid={`button-answer-${question.id}-${idx}`}
                              >
                                <div className="flex items-start gap-3 w-full">
                                  <div className="w-5 h-5 rounded border border-current flex items-center justify-center flex-shrink-0 mt-0.5">
                                    {esgAnswers[question.id] === option.score && <div className="w-3 h-3 bg-current rounded-sm" />}
                                  </div>
                                  <span>{option.label}</span>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Score Summary */}
                {allQuestionsAnswered && (
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Environmental</p>
                          <p className="text-2xl font-bold text-green-600">{scores.env}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Social</p>
                          <p className="text-2xl font-bold text-blue-600">{scores.social}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Governance</p>
                          <p className="text-2xl font-bold text-purple-600">{scores.gov}</p>
                        </div>
                        <div className="text-center border-l">
                          <p className="text-xs text-muted-foreground">Overall</p>
                          <p className="text-2xl font-bold text-primary">{overallScore}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-4 text-center">
                        Green Premium: <span className="font-bold text-green-600">+{Math.round((overallScore / 100) * 30)}%</span>
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Additional Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Additional Details (Optional)</h3>
                  <div className="space-y-4">
                    <FormField
                      control={esgForm.control}
                      name="safetyPractices"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Worker Safety Practices</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Example: All workers receive safety training. We provide protective equipment..." {...field} data-testid="textarea-safety-practices" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={esgForm.control}
                      name="rehabilitationPlan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Land Rehabilitation Plan</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Example: We will rehabilitate mined areas by planting indigenous trees..." {...field} data-testid="textarea-rehabilitation-plan" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} data-testid="button-back">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button type="submit" disabled={mutation.isPending || !allQuestionsAnswered} data-testid="button-submit-batch">
                    {mutation.isPending ? (
                      "Registering..."
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Register Batch
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
