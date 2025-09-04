// Simple JavaScript localStorage-based database for the Spotify Clone
// This simulates a database using browser's localStorage

class SpotifyDatabase {
    constructor() {
        this.initializeDatabase();
    }

    // Initialize database with sample data if not exists
    initializeDatabase() {
        if (!localStorage.getItem('spotifyUsers')) {
            this.initializeUsers();
        }
        if (!localStorage.getItem('spotifySongs')) {
            this.initializeSongs();
        }
        if (!localStorage.getItem('spotifyPlaylists')) {
            this.initializePlaylists();
        }
        if (!localStorage.getItem('spotifyLikedSongs')) {
            this.initializeLikedSongs();
        }
    }

    // Initialize sample users
    initializeUsers() {
        const users = [
            {
                id: 'user1',
                username: 'demo',
                email: 'demo@example.com',
                password: 'password123', // In real app, this would be hashed
                firstName: 'Demo',
                lastName: 'User',
                createdAt: new Date().toISOString()
            },
            {
                id: 'admin',
                username: 'admin',
                email: 'admin@example.com',
                password: 'admin123',
                firstName: 'Admin',
                lastName: 'User',
                isAdmin: true,
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('spotifyUsers', JSON.stringify(users));
    }

    // Initialize sample songs with actual audio files
    initializeSongs() {
        const songs = [
            {
                id: 'song1',
                title: 'Blinding Lights',
                artist: 'The Weeknd',
                album: 'After Hours',
                duration: 200,
                audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                coverImageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
                createdAt: new Date().toISOString()
            },
            {
                id: 'song2',
                title: 'Shape of You',
                artist: 'Ed Sheeran',
                album: '÷ (Divide)',
                duration: 233,
                audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
                coverImageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
                createdAt: new Date().toISOString()
            },
            {
                id: 'song3',
                title: 'Someone Like You',
                artist: 'Adele',
                album: '21',
                duration: 285,
                audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
                coverImageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
                createdAt: new Date().toISOString()
            },
            {
                id: 'song4',
                title: 'Bohemian Rhapsody',
                artist: 'Queen',
                album: 'A Night at the Opera',
                duration: 355,
                audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
                coverImageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
                createdAt: new Date().toISOString()
            },
            {
                id: 'song5',
                title: 'Imagine',
                artist: 'John Lennon',
                album: 'Imagine',
                duration: 183,
                audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
                coverImageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
                createdAt: new Date().toISOString()
            },
            {
                id: 'song6',
                title: 'Hotel California',
                artist: 'Eagles',
                album: 'Hotel California',
                duration: 391,
                audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
                coverImageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('spotifySongs', JSON.stringify(songs));
    }

    // Initialize empty playlists and liked songs
    initializePlaylists() {
        localStorage.setItem('spotifyPlaylists', JSON.stringify([]));
    }

    initializeLikedSongs() {
        localStorage.setItem('spotifyLikedSongs', JSON.stringify([]));
    }

    // User operations
    getUsers() {
        return JSON.parse(localStorage.getItem('spotifyUsers') || '[]');
    }

    getUserByCredentials(username, password) {
        const users = this.getUsers();
        return users.find(user => user.username === username && user.password === password);
    }

    createUser(userData) {
        const users = this.getUsers();
        const newUser = {
            id: 'user' + Date.now(),
            ...userData,
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        localStorage.setItem('spotifyUsers', JSON.stringify(users));
        return newUser;
    }

    userExists(username, email) {
        const users = this.getUsers();
        return users.some(user => user.username === username || user.email === email);
    }

    // Song operations
    getSongs() {
        return JSON.parse(localStorage.getItem('spotifySongs') || '[]');
    }

    getSongById(id) {
        const songs = this.getSongs();
        return songs.find(song => song.id === id);
    }

    createSong(songData) {
        const songs = this.getSongs();
        const newSong = {
            id: 'song' + Date.now(),
            ...songData,
            createdAt: new Date().toISOString()
        };
        songs.push(newSong);
        localStorage.setItem('spotifySongs', JSON.stringify(songs));
        return newSong;
    }

    deleteSong(id) {
        const songs = this.getSongs();
        const filteredSongs = songs.filter(song => song.id !== id);
        localStorage.setItem('spotifySongs', JSON.stringify(filteredSongs));
        
        // Also remove from playlists and liked songs
        this.removeSongFromAllPlaylists(id);
        this.removeSongFromAllLikedSongs(id);
    }

    searchSongs(query) {
        const songs = this.getSongs();
        const lowerQuery = query.toLowerCase();
        return songs.filter(song => 
            song.title.toLowerCase().includes(lowerQuery) ||
            song.artist.toLowerCase().includes(lowerQuery) ||
            song.album.toLowerCase().includes(lowerQuery)
        );
    }

    // Playlist operations
    getPlaylists() {
        return JSON.parse(localStorage.getItem('spotifyPlaylists') || '[]');
    }

    getUserPlaylists(userId) {
        const playlists = this.getPlaylists();
        return playlists.filter(playlist => playlist.userId === userId);
    }

    getPlaylistById(id) {
        const playlists = this.getPlaylists();
        return playlists.find(playlist => playlist.id === id);
    }

    createPlaylist(playlistData) {
        const playlists = this.getPlaylists();
        const newPlaylist = {
            id: 'playlist' + Date.now(),
            ...playlistData,
            songs: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        playlists.push(newPlaylist);
        localStorage.setItem('spotifyPlaylists', JSON.stringify(playlists));
        return newPlaylist;
    }

    updatePlaylist(id, updates) {
        const playlists = this.getPlaylists();
        const playlistIndex = playlists.findIndex(playlist => playlist.id === id);
        if (playlistIndex !== -1) {
            playlists[playlistIndex] = {
                ...playlists[playlistIndex],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            localStorage.setItem('spotifyPlaylists', JSON.stringify(playlists));
            return playlists[playlistIndex];
        }
        return null;
    }

    deletePlaylist(id) {
        const playlists = this.getPlaylists();
        const filteredPlaylists = playlists.filter(playlist => playlist.id !== id);
        localStorage.setItem('spotifyPlaylists', JSON.stringify(filteredPlaylists));
    }

    addSongToPlaylist(playlistId, songId) {
        const playlists = this.getPlaylists();
        const playlistIndex = playlists.findIndex(playlist => playlist.id === playlistId);
        if (playlistIndex !== -1) {
            if (!playlists[playlistIndex].songs.includes(songId)) {
                playlists[playlistIndex].songs.push(songId);
                playlists[playlistIndex].updatedAt = new Date().toISOString();
                localStorage.setItem('spotifyPlaylists', JSON.stringify(playlists));
            }
        }
    }

    removeSongFromPlaylist(playlistId, songId) {
        const playlists = this.getPlaylists();
        const playlistIndex = playlists.findIndex(playlist => playlist.id === playlistId);
        if (playlistIndex !== -1) {
            playlists[playlistIndex].songs = playlists[playlistIndex].songs.filter(id => id !== songId);
            playlists[playlistIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('spotifyPlaylists', JSON.stringify(playlists));
        }
    }

    removeSongFromAllPlaylists(songId) {
        const playlists = this.getPlaylists();
        playlists.forEach(playlist => {
            playlist.songs = playlist.songs.filter(id => id !== songId);
            playlist.updatedAt = new Date().toISOString();
        });
        localStorage.setItem('spotifyPlaylists', JSON.stringify(playlists));
    }

    getPlaylistSongs(playlistId) {
        const playlist = this.getPlaylistById(playlistId);
        if (!playlist) return [];
        
        const songs = this.getSongs();
        return playlist.songs.map(songId => songs.find(song => song.id === songId)).filter(Boolean);
    }

    // Liked songs operations
    getLikedSongs() {
        return JSON.parse(localStorage.getItem('spotifyLikedSongs') || '[]');
    }

    getUserLikedSongs(userId) {
        const likedSongs = this.getLikedSongs();
        const userLikedSongs = likedSongs.filter(like => like.userId === userId);
        const songs = this.getSongs();
        
        return userLikedSongs.map(like => {
            const song = songs.find(song => song.id === like.songId);
            return song ? { ...like, song } : null;
        }).filter(Boolean);
    }

    likeSong(userId, songId) {
        const likedSongs = this.getLikedSongs();
        const existingLike = likedSongs.find(like => like.userId === userId && like.songId === songId);
        
        if (!existingLike) {
            const newLike = {
                id: 'like' + Date.now(),
                userId,
                songId,
                likedAt: new Date().toISOString()
            };
            likedSongs.push(newLike);
            localStorage.setItem('spotifyLikedSongs', JSON.stringify(likedSongs));
            return newLike;
        }
        return existingLike;
    }

    unlikeSong(userId, songId) {
        const likedSongs = this.getLikedSongs();
        const filteredLikes = likedSongs.filter(like => !(like.userId === userId && like.songId === songId));
        localStorage.setItem('spotifyLikedSongs', JSON.stringify(filteredLikes));
    }

    isSongLiked(userId, songId) {
        const likedSongs = this.getLikedSongs();
        return likedSongs.some(like => like.userId === userId && like.songId === songId);
    }

    removeSongFromAllLikedSongs(songId) {
        const likedSongs = this.getLikedSongs();
        const filteredLikes = likedSongs.filter(like => like.songId !== songId);
        localStorage.setItem('spotifyLikedSongs', JSON.stringify(filteredLikes));
    }

    // Utility methods
    clearDatabase() {
        localStorage.removeItem('spotifyUsers');
        localStorage.removeItem('spotifySongs');
        localStorage.removeItem('spotifyPlaylists');
        localStorage.removeItem('spotifyLikedSongs');
        this.initializeDatabase();
    }

    exportData() {
        return {
            users: this.getUsers(),
            songs: this.getSongs(),
            playlists: this.getPlaylists(),
            likedSongs: this.getLikedSongs()
        };
    }

    importData(data) {
        if (data.users) localStorage.setItem('spotifyUsers', JSON.stringify(data.users));
        if (data.songs) localStorage.setItem('spotifySongs', JSON.stringify(data.songs));
        if (data.playlists) localStorage.setItem('spotifyPlaylists', JSON.stringify(data.playlists));
        if (data.likedSongs) localStorage.setItem('spotifyLikedSongs', JSON.stringify(data.likedSongs));
    }
}

// Create global database instance
window.db = new SpotifyDatabase();