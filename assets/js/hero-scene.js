/* Sainagesh Veeravalli — Portfolio
   "Ember" 3D hero, smooth edition: a lit, faceted molten core with an
   orbiting ring and glow satellites, soft ember sprites, and a warm
   backdrop halo (Three.js). No thin wireframe clutter — everything is
   shaded geometry or soft-gradient sprites so it renders clean. */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("hero-canvas");
    var heroSection = document.getElementById("hero");
    if (!canvas || !heroSection || typeof THREE === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.z = 60;

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });
    } catch (e) { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    var isMobile = window.innerWidth < 700;

    /* ── Soft radial glow texture, shared by halo / satellites / embers ── */
    function makeGlowTexture() {
      var c = document.createElement("canvas");
      c.width = c.height = 128;
      var ctx = c.getContext("2d");
      var g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.3, "rgba(255,255,255,0.55)");
      g.addColorStop(0.7, "rgba(255,255,255,0.12)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(c);
    }
    var glowTex = makeGlowTexture();

    /* ── Lighting: warm key + rim, dim amber fill ────────────────── */
    scene.add(new THREE.AmbientLight(0xff8a00, 0.22));
    var keyLight = new THREE.PointLight(0xff3d24, 1.7, 400);
    keyLight.position.set(45, 35, 45);
    scene.add(keyLight);
    var rimLight = new THREE.PointLight(0xff8a00, 1.25, 400);
    rimLight.position.set(-55, -25, 35);
    scene.add(rimLight);

    /* ── Molten core: faceted, lit, with a faint outer shell ─────── */
    var coreGroup = new THREE.Group();
    coreGroup.position.set(isMobile ? 0 : 26, 3, -14);
    scene.add(coreGroup);

    var core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(12, 1),
      new THREE.MeshStandardMaterial({
        color: 0x2b1410,
        emissive: 0x51100a,
        roughness: 0.32,
        metalness: 0.5,
        flatShading: true
      })
    );
    coreGroup.add(core);

    var shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(12.2, 1),
      new THREE.MeshBasicMaterial({ color: 0xff6a2a, wireframe: true, transparent: true, opacity: 0.14 })
    );
    coreGroup.add(shell);

    /* ── Orbit ring + glow satellites, in their own tilted plane ─── */
    var orbitPlane = new THREE.Group();
    orbitPlane.rotation.x = Math.PI / 2.35;
    orbitPlane.rotation.y = 0.35;
    coreGroup.add(orbitPlane);

    var ring = new THREE.Mesh(
      new THREE.TorusGeometry(20, 0.32, 32, 200),
      new THREE.MeshStandardMaterial({
        color: 0x2b1512,
        emissive: 0xff3d24,
        emissiveIntensity: 0.5,
        roughness: 0.4,
        metalness: 0.6
      })
    );
    orbitPlane.add(ring);

    var spinner = new THREE.Group();
    orbitPlane.add(spinner);
    var satColors = [0xff3d24, 0xff8a00, 0xffc46b];
    for (var s = 0; s < 3; s++) {
      var sat = new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTex,
        color: satColors[s],
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      }));
      var a = (s / 3) * Math.PI * 2;
      sat.position.set(Math.cos(a) * 20, Math.sin(a) * 20, 0);
      sat.scale.set(4.5, 4.5, 1);
      spinner.add(sat);
    }

    /* ── Warm halo behind the core ───────────────────────────────── */
    var halo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex,
      color: 0xff4a20,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }));
    halo.position.set(coreGroup.position.x, coreGroup.position.y, -34);
    halo.scale.set(95, 95, 1);
    scene.add(halo);

    /* ── Companion: small faceted octahedron, lit like the core ──── */
    var octa = new THREE.Mesh(
      new THREE.OctahedronGeometry(5, 0),
      new THREE.MeshStandardMaterial({
        color: 0x2b1410,
        emissive: 0x461208,
        roughness: 0.35,
        metalness: 0.5,
        flatShading: true
      })
    );
    octa.position.set(-34, 15, -22);
    scene.add(octa);

    /* ── Rising embers: fewer, larger, soft-glow sprites ─────────── */
    var count = isMobile ? 80 : 150;
    var positions = new Float32Array(count * 3);
    var colors = new Float32Array(count * 3);
    var speeds = new Float32Array(count);
    var emberColors = [0xff3d24, 0xff8a00, 0xffc46b];
    var tmpColor = new THREE.Color();

    for (var i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 170;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 110;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 70;
      speeds[i] = 0.015 + Math.random() * 0.045;
      tmpColor.setHex(emberColors[i % emberColors.length]);
      colors[i * 3]     = tmpColor.r;
      colors[i * 3 + 1] = tmpColor.g;
      colors[i * 3 + 2] = tmpColor.b;
    }

    var ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    ptGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    var embers = new THREE.Points(ptGeo, new THREE.PointsMaterial({
      map: glowTex,
      vertexColors: true,
      size: isMobile ? 3 : 2.4,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }));
    scene.add(embers);

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

    var clock = new THREE.Clock();

    function animate() {
      if (!running) return;
      requestAnimationFrame(animate);
      var t = clock.getElapsedTime();

      core.rotation.x += 0.0014;
      core.rotation.y += 0.002;
      shell.rotation.x -= 0.001;
      shell.rotation.y -= 0.0016;
      spinner.rotation.z += 0.0045;
      octa.rotation.x += 0.0025;
      octa.rotation.y += 0.0018;

      /* gentle breathing on the lights and halo — molten, not strobing */
      keyLight.intensity = 1.7 + Math.sin(t * 1.4) * 0.18;
      halo.material.opacity = 0.3 + Math.sin(t * 0.9) * 0.05;
      coreGroup.position.y = 3 + Math.sin(t * 0.6) * 1.2;

      /* embers drift upward, respawn at the bottom */
      var pos = ptGeo.attributes.position.array;
      for (var i = 0; i < count; i++) {
        pos[i * 3 + 1] += speeds[i];
        if (pos[i * 3 + 1] > 60) {
          pos[i * 3 + 1] = -60;
          pos[i * 3] = (Math.random() - 0.5) * 170;
        }
      }
      ptGeo.attributes.position.needsUpdate = true;

      camera.position.x += (mouseX * 10 - camera.position.x) * 0.025;
      camera.position.y += ((-mouseY * 7 - scrollParallax) - camera.position.y) * 0.03;
      camera.position.z += ((60 + scrollParallax * 1.2) - camera.position.z) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    }

    window.addEventListener("resize", resize);
    resize();
    animate();
  });
})();
