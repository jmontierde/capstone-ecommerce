import { proxy } from "valtio";

const state = proxy({
  intro: false,
  // color: "#fff",
  isLogoTexture: true,
  isFullTexture: true,
  logoDecal: "/3D/texture1.jpeg",
  fullDecal: "/3D/texture1.jpeg",
});

export default state;
