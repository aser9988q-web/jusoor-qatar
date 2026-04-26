import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function BookingPage() {
  const [location] = useLocation();

  useEffect(() => {
    // Extract the path after /booking-page
    const path = location.replace('/booking-page', '');
    
    // Redirect to the static HTML file
    if (path) {
      window.location.href = path;
    }
  }, [location]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Redirecting to booking page...</p>
    </div>
  );
}
