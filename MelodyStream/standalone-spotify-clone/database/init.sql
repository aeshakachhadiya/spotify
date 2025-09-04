-- SQLite Database Schema for Spotify Clone
-- This file can be used with SQLite if you want to upgrade from localStorage

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Songs table
CREATE TABLE IF NOT EXISTS songs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT,
    duration INTEGER DEFAULT 0,
    audio_url TEXT NOT NULL,
    cover_image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Playlists table
CREATE TABLE IF NOT EXISTS playlists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    user_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Playlist songs junction table
CREATE TABLE IF NOT EXISTS playlist_songs (
    id TEXT PRIMARY KEY,
    playlist_id TEXT NOT NULL,
    song_id TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (playlist_id) REFERENCES playlists(id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
    UNIQUE(playlist_id, song_id)
);

-- Liked songs table
CREATE TABLE IF NOT EXISTS liked_songs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    song_id TEXT NOT NULL,
    liked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
    UNIQUE(user_id, song_id)
);

-- Insert default users
INSERT OR IGNORE INTO users (id, username, email, password, first_name, last_name, is_admin) VALUES
('user1', 'demo', 'demo@example.com', 'password123', 'Demo', 'User', FALSE),
('admin', 'admin', 'admin@example.com', 'admin123', 'Admin', 'User', TRUE);

-- Insert sample songs
INSERT OR IGNORE INTO songs (id, title, artist, album, duration, audio_url, cover_image_url) VALUES
('song1', 'Blinding Lights', 'The Weeknd', 'After Hours', 200, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'),
('song2', 'Shape of You', 'Ed Sheeran', '÷ (Divide)', 233, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop'),
('song3', 'Someone Like You', 'Adele', '21', 285, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'),
('song4', 'Bohemian Rhapsody', 'Queen', 'A Night at the Opera', 355, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop'),
('song5', 'Imagine', 'John Lennon', 'Imagine', 183, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'),
('song6', 'Hotel California', 'Eagles', 'Hotel California', 391, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_playlists_user_id ON playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_playlist_songs_playlist_id ON playlist_songs(playlist_id);
CREATE INDEX IF NOT EXISTS idx_playlist_songs_song_id ON playlist_songs(song_id);
CREATE INDEX IF NOT EXISTS idx_liked_songs_user_id ON liked_songs(user_id);
CREATE INDEX IF NOT EXISTS idx_liked_songs_song_id ON liked_songs(song_id);