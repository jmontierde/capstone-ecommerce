import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Model } from "./canvas/Vape";
import Customizer from "./pages/Customizer";
import { useState } from "react";

const Three = () => {
  const [selectedTexture, setSelectedTexture] = useState(null);

  return (
    <div className="h-screen ">
      <Canvas key={selectedTexture}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 15, 10]} angle={0.3} />
        <Suspense key={selectedTexture} fallback={null}>
          <Model selectedTexture={selectedTexture} />
          <OrbitControls />
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
