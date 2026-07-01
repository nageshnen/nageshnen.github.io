/* Sainagesh Veeravalli — Portfolio
   Computer-themed 3D hero: floating chip cubes, a circuit grid,
   and a calm particle drift (Three.js). */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("hero-canvas");
    var heroSection = document.getElementById("hero");
    if (!canvas || !heroSection || typeof THREE === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(52, 1, 0.1, 1000);
    camera.position.z = 65;

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    } catch (e) { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    var isMobile = window.innerWidth < 700;

    /* ── Palette ─────────────────────────────────────────────────── */
    var C = {
      cube:     0x7c6fcf,   // lavender chip cubes
      grid:     0x5a4fcf,   // circuit grid lines
      particle: 0x9b8fef,   // soft lavender dots
      accent:   0x0ea99b    // teal accent cube
    };

    /* ── 3 floating wireframe cubes (CPU / chip aesthetic) ───────── */
    var cubes = [];
    var cubeDefs = [
      { size: 11, pos: [-32,  10, -18], color: C.cube,   rotSpeed: [0.003, 0.004] },
      { size:  7, pos: [ 30, -12, -14], color: C.accent,  rotSpeed: [0.002, 0.005] },
      { size:  5, pos: [  6,  22, -30], color: C.cube,   rotSpeed: [0.004, 0.002] }
    ];
    cubeDefs.forEach(function (d) {
      var geo = new THREE.BoxGeometry(d.size, d.size, d.size);
      var mat = new THREE.MeshBasicMaterial({
        color: d.color,
        wireframe: true,
        transparent: true,
        opacity: 0.38
      });
      var mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(d.pos[0], d.pos[1], d.pos[2]);
      mesh.userData.rot = { x: d.rotSpeed[0], y: d.rotSpeed[1] };
      scene.add(mesh);
      cubes.push(mesh);
    });

    /* ── Flat circuit-board grid ─────────────────────────────────── */
    var gridHelper = new THREE.GridHelper(90, 12, C.grid, C.grid);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.13;
    gridHelper.rotation.x = Math.PI / 2.2;
    gridHelper.position.set(0, -6, -28);
    scene.add(gridHelper);

    /* ── Calm particle field ─────────────────────────────────────── */
    var count = isMobile ? 100 : 200;
    var pos = new Float32Array(count * 3);
    for (var i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 160;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    var ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    var ptMat = new THREE.PointsMaterial({
      color: C.particle,
      size: isMobile ? 1.4 : 1.1,
      transparent: true,
      opacity: 0.38,
      sizeAttenuation: true
    });
    var particles = new THREE.Points(ptGeo, ptMat);
    scene.add(particles);

    /* ── Resize ──────────────────────────────────────────────────── */
    function resize() {
      var w = heroSection.clientWidth;
      var h = heroSection.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    /* ── Mouse / scroll parallax ─────────────────────────────────── */
    var mouseX = 0, mouseY = 0;
    window.addEventListener("mousemove", function (e) {
      mouseX = e.clientX / window.innerWidth  - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
    });

    var scrollParallax = 0;
    window.addEventListener("scroll", function () {
      var hh = heroSection.clientHeight || 1;
      scrollParallax = Math.min(window.scrollY / hh, 1) * 14;
    }, { passive: true });

    /* ── Animation loop ──────────────────────────────────────────── */
    var running = true;
    document.addEventListener("visibilitychange", function () {
      var was = running;
      running = !document.hidden;
      if (running && !was) animate();
    });

    function animate() {
      if (!running) return;
      requestAnimationFrame(animate);

      cubes.forEach(function (c) {
        c.rotation.x += c.userData.rot.x;
        c.rotation.y += c.userData.rot.y;
      });

      particles.rotation.y += 0.0005;
      gridHelper.rotation.z += 0.0003;

      camera.position.x += (mouseX * 10 - camera.position.x) * 0.025;
      camera.position.y += ((-mouseY * 7 - scrollParallax) - camera.position.y) * 0.03;
      camera.position.z += ((65 + scrollParallax * 1.2) - camera.position.z) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }

    window.addEventListener("resize", resize);
    resize();
    animate();
  });
})();
