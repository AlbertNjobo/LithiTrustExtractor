import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, QrCode, TrendingUp, Users, Leaf, CheckCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-display font-bold text-foreground">LithiTrust</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button 
              onClick={() => window.location.href = '/api/login'}
              data-testid="button-login"
            >
              Log In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Leaf className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Blockchain-Backed Traceability</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
              Transparent, Inclusive & Digital<br />
              <span className="text-primary">Lithium Value Chain</span> for Zimbabwe
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Track lithium ore from mine to manufacturer with ESG certification and QR code verification. 
              Empower artisanal miners and unlock green premiums through complete supply chain transparency.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => window.location.href = '/api/login'}
                data-testid="button-get-started"
                className="text-base"
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                data-testid="button-learn-more"
                className="text-base"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-display font-bold text-primary mb-1">10-30%</div>
                <div className="text-sm text-muted-foreground">Green Premium Potential</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-display font-bold text-primary mb-1">100%</div>
                <div className="text-sm text-muted-foreground">Traceable Supply Chain</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-display font-bold text-primary mb-1">ESG</div>
                <div className="text-sm text-muted-foreground">Certified Compliance</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              How LithiTrust Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A two-layered platform combining blockchain traceability with comprehensive ESG certification
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <QrCode className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">QR Code Verification</h3>
                <p className="text-muted-foreground">
                  Every batch receives a unique QR code that international buyers can scan to verify authenticity and origin
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Blockchain Security</h3>
                <p className="text-muted-foreground">
                  Immutable records track material from mine to manufacturer, ensuring complete chain of custody
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">ESG Compliance</h3>
                <p className="text-muted-foreground">
                  Automated collection and verification of environmental, social, and governance data
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Premium Pricing</h3>
                <p className="text-muted-foreground">
                  Unlock 10-30% green premiums for traceable, ethically-sourced lithium in international markets
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Inclusive Access</h3>
                <p className="text-muted-foreground">
                  Directly empowers artisanal miners, youth, and women currently excluded from the value chain
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <Leaf className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Future-Proof</h3>
                <p className="text-muted-foreground">
                  Meets EU Battery Regulation, US IRA, and CBAM requirements for sustainable sourcing
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
            Ready to Transform Zimbabwe's Lithium Industry?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join the transparent, inclusive, and digital lithium value chain today
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-join-now"
            className="text-base"
          >
            Join LithiTrust Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 LithiTrust by Task Force 404. Lithium Value Chain Hackathon 2025.
          </p>
        </div>
      </footer>
    </div>
  );
}
