
import React, { useState, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { COLLECTIONS, PRELOAD_ASSETS, getScenesForCollection } from './constants';
import { Scene, Collection, AppState, Hotspot } from './types';
import GridOverlay from './components/layout/GridOverlay';
import Gallery from './components/pages/Gallery';
import SceneViewer from './components/pages/SceneViewer';
import AudioPlayer from './components/layout/AudioPlayer';
import HomeSelection from './components/pages/HomeSelection';
import CustomCursor from './components/layout/CustomCursor';
import Preloader from './components/layout/Preloader';

const App: React.FC = () => {
  // Start at HOME directly
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [isSharedTitleTransitioning, setIsSharedTitleTransitioning] = useState(false);
  const sharedTitleCloneRef = useRef<HTMLElement | null>(null);
  
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

  const handleSelectCollection = useCallback((collection: Collection) => {
    setSelectedCollection(collection);
    navigate(AppState.GALLERY, null, collection.color);
  }, [navigate]);

  const handleSelectScene = useCallback((scene: Scene) => {
      const tColor = scene.transitionColor || scene.color;
      navigate(AppState.VIEWER, scene, tColor);
  }, [navigate]);

  const handleBackToGallery = useCallback(() => {
      const color = selectedCollection ? selectedCollection.color : '#fff';
      navigate(AppState.GALLERY, null, color);
  }, [navigate, selectedCollection]);

  const handleBackToHome = useCallback(() => {
      setSelectedCollection(null);
      navigate(AppState.HOME, null, '#fff');
  }, [navigate]);

  const clearSharedTitleClone = useCallback(() => {
      if (!sharedTitleCloneRef.current) return;
      sharedTitleCloneRef.current.remove();
      sharedTitleCloneRef.current = null;
  }, []);

  const handleSharedTitleBackToHome = useCallback((sourceElement: HTMLElement) => {
      if (isSharedTitleTransitioning || appState === AppState.HOME) return;

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
          handleBackToHome();
          return;
      }

      clearSharedTitleClone();
      setIsSharedTitleTransitioning(true);
      setActiveHotspot(null);
      setHoveredColor(null);

      const sourceRect = sourceElement.getBoundingClientRect();
      const clone = sourceElement.cloneNode(true) as HTMLElement;
      const previousVisibility = sourceElement.style.visibility;

      sourceElement.style.visibility = 'hidden';
      clone.setAttribute('aria-hidden', 'true');
      clone.style.position = 'fixed';
      clone.style.left = `${sourceRect.left}px`;
      clone.style.top = `${sourceRect.top}px`;
      clone.style.width = `${sourceRect.width}px`;
      clone.style.height = `${sourceRect.height}px`;
      clone.style.margin = '0';
      clone.style.zIndex = '250';
      clone.style.pointerEvents = 'none';
      clone.style.transformOrigin = 'left top';
      clone.style.willChange = 'transform, opacity, filter';
      clone.style.contain = 'layout paint';
      document.body.appendChild(clone);
      sharedTitleCloneRef.current = clone;

      const peakScale = window.innerWidth < 768 ? 1.25 : 1.75;
      const settleScale = window.innerWidth < 768 ? 0.72 : 0.86;
      const peakX = Math.max(24, window.innerWidth * 0.05);
      const peakY = Math.max(28, window.innerHeight * 0.16);
      const settleX = Math.max(24, window.innerWidth * 0.06);
      const settleY = Math.max(24, window.innerHeight * 0.08);
      const peakDeltaX = peakX - sourceRect.left;
      const peakDeltaY = peakY - sourceRect.top;
      const settleDeltaX = settleX - sourceRect.left;
      const settleDeltaY = settleY - sourceRect.top;
      const galleryRoot = document.querySelector('[data-gallery-root]');

      const tl = gsap.timeline({
          defaults: { ease: 'expo.inOut' },
          onComplete: () => {
              sourceElement.style.visibility = previousVisibility;
              setSelectedCollection(null);
              setSelectedScene(null);
              setAppState(AppState.HOME);
              setTransitionStatus('idle');
              clearSharedTitleClone();
              setIsSharedTitleTransitioning(false);
          }
      });

      tl.to(clone, {
          x: peakDeltaX,
          y: peakDeltaY,
          scale: peakScale,
          color: '#CCFF00',
          filter: 'drop-shadow(0 0 18px rgba(204,255,0,0.45))',
          duration: 0.82
      })
      .to(clone, {
          x: settleDeltaX,
          y: settleDeltaY,
          scale: settleScale,
          opacity: 0,
          filter: 'blur(6px)',
          duration: 0.38,
          ease: 'power3.in'
      }, 0.78)
      .to(galleryRoot, {
          opacity: 0,
          scale: 0.985,
          filter: 'brightness(0.55) blur(2px)',
          duration: 0.72,
          ease: 'power3.inOut'
      }, 0.08)
      .to('.gallery-card', {
          yPercent: 5,
          opacity: 0,
          duration: 0.58,
          stagger: 0.035,
          ease: 'power3.in'
      }, 0.12);
  }, [appState, clearSharedTitleClone, handleBackToHome, isSharedTitleTransitioning]);

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background transition-colors duration-500">
      {!isPreloaderComplete && (
        <Preloader
          title="作品集"
          assets={PRELOAD_ASSETS}
          onComplete={() => setIsPreloaderComplete(true)}
        />
      )}


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
                onSharedTitleBack={handleSharedTitleBackToHome}
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
      <AudioPlayer />
      <CustomCursor />

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
