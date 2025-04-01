// src/components/MoodDice.tsx
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { useFrame } from '@react-three/fiber';

interface MoodDiceProps {
  onRoll: (mood: string) => void;
  resetTrigger?: number;
}

const MoodDice: React.FC<MoodDiceProps> = ({ onRoll, resetTrigger }) => {
  const diceRef = useRef<THREE.Mesh>(null!);
  const physicsWorld = useRef<CANNON.World>(null!);
  const diceBody = useRef<CANNON.Body>(null!);
  const groundBody = useRef<CANNON.Body>(null!);
  const hasRolled = useRef<boolean>(false);

  const createEmojiTexture = (emoji: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d')!;

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = '120px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#000000';
    context.fillText(emoji, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  const moods = [
    { mood: 'happy', emoji: '😊' },
    { mood: 'sad', emoji: '😢' },
    { mood: 'angry', emoji: '😡' },
    { mood: 'tired', emoji: '😴' },
    { mood: 'excited', emoji: '😍' },
    { mood: 'silly', emoji: '🤪' },
  ];

  const materials = moods.map(({ emoji }) =>
    new THREE.MeshStandardMaterial({
      map: createEmojiTexture(emoji),
      roughness: 0.7,
      metalness: 0.2,
    })
  );

  useEffect(() => {
    physicsWorld.current = new CANNON.World();
    physicsWorld.current.gravity.set(0, -9.82, 0);

    groundBody.current = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Plane(),
    });
    groundBody.current.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    physicsWorld.current.addBody(groundBody.current);

    const diceShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    diceBody.current = new CANNON.Body({
      mass: 1,
      shape: diceShape,
    });
    diceBody.current.position.set(0, 5, 0);
    physicsWorld.current.addBody(diceBody.current);
  }, []);

  useEffect(() => {
    if (resetTrigger !== undefined) {
      // Move dice far offscreen to hide and reset it
      diceBody.current.position.set(1000, 1000, 1000);
      diceBody.current.velocity.set(0, 0, 0);
      diceBody.current.angularVelocity.set(0, 0, 0);
      hasRolled.current = true;
    }
  }, [resetTrigger]);

  useFrame(() => {
    physicsWorld.current.step(1 / 60);
    diceRef.current.position.copy(diceBody.current.position as any);
    diceRef.current.quaternion.copy(diceBody.current.quaternion as any);

    if (diceBody.current.velocity.length() < 0.1 && diceBody.current.position.y < 0.6) {
      const upVector = new THREE.Vector3(0, 1, 0);
      const faceVectors = [
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, -1),
      ];
      let maxDot = -Infinity;
      let faceUp = 0;

      for (let i = 0; i < faceVectors.length; i++) {
        const faceVector = faceVectors[i].applyQuaternion(diceRef.current.quaternion);
        const dot = faceVector.dot(upVector);
        if (dot > maxDot) {
          maxDot = dot;
          faceUp = i;
        }
      }

      if (maxDot > 0.9 && !hasRolled.current) {
        hasRolled.current = true;
        const selectedFace = faceUp % moods.length;
        onRoll(moods[selectedFace].mood);
        diceBody.current.velocity.set(0, 0, 0);
        diceBody.current.angularVelocity.set(0, 0, 0);
      }
    }
  });

  const handleClick = () => {
    hasRolled.current = false;
    diceBody.current.position.set(0, 5, 0);
    diceBody.current.velocity.set((Math.random() - 0.5) * 5, 5, (Math.random() - 0.5) * 5);
    diceBody.current.angularVelocity.set(
      Math.random() * 10,
      Math.random() * 10,
      Math.random() * 10
    );
  };

  return (
    <group position={[-8, -4, 0]}>
      <mesh ref={diceRef} onClick={handleClick} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        {materials.map((material, index) => (
          <primitive key={index} object={material} attach={`material-${index}`} />
        ))}
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
};

export default MoodDice;
