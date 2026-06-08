import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, MeshDistortMaterial, useGLTF, Html } from '@react-three/drei';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';

interface ModelViewerProps {
  accentColor: string;
  modelUrl?: string;
  className?: string;
  showHud?: boolean;
  hudPadding?: string;
}

function PlaceholderModel({ accentColor }: { accentColor: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
      meshRef.current.rotation.x += delta * 0.1;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y += delta * 0.3;
      wireRef.current.rotation.x += delta * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group>
        <mesh ref={meshRef}>
          <dodecahedronGeometry args={[1.5, 1]} />
          <MeshDistortMaterial
            color={accentColor}
            roughness={0.2}
            metalness={0.8}
            distort={0.15}
            speed={2}
            envMapIntensity={0.5}
          />
        </mesh>
        <mesh ref={wireRef}>
          <dodecahedronGeometry args={[1.65, 1]} />
          <meshBasicMaterial color={accentColor} wireframe opacity={0.15} transparent />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.2, 2.25, 64]} />
          <meshBasicMaterial color={accentColor} opacity={0.3} transparent />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.6, 2.63, 64]} />
          <meshBasicMaterial color={accentColor} opacity={0.1} transparent />
        </mesh>
      </group>
    </Float>
  );
}

function LoadedModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  const { position, scale } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = maxDim > 0 ? 3 / maxDim : 1;
    return {
      position: [-center.x * s, -center.y * s, -center.z * s] as [number, number, number],
      scale: s,
    };
  }, [scene]);

  return (
    <group position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

function SceneContent({ resolvedUrl, accentColor }: { resolvedUrl: string | null; accentColor: string }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, 3, -5]} intensity={0.3} color={accentColor} />

      <Suspense fallback={
        <Html center>
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: accentColor, borderTopColor: 'transparent' }} />
            <span className="font-mono text-[9px] text-muted uppercase tracking-widest">加载模型...</span>
          </div>
        </Html>
      }>
        {resolvedUrl ? (
          <LoadedModel url={resolvedUrl} />
        ) : (
          <PlaceholderModel accentColor={accentColor} />
        )}
      </Suspense>

      <GridFloor accentColor={accentColor} />
    </>
  );
}

function GridFloor({ accentColor }: { accentColor: string }) {
  return (
    <group position={[0, -2.5, 0]}>
      <gridHelper args={[20, 20, accentColor, accentColor]} />
    </group>
  );
}

function useResolvedModelUrl(modelUrl?: string): string | null {
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const checkUrl = async (url: string) => {
      setChecked(false);
      try {
        const response = await fetch(url, { method: 'HEAD', signal: controller.signal });
        if (!active) return;

        const contentType = response.headers.get('content-type') || '';
        setResolvedUrl(response.ok && !contentType.includes('text/html') ? url : null);
      } catch (error) {
        if (!active || controller.signal.aborted) return;
        setResolvedUrl(null);
      }
      setChecked(true);
    };

    if (modelUrl) {
      checkUrl(modelUrl);
    } else {
      setResolvedUrl(null);
      setChecked(true);
    }

    return () => {
      active = false;
      controller.abort();
    };
  }, [modelUrl]);

  if (!modelUrl) return null;
  if (!checked) return null;
  return resolvedUrl;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ accentColor, modelUrl, className = '', showHud = true, hudPadding = '12px' }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const resolvedUrl = useResolvedModelUrl(modelUrl);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const handleChange = () => {
      const azimuthal = controls.getAzimuthalAngle();
      const polar = controls.getPolarAngle();
      setRotation({
        x: parseFloat(((polar * 180) / Math.PI).toFixed(1)),
        y: parseFloat(((azimuthal * 180) / Math.PI).toFixed(1)),
      });
    };

    controls.addEventListener('change', handleChange);
    return () => controls.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className={`relative w-full h-full min-h-0 overflow-hidden ${className}`}>
      <Canvas
        camera={{ position: [3, 2, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <SceneContent resolvedUrl={resolvedUrl} accentColor={accentColor} />

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableDamping
          dampingFactor={0.05}
          minDistance={3}
          maxDistance={12}
          maxPolarAngle={Math.PI / 1.5}
        />

        <Environment preset="city" />
      </Canvas>

      {showHud && (
        <div className="absolute inset-0 pointer-events-none" style={{ padding: hudPadding }}>
          <div className="absolute top-0 left-0 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
            <span className="font-mono text-[9px] text-muted uppercase tracking-widest">3D_VIEWPORT</span>
          </div>

          <div className="absolute top-0 right-0 text-right">
            <div className="font-mono text-[8px] text-muted uppercase">ROT</div>
            <div className="font-mono text-[10px] text-foreground/60">
              X:{rotation.x}° Y:{rotation.y}°
            </div>
          </div>

          <div className="absolute bottom-0 left-0 font-mono text-[8px] text-muted uppercase tracking-widest">
            ORBIT_CTRL
          </div>

          <div className="absolute bottom-0 right-0 font-mono text-[8px] text-muted flex items-center gap-2">
            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: accentColor, opacity: 0.6 }} />
            <span>LIVE</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelViewer;
