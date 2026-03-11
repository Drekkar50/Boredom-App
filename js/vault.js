/* =========================================
   ZENITH — Vault Module
   ========================================= */

const Vault = {
    // Category metadata
    CATEGORIES: {
        interest: { emoji: '💡', label: 'Interest', color: 'interest' },
        possession: { emoji: '📦', label: 'Possession', color: 'possession' },
        digital: { emoji: '📚', label: 'Digital', color: 'digital' },
        skill: { emoji: '🎯', label: 'Skill', color: 'skill' },
    },

    // Predefined suggestions for autocomplete
    SUGGESTIONS: {
        interest: [
            'Photography', 'Painting', 'Drawing', 'Cooking', 'Gardening',
            'Reading', 'Writing', 'Gaming', 'Music', 'Yoga',
            'Hiking', 'Meditation', 'Coding', 'Calligraphy', 'Origami',
            'Pottery', 'Knitting', 'Chess', 'Astronomy', 'Baking',
        ],
        possession: [
            'DSLR Camera', 'Watercolor Set', 'Oil Paints', 'Acrylic Paints',
            'Sketchbook', 'Pencil Set', 'Guitar', 'Piano/Keyboard', 'Ukulele',
            'Turpentine', 'Canvas', 'Brushes', 'Easel', 'Tripod',
            'Telescope', 'Binoculars', 'Yoga Mat', 'Dumbbells', 'Jump Rope',
            'Sewing Machine', 'Clay', 'Knitting Needles', 'Calligraphy Pens',
            'Colored Pencils', 'Markers', 'Palette Knife', 'Spray Paint',
        ],
        digital: [
            'Netflix', 'Spotify', 'Kindle Library', 'Steam Library',
            'Audible', 'YouTube Premium', 'Skillshare', 'MasterClass',
            'Adobe Creative Cloud', 'Notion', 'Goodreads', 'Duolingo',
        ],
        skill: [
            'Beginner Guitar', 'Intermediate Python', 'Advanced Photography',
            'Beginner Yoga', 'Intermediate Cooking', 'Beginner Meditation',
            'Intermediate Drawing', 'Beginner Piano', 'Advanced Chess',
            'Beginner Watercolor', 'Intermediate Writing', 'Beginner Baking',
        ],
    },

    // Tags auto-generation from item names
    generateTags(name, category) {
        const tagMap = {
            'dslr camera': ['photography', 'gear', 'camera'],
            'watercolor set': ['painting', 'watercolor', 'art'],
            'oil paints': ['painting', 'oil', 'art'],
            'acrylic paints': ['painting', 'acrylic', 'art'],
            'sketchbook': ['drawing', 'sketching', 'art'],
            'pencil set': ['drawing', 'sketching', 'pencils'],
            'guitar': ['music', 'instrument', 'strings'],
            'piano': ['music', 'instrument', 'keys'],
            'keyboard': ['music', 'instrument', 'keys'],
            'ukulele': ['music', 'instrument', 'strings'],
            'turpentine': ['painting', 'oil', 'solvent'],
            'canvas': ['painting', 'surface', 'art'],
            'brushes': ['painting', 'tools', 'art'],
            'easel': ['painting', 'stand', 'art'],
            'tripod': ['photography', 'gear', 'support'],
            'telescope': ['astronomy', 'observation', 'science'],
            'yoga mat': ['yoga', 'fitness', 'exercise'],
            'dumbbells': ['fitness', 'strength', 'exercise'],
            'clay': ['pottery', 'sculpting', 'art'],
            'calligraphy pens': ['calligraphy', 'writing', 'art'],
            'colored pencils': ['drawing', 'coloring', 'art'],
            'markers': ['drawing', 'art', 'coloring'],
            'sewing machine': ['sewing', 'craft', 'textiles'],
        };

        const key = name.toLowerCase();
        for (const [pattern, tags] of Object.entries(tagMap)) {
            if (key.includes(pattern)) return tags;
        }

        // Fallback: generate from category
        const catTags = {
            interest: ['hobby', 'interest'],
            possession: ['tool', 'item'],
            digital: ['digital', 'subscription'],
            skill: ['skill', 'learning'],
        };
        return catTags[category] || ['general'];
    },

    // Prerequisite database for activity validation
    ACTIVITY_PREREQUISITES: {
        'oil_painting': {
            required: ['oil paints', 'brushes', 'canvas', 'turpentine'],
            optional: ['easel', 'palette knife'],
            timeRange: [60, 180],
            energyMin: 3,
        },
        'watercolor_painting': {
            required: ['watercolor set', 'brushes'],
            optional: ['watercolor paper', 'palette'],
            timeRange: [30, 120],
            energyMin: 2,
        },
        'sketching': {
            required: ['pencil set'],
            optional: ['sketchbook', 'eraser'],
            timeRange: [10, 90],
            energyMin: 2,
        },
        'photography_walk': {
            required: ['dslr camera'],
            optional: ['tripod', 'extra lens'],
            timeRange: [30, 180],
            energyMin: 3,
        },
        'guitar_practice': {
            required: ['guitar'],
            optional: ['guitar picks', 'capo'],
            timeRange: [15, 90],
            energyMin: 2,
        },
        'piano_practice': {
            required: ['piano/keyboard'],
            optional: ['sheet music'],
            timeRange: [15, 60],
            energyMin: 2,
        },
        'yoga_session': {
            required: ['yoga mat'],
            optional: ['yoga blocks'],
            timeRange: [10, 60],
            energyMin: 1,
        },
        'strength_training': {
            required: ['dumbbells'],
            optional: ['yoga mat', 'resistance bands'],
            timeRange: [15, 60],
            energyMin: 4,
        },
        'calligraphy': {
            required: ['calligraphy pens'],
            optional: ['ink', 'special paper'],
            timeRange: [20, 60],
            energyMin: 2,
        },
        'colored_drawing': {
            required: ['colored pencils'],
            optional: ['sketchbook'],
            timeRange: [15, 90],
            energyMin: 2,
        },
        'stargazing': {
            required: ['telescope'],
            optional: ['binoculars', 'star chart'],
            timeRange: [30, 120],
            energyMin: 2,
        },
    },

    // Check if user can do a specific activity
    canDoActivity(activityKey) {
        const prereq = this.ACTIVITY_PREREQUISITES[activityKey];
        if (!prereq) return { canDo: true, missing: [] };

        const userPossessions = Store.getVault()
            .filter(item => item.category === 'possession')
            .map(item => item.name.toLowerCase());

        const missing = prereq.required.filter(
            req => !userPossessions.some(p => p.includes(req.toLowerCase()))
        );

        return {
            canDo: missing.length === 0,
            missing,
            activity: prereq,
        };
    },

    // Get all activities the user CAN do based on their inventory
    getAvailableActivities(timeAvailable, energyLevel) {
        const available = [];
        for (const [key, prereq] of Object.entries(this.ACTIVITY_PREREQUISITES)) {
            const check = this.canDoActivity(key);
            if (check.canDo) {
                if (timeAvailable >= prereq.timeRange[0] && energyLevel >= prereq.energyMin) {
                    available.push({
                        key,
                        ...prereq,
                        name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    });
                }
            }
        }
        return available;
    },
};
