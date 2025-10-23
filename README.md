# GDG Noida Riddle Cards

A mobile-first React app featuring 4 interactive color cards with riddles and camera sharing capabilities. Built with React, Vite, and Tailwind CSS.

## Features

- 🎴 **4 Interactive Cards**: One for each color (blue, green, yellow, red) with random suit selection
- 🎨 **3D Flip Animation**: Smooth card flip with reduced-motion support
- 📱 **Mobile-First Design**: Optimized for mobile devices
- 📷 **Camera Integration**: Front camera access for sharing
- 🎯 **Instagram Stories Ready**: 1080×1920 PNG export
- ♿ **Accessibility**: Keyboard navigation and screen reader support
- 🎭 **Fallback Support**: Works without camera access

## Colors & Suits

- **Blue** (`#4285F4`): Randomly shows Spade ♠, Club ♣, Heart ♥, or Diamond ♦
- **Green** (`#34A853`): Randomly shows Spade ♠, Club ♣, Heart ♥, or Diamond ♦  
- **Yellow** (`#F9AB00`): Randomly shows Spade ♠, Club ♣, Heart ♥, or Diamond ♦
- **Red** (`#EA4335`): Randomly shows Spade ♠, Club ♣, Heart ♥, or Diamond ♦

## Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd gdg-riddle-cards
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   - Local: `http://localhost:5173`
   - Network: Check terminal for network URL

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── LoadingScreen.jsx    # GDG Noida loading animation
│   ├── CardGrid.jsx         # Main grid of 4 color cards
│   ├── ColorCard.jsx        # Individual card with flip animation
│   ├── RiddleFront.jsx      # Card front with riddle display
│   └── ShareOverlay.jsx     # Camera sharing interface
├── lib/
│   ├── riddles.js           # All 16 riddles data (4 per color)
│   └── capture.js           # Image capture utilities
├── App.jsx                  # Main app component
└── main.jsx                 # App entry point

public/
└── suits/                   # SVG suit icons
    ├── spade.svg
    ├── club.svg
    ├── heart.svg
    └── diamond.svg
```

## Usage

1. **Loading**: App starts with GDG Noida loading animation
2. **Card Grid**: 4 colored cards (blue, green, yellow, red) in responsive grid
3. **Choose Color**: Tap any color card to reveal random suit + riddle for that color
4. **Share**: Tap "Share" button to open camera overlay
5. **Capture**: Take photo with riddle for Instagram Stories

## Technical Details

### Camera Access
- Requests front camera via `getUserMedia`
- Graceful fallback to silhouette if denied
- Client-side processing only (no uploads)

### Image Capture
- Uses `html2canvas` for DOM-to-image conversion
- Generates 1080×1920 PNG optimized for Instagram Stories
- Web Share API with download fallback

### Accessibility
- Keyboard navigation support
- Screen reader friendly
- Respects `prefers-reduced-motion`
- High contrast color scheme

### Browser Support
- Modern mobile browsers (iOS Safari, Chrome Mobile)
- Desktop browsers for development
- Progressive enhancement for older browsers

## Customization

### Adding New Riddles
Edit `src/lib/riddles.js` to modify or add riddles:

```javascript
export const riddles = {
  blue: {
    spade: {
      question: "Your riddle here?",
      answer: "Answer"
    }
    // ... more riddles
  }
};
```

### Styling
- Colors defined in `tailwind.config.js`
- Custom animations in `src/index.css`
- Component-specific styles with Tailwind classes

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- ESLint configuration included
- Prettier recommended for formatting
- Component-based architecture

## Deployment

### Static Hosting
Build the app and deploy the `dist/` folder to any static host:

```bash
npm run build
# Upload dist/ folder to your hosting provider
```

### Recommended Hosts
- Vercel (automatic deployments)
- Netlify (drag & drop)
- GitHub Pages
- Firebase Hosting

## Troubleshooting

### Camera Not Working
- Ensure HTTPS in production
- Check browser permissions
- Fallback mode works without camera

### Build Issues
- Clear `node_modules` and reinstall
- Check Node.js version (16+ required)
- Verify all dependencies installed

### Mobile Issues
- Test on actual devices, not just browser dev tools
- Check viewport meta tag
- Verify touch event handling

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

## License

MIT License - see LICENSE file for details

## Credits

Built for GDG Noida community events and workshops.