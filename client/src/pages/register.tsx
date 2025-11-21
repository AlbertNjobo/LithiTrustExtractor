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
import { ArrowLeft, ArrowRight, Package, MapPin, BarChart3, Shield, Check } from "lucide-react";
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

export default function Register() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [batchData, setBatchData] = useState<BatchFormValues | null>(null);
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
      mutation.mutate({ batch: batchData, esg: data });
    }
  };

  const totalSteps = 2;
  const progressPercentage = (step / totalSteps) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Register New Batch
        </h1>
        <p className="text-muted-foreground">
          Register a new lithium batch and record ESG compliance data
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
              {step === 1 ? "Batch Details" : "ESG Compliance"}
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
                    Next: ESG Data
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: ESG Compliance */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>ESG Compliance</CardTitle>
                <CardDescription>Record environmental, social, and governance data. Your scores directly determine your green premium pricing (0-30% price increase). Need help? See ESG_GUIDE.md</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Form {...esgForm}>
              <form onSubmit={esgForm.handleSubmit(onEsgSubmit)} className="space-y-8">
                {/* ESG Scores Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    ESG Scores (Calculate using ESG_GUIDE.md)
                  </h3>
                  <div className="bg-secondary/50 p-4 rounded-md mb-4">
                    <p className="text-sm text-muted-foreground">
                      💡 <strong>How to calculate:</strong> Each score measures your practices. Environmental = water usage + carbon footprint. Social = child labor + community agreements. Governance = compliance + transparency. Your overall score = (E+S+G)÷3
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={esgForm.control}
                      name="environmentalScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Environmental Score (0-100)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="100" {...field} onChange={e => field.onChange(parseInt(e.target.value))} placeholder="0" data-testid="input-environmental-score" />
                          </FormControl>
                          <p className="text-xs text-muted-foreground mt-1">Water usage, carbon emissions, rehabilitation</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={esgForm.control}
                      name="socialScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Social Score (0-100)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="100" {...field} onChange={e => field.onChange(parseInt(e.target.value))} placeholder="0" data-testid="input-social-score" />
                          </FormControl>
                          <p className="text-xs text-muted-foreground mt-1">No child labor, community agreements, worker safety</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={esgForm.control}
                      name="governanceScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Governance Score (0-100)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="100" {...field} onChange={e => field.onChange(parseInt(e.target.value))} placeholder="0" data-testid="input-governance-score" />
                          </FormControl>
                          <p className="text-xs text-muted-foreground mt-1">Licenses, compliance, transparency, audit records</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Detailed Environmental Data */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Environmental Details (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={esgForm.control}
                      name="waterUsage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Water Usage (liters per ton of ore)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="30000" {...field} data-testid="input-water-usage" />
                          </FormControl>
                          <p className="text-xs text-muted-foreground mt-1">Example: 30,000 = good recycling practices</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={esgForm.control}
                      name="carbonIntensity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Carbon Intensity (kg CO₂e per ton)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="600" {...field} data-testid="input-carbon-intensity" />
                          </FormControl>
                          <p className="text-xs text-muted-foreground mt-1">Example: 600 = efficient equipment + some renewable energy</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Safety & Plans */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Social & Safety Practices</h3>
                  <div className="space-y-4">
                    <FormField
                      control={esgForm.control}
                      name="safetyPractices"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Worker Safety Practices (Optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Example: All workers receive 8-hour safety training. We provide hard hats, masks, gloves, boots. Safety committee meets monthly. Zero accidents in last year..." {...field} data-testid="textarea-safety-practices" />
                          </FormControl>
                          <p className="text-xs text-muted-foreground mt-1">Describe your worker protection measures and safety records</p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={esgForm.control}
                      name="rehabilitationPlan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Land Rehabilitation Plan (Optional)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Example: After mining ends, we will rehabilitate areas over 3 years. Plant 10,000 indigenous trees. Restore water sources. Monthly monitoring. Budget: $50,000..." {...field} data-testid="textarea-rehabilitation-plan" />
                          </FormControl>
                          <p className="text-xs text-muted-foreground mt-1">Describe your plan to restore mined areas after extraction</p>
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
                  <Button type="submit" disabled={mutation.isPending} data-testid="button-submit-batch">
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
