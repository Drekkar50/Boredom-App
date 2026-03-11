/* =========================================
   ZENITH — Screen Renderers
   ========================================= */

const Screens = {
    // ---- Onboarding: Welcome ----
    renderWelcome() {
        return `
      <div class="onboarding">
        <div class="onboarding-bg">
          <div class="orb orb-1"></div>
          <div class="orb orb-2"></div>
          <div class="orb orb-3"></div>
        </div>
        <div class="onboarding-content">
          <h1 class="onboarding-logo text-gradient bounce-in">Zenith</h1>
          <p class="onboarding-tagline">Your personal engine for turning idle moments into micro-adventures.</p>
          <div class="onboarding-input-row">
            <input type="text" class="input" id="onboard-name" placeholder="What's your name?" maxlength="30" autocomplete="off">
          </div>
          <button class="btn btn-primary btn-lg btn-block" id="onboard-next" disabled>
            Let's Begin ✨
          </button>
          <p class="text-caption" style="margin-top: 16px; opacity: 0.6;">Your data stays on your device. Always.</p>
        </div>
      </div>
    `;
    },

    // ---- Onboarding: Interests ----
    renderInterestPicker() {
        const interests = [
            { emoji: '📸', label: 'Photography' },
            { emoji: '🎨', label: 'Painting' },
            { emoji: '✏️', label: 'Drawing' },
            { emoji: '🍳', label: 'Cooking' },
            { emoji: '📖', label: 'Reading' },
            { emoji: '✍️', label: 'Writing' },
            { emoji: '🎮', label: 'Gaming' },
            { emoji: '🎵', label: 'Music' },
            { emoji: '🧘', label: 'Yoga' },
            { emoji: '🥾', label: 'Hiking' },
            { emoji: '🧠', label: 'Learning' },
            { emoji: '💻', label: 'Coding' },
            { emoji: '🌱', label: 'Gardening' },
            { emoji: '🪡', label: 'Crafts' },
            { emoji: '🔭', label: 'Astronomy' },
            { emoji: '🍞', label: 'Baking' },
        ];

        return `
      <div class="onboarding">
        <div class="onboarding-bg">
          <div class="orb orb-1"></div>
          <div class="orb orb-2"></div>
        </div>
        <div class="onboarding-content" style="max-width: 420px;">
          <h1 class="text-heading" style="margin-bottom: 8px;">What sparks your curiosity?</h1>
          <p class="text-caption" style="margin-bottom: 24px;">Pick at least 3 that excite you</p>
          <div class="interest-grid stagger-in">
            ${interests.map(i => `
              <div class="interest-bubble" data-interest="${i.label}">
                <span class="interest-bubble-emoji">${i.emoji}</span>
                <span class="interest-bubble-label">${i.label}</span>
              </div>
            `).join('')}
          </div>
          <button class="btn btn-primary btn-lg btn-block" id="interests-next" disabled>
            Continue
          </button>
          <button class="btn btn-ghost btn-block" id="interests-skip" style="margin-top: 8px;">
            Skip for now
          </button>
        </div>
      </div>
    `;
    },

    // ---- Home Screen ----
    renderHome() {
        const user = Store.getUser();
        const stats = Store.getVaultStats();
        const recent = Store.getRecentActivities(3);
        const hour = new Date().getHours();
        let greeting = 'Good evening';
        if (hour < 12) greeting = 'Good morning';
        else if (hour < 17) greeting = 'Good afternoon';

        return `
      <div class="screen page-enter">
        <div class="home-header">
          <p class="home-greeting">${greeting} 👋</p>
          <h1 class="home-name text-gradient">${user.name || 'Explorer'}</h1>
        </div>

        <div class="home-stats stagger-in">
          <div class="card stat-card">
            <div class="stat-value">${stats.total}</div>
            <div class="stat-label">Vault Items</div>
          </div>
          <div class="card stat-card">
            <div class="stat-value">${Store.getHistory().length}</div>
            <div class="stat-label">Activities</div>
          </div>
          <div class="card stat-card">
            <div class="stat-value">${stats.possessions}</div>
            <div class="stat-label">Tools</div>
          </div>
        </div>

        <div class="boredom-cta glow-pulse">
          <div class="boredom-cta-content">
            <span class="boredom-cta-emoji">⚡</span>
            <h2>Feeling bored?</h2>
            <p>Let Zenith find the perfect activity for your mood, energy, and time.</p>
            <button class="btn btn-primary btn-lg" id="home-boredom-btn">
              I'm Bored 🎲
            </button>
          </div>
        </div>

        ${recent.length > 0 ? `
          <div class="section-header">
            <h2 class="section-title">Recent Activities</h2>
          </div>
          <div class="history-list stagger-in">
            ${recent.map(h => `
              <div class="history-item">
                <div class="vault-item-icon possession">🎯</div>
                <div class="vault-item-info">
                  <div class="vault-item-name">${h.title}</div>
                  <div class="history-item-date">${this._timeAgo(h.date)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="section-header">
            <h2 class="section-title">Quick Start</h2>
          </div>
          <div class="card" style="text-align: center; padding: 24px;">
            <p class="text-body" style="margin-bottom: 12px;">Add items to your Vault to unlock personalized activities</p>
            <button class="btn btn-secondary btn-sm" id="home-add-vault">
              📦 Build Your Vault
            </button>
          </div>
        `}
      </div>
    `;
    },

    // ---- Vault Screen ----
    renderVault(filter = 'all') {
        const items = Store.getVaultByCategory(filter);
        const stats = Store.getVaultStats();

        return `
      <div class="screen page-enter">
        <div class="vault-header">
          <h1 class="text-heading">Your Vault</h1>
          <button class="btn btn-primary btn-sm" id="vault-add-btn">+ Add</button>
        </div>

        <div class="vault-search">
          <input type="text" class="input" id="vault-search-input" placeholder="🔍 Search your vault..." autocomplete="off">
        </div>

        <div class="vault-categories">
          <div class="filter-tabs" id="vault-filter-tabs">
            <button class="filter-tab ${filter === 'all' ? 'active' : ''}" data-filter="all">All (${stats.total})</button>
            <button class="filter-tab ${filter === 'interest' ? 'active' : ''}" data-filter="interest">💡 Interests</button>
            <button class="filter-tab ${filter === 'possession' ? 'active' : ''}" data-filter="possession">📦 Possessions</button>
            <button class="filter-tab ${filter === 'digital' ? 'active' : ''}" data-filter="digital">📚 Digital</button>
            <button class="filter-tab ${filter === 'skill' ? 'active' : ''}" data-filter="skill">🎯 Skills</button>
          </div>
        </div>

        <div class="vault-list stagger-in" id="vault-list">
          ${items.length > 0 ? items.map(item => this._renderVaultItem(item)).join('') : `
            <div class="empty-state">
              <span class="empty-state-icon">📦</span>
              <p class="empty-state-title">Your vault is empty</p>
              <p class="empty-state-desc">Add your interests, possessions, and tools to get personalized activity recommendations.</p>
              <button class="btn btn-primary btn-sm" id="vault-empty-add">+ Add First Item</button>
            </div>
          `}
        </div>
      </div>
    `;
    },

    _renderVaultItem(item) {
        const cat = Vault.CATEGORIES[item.category] || Vault.CATEGORIES.interest;
        return `
      <div class="vault-item hover-lift" data-id="${item.id}">
        <div class="vault-item-icon ${cat.color}">
          ${cat.emoji}
        </div>
        <div class="vault-item-info">
          <div class="vault-item-name">${item.name}</div>
          <div class="vault-item-tags">
            ${(item.tags || []).slice(0, 3).map(t => `<span class="vault-item-tag">${t}</span>`).join('')}
          </div>
        </div>
        <div class="vault-item-actions">
          <button class="btn btn-ghost btn-icon vault-delete-btn" data-id="${item.id}" title="Remove">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </div>
    `;
    },

    // ---- Add Item Modal ----
    renderAddItemModal() {
        return `
      <div class="modal-overlay" id="add-item-overlay">
        <div class="modal-sheet">
          <div class="modal-sheet-handle"></div>
          <form class="add-form" id="add-item-form">
            <h2 class="add-form-title">Add to Vault</h2>

            <div class="input-group">
              <label class="input-label">Category</label>
              <div class="add-form-category-grid" id="category-grid">
                <div class="category-option selected" data-category="possession">
                  <span class="category-option-emoji">📦</span>
                  Possession
                </div>
                <div class="category-option" data-category="interest">
                  <span class="category-option-emoji">💡</span>
                  Interest
                </div>
                <div class="category-option" data-category="digital">
                  <span class="category-option-emoji">📚</span>
                  Digital
                </div>
                <div class="category-option" data-category="skill">
                  <span class="category-option-emoji">🎯</span>
                  Skill
                </div>
              </div>
            </div>

            <div class="input-group">
              <label class="input-label" for="item-name">Item Name</label>
              <input type="text" class="input" id="item-name" placeholder="e.g., DSLR Camera, Oil Paints" autocomplete="off" list="item-suggestions">
              <datalist id="item-suggestions"></datalist>
            </div>

            <div class="input-group" id="tags-group">
              <label class="input-label">Tags (auto-generated)</label>
              <div class="chip-group" id="tags-preview"></div>
            </div>

            <div style="display: flex; gap: 8px; margin-top: 8px;">
              <button type="button" class="btn btn-secondary btn-block" id="add-item-cancel">Cancel</button>
              <button type="submit" class="btn btn-primary btn-block" id="add-item-submit" disabled>Add Item</button>
            </div>
          </form>
        </div>
      </div>
    `;
    },

    // ---- Engine Screen ----
    renderEngine() {
        const timeData = Engine.getTimeLabel(4); // default 30 min

        return `
      <div class="screen page-enter">
        <div class="engine-header">
          <h1 class="text-gradient">I'm Bored 🎲</h1>
          <p class="text-caption" style="margin-top: 4px;">Tell me about your moment</p>
        </div>

        <div class="engine-section">
          <div class="engine-section-label">⏱️ How much time do you have?</div>
          <div class="time-display">
            <span class="time-value" id="time-value">${timeData.minutes}</span>
            <span class="time-unit">minutes</span>
          </div>
          <input type="range" class="range-slider" id="time-slider" min="0" max="9" value="4" step="1">
          <div style="display: flex; justify-content: space-between; margin-top: 4px;">
            <span class="text-caption">5 min</span>
            <span class="text-caption">3 hrs</span>
          </div>
        </div>

        <div class="engine-section">
          <div class="engine-section-label">⚡ Energy Level</div>
          <div class="energy-selector" id="energy-selector">
            ${Engine.ENERGY_LEVELS.map(e => `
              <div class="energy-level ${e.level === 3 ? 'selected' : ''}" data-energy="${e.level}" title="${e.label}">
                ${e.emoji}
              </div>
            `).join('')}
          </div>
        </div>

        <div class="engine-section">
          <div class="engine-section-label">🎭 Current Mood</div>
          <div class="mood-chips" id="mood-chips">
            ${Engine.MOODS.map(m => `
              <div class="chip" data-mood="${m.id}">
                <span class="chip-emoji">${m.emoji}</span>
                ${m.label}
              </div>
            `).join('')}
          </div>
        </div>

        <button class="btn btn-primary btn-lg btn-block engine-go-btn glow-pulse" id="engine-go">
          ⚡ Find My Activity
        </button>
      </div>
    `;
    },

    // ---- Results Screen ----
    renderResults(context, recommendations) {
        return `
      <div class="screen page-enter">
        <div class="results-header">
          <button class="btn btn-ghost" id="results-back" style="margin-bottom: 8px;">
            ← Back
          </button>
          <h1>Here's Your Plan ✨</h1>
          <div class="results-context">
            <span class="results-context-item">⏱️ ${context.timeLabel}</span>
            <span class="results-context-item">${context.energyEmoji} Energy</span>
            <span class="results-context-item">🎭 ${context.moodLabels || 'Any'}</span>
          </div>
        </div>

        <div class="results-list stagger-in">
          ${recommendations.map((rec, i) => this._renderRecCard(rec, i)).join('')}
        </div>

        <button class="btn btn-secondary btn-block" id="results-reshuffle" style="margin-top: 16px;">
          🔄 Reshuffle
        </button>
      </div>
    `;
    },

    _renderRecCard(rec, index) {
        return `
      <div class="rec-card hover-lift">
        <div class="rec-card-header">
          <h2 class="rec-card-title">${rec.title}</h2>
          <span class="rec-card-time">⏱ ${rec.timeEstimate}</span>
        </div>
        <p class="rec-card-desc">${rec.description}</p>

        ${rec.generativePrompt ? `
          <div class="rec-card-prompt">
            <div class="rec-card-prompt-label">✨ Creative Prompt</div>
            <p class="rec-card-prompt-text">"${rec.generativePrompt}"</p>
          </div>
        ` : ''}

        <div class="rec-card-meta">
          <span class="badge badge-primary">${rec.difficulty}</span>
          <span class="badge badge-success">${rec.energyMatch}</span>
          ${rec.vaultItemsUsed.map(item => `
            <span class="badge badge-warning">📦 ${item}</span>
          `).join('')}
        </div>

        <div class="rec-card-footer">
          <button class="btn btn-primary btn-sm btn-block rec-start-btn" data-activity-id="${rec.id}" data-activity-title="${rec.title}">
            Let's Do This! 🚀
          </button>
        </div>
      </div>
    `;
    },

    // ---- History Screen ----
    renderHistory() {
        const history = Store.getHistory();

        return `
      <div class="screen page-enter">
        <div class="section-header" style="margin-bottom: var(--space-lg);">
          <h1 class="text-heading">Activity History</h1>
        </div>

        ${history.length > 0 ? `
          <div class="history-list stagger-in">
            ${history.map(h => `
              <div class="history-item">
                <div class="vault-item-icon interest">🎯</div>
                <div class="vault-item-info">
                  <div class="vault-item-name">${h.title}</div>
                  <div class="history-item-date">${this._timeAgo(h.date)}</div>
                </div>
                <span class="badge badge-success">Done</span>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <span class="empty-state-icon">📋</span>
            <p class="empty-state-title">No activities yet</p>
            <p class="empty-state-desc">Complete your first activity and it'll show up here.</p>
            <button class="btn btn-primary btn-sm" id="history-go-engine">
              Find Something to Do ⚡
            </button>
          </div>
        `}
      </div>
    `;
    },

    // ---- Profile Screen ----
    renderProfile() {
        const user = Store.getUser();
        const stats = Store.getVaultStats();
        const historyCount = Store.getHistory().length;

        return `
      <div class="screen page-enter">
        <div class="profile-header">
          <div class="profile-avatar">${user.avatar}</div>
          <h1 class="profile-name">${user.name || 'Explorer'}</h1>
          <p class="profile-joined">Joined ${user.joinedAt ? this._formatDate(user.joinedAt) : 'recently'}</p>
        </div>

        <div class="profile-stats stagger-in">
          <div class="card stat-card">
            <div class="stat-value">${stats.total}</div>
            <div class="stat-label">Vault</div>
          </div>
          <div class="card stat-card">
            <div class="stat-value">${historyCount}</div>
            <div class="stat-label">Done</div>
          </div>
          <div class="card stat-card">
            <div class="stat-value">${user.interests.length}</div>
            <div class="stat-label">Interests</div>
          </div>
        </div>

        ${user.interests.length > 0 ? `
          <div class="section-header">
            <h2 class="section-title">Your Interests</h2>
          </div>
          <div class="chip-group" style="margin-bottom: 24px;">
            ${user.interests.map(i => `<span class="chip selected">${i}</span>`).join('')}
          </div>
        ` : ''}

        <div class="profile-menu">
          <div class="profile-menu-item" id="profile-export">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span>Export Data</span>
            <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
          <div class="profile-menu-item" id="profile-about">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <span>About Zenith</span>
            <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
          <div class="profile-menu-item" id="profile-reset" style="color: var(--accent-tertiary);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            <span>Reset All Data</span>
            <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
        </div>
      </div>
    `;
    },

    // ---- Loading Screen ----
    renderLoading() {
        const messages = [
            'Scanning your vault...',
            'Matching your energy...',
            'Finding the perfect activity...',
            'Generating creative prompts...',
            'Almost there...',
        ];
        return `
      <div class="screen" style="display: flex; align-items: center; justify-content: center; min-height: 80dvh;">
        <div class="loading-container">
          <div class="loading-orb"></div>
          <p class="loading-text" id="loading-message">${messages[0]}</p>
        </div>
      </div>
    `;
    },

    // ---- Utility ----
    _timeAgo(dateStr) {
        const now = new Date();
        const date = new Date(dateStr);
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return this._formatDate(dateStr);
    },

    _formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    },
};
