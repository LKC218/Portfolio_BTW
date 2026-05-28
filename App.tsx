
import React, { useState, useEffect } from 'react';
import { COLLECTIONS, getScenesForCollection } from './constants';
import { Scene, Collection, AppState, Hotspot } from './types';
import GridOverlay from './components/GridOverlay';
import Gallery from './components/Gallery';
import SceneViewer from './components/SceneViewer';
import AudioPlayer from './components/AudioPlayer';
import HomeSelection from './components/HomeSelection';
import ThemeToggle from './components/ThemeToggle';

const App: React.FC = () => {
  // Start at HOME directly
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  
  // Theme State
  const [isDark, setIsDark] = useState(true);

  // Toggle Theme
  const toggleTheme = () => {
      setIsDark(prev => !prev);
  };

  // Apply Theme Class
  useEffect(() => {
      if (isDark) {
          document.documentElement.classList.add('dark');
      } else {
          document.documentElement.classList.remove('dark');
      }
  }, [isDark]);
  
  // Ambient Color State (Driven by Hover in Gallery/Home or Selection in Viewer)
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  
  // Hotspot Focus State (Driven by SceneViewer interaction)
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  // Transition State Management
  const [transitionStatus, setTransitionStatus] = useState<'idle' | 'in' | 'out'>('idle');
  const [transitionColor, setTransitionColor] = useState<string>('#fff');

  // Determine current background ambient color
  // Priority: Hovered Color -> Selected Scene Color -> Selected Collection Color -> Default Cyan
  const currentAmbientColor = hoveredColor || selectedScene?.color || selectedCollection?.color || null;

  // Shared function to handle navigation with slide transition
  const navigate = (targetState: AppState, targetScene: Scene | null, color: string) => {
    setTransitionColor(color);
    setTransitionStatus('in');

    // Reset hotspot when navigating
    setActiveHotspot(null);

    // Wait for slide-in to complete (matches CSS duration + delay)
    setTimeout(() => {
        setAppState(targetState);
        setSelectedScene(targetScene);
        
        // Reset hover state if navigation completes
        setHoveredColor(null);

        // Start slide-out
        setTransitionStatus('out');

        // Cleanup after slide-out completes
        setTimeout(() => {
            setTransitionStatus('idle');
        }, 700);
    }, 700);
  };

  const handleSelectCollection = (collection: Collection) => {
    setSelectedCollection(collection);
    navigate(AppState.GALLERY, null, collection.color);
  };

  const handleSelectScene = (scene: Scene) => {
      // Use the specific scene transition color (if defined in DB) or fall back to scene main color
      const tColor = scene.transitionColor || scene.color;
      navigate(AppState.VIEWER, scene, tColor);
  };

  const handleBackToGallery = () => {
      // Use collection color for transition back to gallery
      const color = selectedCollection ? selectedCollection.color : '#fff';
      navigate(AppState.GALLERY, null, color);
  };

  const handleBackToHome = () => {
      setSelectedCollection(null);
      navigate(AppState.HOME, null, '#fff');
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background overflow-hidden transition-colors duration-500">
      {/* Global Transition Styles */}
      <style>{`
        @keyframes slide-in {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0%); }
        }
        @keyframes slide-out {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>

      {/* Full Screen Transition Overlay */}
      {transitionStatus !== 'idle' && (
        <div className="fixed inset-0 z-[100] pointer-events-none flex flex-col">
            <div 
                className="absolute inset-0 z-[102] bg-surface"
                style={{
                    transform: 'translateX(100%)',
                    animation: transitionStatus === 'in' 
                        ? 'slide-in 0.5s cubic-bezier(0.87, 0, 0.13, 1) forwards'
                        : 'slide-out 0.5s cubic-bezier(0.87, 0, 0.13, 1) forwards'
                }}
            />
            <div 
                className="absolute inset-0 z-[101] bg-[--t-color]"
                style={{
                    '--t-color': transitionColor,
                    transform: 'translateX(100%)',
                    animation: transitionStatus === 'in'
                        ? 'slide-in 0.6s cubic-bezier(0.87, 0, 0.13, 1) forwards 0.05s' 
                        : 'slide-out 0.6s cubic-bezier(0.87, 0, 0.13, 1) forwards 0.05s'
                } as React.CSSProperties}
            />
             <div 
                className="absolute inset-0 z-[100] bg-background"
                style={{
                    transform: 'translateX(100%)',
                    animation: transitionStatus === 'in'
                        ? 'slide-in 0.6s cubic-bezier(0.87, 0, 0.13, 1) forwards' 
                        : 'slide-out 0.6s cubic-bezier(0.87, 0, 0.13, 1) forwards'
                } as React.CSSProperties}
            />
        </div>
      )}

      {/* Background visual elements are persistent and reactive to both Hover and Hotspot Selection */}
      <GridOverlay 
        accentColor={currentAmbientColor} 
        hotspotFocus={activeHotspot ? { x: activeHotspot.x, y: activeHotspot.y } : null}
      />
      
      {/* Main Content Area */}
      <main className="relative z-10 w-full h-full">
        {appState === AppState.HOME && (
            <HomeSelection 
                collections={COLLECTIONS} 
                onSelect={handleSelectCollection}
                onHover={(color) => setHoveredColor(color)}
            />
        )}

        {appState === AppState.GALLERY && selectedCollection && (
            <Gallery 
                scenes={getScenesForCollection(selectedCollection.id)} 
                collection={selectedCollection}
                onSelect={handleSelectScene} 
                onHover={(color) => setHoveredColor(color)}
                onBack={handleBackToHome}
            />
        )}

        {appState === AppState.VIEWER && selectedScene && (
            <SceneViewer 
                scene={selectedScene} 
                onBack={handleBackToGallery} 
                onHotspotSelect={setActiveHotspot}
            />
        )}
      </main>

      {/* Persistent UI Controls */}
      <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
      <AudioPlayer />

      {/* Persistent global UI */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="h-1 w-24 bg-border/20 overflow-hidden">
              <div className="h-full w-1/2 bg-foreground/30 animate-[shimmer_2s_infinite]"></div>
          </div>
      </div>
    </div>
  );
};

export default App;
