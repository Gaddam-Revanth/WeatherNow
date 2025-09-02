# Weather Now

"Weather Now" is a modern, responsive web application built with Next.js that provides real-time weather information for any city worldwide. It leverages the Open-Meteo API for accurate weather data and geocoding, offering a seamless and intuitive user experience.

## FeaturesC:\Users\Revanth\Downloads\WeatherNow\public\Working Video.mp4

- **Real-time Weather Data**: Get current weather conditions, temperature, humidity, wind speed, and more.
- **City Search**: Easily search for weather information by city name.
- **Popular Cities**: Quick access to weather data for popular global cities.
- **Responsive Design**: Optimized for various devices, from desktops to mobile phones.
- **Interactive UI**: Smooth animations and a clean interface powered by Framer Motion and Radix UI components.
- **Error Handling**: Robust error handling and user-friendly messages for a better experience.
- **Themed UI**: Dynamic background gradients based on weather conditions.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4, shadcn/ui, Lucide React (icons)
- **Animations**: Framer Motion
- **Data Fetching**: TanStack Query (React Query), Axios
- **State Management**: React's `useState`, Zustand
- **Weather API**: Open-Meteo API (for weather data and geocoding)

## Quick Start

Follow these steps to get the project up and running on your local machine.

### Prerequisites

Make sure you have the following installed:
- Node.js (v18.x or higher)
- npm or Yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/weather-now.git
   cd weather-now
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Open-Meteo API key (if required, though Open-Meteo is often free for basic usage):
   ```
   # No API key is typically required for Open-Meteo's public endpoints.
   # If you use a different weather API, configure its key here.
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build and Deploy

To build the application for production:

```bash
npm run build
# or
yarn build
```

To start the production server:

```bash
npm run start
# or
yarn start
```

## Project Structure

```
weather-now/
├── public/                   # Static assets (images, icons)
├── src/
│   ├── app/                  # Next.js App Router pages and API routes
│   │   ├── api/              # API routes (e.g., /api/weather)
│   │   ├── favicon.ico
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Main application page
│   ├── components/           # Reusable UI components
│   │   ├── providers.tsx     # Context providers (e.g., TanStack QueryProvider)
│   │   └── ui/               # shadcn/ui components
│   ├── hooks/                # Custom React hooks (e.g., useWeather)
│   │   ├── use-mobile.ts
│   │   ├── use-toast.ts
│   │   └── useWeather.ts
│   └── lib/                  # Utility functions and configurations
│       ├── db.ts
│       ├── socket.ts
│       └── utils.ts
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
├── next.config.ts            # Next.js configuration
├── package.json              # Project dependencies and scripts
└── README.md                 # Project documentation
```

## Usage

- Enter a city name in the search bar and press Enter or click the search button to get its weather.
- Click on popular city suggestions for quick weather lookups.
- Observe dynamic background changes based on weather conditions.
- Enjoy a smooth and responsive experience across all devices.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue if you find any bugs or have suggestions for improvements.

## License

This project is open source and available under the [MIT License](LICENSE). (Assuming MIT License, add LICENSE file if not present)
