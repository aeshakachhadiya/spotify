import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const songs = pgTable("songs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  artist: varchar("artist").notNull(),
  album: varchar("album"),
  duration: integer("duration").notNull(), // in seconds
  audioUrl: varchar("audio_url").notNull(),
  coverImageUrl: varchar("cover_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const playlists = pgTable("playlists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  isPublic: boolean("is_public").default(false),
  coverImageUrl: varchar("cover_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const playlistSongs = pgTable("playlist_songs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  playlistId: varchar("playlist_id").notNull().references(() => playlists.id, { onDelete: 'cascade' }),
  songId: varchar("song_id").notNull().references(() => songs.id, { onDelete: 'cascade' }),
  position: integer("position").notNull(),
  addedAt: timestamp("added_at").defaultNow(),
});

export const likedSongs = pgTable("liked_songs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  songId: varchar("song_id").notNull().references(() => songs.id, { onDelete: 'cascade' }),
  likedAt: timestamp("liked_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  playlists: many(playlists),
  likedSongs: many(likedSongs),
}));

export const playlistsRelations = relations(playlists, ({ one, many }) => ({
  user: one(users, {
    fields: [playlists.userId],
    references: [users.id],
  }),
  playlistSongs: many(playlistSongs),
}));

export const songsRelations = relations(songs, ({ many }) => ({
  playlistSongs: many(playlistSongs),
  likedSongs: many(likedSongs),
}));

export const playlistSongsRelations = relations(playlistSongs, ({ one }) => ({
  playlist: one(playlists, {
    fields: [playlistSongs.playlistId],
    references: [playlists.id],
  }),
  song: one(songs, {
    fields: [playlistSongs.songId],
    references: [songs.id],
  }),
}));

export const likedSongsRelations = relations(likedSongs, ({ one }) => ({
  user: one(users, {
    fields: [likedSongs.userId],
    references: [users.id],
  }),
  song: one(songs, {
    fields: [likedSongs.songId],
    references: [songs.id],
  }),
}));

// Insert schemas
export const insertSongSchema = createInsertSchema(songs).omit({
  id: true,
  createdAt: true,
});

export const insertPlaylistSchema = createInsertSchema(playlists).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPlaylistSongSchema = createInsertSchema(playlistSongs).omit({
  id: true,
  addedAt: true,
});

export const insertLikedSongSchema = createInsertSchema(likedSongs).omit({
  id: true,
  likedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Song = typeof songs.$inferSelect;
export type InsertSong = z.infer<typeof insertSongSchema>;
export type Playlist = typeof playlists.$inferSelect;
export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type PlaylistSong = typeof playlistSongs.$inferSelect;
export type InsertPlaylistSong = z.infer<typeof insertPlaylistSongSchema>;
export type LikedSong = typeof likedSongs.$inferSelect;
export type InsertLikedSong = z.infer<typeof insertLikedSongSchema>;
