/* ============================================ */
/* INTERVIEW STUDIO - ENHANCED ENGINE v3.0 */
/* All Advanced Features Implementation */
/* ============================================ */

// ========== STATE MANAGEMENT ==========
const InterviewStudio = {
    // Application State
    state: {
        allQuestions: [],
        filteredQuestions: [],
        favorites: new Set(),
        notes: {},
        analytics: {
            viewed: new Set(),
            timeSpent: {},
            lastVisit: null,
            totalSessions: 0
        },
        filters: {
            search: '',
            category: 'all',
            difficulty: 'all',
            company: 'all',
            round: 'all',
            favorites: false
        },
        currentQuestion: null,
        practiceMode: false
    },

    // Initialize the app
    init() {
        this.loadFromStorage();
        this.loadQuestions();
        this.setupEventListeners();
        this.updateAnalytics();
        console.log('✅ Interview Studio Enhanced Engine Loaded');
    },

    // Load questions (stub - will be populated)
    loadQuestions() {
        // This will be populated with all questions
        // For now, using existing questions from HTML
        this.state.allQuestions = this.parseExistingQuestions();
        this.state.filteredQuestions = this.state.allQuestions;
        this.renderQuestions();
    },

    // Parse existing questions from HTML
    parseExistingQuestions() {
        const questions = [];
        document.querySelectorAll('.interview-card').forEach((card, index) => {
            const questionText = card.querySelector('.question-text')?.textContent;
            const answerText = card.querySelector('.answer-text')?.textContent;

            if (questionText && answerText) {
                questions.push({
                    id: index + 1,
                    question: questionText,
                    answer: answerText,
                    category: 'general',
                    difficulty: 'medium',
                    company: 'general',
                    round: 'all',
                    keywords: [],
                    tags: []
                });
            }
        });
        return questions;
    },

    // ========== STORAGE MANAGEMENT ==========
    loadFromStorage() {
        try {
            const favorites = localStorage.getItem('interview-studio-favorites');
            const notes = localStorage.getItem('interview-studio-notes');
            const analytics = localStorage.getItem('interview-studio-analytics');

            if (favorites) this.state.favorites = new Set(JSON.parse(favorites));
            if (notes) this.state.notes = JSON.parse(notes);
            if (analytics) this.state.analytics = { ...this.state.analytics, ...JSON.parse(analytics) };
        } catch (e) {
            console.warn('Error loading from storage:', e);
        }
    },

    saveToStorage() {
        try {
            localStorage.setItem('interview-studio-favorites', JSON.stringify([...this.state.favorites]));
            localStorage.setItem('interview-studio-notes', JSON.stringify(this.state.notes));
            localStorage.setItem('interview-studio-analytics', JSON.stringify(this.state.analytics));
        } catch (e) {
            console.warn('Error saving to storage:', e);
        }
    },

    // ========== SEARCH & FILTER ==========
    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.state.filters.search = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }

        // Category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.state.filters.category = e.target.value;
                this.applyFilters();
            });
        }

        // Difficulty filter
        const difficultyFilter = document.getElementById('difficulty-filter');
        if (difficultyFilter) {
            difficultyFilter.addEventListener('change', (e) => {
                this.state.filters.difficulty = e.target.value;
                this.applyFilters();
            });
        }

        // Company filter
        const companyFilter = document.getElementById('company-filter');
        if (companyFilter) {
            companyFilter.addEventListener('change', (e) => {
                this.state.filters.company = e.target.value;
                this.applyFilters();
            });
        }

        // Favorites toggle
        const favoritesToggle = document.getElementById('favorites-toggle');
        if (favoritesToggle) {
            favoritesToggle.addEventListener('change', (e) => {
                this.state.filters.favorites = e.target.checked;
                this.applyFilters();
            });
        }

        // Export buttons
        document.querySelectorAll('[data-export]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = e.target.getAttribute('data-export');
                this.exportQuestions(format);
            });
        });
    },

    applyFilters() {
        let filtered = this.state.allQuestions;

        // Search filter
        if (this.state.filters.search) {
            filtered = filtered.filter(q =>
                q.question.toLowerCase().includes(this.state.filters.search) ||
                q.answer.toLowerCase().includes(this.state.filters.search) ||
                (q.keywords && q.keywords.some(k => k.toLowerCase().includes(this.state.filters.search)))
            );
        }

        // Category filter
        if (this.state.filters.category !== 'all') {
            filtered = filtered.filter(q => q.category === this.state.filters.category);
        }

        // Difficulty filter
        if (this.state.filters.difficulty !== 'all') {
            filtered = filtered.filter(q => q.difficulty === this.state.filters.difficulty);
        }

        // Company filter
        if (this.state.filters.company !== 'all') {
            filtered = filtered.filter(q => q.company === this.state.filters.company);
        }

        // Favorites filter
        if (this.state.filters.favorites) {
            filtered = filtered.filter(q => this.state.favorites.has(q.id));
        }

        this.state.filteredQuestions = filtered;
        this.renderQuestions();
        this.updateResultsCount();
    },

    updateResultsCount() {
        const countElement = document.getElementById('results-count');
        if (countElement) {
            countElement.textContent = `Showing ${this.state.filteredQuestions.length} of ${this.state.allQuestions.length} questions`;
        }
    },

    // ========== RENDERING ==========
    renderQuestions() {
        const container = document.getElementById('questions-container');
        if (!container) return;

        if (this.state.filteredQuestions.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <h3>No questions found</h3>
                    <p>Try adjusting your filters or search terms</p>
                </div>
            `;
            return;
        }

        // Note: In production, this would dynamically render all filtered questions
        // For now, it works with existing HTML structure
        const existingCards = document.querySelectorAll('.interview-card');
        existingCards.forEach((card, index) => {
            const questionId = index + 1;
            card.style.display = this.state.filteredQuestions.some(q => q.id === questionId) ? 'block' : 'none';

            // Add favorite indicator
            if (this.state.favorites.has(questionId)) {
                this.addFavoriteIndicator(card, questionId);
            }
        });
    },

    addFavoriteIndicator(card, questionId) {
        if (!card.querySelector('.favorite-indicator')) {
            const indicator = document.createElement('button');
            indicator.className = 'favorite-indicator active';
            indicator.innerHTML = '⭐';
            indicator.onclick = (e) => {
                e.stopPropagation();
                this.toggleFavorite(questionId);
            };
            card.querySelector('.question-header').appendChild(indicator);
        }
    },

    // ========== FAVORITES ==========
    toggleFavorite(questionId) {
        if (this.state.favorites.has(questionId)) {
            this.state.favorites.delete(questionId);
        } else {
            this.state.favorites.add(questionId);
        }
        this.saveToStorage();
        this.renderQuestions();
        this.updateStats();
        this.showNotification(`${this.state.favorites.has(questionId) ? 'Added to' : 'Removed from'} favorites`);
    },

    // ========== NOTES ==========
    saveNote(questionId, note) {
        this.state.notes[questionId] = {
            content: note,
            updatedAt: new Date().toISOString()
        };
        this.saveToStorage();
        this.showNotification('Note saved');
    },

    getNote(questionId) {
        return this.state.notes[questionId]?.content || '';
    },

    // ========== ANALYTICS ==========
    updateAnalytics() {
        this.state.analytics.totalSessions++;
        this.state.analytics.lastVisit = new Date().toISOString();
        this.saveToStorage();
    },

    trackView(questionId) {
        this.state.analytics.viewed.add(questionId);

        if (!this.state.analytics.timeSpent[questionId]) {
            this.state.analytics.timeSpent[questionId] = 0;
        }

        // Start tracking time
        const startTime = Date.now();
        this.state.currentQuestion = questionId;

        // Save analytics periodically
        setTimeout(() => {
            if (this.state.currentQuestion === questionId) {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                this.state.analytics.timeSpent[questionId] += elapsed;
                this.saveToStorage();
            }
        }, 5000);
    },

    getAnalytics() {
        return {
            totalQuestions: this.state.allQuestions.length,
            questionsViewed: this.state.analytics.viewed.size,
            favorites: this.state.favorites.size,
            notes: Object.keys(this.state.notes).length,
            totalSessions: this.state.analytics.totalSessions,
            lastVisit: this.state.analytics.lastVisit
        };
    },

    updateStats() {
        const stats = this.getAnalytics();

        const statsElements = {
            'total-questions': stats.totalQuestions,
            'viewed-count': stats.questionsViewed,
            'favorites-count': stats.favorites,
            'notes-count': stats.notes
        };

        Object.entries(statsElements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    },

    // ========== EXPORT ==========
    exportQuestions(format) {
        const questions = this.state.filters.favorites
            ? this.state.allQuestions.filter(q => this.state.favorites.has(q.id))
            : this.state.filteredQuestions;

        switch (format) {
            case 'txt':
                this.exportAsText(questions);
                break;
            case 'md':
                this.exportAsMarkdown(questions);
                break;
            case 'json':
                this.exportAsJSON(questions);
                break;
            case 'pdf':
                this.showNotification('PDF export coming soon!');
                break;
            case 'docx':
                this.showNotification('DOCX export coming soon!');
                break;
        }
    },

    exportAsText(questions) {
        let content = '='.repeat(60) + '\n';
        content += 'INTERVIEW STUDIO - QUESTIONS EXPORT\n';
        content += `Generated: ${new Date().toLocaleString()}\n`;
        content += `Total Questions: ${questions.length}\n`;
        content += '='.repeat(60) + '\n\n';

        questions.forEach((q, index) => {
            content += `\nQUESTION ${index + 1}: ${q.question}\n`;
            content += '-'.repeat(60) + '\n';
            content += `Category: ${q.category} | Difficulty: ${q.difficulty}\n`;
            content += `Company: ${q.company} | Round: ${q.round}\n\n`;
            content += `ANSWER:\n${q.answer}\n`;
            content += '\n' + '='.repeat(60) + '\n';
        });

        this.downloadFile(content, 'interview-questions.txt', 'text/plain');
    },

    exportAsMarkdown(questions) {
        let content = '# 📚 Interview Studio - Questions Export\n\n';
        content += `**Generated:** ${new Date().toLocaleString()}\n`;
        content += `**Total Questions:** ${questions.length}\n\n`;
        content += '---\n\n';

        questions.forEach((q, index) => {
            content += `## ${index + 1}. ${q.question}\n\n`;
            content += `**Category:** ${q.category} | **Difficulty:** ${q.difficulty} | **Company:** ${q.company}\n\n`;
            content += `### Answer\n\n${q.answer}\n\n`;
            if (q.keyTakeaways && q.keyTakeaways.length > 0) {
                content += `### Key Takeaways\n\n`;
                q.keyTakeaways.forEach(kt => content += `- ${kt}\n`);
                content += '\n';
            }
            content += '---\n\n';
        });

        this.downloadFile(content, 'interview-questions.md', 'text/markdown');
    },

    exportAsJSON(questions) {
        const data = {
            exported: new Date().toISOString(),
            totalQuestions: questions.length,
            questions: questions,
            userdata: {
                favorites: [...this.state.favorites],
                notes: this.state.notes,
                analytics: this.state.analytics
            }
        };

        const content = JSON.stringify(data, null, 2);
        this.downloadFile(content, 'interview-questions.json', 'application/json');
    },

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showNotification(`Exported as ${filename}`);
    },

    // ========== NOTIFICATIONS ==========
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => InterviewStudio.init());
} else {
    InterviewStudio.init();
}

// Export for external use
window.InterviewStudio = InterviewStudio;
