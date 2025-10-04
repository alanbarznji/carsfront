import React from 'react';
import { Home, RefreshCw, ArrowLeft } from 'lucide-react';

export default function ErrorPage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    // In a real app, this would navigate to your home page
    console.log('Navigate to home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4" style={{backgroundColor: '#1A1A1A'}}>
      <div className="max-w-md w-full text-center">
        {/* Animated error icon */}
        <div className="mb-8 relative">
          <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-2xl animate-pulse" style={{background: 'linear-gradient(135deg, #FFD700, #F7C52D)'}}>
            <span className="text-6xl font-bold" style={{color: '#2D2D2D'}}>!</span>
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full animate-bounce" style={{backgroundColor: '#FFD700'}}></div>
        </div>

        {/* Error content */}
        <div className="backdrop-blur-lg rounded-2xl p-8 shadow-2xl border" style={{backgroundColor: 'rgba(45, 45, 45, 0.9)', borderColor: 'rgba(255, 255, 255, 0.1)'}}>
          <h1 className="text-6xl font-bold mb-4 animate-fade-in" style={{color: '#FFFFFF'}}>
            Oops!
          </h1>
          
          <h2 className="text-2xl font-semibold mb-2" style={{color: '#FFFFFF'}}>
            Something went wrong
          </h2>
          
          <p className="mb-8 leading-relaxed" style={{color: '#FFFFFF', opacity: '0.8'}}>
            We encountered an unexpected error. Don't worry, our team has been notified and we're working on fixing it.
          </p>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={handleRefresh}
              className="w-full font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #F7C52D)',
                color: '#2D2D2D'
              }}
              onMouseEnter={(e) => e.target.style.background = 'linear-gradient(135deg, #F7C52D, #FFD700)'}
              onMouseLeave={(e) => e.target.style.background = 'linear-gradient(135deg, #FFD700, #F7C52D)'}
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleGoBack}
                className="font-medium py-2.5 px-4 rounded-lg transition-all duration-300 backdrop-blur-sm border flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'rgba(45, 45, 45, 0.8)',
                  borderColor: 'rgba(255, 215, 0, 0.3)',
                  color: '#FFFFFF'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(45, 45, 45, 1)';
                  e.target.style.borderColor = 'rgba(255, 215, 0, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(45, 45, 45, 0.8)';
                  e.target.style.borderColor = 'rgba(255, 215, 0, 0.3)';
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
              
              <button
                onClick={handleGoHome}
                className="font-medium py-2.5 px-4 rounded-lg transition-all duration-300 backdrop-blur-sm border flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'rgba(45, 45, 45, 0.8)',
                  borderColor: 'rgba(255, 215, 0, 0.3)',
                  color: '#FFFFFF'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(45, 45, 45, 1)';
                  e.target.style.borderColor = 'rgba(255, 215, 0, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(45, 45, 45, 0.8)';
                  e.target.style.borderColor = 'rgba(255, 215, 0, 0.3)';
                }}
              >
                <Home className="w-4 h-4" />
                Home
              </button>
            </div>
          </div>

          {/* Error code */}
          <div className="mt-6 pt-4 border-t" style={{borderColor: 'rgba(255, 215, 0, 0.2)'}}>
            <p className="text-xs" style={{color: 'rgba(255, 255, 255, 0.6)'}}>
              Error Code: ERR_UNEXPECTED_500
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-2 h-2 rounded-full animate-ping opacity-75" style={{backgroundColor: '#FFD700'}}></div>
        <div className="absolute top-40 right-16 w-1 h-1 rounded-full animate-ping opacity-50" style={{backgroundColor: '#F7C52D', animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-20 w-1.5 h-1.5 rounded-full animate-ping opacity-60" style={{backgroundColor: '#FFD700', animationDelay: '0.5s'}}></div>
      </div>
    </div>
  );
}