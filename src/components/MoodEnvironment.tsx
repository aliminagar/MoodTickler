// Components/MoodEnvironment.tsx
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Cloud, Sky } from '@react-three/drei';
import { MoodType } from '../types';
import * as THREE from 'three';

// Define environment configurations for each mood
const moodEnvironments = {
  happy: {
    skyColor: "#87CEEB",
    sunPosition: [1, 5, 0],
    cloudColor: "#FFFFFF",
    groundColor: "#7CFC00",
    stars: false,
    clouds: true,
    time: 0.4, // day time
  },
  sad: {
    skyColor: "#4A6D96",
    sunPosition: [-1, 0.5, 0],
    cloudColor: "#9DA6B2",
    groundColor: "#485C70",
    stars: true,
    clouds: true,
    time: 0.8, // sunset/dusk
  },
  angry: {
    skyColor: "#8B0000",
    sunPosition: [1, 3, 0],
    cloudColor: "#A52A2A",
    groundColor: "#8B4513",
    stars: false,
    clouds: true,
    time: 0.5, // dramatic day
  },
  tired: {
    skyColor: "#191970",
    sunPosition: [0, -1, -5],
    cloudColor: "#4B4B4B",
    groundColor: "#2F4F4F",
    stars: true,
    clouds: false,
    time: 0.9, // night
  },
  excited: {
    skyColor: "#FF69B4",
    sunPosition: [1, 10, 5],
    cloudColor: "#FFB6C1",
    groundColor: "#FF1493",
    stars: false,
    clouds: true,
    time: 0.4, // bright day
  },
  silly: {
    skyColor: "#FF4500",
    sunPosition: [5, 3, -2],
    cloudColor: "#FFD700",
    groundColor: "#32CD32",
    stars: false,
    clouds: true,
    time: 0.45, // playful day
  },
  anxious: {
    skyColor: "#708090",
    sunPosition: [0, 1, -3],
    cloudColor: "#D3D3D3",
    groundColor: "#5F9EA0",
    stars: false,
    clouds: true,
    time: 0.65, // cloudy
  },
  peaceful: {
    skyColor: "#4169E1",
    sunPosition: [-1, 0.2, -1],
    cloudColor: "#B0C4DE",
    groundColor: "#2E8B57",
    stars: true,
    clouds: false,
    time: 0.75, // early evening
  },
  confident: {
    skyColor: "#1E90FF",
    sunPosition: [3, 10, 2],
    cloudColor: "#F5F5F5",
    groundColor: "#FFD700",
    stars: false,
    clouds: true,
    time: 0.35, // bright optimistic day
  },
  curious: {
    skyColor: "#BA55D3",
    sunPosition: [2, 5, 4],
    cloudColor: "#DDA0DD",
    groundColor: "#20B2AA",
    stars: true,
    clouds: false,
    time: 0.6, // interesting twilight
  }
};

// Default environment when no mood is selected
const defaultEnvironment = {
  skyColor: "#2C3E50",
  sunPosition: [0, 3, 0],
  cloudColor: "#CCCCCC", 
  groundColor: "#34495E",
  stars: true,
  clouds: true,
  time: 0.7, // twilight
};

// Ground plane component
const Ground = ({ color }) => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

// Animated clouds
const CloudGroup = ({ color }) => {
  return (
    <group>
      <Cloud position={[-4, 2, -5]} speed={0.2} opacity={0.8} color={color} />
      <Cloud position={[4, 5, -6]} speed={0.1} opacity={0.6} color={color} />
      <Cloud position={[0, 3, -10]} speed={0.3} opacity={0.7} color={color} />
      <Cloud position={[-10, 6, -15]} speed={0.2} opacity={0.5} color={color} />
      <Cloud position={[10, 4, -8]} speed={0.25} opacity={0.7} color={color} />
    </group>
  );
};

// Scene lighting
const SceneLighting = ({ sunPosition }) => {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  
  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.position.set(sunPosition[0], sunPosition[1], sunPosition[2]);
      lightRef.current.lookAt(0, 0, 0);
    }
  }, [sunPosition]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight 
        ref={lightRef}
        intensity={1.5} 
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </>
  );
};

// Custom camera animation
const CameraAnimation = () => {
  const { camera } = useThree();
  
  useFrame(() => {
    // Subtle camera movement
    camera.position.y = 1 + Math.sin(Date.now() / 10000) * 0.5;
    camera.position.x = Math.sin(Date.now() / 15000) * 0.5;
    camera.lookAt(0, 0, 0);
  });
  
  return null;
};

interface MoodEnvironmentProps {
  mood: MoodType | null;
}

// Main mood environment component
const MoodEnvironment: React.FC<MoodEnvironmentProps> = ({ mood }) => {
  // Use default environment if no mood is selected
  const envConfig = mood ? moodEnvironments[mood] : defaultEnvironment;

  return (
    <div className="mood-environment absolute inset-0 -z-10">
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 60 }}>
        <CameraAnimation />
        <SceneLighting sunPosition={envConfig.sunPosition} />
        
        {/* Sky with dynamically set time based on mood */}
        <Sky 
          distance={450000} 
          sunPosition={envConfig.sunPosition} 
          inclination={envConfig.time}
          azimuth={0.25}
          rayleigh={envConfig.time < 0.5 ? 0.5 : 2}
        />
        
        {/* Ground that matches the mood */}
        <Ground color={envConfig.groundColor} />
        
        {/* Stars appear for night-time moods */}
        {envConfig.stars && (
          <Stars 
            radius={100} 
            depth={50} 
            count={5000} 
            factor={4} 
            saturation={0} 
            fade
            speed={1}
          />
        )}
        
        {/* Clouds appear for some moods */}
        {envConfig.clouds && <CloudGroup color={envConfig.cloudColor} />}
      </Canvas>
    </div>
  );
};

export default MoodEnvironment;