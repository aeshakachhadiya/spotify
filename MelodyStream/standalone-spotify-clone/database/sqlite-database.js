// SQLite Database Implementation for Spotify Clone
// This is an advanced version that uses sql.js for SQLite support
// Optional upgrade from localStorage to SQLite

class SQLiteDatabase {
    constructor() {
        this.db = null;
        this.isReady = false;
        this.initPromise = this.initializeDatabase();
    }

    async initializeDatabase() {
        try {
            // Load sql.js library
            const sqljs = await import('https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js');
            const SQL = await sqljs.default({
                locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
            });

            // Create or load database
            const savedData = localStorage.getItem('spotifyDatabase');
            if (savedData) {
                // Load existing database
                const buffer = new Uint8Array(JSON.parse(savedData));
                this.db = new SQL.Database(buffer);
            } else {
                // Create new database
                this.db = new SQL.Database();
                this.createTables();
                this.insertSampleData();
            }

            this.isReady = true;
            console.log('SQLite database initialized successfully');
        } catch (error) {
            console.error('Failed to initialize SQLite database:', error);
            // Fallback to localStorage
            console.log('Falling back to localStorage database');
            window.db = new SpotifyDatabase();
        }
    }

    createTables() {
        const createTablesSQL = `
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

            -- Create indexes
            CREATE INDEX IF NOT EXISTS idx_playlists_user_id ON playlists(user_id);
            CREATE INDEX IF NOT EXISTS idx_playlist_songs_playlist_id ON playlist_songs(playlist_id);
            CREATE INDEX IF NOT EXISTS idx_playlist_songs_song_id ON playlist_songs(song_id);
            CREATE INDEX IF NOT EXISTS idx_liked_songs_user_id ON liked_songs(user_id);
            CREATE INDEX IF NOT EXISTS idx_liked_songs_song_id ON liked_songs(song_id);
        `;

        this.db.exec(createTablesSQL);
    }

    insertSampleData() {
        // Insert default users
        this.db.run(`
            INSERT OR IGNORE INTO users (id, username, email, password, first_name, last_name, is_admin) VALUES
            ('user1', 'demo', 'demo@example.com', 'password123', 'Demo', 'User', 0),
            ('admin', 'admin', 'admin@example.com', 'admin123', 'Admin', 'User', 1)
        `);

        // Insert sample songs
        this.db.run(`
            INSERT OR IGNORE INTO songs (id, title, artist, album, duration, audio_url, cover_image_url) VALUES
            ('song1', 'Blinding Lights', 'The Weeknd', 'After Hours', 200, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'),
            ('song2', 'Shape of You', 'Ed Sheeran', '÷ (Divide)', 233, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop'),
            ('song3', 'Someone Like You', 'Adele', '21', 285, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'),
            ('song4', 'Bohemian Rhapsody', 'Queen', 'A Night at the Opera', 355, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop'),
            ('song5', 'Imagine', 'John Lennon', 'Imagine', 183, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'),
            ('song6', 'Hotel California', 'Eagles', 'Hotel California', 391, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop')
        `);

        this.saveDatabase();
    }

    saveDatabase() {
        if (!this.db) return;
        
        const data = this.db.export();
        localStorage.setItem('spotifyDatabase', JSON.stringify(Array.from(data)));
    }

    async waitForReady() {
        await this.initPromise;
        return this.isReady;
    }

    // User operations
    async getUsers() {
        if (!await this.waitForReady()) return [];
        
        const stmt = this.db.prepare("SELECT * FROM users");
        const result = [];
        while (stmt.step()) {
            result.push(stmt.getAsObject());
        }
        stmt.free();
        return result;
    }

    async getUserByCredentials(username, password) {
        if (!await this.waitForReady()) return null;
        
        const stmt = this.db.prepare("SELECT * FROM users WHERE username = ? AND password = ?");
        stmt.bind([username, password]);
        
        let user = null;
        if (stmt.step()) {
            user = stmt.getAsObject();
        }
        stmt.free();
        return user;
    }

    async createUser(userData) {
        if (!await this.waitForReady()) return null;
        
        const id = 'user' + Date.now();
        const stmt = this.db.prepare(`
            INSERT INTO users (id, username, email, password, first_name, last_name, is_admin) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run([
            id,
            userData.username,
            userData.email,
            userData.password,
            userData.firstName || null,
            userData.lastName || null,
            userData.isAdmin ? 1 : 0
        ]);
        
        this.saveDatabase();
        return { id, ...userData };
    }

    async userExists(username, email) {
        if (!await this.waitForReady()) return false;
        
        const stmt = this.db.prepare("SELECT COUNT(*) as count FROM users WHERE username = ? OR email = ?");
        stmt.bind([username, email]);
        
        let exists = false;
        if (stmt.step()) {
            const result = stmt.getAsObject();
            exists = result.count > 0;
        }
        stmt.free();
        return exists;
    }

    // Song operations
    async getSongs() {
        if (!await this.waitForReady()) return [];
        
        const stmt = this.db.prepare("SELECT * FROM songs ORDER BY created_at DESC");
        const result = [];
        while (stmt.step()) {
            result.push(stmt.getAsObject());
        }
        stmt.free();
        return result;
    }

    async getSongById(id) {
        if (!await this.waitForReady()) return null;
        
        const stmt = this.db.prepare("SELECT * FROM songs WHERE id = ?");
        stmt.bind([id]);
        
        let song = null;
        if (stmt.step()) {
            song = stmt.getAsObject();
        }
        stmt.free();
        return song;
    }

    async createSong(songData) {
        if (!await this.waitForReady()) return null;
        
        const id = 'song' + Date.now();
        const stmt = this.db.prepare(`
            INSERT INTO songs (id, title, artist, album, duration, audio_url, cover_image_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        
        stmt.run([
            id,
            songData.title,
            songData.artist,
            songData.album || null,
            songData.duration || 0,
            songData.audioUrl,
            songData.coverImageUrl || null
        ]);
        
        this.saveDatabase();
        return { id, ...songData };
    }

    async searchSongs(query) {
        if (!await this.waitForReady()) return [];
        
        const stmt = this.db.prepare(`
            SELECT * FROM songs 
            WHERE title LIKE ? OR artist LIKE ? OR album LIKE ?
            ORDER BY created_at DESC
        `);
        
        const searchTerm = `%${query}%`;
        stmt.bind([searchTerm, searchTerm, searchTerm]);
        
        const result = [];
        while (stmt.step()) {
            result.push(stmt.getAsObject());
        }
        stmt.free();
        return result;
    }

    // Playlist operations
    async getPlaylists() {
        if (!await this.waitForReady()) return [];
        
        const stmt = this.db.prepare("SELECT * FROM playlists ORDER BY created_at DESC");
        const result = [];
        while (stmt.step()) {
            result.push(stmt.getAsObject());
        }
        stmt.free();
        return result;
    }

    async getUserPlaylists(userId) {
        if (!await this.waitForReady()) return [];
        
        const stmt = this.db.prepare("SELECT * FROM playlists WHERE user_id = ? ORDER BY created_at DESC");
        stmt.bind([userId]);
        
        const result = [];
        while (stmt.step()) {
            result.push(stmt.getAsObject());
        }
        stmt.free();
        return result;
    }

    async createPlaylist(playlistData) {
        if (!await this.waitForReady()) return null;
        
        const id = 'playlist' + Date.now();
        const stmt = this.db.prepare(`
            INSERT INTO playlists (id, name, description, user_id) 
            VALUES (?, ?, ?, ?)
        `);
        
        stmt.run([
            id,
            playlistData.name,
            playlistData.description || null,
            playlistData.userId
        ]);
        
        this.saveDatabase();
        return { id, ...playlistData, songs: [] };
    }

    // Liked songs operations
    async getUserLikedSongs(userId) {
        if (!await this.waitForReady()) return [];
        
        const stmt = this.db.prepare(`
            SELECT ls.*, s.* FROM liked_songs ls
            JOIN songs s ON ls.song_id = s.id
            WHERE ls.user_id = ?
            ORDER BY ls.liked_at DESC
        `);
        stmt.bind([userId]);
        
        const result = [];
        while (stmt.step()) {
            const row = stmt.getAsObject();
            result.push({
                id: row.id,
                userId: row.user_id,
                songId: row.song_id,
                likedAt: row.liked_at,
                song: {
                    id: row.song_id,
                    title: row.title,
                    artist: row.artist,
                    album: row.album,
                    duration: row.duration,
                    audioUrl: row.audio_url,
                    coverImageUrl: row.cover_image_url
                }
            });
        }
        stmt.free();
        return result;
    }

    async likeSong(userId, songId) {
        if (!await this.waitForReady()) return null;
        
        // Check if already liked
        if (await this.isSongLiked(userId, songId)) {
            return null;
        }
        
        const id = 'like' + Date.now();
        const stmt = this.db.prepare(`
            INSERT INTO liked_songs (id, user_id, song_id) 
            VALUES (?, ?, ?)
        `);
        
        stmt.run([id, userId, songId]);
        this.saveDatabase();
        return { id, userId, songId };
    }

    async unlikeSong(userId, songId) {
        if (!await this.waitForReady()) return;
        
        const stmt = this.db.prepare("DELETE FROM liked_songs WHERE user_id = ? AND song_id = ?");
        stmt.run([userId, songId]);
        this.saveDatabase();
    }

    async isSongLiked(userId, songId) {
        if (!await this.waitForReady()) return false;
        
        const stmt = this.db.prepare("SELECT COUNT(*) as count FROM liked_songs WHERE user_id = ? AND song_id = ?");
        stmt.bind([userId, songId]);
        
        let isLiked = false;
        if (stmt.step()) {
            const result = stmt.getAsObject();
            isLiked = result.count > 0;
        }
        stmt.free();
        return isLiked;
    }

    // Utility methods
    async clearDatabase() {
        if (!await this.waitForReady()) return;
        
        this.db.exec(`
            DELETE FROM liked_songs;
            DELETE FROM playlist_songs;
            DELETE FROM playlists;
            DELETE FROM songs;
            DELETE FROM users;
        `);
        
        this.insertSampleData();
    }

    async exportData() {
        if (!await this.waitForReady()) return null;
        
        return {
            users: await this.getUsers(),
            songs: await this.getSongs(),
            playlists: await this.getPlaylists(),
            likedSongs: await this.getUserLikedSongs('user1') // Example user
        };
    }
}

// Auto-detect and initialize appropriate database
document.addEventListener('DOMContentLoaded', async () => {
    // Try to use SQLite, fallback to localStorage
    try {
        window.db = new SQLiteDatabase();
        await window.db.waitForReady();
        console.log('Using SQLite database');
    } catch (error) {
        console.log('SQLite not available, using localStorage database');
        window.db = new SpotifyDatabase();
    }
});