# Spotify Clone - Standalone Web Application

A complete Spotify-like music streaming application built with HTML, CSS, and JavaScript using localStorage as the database. This application runs entirely in your browser without requiring any server setup.

## Features

### 🔐 Authentication System
- **Login & Sign-up pages** with secure credential storage
- **User session management** with localStorage
- **Default accounts**: 
  - Username: `demo`, Password: `password123`
  - Username: `admin`, Password: `admin123` (admin privileges)

### 🎵 Music Dashboard
- **Browse all songs** with a beautiful grid layout
- **Play/Pause controls** with real-time audio playback
- **Volume control** and progress bar
- **Next/Previous song navigation**
- **Shuffle and repeat modes**
- **Download songs** directly from the player

### 📝 Playlist Management
- **Create custom playlists** with names and descriptions
- **Add/remove songs** from playlists
- **View playlists** in the sidebar for easy access
- **Manage your music library** with organized collections

### ❤️ Song Management
- **Like/unlike songs** with heart button
- **View liked songs** in a dedicated section
- **Search functionality** to find songs by title, artist, or album
- **Admin features** to add new songs (upload local files)

### 🎨 User Interface
- **Dark Spotify-like theme** with modern design
- **Responsive layout** that works on desktop and mobile
- **Smooth animations** and hover effects
- **Professional navigation** with sidebar and main content area

### 💾 Data Storage
- **localStorage database** that persists your data
- **6 pre-loaded sample songs** with real audio files
- **User data management** for playlists and preferences
- **Data export/import** capabilities for backup

## Step-by-Step Setup Instructions

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software installation required

### Method 1: Quick Start (Simplest)

1. **Download the Complete Folder**
   ```
   Download the entire "standalone-spotify-clone" folder
   Extract it to your desktop or preferred location
   ```

2. **Run the Installer**
   
   **Windows Users:**
   ```
   Double-click "scripts/installer.bat"
   The installer will automatically start the application
   ```
   
   **Mac/Linux Users:**
   ```
   Open Terminal in the project folder
   Run: ./scripts/installer.sh
   ```

3. **Manual Start (Alternative)**
   ```
   Double-click "index.html" to open directly in browser
   OR
   Right-click "index.html" → "Open with" → Choose your browser
   ```

4. **Login to Start**
   ```
   Use one of these accounts:
   - Username: demo, Password: password123
   - Username: admin, Password: admin123
   
   Or create your own account by clicking "Sign up"
   ```

### Method 2: Run with Local Web Server (Recommended)

1. **Download Files** (same as Method 1)

2. **Start a Local Server**
   
   **Option A: Using Python (if installed)**
   ```bash
   cd path/to/spotify-clone
   python -m http.server 8000
   ```
   
   **Option B: Using Node.js (if installed)**
   ```bash
   cd path/to/spotify-clone
   npx http-server -p 8000
   ```
   
   **Option C: Using Live Server Extension (VS Code)**
   - Install "Live Server" extension in VS Code
   - Right-click on index.html → "Open with Live Server"

3. **Access the Application**
   ```
   Open your browser and go to: http://localhost:8000
   ```

### Method 3: Online Deployment

1. **Upload to GitHub Pages**
   - Create a GitHub repository
   - Upload all 4 files
   - Enable GitHub Pages in repository settings
   - Access via: https://yourusername.github.io/repository-name

2. **Upload to Netlify**
   - Drag and drop the folder to netlify.com
   - Get instant live URL

## How to Use the Application

### Getting Started

1. **Login/Signup**
   - Use demo credentials or create new account
   - Your data will be saved in browser storage

2. **Browse Music**
   - Homepage shows all available songs
   - Click any song to start playing
   - Use search bar to find specific songs

3. **Control Playback**
   - Play/pause with the center button
   - Adjust volume with the slider
   - Seek through song with progress bar
   - Use next/previous buttons

### Creating Playlists

1. **Create New Playlist**
   - Click the "+" button in the sidebar
   - Enter playlist name and description
   - Click "Create"

2. **Add Songs to Playlist**
   - Currently manual process (can be enhanced)
   - Playlists appear in sidebar

### Liking Songs

1. **Like a Song**
   - Play any song
   - Click the heart button in the player
   - View liked songs in "Your Library"

### Admin Features (admin account only)

1. **Add New Songs**
   - Login with admin account
   - Click the green "+" floating button
   - Upload audio file and cover image
   - Fill in song details

## File Structure

```
standalone-spotify-clone/
├── index.html              # Main HTML structure
├── styles.css              # All styling and responsive design  
├── database.js             # localStorage database operations
├── app.js                  # Main application logic
├── README.md               # Setup and usage instructions
├── database/
│   ├── init.sql           # SQLite schema (optional upgrade)
│   └── sqlite-database.js # SQLite implementation (advanced)
├── assets/
│   ├── sample-songs/      # Directory for local audio files
│   └── images/            # Directory for cover art and images
└── scripts/
    ├── setup.js           # Browser compatibility checker
    ├── installer.bat      # Windows installer script
    └── installer.sh       # Mac/Linux installer script
```

## Default Accounts

| Username | Password | Type | Features |
|----------|----------|------|----------|
| demo | password123 | User | Full user features |
| admin | admin123 | Admin | User features + Add songs |

## Sample Songs Included

1. **Blinding Lights** - The Weeknd
2. **Shape of You** - Ed Sheeran  
3. **Someone Like You** - Adele
4. **Bohemian Rhapsody** - Queen
5. **Imagine** - John Lennon
6. **Hotel California** - Eagles

*All sample songs use royalty-free audio from SoundHelix for demonstration purposes.*

## Browser Compatibility

- ✅ **Chrome 70+**
- ✅ **Firefox 65+**
- ✅ **Safari 12+**
- ✅ **Edge 79+**
- ✅ **Mobile browsers**

## Troubleshooting

### Common Issues

1. **Songs won't play**
   - Check internet connection (sample songs are hosted online)
   - Try a different browser
   - Ensure audio is not muted

2. **Data not saving**
   - Enable localStorage in browser settings
   - Clear browser cache and try again
   - Check if in private/incognito mode

3. **Layout issues**
   - Try refreshing the page
   - Check browser zoom level (should be 100%)
   - Try a different browser

### Audio File Requirements (for adding new songs)

- **Supported formats**: MP3, WAV, OGG
- **Recommended**: MP3 files under 10MB
- **Image formats**: JPG, PNG, GIF for cover art

## Data Management

### Backup Your Data
```javascript
// Run in browser console to export data:
console.log(JSON.stringify(db.exportData()));

// Copy the output and save to a file
```

### Reset All Data
```javascript
// Run in browser console to clear all data:
db.clearDatabase();
location.reload();
```

## Advanced Features

### Adding More Songs
1. Login as admin (admin/admin123)
2. Click the green "+" button
3. Upload your audio file and cover image
4. Fill in song details

### Customization
- Edit `styles.css` to change colors and layout
- Modify `database.js` to add more sample data
- Enhance `app.js` to add new features

## Performance Notes

- Application loads instantly (no server required)
- Stores up to ~5MB of data in localStorage
- Works offline after initial load
- No external dependencies except sample audio files

## Security Notes

- Passwords are stored in plain text (for demo purposes)
- Data is stored locally in your browser
- No external servers involved (privacy-friendly)
- All file uploads stay local to your device

## Next Steps for Enhancement

1. **Add real authentication** with password hashing
2. **Implement SQLite** using SQL.js library
3. **Add more playlist features** like drag-and-drop
4. **Enhanced audio controls** with equalizer
5. **Social features** like sharing playlists
6. **Offline mode** with service workers

---

**Enjoy your personal Spotify clone!** 🎵

For issues or questions, check the browser console for error messages.