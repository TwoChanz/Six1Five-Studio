import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';
import { OBJLoader } from 'three-stdlib';
import { OrbitControls } from 'three-stdlib';
import { Play, RotateCcw } from 'lucide-react';

interface ModelViewerProps {
  modelFile: string;
  modelFormat: 'glb' | 'gltf' | 'obj';
  title: string;
  className?: string;
}

export function ModelViewer({ modelFile, modelFormat, title, className = '' }: ModelViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 10);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Load model or create fallback geometry
    const loadModel = async () => {
      try {
        setLoading(true);
        
        // For now, create a fallback geometry to demonstrate the viewer
        // In production, this would load the actual model files
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshPhongMaterial({ 
          color: 0x6b7280,
          shininess: 100,
          transparent: true,
          opacity: 0.8
        });
        const cube = new THREE.Mesh(geometry, material);
        
        // Add wireframe overlay for better visualization
        const wireframe = new THREE.WireframeGeometry(geometry);
        const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xff6b35, linewidth: 1 });
        const wireframeMesh = new THREE.LineSegments(wireframe, wireframeMaterial);
        
        const group = new THREE.Group();
        group.add(cube);
        group.add(wireframeMesh);
        
        scene.add(group);
        setLoading(false);
        
        // TODO: Replace with actual model loading logic
        /*
        let loader: GLTFLoader | OBJLoader;
        
        if (modelFormat === 'glb' || modelFormat === 'gltf') {
          loader = new GLTFLoader();
          loader.load(
            modelFile,
            (gltf) => {
              scene.add(gltf.scene);
              setLoading(false);
            },
            (progress) => {
              console.log('Loading progress:', (progress.loaded / progress.total) * 100 + '%');
            },
            (error) => {
              console.error('Error loading model:', error);
              setError('Failed to load 3D model');
              setLoading(false);
            }
          );
        } else if (modelFormat === 'obj') {
          loader = new OBJLoader();
          loader.load(
            modelFile,
            (obj) => {
              scene.add(obj);
              setLoading(false);
            },
            (progress) => {
              console.log('Loading progress:', (progress.loaded / progress.total) * 100 + '%');
            },
            (error) => {
              console.error('Error loading model:', error);
              setError('Failed to load 3D model');
              setLoading(false);
            }
          );
        }
        */
      } catch (err) {
        console.error('Model loading error:', err);
        setError('Failed to load 3D model');
        setLoading(false);
      }
    };

    loadModel();

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (mountRef.current && camera && renderer) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [modelFile, modelFormat]);

  const resetView = () => {
    if (controlsRef.current && cameraRef.current) {
      controlsRef.current.reset();
      cameraRef.current.position.set(0, 5, 10);
    }
  };

  const toggleAutoRotate = () => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = !controlsRef.current.autoRotate;
    }
  };

  if (error) {
    return (
      <div className={`bg-gray-800 rounded-xl p-8 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="text-red-400 mb-2">⚠️</div>
          <p className="text-gray-400">Failed to load 3D model</p>
          <p className="text-xs text-gray-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 rounded-xl overflow-hidden relative ${className}`}>
      <div ref={mountRef} className="w-full h-64 relative">
        {loading && (
          <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
              <p className="text-gray-400 text-sm">Loading 3D model...</p>
            </div>
          </div>
        )}
        
        {!loading && (
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <button
              onClick={toggleAutoRotate}
              className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg transition-colors"
              title="Toggle auto-rotate"
            >
              <Play className="w-3 h-3" />
            </button>
            <button
              onClick={resetView}
              className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-lg transition-colors"
              title="Reset view"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-2 left-2 bg-black/60 text-white px-3 py-1 rounded-lg text-sm">
        Interactive 3D Model
      </div>
    </div>
  );
}