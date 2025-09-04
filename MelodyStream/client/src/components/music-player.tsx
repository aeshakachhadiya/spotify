import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Shuffle, 
  Volume2, 
  VolumeX,
  Heart,
  Download,
  List,
  Monitor
} from "lucide-react";
import type { Song } from "@shared/schema";

interface MusicPlayerProps {
  currentSong: Song | null;
  onSongChange: (song: Song | null) => void;
}

export default function MusicPlayer({ currentSong, onSongChange }: MusicPlayerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');

  // Check if current song is liked
  const { data: likedStatus } = useQuery({
    queryKey: ["/api/liked-songs", currentSong?.id, "status"],
    enabled: !!currentSong && !!user,
    retry: false,
  });

  const likeSongMutation = useMutation({
    mutationFn: async (songId: string) => {
      await apiRequest("POST", "/api/liked-songs", { songId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/liked-songs"] });
      toast({
        title: "Success",
        description: "Song added to liked songs",
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
        description: "Failed to like song",
        variant: "destructive",
      });
    },
  });

  const unlikeSongMutation = useMutation({
    mutationFn: async (songId: string) => {
      await apiRequest("DELETE", `/api/liked-songs/${songId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/liked-songs"] });
      toast({
        title: "Success",
        description: "Song removed from liked songs",
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
        description: "Failed to unlike song",
        variant: "destructive",
      });
    },
  });

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong]);

  // Update audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (!audioRef.current || !duration) return;
    const newTime = (value[0] / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleLike = () => {
    if (!currentSong) return;
    
    if (likedStatus?.isLiked) {
      unlikeSongMutation.mutate(currentSong.id);
    } else {
      likeSongMutation.mutate(currentSong.id);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (!currentSong?.audioUrl) return;
    
    const link = document.createElement('a');
    link.href = currentSong.audioUrl;
    link.download = `${currentSong.artist} - ${currentSong.title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!currentSong) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
        <div className="flex items-center justify-center text-muted-foreground">
          <p data-testid="text-no-song">Select a song to start playing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-40">
      <audio
        ref={audioRef}
        src={currentSong.audioUrl}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <div className="flex items-center justify-between">
        {/* Currently Playing */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="w-14 h-14 bg-muted rounded flex items-center justify-center">
            {currentSong.coverImageUrl ? (
              <img 
                src={currentSong.coverImageUrl} 
                alt={`${currentSong.title} cover`}
                className="w-14 h-14 rounded object-cover"
              />
            ) : (
              <span className="text-lg">♪</span>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold truncate" data-testid="text-current-title">
              {currentSong.title}
            </h4>
            <p className="text-sm text-muted-foreground truncate" data-testid="text-current-artist">
              {currentSong.artist}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLike}
            className={`ml-4 ${likedStatus?.isLiked ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            data-testid="button-like"
          >
            <Heart className={`h-4 w-4 ${likedStatus?.isLiked ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center space-y-2 flex-1 max-w-lg">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsShuffled(!isShuffled)}
              className={`player-button ${isShuffled ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              data-testid="button-shuffle"
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="player-button text-muted-foreground hover:text-foreground"
              data-testid="button-previous"
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              onClick={togglePlay}
              className="player-button bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary/90"
              data-testid="button-play-pause"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="player-button text-muted-foreground hover:text-foreground"
              data-testid="button-next"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRepeatMode(repeatMode === 'none' ? 'all' : repeatMode === 'all' ? 'one' : 'none')}
              className={`player-button ${repeatMode !== 'none' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              data-testid="button-repeat"
            >
              <Repeat className="h-4 w-4" />
              {repeatMode === 'one' && <span className="text-xs ml-1">1</span>}
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center space-x-2 w-full">
            <span className="text-xs text-muted-foreground w-10 text-right" data-testid="text-current-time">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[duration ? (currentTime / duration) * 100 : 0]}
              onValueChange={handleSeek}
              max={100}
              step={1}
              className="flex-1"
              data-testid="slider-progress"
            />
            <span className="text-xs text-muted-foreground w-10" data-testid="text-duration">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume and Other Controls */}
        <div className="flex items-center space-x-4 flex-1 justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground hidden md:flex"
            data-testid="button-queue"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground hidden md:flex"
            data-testid="button-devices"
          >
            <Monitor className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-2 hidden md:flex">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="text-muted-foreground hover:text-foreground"
              data-testid="button-mute"
            >
              {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-20"
              data-testid="slider-volume"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="text-muted-foreground hover:text-foreground hidden md:flex"
            data-testid="button-download"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
