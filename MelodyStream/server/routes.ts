import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertSongSchema, insertPlaylistSchema, insertPlaylistSongSchema, insertLikedSongSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Song routes
  app.get('/api/songs', async (req, res) => {
    try {
      const songs = await storage.getAllSongs();
      res.json(songs);
    } catch (error) {
      console.error("Error fetching songs:", error);
      res.status(500).json({ message: "Failed to fetch songs" });
    }
  });

  app.get('/api/songs/:id', async (req, res) => {
    try {
      const song = await storage.getSong(req.params.id);
      if (!song) {
        return res.status(404).json({ message: "Song not found" });
      }
      res.json(song);
    } catch (error) {
      console.error("Error fetching song:", error);
      res.status(500).json({ message: "Failed to fetch song" });
    }
  });

  app.post('/api/songs', isAuthenticated, async (req, res) => {
    try {
      const songData = insertSongSchema.parse(req.body);
      const song = await storage.createSong(songData);
      res.status(201).json(song);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid song data", errors: error.errors });
      }
      console.error("Error creating song:", error);
      res.status(500).json({ message: "Failed to create song" });
    }
  });

  app.delete('/api/songs/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteSong(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting song:", error);
      res.status(500).json({ message: "Failed to delete song" });
    }
  });

  // Playlist routes
  app.get('/api/playlists', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const playlists = await storage.getUserPlaylists(userId);
      res.json(playlists);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      res.status(500).json({ message: "Failed to fetch playlists" });
    }
  });

  app.get('/api/playlists/:id', isAuthenticated, async (req, res) => {
    try {
      const playlist = await storage.getPlaylist(req.params.id);
      if (!playlist) {
        return res.status(404).json({ message: "Playlist not found" });
      }
      res.json(playlist);
    } catch (error) {
      console.error("Error fetching playlist:", error);
      res.status(500).json({ message: "Failed to fetch playlist" });
    }
  });

  app.post('/api/playlists', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const playlistData = insertPlaylistSchema.parse({ ...req.body, userId });
      const playlist = await storage.createPlaylist(playlistData);
      res.status(201).json(playlist);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid playlist data", errors: error.errors });
      }
      console.error("Error creating playlist:", error);
      res.status(500).json({ message: "Failed to create playlist" });
    }
  });

  app.put('/api/playlists/:id', isAuthenticated, async (req, res) => {
    try {
      const updates = insertPlaylistSchema.partial().parse(req.body);
      const playlist = await storage.updatePlaylist(req.params.id, updates);
      res.json(playlist);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid playlist data", errors: error.errors });
      }
      console.error("Error updating playlist:", error);
      res.status(500).json({ message: "Failed to update playlist" });
    }
  });

  app.delete('/api/playlists/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deletePlaylist(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting playlist:", error);
      res.status(500).json({ message: "Failed to delete playlist" });
    }
  });

  // Playlist songs routes
  app.get('/api/playlists/:id/songs', async (req, res) => {
    try {
      const playlistSongs = await storage.getPlaylistSongs(req.params.id);
      res.json(playlistSongs);
    } catch (error) {
      console.error("Error fetching playlist songs:", error);
      res.status(500).json({ message: "Failed to fetch playlist songs" });
    }
  });

  app.post('/api/playlists/:id/songs', isAuthenticated, async (req, res) => {
    try {
      const playlistSongData = insertPlaylistSongSchema.parse({
        ...req.body,
        playlistId: req.params.id
      });
      const playlistSong = await storage.addSongToPlaylist(playlistSongData);
      res.status(201).json(playlistSong);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid playlist song data", errors: error.errors });
      }
      console.error("Error adding song to playlist:", error);
      res.status(500).json({ message: "Failed to add song to playlist" });
    }
  });

  app.delete('/api/playlists/:playlistId/songs/:songId', isAuthenticated, async (req, res) => {
    try {
      await storage.removeSongFromPlaylist(req.params.playlistId, req.params.songId);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing song from playlist:", error);
      res.status(500).json({ message: "Failed to remove song from playlist" });
    }
  });

  // Liked songs routes
  app.get('/api/liked-songs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const likedSongs = await storage.getUserLikedSongs(userId);
      res.json(likedSongs);
    } catch (error) {
      console.error("Error fetching liked songs:", error);
      res.status(500).json({ message: "Failed to fetch liked songs" });
    }
  });

  app.post('/api/liked-songs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const likedSongData = insertLikedSongSchema.parse({ ...req.body, userId });
      const likedSong = await storage.likeSong(likedSongData);
      res.status(201).json(likedSong);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid liked song data", errors: error.errors });
      }
      console.error("Error liking song:", error);
      res.status(500).json({ message: "Failed to like song" });
    }
  });

  app.delete('/api/liked-songs/:songId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.unlikeSong(userId, req.params.songId);
      res.status(204).send();
    } catch (error) {
      console.error("Error unliking song:", error);
      res.status(500).json({ message: "Failed to unlike song" });
    }
  });

  app.get('/api/liked-songs/:songId/status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const isLiked = await storage.isSongLiked(userId, req.params.songId);
      res.json({ isLiked });
    } catch (error) {
      console.error("Error checking liked song status:", error);
      res.status(500).json({ message: "Failed to check liked song status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
