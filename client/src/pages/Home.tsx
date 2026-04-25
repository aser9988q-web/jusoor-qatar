import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4">
      {/* Main Container */}
      <div className="max-w-2xl w-full text-center space-y-12">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-100 rounded-full">
              <Globe className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900">
            Panama Canal Tours
          </h1>
          
          <p className="text-xl text-gray-600">
            Discover the wonders of the Panama Canal with our premium tour experiences
          </p>
        </div>

        {/* Language Selection */}
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Select Your Language
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* English Button */}
            <a href="/en/index.html" className="block">
              <Button 
                className="w-full h-16 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                🇺🇸 English
              </Button>
            </a>

            {/* Spanish Button */}
            <a href="/es/index.html" className="block">
              <Button 
                className="w-full h-16 text-lg font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                🇪🇸 Español
              </Button>
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-200">
          <div className="space-y-2">
            <div className="text-3xl">🚢</div>
            <h3 className="font-semibold text-gray-900">Boat Tours</h3>
            <p className="text-sm text-gray-600">Experience the locks and transits</p>
          </div>
          
          <div className="space-y-2">
            <div className="text-3xl">🚁</div>
            <h3 className="font-semibold text-gray-900">Air Tours</h3>
            <p className="text-sm text-gray-600">Aerial views of the canal</p>
          </div>
          
          <div className="space-y-2">
            <div className="text-3xl">🗺️</div>
            <h3 className="font-semibold text-gray-900">Guided Tours</h3>
            <p className="text-sm text-gray-600">Expert-led city and canal tours</p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>© 2026 Panama Canal Tours. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
