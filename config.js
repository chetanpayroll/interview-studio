/* ============================================ */
/* INTERVIEW STUDIO - CENTRALIZED CONFIGURATION */
/* ============================================ */

/**
 * Global configuration object for Interview Studio
 * Centralized settings for easy customization and maintenance
 */

const CONFIG = {
    // ========== SITE INFORMATION ==========
    site: {
        name: 'Interview Studio',
        tagline: 'Global Payroll Implementation',
        description: 'Professional interview preparation for Global Payroll Implementation Consultants',
        url: 'https://in.gmppayroll.com',
        author: 'GMP Payroll',
        version: '3.0.0',
        year: new Date().getFullYear()
    },

    // ========== DESIGN SYSTEM ==========
    design: {
        // Color Schemes
        colors: {
            dark: {
                primary: '#6366f1',
                secondary: '#ec4899',
                accent: '#06b6d4',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                bgDeep: '#030712',
                bgSurface: '#0f172a',
                textMain: '#f8fafc',
                textMuted: '#94a3b8'
            },
            light: {
                primary: '#6366f1',
                secondary: '#ec4899',
                accent: '#06b6d4',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                bgDeep: '#f8fafc',
                bgSurface: '#ffffff',
                textMain: '#0f172a',
                textMuted: '#475569'
            }
        },

        // Animation Settings
        animations: {
            durationFast: 200,
            durationNormal: 300,
            durationSlow: 600,
            easingElastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            easingSmooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
            easingSharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)'
        },

        // Typography
        fonts: {
            heading: "'Space Grotesk', sans-serif",
            body: "'Outfit', sans-serif",
            mono: "'Fira Code', monospace"
        }
    },

    // ========== FEATURES ==========
    features: {
        // Enable/Disable Features
        enableParticles: true,
        enableSoundEffects: false, // Toggle sound feedback
        enableAnalytics: true,
        enableSearch: true,
        enableFilters: true,
        enableFavorites: true,
        enableNotes: true,
        enableExport: true,
        enablePracticeMode: false, // Coming soon
        enableShareLinks: true,
        enableReadingProgress: true,
        enableAutoHighlight: true,
        
        // PWA Settings
        pwa: {
            enableInstallPrompt: true,
            enableNotifications: false, // Future feature
            enableOfflineMode: true,
            cacheVersion: 'v3.0.0'
        },

        // Particle System Configuration
        particles: {
            count: 50,
            maxSize: 4,
            minSize: 1,
            speed: 0.5,
            connectionDistance: 100,
            color: 'rgba(99, 102, 241, 0.6)'
        }
    },

    // ========== CONTENT SETTINGS ==========
    content: {
        // Question Categories
        categories: [
            { id: 'all', name: 'All Questions', icon: '📋' },
            { id: 'behavioral', name: 'Behavioral', icon: '💬' },
            { id: 'technical', name: 'Technical', icon: '⚙️' },
            { id: 'scenario', name: 'Scenario-Based', icon: '🎯' }
        ],

        // Difficulty Levels
        difficultyLevels: [
            { id: 'easy', name: 'Easy', color: '#10b981', icon: '🟢' },
            { id: 'medium', name: 'Medium', color: '#f59e0b', icon: '🟡' },
            { id: 'hard', name: 'Hard', color: '#ef4444', icon: '🔴' }
        ],

        // Data Source
        questionsDataUrl: './questions-data.json',

        // Export Formats
        exportFormats: ['PDF', 'DOCX', 'Markdown', 'JSON', 'TXT']
    },

    // ========== PERFORMANCE ==========
    performance: {
        lazyLoadImages: true,
        enableServiceWorker: true,
        preloadNextQuestion: true,
        debounceDelay: 300,
        throttleDelay: 150,
        targetBundleSize: 500, // KB
        enableCodeSplitting: false // Not needed for vanilla JS
    },

    // ========== ANALYTICS ==========
    analytics: {
        trackPageViews: true,
        trackQuestionViews: true,
        trackTimeSpent: true,
        trackCopyActions: true,
        trackFavorites: true,
        storageKey: 'interview-studio-analytics'
    },

    // ========== LOCAL STORAGE KEYS ==========
    storage: {
        theme: 'interview-studio-theme',
        favorites: 'interview-studio-favorites',
        notes: 'interview-studio-notes',
        analytics: 'interview-studio-analytics',
        lastVisit: 'interview-studio-last-visit',
        userData: 'interview-studio-user-data',
        practiceHistory: 'interview-studio-practice-history'
    },

    // ========== EASTER EGGS ==========
    easterEggs: {
        konamiCode: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],
        secretShortcuts: [
            { keys: ['Ctrl', 'Shift', 'L'], action: 'toggleLightShow' },
            { keys: ['Ctrl', 'Shift', 'P'], action: 'partyMode' },
            { keys: ['Ctrl', 'Shift', 'R'], action: 'rainbowMode' },
            { keys: ['Ctrl', 'Shift', 'M'], action: 'matrixMode' },
            { keys: ['Ctrl', 'Shift', 'S'], action: 'snowMode' }
        ]
    },

    // ========== API ENDPOINTS (Future Use) ==========
    api: {
        baseUrl: '', // Future: Backend API
        endpoints: {
            questions: '/api/questions',
            analytics: '/api/analytics',
            feedback: '/api/feedback'
        }
    },

    // ========== SOCIAL SHARING ==========
    social: {
        twitter: {
            handle: '@gmppayroll',
            hashtags: ['InterviewPrep', 'GlobalPayroll', 'CareerGrowth']
        },
        linkedin: {
            enabled: true
        },
        facebook: {
            enabled: false
        }
    },

    // ========== ACCESSIBILITY ==========
    accessibility: {
        enableReducedMotion: true, // Respect prefers-reduced-motion
        enableHighContrast: true,
        enableScreenReaderAnnouncements: true,
        minTouchTargetSize: 44, // px (WCAG AAA: 44x44)
        focusVisibleOutlineWidth: 3 // px
    },

    // ========== MULTILANGUAGE (Future) ==========
    i18n: {
        enabled: false,
        defaultLanguage: 'en',
        supportedLanguages: [
            { code: 'en', name: 'English', flag: '🇬🇧' },
            { code: 'es', name: 'Español', flag: '🇪🇸' },
            { code: 'fr', name: 'Français', flag: '🇫🇷' },
            { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
            { code: 'zh', name: '中文', flag: '🇨🇳' },
            { code: 'ja', name: '日本語', flag: '🇯🇵' },
            { code: 'ar', name: 'العربية', flag: '🇸🇦' },
            { code: 'hi', name: 'हिंदी', flag: '🇮🇳' }
        ]
    },

    // ========== DEVELOPER OPTIONS ==========
    dev: {
        enableDebugMode: false,
        enablePerformanceMonitoring: true,
        logLevel: 'info', // 'debug', 'info', 'warn', 'error'
        showFPS: false,
        showMemoryUsage: false
    }
};

// Freeze configuration to prevent accidental modifications
Object.freeze(CONFIG);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
