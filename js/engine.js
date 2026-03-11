/* =========================================
   ZENITH — Boredom Engine (Recommendation)
   ========================================= */

const Engine = {
    // Activity database — these are what the engine draws from
    ACTIVITIES: [
        // ---- Creative (requires possessions) ----
        {
            id: 'sketch_cyberpunk',
            title: 'Sketch a Cyberpunk Coffee Mug',
            description: 'Grab your pencils and reimagine an everyday object through the lens of a neon-soaked dystopia. Add circuit lines, glowing panels, and steam vents.',
            timeRange: [15, 30],
            energyMin: 2,
            energyMax: 4,
            moods: ['creative', 'chill'],
            category: 'art',
            prerequisites: ['pencil set'],
            difficulty: 'beginner',
            generativePrompt: 'Draw a coffee mug as if it existed in a neon-lit cyberpunk city. Add holographic labels, steam that glows, and tiny robotic legs.',
        },
        {
            id: 'watercolor_emotion',
            title: 'Paint What Your Favorite Song Sounds Like',
            description: 'Put on your favorite track and translate its energy into abstract watercolor strokes. No rules — just color and feeling.',
            timeRange: [30, 60],
            energyMin: 2,
            energyMax: 4,
            moods: ['creative', 'chill'],
            category: 'art',
            prerequisites: ['watercolor set', 'brushes'],
            difficulty: 'beginner',
            generativePrompt: 'Play your favorite song on repeat. For each section (intro, verse, chorus), use a different color palette. Let the brush move with the rhythm.',
        },
        {
            id: 'oil_still_life',
            title: 'Oil Paint a Moody Still Life',
            description: 'Arrange 3 objects from your desk under dramatic lighting and capture them in oils. Focus on shadows and texture.',
            timeRange: [60, 180],
            energyMin: 3,
            energyMax: 5,
            moods: ['creative', 'focused'],
            category: 'art',
            prerequisites: ['oil paints', 'brushes', 'canvas', 'turpentine'],
            difficulty: 'intermediate',
            generativePrompt: 'Set up a single desk lamp to create dramatic shadows. Arrange a mug, a book, and a plant. Paint with heavy impasto strokes focusing on how light wraps around each object.',
        },
        {
            id: 'photo_shadows',
            title: 'Shadow Stories: A Photo Challenge',
            description: 'Grab your camera and hunt for stories told entirely through shadows. Find 5 shots where a shadow tells a different tale than its object.',
            timeRange: [20, 60],
            energyMin: 3,
            energyMax: 5,
            moods: ['creative', 'adventurous'],
            category: 'photography',
            prerequisites: ['dslr camera'],
            difficulty: 'beginner',
            generativePrompt: 'Take 5 photos where the main subject IS the shadow, not the object casting it. Try to find shadows that look like something completely different from their source.',
        },
        {
            id: 'guitar_riff',
            title: 'Create a 4-Chord Sunset Melody',
            description: 'Pick 4 chords that feel like a sunset and loop them into a dreamy progression. Record a voice memo of your creation.',
            timeRange: [15, 45],
            energyMin: 2,
            energyMax: 4,
            moods: ['creative', 'chill'],
            category: 'music',
            prerequisites: ['guitar'],
            difficulty: 'beginner',
            generativePrompt: 'Start with Am → F → C → G. Play them slowly with fingerpicking. Try humming a melody over the top. Record it — even imperfect versions are worth keeping.',
        },
        {
            id: 'piano_ambient',
            title: 'Compose a 2-Minute Ambient Piece',
            description: 'Use sustained pedal and slow chord transitions to create a piece that sounds like floating through space.',
            timeRange: [15, 40],
            energyMin: 2,
            energyMax: 3,
            moods: ['creative', 'chill'],
            category: 'music',
            prerequisites: ['piano/keyboard'],
            difficulty: 'beginner',
            generativePrompt: 'Play Cmaj7 → Am9 → Fmaj7 → G with full sustain pedal. Let each chord ring for 4 beats. Add single high notes between chord changes like stars appearing in a night sky.',
        },
        {
            id: 'calligraphy_quote',
            title: 'Letter a Quote That Moves You',
            description: 'Pick a quote from a book, song, or person you admire and render it in your most beautiful hand lettering.',
            timeRange: [20, 45],
            energyMin: 2,
            energyMax: 3,
            moods: ['creative', 'chill', 'focused'],
            category: 'art',
            prerequisites: ['calligraphy pens'],
            difficulty: 'beginner',
            generativePrompt: 'Choose a quote under 12 words. Sketch it in pencil first. Then ink the main word in a dramatically different size. Add tiny flourishes on the ascenders and descenders.',
        },
        {
            id: 'color_mandala',
            title: 'Design a Personal Mandala',
            description: 'Create a circular mandala pattern using your colored pencils. Start from the center and work outward with repeating geometric patterns.',
            timeRange: [20, 60],
            energyMin: 2,
            energyMax: 3,
            moods: ['chill', 'creative', 'focused'],
            category: 'art',
            prerequisites: ['colored pencils'],
            difficulty: 'beginner',
            generativePrompt: 'Draw a small circle in the center. Add 6 petal shapes around it. Each ring outward gets more complex — triangles, then waves, then dots. Use only 4 colors max for harmony.',
        },

        // ---- No prerequisites (everyone can do these) ----
        {
            id: 'micro_meditation',
            title: 'The 5-Minute Mind Reset',
            description: 'Close your eyes, count 10 breaths, and visualize your thoughts as clouds passing through a blue sky. Let each one drift away.',
            timeRange: [3, 10],
            energyMin: 1,
            energyMax: 2,
            moods: ['chill'],
            category: 'wellness',
            prerequisites: [],
            difficulty: 'beginner',
            generativePrompt: null,
        },
        {
            id: 'write_microfiction',
            title: 'Write a 100-Word Story',
            description: 'Challenge yourself to tell a complete story — beginning, middle, and end — in exactly 100 words. Every word must earn its place.',
            timeRange: [10, 25],
            energyMin: 2,
            energyMax: 4,
            moods: ['creative', 'focused'],
            category: 'writing',
            prerequisites: [],
            difficulty: 'intermediate',
            generativePrompt: 'Write a 100-word story where the last sentence is also the title. Genre: whatever your mood whispers to you right now.',
        },
        {
            id: 'gratitude_journal',
            title: 'The Vivid Gratitude Journal',
            description: 'Write 3 things you\'re grateful for, but describe each one as if you\'re writing a movie scene. Make the reader feel it.',
            timeRange: [5, 15],
            energyMin: 1,
            energyMax: 3,
            moods: ['chill', 'focused'],
            category: 'writing',
            prerequisites: [],
            difficulty: 'beginner',
            generativePrompt: 'For each gratitude entry, include: a specific sensory detail (smell, texture, sound), the emotion it triggered, and why it mattered today.',
        },
        {
            id: 'stretch_flow',
            title: '10-Minute Body Unwind',
            description: 'Follow a simple flow: neck rolls → shoulder shrugs → forward fold → cat-cow → child\'s pose. Hold each for 30 seconds.',
            timeRange: [8, 15],
            energyMin: 1,
            energyMax: 3,
            moods: ['chill'],
            category: 'wellness',
            prerequisites: [],
            difficulty: 'beginner',
            generativePrompt: null,
        },
        {
            id: 'yoga_flow',
            title: 'Sun Salutation Energy Flow',
            description: 'Roll out your mat and flow through 5 rounds of Sun Salutation A. Focus on linking breath to movement.',
            timeRange: [10, 30],
            energyMin: 2,
            energyMax: 4,
            moods: ['adventurous', 'focused'],
            category: 'wellness',
            prerequisites: ['yoga mat'],
            difficulty: 'beginner',
            generativePrompt: null,
        },
        {
            id: 'dumbbell_circuit',
            title: 'Quick-Fire Strength Circuit',
            description: 'Perform 3 rounds: 10 goblet squats, 10 shoulder press, 10 bent-over rows, 10 lunges. Rest 60 seconds between rounds.',
            timeRange: [15, 30],
            energyMin: 4,
            energyMax: 5,
            moods: ['adventurous', 'focused'],
            category: 'wellness',
            prerequisites: ['dumbbells'],
            difficulty: 'intermediate',
            generativePrompt: null,
        },
        {
            id: 'learn_something',
            title: 'The 15-Minute Deep Dive',
            description: 'Pick a topic you\'ve always been curious about. Set a 15-minute timer and research it intensely. Write a 3-sentence summary of what you learned.',
            timeRange: [10, 20],
            energyMin: 2,
            energyMax: 4,
            moods: ['focused', 'creative'],
            category: 'learning',
            prerequisites: [],
            difficulty: 'beginner',
            generativePrompt: 'Topics to explore: How do octopuses change color? What is the overview effect astronauts experience? How does sourdough starter work? Pick one or surprise yourself.',
        },
        {
            id: 'phone_photo_challenge',
            title: 'Pocket Photographer: 5-Shot Story',
            description: 'Using just your phone, tell a visual story in exactly 5 photos. Theme: "The hidden beauty in mundane objects."',
            timeRange: [10, 30],
            energyMin: 2,
            energyMax: 4,
            moods: ['creative', 'adventurous'],
            category: 'photography',
            prerequisites: [],
            difficulty: 'beginner',
            generativePrompt: 'Shoot 5 photos that tell a story about an ordinary object\'s secret life. A fork becomes a skyline. A crumpled paper becomes a mountain range. Get close. Get weird.',
        },
        {
            id: 'stargazing_session',
            title: 'Celestial Explorer Night',
            description: 'Set up your telescope and find at least 3 celestial objects. Try to spot a planet, a star cluster, and the moon\'s craters.',
            timeRange: [30, 90],
            energyMin: 2,
            energyMax: 3,
            moods: ['chill', 'adventurous'],
            category: 'science',
            prerequisites: ['telescope'],
            difficulty: 'beginner',
            generativePrompt: 'Start by finding the brightest "star" — it\'s probably Jupiter or Venus. Then locate the Pleiades star cluster. Sketch what you see through the eyepiece.',
        },
        {
            id: 'cook_experimental',
            title: 'The 5-Ingredient Improv Chef',
            description: 'Open your fridge, pick exactly 5 ingredients, and create something you\'ve never made before. No recipes allowed.',
            timeRange: [20, 45],
            energyMin: 3,
            energyMax: 5,
            moods: ['creative', 'adventurous'],
            category: 'cooking',
            prerequisites: [],
            difficulty: 'intermediate',
            generativePrompt: 'Rules: Pick 5 ingredients. One must be a spice you rarely use. One must be a vegetable. You have 30 minutes. Name your creation something dramatic.',
        },
        {
            id: 'desk_cleanup_zen',
            title: 'The Mindful Desk Reset',
            description: 'Transform your workspace into a sanctuary. Clear everything, wipe surfaces, reorganize with intention. Put on lo-fi beats.',
            timeRange: [10, 25],
            energyMin: 2,
            energyMax: 3,
            moods: ['chill', 'focused'],
            category: 'wellness',
            prerequisites: [],
            difficulty: 'beginner',
            generativePrompt: null,
        },
        {
            id: 'doodle_challenge',
            title: 'The One-Line Doodle Challenge',
            description: 'Without lifting your pen from the paper, draw an animal, a face, or a cityscape. The constraint is the creativity.',
            timeRange: [5, 15],
            energyMin: 1,
            energyMax: 3,
            moods: ['creative', 'chill'],
            category: 'art',
            prerequisites: [],
            difficulty: 'beginner',
            generativePrompt: 'Draw a cat, a treehouse, or your own face — but your pen never leaves the paper. One continuous line. Embrace the beautiful imperfection.',
        },
        {
            id: 'read_chapter',
            title: 'The Single-Chapter Sprint',
            description: 'Pick up the nearest book and read exactly one chapter. When you finish, write a single sentence about what surprised you.',
            timeRange: [15, 40],
            energyMin: 1,
            energyMax: 3,
            moods: ['chill', 'focused'],
            category: 'reading',
            prerequisites: [],
            difficulty: 'beginner',
            generativePrompt: null,
        },
        {
            id: 'playlist_curator',
            title: 'Curate a Mood Soundtrack',
            description: 'Create a 5-song playlist that captures your exact mood right now. Give it a dramatic title like "3AM Rooftop Thoughts."',
            timeRange: [10, 20],
            energyMin: 1,
            energyMax: 3,
            moods: ['chill', 'creative'],
            category: 'music',
            prerequisites: [],
            difficulty: 'beginner',
            generativePrompt: 'Build a 5-song playlist. Rule: each song must be from a different decade. Name it something evocative like "Velvet Thunder" or "Sunday Rain on Mars."',
        },
        {
            id: 'walk_mindful',
            title: 'The Sensory Walk',
            description: 'Take a 15-minute walk where you focus on one sense per 3 minutes: sight, sound, smell, touch, taste (of the air).',
            timeRange: [12, 25],
            energyMin: 2,
            energyMax: 4,
            moods: ['chill', 'adventurous'],
            category: 'wellness',
            prerequisites: [],
            difficulty: 'beginner',
            generativePrompt: null,
        },
    ],

    // ---- Core Recommendation Logic ----
    getRecommendations(context) {
        const { timeAvailable, energyLevel, moods } = context;
        const recentHistory = Store.getRecentActivities(10).map(h => h.activityId);

        // Step 1: Filter by time
        let candidates = this.ACTIVITIES.filter(a =>
            timeAvailable >= a.timeRange[0]
        );

        // Step 2: Filter by energy
        candidates = candidates.filter(a =>
            energyLevel >= a.energyMin && energyLevel <= a.energyMax
        );

        // Step 3: Filter by prerequisites (inventory check)
        candidates = candidates.filter(a => {
            if (a.prerequisites.length === 0) return true;
            const possessions = Store.getVault()
                .filter(item => item.category === 'possession')
                .map(item => item.name.toLowerCase());
            return a.prerequisites.every(req =>
                possessions.some(p => p.toLowerCase().includes(req.toLowerCase()))
            );
        });

        // Step 4: Deprioritize recently done activities
        candidates.sort((a, b) => {
            const aRecent = recentHistory.includes(a.id) ? 1 : 0;
            const bRecent = recentHistory.includes(b.id) ? 1 : 0;
            return aRecent - bRecent;
        });

        // Step 5: Score by mood alignment
        candidates = candidates.map(a => {
            let moodScore = 0;
            if (moods.length > 0) {
                moodScore = a.moods.filter(m => moods.includes(m)).length / moods.length;
            } else {
                moodScore = 0.5; // neutral if no mood selected
            }
            return { ...a, moodScore };
        });

        candidates.sort((a, b) => b.moodScore - a.moodScore);

        // Step 6: Add some randomness to top candidates
        const top = candidates.slice(0, 8);
        for (let i = top.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            if (Math.abs(top[i].moodScore - top[j].moodScore) < 0.3) {
                [top[i], top[j]] = [top[j], top[i]];
            }
        }

        // Return top 3
        return top.slice(0, 3).map(a => ({
            ...a,
            timeEstimate: this._formatTime(Math.min(timeAvailable, a.timeRange[1])),
            energyMatch: this._energyLabel(energyLevel),
            vaultItemsUsed: a.prerequisites,
        }));
    },

    _formatTime(minutes) {
        if (minutes < 60) return `${minutes} min`;
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return m > 0 ? `${h}h ${m}m` : `${h}h`;
    },

    _energyLabel(level) {
        const labels = ['', '🪫 Very Low', '😌 Low', '⚡ Medium', '🔥 High', '💥 Max'];
        return labels[level] || '';
    },

    // Get time label from slider value
    getTimeLabel(value) {
        const times = [5, 10, 15, 20, 30, 45, 60, 90, 120, 180];
        const idx = Math.min(value, times.length - 1);
        return { minutes: times[idx], label: this._formatTime(times[idx]) };
    },

    MOODS: [
        { id: 'chill', emoji: '😌', label: 'Chill' },
        { id: 'creative', emoji: '🎨', label: 'Creative' },
        { id: 'focused', emoji: '🎯', label: 'Focused' },
        { id: 'adventurous', emoji: '🌟', label: 'Adventurous' },
        { id: 'social', emoji: '👥', label: 'Social' },
    ],

    ENERGY_LEVELS: [
        { level: 1, emoji: '🪫', label: 'Drained' },
        { level: 2, emoji: '😌', label: 'Low' },
        { level: 3, emoji: '⚡', label: 'Medium' },
        { level: 4, emoji: '🔥', label: 'High' },
        { level: 5, emoji: '💥', label: 'Max' },
    ],
};
