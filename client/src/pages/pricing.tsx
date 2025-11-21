import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, DollarSign, Leaf } from "lucide-react";
import type { Batch } from "@shared/schema";

interface PricingData {
  batchId: string;
  weight: number;
  basePrice: number;
  baseTotal: number;
  esgScore: number;
  greenPremium: number;
  premiumAmount: number;
  totalPrice: number;
}

export default function Pricing() {
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");

  const { data: batches, isLoading: batchesLoading } = useQuery<Batch[]>({
    queryKey: ["/api/batches"],
  });

  const { data: pricing, isLoading: pricingLoading } = useQuery<PricingData>({
    queryKey: ["/api/pricing/calculator", selectedBatchId],
    enabled: !!selectedBatchId,
  });

  const getPremiumColor = (premium: number) => {
    if (premium >= 25) return "text-green-600 dark:text-green-400";
    if (premium >= 15) return "text-blue-600 dark:text-blue-400";
    return "text-amber-600 dark:text-amber-400";
  };

  const getEsgBadgeVariant = (score: number) => {
    if (score >= 75) return "default";
    if (score >= 50) return "secondary";
    return "outline";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Premium Pricing Calculator
        </h1>
        <p className="text-muted-foreground">
          Calculate green premium potential based on ESG compliance scores
        </p>
      </div>

      {/* Batch Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Select a Batch
          </CardTitle>
          <CardDescription>Choose a batch to see its pricing potential</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
            <SelectTrigger className="w-full" data-testid="select-batch-pricing">
              <SelectValue placeholder="Select a batch..." />
            </SelectTrigger>
            <SelectContent>
              {batchesLoading ? (
                <SelectItem value="">Loading batches...</SelectItem>
              ) : batches && batches.length > 0 ? (
                batches.map((batch) => (
                  <SelectItem key={batch.id} value={batch.id}>
                    {batch.batchNumber} - {batch.mineName}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="">No batches available</SelectItem>
              )}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Pricing Details */}
      {selectedBatchId && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Base Pricing Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Base Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pricingLoading ? (
                <>
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-32" />
                </>
              ) : pricing ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Weight (kg)</span>
                    <span className="font-mono font-bold">{pricing.weight.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Base Price per kg</span>
                    <span className="font-mono font-bold">${pricing.basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-medium">Base Total</span>
                    <span className="font-mono text-lg font-bold">${pricing.baseTotal.toFixed(2)}</span>
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>

          {/* ESG Premium Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Leaf className="w-5 h-5 text-primary" />
                ESG Green Premium
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pricingLoading ? (
                <>
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-32" />
                </>
              ) : pricing ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">ESG Score</span>
                    <Badge variant={getEsgBadgeVariant(pricing.esgScore)}>
                      {pricing.esgScore}/100
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Green Premium</span>
                    <span className={`font-mono font-bold ${getPremiumColor(pricing.greenPremium)}`}>
                      +{pricing.greenPremium}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-medium">Premium Value</span>
                    <span className={`font-mono text-lg font-bold ${getPremiumColor(pricing.greenPremium)}`}>
                      +${pricing.premiumAmount.toFixed(2)}
                    </span>
                  </div>
                </>
              ) : null}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Final Price */}
      {selectedBatchId && pricing && (
        <Card className="border-primary bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Total Selling Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-5xl font-display font-bold text-primary">
                ${pricing.totalPrice.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground">
                Base: ${pricing.baseTotal.toFixed(2)} + Green Premium: ${pricing.premiumAmount.toFixed(2)}
              </p>
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-foreground">
                  💡 Increase your ESG score to unlock a higher green premium and maximize revenue from sustainable mining practices.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Section */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-base">How Green Premium Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>
            <span className="font-semibold">ESG Score Calculation:</span> Average of Environmental, Social, and Governance scores (0-100 scale)
          </p>
          <p>
            <span className="font-semibold">Green Premium:</span> Up to 30% price increase based on ESG score (ESG Score / 100 × 30%)
          </p>
          <p>
            <span className="font-semibold">Base Price:</span> $12 per kg of lithium (market reference)
          </p>
          <p>
            <span className="font-semibold">Sustainability Incentive:</span> Higher ESG scores directly translate to better market prices, incentivizing responsible mining practices.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
