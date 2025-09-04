import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/sidebar";
import MusicPlayer from "@/components/music-player";
import PlaylistGrid from "@/components/playlist-grid";
import ArtistGrid from "@/components/artist-grid";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu } from "lucide-react";
import type { Song } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const { data: songs = [], isLoading: songsLoading } = useQuery({
    queryKey: ["/api/songs"],
    retry: false,
    enabled: isAuthenticated,
  });

  const { data: playlists = [], isLoading: playlistsLoading } = useQuery({
    queryKey: ["/api/playlists"],
    retry: false,
    enabled: isAuthenticated,
  });

  const { data: likedSongs = [], isLoading: likedSongsLoading } = useQuery({
    queryKey: ["/api/liked-songs"],
    retry: false,
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const filteredSongs = songs.filter((song: Song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.album?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentlyPlayed = [
    { id: "liked", name: "Liked Songs", type: "Playlist", image: "/placeholder-album.jpg" },
    ...playlists.slice(0, 2).map((p: any) => ({ 
      id: p.id, 
      name: p.name, 
      type: "Playlist", 
      image: p.coverImageUrl || "/placeholder-album.jpg" 
    }))
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
          data-testid="overlay-sidebar"
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        playlists={playlists}
        data-testid="sidebar-main"
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-card p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setSidebarOpen(true)}
                data-testid="button-menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden md:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full bg-muted"
                  data-testid="button-back"
                >
                  ←
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full bg-muted"
                  data-testid="button-forward"
                >
                  →
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search for songs, artists, or albums"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-80 pl-10 bg-input border-border rounded-full"
                  data-testid="input-search"
                />
              </div>
              <Button
                onClick={() => window.location.href = '/api/logout'}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-logout"
              >
                Log out
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-secondary/20 to-background pb-24">
          <div className="p-6">
            {/* Hero Section */}
            <section className="mb-8">
              <div className="relative h-80 rounded-lg overflow-hidden gradient-overlay bg-gradient-to-r from-purple-900 to-blue-900">
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                  <h1 className="text-5xl font-bold mb-4" data-testid="text-greeting">
                    Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}
                    {user?.firstName && `, ${user.firstName}`}
                  </h1>
                  <p className="text-xl text-muted-foreground" data-testid="text-hero-subtitle">
                    Discover your new favorite songs
                  </p>
                </div>
              </div>
            </section>

            {/* Recently Played */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-6" data-testid="text-recently-played">Recently played</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentlyPlayed.map((item) => (
                  <div 
                    key={item.id}
                    className="album-card bg-card p-4 rounded-lg cursor-pointer hover:bg-card/80 transition-colors"
                    data-testid={`card-recent-${item.id}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                        <span className="text-lg">♪</span>
                      </div>
                      <div>
                        <h3 className="font-semibold" data-testid={`text-recent-name-${item.id}`}>{item.name}</h3>
                        <p className="text-sm text-muted-foreground" data-testid={`text-recent-type-${item.id}`}>{item.type}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* All Songs */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-6" data-testid="text-all-songs">
                {searchQuery ? `Search results for "${searchQuery}"` : "All Songs"}
              </h2>
              {songsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-card p-4 rounded-lg animate-pulse">
                      <div className="w-full aspect-square bg-muted rounded mb-4"></div>
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : filteredSongs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground" data-testid="text-no-songs">
                    {searchQuery ? "No songs found matching your search." : "No songs available. Check back later!"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {filteredSongs.map((song: Song) => (
                    <div 
                      key={song.id}
                      className="album-card bg-card p-4 rounded-lg cursor-pointer hover:bg-card/80 transition-all"
                      onClick={() => setCurrentSong(song)}
                      data-testid={`card-song-${song.id}`}
                    >
                      <div className="w-full aspect-square bg-muted rounded mb-4 flex items-center justify-center">
                        {song.coverImageUrl ? (
                          <img 
                            src={song.coverImageUrl} 
                            alt={`${song.title} cover`}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <span className="text-2xl">♪</span>
                        )}
                      </div>
                      <h3 className="font-semibold mb-2 truncate" data-testid={`text-song-title-${song.id}`}>
                        {song.title}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate" data-testid={`text-song-artist-${song.id}`}>
                        {song.artist}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* User Playlists */}
            <PlaylistGrid 
              playlists={playlists}
              isLoading={playlistsLoading}
              data-testid="grid-playlists"
            />

            {/* Popular Artists - Static for now */}
            <ArtistGrid data-testid="grid-artists" />
          </div>
        </main>
      </div>

      {/* Music Player */}
      <MusicPlayer 
        currentSong={currentSong}
        onSongChange={setCurrentSong}
        data-testid="player-main"
      />
    </div>
  );
}
