import React, { Suspense, useRef, useEffect, useState } from "react";

import {
  useGLTF,
  useAnimations,
  OrbitControls,
  Decal,
  useTexture,
} from "@react-three/drei";
import { easing } from "maath";
import { useSnapshot } from "valtio";
import { useFrame, useThree } from "@react-three/fiber";
import state from "../storeProxy";

import { MeshBasicMaterial } from "three";

export function Model(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/3D/vape3d.glb");
  const { actions } = useAnimations(animations, group);
  const snap = useSnapshot(state);

  const [selectedTexture, setSelectedTexture] = useState(null);

  // UseEffect is called when the selectedTexture prop changes
  useEffect(() => {
    setSelectedTexture(props.selectedTexture);
    console.log("PROPS", props.selectedTexture);
  }, [props.selectedTexture]);

  const logoTexture = useTexture(selectedTexture || snap.logoDecal);
  const fullTexture = useTexture(selectedTexture || snap.logoDecal);

  const logoMaterial = new MeshBasicMaterial({
    color: snap.color,
    map: logoTexture,
  });

  const fullMaterial = new MeshBasicMaterial({
    color: snap.color,
    map: fullTexture,
  });

  useFrame((state, delta) => {
    easing.dampC(materials.LabelMat.color, snap.color, 0.25, delta);
  });

  const stateString = JSON.stringify(snap);

  return (
    <group ref={group} {...props} dispose={null} key={stateString}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group
            name="charonbabyfbx"
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.01}
          >
            <group name="Object_2">
              <group name="RootNode">
                <group
                  name="Cartridge"
                  position={[370, 1500, 0]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  scale={[440, 200, 570]}
                >
                  <mesh
                    name="Cartridge_CartridgeMat_0"
                    geometry={nodes.Cartridge_CartridgeMat_0.geometry}
                    material={materials.PodMat}
                    material-color={snap.color}
                  />
                </group>
                <group
                  name="Case"
                  position={[0, -340, 0]}
                  rotation={[-Math.PI / 2, 0, 0]}
                  scale={[1260, 480, 1750]}
                >
                  <mesh
                    name="Case_LabelMat_0"
                    geometry={nodes.Case_LabelMat_0.geometry}
                    material={
                      props.selectedTexture ? fullMaterial : logoMaterial
                    }
                    material-color={snap.color}
                  />
                  <mesh
                    name="Case_PodMat_0"
                    geometry={nodes.Case_PodMat_0.geometry}
                    material={materials.PodMat}
                    material-color={snap.color}
                  />
                  <mesh
                    name="Case_CartridgeMat_0"
                    geometry={nodes.Case_CartridgeMat_0.geometry}
                    material={materials.CartridgeMat}
                  />
                  <mesh
                    name="Case_IndicatorMat_0"
                    geometry={nodes.Case_IndicatorMat_0.geometry}
                    material={materials.IndicatorMat}
                  />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/3D/vape3d.glb");
