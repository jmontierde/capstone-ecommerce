import React, { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { Model } from "./canvas/Vape";
import Customizer from "./pages/Customizer";

const CustomCamera = () => {
  const { camera } = useThree();

  // Adjust the camera's initial position
  useEffect(() => {
    camera.position.set(0, 0, 60); // Adjust the Z position to control the initial zoom level
  }, [camera]);

  return null;
};

const Three = () => {
  const [selectedTexture, setSelectedTexture] = useState(null);

  return (
    <div className="h-screen">
      <Canvas key={selectedTexture} concurrent={true}>
        <Suspense key={selectedTexture} fallback={null}>
          <CustomCamera /> {/* Custom camera setup */}
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 15, 10]} angle={0.3} />
          <Model selectedTexture={selectedTexture} />
          <OrbitControls zoomSpeed={0.5} />
        </Suspense>
      </Canvas>
      <Customizer
        selectedTexture={selectedTexture}
        setSelectedTexture={setSelectedTexture}
      />
    </div>
  );
};

export default Three;
