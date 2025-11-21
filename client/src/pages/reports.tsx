import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, BarChart3, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Reports() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-2">
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground">
          Generate comprehensive reports on supply chain and ESG compliance
        </p>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Supply Chain Report</CardTitle>
                <CardDescription>Complete traceability from mine to manufacturer</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Detailed breakdown of all batches, their current stages, and complete chain of custody records.
            </p>
            <Button variant="outline" className="w-full" data-testid="button-download-supply-chain">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>ESG Compliance Report</CardTitle>
                <CardDescription>Environmental, social, and governance metrics</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Aggregate ESG scores, compliance rates, and detailed breakdown by environmental, social, and governance categories.
            </p>
            <Button variant="outline" className="w-full" data-testid="button-download-esg">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Batch Certificates</CardTitle>
                <CardDescription>Individual batch verification certificates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Generate printable certificates with QR codes for international buyers to verify batch authenticity.
            </p>
            <Button variant="outline" className="w-full" data-testid="button-download-certificates">
              <Download className="w-4 h-4 mr-2" />
              Generate Certificates
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Monthly Summary</CardTitle>
                <CardDescription>Monthly production and compliance overview</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Summary of batches registered, processed, and delivered with ESG compliance trends over time.
            </p>
            <Button variant="outline" className="w-full" data-testid="button-download-monthly">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon */}
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">More Reports Coming Soon</h3>
          <p className="text-muted-foreground">
            We're working on additional analytics and reporting features to help you track and improve your supply chain operations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
