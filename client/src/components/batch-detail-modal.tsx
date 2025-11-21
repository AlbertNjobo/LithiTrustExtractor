import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { QrCode as QrCodeIcon, Download, MapPin, Package, Calendar, User, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Batch, SupplyChainEvent, EsgRecord } from "@shared/schema";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import QRCode from "react-qr-code";
import { Progress } from "@/components/ui/progress";

interface BatchDetailModalProps {
  batch: Batch | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BatchDetailModal({ batch, open, onOpenChange }: BatchDetailModalProps) {
  const { data: events, isLoading: eventsLoading } = useQuery<SupplyChainEvent[]>({
    queryKey: ["/api/batches", batch?.id, "events"],
    enabled: !!batch?.id && open,
  });

  const { data: esg, isLoading: esgLoading } = useQuery<EsgRecord>({
    queryKey: ["/api/batches", batch?.id, "esg"],
    enabled: !!batch?.id && open,
  });

  if (!batch) return null;

  const qrCodeValue = `https://lithitrust.replit.app/verify/${batch.id}`;

  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      
      const downloadLink = document.createElement("a");
      downloadLink.download = `batch-${batch.batchNumber}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const overallEsgScore = esg
    ? Math.round((esg.environmentalScore + esg.socialScore + esg.governanceScore) / 3)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Package className="w-6 h-6 text-primary" />
            <span className="font-mono">{batch.batchNumber}</span>
            <Badge variant="default" className="capitalize">
              {batch.currentStage}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="history" data-testid="tab-history">History</TabsTrigger>
            <TabsTrigger value="esg" data-testid="tab-esg">ESG Data</TabsTrigger>
            <TabsTrigger value="qr" data-testid="tab-qr">QR Code</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Batch Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Batch Number</p>
                  <p className="font-mono font-medium" data-testid="text-detail-batch-number">{batch.batchNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <Badge variant="default" className="capitalize">
                    {batch.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Weight</p>
                  <p className="font-medium">{batch.weight} kg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Lithium Content</p>
                  <p className="font-medium">{batch.lithiumContent}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Grade</p>
                  <p className="font-medium capitalize">{batch.grade}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Created</p>
                  <p className="font-medium">
                    {batch.createdAt ? format(new Date(batch.createdAt), "MMM d, yyyy") : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Mine Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Mine Information</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Mine Name</p>
                    <p className="font-medium">{batch.mineName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{batch.mineLocation}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Miner</p>
                    <p className="font-medium">{batch.minerName}</p>
                    {batch.minerContact && (
                      <p className="text-sm text-muted-foreground">{batch.minerContact}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Blockchain Hash */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Blockchain Verification</h3>
              <div className="p-4 rounded-md bg-accent/50 border border-accent-border">
                <p className="text-sm text-muted-foreground mb-2">Blockchain Hash</p>
                <p className="font-mono text-sm break-all" data-testid="text-blockchain-hash">{batch.blockchainHash}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold">Supply Chain Timeline</h3>
            
            {eventsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                ))}
              </div>
            ) : events && events.length > 0 ? (
              <div className="space-y-6">
                {events.map((event, index) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      {index < events.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h4 className="font-semibold capitalize">{event.stage}</h4>
                          <p className="text-sm text-muted-foreground">{event.stakeholder}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {event.timestamp ? format(new Date(event.timestamp), "MMM d, yyyy") : "N/A"}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="text-muted-foreground">
                          <MapPin className="w-3 h-3 inline mr-1" />
                          {event.location}
                        </p>
                        {event.organization && (
                          <p className="text-muted-foreground">{event.organization}</p>
                        )}
                        {event.notes && (
                          <p className="text-foreground mt-2">{event.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No supply chain events recorded yet
              </div>
            )}
          </TabsContent>

          <TabsContent value="esg" className="space-y-6 mt-6">
            <h3 className="text-lg font-semibold">ESG Compliance</h3>

            {esgLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : esg ? (
              <>
                {/* Overall Score */}
                <div className="p-6 rounded-md bg-primary/5 border border-primary/20 text-center">
                  <div className="text-5xl font-bold text-primary mb-2" data-testid="text-esg-score">
                    {overallEsgScore}
                  </div>
                  <p className="text-muted-foreground">Overall ESG Score</p>
                  <Progress value={overallEsgScore} className="mt-4" />
                </div>

                {/* Individual Scores */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-md border border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-chart-1" />
                      <h4 className="font-semibold">Environmental</h4>
                    </div>
                    <div className="text-3xl font-bold text-chart-1 mb-2">
                      {esg.environmentalScore}
                    </div>
                    <Progress value={esg.environmentalScore} className="mb-2" />
                    {esg.waterUsage && (
                      <p className="text-xs text-muted-foreground">
                        Water Usage: {esg.waterUsage}L
                      </p>
                    )}
                    {esg.carbonIntensity && (
                      <p className="text-xs text-muted-foreground">
                        Carbon: {esg.carbonIntensity} kg CO₂e/ton
                      </p>
                    )}
                  </div>

                  <div className="p-4 rounded-md border border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-5 h-5 text-chart-2" />
                      <h4 className="font-semibold">Social</h4>
                    </div>
                    <div className="text-3xl font-bold text-chart-2 mb-2">
                      {esg.socialScore}
                    </div>
                    <Progress value={esg.socialScore} className="mb-2" />
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Child Labour Check: {esg.childLabourCheck ? "✓ Passed" : "✗ Failed"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Community Agreement: {esg.communityAgreement ? "✓ Yes" : "✗ No"}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-md border border-border">
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="w-5 h-5 text-chart-3" />
                      <h4 className="font-semibold">Governance</h4>
                    </div>
                    <div className="text-3xl font-bold text-chart-3 mb-2">
                      {esg.governanceScore}
                    </div>
                    <Progress value={esg.governanceScore} />
                  </div>
                </div>

                {/* Additional Information */}
                {(esg.safetyPractices || esg.rehabilitationPlan) && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      {esg.safetyPractices && (
                        <div>
                          <h4 className="font-semibold mb-2">Safety Practices</h4>
                          <p className="text-sm text-muted-foreground">{esg.safetyPractices}</p>
                        </div>
                      )}
                      {esg.rehabilitationPlan && (
                        <div>
                          <h4 className="font-semibold mb-2">Rehabilitation Plan</h4>
                          <p className="text-sm text-muted-foreground">{esg.rehabilitationPlan}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No ESG data recorded yet
              </div>
            )}
          </TabsContent>

          <TabsContent value="qr" className="mt-6">
            <div className="flex flex-col items-center gap-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Batch QR Code</h3>
                <p className="text-sm text-muted-foreground">
                  Scan to verify batch authenticity and view complete traceability
                </p>
              </div>

              <div className="p-6 bg-white rounded-md" data-testid="qr-code-container">
                <QRCode
                  id="qr-code"
                  value={qrCodeValue}
                  size={256}
                  level="H"
                />
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-4">
                  {qrCodeValue}
                </p>
                <Button
                  variant="outline"
                  onClick={downloadQRCode}
                  data-testid="button-download-qr"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
