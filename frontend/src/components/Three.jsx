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
          {/* <Model selectedTexture={selectedTexture} /> */}
          <OrbitControls />

          <Environment preset="sunset" />
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
// import { Suspense } from "react";
// import { Canvas } from "@react-three/fiber";
// import { Environment, OrbitControls } from "@react-three/drei";
// import { Model } from "./canvas/Vape";
// import Customizer from "./pages/Customizer";
// import { useState, useEffect } from "react";

// const Three = () => {
//   const [selectedTexture, setSelectedTexture] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Try to render the Model component in isolation.
//     const renderModel = async () => {
//       try {
//         const model = await Model.render();
//         // If the model is rendered successfully, clear the error state.
//         setError(null);
//       } catch (err) {
//         // If an error occurs, set the error state.
//         setError(err);
//       } finally {
//         // Clean up the model.
//         model.dispose();
//       }
//     };

//     renderModel();
//   }, [selectedTexture]);

//   if (error) {
//     return (
//       <div className="h-screen">
//         <h1>Error</h1>
//         <pre>{error.message}</pre>
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen ">
//       <Canvas key={selectedTexture}>
//         <ambientLight intensity={0.5} />
//         <spotLight position={[10, 15, 10]} angle={0.3} />
//         <Suspense key={selectedTexture} fallback={null}>
//           <Model selectedTexture={selectedTexture} />
//           <OrbitControls />

//           <Environment preset="sunset" />
//         </Suspense>
//       </Canvas>
//       <Customizer
//         selectedTexture={selectedTexture}
//         setSelectedTexture={setSelectedTexture}
//       />
//     </div>
//   );
// };

// export default Three;
