// Typography styles, fonts, and design effects for Stories and Posts

export const FONT_STYLES = [
  {
    id: 'modern',
    name: 'Modern',
    fontFamily: '"Outfit", sans-serif',
    sample: 'Aa',
    preview: 'Modern',
  },
  {
    id: 'serif',
    name: 'Classic',
    fontFamily: '"Playfair Display", Georgia, serif',
    sample: 'Aa',
    preview: 'Classic',
  },
  {
    id: 'script',
    name: 'Handwriting',
    fontFamily: '"Caveat", cursive',
    sample: 'Aa',
    preview: 'Script',
  },
  {
    id: 'calligraphy',
    name: 'Cursive',
    fontFamily: '"Dancing Script", cursive',
    sample: 'Aa',
    preview: 'Luxury',
  },
  {
    id: 'typewriter',
    name: 'Typewriter',
    fontFamily: '"Space Mono", monospace',
    sample: 'Aa',
    preview: 'Retro',
  },
  {
    id: 'headline',
    name: 'Impact',
    fontFamily: '"Bebas Neue", sans-serif',
    sample: 'AA',
    preview: 'BOLD',
  },
  {
    id: 'playful',
    name: 'Playful',
    fontFamily: '"Pacifico", cursive',
    sample: 'Aa',
    preview: 'Fun',
  },
];

export const DESIGN_EFFECTS = [
  {
    id: 'plain',
    name: 'Plain',
    className: 'drop-shadow-sm',
    description: 'Clean readable text',
  },
  {
    id: 'highlight',
    name: 'Highlight Box',
    className: 'bg-black/75 text-white px-3 py-1 rounded-xl shadow-lg inline-block',
    description: 'Instagram solid background block',
  },
  {
    id: 'neon',
    name: 'Neon Glow',
    className: 'drop-shadow-[0_0_12px_rgba(244,63,94,0.9)] text-pink-400 font-bold',
    description: 'Vibrant neon light glow',
  },
  {
    id: 'gradient',
    name: 'Golden Glow',
    className: 'bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent font-extrabold drop-shadow-md',
    description: 'Rich champagne gold gradient',
  },
  {
    id: 'outline',
    name: 'Outline Stroke',
    className: 'text-transparent font-extrabold [-webkit-text-stroke:1.2px_currentColor]',
    description: 'Contoured outline stroke',
  },
  {
    id: 'glass',
    name: 'Frosted Glass',
    className: 'bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-4 py-2 shadow-2xl inline-block',
    description: 'Translucent glassmorphism pill',
  },
];

export const TEXT_PALETTE = [
  '#ffffff', // White
  '#fbbf24', // Amber / Gold
  '#f43f5e', // Rose
  '#a855f7', // Purple
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#0f172a', // Midnight / Black
];

export const POST_GRADIENTS = [
  { id: 'none', name: 'None', value: null },
  { id: 'sunset', name: 'Sunset Vibe', value: 'linear-gradient(135deg, #f43f5e 0%, #fbbf24 100%)' },
  { id: 'midnight', name: 'Midnight Neon', value: 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)' },
  { id: 'emerald', name: 'Emerald Forest', value: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)' },
  { id: 'luxury', name: 'Champagne Gold', value: 'linear-gradient(135deg, #78350f 0%, #d97706 100%)' },
  { id: 'ocean', name: 'Deep Ocean', value: 'linear-gradient(135deg, #0c4a6e 0%, #06b6d4 100%)' },
  { id: 'noir', name: 'Noir Dark', value: 'linear-gradient(135deg, #090d16 0%, #1e293b 100%)' },
];

export const getFontFamilyStyle = (fontId) => {
  const found = FONT_STYLES.find((f) => f.id === fontId);
  return found ? found.fontFamily : '"Outfit", sans-serif';
};

export const getDesignEffectClass = (designId) => {
  const found = DESIGN_EFFECTS.find((d) => d.id === designId);
  return found ? found.className : 'drop-shadow-sm';
};
