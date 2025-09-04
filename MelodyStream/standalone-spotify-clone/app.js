 // Main application JavaScript for Spotify Clone
class SpotifyApp {
    constructor() {
        this.currentUser = null;
        this.currentSong = null;
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
        this.volume = 0.7;
        this.isShuffled = false;
        this.repeatMode = 'none'; // 'none', 'one', 'all'
        this.queue = [];
        this.currentQueueIndex = 0;
        
        this.audioPlayer = document.getElementById('audioPlayer');
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    // Authentication
    checkAuthStatus() {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showMainApp();
        } else {
            this.showLoginScreen();
        }
    }

    showLoginScreen() {
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('signupScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.add('hidden');
    }

    showSignupScreen() {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('signupScreen').classList.remove('hidden');
        document.getElementById('mainApp').classList.add('hidden');
    }

    showMainApp() {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('signupScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        
        // Update UI with user info
        document.getElementById('currentUser').textContent = this.currentUser.firstName || this.currentUser.username;
        
        // Show admin button for admins
        if (this.currentUser.isAdmin) {
            document.getElementById('adminBtn').classList.remove('hidden');
        }
        
        this.loadHomePage();
        this.updateGreeting();
    }

    login(username, password) {
        const user = db.getUserByCredentials(username, password);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.showMainApp();
            return true;
        }
        return false;
    }

    signup(userData) {
        if (db.userExists(userData.username, userData.email)) {
            return { success: false, message: 'Username or email already exists' };
        }
        
        const newUser = db.createUser(userData);
        this.currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        this.showMainApp();
        return { success: true };
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.pauseMusic();
        this.showLoginScreen();
    }

    // Navigation
    showPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Remove active from nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Show selected page
        document.getElementById(pageName + 'Page').classList.add('active');
        
        // Add active to nav item
        document.querySelector(`[data-page="${pageName}"]`).classList.add('active');
        
        // Load page content
        switch(pageName) {
            case 'home':
                this.loadHomePage();
                break;
            case 'search':
                this.loadSearchPage();
                break;
            case 'library':
                this.loadLibraryPage();
                break;
        }
    }

    // Page Loading
    loadHomePage() {
        const songs = db.getSongs();
        this.renderSongs('allSongs', songs);
        this.renderSongs('recentSongs', songs.slice(0, 6));
    }

    loadSearchPage() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput.value.trim()) {
            this.performSearch(searchInput.value.trim());
        } else {
            document.getElementById('searchResults').innerHTML = '';
            document.getElementById('noResults').classList.add('hidden');
        }
    }

    loadLibraryPage() {
        this.loadUserPlaylists();
        this.loadLikedSongs();
    }

    // Song Operations
    renderSongs(containerId, songs) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        songs.forEach(song => {
            const songCard = this.createSongCard(song);
            container.appendChild(songCard);
        });
    }

    createSongCard(song) {
        const card = document.createElement('div');
        card.className = 'song-card';
        card.innerHTML = `
            <div class="song-artwork">
                ${song.coverImageUrl ? 
                    `<img src="${song.coverImageUrl}" alt="${song.title}" onerror="this.style.display='none'">` : 
                    '<i class="fas fa-music"></i>'
                }
                <button class="play-overlay" onclick="app.playSong('${song.id}')">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <div class="song-title">${song.title}</div>
            <div class="song-artist">${song.artist}</div>
        `;
        
        return card;
    }

    playSong(songId) {
        const song = db.getSongById(songId);
        if (!song) return;
        
        this.currentSong = song;
        this.audioPlayer.src = song.audioUrl;
        this.audioPlayer.load();
        
        // Update player UI
        this.updatePlayerUI();
        
        // Play the song
        this.audioPlayer.play().then(() => {
            this.isPlaying = true;
            this.updatePlayButton();
        }).catch(error => {
            console.error('Error playing audio:', error);
            alert('Sorry, this song cannot be played. It might be unavailable.');
        });
    }

    togglePlayPause() {
        if (!this.currentSong) return;
        
        if (this.isPlaying) {
            this.pauseMusic();
        } else {
            this.resumeMusic();
        }
    }

    pauseMusic() {
        this.audioPlayer.pause();
        this.isPlaying = false;
        this.updatePlayButton();
    }

    resumeMusic() {
        if (this.currentSong) {
            this.audioPlayer.play().then(() => {
                this.isPlaying = true;
                this.updatePlayButton();
            }).catch(error => {
                console.error('Error resuming audio:', error);
            });
        }
    }

    nextSong() {
        const songs = db.getSongs();
        if (songs.length === 0) return;
        
        const currentIndex = songs.findIndex(song => song.id === this.currentSong?.id);
        let nextIndex;
        
        if (this.isShuffled) {
            nextIndex = Math.floor(Math.random() * songs.length);
        } else {
            nextIndex = (currentIndex + 1) % songs.length;
        }
        
        this.playSong(songs[nextIndex].id);
    }

    previousSong() {
        const songs = db.getSongs();
        if (songs.length === 0) return;
        
        const currentIndex = songs.findIndex(song => song.id === this.currentSong?.id);
        let prevIndex;
        
        if (this.isShuffled) {
            prevIndex = Math.floor(Math.random() * songs.length);
        } else {
            prevIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
        }
        
        this.playSong(songs[prevIndex].id);
    }

    // Player Controls
    updatePlayerUI() {
        if (!this.currentSong) return;
        
        document.getElementById('currentTitle').textContent = this.currentSong.title;
        document.getElementById('currentArtist').textContent = this.currentSong.artist;
        
        const artwork = document.getElementById('currentArtwork');
        if (this.currentSong.coverImageUrl) {
            artwork.innerHTML = `<img src="${this.currentSong.coverImageUrl}" alt="${this.currentSong.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
        } else {
            artwork.innerHTML = '<i class="fas fa-music"></i>';
        }
        
        // Update like button
        this.updateLikeButton();
    }

    updatePlayButton() {
        const playBtn = document.getElementById('playBtn');
        const icon = playBtn.querySelector('i');
        
        if (this.isPlaying) {
            icon.className = 'fas fa-pause';
        } else {
            icon.className = 'fas fa-play';
        }
    }

    updateLikeButton() {
        if (!this.currentUser || !this.currentSong) return;
        
        const likeBtn = document.getElementById('likeBtn');
        const icon = likeBtn.querySelector('i');
        
        if (db.isSongLiked(this.currentUser.id, this.currentSong.id)) {
            icon.className = 'fas fa-heart';
            likeBtn.classList.add('liked');
        } else {
            icon.className = 'far fa-heart';
            likeBtn.classList.remove('liked');
        }
    }

    toggleLike() {
        if (!this.currentUser || !this.currentSong) return;
        
        if (db.isSongLiked(this.currentUser.id, this.currentSong.id)) {
            db.unlikeSong(this.currentUser.id, this.currentSong.id);
        } else {
            db.likeSong(this.currentUser.id, this.currentSong.id);
        }
        
        this.updateLikeButton();
        
        // Refresh liked songs if on library page
        if (document.getElementById('libraryPage').classList.contains('active')) {
            this.loadLikedSongs();
        }
    }

    setVolume(value) {
        this.volume = value / 100;
        this.audioPlayer.volume = this.volume;
        
        // Update volume icon
        const volumeBtn = document.getElementById('volumeBtn');
        const icon = volumeBtn.querySelector('i');
        
        if (this.volume === 0) {
            icon.className = 'fas fa-volume-mute';
        } else if (this.volume < 0.5) {
            icon.className = 'fas fa-volume-down';
        } else {
            icon.className = 'fas fa-volume-up';
        }
    }

    toggleMute() {
        const volumeSlider = document.getElementById('volumeSlider');
        
        if (this.audioPlayer.volume > 0) {
            this.audioPlayer.volume = 0;
            volumeSlider.value = 0;
        } else {
            this.audioPlayer.volume = this.volume;
            volumeSlider.value = this.volume * 100;
        }
        
        this.setVolume(volumeSlider.value);
    }

    seekTo(position) {
        if (this.audioPlayer.duration) {
            this.audioPlayer.currentTime = (position / 100) * this.audioPlayer.duration;
        }
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        const shuffleBtn = document.getElementById('shuffleBtn');
        
        if (this.isShuffled) {
            shuffleBtn.classList.add('active');
        } else {
            shuffleBtn.classList.remove('active');
        }
    }

    toggleRepeat() {
        const modes = ['none', 'all', 'one'];
        const currentIndex = modes.indexOf(this.repeatMode);
        this.repeatMode = modes[(currentIndex + 1) % modes.length];
        
        const repeatBtn = document.getElementById('repeatBtn');
        const icon = repeatBtn.querySelector('i');
        
        switch(this.repeatMode) {
            case 'none':
                repeatBtn.classList.remove('active');
                icon.className = 'fas fa-redo';
                break;
            case 'all':
                repeatBtn.classList.add('active');
                icon.className = 'fas fa-redo';
                break;
            case 'one':
                repeatBtn.classList.add('active');
                icon.className = 'fas fa-redo';
                // Add a "1" indicator
                break;
        }
    }

    downloadSong() {
        if (!this.currentSong) return;
        
        // Create a temporary link to download the audio file
        const link = document.createElement('a');
        link.href = this.currentSong.audioUrl;
        link.download = `${this.currentSong.artist} - ${this.currentSong.title}.mp3`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Search
    performSearch(query) {
        const results = db.searchSongs(query);
        const resultsContainer = document.getElementById('searchResults');
        const noResults = document.getElementById('noResults');
        
        if (results.length > 0) {
            this.renderSongs('searchResults', results);
            noResults.classList.add('hidden');
        } else {
            resultsContainer.innerHTML = '';
            noResults.classList.remove('hidden');
        }
    }

    // Playlist Operations
    loadUserPlaylists() {
        const playlists = db.getUserPlaylists(this.currentUser.id);
        const container = document.getElementById('userPlaylists');
        const sidebarList = document.getElementById('playlistList');
        
        // Clear containers
        container.innerHTML = '';
        // Keep "Liked Songs" in sidebar and add user playlists
        const likedSongsItem = sidebarList.querySelector('[data-playlist="liked"]');
        sidebarList.innerHTML = '';
        if (likedSongsItem) {
            sidebarList.appendChild(likedSongsItem);
        }
        
        if (playlists.length === 0) {
            container.innerHTML = '<p class="no-results">No playlists yet. Create your first playlist!</p>';
            return;
        }
        
        playlists.forEach(playlist => {
            // Create playlist card for main area
            const card = document.createElement('div');
            card.className = 'song-card';
            card.innerHTML = `
                <div class="song-artwork">
                    <i class="fas fa-list-ul"></i>
                </div>
                <div class="song-title">${playlist.name}</div>
                <div class="song-artist">${playlist.songs ? playlist.songs.length : 0} songs</div>
            `;
            container.appendChild(card);
            
            // Add to sidebar
            const sidebarItem = document.createElement('li');
            sidebarItem.className = 'playlist-item';
            sidebarItem.innerHTML = `
                <i class="fas fa-list-ul"></i>
                <span>${playlist.name}</span>
            `;
            sidebarList.appendChild(sidebarItem);
        });
    }

    createPlaylist(name, description) {
        if (!this.currentUser) return;
        
        const playlist = db.createPlaylist({
            name: name,
            description: description,
            userId: this.currentUser.id
        });
        
        this.loadUserPlaylists();
        return playlist;
    }

    loadLikedSongs() {
        const likedSongs = db.getUserLikedSongs(this.currentUser.id);
        const songs = likedSongs.map(like => like.song);
        this.renderSongs('likedSongs', songs);
    }

    // Admin Functions
    showAddSongModal() {
        document.getElementById('addSongModal').classList.remove('hidden');
    }

    addSong(songData) {
        const song = db.createSong(songData);
        this.loadHomePage(); // Refresh home page
        return song;
    }

    // Utility Functions
    updateGreeting() {
        const hour = new Date().getHours();
        let greeting;
        
        if (hour < 12) {
            greeting = 'Good morning';
        } else if (hour < 18) {
            greeting = 'Good afternoon';
        } else {
            greeting = 'Good evening';
        }
        
        const userName = this.currentUser?.firstName || '';
        document.getElementById('greeting').textContent = greeting + (userName ? `, ${userName}` : '');
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Auth forms
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (this.login(username, password)) {
                // Clear form
                e.target.reset();
            } else {
                alert('Invalid username or password');
            }
        });

        document.getElementById('signupForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('newUsername').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('newPassword').value;
            
            const result = this.signup({ username, email, password });
            if (result.success) {
                e.target.reset();
            } else {
                alert(result.message);
            }
        });

        // Auth navigation
        document.getElementById('showSignup').addEventListener('click', (e) => {
            e.preventDefault();
            this.showSignupScreen();
        });

        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginScreen();
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                this.showPage(page);
            });
        });

        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            if (document.getElementById('searchPage').classList.contains('active')) {
                if (e.target.value.trim()) {
                    this.performSearch(e.target.value.trim());
                } else {
                    document.getElementById('searchResults').innerHTML = '';
                    document.getElementById('noResults').classList.add('hidden');
                }
            }
        });

        // Player controls
        document.getElementById('playBtn').addEventListener('click', () => {
            this.togglePlayPause();
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            this.nextSong();
        });

        document.getElementById('prevBtn').addEventListener('click', () => {
            this.previousSong();
        });

        document.getElementById('likeBtn').addEventListener('click', () => {
            this.toggleLike();
        });

        document.getElementById('shuffleBtn').addEventListener('click', () => {
            this.toggleShuffle();
        });

        document.getElementById('repeatBtn').addEventListener('click', () => {
            this.toggleRepeat();
        });

        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadSong();
        });

        document.getElementById('volumeBtn').addEventListener('click', () => {
            this.toggleMute();
        });

        document.getElementById('volumeSlider').addEventListener('input', (e) => {
            this.setVolume(e.target.value);
        });

        document.getElementById('progressSlider').addEventListener('input', (e) => {
            this.seekTo(e.target.value);
        });

        // Audio player events
        this.audioPlayer.addEventListener('loadedmetadata', () => {
            this.duration = this.audioPlayer.duration;
            document.getElementById('duration').textContent = this.formatTime(this.duration);
        });

        this.audioPlayer.addEventListener('timeupdate', () => {
            this.currentTime = this.audioPlayer.currentTime;
            document.getElementById('currentTime').textContent = this.formatTime(this.currentTime);
            
            if (this.duration > 0) {
                const progress = (this.currentTime / this.duration) * 100;
                document.getElementById('progressSlider').value = progress;
            }
        });

        this.audioPlayer.addEventListener('ended', () => {
            this.isPlaying = false;
            this.updatePlayButton();
            
            // Handle repeat modes
            if (this.repeatMode === 'one') {
                this.audioPlayer.currentTime = 0;
                this.audioPlayer.play();
            } else if (this.repeatMode === 'all') {
                this.nextSong();
            }
        });

        // Playlist creation
        document.getElementById('createPlaylist').addEventListener('click', () => {
            document.getElementById('createPlaylistModal').classList.remove('hidden');
        });

        document.getElementById('playlistForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('playlistName').value;
            const description = document.getElementById('playlistDescription').value;
            
            this.createPlaylist(name, description);
            
            // Close modal and reset form
            document.getElementById('createPlaylistModal').classList.add('hidden');
            e.target.reset();
        });

        // Modal controls
        document.getElementById('closeModal').addEventListener('click', () => {
            document.getElementById('createPlaylistModal').classList.add('hidden');
        });

        document.getElementById('cancelPlaylist').addEventListener('click', () => {
            document.getElementById('createPlaylistModal').classList.add('hidden');
        });

        // Library tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                
                // Remove active from all tabs and contents
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                // Add active to selected tab and content
                btn.classList.add('active');
                document.getElementById(tab + 'Tab').classList.add('active');
            });
        });

        // Admin functions
        document.getElementById('adminBtn').addEventListener('click', () => {
            this.showAddSongModal();
        });

        document.getElementById('songForm').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const title = document.getElementById('songTitle').value;
            const artist = document.getElementById('songArtist').value;
            const album = document.getElementById('songAlbum').value;
            const audioFile = document.getElementById('songFile').files[0];
            const coverFile = document.getElementById('coverFile').files[0];
            
            if (!audioFile) {
                alert('Please select an audio file');
                return;
            }
            
            // Create object URLs for local files
            const audioUrl = URL.createObjectURL(audioFile);
            let coverImageUrl = null;
            
            if (coverFile) {
                coverImageUrl = URL.createObjectURL(coverFile);
            }
            
            const songData = {
                title,
                artist,
                album,
                audioUrl,
                coverImageUrl,
                duration: 0 // Will be updated when audio loads
            };
            
            this.addSong(songData);
            
            // Close modal and reset form
            document.getElementById('addSongModal').classList.add('hidden');
            e.target.reset();
            
            alert('Song added successfully!');
        });

        document.getElementById('closeSongModal').addEventListener('click', () => {
            document.getElementById('addSongModal').classList.add('hidden');
        });

        document.getElementById('cancelSong').addEventListener('click', () => {
            document.getElementById('addSongModal').classList.add('hidden');
        });

        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });

        // Initialize volume
        this.setVolume(70);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SpotifyApp();
});