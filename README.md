# Bridge Up

Marketing website for **Bridge Up** - a real-time bridge status app for commuters in the St. Lawrence Seaway region.

## About Bridge Up

Bridge Up helps thousands of commuters navigate lift bridges across Ontario and Quebec. Never get stuck waiting at a closed bridge again.

### Key Features

- **Real-time Status** - Know instantly whether a bridge is open, closed, or closing soon
- **Predictive Reopening Times** - AI-powered predictions based on 300+ analyzed closures per bridge with 95% confidence intervals
- **Push Notifications** - Get alerted the moment a bridge status changes, before you leave home
- **CarPlay Support** - Glanceable bridge status while driving
- **Interactive Map** - See all 13 bridges across 4 regions at a glance

### Coverage Area

- **St. Catharines** - Highway 20, Glendale Ave, Queenston St, Lakeshore Rd, Carlton St
- **Port Colborne** - Clarence St, Main St, Mellanby Ave
- **Montreal** - Ste-Catherine, Victoria Downstream, Victoria Upstream
- **Beauharnois** - Larocque Bridge, St-Louis-de-Gonzague

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Mapbox GL](https://www.mapbox.com/) - Interactive maps
- [Vercel Analytics](https://vercel.com/analytics) - Web analytics & speed insights

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
NEXT_PUBLIC_MAPBOX_STYLE=mapbox://styles/mapbox/dark-v11
```

## Build

```bash
npm run build
```

## Deployment

This site is deployed on [Vercel](https://vercel.com). Push to `main` to trigger automatic deployments.

## License

All rights reserved.
