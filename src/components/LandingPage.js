import React, { useEffect, useRef, useState } from 'react';
import FallbackLanding from './FallbackLanding';

const LandingPage = ({ onEnterApp }) => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load Three.js and Vanta.js with error handling for SSR
    const loadScripts = async () => {
      // Skip script loading during SSR
      if (typeof window === 'undefined') {
        setIsLoading(false);
        return;
      }

      try {
        // Load Three.js
        if (!window.THREE) {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js');
        }
        
        // Load Vanta Clouds
        if (!window.VANTA) {
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.24/vanta.clouds.min.js');
        }

        // Initialize Vanta effect with error handling
        if (vantaRef.current && window.VANTA && window.VANTA.CLOUDS) {
          try {
            const effect = window.VANTA.CLOUDS({
              el: vantaRef.current,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.00,
              minWidth: 200.00,
              speed: 0.70,
              cloudShadows: true,
              backgroundColor: 0x1a1a2e,
              skyColor: 0x68b8d7,
              cloudColor: 0xadc1de,
              sunColor: 0xff9919,
              sunGlareColor: 0xff6633
            });
            setVantaEffect(effect);
          } catch (vantaError) {
            console.warn('Vanta effect failed to initialize:', vantaError);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load Vanta.js:', error);
        setIsLoading(false);
      }
    };

    loadScripts();

    // Cleanup
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  // If Vanta fails to load or we're on a slow connection, show fallback
  const shouldShowFallback = isLoading === false && (!vantaEffect || typeof window === 'undefined');
  
  if (shouldShowFallback && !vantaEffect) {
    return <FallbackLanding onEnterApp={onEnterApp} />;
  }

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const handleEnterApp = () => {
    // Add smooth transition effect
    const landing = document.getElementById('landing-page');
    if (landing) {
      landing.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
      landing.style.opacity = '0';
      landing.style.transform = 'scale(1.1)';
      setTimeout(() => {
        onEnterApp();
      }, 1000);
    } else {
      onEnterApp();
    }
  };

  return (
    <div 
      id="landing-page"
      ref={vantaRef} 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin w-12 h-12 border-3 border-white border-t-transparent rounded-full mx-auto mb-6"></div>
            <div className="text-xl font-medium">Loading immersive experience...</div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12">
          {/* Main Logo/Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse-slow">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              {/* Floating particles */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-1 -left-2 w-3 h-3 bg-blue-300 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Main Tagline */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">
            Weather Like
          </h1>
          <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-400 bg-clip-text text-transparent animate-fade-in" style={{animationDelay: '0.3s'}}>
            No Other
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-4 font-light animate-fade-in" style={{animationDelay: '0.6s'}}>
            Immersive • Interactive • Intelligent
          </p>
          <p className="text-lg md:text-xl text-white/70 mb-12 font-light animate-fade-in" style={{animationDelay: '0.9s'}}>
            Experience weather through satellite imagery, AI presentation, and cinematic design
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 animate-fade-in" style={{animationDelay: '1.2s'}}>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-4xl mb-4">🛰️</div>
            <h3 className="text-xl font-semibold mb-2">Fullscreen Satellite</h3>
            <p className="text-white/80 text-sm">Real-time satellite imagery with interactive weather layers</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-4xl mb-4">👩‍💼</div>
            <h3 className="text-xl font-semibold mb-2">AI Presenter</h3>
            <p className="text-white/80 text-sm">Female weather presenter with smart animations</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2">Touch Optimized</h3>
            <p className="text-white/80 text-sm">Swipe gestures and responsive design for all devices</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="animate-fade-in" style={{animationDelay: '1.5s'}}>
          <button
            onClick={handleEnterApp}
            className="group relative overflow-hidden bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 text-white font-bold py-4 px-12 rounded-full text-xl transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-purple-300 shadow-2xl"
          >
            <span className="relative z-10 flex items-center space-x-3">
              <span>Experience Weather AI</span>
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          <p className="mt-6 text-white/60 text-sm">
            No signup required • Free to explore • Works on all devices
          </p>
        </div>

        {/* Interactive Hint */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <div className="text-center">
            <div className="text-2xl mb-2">☁️</div>
            <p className="text-sm">Move your mouse to interact with clouds</p>
          </div>
        </div>
      </div>

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20 pointer-events-none"></div>

      {/* Floating Weather Icons */}
      <div className="absolute top-20 left-10 text-4xl animate-pulse" style={{animationDelay: '2s'}}>☀️</div>
      <div className="absolute top-32 right-20 text-3xl animate-pulse" style={{animationDelay: '3s'}}>🌧️</div>
      <div className="absolute bottom-40 left-20 text-3xl animate-pulse" style={{animationDelay: '4s'}}>❄️</div>
      <div className="absolute bottom-60 right-16 text-2xl animate-pulse" style={{animationDelay: '5s'}}>🌪️</div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .border-3 {
          border-width: 3px;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;