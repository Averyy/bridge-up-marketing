# Bridge Up

Marketing website for **Bridge Up** - a real-time bridge status app for the St. Lawrence Seaway region.

## About Bridge Up

Never wait at a closed bridge again. Bridge Up provides real-time bridge status and reopening predictions for lift bridges across Ontario and Quebec.

### Key Features

- **Real-time Status** - Know instantly whether a bridge is open, closed, or closing soon
- **Predictive Reopening Times** - Predictions based on 300+ analyzed closures per bridge with 95% confidence intervals
- **CarPlay Support** - Glanceable bridge status while driving
- **Interactive Map** - See all 15 bridges across 5 regions at a glance
- **Always Free** - No subscriptions, no paywalls

### Coverage Area

- **St. Catharines** - Highway 20, Glendale Ave, Queenston St, Lakeshore Rd, Carlton St
- **Port Colborne** - Clarence St, Main St, Mellanby Ave
- **Montreal** - Ste-Catherine, Victoria Downstream, Victoria Upstream
- **Beauharnois** - Larocque Bridge, St-Louis-de-Gonzague
- **Kahnawake** - CP Railway Bridge 7A, CP Railway Bridge 7B

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
