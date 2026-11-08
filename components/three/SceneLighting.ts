import * as THREE from "three";
import { PALETTE, type ScenePart } from "./sceneTypes";

export function createLighting(): ScenePart {
  const group = new THREE.Group();

  const ambient = new THREE.AmbientLight(0xffffff, 0.8);
  const key = new THREE.DirectionalLight(0xffffff, 1.55);
  key.position.set(3.5, 5, 6);
  const rim = new THREE.DirectionalLight(PALETTE.lime, 0.55);
  rim.position.set(-5, -3, -4);
  const fill = new THREE.DirectionalLight(0xffffff, 0.35);
  fill.position.set(-2.5, 3, 3.5);

  group.add(ambient, key, rim, fill);

  return {
    object: group,
    setTheme(theme) {
      const dark = theme === "dark";
      ambient.intensity = dark ? 0.75 : 0.95;
      key.intensity = dark ? 1.55 : 1.35;
      fill.intensity = dark ? 0.35 : 0.5;
      rim.intensity = dark ? 0.55 : 0.4;
    },
    dispose() {},
  };
}
