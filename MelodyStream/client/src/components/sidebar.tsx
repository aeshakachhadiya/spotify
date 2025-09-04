import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Home, Search, Library, Plus, Music, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Playlist } from "@shared/schema";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  playlists: Playlist[];
}

export default function Sidebar({ isOpen, onClose, playlists }: SidebarProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistDescription, setPlaylistDescription] = useState("");

  const createPlaylistMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      await apiRequest("POST", "/api/playlists", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/playlists"] });
      setIsCreatePlaylistOpen(false);
      setPlaylistName("");
      setPlaylistDescription("");
      toast({
        title: "Success",
        description: "Playlist created successfully",
      });
    },
    onError: (error) => {
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
        description: "Failed to create playlist",
        variant: "destructive",
      });
    },
  });

  const handleCreatePlaylist = () => {
    if (!playlistName.trim()) return;
    
    createPlaylistMutation.mutate({
      name: playlistName.trim(),
      description: playlistDescription.trim() || undefined,
    });
  };

  return (
    <>
      <div className={cn(
        "sidebar bg-background w-60 border-r border-border flex flex-col fixed md:relative inset-y-0 left-0 z-30 transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <Music className="text-primary text-2xl" />
            <span className="text-xl font-bold" data-testid="text-logo">Spotify Clone</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start space-x-3 p-2 hover:bg-muted"
                data-testid="button-nav-home"
              >
                <Home className="text-lg" />
                <span>Home</span>
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start space-x-3 p-2 hover:bg-muted"
                data-testid="button-nav-search"
              >
                <Search className="text-lg" />
                <span>Search</span>
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start space-x-3 p-2 hover:bg-muted"
                data-testid="button-nav-library"
              >
                <Library className="text-lg" />
                <span>Your Library</span>
              </Button>
            </li>
          </ul>

          {/* Playlists Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider" data-testid="text-playlists-header">
                Playlists
              </h3>
              <Dialog open={isCreatePlaylistOpen} onOpenChange={setIsCreatePlaylistOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground p-1"
                    data-testid="button-create-playlist"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle>Create New Playlist</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="playlistName">Playlist Name</Label>
                      <Input
                        id="playlistName"
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                        placeholder="My Awesome Playlist"
                        className="bg-input border-border"
                        data-testid="input-playlist-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="playlistDescription">Description (Optional)</Label>
                      <Textarea
                        id="playlistDescription"
                        value={playlistDescription}
                        onChange={(e) => setPlaylistDescription(e.target.value)}
                        placeholder="Describe your playlist..."
                        className="bg-input border-border"
                        data-testid="textarea-playlist-description"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsCreatePlaylistOpen(false)}
                        data-testid="button-cancel-playlist"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreatePlaylist}
                        disabled={!playlistName.trim() || createPlaylistMutation.isPending}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        data-testid="button-save-playlist"
                      >
                        {createPlaylistMutation.isPending ? "Creating..." : "Create"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <ul className="space-y-1">
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-2 text-muted-foreground hover:text-foreground truncate"
                  data-testid="button-liked-songs"
                >
                  Liked Songs
                </Button>
              </li>
              {playlists.map((playlist) => (
                <li key={playlist.id}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-2 text-muted-foreground hover:text-foreground truncate"
                    data-testid={`button-playlist-${playlist.id}`}
                  >
                    {playlist.name}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <User className="text-sm" />
              )}
            </div>
            <span className="text-sm font-medium truncate" data-testid="text-user-name">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`
                : user?.email || "User"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
