import { FoodItem } from '../types';

export const FOOD_ITEMS: FoodItem[] = [
  // Traditional Ghanaian Dishes (Personal Touch)
  {
    id: 'ghana-jollof',
    name: 'Ghana Jollof Rice Special',
    category: 'ghanaian',
    description: 'Rich, smoky, firebrand party jollof served with spicy black shito, sweet golden kelewele (fried plantains), and seasoned grilled chicken.',
    emoji: '🍛',
    tag: 'Authentic Favorite 🇬🇭',
    ghanaianFlag: true,
  },
  {
    id: 'fufu-soup',
    name: 'Fufu with Light Chicken Soup',
    category: 'ghanaian',
    description: 'Silky, soft pounded cassava and plantain fufu swimming in a fragrant, spicy, herb-infused Ghanaian chicken light soup served steaming hot.',
    emoji: '🍲',
    tag: 'Comfort Classic 🇬🇭',
    ghanaianFlag: true,
  },
  {
    id: 'yam-garden-egg',
    name: 'Boiled Yam with Garden Egg Stew',
    category: 'ghanaian',
    description: 'Tender slices of boiled puna yam smothered in savory, slow-cooked garden egg (aubergine) stew, flaked smoked fish, boiled egg & avocado.',
    emoji: '🍠',
    tag: 'Traditional Feast 🇬🇭',
    ghanaianFlag: true,
  },
  {
    id: 'check-check',
    name: 'Check-Check Street Fried Rice',
    category: 'ghanaian',
    description: 'Legendary Accra night-market seasoned fried rice tossed with crunchy veggies, tender crispy chicken thigh, tangy coleslaw & fiery black shito.',
    emoji: '🍗',
    tag: 'Street Food Legend 🇬🇭',
    ghanaianFlag: true,
  },
  {
    id: 'waakye-deluxe',
    name: 'Waakye Executive Platter',
    category: 'ghanaian',
    description: 'Aromatic sorghum-leaf rice & black-eyed beans topped with spaghetti (talia), wele, fried fish or beef, gari foto, boiled egg & extra shito.',
    emoji: '🍚',
    tag: 'Full Works 🇬🇭',
    ghanaianFlag: true,
  },
  {
    id: 'red-red',
    name: 'Red-Red & Spiced Kelewele',
    category: 'ghanaian',
    description: 'Rich slow-cooked brown bean stew simmered in zesty palm oil, served with piping hot caramelized spiced fried plantains and sprinkles of gari.',
    emoji: '🍌',
    tag: 'Sweet & Savory 🇬🇭',
    ghanaianFlag: true,
  },
  {
    id: 'banku-tilapia',
    name: 'Hot Banku & Grilled Tilapia',
    category: 'ghanaian',
    description: 'Fresh steamed banku served with whole charcoal-grilled tilapia, spicy sliced raw pepper relish, onions, and fresh tomatoes.',
    emoji: '🐟',
    tag: 'Fresh Grill 🇬🇭',
    ghanaianFlag: true,
  },

  // Continental & Gourmet Dishes
  {
    id: 'artisan-pizza',
    name: 'Artisan Wood-Fired Pizza',
    category: 'continental',
    description: 'Crispy stone-baked crust with bubbling fresh mozzarella, heirloom tomatoes, fresh basil, and sweet hot honey drizzle.',
    emoji: '🍕',
    tag: 'Classic Comfort 🍕',
  },
  {
    id: 'fresh-sushi',
    name: 'Fresh Premium Sushi & Sashimi',
    category: 'continental',
    description: 'Melt-in-your-mouth salmon, spicy tuna rolls, crispy tempura, and artisanal nigiri served with soy glaze and pickled ginger.',
    emoji: '🍣',
    tag: 'Gourmet Fresh 🍱',
  },
  {
    id: 'smash-burgers',
    name: 'Gourmet Smash Burgers & Fries',
    category: 'continental',
    description: 'Double juicy beef smash patties with melted cheddar, caramelized onions, secret house sauce on toasted brioche bun with seasoned fries.',
    emoji: '🍔',
    tag: 'All-Time Hit 🍟',
  },
  {
    id: 'truffle-pasta',
    name: 'Truffle Cream & Wild Mushroom Pasta',
    category: 'continental',
    description: 'Handcrafted fettuccine tossed in a luscious black truffle and garlic parmesan cream sauce with fresh aromatic herbs.',
    emoji: '🍝',
    tag: 'Romantic Gourmet 🍷',
  },
  {
    id: 'street-tacos',
    name: 'Crispy Birria & Street Tacos',
    category: 'continental',
    description: 'Slow-braised savory beef tacos dipped in rich spicy consommé broth with cilantro, diced onions, and fresh lime.',
    emoji: '🌮',
    tag: 'Flavor Explosion 🌶️',
  },
  {
    id: 'tonkotsu-ramen',
    name: 'Rich Steaming Japanese Ramen',
    category: 'continental',
    description: 'Silky 12-hour rich broth with springy noodles, tender chashu pork, seasoned soft-boiled egg, scallions, and nori.',
    emoji: '🍜',
    tag: 'Warm & Cozy 🥢',
  },
  {
    id: 'ribeye-steak',
    name: 'Prime Grilled Ribeye Steak',
    category: 'continental',
    description: 'Tender, juicy ribeye steak seared with rosemary garlic butter, served with crisp golden fries, charred asparagus, and peppercorn sauce.',
    emoji: '🥩',
    tag: 'Candlelight Classic 🕯️',
  },
  {
    id: 'seafood-platter',
    name: 'Candlelight Garlic Butter Seafood',
    category: 'continental',
    description: 'Sautéed jumbo prawns, calamari, and tender sea scallops drenched in garlic lemon butter with crispy herb-roasted baby potatoes.',
    emoji: '🍤',
    tag: 'Luxury Seafood 🥂',
  },
];

export const PLACE_SUGGESTIONS = [
  { id: 'skybar', name: 'Skybar 25 Rooftop', emoji: '🍸', desc: 'Stunning city views, night lights & cocktails' },
  { id: 'santoku', name: 'Santoku Fine Dining', emoji: '🍣', desc: 'World-class cuisine, luxury ambiance & candlelight' },
  { id: 'buka', name: 'Buka Restaurant / Cozy Spot', emoji: '🥘', desc: 'Warm traditional setting with legendary Ghanaian dishes' },
  { id: 'beachside', name: 'Beachfront Sunset Dinner', emoji: '🌅', desc: 'Ocean waves, sea breeze & candlelit table' },
  { id: 'cozy-cafe', name: 'Artisan Cafe & Sweet Dessert', emoji: '☕', desc: 'Charming nook for quiet laughter and sweet pastries' },
  { id: 'surprise', name: 'Surprise Me! (Anywhere with you)', emoji: '✨', desc: 'You choose, I trust you completely 💕' },
];

export const VIBE_OPTIONS = [
  { id: 'romantic', title: 'Cozy & Romantic', emoji: '🌹', desc: 'Candlelight, soft background music, deep talks' },
  { id: 'fancy', title: 'Dressed Up & Glam', emoji: '💃', desc: 'High heels, stunning dress, fancy venue & photos' },
  { id: 'chill', title: 'Casual & Playful', emoji: '👟', desc: 'Relaxed vibes, good laughs, late night stroll' },
  { id: 'private', title: 'Private Chef / Home Date', emoji: '👨‍🍳', desc: 'Candles lit, your favorite songs, cooked with love' },
];

export const SWEET_ADDONS = [
  { id: 'flowers', title: 'Fresh Bouquet of Roses', emoji: '💐' },
  { id: 'dessert', title: 'Surprise Sweet Dessert', emoji: '🍰' },
  { id: 'playlist', title: 'Curated Afrobeats & Love Playlist', emoji: '🎵' },
  { id: 'movie', title: 'Cozy Movie & Warm Blanket After', emoji: '🎬' },
  { id: 'photos', title: 'Cute Mini Photoshoot of You', emoji: '📸' },
  { id: 'massage', title: 'Feet or Shoulder Massage', emoji: '💆‍♀️' },
];

export const TIME_SLOTS = [
  { id: 'sunset', label: 'Sunset Golden Hour (6:00 PM)', emoji: '🌅' },
  { id: 'dinner', label: 'Cozy Dinner Time (7:30 PM)', emoji: '🕯️' },
  { id: 'evening', label: 'Late Evening Food & Laughs (8:45 PM)', emoji: '🌙' },
  { id: 'afternoon', label: 'Sunny Afternoon Lunch (1:30 PM)', emoji: '☀️' },
  { id: 'custom', label: 'Custom Time (I pick!)', emoji: '⏰' },
];
