import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import FullscreenWeatherMap from './components/FullscreenWeatherMap';
import ZipCodeModal from './components/ZipCodeModal';
import WeatherLayers from './components/WeatherLayers';
import MobilePresenter from './components/MobilePresenter';
import ErrorBoundary from './components/ErrorBoundary';
import { weatherService } from './services/weatherService';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState([40.7128, -74.0060]); // Default: NYC
  const [showZipModal, setShowZipModal] = useState(false);
  const [currentLayer, setCurrentLayer] = useState('satellite'); // satellite, rain, forecast
  const [showPresenter, setShowPresenter] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  
  // Check orientation and screen size for presenter
  useEffect(() => {
    const checkOrientation = () => {
      const isLandscape = window.innerHeight < window.innerWidth;
      const isMobile = window.innerWidth <= 768;
      setShowPresenter(isLandscape && isMobile);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    
    // Custom event listener for closing presenter
    const handleClosePresenter = () => setShowPresenter(false);
    window.addEventListener('close-presenter', handleClosePresenter);

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
      window.removeEventListener('close-presenter', handleClosePresenter);
    };
  }, []);

  // Get user's current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates([latitude, longitude]);
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.warn('Location access denied:', error);
          // Fallback to NYC weather
          fetchWeatherByCoords(40.7128, -74.0060);
        }
      );
    }
  }, []);

  // Listen for geolocation updates
  useEffect(() => {
    const handleGeolocationUpdate = (event) => {
      const { lat, lon } = event.detail;
      setCoordinates([lat, lon]);
      fetchWeatherByCoords(lat, lon);
    };

    window.addEventListener('geolocation-update', handleGeolocationUpdate);
    return () => window.removeEventListener('geolocation-update', handleGeolocationUpdate);
  }, []);

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await weatherService.getWeatherByCoords(lat, lon);
      setWeatherData(data);
      setLocation(data.location.name);
      setCoordinates([lat, lon]);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByZip = async (zipCode) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await weatherService.getWeatherByZip(zipCode);
      setWeatherData(data);
      setLocation(data.location.name);
      setCoordinates([data.location.lat, data.location.lon]);
      setShowZipModal(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSubmit = (zipCode) => {
    if (zipCode.trim()) {
      fetchWeatherByZip(zipCode.trim());
    }
  };

  const handleMapClick = (lat, lon) => {
    fetchWeatherByCoords(lat, lon);
  };

  const handleLayerSwipe = (direction) => {
    const layers = ['satellite', 'rain', 'forecast'];
    const currentIndex = layers.indexOf(currentLayer);
    
    if (direction === 'left' && currentIndex < layers.length - 1) {
      setCurrentLayer(layers[currentIndex + 1]);
    } else if (direction === 'right' && currentIndex > 0) {
      setCurrentLayer(layers[currentIndex - 1]);
    }
  };

  // Show landing page first
  if (showLanding) {
    return (
      <ErrorBoundary>
        <LandingPage onEnterApp={() => setShowLanding(false)} />
      </ErrorBoundary>
    );
  }

  // Show mobile presenter in landscape mode
  if (showPresenter) {
    return (
      <ErrorBoundary>
        <MobilePresenter 
          weatherData={weatherData}
          isVisible={showPresenter}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="h-screen w-screen overflow-hidden bg-gray-900">
        {/* Fullscreen Map */}
        <FullscreenWeatherMap
          coordinates={coordinates}
          weatherData={weatherData}
          currentLayer={currentLayer}
          onLocationSelect={handleMapClick}
          onLayerSwipe={handleLayerSwipe}
          loading={loading}
          error={error}
          location={location}
        />

        {/* ZIP Code Tab - Top Corner */}
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => setShowZipModal(true)}
            className="bg-black/20 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-xl font-medium hover:bg-black/30 transition-all duration-200 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>ZIP</span>
          </button>
        </div>

        {/* Weather Layers Component */}
        <WeatherLayers
          currentLayer={currentLayer}
          weatherData={weatherData}
          coordinates={coordinates}
          onLayerChange={setCurrentLayer}
        />

        {/* ZIP Code Modal */}
        <ZipCodeModal
          isOpen={showZipModal}
          onClose={() => setShowZipModal(false)}
          onSubmit={handleLocationSubmit}
          loading={loading}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;