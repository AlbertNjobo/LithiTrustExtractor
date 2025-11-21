import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, MapPin, Calendar, QrCode } from "lucide-react";
import type { Batch } from "@shared/schema";
import { format } from "date-fns";

interface BatchCardProps {
  batch: Batch;
  onViewDetails: (batch: Batch) => void;
}

const stageColors: Record<string, "default" | "secondary" | "outline"> = {
  mining: "secondary",
  processing: "default",
  export: "default",
  delivered: "outline",
};

const statusColors: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  verified: "default",
  completed: "outline",
};

export function BatchCard({ batch, onViewDetails }: BatchCardProps) {
  return (
    <Card className="hover-elevate active-elevate-2 cursor-pointer" onClick={() => onViewDetails(batch)} data-testid={`card-batch-${batch.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="font-mono text-sm font-semibold text-foreground truncate" data-testid={`text-batch-number-${batch.id}`}>
                {batch.batchNumber}
              </h3>
              <p className="text-xs text-muted-foreground truncate">{batch.mineName}</p>
            </div>
          </div>
          <QrCode className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant={stageColors[batch.currentStage]} className="capitalize text-xs">
            {batch.currentStage}
          </Badge>
          <Badge variant={statusColors[batch.status]} className="capitalize text-xs">
            {batch.status}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{batch.mineLocation}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>{batch.createdAt ? format(new Date(batch.createdAt), "MMM d, yyyy") : "N/A"}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Weight</p>
            <p className="text-sm font-semibold text-foreground">{batch.weight} kg</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Li Content</p>
            <p className="text-sm font-semibold text-foreground">{batch.lithiumContent}%</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(batch);
          }}
          data-testid={`button-view-details-${batch.id}`}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
