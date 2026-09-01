"use client";

import { PointerEvent, useEffect, useRef, useState } from "react";
import * as THREE from "three";

export type DeviceMode = "자동" | "수동" | "강력";

type Props = {
  active: boolean;
  className?: string;
  image: string;
  mode: DeviceMode;
  name: string;
  onRotationChange: (rotation: number) => void;
  rotation: number;
  variant: "tower" | "air" | "night" | "mini";
};

export const modeColors: Record<DeviceMode, string> = {
  자동: "#ffb347",
  수동: "#4ea8ff",
  강력: "#ff385c"
};

function addMesh(
  group: THREE.Group,
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  position: [number, number, number] = [0, 0, 0]
) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addFrontGrille(group: THREE.Group, y: number, height: number, width: number, z: number, material: THREE.Material) {
  for (let index = 0; index < 11; index += 1) {
    const x = -width / 2 + (width / 10) * index;
    addMesh(group, new THREE.BoxGeometry(0.055, height, 0.065), material, [x, y, z]);
  }
  addMesh(group, new THREE.BoxGeometry(width + 0.12, 0.07, 0.07), material, [0, y + height / 2, z]);
  addMesh(group, new THREE.BoxGeometry(width + 0.12, 0.07, 0.07), material, [0, y - height / 2, z]);
}

function createProductModel(variant: Props["variant"], glowColor: string) {
  const group = new THREE.Group();
  const glowMaterials: THREE.MeshStandardMaterial[] = [];
  const dark = new THREE.MeshPhysicalMaterial({ color: "#22272b", metalness: 0.62, roughness: 0.28, clearcoat: 0.7 });
  const black = new THREE.MeshPhysicalMaterial({ color: "#111416", metalness: 0.48, roughness: 0.34 });
  const white = new THREE.MeshPhysicalMaterial({ color: "#e8f1ed", metalness: 0.12, roughness: 0.3, clearcoat: 0.75 });
  const lavender = new THREE.MeshPhysicalMaterial({ color: "#e8dcf4", metalness: 0.12, roughness: 0.28, clearcoat: 0.7 });
  const glow = new THREE.MeshStandardMaterial({ color: glowColor, emissive: glowColor, emissiveIntensity: 1.8, roughness: 0.42 });
  const dimGlow = new THREE.MeshStandardMaterial({ color: glowColor, emissive: glowColor, emissiveIntensity: 1.1, transparent: true, opacity: 0.78 });
  glowMaterials.push(glow, dimGlow);

  if (variant === "tower") {
    addMesh(group, new THREE.CylinderGeometry(0.92, 0.98, 2.65, 48), dark, [0, 0, 0]);
    addMesh(group, new THREE.CylinderGeometry(0.72, 0.75, 1.95, 36), glow, [0, 0.05, 0.12]);
    addMesh(group, new THREE.CylinderGeometry(1.01, 1.01, 0.32, 48), black, [0, -1.26, 0]);
    addMesh(group, new THREE.CylinderGeometry(0.96, 0.96, 0.25, 48), black, [0, 1.27, 0]);
    addFrontGrille(group, 0.05, 2.02, 1.35, 0.82, black);
    addMesh(group, new THREE.TorusGeometry(0.82, 0.045, 10, 48), dimGlow, [0, -1.12, 0]).rotation.x = Math.PI / 2;
  }

  if (variant === "air") {
    addMesh(group, new THREE.CylinderGeometry(0.9, 0.95, 2.75, 48), white, [0, 0, 0]);
    addMesh(group, new THREE.CylinderGeometry(0.94, 1, 0.68, 48), dark, [0, -1.06, 0]);
    addMesh(group, new THREE.CylinderGeometry(0.61, 0.64, 1.5, 36), dimGlow, [0, 0.28, 0.18]);
    addMesh(group, new THREE.BoxGeometry(1.3, 1.72, 0.09), black, [0, 0.27, 0.84]);
    addFrontGrille(group, 0.27, 1.52, 1.12, 0.91, dark);
    addMesh(group, new THREE.TorusGeometry(0.77, 0.045, 10, 48), glow, [0, 1.31, 0]).rotation.x = Math.PI / 2;
    for (let index = 0; index < 12; index += 1) {
      const angle = (index / 12) * Math.PI * 2;
      const vent = addMesh(group, new THREE.BoxGeometry(0.1, 0.42, 0.045), black, [Math.cos(angle) * 0.9, -1.08, Math.sin(angle) * 0.9]);
      vent.rotation.y = -angle;
    }
  }

  if (variant === "night") {
    addMesh(group, new THREE.CylinderGeometry(1.08, 1.05, 1.15, 48), dark, [0, -0.72, 0]);
    addMesh(group, new THREE.CylinderGeometry(0.86, 0.9, 0.72, 48), lavender, [0, 0.18, 0]);
    addMesh(group, new THREE.CylinderGeometry(0.7, 0.74, 0.58, 36), dimGlow, [0, 0.35, 0]);
    addMesh(group, new THREE.CylinderGeometry(1.18, 1.05, 0.32, 48), black, [0, 1, 0]);
    const dome = addMesh(group, new THREE.SphereGeometry(1.05, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), dark, [0, 1.08, 0]);
    dome.scale.y = 0.34;
    addMesh(group, new THREE.TorusGeometry(0.91, 0.075, 12, 64), glow, [0, 0.62, 0]).rotation.x = Math.PI / 2;
    for (let index = 0; index < 8; index += 1) {
      const angle = (index / 8) * Math.PI * 2;
      const post = addMesh(group, new THREE.CylinderGeometry(0.035, 0.035, 0.62, 10), lavender, [Math.cos(angle) * 0.79, 0.55, Math.sin(angle) * 0.79]);
      post.rotation.z = Math.sin(angle) * 0.08;
    }
    for (let index = 0; index < 16; index += 1) {
      const angle = (index / 16) * Math.PI * 2;
      const vent = addMesh(group, new THREE.BoxGeometry(0.055, 0.42, 0.05), black, [Math.cos(angle) * 1.04, -0.72, Math.sin(angle) * 1.04]);
      vent.rotation.y = -angle;
    }
  }

  if (variant === "mini") {
    addMesh(group, new THREE.CylinderGeometry(0.8, 0.84, 1.72, 40), dark, [0, -0.18, 0]);
    addMesh(group, new THREE.CylinderGeometry(0.58, 0.62, 1.15, 32), glow, [0, -0.08, 0.1]);
    addMesh(group, new THREE.CylinderGeometry(0.86, 0.86, 0.28, 40), black, [0, -0.96, 0]);
    addMesh(group, new THREE.CylinderGeometry(0.86, 0.82, 0.26, 40), black, [0, 0.68, 0]);
    addFrontGrille(group, -0.1, 1.18, 1.12, 0.74, black);
    const loop = addMesh(group, new THREE.TorusGeometry(0.34, 0.055, 12, 40, Math.PI * 1.62), dark, [0, 1.14, 0]);
    loop.rotation.z = -Math.PI * 0.31;
    addMesh(group, new THREE.BoxGeometry(0.12, 0.28, 0.12), dark, [-0.31, 0.88, 0]);
    addMesh(group, new THREE.BoxGeometry(0.12, 0.28, 0.12), dark, [0.31, 0.88, 0]);
  }

  group.scale.setScalar(0.9);
  return { group, glowMaterials };
}

function createMosquito() {
  const group = new THREE.Group();
  const bodyMaterial = new THREE.MeshStandardMaterial({ color: "#25282c", roughness: 0.8 });
  const wingMaterial = new THREE.MeshStandardMaterial({ color: "#d8dee4", transparent: true, opacity: 0.55, side: THREE.DoubleSide });
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8), bodyMaterial);
  body.scale.set(0.62, 1.4, 0.62);
  group.add(body);
  const leftWing = new THREE.Mesh(new THREE.CircleGeometry(0.075, 10), wingMaterial);
  leftWing.position.x = -0.07;
  leftWing.rotation.y = 0.55;
  group.add(leftWing);
  const rightWing = leftWing.clone();
  rightWing.position.x = 0.07;
  rightWing.rotation.y = -0.55;
  group.add(rightWing);
  group.scale.setScalar(0.82);
  return group;
}

export default function DeviceProduct3D({ active, className, image, mode, name, onRotationChange, rotation, variant }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(rotation);
  const stateRef = useRef({ active, mode });
  const dragRef = useRef({ active: false, x: 0 });
  const [fallback, setFallback] = useState(false);

  useEffect(() => { rotationRef.current = rotation; }, [rotation]);
  useEffect(() => { stateRef.current = { active, mode }; }, [active, mode]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let animationFrame = 0;

    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
      camera.position.set(4.6, 2.7, 5.7);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.22;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      renderer.domElement.setAttribute("aria-hidden", "true");
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";
      mount.appendChild(renderer.domElement);

      const hemisphere = new THREE.HemisphereLight("#ffffff", "#9b8d84", 2.2);
      scene.add(hemisphere);
      const keyLight = new THREE.DirectionalLight("#ffffff", 4.4);
      keyLight.position.set(3.5, 6, 4.5);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      scene.add(keyLight);
      const rimLight = new THREE.DirectionalLight("#ffdde2", 2.2);
      rimLight.position.set(-4, 2, -3);
      scene.add(rimLight);

      const { group, glowMaterials } = createProductModel(variant, modeColors[stateRef.current.mode]);
      group.rotation.y = THREE.MathUtils.degToRad(rotationRef.current);
      scene.add(group);

      const glowLight = new THREE.PointLight(modeColors[stateRef.current.mode], 0, 5.2, 2);
      glowLight.position.set(0, 0.2, 0.9);
      group.add(glowLight);

      const floor = new THREE.Mesh(
        new THREE.CircleGeometry(2.25, 64),
        new THREE.ShadowMaterial({ color: "#382f2b", opacity: 0.19 })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -1.58;
      floor.receiveShadow = true;
      scene.add(floor);

      const mosquitoes = Array.from({ length: 8 }, (_, index) => {
        const mosquito = createMosquito();
        mosquito.userData.phase = index / 8;
        scene.add(mosquito);
        return mosquito;
      });

      const resize = () => {
        const width = Math.max(1, mount.clientWidth);
        const height = Math.max(1, mount.clientHeight);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);
      resize();

      const startedAt = performance.now();
      const animate = (time: number) => {
        const elapsed = (time - startedAt) / 1000;
        const current = stateRef.current;
        const color = new THREE.Color(modeColors[current.mode]);
        const speed = current.mode === "강력" ? 1.9 : current.mode === "자동" ? 1.15 : 0.72;
        const targetRotation = THREE.MathUtils.degToRad(rotationRef.current);
        group.rotation.y += (targetRotation - group.rotation.y) * 0.1;
        group.position.y = Math.sin(elapsed * 1.25) * 0.025;
        glowLight.color.lerp(color, 0.16);
        glowLight.intensity = current.active ? 3.8 + Math.sin(elapsed * speed * 3) * 0.65 : 0.12;
        glowMaterials.forEach((material) => {
          material.color.lerp(color, 0.15);
          material.emissive.lerp(color, 0.15);
          material.emissiveIntensity = current.active ? 1.9 + Math.sin(elapsed * speed * 3) * 0.42 : 0.12;
        });

        mosquitoes.forEach((mosquito, index) => {
          const cycle = (elapsed * 0.1 * speed + mosquito.userData.phase) % 1;
          const radius = current.active ? 2.1 - cycle * 1.55 : 1.9;
          const angle = elapsed * (0.72 + index * 0.015) + index * 1.63;
          mosquito.position.set(Math.cos(angle) * radius, 0.25 + Math.sin(angle * 1.7) * 1.08, Math.sin(angle) * radius);
          const fade = current.active && cycle > 0.8 ? Math.max(0, 1 - (cycle - 0.8) * 5) : 1;
          mosquito.scale.setScalar(0.82 * fade);
          mosquito.rotation.z = Math.sin(elapsed * 18 + index) * 0.35;
        });

        renderer.render(scene, camera);
        animationFrame = window.requestAnimationFrame(animate);
      };
      animationFrame = window.requestAnimationFrame(animate);

      return () => {
        window.cancelAnimationFrame(animationFrame);
        resizeObserver.disconnect();
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => material.dispose());
          }
        });
        renderer.dispose();
        renderer.domElement.remove();
      };
    } catch {
      setFallback(true);
      return;
    }
  }, [variant]);

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    dragRef.current = { active: true, x: event.clientX };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    if (!dragRef.current.active) return;
    const delta = event.clientX - dragRef.current.x;
    onRotationChange(rotationRef.current + delta * 0.8);
    dragRef.current.x = event.clientX;
  }

  return (
    <div
      className={className}
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={() => { dragRef.current.active = false; }}
      onPointerCancel={() => { dragRef.current.active = false; }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") onRotationChange(rotationRef.current - 15);
        if (event.key === "ArrowRight") onRotationChange(rotationRef.current + 15);
      }}
      ref={mountRef}
      role="img"
      tabIndex={0}
      aria-label={`${name} 실제 3D 모델. 좌우 화살표 또는 드래그로 회전`}
    >
      {fallback && <img src={image} alt={`${name} 3D 대체 이미지`} />}
    </div>
  );
}
