import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import * as THREE from 'three';
import { TipoCarroceria } from '../modules/medical-checkup/checkupEngine';

export interface Car3DWebGLProps {
  bodyType: TipoCarroceria;
  paintHex: string;
  height?: number;
  interactive?: boolean;
}

/**
 * Crea una textura radial suave en un canvas 2D para la sombra de contacto en el piso blanco.
 */
function createContactShadowTexture(): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const grad = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    12,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2
  );
  grad.addColorStop(0, 'rgba(15, 23, 42, 0.34)');
  grad.addColorStop(0.55, 'rgba(15, 23, 42, 0.16)');
  grad.addColorStop(1, 'rgba(15, 23, 42, 0.0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Construye una rueda 3D detallada (Neumático con hombro redondeado + Llanta de aleación 5 rayos + Disco + Caliper).
 */
function buildWheelMesh(radius: number, width: number): THREE.Group {
  const wheelGroup = new THREE.Group();

  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.78,
    metalness: 0.1,
  });

  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.22,
    metalness: 0.85,
  });

  const darkRimMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.5,
    metalness: 0.4,
  });

  // Banda de rodamiento principal
  const tireCyl = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, width, 32),
    tireMat
  );
  tireCyl.rotation.x = Math.PI / 2;
  wheelGroup.add(tireCyl);

  // Interior oscuro de la llanta
  const innerRim = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.72, radius * 0.72, width * 1.02, 24),
    darkRimMat
  );
  innerRim.rotation.x = Math.PI / 2;
  wheelGroup.add(innerRim);

  // Aro cromado exterior e interior
  [-1, 1].forEach((side) => {
    const zOffset = side * (width / 2);
    const rimRing = new THREE.Mesh(
      new THREE.RingGeometry(radius * 0.55, radius * 0.72, 28),
      rimMat
    );
    if (side < 0) rimRing.rotation.y = Math.PI;
    rimRing.position.z = zOffset + side * 0.005;
    wheelGroup.add(rimRing);

    // 5 rayos deportivos
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const spoke = new THREE.Mesh(
        new THREE.BoxGeometry(radius * 0.13, radius * 0.65, 0.02),
        rimMat
      );
      spoke.position.set(
        Math.cos(angle) * radius * 0.32,
        Math.sin(angle) * radius * 0.32,
        zOffset
      );
      spoke.rotation.z = angle + Math.PI / 2;
      wheelGroup.add(spoke);
    }

    // Centro de llanta
    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(radius * 0.18, radius * 0.18, 0.03, 16),
      rimMat
    );
    hub.rotation.x = Math.PI / 2;
    hub.position.z = zOffset;
    wheelGroup.add(hub);
  });

  return wheelGroup;
}

/**
 * Construye la geometría 3D esculpida para cada una de las 4 carrocerías universales:
 * - hatchback (VW Gol Trend / Peugeot 208 / Ka)
 * - sedan (Fiat Cronos / Toyota Etios)
 * - pickup (Toyota Hilux)
 * - suv (Chevrolet Tracker / Stepway)
 */
function buildCarBodyGroup(
  bodyType: TipoCarroceria,
  paintMaterial: THREE.MeshPhysicalMaterial
): THREE.Group {
  const carGroup = new THREE.Group();

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0f172a,
    roughness: 0.08,
    metalness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
  });

  const trimDarkMaterial = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.6,
    metalness: 0.2,
  });

  const headlightMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xe0f2fe,
    emissiveIntensity: 0.7,
    roughness: 0.1,
  });

  const taillightMaterial = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: 0xdc2626,
    emissiveIntensity: 0.55,
    roughness: 0.15,
  });

  const silverAccentMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    roughness: 0.25,
    metalness: 0.8,
  });

  // Parámetros por tipo de carrocería
  const bodyWidth = bodyType === 'pickup' || bodyType === 'suv' ? 1.52 : 1.44;
  const wheelRadius =
    bodyType === 'pickup' ? 0.42 : bodyType === 'suv' ? 0.39 : 0.35;
  const wheelWidth = 0.24;
  const wheelBaseHalf =
    bodyType === 'pickup' ? 1.28 : bodyType === 'sedan' ? 1.18 : 1.1;

  // 1. Perfil lateral inferior + carrocería principal esculpida con curvas Bezier
  const bodyShape = new THREE.Shape();
  const cabinGlassShape = new THREE.Shape();

  if (bodyType === 'hatchback') {
    // Silueta Hatchback (Gol Trend / 208)
    bodyShape.moveTo(-1.72, 0.28);
    bodyShape.quadraticCurveTo(-1.78, 0.55, -1.62, 0.78); // Paragolpe trasero
    bodyShape.lineTo(-1.38, 1.32); // Portón trasero inclinado
    bodyShape.quadraticCurveTo(-1.32, 1.38, -1.15, 1.38); // Spoiler de techo
    bodyShape.quadraticCurveTo(-0.35, 1.42, 0.22, 1.32); // Arco del techo
    bodyShape.lineTo(0.85, 0.86); // Parabrisas lanzado
    bodyShape.quadraticCurveTo(1.42, 0.8, 1.68, 0.64); // Capot deportivo
    bodyShape.quadraticCurveTo(1.78, 0.48, 1.72, 0.26); // Trompa delantera
    bodyShape.lineTo(-1.72, 0.28);

    // Ventanillas laterales + parabrisas
    cabinGlassShape.moveTo(-1.24, 0.86);
    cabinGlassShape.lineTo(-1.08, 1.28);
    cabinGlassShape.quadraticCurveTo(-0.35, 1.32, 0.18, 1.24);
    cabinGlassShape.lineTo(0.74, 0.86);
    cabinGlassShape.lineTo(-1.24, 0.86);
  } else if (bodyType === 'sedan') {
    // Silueta Sedán 3 volúmenes (Fiat Cronos / Etios)
    bodyShape.moveTo(-1.92, 0.3);
    bodyShape.quadraticCurveTo(-1.98, 0.58, -1.86, 0.84); // Cola del baúl
    bodyShape.lineTo(-1.35, 0.88); // Tapa de baúl horizontal
    bodyShape.lineTo(-0.82, 1.32); // Luneta trasera suave
    bodyShape.quadraticCurveTo(-0.15, 1.38, 0.28, 1.3); // Techo sedán
    bodyShape.lineTo(0.92, 0.85); // Parabrisas
    bodyShape.quadraticCurveTo(1.52, 0.78, 1.84, 0.64); // Capot alargado
    bodyShape.quadraticCurveTo(1.94, 0.46, 1.88, 0.26); // Paragolpe delantero
    bodyShape.lineTo(-1.92, 0.3);

    cabinGlassShape.moveTo(-1.22, 0.88);
    cabinGlassShape.lineTo(-0.76, 1.24);
    cabinGlassShape.quadraticCurveTo(-0.15, 1.29, 0.24, 1.22);
    cabinGlassShape.lineTo(0.8, 0.86);
    cabinGlassShape.lineTo(-1.22, 0.88);
  } else if (bodyType === 'pickup') {
    // Silueta Pick-up Doble Cabina (Toyota Hilux)
    bodyShape.moveTo(-2.05, 0.42);
    bodyShape.lineTo(-2.05, 0.98); // Compuerta de caja trasera
    bodyShape.lineTo(-0.68, 0.98); // Borde superior de la caja de carga
    bodyShape.lineTo(-0.68, 1.54); // Luneta vertical doble cabina
    bodyShape.quadraticCurveTo(-0.05, 1.58, 0.42, 1.52); // Techo alto cabina
    bodyShape.lineTo(0.98, 1.02); // Parabrisas robusto
    bodyShape.lineTo(1.88, 0.94); // Capot alto y plano de chata
    bodyShape.quadraticCurveTo(2.02, 0.88, 2.02, 0.42); // Parrilla frontal alta
    bodyShape.lineTo(-2.05, 0.42);

    cabinGlassShape.moveTo(-0.58, 1.02);
    cabinGlassShape.lineTo(-0.58, 1.44);
    cabinGlassShape.quadraticCurveTo(-0.05, 1.47, 0.36, 1.42);
    cabinGlassShape.lineTo(0.86, 1.02);
    cabinGlassShape.lineTo(-0.58, 1.02);
  } else {
    // Silueta SUV / Crossover (Chevrolet Tracker / Stepway)
    bodyShape.moveTo(-1.8, 0.36);
    bodyShape.quadraticCurveTo(-1.86, 0.68, -1.72, 0.96); // Paragolpe trasero alto
    bodyShape.lineTo(-1.42, 1.46); // Portón SUV alto
    bodyShape.quadraticCurveTo(-0.4, 1.52, 0.35, 1.44); // Techo largo SUV
    bodyShape.lineTo(0.92, 0.96); // Parabrisas
    bodyShape.quadraticCurveTo(1.52, 0.9, 1.78, 0.78); // Capot musculoso SUV
    bodyShape.quadraticCurveTo(1.86, 0.56, 1.8, 0.36); // Trompa alta
    bodyShape.lineTo(-1.8, 0.36);

    cabinGlassShape.moveTo(-1.32, 0.96);
    cabinGlassShape.lineTo(-1.14, 1.36);
    cabinGlassShape.quadraticCurveTo(-0.35, 1.41, 0.3, 1.35);
    cabinGlassShape.lineTo(0.8, 0.96);
    cabinGlassShape.lineTo(-1.32, 0.96);
  }

  // Extrusión de carrocería con biselado suave tipo estudio automotriz
  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    steps: 1,
    depth: bodyWidth - 0.24,
    bevelEnabled: true,
    bevelThickness: 0.12,
    bevelSize: 0.11,
    bevelOffset: 0,
    bevelSegments: 5,
  };

  const mainBodyGeo = new THREE.ExtrudeGeometry(bodyShape, extrudeSettings);
  mainBodyGeo.center();
  const mainBodyMesh = new THREE.Mesh(mainBodyGeo, paintMaterial);
  const bodyCenterY =
    bodyType === 'pickup' ? 0.96 : bodyType === 'suv' ? 0.9 : 0.8;
  mainBodyMesh.position.set(0, bodyCenterY, 0);
  carGroup.add(mainBodyMesh);

  // Bloque vidriado de cabina (parabrisas, ventanillas y luneta) ligeramente más ancho en ventanillas
  const glassExtrude: THREE.ExtrudeGeometryOptions = {
    steps: 1,
    depth: bodyWidth - 0.18,
    bevelEnabled: true,
    bevelThickness: 0.09,
    bevelSize: 0.06,
    bevelSegments: 4,
  };
  const glassGeo = new THREE.ExtrudeGeometry(cabinGlassShape, glassExtrude);
  glassGeo.center();
  const glassMesh = new THREE.Mesh(glassGeo, glassMaterial);
  const glassXOffset =
    bodyType === 'pickup' ? 0.14 : bodyType === 'sedan' ? -0.15 : -0.18;
  const glassYOffset =
    bodyType === 'pickup' ? 1.22 : bodyType === 'suv' ? 1.14 : 1.04;
  glassMesh.position.set(glassXOffset, glassYOffset, 0);
  carGroup.add(glassMesh);

  // Zócalo inferior oscuro (Splitter / Faldones laterales)
  const skirtMesh = new THREE.Mesh(
    new THREE.BoxGeometry(
      thechassisLength(bodyType),
      0.12,
      bodyWidth * 0.96
    ),
    trimDarkMaterial
  );
  skirtMesh.position.set(
    0,
    bodyType === 'pickup' || bodyType === 'suv' ? 0.36 : 0.27,
    0
  );
  carGroup.add(skirtMesh);

  // Detalles exclusivos por carrocería (Barra antivuelco en Pick-up / Barras de techo en SUV)
  if (bodyType === 'pickup') {
    // Interior oscuro de la caja de carga
    const bedFloor = new THREE.Mesh(
      new THREE.BoxGeometry(1.22, 0.08, bodyWidth * 0.78),
      trimDarkMaterial
    );
    bedFloor.position.set(-1.35, 0.98, 0);
    carGroup.add(bedFloor);

    // Barra San Antonio / Antivuelco deportiva
    [-1, 1].forEach((side) => {
      const bar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, 0.55, 12),
        trimDarkMaterial
      );
      bar.position.set(-0.88, 1.18, side * (bodyWidth * 0.36));
      bar.rotation.z = -0.52;
      carGroup.add(bar);
    });
  }

  if (bodyType === 'suv') {
    // Barras longitudinales de techo aluminio en SUV
    [-1, 1].forEach((side) => {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(1.35, 0.04, 0.04),
        silverAccentMat
      );
      rail.position.set(-0.35, 1.48, side * (bodyWidth * 0.34));
      carGroup.add(rail);
    });
  }

  // Espejos retrovisores laterales del color de la carrocería
  const mirrorX = bodyType === 'pickup' ? 0.58 : 0.42;
  const mirrorY =
    bodyType === 'pickup' ? 1.06 : bodyType === 'suv' ? 0.98 : 0.88;
  [-1, 1].forEach((side) => {
    const mirror = new THREE.Mesh(
      new THREE.BoxGeometry(0.16, 0.1, 0.14),
      paintMaterial
    );
    mirror.position.set(mirrorX, mirrorY, side * (bodyWidth * 0.52));
    carGroup.add(mirror);
  });

  // Parrilla frontal + Ópticas LED delanteras
  const frontX =
    bodyType === 'pickup'
      ? 1.98
      : bodyType === 'sedan'
      ? 1.84
      : bodyType === 'suv'
      ? 1.76
      : 1.68;
  const frontY =
    bodyType === 'pickup' ? 0.72 : bodyType === 'suv' ? 0.64 : 0.52;

  const grille = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.22, bodyWidth * 0.54),
    trimDarkMaterial
  );
  grille.position.set(frontX, frontY - 0.04, 0);
  carGroup.add(grille);

  [-1, 1].forEach((side) => {
    const headlight = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.1, 0.24),
      headlightMaterial
    );
    headlight.position.set(
      frontX - 0.02,
      frontY + 0.06,
      side * (bodyWidth * 0.34)
    );
    carGroup.add(headlight);
  });

  // Faros LED traseros
  const rearX =
    bodyType === 'pickup'
      ? -2.02
      : bodyType === 'sedan'
      ? -1.88
      : bodyType === 'suv'
      ? -1.74
      : -1.66;
  const rearY =
    bodyType === 'pickup' ? 0.78 : bodyType === 'suv' ? 0.82 : 0.72;

  [-1, 1].forEach((side) => {
    const taillight = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.11, 0.28),
      taillightMaterial
    );
    taillight.position.set(rearX, rearY, side * (bodyWidth * 0.34));
    carGroup.add(taillight);
  });

  // 4 Ruedas 3D con llantas de aleación
  const wheelPositions: [number, number, number][] = [
    [wheelBaseHalf, wheelRadius, bodyWidth * 0.46],
    [wheelBaseHalf, wheelRadius, -bodyWidth * 0.46],
    [-wheelBaseHalf, wheelRadius, bodyWidth * 0.46],
    [-wheelBaseHalf, wheelRadius, -bodyWidth * 0.46],
  ];

  wheelPositions.forEach(([wx, wy, wz]) => {
    const wheel = buildWheelMesh(wheelRadius, wheelWidth);
    wheel.position.set(wx, wy, wz);
    carGroup.add(wheel);
  });

  return carGroup;
}

function thechassisLength(bodyType: TipoCarroceria): number {
  switch (bodyType) {
    case 'pickup':
      return 3.85;
    case 'sedan':
      return 3.62;
    case 'suv':
      return 3.45;
    case 'hatchback':
    default:
      return 3.28;
  }
}

export const Car3DWebGLCanvas: React.FC<Car3DWebGLProps> = ({
  bodyType,
  paintHex,
  height = 175,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const paintMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const rootGroupRef = useRef<THREE.Group | null>(null);
  const currentBodyTypeRef = useRef<TipoCarroceria>(bodyType);

  // Actualizar color en tiempo real sin recrear la escena WebGL
  useEffect(() => {
    if (paintMaterialRef.current) {
      paintMaterialRef.current.color.set(paintHex);
    }
  }, [paintHex]);

  // Actualizar carrocería 3D cuando el usuario cambia entre Hatchback, Sedán, Pick-up o SUV
  useEffect(() => {
    if (
      rootGroupRef.current &&
      paintMaterialRef.current &&
      currentBodyTypeRef.current !== bodyType
    ) {
      currentBodyTypeRef.current = bodyType;
      const oldCar = rootGroupRef.current.getObjectByName('carMeshGroup');
      if (oldCar) {
        rootGroupRef.current.remove(oldCar);
      }
      const newCar = buildCarBodyGroup(bodyType, paintMaterialRef.current);
      newCar.name = 'carMeshGroup';
      rootGroupRef.current.add(newCar);
    }
  }, [bodyType]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 380;
    const canvasHeight = height;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      32,
      width / canvasHeight,
      0.1,
      100
    );
    camera.position.set(4.5, 2.05, 4.9);
    camera.lookAt(0, 0.62, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // Fondo 100% transparente sobre el blanco de la tarjeta
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, canvasHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Iluminación de estudio blanco (Apple / Porsche Studio Light Setup)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.35);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.9);
    keyLight.position.set(5, 8, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe0e7ff, 0.95);
    fillLight.position.set(-6, 4, -4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.7);
    rimLight.position.set(0, 6, -7);
    scene.add(rimLight);

    // Grupo raíz rotatorio (Auto + Sombra de contacto en el piso)
    const rootGroup = new THREE.Group();
    rootGroupRef.current = rootGroup;
    scene.add(rootGroup);

    // Sombra suave debajo del auto ("fondo blanco/transparente y una sombra abajo eso nomas")
    const shadowTex = createContactShadowTexture();
    if (shadowTex) {
      const shadowGeo = new THREE.PlaneGeometry(4.8, 2.35);
      const shadowMat = new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
      });
      const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.y = 0.01;
      rootGroup.add(shadowPlane);
    }

    // Material de pintura automotriz tricapa (Clearcoat PBR)
    const paintMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(paintHex),
      metalness: 0.25,
      roughness: 0.22,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    });
    paintMaterialRef.current = paintMaterial;

    const carMeshGroup = buildCarBodyGroup(bodyType, paintMaterial);
    carMeshGroup.name = 'carMeshGroup';
    rootGroup.add(carMeshGroup);

    // Ángulo inicial 3/4 delantero estilizado
    let targetRotationY = -0.52;
    let currentRotationY = -0.52;
    let isDragging = false;
    let prevX = 0;
    let idleTime = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (!interactive) return;
      isDragging = true;
      prevX = e.clientX;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevX;
      prevX = e.clientX;
      targetRotationY += deltaX * 0.012;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domElem = renderer.domElement;
    domElem.style.cursor = interactive ? 'grab' : 'default';
    domElem.style.touchAction = 'pan-y';
    domElem.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    let animFrameId: number;
    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      if (!isDragging) {
        idleTime += 0.012;
        targetRotationY += Math.sin(idleTime) * 0.0008;
      }
      currentRotationY += (targetRotationY - currentRotationY) * 0.12;
      rootGroup.rotation.y = currentRotationY;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameId);
      domElem.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      renderer.dispose();
    };
  }, [height, interactive]);

  if (Platform.OS !== 'web') {
    return <View style={{ height }} />;
  }

  return (
    <View style={[styles.canvasWrapper, { height }]}>
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: `${height}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  canvasWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
