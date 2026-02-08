# Refactored Academic Website

This is a modern refactor of the personal academic website using **Next.js**, **shadcn/ui**, and **Tailwind CSS**.

## What's Changed

### Technology Stack
- **Next.js 14** - React framework with app router
- **shadcn/ui** - High-quality, accessible React components
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe development

### Features
- **Red Color Theme** - Maintained the original red color scheme (rgb(171, 22, 43))
- **Responsive Design** - Works on desktop and mobile
- **Modern Components** - Button, Separator, Navigation
- **Type-Safe** - Full TypeScript support
- **Dark Mode Ready** - Foundation for theme switching

### Design Improvements
✨ Clean, modern UI with shadcn components  
✨ Improved accessibility  
✨ Better performance with Next.js optimization  
✨ Responsive layout that works on all devices  
✨ Consistent color theming through Tailwind  

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

The website will be available at `http://localhost:3000`

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── globals.css         # Global styles & Tailwind
│   ├── page.tsx            # Home page
│   ├── research/
│   ├── conferences/
│   └── teaching/
├── components/
│   ├── Sidebar.tsx         # Profile sidebar
│   ├── Navigation.tsx      # Navigation buttons
│   └── ui/                 # shadcn components
├── lib/
│   └── utils.ts            # Utility functions
├── package.json            # Dependencies
├── tailwind.config.ts      # Tailwind theme config
├── tsconfig.json          # TypeScript config
└── next.config.js         # Next.js config
```

## Customization

### Colors
Edit `app/globals.css` to customize the red theme:

```css
--primary: 171 22 43;              /* Main red */
--primary-foreground: 244 240 236; /* Light background */
```

### Content
Update the content in:
- `app/page.tsx` - About Me section
- `app/research/page.tsx` - Research content
- `app/conferences/page.tsx` - Conferences
- `app/teaching/page.tsx` - Teaching info

### Profile Image
Replace the placeholder "AMM" in `components/Sidebar.tsx` with an actual image:

```tsx
<Image
  src="/your-photo.jpg"
  alt="Profile"
  width={256}
  height={256}
  className="rounded-lg"
/>
```

## Adding More shadcn Components

To add more shadcn components:

```bash
npx shadcn-ui@latest add [component-name]
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
