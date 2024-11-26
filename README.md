# MapBuilder - Property Development Visualization Tool

MapBuilder is a web application that helps users visualize and analyze potential property development opportunities. It combines Google Maps with 3D visualization to display parcel data, zoning information, and buildable area calculations.

## Features

- Interactive 3D map visualization
- Address search functionality
- Parcel data visualization with color-coding:
  - Green: Empty plots available for development
  - Red: Occupied plots
  - Blue: Selected parcels
- Detailed property analysis including:
  - Lot size
  - Required setbacks
  - Maximum building height
  - Floor Area Ratio (FAR)
  - Maximum buildable area
- Map controls for rotation, tilt, and zoom
- Integration with Lightbox API for parcel and zoning data

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v18.0.0 or higher)
- npm (comes with Node.js)
- A Google Maps API key
- A Lightbox API key

## Installation

1. Clone the repository:
git clone https://github.com/yourusername/mapbuilder.git
cd mapbuilder


2. Install dependencies:
npm install

3. Install depedencies in the server:
cd mapbuilder-server
npm install

4. update enivornmental variables:
update the .env in the root directory:
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key (make sure you enable javascript google maps api)

update the .env in the server directory:
LIGHTBOX_API_KEY=your_lightbox_api_key
PORT=3001

5. update the vector ID in MapComponent.jsx:
start the root directory (MapBuilder)
cd src
cd components
cd Map
#you will find MapComponent.jsx in the Map folder#
update line 35 with the vector Map ID (go to Google Maps Platform. Click on Map management on the right hand side and create a new map ID. Map type should be javscript and the map should be a vector Map)


## Running the Application

The application consists of both a frontend and backend server.

1. Start the backend server:
node server.js (you could also cd into the backend server and do npm run dev)


2. In a new terminal, start the frontend development server:
npm run dev


The application should now be running at `http://localhost:5173`

## Project Structure

```
mapbuilder/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   └── Map/
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   ├── buildableArea.js
│   │   └── geometry.js
│   └── constants/
│       └── colors.js
├── server/
│   ├── routes/
│   ├── controllers/
│   └── config/
└── public/
```

## Technology Stack

- Frontend:
  - React
  - Vite
  - Three.js
  - @react-google-maps/api
  - Tailwind CSS
- Backend:
  - Node.js
  - Express
  - Lightbox API Integration

## Development

### Available Scripts

- npm run dev: Start the development server
- npm run build: Build the application for production
- npm run preview: Preview the production build
- npm run lint: Run ESLint for code quality

### Environment Variables

The following environment variables are required:

- VITE_GOOGLE_MAPS_API_KEY: Your Google Maps API key
- LIGHTBOX_API_KEY: Your Lightbox API key
- PORT: Backend server port (default: 3001)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Troubleshooting

### Common Issues

1. **Map not loading:**
   - Verify your Google Maps API key is correct
   - Check if the API key has the necessary permissions
   - Ensure you're not hitting API quota limits

2. **Parcel data not appearing:**
   - Confirm your Lightbox API key is valid
   - Check the backend server logs for API errors
   - Verify the backend server is running on the correct port

3. **3D visualization issues:**
   - Ensure WebGL is enabled in your browser
   - Update your graphics drivers
   - Try using a different browser

### Support

For support, please open an issue in the GitHub repository or contact the maintainers.
