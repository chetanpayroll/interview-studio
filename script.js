/* ============================================ */
/* MODERN MOBILE ENHANCEMENTS & UTILITIES */
/* ============================================ */

// Theme Management
const ThemeManager = {
    init() {
        this.themeToggle = document.getElementById('themeToggle');
        this.loadTheme();
        this.setupListeners();
    },

    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');
        this.setTheme(theme);
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateMetaThemeColor(theme);
    },

    updateMetaThemeColor(theme) {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', '#6366f1');
        }
    },

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        this.triggerHapticFeedback('light');
    },

    triggerHapticFeedback(type = 'medium') {
        if ('vibrate' in navigator) {
            const patterns = {
                light: [10],
                medium: [20],
                heavy: [30, 10, 30]
            };
            navigator.vibrate(patterns[type] || patterns.medium);
        }
    },

    setupListeners() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
};

// Touch Gesture Handler
const TouchGestureHandler = {
    init() {
        this.startX = 0;
        this.startY = 0;
        this.setupTouchListeners();
    },

    setupTouchListeners() {
        const cards = document.querySelectorAll('.interview-card');

        cards.forEach(card => {
            let touchStartX = 0;
            let touchStartY = 0;

            card.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }, { passive: true });

            card.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                const diffX = touchStartX - touchEndX;
                const diffY = touchStartY - touchEndY;

                // Detect swipe gestures
                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        this.handleSwipeLeft(card);
                    } else {
                        this.handleSwipeRight(card);
                    }
                }
            }, { passive: true });
        });
    },

    handleSwipeLeft(card) {
        // Navigate to next question
        const currentQuestion = parseInt(card.getAttribute('data-question'));
        const nextCard = document.querySelector(`[data-question="${currentQuestion + 1}"]`);
        if (nextCard) {
            nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            ThemeManager.triggerHapticFeedback('light');
        }
    },

    handleSwipeRight(card) {
        // Navigate to previous question
        const currentQuestion = parseInt(card.getAttribute('data-question'));
        const prevCard = document.querySelector(`[data-question="${currentQuestion - 1}"]`);
        if (prevCard) {
            prevCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            ThemeManager.triggerHapticFeedback('light');
        }
    }
};

// Network Status Monitor
const NetworkMonitor = {
    init() {
        this.setupListeners();
        this.updateStatus();
    },

    setupListeners() {
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
    },

    updateStatus() {
        if (!navigator.onLine) {
            this.handleOffline();
        }
    },

    handleOnline() {
        const indicator = document.querySelector('.offline-indicator');
        if (indicator) {
            indicator.classList.remove('show');
            setTimeout(() => indicator.remove(), 300);
        }
        console.log('✅ Back online');
    },

    handleOffline() {
        let indicator = document.querySelector('.offline-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'offline-indicator';
            indicator.innerHTML = '📡 Offline Mode - Cached content available';
            document.body.appendChild(indicator);
            setTimeout(() => indicator.classList.add('show'), 100);
        }
        console.log('📡 Offline mode activated');
    }
};

// Share API Handler
const ShareHandler = {
    async share(questionNumber) {
        const answerElement = document.querySelector(`#answer-${questionNumber} .answer-text`);
        const questionElement = document.querySelector(`[data-question="${questionNumber}"] .question-text`);

        if (!answerElement || !questionElement) return;

        const title = questionElement.textContent;
        const text = answerElement.innerText;
        const url = window.location.href + `#question-${questionNumber}`;

        if (navigator.share) {
            try {
                await navigator.share({ title, text: text.substring(0, 200) + '...', url });
                console.log('✅ Content shared successfully');
                ThemeManager.triggerHapticFeedback('medium');
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.log('Share cancelled or failed');
                }
            }
        } else {
            // Fallback to copy
            this.copyToClipboard(text);
        }
    },

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('✅ Copied to clipboard');
        });
    }
};

/* ============================================ */
/* INTERVIEW CARD TOGGLE FUNCTIONALITY */
/* ============================================ */
function toggleAnswer(questionNumber) {
    const card = document.querySelector(`[data-question="${questionNumber}"]`);
    const isActive = card.classList.contains('active');

    // Close all other cards
    document.querySelectorAll('.interview-card').forEach(c => {
        c.classList.remove('active');
    });

    // Toggle current card
    if (!isActive) {
        card.classList.add('active');
        ThemeManager.triggerHapticFeedback('light');

        // Smooth scroll to card after expansion
        setTimeout(() => {
            const cardTop = card.getBoundingClientRect().top + window.pageYOffset;
            const offset = 100;
            window.scrollTo({
                top: cardTop - offset,
                behavior: 'smooth'
            });
        }, 300);
    }
}

/* ============================================ */
/* COPY ANSWER FUNCTIONALITY */
/* ============================================ */
function copyAnswer(questionNumber) {
    const answerElement = document.querySelector(`#answer-${questionNumber} .answer-text`);
    const button = document.querySelector(`#answer-${questionNumber} .copy-btn`);

    if (!answerElement || !button) return;

    // Get the text content
    const textToCopy = answerElement.innerText;

    // Copy to clipboard
    navigator.clipboard.writeText(textToCopy).then(() => {
        // Visual feedback
        const originalHTML = button.innerHTML;
        button.classList.add('copied');
        button.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Copied!
        `;

        // Reset after 2 seconds
        setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = originalHTML;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy text. Please try selecting and copying manually.');
    });
}

/* ============================================ */
/* SCROLL ANIMATIONS */
/* ============================================ */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation to improve performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    const elementsToAnimate = document.querySelectorAll(`
        .profile-card,
        .interview-card,
        .timeline-item,
        .tool-card,
        .cta-content
    `);

    elementsToAnimate.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

/* ============================================ */
/* SMOOTH SCROLL FOR ANCHOR LINKS */
/* ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if href is just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }

            const targetElement = document.querySelector(href);

            if (targetElement) {
                e.preventDefault();
                const offsetTop = targetElement.offsetTop - 80;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ============================================ */
/* PARALLAX EFFECT FOR HERO */
/* ============================================ */
function initParallax() {
    const heroBackground = document.querySelector('.hero-background');

    if (!heroBackground) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;

        if (scrolled < window.innerHeight) {
            heroBackground.style.transform = `translate3d(0, ${rate}px, 0)`;
        }
    });
}

/* ============================================ */
/* NAVBAR SCROLL EFFECT (IF ADDED LATER) */
/* ============================================ */
function initNavbarScroll() {
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const navbar = document.querySelector('.navbar');

        if (!navbar) return;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

/* ============================================ */
/* TYPING EFFECT FOR HERO (OPTIONAL) */
/* ============================================ */
function initTypingEffect() {
    const typingElements = document.querySelectorAll('[data-typing]');

    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.opacity = '1';

        let index = 0;
        const speed = 50;

        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);
            }
        }

        // Start typing after a delay
        setTimeout(type, 500);
    });
}

/* ============================================ */
/* CARD HOVER 3D EFFECT */
/* ============================================ */
/* ============================================ */
/* CARD HOVER EFFECT - SIMPLIFIED */
/* ============================================ */
function init3DCardEffect() {
    // 3D Tilt effect removed for simpler interaction
    // Retaining basic hover effect via CSS
}

/* ============================================ */
/* LOADING ANIMATION */
/* ============================================ */
function initLoadingAnimation() {
    // Add loading class to body
    document.body.classList.add('loading');

    // Remove loading class after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.classList.remove('loading');
        }, 500);
    });
}

/* ============================================ */
/* PROGRESS BAR ON SCROLL */
/* ============================================ */
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #6366f1, #8b5cf6);
        width: 0%;
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

/* ============================================ */
/* KEYBOARD NAVIGATION FOR INTERVIEW CARDS */
/* ============================================ */
function initKeyboardNavigation() {
    let currentCardIndex = -1;
    const cards = Array.from(document.querySelectorAll('.interview-card'));

    document.addEventListener('keydown', (e) => {
        // Only activate keyboard navigation if no input is focused
        if (document.activeElement.tagName === 'INPUT' ||
            document.activeElement.tagName === 'TEXTAREA') {
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentCardIndex = Math.min(currentCardIndex + 1, cards.length - 1);
            if (currentCardIndex >= 0) {
                cards[currentCardIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentCardIndex = Math.max(currentCardIndex - 1, 0);
            if (currentCardIndex >= 0) {
                cards[currentCardIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else if (e.key === 'Enter' && currentCardIndex >= 0) {
            const questionNumber = cards[currentCardIndex].getAttribute('data-question');
            toggleAnswer(parseInt(questionNumber));
        }
    });
}

/* ============================================ */
/* MOBILE MENU TOGGLE (IF NAVIGATION ADDED) */
/* ============================================ */
function initMobileMenu() {
    const menuButton = document.querySelector('.mobile-menu-btn');
    const menu = document.querySelector('.mobile-menu');

    if (!menuButton || !menu) return;

    menuButton.addEventListener('click', () => {
        menu.classList.toggle('active');
        menuButton.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });

    // Close menu when clicking on a link
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            menuButton.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
}

/* ============================================ */
/* LAZY LOADING FOR PERFORMANCE */
/* ============================================ */
const LazyLoader = {
    init() {
        if ('IntersectionObserver' in window) {
            this.observeImages();
        } else {
            this.loadAllImages();
        }
    },

    observeImages() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    },

    loadAllImages() {
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
};

/* ============================================ */
/* PERFORMANCE MONITOR */
/* ============================================ */
const PerformanceMonitor = {
    init() {
        if ('PerformanceObserver' in window) {
            this.observePerformance();
        }
    },

    observePerformance() {
        try {
            // Observe long tasks
            const longTaskObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 50) {
                        console.warn('⚠️ Long task detected:', entry.duration, 'ms');
                    }
                }
            });
            longTaskObserver.observe({ entryTypes: ['longtask'] });
        } catch (e) {
            // Long task API not supported
        }

        // Log page load performance
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('📊 Performance Metrics:');
                console.log('  DOM Content Loaded:', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart, 'ms');
                console.log('  Page Load Complete:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }
};

/* ============================================ */
/* PULL TO REFRESH (Mobile) */
/* ============================================ */
const PullToRefresh = {
    init() {
        if (!('ontouchstart' in window)) return;

        let touchStartY = 0;
        let touchEndY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            touchEndY = e.touches[0].clientY;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Only trigger at top of page
            if (scrollTop === 0 && touchEndY > touchStartY + 100) {
                // Add visual feedback here if desired
            }
        }, { passive: true });

        document.addEventListener('touchend', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop === 0 && touchEndY > touchStartY + 150) {
                this.refresh();
            }
        }, { passive: true });
    },

    refresh() {
        console.log('🔄 Pull to refresh triggered');
        ThemeManager.triggerHapticFeedback('medium');

        // Update service worker cache
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
                type: 'CACHE_URLS',
                payload: ['/', '/index.html', '/style.css', '/script.js']
            });
        }

        // Show refresh indicator
        const indicator = document.createElement('div');
        indicator.className = 'offline-indicator show';
        indicator.innerHTML = '✅ Content refreshed';
        indicator.style.background = 'var(--success-color)';
        document.body.appendChild(indicator);

        setTimeout(() => {
            indicator.classList.remove('show');
            setTimeout(() => indicator.remove(), 300);
        }, 2000);
    }
};

/* ============================================ */
/* INITIALIZE ALL FUNCTIONS ON PAGE LOAD */
/* ============================================ */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize modern mobile features
    ThemeManager.init();
    TouchGestureHandler.init();
    NetworkMonitor.init();
    LazyLoader.init();
    PerformanceMonitor.init();
    PullToRefresh.init();

    // Core functionality
    initScrollAnimations();
    initSmoothScroll();
    initParallax();

    // Enhanced features
    init3DCardEffect();
    initScrollProgress();
    initKeyboardNavigation();

    // Optional features
    // initTypingEffect(); // Uncomment if you want typing effect
    // initMobileMenu(); // Uncomment if you add mobile navigation

    // Performance optimization: debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }

        scrollTimeout = window.requestAnimationFrame(() => {
            // Additional scroll-based animations can go here
        });
    }, { passive: true });

    // Log successful initialization
    console.log('✅ Interview Studio - Modern PWA Loaded');
    console.log('🎨 Theme:', document.documentElement.getAttribute('data-theme'));
    console.log('📱 Touch gestures: Enabled');
    console.log('🌐 Offline support: Active');
    console.log('💾 Service Worker:', 'serviceWorker' in navigator ? 'Supported' : 'Not supported');
});

/* ============================================ */
/* EASTER EGGS & SPECIAL EFFECTS */
/* ============================================ */

// Konami Code Easter Egg (Up Up Down Down Left Right Left Right B A)
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join('') === konamiPattern.join('')) {
        activateSpecialMode();
    }
});

function activateSpecialMode() {
    // Add special visual effects
    document.body.style.animation = 'rainbow 5s linear infinite';

    // Create confetti effect
    createConfetti();

    // Show achievement message
    showAchievement('🎉 Premium Mode Activated!');
}

function createConfetti() {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random()};
            transform: rotate(${Math.random() * 360}deg);
            animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
            pointer-events: none;
            z-index: 10000;
        `;
        document.body.appendChild(confetti);

        setTimeout(() => confetti.remove(), 5000);
    }
}

function showAchievement(message) {
    const achievement = document.createElement('div');
    achievement.textContent = message;
    achievement.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        padding: 2rem 3rem;
        border-radius: 16px;
        font-size: 2rem;
        font-weight: 700;
        box-shadow: 0 20px 60px rgba(99, 102, 241, 0.5);
        z-index: 10001;
        animation: achievementPop 3s ease forwards;
    `;
    document.body.appendChild(achievement);

    setTimeout(() => achievement.remove(), 3000);
}

// Add CSS animations for special effects
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
    
    @keyframes confettiFall {
        to {
            top: 100vh;
            transform: translateX(${Math.random() * 200 - 100}px) rotate(${Math.random() * 720}deg);
        }
    }
    
    @keyframes achievementPop {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 1;
        }
        70% {
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/* ============================================ */
/* UTILITY FUNCTIONS */
/* ============================================ */

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ============================================ */
/* ANALYTICS & TRACKING (PLACEHOLDER) */
/* ============================================ */
function trackEvent(category, action, label) {
    // Placeholder for analytics tracking
    console.log('Event tracked:', { category, action, label });

    // Example: Google Analytics
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', action, {
    //         'event_category': category,
    //         'event_label': label
    //     });
    // }
}

// Track interview card interactions
document.addEventListener('click', (e) => {
    if (e.target.closest('.question-header')) {
        const card = e.target.closest('.interview-card');
        const questionNumber = card.getAttribute('data-question');
        trackEvent('Interview', 'Question Expanded', `Question ${questionNumber}`);
    }

    if (e.target.closest('.copy-btn')) {
        const answerContent = e.target.closest('.answer-content');
        const questionNumber = answerContent.id.split('-')[1];
        trackEvent('Interview', 'Answer Copied', `Question ${questionNumber}`);
    }
});

/* ============================================ */
/* ACCESSIBILITY ENHANCEMENTS */
/* ============================================ */
function initAccessibility() {
    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#interview-section';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: #6366f1;
        color: white;
        padding: 8px;
        text-decoration: none;
        z-index: 100;
    `;
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add ARIA labels to interactive elements
    document.querySelectorAll('.interview-card').forEach((card, index) => {
        const header = card.querySelector('.question-header');
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', 'false');
        header.setAttribute('aria-label', `Expand answer for question ${index + 1}`);
        header.setAttribute('tabindex', '0');

        // Add keyboard support
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const questionNumber = card.getAttribute('data-question');
                toggleAnswer(parseInt(questionNumber));

                const isExpanded = card.classList.contains('active');
                header.setAttribute('aria-expanded', isExpanded);
            }
        });
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initAccessibility);

console.log('🎯 GMP Payroll Interview Studio - Next-Gen PWA Loaded Successfully');
console.log('💡 Mobile Features:');
console.log('  • Swipe left/right on cards to navigate');
console.log('  • Pull down to refresh content');
console.log('  • Tap theme toggle to switch dark/light mode');
console.log('  • Works offline with cached content');
console.log('  • Install as app from browser menu');
console.log('⌨️ Keyboard shortcuts: Arrow keys to navigate, Enter to expand');
console.log('🎉 Easter egg: Try the Konami Code!');

/* ============================================ */
/* CANVAS BACKGROUND ANIMATION */
/* ============================================ */
const CanvasAnimation = {
    init() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.particles = [];
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    },

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    createParticles() {
        const particleCount = Math.min(window.innerWidth / 10, 100); // Responsive count
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                color: Math.random() > 0.5 ? '#6366f1' : '#ec4899' // Primary or Secondary
            });
        }
    },

    handleMouseMove(e) {
        // Gentle repulsion or attraction could go here
        // For now, let's just make particles near mouse slightly larger
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    },

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, index) => {
            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off walls
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = 0.5;
            this.ctx.fill();

            // Connect particles
            for (let j = index + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(148, 163, 184, ${0.1 * (1 - distance / 150)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        });

        requestAnimationFrame(() => this.animate());
    }
};

// Start animation
document.addEventListener('DOMContentLoaded', () => {
    CanvasAnimation.init();
});