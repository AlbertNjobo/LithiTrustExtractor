import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp, Shield, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Batch } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user } = useAuth();
  const { data: batches, isLoading } = useQuery<Batch[]>({
    queryKey: ["/api/batches"],
  });

  const activeBatches = batches?.filter(b => b.status === "active") || [];
  const verifiedBatches = batches?.filter(b => b.status === "verified") || [];
  const totalBatches = batches?.length || 0;

  const stageCounts = batches?.reduce((acc, batch) => {
    acc[batch.currentStage] = (acc[batch.currentStage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Welcome back, {user?.firstName}
        </h1>
        <p className="text-muted-foreground">
          Track your lithium batches and monitor supply chain progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold" data-testid="stat-total-batches">{totalBatches}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  All registered batches
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Batches</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-primary" data-testid="stat-active-batches">{activeBatches.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  In transit
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <Shield className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-chart-1" data-testid="stat-verified-batches">{verifiedBatches.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  ESG certified
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold text-chart-2" data-testid="stat-completion-rate">
                  {totalBatches > 0 ? Math.round((verifiedBatches.length / totalBatches) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Fully traced
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Supply Chain Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Supply Chain Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['mining', 'processing', 'export', 'delivered'].map((stage) => (
                <div key={stage} className="p-4 rounded-md bg-accent/50 border border-accent-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground capitalize">
                      {stage}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {stageCounts[stage] || 0}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {stageCounts[stage] || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    batches in {stage}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Batches</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : batches && batches.length > 0 ? (
            <div className="space-y-4">
              {batches.slice(0, 5).map((batch) => (
                <div
                  key={batch.id}
                  className="flex items-center gap-4 p-3 rounded-md hover-elevate border border-border"
                  data-testid={`batch-item-${batch.id}`}
                >
                  <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-medium text-foreground truncate">
                        {batch.batchNumber}
                      </span>
                      <Badge
                        variant={batch.status === "verified" ? "default" : "secondary"}
                        className="text-xs capitalize"
                      >
                        {batch.currentStage}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {batch.mineName} • {batch.weight}kg • {batch.lithiumContent}% Li
                    </p>
                  </div>
                  <a
                    href={`/batches/${batch.id}`}
                    className="text-sm text-primary hover:underline flex-shrink-0"
                    data-testid={`link-view-batch-${batch.id}`}
                  >
                    View Details
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No batches registered yet</p>
              <a href="/register" className="text-primary hover:underline">
                Register your first batch
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
