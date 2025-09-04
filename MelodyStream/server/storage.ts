import {
  users,
  songs,
  playlists,
  playlistSongs,
  likedSongs,
  type User,
  type UpsertUser,
  type Song,
  type InsertSong,
  type Playlist,
  type InsertPlaylist,
  type PlaylistSong,
  type InsertPlaylistSong,
  type LikedSong,
  type InsertLikedSong,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Song operations
  getAllSongs(): Promise<Song[]>;
  getSong(id: string): Promise<Song | undefined>;
  createSong(song: InsertSong): Promise<Song>;
  deleteSong(id: string): Promise<void>;

  // Playlist operations
  getUserPlaylists(userId: string): Promise<Playlist[]>;
  getPlaylist(id: string): Promise<Playlist | undefined>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  updatePlaylist(id: string, updates: Partial<InsertPlaylist>): Promise<Playlist>;
  deletePlaylist(id: string): Promise<void>;

  // Playlist songs operations
  getPlaylistSongs(playlistId: string): Promise<(PlaylistSong & { song: Song })[]>;
  addSongToPlaylist(playlistSong: InsertPlaylistSong): Promise<PlaylistSong>;
  removeSongFromPlaylist(playlistId: string, songId: string): Promise<void>;

  // Liked songs operations
  getUserLikedSongs(userId: string): Promise<(LikedSong & { song: Song })[]>;
  likeSong(likedSong: InsertLikedSong): Promise<LikedSong>;
  unlikeSong(userId: string, songId: string): Promise<void>;
  isSongLiked(userId: string, songId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Song operations
  async getAllSongs(): Promise<Song[]> {
    return await db.select().from(songs).orderBy(desc(songs.createdAt));
  }

  async getSong(id: string): Promise<Song | undefined> {
    const [song] = await db.select().from(songs).where(eq(songs.id, id));
    return song;
  }

  async createSong(song: InsertSong): Promise<Song> {
    const [newSong] = await db.insert(songs).values(song).returning();
    return newSong;
  }

  async deleteSong(id: string): Promise<void> {
    await db.delete(songs).where(eq(songs.id, id));
  }

  // Playlist operations
  async getUserPlaylists(userId: string): Promise<Playlist[]> {
    return await db
      .select()
      .from(playlists)
      .where(eq(playlists.userId, userId))
      .orderBy(desc(playlists.updatedAt));
  }

  async getPlaylist(id: string): Promise<Playlist | undefined> {
    const [playlist] = await db.select().from(playlists).where(eq(playlists.id, id));
    return playlist;
  }

  async createPlaylist(playlist: InsertPlaylist): Promise<Playlist> {
    const [newPlaylist] = await db.insert(playlists).values(playlist).returning();
    return newPlaylist;
  }

  async updatePlaylist(id: string, updates: Partial<InsertPlaylist>): Promise<Playlist> {
    const [updatedPlaylist] = await db
      .update(playlists)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(playlists.id, id))
      .returning();
    return updatedPlaylist;
  }

  async deletePlaylist(id: string): Promise<void> {
    await db.delete(playlists).where(eq(playlists.id, id));
  }

  // Playlist songs operations
  async getPlaylistSongs(playlistId: string): Promise<(PlaylistSong & { song: Song })[]> {
    return await db
      .select()
      .from(playlistSongs)
      .innerJoin(songs, eq(playlistSongs.songId, songs.id))
      .where(eq(playlistSongs.playlistId, playlistId))
      .orderBy(playlistSongs.position);
  }

  async addSongToPlaylist(playlistSong: InsertPlaylistSong): Promise<PlaylistSong> {
    const [newPlaylistSong] = await db.insert(playlistSongs).values(playlistSong).returning();
    return newPlaylistSong;
  }

  async removeSongFromPlaylist(playlistId: string, songId: string): Promise<void> {
    await db
      .delete(playlistSongs)
      .where(
        and(
          eq(playlistSongs.playlistId, playlistId),
          eq(playlistSongs.songId, songId)
        )
      );
  }

  // Liked songs operations
  async getUserLikedSongs(userId: string): Promise<(LikedSong & { song: Song })[]> {
    return await db
      .select()
      .from(likedSongs)
      .innerJoin(songs, eq(likedSongs.songId, songs.id))
      .where(eq(likedSongs.userId, userId))
      .orderBy(desc(likedSongs.likedAt));
  }

  async likeSong(likedSong: InsertLikedSong): Promise<LikedSong> {
    const [newLikedSong] = await db.insert(likedSongs).values(likedSong).returning();
    return newLikedSong;
  }

  async unlikeSong(userId: string, songId: string): Promise<void> {
    await db
      .delete(likedSongs)
      .where(
        and(
          eq(likedSongs.userId, userId),
          eq(likedSongs.songId, songId)
        )
      );
  }

  async isSongLiked(userId: string, songId: string): Promise<boolean> {
    const [result] = await db
      .select()
      .from(likedSongs)
      .where(
        and(
          eq(likedSongs.userId, userId),
          eq(likedSongs.songId, songId)
        )
      );
    return !!result;
  }
}

export const storage = new DatabaseStorage();
