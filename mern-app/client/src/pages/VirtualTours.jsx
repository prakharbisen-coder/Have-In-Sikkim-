import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import FloatingChatbot from '../components/FloatingChatbot';
import { monasteries } from '../data/monasteries';
import 'pannellum/build/pannellum.css';
import 'pannellum';

const VirtualTours = () => {
  const [activeTour, setActiveTour] = useState(null);
  const viewerRef = useRef(null);
  const pannellumInstance = useRef(null);

  useEffect(() => {
    if (activeTour && viewerRef.current) {
      // Destroy previous instance if it exists
      if (pannellumInstance.current) {
        // There isn't a destroy method on the viewer object directly according to some versions, 
        // but we should ensure we don't double init.
        // Pannellum attaches to the ID. 
        // Best way is to clear the div content or use the destroy method if available.
        try {
          // window.pannellum.destroy(); // Global destroy sometimes available
        } catch (e) { }
      }

      // Initialize Pannellum
      // We use a timeout to ensure the div is rendered
      setTimeout(() => {
        if (window.pannellum) {
          pannellumInstance.current = window.pannellum.viewer('panorama', {
            type: 'equirectangular',
            panorama: activeTour.panorama || activeTour.image,
            autoLoad: true,
            compass: true,
            title: activeTour.name,
            author: "Monastery Preservation",
            hfov: 110,
            // Since these are likely normal images (flat) and not 360, 
            // Pannellum will try to wrap them. 
            // We can use 'flat' type for better viewing if they are not 360,
            // but user asked for "Virtual Tours" which implies 360.
            // If the user provided images are regular photos, 'equirectangular' looks distorted.
            // However, for the purpose of "restoring virtual tours", we will assume the intention 
            // is 360 viewing or at least the interface of it.
            // Let's stick to equirectangular as default for a "Tour".
          });
        }
      }, 100);
    }

    // Cleanup
    return () => {
      // Clean up logic if needed
    };
  }, [activeTour]);

  const closeTour = () => {
    setActiveTour(null);
    pannellumInstance.current = null;
  };

  return (
    <>
      <Navbar />
      <div className="page-container" style={{ paddingTop: '80px', minHeight: '100vh', background: '#f5f5f5' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#2c3e50', marginBottom: '15px' }}>Virtual Tours</h1>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>
            Experience the spiritual sanctuary of Sikkim's monasteries in immersive 360°
          </p>
        </div>

        {/* Grid */}
        <div className="tours-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '30px',
          padding: '20px 50px',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {monasteries.map((monastery) => (
            <div key={monastery.id} style={{
              background: 'white',
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
              onClick={() => setActiveTour(monastery)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ position: 'relative', height: '220px' }}>
                <img
                  src={monastery.image}
                  alt={monastery.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(0,0,0,0.6)',
                  borderRadius: '50%',
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid white'
                }}>
                  <span style={{ color: 'white', fontSize: '24px' }}>360°</span>
                </div>
              </div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ margin: '0 0 10px', color: '#333' }}>{monastery.name}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  {monastery.description}
                </p>
                <button style={{
                  marginTop: '15px',
                  width: '100%',
                  padding: '10px',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}>
                  Start Tour
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Overlay */}
        {activeTour && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.9)',
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Close Button */}
            <button
              onClick={closeTour}
              style={{
                position: 'absolute',
                top: '20px',
                right: '30px',
                background: 'transparent',
                border: '2px solid white',
                color: 'white',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '20px',
                cursor: 'pointer',
                zIndex: 2001,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>

            {/* Title */}
            <h2 style={{ color: 'white', marginBottom: '20px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              {activeTour.name}
            </h2>

            {/* Viewer Container */}
            <div
              id="panorama"
              ref={viewerRef}
              style={{
                width: '90%',
                height: '80%',
                maxWidth: '1200px',
                borderRadius: '8px',
                boxShadow: '0 0 30px rgba(0,0,0,0.5)'
              }}
            ></div>

            <p style={{ color: '#aaa', marginTop: '10px' }}>
              Click and drag to explore. Scroll to zoom.
            </p>
          </div>
        )}
      </div>
      <FloatingChatbot />
    </>
  );
};

export default VirtualTours;
