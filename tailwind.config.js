/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors - Warm & Appetizing
        primary: {
          50: '#FFF7ED',   // Light cream
          100: '#FFEDD5',  // Soft peach
          200: '#FED7AA',  // Light orange
          300: '#FDBA74',  // Warm orange
          400: '#FB923C',  // Medium orange
          500: '#F97316',  // Main orange
          600: '#EA580C',  // Deep orange
          700: '#DD7230',  // Earthy orange
          800: '#9A3412',  // Rich terracotta
          900: '#7C2D12',  // Dark burnt orange
        },
        // Secondary - Fresh & Natural
        secondary: {
          50: '#F0FDF4',   // Lightest green
          100: '#DCFCE7',  // Very light green
          200: '#BBF7D0',  // Light green
          300: '#90D26D',  // Fresh green
          400: '#4ADE80',  // Medium green
          500: '#22C55E',  // Main green
          600: '#16A34A',  // Deep green
          700: '#15803D',  // Forest green
          800: '#166534',  // Dark green
          900: '#14532D',  // Very dark green
        },
        // Accent - Golden & Warm
        accent: {
          50: '#FFFBEB',   // Cream white
          100: '#FEF3C7',  // Light yellow
          200: '#F4C95D',  // Golden yellow
          300: '#FFD166',  // Butterscotch
          400: '#FBBF24',  // Amber
          500: '#F59E0B',  // Orange-yellow
          600: '#D97706',  // Deep amber
          700: '#B45309',  // Brown-gold
          800: '#92400E',  // Dark gold
          900: '#78350F',  // Rich brown
        },
        // Neutral - Warm Tones
        neutral: {
          50: '#FAFAF9',   // Off white
          100: '#F5F5F4',  // Light gray
          200: '#E7E5E4',  // Soft gray
          300: '#D6D3D1',  // Medium gray
          400: '#A8A29E',  // Gray
          500: '#78716C',  // Dark gray
          600: '#57534E',  // Deeper gray
          700: '#44403C',  // Brown-gray
          800: '#292524',  // Very dark gray
          900: '#1C1917',  // Almost black
        },
        // Brown - Earthy & Comforting
        brown: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E6E3',
          300: '#D4C5B0',
          400: '#C0A080',
          500: '#854D27',  // Rich brown
          600: '#6B3E1F',
          700: '#553D27',  // Cocoa
          800: '#3E2A1A',
          900: '#2A1D12',
        },
        // Spice - Vibrant Highlights
        spice: {
          red: '#C0392B',     // Paprika
          orange: '#DC7633',  // Cinnamon
          green: '#7DCEA0',   // Olive green
          cream: '#F9E79F',   // Warm cream
        }
      },
      boxShadow: {
        book: '0 10px 30px rgba(0,0,0,0.15)',
        glow: '0 0 20px rgba(249, 115, 22, 0.3)',
        'glow-lg': '0 0 40px rgba(249, 115, 22, 0.4)',
        card: '0 4px 20px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 30px rgba(249, 115, 22, 0.2)',
      },
      transformOrigin: {
        book: '0% 50%'
      },
      transitionProperty: {
        book: 'transform, box-shadow, opacity'
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, #F97316 0%, #DC7633 50%, #C0392B 100%)',
        'gradient-fresh': 'linear-gradient(135deg, #90D26D 0%, #22C55E 100%)',
        'gradient-golden': 'linear-gradient(135deg, #FFD166 0%, #F59E0B 50%, #D97706 100%)',
        'gradient-earth': 'linear-gradient(135deg, #854D27 0%, #DD7230 50%, #F4C95D 100%)',
      }
    }
  },
  plugins: []
}