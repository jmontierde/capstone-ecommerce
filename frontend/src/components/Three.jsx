import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Model } from "./canvas/Vape";
import Customizer from "./pages/Customizer";
const Three = () => {
  return (
    <div className="h-screen ">
      <Canvas>
        <Suspense fallback={null}>
          <Model />
          <OrbitControls />

          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Three;
