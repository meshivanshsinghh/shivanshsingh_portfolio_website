"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import ThreeGlobe from "three-globe";

import countries from "./files/globe-data-min.json";

export default function Globe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const mountedRef = useRef(false);
  const globeRef = useRef<any>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, down: false });
  const rotationRef = useRef({ x: 0, y: 0 });
  const autoRotateRef = useRef<boolean>(true);
  const targetRotationRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current || globeRef.current) return;

    mountedRef.current = true;
    let animationId: number;

    const initGlobe = () => {
      const container = containerRef.current;
      if (!container) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

      if (width === 0 || height === 0) {
        // Container not ready, retry
        requestAnimationFrame(initGlobe);
        return;
      }

      try {
        setLoadingProgress(20);
        
        // Scene setup
        const scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x000000, 400, 2000);
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.z = 280;
        camera.position.x = 0;
        camera.position.y = 0;
        scene.add(camera);

        setLoadingProgress(40);

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        rendererRef.current = renderer;

        if (container) {
          container.innerHTML = '';
          container.appendChild(renderer.domElement);
        }

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xbbbbbb, 0.3);
        scene.add(ambientLight);

        const dLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dLight.position.set(-800, 2000, 400);
        camera.add(dLight);

        const dLight1 = new THREE.DirectionalLight(0x7982f6, 0.7);
        dLight1.position.set(-200, 500, 200);
        camera.add(dLight1);

        const pointLight = new THREE.PointLight(0x8566cc, 0.3);
        pointLight.position.set(-200, 500, 200);
        camera.add(pointLight);

        setLoadingProgress(60);

        // Initialize Globe
        const globe = new ThreeGlobe({
          waitForGlobeReady: true,
          animateIn: true,
        })
          .hexPolygonsData(countries.features)
          .hexPolygonResolution(3)
          .hexPolygonMargin(0.7)
          .showAtmosphere(true)
          .atmosphereColor("#3a228a")
          .atmosphereAltitude(0.15)
          .hexPolygonColor((e: any) => {
            if (e.properties.ISO_A3 === "USA" || e.properties.ISO_A3 === "IND") {
              return "rgba(255,255,255, 1)";
            }
            return "rgba(255,255,255, 0.6)";
          });

        setLoadingProgress(80);

        // Add points for both cities
        const citiesData = [
          {
            lat: 42.3601,
            lng: -71.0589,
            size: 1.2,
            color: '#ffffff'
          },
          {
            lat: 26.8467, // Lucknow
            lng: 80.9462,
            size: 1.2,
            color: '#ffffff'
          }
        ];

        globe
          .pointsData(citiesData)
          .pointColor('color')
          .pointAltitude(0.01)
          .pointRadius('size')
          .pointsMerge(true);

        // Add labels
        globe
          .labelsData([
            {
              lat: 42.3601,
              lng: -71.0589,
              text: "📍 Boston, MA",
              size: 1.3,
              color: '#ffffff'
            },
            {
              lat: 26.8467,
              lng: 80.9462,
              text: "🏠 Lucknow, India",
              size: 1.3,
              color: '#ffffff'
            }
          ])
          .labelColor('color')
          .labelDotRadius(0)
          .labelSize("size")
          .labelText("text")
          .labelResolution(6)
          .labelAltitude(0.02);

        // Journey arc from India to Boston
        const arcsData = [
          {
            startLat: 26.8467, // Lucknow
            startLng: 80.9462,
            endLat: 42.3601, // Boston
            endLng: -71.0589,
            color: ['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.8)']
          }
        ];

        globe
          .arcsData(arcsData)
          .arcColor('color')
          .arcStroke(0.5)
          .arcDashLength(0.6)
          .arcDashGap(0.2)
          .arcDashAnimateTime(2000)
          .arcAltitudeAutoScale(0.3)
          .arcsTransitionDuration(0);

        // Globe material
        const globeMaterial = globe.globeMaterial() as THREE.MeshPhongMaterial;
        globeMaterial.color = new THREE.Color(0x3a228a);
        globeMaterial.emissive = new THREE.Color(0x220038);
        globeMaterial.emissiveIntensity = 0.05;
        globeMaterial.shininess = 0.7;

        setLoadingProgress(90);

        // Start with default view (showing Africa/Europe)
        globe.rotation.y = 0;
        globe.rotation.x = 0;
        
        // Set initial rotation
        rotationRef.current.x = 0;
        rotationRef.current.y = 0;
        
        // Calculate target rotation for Boston
        // Boston coordinates: 42.3601° N, 71.0589° W
        const bostonLng = -71.0589;
        const bostonLat = 42.3601;
        
        // Target rotation to center on Boston
        targetRotationRef.current.y = ((10 - bostonLng) * Math.PI) / 180;
        targetRotationRef.current.x = (bostonLat * Math.PI) / 180 * 0.5;


        scene.add(globe);
        globeRef.current = globe;

        setLoadingProgress(100);

        // Mouse/Touch handlers
        const handleMouseDown = (event: MouseEvent) => {
          autoRotateRef.current = false; // Stop auto-rotation on user interaction
          mouseRef.current.down = true;
          mouseRef.current.x = event.clientX;
          mouseRef.current.y = event.clientY;
          if (container) container.style.cursor = 'grabbing';
        };

        const handleMouseUp = () => {
          mouseRef.current.down = false;
          if (container) container.style.cursor = 'grab';
        };

        const handleMouseMove = (event: MouseEvent) => {
          if (!mouseRef.current.down || !globeRef.current) return;

          const deltaX = event.clientX - mouseRef.current.x;
          const deltaY = event.clientY - mouseRef.current.y;

          rotationRef.current.y += deltaX * 0.005;
          rotationRef.current.x += deltaY * 0.005;

          // Limit vertical rotation
          rotationRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationRef.current.x));

          globeRef.current.rotation.y = rotationRef.current.y;
          globeRef.current.rotation.x = rotationRef.current.x;

          mouseRef.current.x = event.clientX;
          mouseRef.current.y = event.clientY;
        };

        const handleTouchStart = (event: TouchEvent) => {
          if (event.touches.length === 1) {
            autoRotateRef.current = false; // Stop auto-rotation on user interaction
            mouseRef.current.down = true;
            mouseRef.current.x = event.touches[0].clientX;
            mouseRef.current.y = event.touches[0].clientY;
          }
        };

        const handleTouchEnd = () => {
          mouseRef.current.down = false;
        };

        const handleTouchMove = (event: TouchEvent) => {
          if (!mouseRef.current.down || !globeRef.current || event.touches.length !== 1) return;

          const deltaX = event.touches[0].clientX - mouseRef.current.x;
          const deltaY = event.touches[0].clientY - mouseRef.current.y;

          rotationRef.current.y += deltaX * 0.005;
          rotationRef.current.x += deltaY * 0.005;
          
          rotationRef.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationRef.current.x));

          globeRef.current.rotation.y = rotationRef.current.y;
          globeRef.current.rotation.x = rotationRef.current.x;

          mouseRef.current.x = event.touches[0].clientX;
          mouseRef.current.y = event.touches[0].clientY;
        };

        // Add event listeners
        container.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchend', handleTouchEnd);
        container.addEventListener('touchmove', handleTouchMove, { passive: true });

        // Animation loop with auto-rotation
        const animate = () => {
          if (!mountedRef.current || !renderer || !scene || !camera || !globeRef.current) return;
          
          // Auto-rotate to Boston if enabled
          if (autoRotateRef.current) {
            const rotationSpeed = 0.02; // Adjust speed of automatic rotation
            
            // Smoothly interpolate to target rotation
            const deltaY = targetRotationRef.current.y - rotationRef.current.y;
            const deltaX = targetRotationRef.current.x - rotationRef.current.x;
            
            // Check if we're close enough to the target
            if (Math.abs(deltaY) > 0.01 || Math.abs(deltaX) > 0.01) {
              rotationRef.current.y += deltaY * rotationSpeed;
              rotationRef.current.x += deltaX * rotationSpeed;
              
              globeRef.current.rotation.y = rotationRef.current.y;
              globeRef.current.rotation.x = rotationRef.current.x;
            } else {
              // Stop auto-rotation when we reach the target
              autoRotateRef.current = false;
              rotationRef.current.y = targetRotationRef.current.y;
              rotationRef.current.x = targetRotationRef.current.x;
              globeRef.current.rotation.y = rotationRef.current.y;
              globeRef.current.rotation.x = rotationRef.current.x;
            }
          }
          
          renderer.render(scene, camera);
          animationId = requestAnimationFrame(animate);
        };

        // Start rendering after a brief delay
        setTimeout(() => {
          if (mountedRef.current) {
            setIsLoading(false);
            animate();
          }
        }, 500);

        // Handle resize
        const handleResize = () => {
          if (!container || !renderer || !camera) return;
          const width = container.clientWidth;
          const height = container.clientHeight;
          if (width === 0 || height === 0) return;
          
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
          mountedRef.current = false;
          
          // Remove event listeners
          container.removeEventListener('mousedown', handleMouseDown);
          window.removeEventListener('mouseup', handleMouseUp);
          window.removeEventListener('mousemove', handleMouseMove);
          container.removeEventListener('touchstart', handleTouchStart);
          container.removeEventListener('touchend', handleTouchEnd);
          container.removeEventListener('touchmove', handleTouchMove);
          window.removeEventListener('resize', handleResize);
          
          if (animationId) cancelAnimationFrame(animationId);
          
          if (renderer) {
            renderer.dispose();
            if (container && renderer.domElement && renderer.domElement.parentNode === container) {
              try {
                container.removeChild(renderer.domElement);
              } catch (e) {
                console.warn('Error removing renderer:', e);
              }
            }
          }
          
          if (globeRef.current && scene) {
            scene.remove(globeRef.current);
          }
          
          globeRef.current = null;
          rendererRef.current = null;
          sceneRef.current = null;
        };
      } catch (error) {
        console.error("Error initializing globe:", error);
        setIsLoading(false);
      }
    };

    // Start initialization
    initGlobe();
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Enhanced Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="relative mb-4">
            <div className="w-20 h-20 border-4 border-primary/20 rounded-full" />
            <div 
              className="absolute inset-0 w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin"
              style={{ animationDuration: '1s' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
            </div>
          </div>
          <div className="text-sm text-muted-foreground mb-2">Loading Globe...</div>
          <div className="w-32 h-1 bg-primary/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary/50 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Globe Container */}
      <div
        ref={containerRef}
        className={`w-full h-full transition-opacity duration-700 select-none ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        style={{
          cursor: "grab",
          background: "transparent",
        }}
      />
      
      {/* Journey Badge */}
      {!isLoading && (
        <div className="absolute bottom-2 left-2 right-2 md:bottom-4 md:left-4 md:right-4 flex justify-between items-end pointer-events-none">
          <div className="pointer-events-auto">
            <div className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-lg md:rounded-xl bg-background/90 backdrop-blur-md border border-primary/20 shadow-lg">
              <div className="flex items-center gap-1 md:gap-2">
                <span className="text-xs md:text-sm font-semibold text-foreground">Journey</span>
                <div className="flex items-center gap-1 md:gap-1.5">
                  <span className="text-xs md:text-sm text-muted-foreground">Lucknow</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-primary md:w-4 md:h-4">
                    <path d="M5 12h14m0 0l-6-6m6 6l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-xs md:text-sm text-muted-foreground font-medium">Boston</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Drag instruction */}
          <div className="pointer-events-auto hidden md:block">
            <div className="px-3 py-1.5 rounded-lg bg-background/60 backdrop-blur-sm border border-primary/10">
              <span className="text-xs text-muted-foreground">Drag to rotate</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}