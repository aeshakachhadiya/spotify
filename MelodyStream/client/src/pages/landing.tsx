import { Button } from "@/components/ui/button";
import { Music, Play, Users, Headphones } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Spotify Clone</span>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-login"
            >
              Log in
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <div className="absolute inset-0 gradient-overlay"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-6" data-testid="text-hero-title">
              Music for everyone.
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-hero-description">
              Millions of songs. No credit card needed. Discover your new favorite tracks and create playlists that match your mood.
            </p>
            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-4"
              data-testid="button-get-started"
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16" data-testid="text-features-title">
            Why choose our music platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <Play className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2" data-testid="text-feature-streaming">Unlimited Streaming</h3>
              <p className="text-muted-foreground">Stream millions of songs with high-quality audio playback and seamless listening experience.</p>
            </div>
            <div className="text-center p-6">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2" data-testid="text-feature-playlists">Custom Playlists</h3>
              <p className="text-muted-foreground">Create and manage your own playlists. Organize your favorite tracks by mood, genre, or any theme you like.</p>
            </div>
            <div className="text-center p-6">
              <Headphones className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2" data-testid="text-feature-quality">High Quality Audio</h3>
              <p className="text-muted-foreground">Enjoy crystal-clear sound quality with our advanced audio streaming technology.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6" data-testid="text-cta-title">
            Ready to start listening?
          </h2>
          <p className="text-xl text-muted-foreground mb-8" data-testid="text-cta-description">
            Join millions of music lovers and discover your next favorite song today.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-4"
            data-testid="button-join-now"
          >
            Join Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-2">
            <Music className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Spotify Clone</span>
          </div>
          <p className="text-center text-muted-foreground mt-4" data-testid="text-footer">
            © 2025 Spotify Clone. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
