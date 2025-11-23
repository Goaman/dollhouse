import type { CatalogItem } from '../types';

export const SVG_TEMPLATES: Record<string, (c: string) => string> = {
    chair: (c) => `<svg viewBox="0 0 100 150"><path d="M20 70 L20 140 M80 70 L80 140" stroke="#8D6E63" stroke-width="8"/><rect x="15" y="70" width="70" height="15" fill="${c}" rx="5"/><path d="M20 70 L20 10 Q20 0 30 0 L70 0 Q80 0 80 10 L80 70" fill="${c}" opacity="0.9"/></svg>`,
    armchair: (c) => `<svg viewBox="0 0 120 120"><path d="M20 60 L20 110 M100 60 L100 110" stroke="#5D4037" stroke-width="8"/><rect x="15" y="40" width="90" height="60" rx="10" fill="${c}"/><path d="M15 40 Q15 10 60 10 Q105 10 105 40" fill="${c}" filter="brightness(0.9)"/><rect x="10" y="50" width="20" height="40" rx="5" fill="${c}" filter="brightness(1.1)"/><rect x="90" y="50" width="20" height="40" rx="5" fill="${c}" filter="brightness(1.1)"/></svg>`,
    sofa: (c) => `<svg viewBox="0 0 200 120"><rect x="10" y="50" width="180" height="60" rx="10" fill="${c}"/><path d="M10 50 Q10 10 100 10 Q190 10 190 50" fill="${c}" filter="brightness(0.9)"/><rect x="5" y="60" width="30" height="40" rx="5" fill="${c}" filter="brightness(1.1)"/><rect x="165" y="60" width="30" height="40" rx="5" fill="${c}" filter="brightness(1.1)"/><circle cx="30" cy="110" r="5" fill="#5D4037"/><circle cx="170" cy="110" r="5" fill="#5D4037"/></svg>`,
    table_round: (c) => `<svg viewBox="0 0 120 100"><rect x="55" y="40" width="10" height="50" fill="#8D6E63"/><path d="M40 90 L80 90" stroke="#8D6E63" stroke-width="4"/><ellipse cx="60" cy="40" rx="55" ry="15" fill="${c}" stroke="#5D4037" stroke-width="2"/></svg>`,
    table_rect: (c) => `<svg viewBox="0 0 150 100"><rect x="20" y="30" width="110" height="15" fill="${c}"/><rect x="30" y="45" width="10" height="50" fill="#8D6E63"/><rect x="110" y="45" width="10" height="50" fill="#8D6E63"/></svg>`,
    cabinet: (c) => `<svg viewBox="0 0 100 150"><rect x="10" y="10" width="80" height="130" rx="2" fill="${c}" stroke="#555" stroke-width="2"/><line x1="10" y1="50" x2="90" y2="50" stroke="#555"/><line x1="10" y1="90" x2="90" y2="90" stroke="#555"/><circle cx="80" cy="30" r="3" fill="#333"/><circle cx="80" cy="70" r="3" fill="#333"/></svg>`,
    lamp_floor: (c) => `<svg viewBox="0 0 60 200"><rect x="28" y="180" width="4" height="20" fill="#333"/><rect x="20" y="190" width="20" height="5" fill="#333"/><line x1="30" y1="40" x2="30" y2="180" stroke="#333" stroke-width="2"/><path d="M10 40 L50 40 L45 10 L15 10 Z" fill="${c}" opacity="0.9"/></svg>`,
    lamp_table: (c) => `<svg viewBox="0 0 60 80"><rect x="28" y="40" width="4" height="30" fill="#333"/><rect x="20" y="70" width="20" height="5" fill="#333"/><path d="M10 40 L50 40 L40 10 L20 10 Z" fill="${c}" opacity="0.9"/></svg>`,
    plant: (c) => `<svg viewBox="0 0 80 120"><path d="M30 80 L50 80 L55 110 L25 110 Z" fill="#E76F51"/><path d="M40 80 Q20 20 40 10 Q60 20 40 80" fill="${c}"/><path d="M40 80 Q10 50 20 30" fill="${c}" opacity="0.8"/><path d="M40 80 Q70 50 60 30" fill="${c}" opacity="0.8"/></svg>`,
    rug_round: (c) => `<svg viewBox="0 0 120 60"><ellipse cx="60" cy="30" rx="55" ry="25" fill="${c}" opacity="0.8" stroke="white" stroke-width="2" stroke-dasharray="4 2"/></svg>`,
    rug_rect: (c) => `<svg viewBox="0 0 120 80"><rect x="10" y="10" width="100" height="60" rx="5" fill="${c}" opacity="0.8" stroke="white" stroke-width="2"/></svg>`,
    bed: (c) => `<svg viewBox="0 0 160 100"><rect x="10" y="40" width="140" height="50" rx="5" fill="white" stroke="#ccc"/><rect x="10" y="20" width="140" height="30" rx="5" fill="#8D6E63"/><rect x="20" y="30" width="40" height="20" fill="white" rx="5"/><rect x="20" y="50" width="120" height="40" rx="5" fill="${c}"/></svg>`,
    tv: (_c) => `<svg viewBox="0 0 120 100"><rect x="10" y="10" width="100" height="70" rx="5" fill="#333"/><rect x="15" y="15" width="90" height="60" fill="#111"/><path d="M40 80 L80 80 L90 95 L30 95 Z" fill="#222"/></svg>`,
    computer: (_c) => `<svg viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="60" rx="5" fill="#ddd"/><rect x="15" y="15" width="70" height="50" fill="#333"/><rect x="30" y="70" width="40" height="5" fill="#aaa"/><rect x="20" y="75" width="60" height="5" fill="#333"/></svg>`,
    fridge: (c) => `<svg viewBox="0 0 150 300"><rect x="10" y="10" width="130" height="280" rx="10" fill="${c}" stroke="#999" stroke-width="2"/><line x1="10" y1="100" x2="140" y2="100" stroke="#999"/><rect x="120" y="40" width="8" height="40" rx="2" fill="#fff"/><rect x="120" y="130" width="8" height="40" rx="2" fill="#fff"/></svg>`,
    bath_tub: (c) => `<svg viewBox="0 0 200 100"><path d="M10 30 Q10 90 40 95 L160 95 Q190 90 190 30 Z" fill="white" stroke="#ddd" stroke-width="2"/><path d="M20 35 Q100 35 180 35" fill="none" stroke="${c}" stroke-width="10" opacity="0.3"/></svg>`,
    toilet: (c) => `<svg viewBox="0 0 80 120"><rect x="15" y="60" width="50" height="40" rx="5" fill="white"/><rect x="20" y="20" width="40" height="40" rx="5" fill="white"/><rect x="15" y="60" width="50" height="8" fill="${c}" opacity="0.5"/><ellipse cx="40" cy="100" rx="20" ry="5" fill="#eee"/></svg>`,
    sink: (_c) => `<svg viewBox="0 0 100 120"><rect x="25" y="60" width="50" height="60" fill="#ddd"/><rect x="10" y="40" width="80" height="20" rx="5" fill="white"/><path d="M50 40 L50 20 L70 30" stroke="#999" stroke-width="4" fill="none"/></svg>`,
    window: (_c) => `<svg viewBox="0 0 150 120"><rect x="10" y="10" width="130" height="100" fill="#A2D2FF" stroke="white" stroke-width="6"/><line x1="75" y1="10" x2="75" y2="110" stroke="white" stroke-width="6"/><line x1="10" y1="60" x2="140" y2="60" stroke="white" stroke-width="6"/></svg>`,
    shelf: (c) => `<svg viewBox="0 0 150 40"><rect x="0" y="0" width="150" height="10" rx="2" fill="${c}"/><rect x="20" y="10" width="5" height="20" fill="#999"/><rect x="125" y="10" width="5" height="20" fill="#999"/></svg>`
};

export const ASSETS_CHAR: Record<string, string> = {
    char_girl: `<svg viewBox="0 0 100 150" class="drop-shadow-lg"><g transform="translate(5,5)"><path d="M30 140 L30 90 L70 90 L70 140" stroke="#333" stroke-width="12" stroke-linecap="round" fill="none"/><rect x="20" y="50" width="60" height="50" rx="10" fill="#FF9A9E"/><circle cx="50" cy="35" r="25" fill="#f8d5c2"/><path d="M25 35 Q50 5 75 35" fill="none" stroke="#5D4037" stroke-width="6" stroke-linecap="round"/><circle cx="42" cy="32" r="3" fill="#333"/><circle cx="58" cy="32" r="3" fill="#333"/><path d="M45 45 Q50 48 55 45" stroke="#333" stroke-width="2" fill="none"/><path d="M15 55 L25 80" stroke="#f8d5c2" stroke-width="8" stroke-linecap="round"/><path d="M85 55 L75 80" stroke="#f8d5c2" stroke-width="8" stroke-linecap="round"/></g></svg>`,
    char_boy: `<svg viewBox="0 0 100 150" class="drop-shadow-lg"><g transform="translate(5,5)"><path d="M30 140 L30 90 L70 90 L70 140" stroke="#333" stroke-width="12" stroke-linecap="round" fill="none"/><rect x="20" y="50" width="60" height="50" rx="10" fill="#A1C4FD"/><circle cx="50" cy="35" r="25" fill="#E0AC69"/><path d="M25 25 Q50 15 75 25" fill="none" stroke="#333" stroke-width="8" stroke-linecap="round"/><circle cx="42" cy="32" r="3" fill="#333"/><circle cx="58" cy="32" r="3" fill="#333"/><path d="M45 45 Q50 48 55 45" stroke="#333" stroke-width="2" fill="none"/><path d="M15 55 L25 80" stroke="#E0AC69" stroke-width="8" stroke-linecap="round"/><path d="M85 55 L75 80" stroke="#E0AC69" stroke-width="8" stroke-linecap="round"/></g></svg>`
};

const COLORS = {
    wood: ['#8D6E63', '#6D4C41', '#A1887F', '#D7CCC8'],
    fabric: ['#FF9A9E', '#A1C4FD', '#C1E1C1', '#FDFD96', '#B39EB5', '#FFB347', '#FF6961'],
    plant: ['#2A9D8F', '#264653', '#8AB17D'],
    neutral: ['#FFFFFF', '#E0E0E0', '#333333']
};

const CATALOG_DATA: Record<string, CatalogItem[]> = {
    'Seating': [],
    'Tables': [],
    'Storage': [],
    'Bed & Bath': [],
    'Decor': [],
    'Electronics': [],
    'Plants': []
};

function addItem(cat: string, name: string, template: string, colors: string[], type: string = 'furniture', w: number | null = null, h: number | null = null) {
    colors.forEach((col, idx) => {
        if (CATALOG_DATA[cat]) {
            CATALOG_DATA[cat].push({
                name: `${name} ${idx + 1}`,
                svgTemplate: template,
                color: col,
                type: type,
                w: w || undefined,
                h: h || undefined,
                svg: SVG_TEMPLATES[template](col)
            });
        }
    });
}

// Seating
addItem('Seating', 'Simple Chair', 'chair', [...COLORS.wood, ...COLORS.fabric], 'furniture', 60, 90);
addItem('Seating', 'Comfy Armchair', 'armchair', COLORS.fabric, 'furniture', 100, 100);
addItem('Seating', 'Modern Sofa', 'sofa', COLORS.fabric, 'furniture', 200, 120);

// Tables
addItem('Tables', 'Round Table', 'table_round', [...COLORS.wood, '#fff'], 'furniture', 120, 100);
addItem('Tables', 'Dining Table', 'table_rect', COLORS.wood, 'furniture', 150, 100);

// Storage
addItem('Storage', 'Tall Cabinet', 'cabinet', [...COLORS.wood, ...COLORS.fabric], 'furniture', 80, 130);
addItem('Storage', 'Wall Shelf', 'shelf', [...COLORS.wood, '#fff', '#333'], 'furniture-wall', 150, 40);
addItem('Storage', 'Fridge', 'fridge', ['#eee', '#333', '#FF9A9E', '#A1C4FD'], 'furniture-complex', 150, 300);

// Bed & Bath
addItem('Bed & Bath', 'Cozy Bed', 'bed', COLORS.fabric, 'furniture', 160, 100);
addItem('Bed & Bath', 'Bathtub', 'bath_tub', ['#CDEFFF', '#FFC8DD', '#E0FBFC'], 'furniture', 200, 100);
addItem('Bed & Bath', 'Toilet', 'toilet', ['#fff', '#f0f0f0'], 'furniture', 60, 100);
addItem('Bed & Bath', 'Sink', 'sink', ['#fff'], 'furniture', 100, 120);

// Electronics
addItem('Electronics', 'Flat TV', 'tv', ['#333'], 'furniture', 120, 100);
addItem('Electronics', 'PC Setup', 'computer', ['#333', '#fff'], 'furniture', 100, 100);
addItem('Electronics', 'Table Lamp', 'lamp_table', COLORS.fabric, 'furniture', 40, 60);
addItem('Electronics', 'Floor Lamp', 'lamp_floor', COLORS.fabric, 'furniture', 40, 150);

// Plants
addItem('Plants', 'Potted Plant', 'plant', COLORS.plant, 'furniture', 60, 100);

// Decor
addItem('Decor', 'Round Rug', 'rug_round', COLORS.fabric, 'furniture-back', 120, 60);
addItem('Decor', 'Rect Rug', 'rug_rect', COLORS.fabric, 'furniture-back', 120, 80);
addItem('Decor', 'Window', 'window', ['#fff'], 'furniture-wall', 150, 120);

const EMOJIS: Record<string, string[]> = {
    'Decor': ['🧸', '🎁', '⏰', '📚', '🎨', '🖼️', '🕯️', '🏺', '🎈'],
    'Electronics': ['📻', '📷', '📞', '⏰', '📹', '🎮'],
    'Plants': ['🌵', '🌲', '💐', '🌻', '🪴'],
    'Kitchen': ['🍕', '🍔', '🍟', '🌭', '🍿', '🥞', '🥐', '🥯', '🍞', '🧀', '🥗', '🥪', '🌮', '🌯', '🍜', '🍝', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🫖', '🍵', '🧃', '🥤', '🍳', '🥘', '🍲', '🥣']
};

for (let cat in EMOJIS) {
    if (CATALOG_DATA[cat]) {
        EMOJIS[cat].forEach(e => {
            CATALOG_DATA[cat].push({
                name: 'Item',
                emoji: e,
                type: cat === 'Kitchen' ? 'food' : 'item',
                svg: `<div style="font-size:40px">${e}</div>`
            });
        });
    }
}

export const CATALOG = CATALOG_DATA;

