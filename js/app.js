/* =========================================
   ZENITH — App Controller
   ========================================= */

const App = {
    currentScreen: null,
    engineState: {
        timeIndex: 4,
        energyLevel: 3,
        selectedMoods: [],
    },
    vaultFilter: 'all',

    // ---- Initialization ----
    init() {
        Store.init();
        this._bindNavigation();

        if (!Store.isOnboarded()) {
            this.navigate('welcome');
        } else {
            this.navigate('home');
            this._showNav();
        }
    },

    // ---- Navigation ----
    navigate(screen, data = {}) {
        const container = document.getElementById('screen-container');
        this.currentScreen = screen;

        // Render screen
        switch (screen) {
            case 'welcome':
                container.innerHTML = Screens.renderWelcome();
                this._bindWelcome();
                break;
            case 'interests':
                container.innerHTML = Screens.renderInterestPicker();
                this._bindInterestPicker();
                break;
            case 'home':
                container.innerHTML = Screens.renderHome();
                this._bindHome();
                this._updateNavActive('home');
                break;
            case 'vault':
                container.innerHTML = Screens.renderVault(this.vaultFilter);
                this._bindVault();
                this._updateNavActive('vault');
                break;
            case 'engine':
                container.innerHTML = Screens.renderEngine();
                this._bindEngine();
                this._updateNavActive('engine');
                break;
            case 'loading':
                container.innerHTML = Screens.renderLoading();
                this._animateLoading(data.context);
                break;
            case 'results':
                container.innerHTML = Screens.renderResults(data.context, data.recommendations);
                this._bindResults(data.context);
                break;
            case 'history':
                container.innerHTML = Screens.renderHistory();
                this._bindHistory();
                this._updateNavActive('history');
                break;
            case 'profile':
                container.innerHTML = Screens.renderProfile();
                this._bindProfile();
                this._updateNavActive('profile');
                break;
        }

        // Scroll to top
        container.scrollTop = 0;
    },

    _showNav() {
        document.getElementById('bottom-nav').classList.remove('hidden');
    },

    _hideNav() {
        document.getElementById('bottom-nav').classList.add('hidden');
    },

    _updateNavActive(screen) {
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.screen === screen);
        });
    },

    _bindNavigation() {
        document.getElementById('bottom-nav').addEventListener('click', (e) => {
            const btn = e.target.closest('.nav-item');
            if (!btn) return;
            const screen = btn.dataset.screen;
            if (screen && screen !== this.currentScreen) {
                this.navigate(screen);
            }
        });
    },

    // ---- Welcome Screen ----
    _bindWelcome() {
        const input = document.getElementById('onboard-name');
        const btn = document.getElementById('onboard-next');

        input.addEventListener('input', () => {
            btn.disabled = input.value.trim().length < 1;
        });

        btn.addEventListener('click', () => {
            const name = input.value.trim();
            if (name) {
                Store.setUserName(name);
                this.navigate('interests');
            }
        });

        // Enter key support
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && input.value.trim().length > 0) {
                btn.click();
            }
        });

        // Auto-focus
        setTimeout(() => input.focus(), 500);
    },

    // ---- Interest Picker ----
    _bindInterestPicker() {
        const selected = new Set();
        const nextBtn = document.getElementById('interests-next');
        const skipBtn = document.getElementById('interests-skip');

        document.querySelectorAll('.interest-bubble').forEach(bubble => {
            bubble.addEventListener('click', () => {
                const interest = bubble.dataset.interest;
                if (selected.has(interest)) {
                    selected.delete(interest);
                    bubble.classList.remove('selected');
                } else {
                    selected.add(interest);
                    bubble.classList.add('selected');
                }
                nextBtn.disabled = selected.size < 3;
            });
        });

        nextBtn.addEventListener('click', () => {
            if (selected.size >= 3) {
                Store.setUserInterests([...selected]);
                // Also add interests to vault
                selected.forEach(interest => {
                    Store.addVaultItem({
                        name: interest,
                        category: 'interest',
                        tags: Vault.generateTags(interest, 'interest'),
                    });
                });
                Store.completeOnboarding();
                this._showNav();
                this.navigate('home');
                this._toast('Welcome to Zenith! 🚀');
            }
        });

        skipBtn.addEventListener('click', () => {
            Store.completeOnboarding();
            this._showNav();
            this.navigate('home');
            this._toast('Welcome! Add items to your vault anytime 📦');
        });
    },

    // ---- Home Screen ----
    _bindHome() {
        const boredomBtn = document.getElementById('home-boredom-btn');
        if (boredomBtn) {
            boredomBtn.addEventListener('click', () => this.navigate('engine'));
        }

        const addVaultBtn = document.getElementById('home-add-vault');
        if (addVaultBtn) {
            addVaultBtn.addEventListener('click', () => this.navigate('vault'));
        }
    },

    // ---- Vault Screen ----
    _bindVault() {
        // Filter tabs
        const tabs = document.getElementById('vault-filter-tabs');
        if (tabs) {
            tabs.addEventListener('click', (e) => {
                const tab = e.target.closest('.filter-tab');
                if (!tab) return;
                this.vaultFilter = tab.dataset.filter;
                this.navigate('vault');
            });
        }

        // Search
        const searchInput = document.getElementById('vault-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                const list = document.getElementById('vault-list');
                if (query.length > 0) {
                    const results = Store.searchVault(query);
                    list.innerHTML = results.length > 0
                        ? results.map(item => Screens._renderVaultItem(item)).join('')
                        : '<div class="empty-state"><p class="empty-state-desc">No matching items found</p></div>';
                } else {
                    const items = Store.getVaultByCategory(this.vaultFilter);
                    list.innerHTML = items.map(item => Screens._renderVaultItem(item)).join('');
                }
                this._bindVaultItemActions();
            });
        }

        // Add button
        const addBtn = document.getElementById('vault-add-btn');
        const emptyAdd = document.getElementById('vault-empty-add');
        const openModal = () => this._openAddItemModal();

        if (addBtn) addBtn.addEventListener('click', openModal);
        if (emptyAdd) emptyAdd.addEventListener('click', openModal);

        // Bind delete buttons
        this._bindVaultItemActions();
    },

    _bindVaultItemActions() {
        document.querySelectorAll('.vault-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                if (id) {
                    Store.removeVaultItem(id);
                    this.navigate('vault');
                    this._toast('Item removed');
                }
            });
        });
    },

    // ---- Add Item Modal ----
    _openAddItemModal() {
        const body = document.body;
        const div = document.createElement('div');
        div.innerHTML = Screens.renderAddItemModal();
        body.appendChild(div.firstElementChild);

        let selectedCategory = 'possession';
        const nameInput = document.getElementById('item-name');
        const submitBtn = document.getElementById('add-item-submit');
        const cancelBtn = document.getElementById('add-item-cancel');
        const overlay = document.getElementById('add-item-overlay');
        const tagsPreview = document.getElementById('tags-preview');
        const suggestions = document.getElementById('item-suggestions');

        // Category selection
        document.getElementById('category-grid').addEventListener('click', (e) => {
            const option = e.target.closest('.category-option');
            if (!option) return;
            document.querySelectorAll('.category-option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            selectedCategory = option.dataset.category;
            this._updateAddSuggestions(selectedCategory, suggestions);
            this._updateTagsPreview(nameInput.value, selectedCategory, tagsPreview);
        });

        // Name input
        nameInput.addEventListener('input', () => {
            submitBtn.disabled = nameInput.value.trim().length < 1;
            this._updateTagsPreview(nameInput.value, selectedCategory, tagsPreview);
        });

        // Load initial suggestions
        this._updateAddSuggestions(selectedCategory, suggestions);

        // Submit
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const name = nameInput.value.trim();
            if (name) {
                Store.addVaultItem({
                    name,
                    category: selectedCategory,
                    tags: Vault.generateTags(name, selectedCategory),
                });
                overlay.remove();
                this.navigate('vault');
                this._toast(`${name} added to vault! 📦`);
            }
        });

        // Cancel
        cancelBtn.addEventListener('click', () => overlay.remove());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        // Auto-focus
        setTimeout(() => nameInput.focus(), 400);
    },

    _updateAddSuggestions(category, datalist) {
        const items = Vault.SUGGESTIONS[category] || [];
        datalist.innerHTML = items.map(i => `<option value="${i}">`).join('');
    },

    _updateTagsPreview(name, category, container) {
        if (name.trim().length > 0) {
            const tags = Vault.generateTags(name, category);
            container.innerHTML = tags.map(t => `<span class="chip selected">${t}</span>`).join('');
        } else {
            container.innerHTML = '<span class="text-caption">Type an item name to see auto-generated tags</span>';
        }
    },

    // ---- Engine Screen ----
    _bindEngine() {
        // Time slider
        const slider = document.getElementById('time-slider');
        const timeValue = document.getElementById('time-value');

        slider.addEventListener('input', () => {
            this.engineState.timeIndex = parseInt(slider.value);
            const t = Engine.getTimeLabel(this.engineState.timeIndex);
            timeValue.textContent = t.minutes;
        });

        // Energy selector
        document.getElementById('energy-selector').addEventListener('click', (e) => {
            const level = e.target.closest('.energy-level');
            if (!level) return;
            this.engineState.energyLevel = parseInt(level.dataset.energy);
            document.querySelectorAll('.energy-level').forEach(l => l.classList.remove('selected'));
            level.classList.add('selected');
        });

        // Mood chips
        document.getElementById('mood-chips').addEventListener('click', (e) => {
            const chip = e.target.closest('.chip');
            if (!chip) return;
            const mood = chip.dataset.mood;
            if (this.engineState.selectedMoods.includes(mood)) {
                this.engineState.selectedMoods = this.engineState.selectedMoods.filter(m => m !== mood);
                chip.classList.remove('selected');
            } else {
                this.engineState.selectedMoods.push(mood);
                chip.classList.add('selected');
            }
        });

        // Go button
        document.getElementById('engine-go').addEventListener('click', () => {
            const timeData = Engine.getTimeLabel(this.engineState.timeIndex);
            const energyData = Engine.ENERGY_LEVELS.find(e => e.level === this.engineState.energyLevel);

            const context = {
                timeAvailable: timeData.minutes,
                timeLabel: timeData.label,
                energyLevel: this.engineState.energyLevel,
                energyEmoji: energyData ? energyData.emoji : '⚡',
                moods: [...this.engineState.selectedMoods],
                moodLabels: this.engineState.selectedMoods.length > 0
                    ? this.engineState.selectedMoods.map(m => {
                        const found = Engine.MOODS.find(em => em.id === m);
                        return found ? found.label : m;
                    }).join(', ')
                    : 'Any mood',
            };

            this.navigate('loading', { context });
        });
    },

    // ---- Loading Animation ----
    _animateLoading(context) {
        const messages = [
            'Scanning your vault...',
            'Matching your energy...',
            'Checking your inventory...',
            'Generating creative prompts...',
            'Found something perfect!',
        ];
        const msgEl = document.getElementById('loading-message');
        let idx = 0;

        const interval = setInterval(() => {
            idx++;
            if (idx < messages.length && msgEl) {
                msgEl.textContent = messages[idx];
            }
        }, 400);

        // Simulate AI processing time, then show results
        setTimeout(() => {
            clearInterval(interval);
            const recommendations = Engine.getRecommendations({
                timeAvailable: context.timeAvailable,
                energyLevel: context.energyLevel,
                moods: context.moods,
            });
            this.navigate('results', { context, recommendations });
        }, 2000);
    },

    // ---- Results Screen ----
    _bindResults(context) {
        // Back button
        document.getElementById('results-back').addEventListener('click', () => {
            this.navigate('engine');
        });

        // Reshuffle
        document.getElementById('results-reshuffle').addEventListener('click', () => {
            this.navigate('loading', { context });
        });

        // Start activity buttons
        document.querySelectorAll('.rec-start-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const activityId = btn.dataset.activityId;
                const activityTitle = btn.dataset.activityTitle;
                Store.addToHistory({ activityId, title: activityTitle });
                this._confetti();
                this._toast('Activity started! Have fun! 🎉');
                setTimeout(() => this.navigate('home'), 1500);
            });
        });
    },

    // ---- History Screen ----
    _bindHistory() {
        const goEngine = document.getElementById('history-go-engine');
        if (goEngine) {
            goEngine.addEventListener('click', () => this.navigate('engine'));
        }
    },

    // ---- Profile Screen ----
    _bindProfile() {
        const exportBtn = document.getElementById('profile-export');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                const data = {
                    user: Store.getUser(),
                    vault: Store.getVault(),
                    history: Store.getHistory(),
                    exportedAt: new Date().toISOString(),
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'zenith-export.json';
                a.click();
                URL.revokeObjectURL(url);
                this._toast('Data exported! 📥');
            });
        }

        const aboutBtn = document.getElementById('profile-about');
        if (aboutBtn) {
            aboutBtn.addEventListener('click', () => {
                this._toast('Zenith v1.0 — Built with ⚡');
            });
        }

        const resetBtn = document.getElementById('profile-reset');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('This will delete all your data. Are you sure?')) {
                    Store.clearAll();
                    this._hideNav();
                    this.navigate('welcome');
                    this._toast('All data cleared');
                }
            });
        }
    },

    // ---- Toast Notification ----
    _toast(message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    // ---- Confetti Effect ----
    _confetti() {
        const colors = ['#7c5cfc', '#00d4aa', '#ff6b9d', '#ffb347', '#9b82ff'];
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'confetti-particle';
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.top = `${Math.random() * 30}vh`;
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.animationDelay = `${Math.random() * 0.5}s`;
            particle.style.animationDuration = `${1 + Math.random() * 1}s`;
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 2500);
        }
    },
};

// ---- Boot ----
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
