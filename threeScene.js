/**
 * threeScene.js
 * Three.js 3D hero background for Nirere Evangeline Portfolio
 * — Animated particle field + floating geometric shapes
 */

(function () {
  'use strict';

  /* -------------------------------------------------- */
  /* Scene setup                                         */
  /* -------------------------------------------------- */
  const canvas   = document.getElementById('hero-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0); // transparent so CSS bg shows

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 30);

  /* -------------------------------------------------- */
  /* Colours                                             */
  /* -------------------------------------------------- */
  const BLUE   = 0x00d4ff;
  const PURPLE = 0xa855f7;

  /* -------------------------------------------------- */
  /* 1.  STAR / PARTICLE FIELD                          */
  /* -------------------------------------------------- */
  const PARTICLE_COUNT = 1800;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors    = new Float32Array(PARTICLE_COUNT * 3);

  const colBlue   = new THREE.Color(BLUE);
  const colPurple = new THREE.Color(PURPLE);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    positions[i3    ] = (Math.random() - 0.5) * 120;
    positions[i3 + 1] = (Math.random() - 0.5) * 120;
    positions[i3 + 2] = (Math.random() - 0.5) * 80;

    // Random mix between blue and purple
    const t   = Math.random();
    const col = colBlue.clone().lerp(colPurple, t);
    colors[i3    ] = col.r;
    colors[i3 + 1] = col.g;
    colors[i3 + 2] = col.b;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size:         0.18,
    vertexColors: true,
    transparent:  true,
    opacity:      0.85,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  /* -------------------------------------------------- */
  /* 2.  GRID LINES (futuristic floor grid)             */
  /* -------------------------------------------------- */
  const gridHelper = new THREE.GridHelper(80, 30, BLUE, PURPLE);
  gridHelper.position.y = -14;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity     = 0.12;
  scene.add(gridHelper);

  /* -------------------------------------------------- */
  /* 3.  CENTRAL ROTATING ICOSAHEDRON                   */
  /* -------------------------------------------------- */
  const icoGeo = new THREE.IcosahedronGeometry(4.5, 1);
  const icoMat = new THREE.MeshStandardMaterial({
    color:       BLUE,
    emissive:    BLUE,
    emissiveIntensity: 0.3,
    wireframe:   true,
  });
  const icosahedron = new THREE.Mesh(icoGeo, icoMat);
  scene.add(icosahedron);

  /* Inner solid core */
  const coreMat = new THREE.MeshStandardMaterial({
    color:             0x050510,
    emissive:          PURPLE,
    emissiveIntensity: 0.15,
    transparent:       true,
    opacity:           0.7,
  });
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(4.2, 0), coreMat);
  scene.add(core);

  /* -------------------------------------------------- */
  /* 4.  ORBITING SMALLER SHAPES                        */
  /* -------------------------------------------------- */
  const orbitGroup = new THREE.Group();
  scene.add(orbitGroup);

  function createOrbitShape(radius, orbitRadius, color, geo) {
    const mat   = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.5,
      wireframe: true,
    });
    const mesh  = new THREE.Mesh(geo, mat);
    const pivot = new THREE.Object3D();
    pivot.add(mesh);
    mesh.position.x = orbitRadius;
    orbitGroup.add(pivot);
    return { pivot, mesh };
  }

  const orbiters = [
    createOrbitShape(0.5, 8,  BLUE,   new THREE.TetrahedronGeometry(0.8)),
    createOrbitShape(0.5, 10, PURPLE, new THREE.OctahedronGeometry(0.7)),
    createOrbitShape(0.5, 9,  BLUE,   new THREE.DodecahedronGeometry(0.6)),
    createOrbitShape(0.5, 11, PURPLE, new THREE.TetrahedronGeometry(0.5)),
  ];

  // Initial angle spread
  orbiters.forEach((o, i) => { o.pivot.rotation.y = (i / orbiters.length) * Math.PI * 2; });

  /* -------------------------------------------------- */
  /* 5.  FLOATING RING                                  */
  /* -------------------------------------------------- */
  const torusGeo = new THREE.TorusGeometry(6.5, 0.05, 8, 80);
  const torusMat = new THREE.MeshBasicMaterial({ color: BLUE, transparent: true, opacity: 0.35 });
  const torus    = new THREE.Mesh(torusGeo, torusMat);
  torus.rotation.x = Math.PI / 2.5;
  scene.add(torus);

  /* -------------------------------------------------- */
  /* 6.  LIGHTING                                       */
  /* -------------------------------------------------- */
  scene.add(new THREE.AmbientLight(0xffffff, 0.05));

  const blueLight = new THREE.PointLight(BLUE, 3, 40);
  blueLight.position.set(0, 8, 10);
  scene.add(blueLight);

  const purpleLight = new THREE.PointLight(PURPLE, 2, 40);
  purpleLight.position.set(-10, -8, 5);
  scene.add(purpleLight);

  /* -------------------------------------------------- */
  /* 7.  MOUSE PARALLAX                                 */
  /* -------------------------------------------------- */
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* -------------------------------------------------- */
  /* 8.  RESIZE HANDLER                                 */
  /* -------------------------------------------------- */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* -------------------------------------------------- */
  /* 9.  ANIMATION LOOP                                 */
  /* -------------------------------------------------- */
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();

    // Smooth mouse follow
    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    // Rotate particles slowly
    particles.rotation.y =  elapsed * 0.015;
    particles.rotation.x =  elapsed * 0.007;

    // Rotate main icosahedron
    icosahedron.rotation.x = elapsed * 0.25;
    icosahedron.rotation.y = elapsed * 0.35;
    core.rotation.x        = -elapsed * 0.2;
    core.rotation.y        = -elapsed * 0.3;

    // Torus rotation
    torus.rotation.z = elapsed * 0.12;
    torus.rotation.y = elapsed * 0.08;

    // Orbit group overall rotation
    orbitGroup.rotation.y = elapsed * 0.4;

    // Per-orbiter self rotation
    orbiters.forEach((o, i) => {
      o.mesh.rotation.x = elapsed * (0.6 + i * 0.2);
      o.mesh.rotation.y = elapsed * (0.4 + i * 0.15);
    });

    // Camera parallax
    camera.position.x += (targetX * 2.5 - camera.position.x) * 0.05;
    camera.position.y += (-targetY * 1.5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    // Pulsing glow
    blueLight.intensity = 2.5 + Math.sin(elapsed * 2) * 0.8;
    purpleLight.intensity = 1.8 + Math.cos(elapsed * 1.5) * 0.6;

    renderer.render(scene, camera);
  }

  animate();

})();
