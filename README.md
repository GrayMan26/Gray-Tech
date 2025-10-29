# GrayTech Inc

A minimal, fast, and mobile-first marketing website for GrayTech Inc - a Philadelphia-based tech services company.

## Features

- **Next.js 14** with App Router and TypeScript
- **Tailwind CSS** for styling with custom brand colors
- **Mobile-first responsive design** 
- **SEO optimized** with metadata, sitemap, and robots.txt
- **Accessible** with proper focus states and semantic HTML
- **Performance focused** with minimal JavaScript and optimized assets
- **Contact form** with API route and email fallback

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React (icons)
- Clsx (utility classes)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/GrayMan26/Gray-Tech.git
   cd gray-tech
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
gray-tech/
├── app/                    # Next.js App Router pages
│   ├── about/             
│   ├── contact/           
│   ├── services/          
│   ├── api/contact/       # Contact form API
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   ├── not-found.tsx     # 404 page
│   └── sitemap.ts        # XML sitemap
├── components/            # Reusable components
│   ├── Button.tsx        
│   ├── Container.tsx     
│   ├── Footer.tsx        
│   ├── Header.tsx        
│   └── ServiceCard.tsx   
├── lib/                  # Utility functions
│   └── utils.ts         
└── public/              # Static assets
    └── robots.txt       
```

## Brand Guidelines

- **Colors**: White background, near-black text (#0B0B0B), gray accents (#E5E7EB), indigo accent (#4F46E5)
- **Typography**: System UI fonts for performance
- **Voice**: Clear, trustworthy, straightforward
- **Layout**: Generous whitespace, mobile-first, max-width containers

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contact

- **Phone**: (610) 241-6947
- **Email**: graytechhelp@gmail.com
- **Location**: Philadelphia, PA

## License

MIT License - see LICENSE file for details.