/* =========================================
   ZENITH — Store (State Management)
   ========================================= */

const Store = {
  // Keys for localStorage persistence
  KEYS: {
    USER: 'zenith_user',
    VAULT: 'zenith_vault',
    HISTORY: 'zenith_history',
    ONBOARDED: 'zenith_onboarded',
  },

  // Default user state
  _user: {
    name: '',
    avatar: '🚀',
    interests: [],
    joinedAt: null,
  },

  // Vault items
  _vault: [],

  // Activity history
  _history: [],

  // Whether user has completed onboarding
  _onboarded: false,

  // ---- Initialization ----
  init() {
    try {
      const user = localStorage.getItem(this.KEYS.USER);
      if (user) this._user = JSON.parse(user);

      const vault = localStorage.getItem(this.KEYS.VAULT);
      if (vault) this._vault = JSON.parse(vault);

      const history = localStorage.getItem(this.KEYS.HISTORY);
      if (history) this._history = JSON.parse(history);

      this._onboarded = localStorage.getItem(this.KEYS.ONBOARDED) === 'true';
    } catch (e) {
      console.warn('Store: Failed to load from localStorage', e);
    }
  },

  // ---- Persistence ----
  _saveUser() {
    localStorage.setItem(this.KEYS.USER, JSON.stringify(this._user));
  },

  _saveVault() {
    localStorage.setItem(this.KEYS.VAULT, JSON.stringify(this._vault));
  },

  _saveHistory() {
    localStorage.setItem(this.KEYS.HISTORY, JSON.stringify(this._history));
  },

  // ---- User ----
  getUser() {
    return { ...this._user };
  },

  setUserName(name) {
    this._user.name = name;
    this._user.joinedAt = this._user.joinedAt || new Date().toISOString();
    this._saveUser();
  },

  setUserInterests(interests) {
    this._user.interests = [...interests];
    this._saveUser();
  },

  isOnboarded() {
    return this._onboarded;
  },

  completeOnboarding() {
    this._onboarded = true;
    localStorage.setItem(this.KEYS.ONBOARDED, 'true');
  },

  // ---- Vault ----
  getVault() {
    return [...this._vault];
  },

  getVaultByCategory(category) {
    if (category === 'all') return this.getVault();
    return this._vault.filter(item => item.category === category);
  },

  addVaultItem(item) {
    const newItem = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      isActive: true,
      ...item,
    };
    this._vault.push(newItem);
    this._saveVault();
    return newItem;
  },

  removeVaultItem(id) {
    this._vault = this._vault.filter(item => item.id !== id);
    this._saveVault();
  },

  updateVaultItem(id, updates) {
    const idx = this._vault.findIndex(item => item.id === id);
    if (idx > -1) {
      this._vault[idx] = { ...this._vault[idx], ...updates };
      this._saveVault();
    }
  },

  searchVault(query) {
    const q = query.toLowerCase();
    return this._vault.filter(item =>
      item.name.toLowerCase().includes(q) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(q)))
    );
  },

  getVaultStats() {
    return {
      total: this._vault.length,
      interests: this._vault.filter(i => i.category === 'interest').length,
      possessions: this._vault.filter(i => i.category === 'possession').length,
      digital: this._vault.filter(i => i.category === 'digital').length,
      skills: this._vault.filter(i => i.category === 'skill').length,
    };
  },

  // ---- History ----
  getHistory() {
    return [...this._history].sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  addToHistory(activity) {
    this._history.push({
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      ...activity,
    });
    this._saveHistory();
  },

  getRecentActivities(count = 5) {
    return this.getHistory().slice(0, count);
  },

  // ---- Utility ----
  clearAll() {
    localStorage.removeItem(this.KEYS.USER);
    localStorage.removeItem(this.KEYS.VAULT);
    localStorage.removeItem(this.KEYS.HISTORY);
    localStorage.removeItem(this.KEYS.ONBOARDED);
    this._user = { name: '', avatar: '🚀', interests: [], joinedAt: null };
    this._vault = [];
    this._history = [];
    this._onboarded = false;
  },
};
