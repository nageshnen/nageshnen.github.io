/* Sainagesh Veeravalli — Portfolio
   3D particle + wireframe hero background (Three.js).
   Gracefully no-ops if Three.js failed to load, canvas is missing,
   or the user prefers reduced motion. */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("hero-canvas");
    var heroSection = document.getElementById("hero");
    if (!canvas || !heroSection || typeof THREE === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
    camera.position.z = 60;

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    } catch (e) {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    /* Particle field */
    var particleCount = window.innerWidth < 700 ? 90 : 220;
    var positions = new Float32Array(particleCount * 3);
    for (var i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 150;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 95;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 90;
    }
    var particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    var particleMat = new THREE.PointsMaterial({
      color: 0x3457d1,
      size: 1.3,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true
    });
    var particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    /* Floating wireframe shapes */
    var shapes = [];
    var geoDefs = [
      { geo: new THREE.IcosahedronGeometry(11, 0), color: 0x3457d1, pos: [26, 10, -20] },
      { geo: new THREE.TorusGeometry(8, 2, 8, 24), color: 0x0ea99b, pos: [-32, -14, -30] },
      { geo: new THREE.OctahedronGeometry(7, 0), color: 0x0ea99b, pos: [20, -20, -8] }
    ];
    geoDefs.forEach(function (def) {
      var mat = new THREE.MeshBasicMaterial({ color: def.color, wireframe: true, transparent: true, opacity: 0.5 });
      var mesh = new THREE.Mesh(def.geo, mat);
      mesh.position.set(def.pos[0], def.pos[1], def.pos[2]);
      mesh.userData.rotSpeed = { x: (Math.random() - 0.5) * 0.003, y: (Math.random() - 0.5) * 0.004 };
      scene.add(mesh);
      shapes.push(mesh);
    });

    function resize() {
      var w = heroSection.clientWidth;
      var h = heroSection.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    var mouseX = 0, mouseY = 0;
    window.addEventListener("mousemove", function (e) {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
    });

    /* Scroll parallax: the scene drifts and eases back as the hero scrolls out of view */
    var scrollParallax = 0;
    window.addEventListener("scroll", function () {
      var heroHeight = heroSection.clientHeight || 1;
      scrollParallax = Math.min(window.scrollY / heroHeight, 1) * 14;
    }, { passive: true });

    var running = true;
    document.addEventListener("visibilitychange", function () {
      var wasRunning = running;
      running = !document.hidden;
      if (running && !wasRunning) animate();
    });

    function animate() {
      if (!running) return;
      requestAnimationFrame(animate);
      particles.rotation.y += 0.0006;
      particles.rotation.x += 0.0002;
      shapes.forEach(function (m) {
        m.rotation.x += m.userData.rotSpeed.x;
        m.rotation.y += m.userData.rotSpeed.y;
      });
      camera.position.x += (mouseX * 12 - camera.position.x) * 0.02;
      camera.position.y += ((-mouseY * 8 - scrollParallax) - camera.position.y) * 0.03;
      camera.position.z += ((60 + scrollParallax * 1.2) - camera.position.z) * 0.03;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }

    window.addEventListener("resize", resize);
    resize();
    animate();
  });
})();
