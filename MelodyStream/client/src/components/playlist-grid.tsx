import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Playlist } from "@shared/schema";

interface PlaylistGridProps {
  playlists: Playlist[];
  isLoading: boolean;
}

export default function PlaylistGrid({ playlists, isLoading }: PlaylistGridProps) {
  if (isLoading) {
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Your Playlists</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card p-4 rounded-lg animate-pulse">
              <div className="w-full aspect-square bg-muted rounded mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-6" data-testid="text-playlists-title">Your Playlists</h2>
      {playlists.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4" data-testid="text-no-playlists">
            You haven't created any playlists yet.
          </p>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid="button-create-first-playlist"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Playlist
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {playlists.map((playlist) => (
            <div 
              key={playlist.id}
              className="album-card bg-card p-4 rounded-lg cursor-pointer hover:bg-card/80 transition-all"
              data-testid={`card-playlist-${playlist.id}`}
            >
              <div className="w-full aspect-square bg-muted rounded mb-4 flex items-center justify-center">
                {playlist.coverImageUrl ? (
                  <img 
                    src={playlist.coverImageUrl} 
                    alt={`${playlist.name} cover`}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <span className="text-2xl">♪</span>
                )}
              </div>
              <h3 className="font-semibold mb-2 truncate" data-testid={`text-playlist-name-${playlist.id}`}>
                {playlist.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2" data-testid={`text-playlist-description-${playlist.id}`}>
                {playlist.description || "No description"}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
