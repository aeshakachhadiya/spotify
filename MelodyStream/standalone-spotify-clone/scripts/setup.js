// Setup script for Spotify Clone
// This script helps initialize the application and check browser compatibility

class SetupChecker {
    constructor() {
        this.setupResults = {
            localStorage: false,
            audioSupport: false,
            es6Support: false,
            fetchSupport: false,
            browserCompatible: false
        };
    }

    checkBrowserCompatibility() {
        console.log('🔍 Checking browser compatibility...');
        
        // Check localStorage support
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            this.setupResults.localStorage = true;
            console.log('✅ localStorage supported');
        } catch (e) {
            console.log('❌ localStorage not supported');
        }

        // Check Audio API support
        try {
            const audio = new Audio();
            this.setupResults.audioSupport = true;
            console.log('✅ Audio API supported');
        } catch (e) {
            console.log('❌ Audio API not supported');
        }

        // Check ES6 support
        try {
            eval('const test = () => {}; class Test {}');
            this.setupResults.es6Support = true;
            console.log('✅ ES6 features supported');
        } catch (e) {
            console.log('❌ ES6 features not supported');
        }

        // Check Fetch API support
        if (typeof fetch !== 'undefined') {
            this.setupResults.fetchSupport = true;
            console.log('✅ Fetch API supported');
        } else {
            console.log('❌ Fetch API not supported');
        }

        // Overall compatibility
        this.setupResults.browserCompatible = 
            this.setupResults.localStorage &&
            this.setupResults.audioSupport &&
            this.setupResults.es6Support;

        if (this.setupResults.browserCompatible) {
            console.log('🎉 Browser is compatible with Spotify Clone!');
        } else {
            console.log('⚠️ Browser may have compatibility issues');
        }

        return this.setupResults;
    }

    displaySystemInfo() {
        console.log('📊 System Information:');
        console.log(`Browser: ${navigator.userAgent}`);
        console.log(`Screen: ${screen.width}x${screen.height}`);
        console.log(`Viewport: ${window.innerWidth}x${window.innerHeight}`);
        console.log(`Platform: ${navigator.platform}`);
        console.log(`Language: ${navigator.language}`);
        console.log(`Online: ${navigator.onLine ? 'Yes' : 'No'}`);
    }

    checkNetworkConnectivity() {
        console.log('🌐 Checking network connectivity...');
        
        if (!navigator.onLine) {
            console.log('❌ Device is offline');
            return false;
        }

        // Test connectivity to sample audio source
        fetch('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', { 
            method: 'HEAD',
            mode: 'no-cors'
        })
        .then(() => {
            console.log('✅ Network connectivity confirmed');
        })
        .catch(() => {
            console.log('⚠️ Network connectivity issues detected');
        });

        return true;
    }

    initializeApplication() {
        console.log('🚀 Initializing Spotify Clone...');
        
        // Create welcome message
        const welcomeMessage = `
        🎵 Welcome to Spotify Clone! 🎵
        
        Setup Status:
        ${this.setupResults.localStorage ? '✅' : '❌'} Local Storage
        ${this.setupResults.audioSupport ? '✅' : '❌'} Audio Support
        ${this.setupResults.es6Support ? '✅' : '❌'} Modern JavaScript
        ${this.setupResults.fetchSupport ? '✅' : '❌'} Network Requests
        
        ${this.setupResults.browserCompatible ? 
            '🎉 All systems ready! You can now use the application.' :
            '⚠️ Some features may not work properly in this browser.'
        }
        
        Default Login Credentials:
        👤 Username: demo | Password: password123
        👑 Username: admin | Password: admin123
        `;

        console.log(welcomeMessage);

        // Show setup status in UI if available
        if (document.getElementById('setupStatus')) {
            document.getElementById('setupStatus').innerHTML = welcomeMessage.replace(/\n/g, '<br>');
        }

        return this.setupResults.browserCompatible;
    }

    runFullSetup() {
        console.log('🔧 Running Spotify Clone Setup...');
        
        this.displaySystemInfo();
        this.checkBrowserCompatibility();
        this.checkNetworkConnectivity();
        
        const isReady = this.initializeApplication();
        
        if (!isReady) {
            console.log(`
                ⚠️ Setup Recommendations:
                
                For best experience, please use:
                - Google Chrome 70+ ✅
                - Mozilla Firefox 65+ ✅
                - Microsoft Edge 79+ ✅
                - Safari 12+ ✅
                
                If you're using an older browser, consider updating.
            `);
        }

        return isReady;
    }
}

// Auto-run setup when script loads
document.addEventListener('DOMContentLoaded', () => {
    const setup = new SetupChecker();
    setup.runFullSetup();
});

// Make setup checker available globally
window.SetupChecker = SetupChecker;