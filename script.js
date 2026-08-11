/**
 * HYBRID MOTION PORTFOLIO ENGINE — SUPROVO MALLICK
 * 
 * Hero & About: 150-frame WebP Image Sequence Canvas (#sequenceCanvas)
 * Projects → Contact: Cross-fades into the EXACT original Three.js Nexus WebGL background
 *   from dynosuprovo.github.io (particle storm, singularity shader, topo wireframe floor,
 *   instanced kinetic wall, raycasting, camera fly-through)
 */

document.addEventListener('DOMContentLoaded', () => {

  // ─── 0. PROCEDURAL SOUND ENGINE (Web Audio API) ────────────────────
  const SoundEngine = {
    ctx: null,
    init() {
      if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === 'suspended') this.ctx.resume();
    },
    playHover() {
      if (!this.ctx || this.ctx.state !== 'running') return;
      const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
      osc.type = 'sine'; osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
      osc.connect(gain); gain.connect(this.ctx.destination); osc.start(); osc.stop(this.ctx.currentTime + 0.1);
    },
    playClick() {
      if (!this.ctx || this.ctx.state !== 'running') return;
      const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
      osc.type = 'triangle'; osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      osc.connect(gain); gain.connect(this.ctx.destination); osc.start(); osc.stop(this.ctx.currentTime + 0.15);
    },
    playSweep(up = true) {
      if (!this.ctx || this.ctx.state !== 'running') return;
      const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
      osc.type = 'sine';
      if (up) { osc.frequency.setValueAtTime(200, this.ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.2); }
      else    { osc.frequency.setValueAtTime(600, this.ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.2); }
      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
      osc.connect(gain); gain.connect(this.ctx.destination); osc.start(); osc.stop(this.ctx.currentTime + 0.2);
    }
  };

  // Gyroscope Handler
  function handleOrientation(event) {
    let x = Math.max(-45, Math.min(45, event.gamma || 0));
    let y = Math.max(-45, Math.min(45, event.beta || 0));
    normX = x / 45;
    normY = -(y / 45);
  }

  window.addEventListener('pointerdown', () => {
    SoundEngine.init();
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission().then(s => { if (s === 'granted') window.addEventListener('deviceorientation', handleOrientation); }).catch(console.error);
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }
  }, { once: true });

  // Sound triggers for interactive elements
  document.body.addEventListener('click', (e) => {
    if (e.target.closest('.hover-target, a, button, .project-card, .skill-card, .editorial-card')) SoundEngine.playClick();
  });

  // ─── DOM Elements ──────────────────────────────────────────────────
  const seqCanvas  = document.getElementById('sequenceCanvas');
  const seqCtx     = seqCanvas ? seqCanvas.getContext('2d') : null;
  const webglCanvas = document.getElementById('webgl-canvas');
  const loader      = document.getElementById('loader');
  const loaderStatus = document.getElementById('loaderStatus');
  const loaderFill   = document.getElementById('loaderFill');
  const progressBar  = document.getElementById('progressBar');
  const hudFrame     = document.getElementById('hudFrame');
  const hudTime      = document.getElementById('hudTime');
  const hudFps       = document.getElementById('hudFps');
  const n1 = document.getElementById('n1');
  const n2 = document.getElementById('n2');
  const n3 = document.getElementById('n3');
  const n4 = document.getElementById('n4');
  const n5 = document.getElementById('n5');
  const secHero        = document.getElementById('secHero');
  const secAbout       = document.getElementById('secAbout');
  const secProjects    = document.getElementById('secProjects');
  const secCredentials = document.getElementById('secCredentials');
  const secContact     = document.getElementById('secContact');

  // ─── 1. THE NEXUS WEBGL ENGINE (exact from original portfolio) ─────
  let scene, camera, renderer, clock;
  const nexusData = {};
  let normX = 0, normY = 0;
  let scrollPercent = 0;

  // Mouse tracking
  document.addEventListener('mousemove', (e) => {
    normX = (e.clientX / window.innerWidth) * 2 - 1;
    normY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // GLSL Simplex Noise (exact from original)
  const noiseChunk = `
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i); 
      vec4 p = permute( permute( permute( 
                  i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m; return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }
  `;

  function initNexus() {
    if (!webglCanvas || typeof THREE === 'undefined') return;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1a1a24, 0.025);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 55);

    renderer = new THREE.WebGLRenderer({ canvas: webglCanvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    clock = new THREE.Clock();

    // ── Particle Storm (3000 particles, additive blending) ──
    (function setupStorm() {
      const count = 3000;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      nexusData.stormBases = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        let px = (Math.random() - 0.5) * 100;
        let py = (Math.random() - 0.5) * 50;
        let pz = (Math.random() * 100) - 20;
        pos[i*3] = px; pos[i*3+1] = py; pos[i*3+2] = pz;
        nexusData.stormBases[i*3] = px; nexusData.stormBases[i*3+1] = py; nexusData.stormBases[i*3+2] = pz;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({ color: 0x888888, size: 0.08, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending });
      nexusData.storm = new THREE.Points(geo, mat);
      scene.add(nexusData.storm);
    })();

    // ── Singularity (30,000 particles with custom shader) ──
    (function setupSingularity() {
      const count = 30000;
      const geo = new THREE.BufferGeometry();
      const rad = new Float32Array(count), ang = new Float32Array(count), spd = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        rad[i] = Math.pow(Math.random(), 2.0) * 12 + 0.5;
        ang[i] = Math.random() * Math.PI * 2;
        spd[i] = (1.0 / rad[i]) * (Math.random() * 1.5 + 0.5);
      }
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
      geo.setAttribute('aRad', new THREE.BufferAttribute(rad, 1));
      geo.setAttribute('aAng', new THREE.BufferAttribute(ang, 1));
      geo.setAttribute('aSpd', new THREE.BufferAttribute(spd, 1));

      nexusData.singularityUniforms = {
        uTime:   { value: 0 },
        uColor1: { value: new THREE.Color(0xffffff) },
        uColor2: { value: new THREE.Color(0xA855F7) }
      };

      const mat = new THREE.ShaderMaterial({
        uniforms: nexusData.singularityUniforms,
        vertexShader: `${noiseChunk} uniform float uTime; attribute float aRad; attribute float aAng; attribute float aSpd; varying float vRad;
          void main() { vRad=aRad; float cAng = aAng + uTime*aSpd;
          vec3 p = vec3(cos(cAng)*aRad, snoise(vec3(cos(cAng)*0.2, sin(cAng)*0.2, uTime*0.3))*aRad*0.2, sin(cAng)*aRad);
          vec4 mv = modelViewMatrix * vec4(p,1.0); gl_PointSize = 15.0/-mv.z; gl_Position = projectionMatrix * mv; }`,
        fragmentShader: `
          uniform vec3 uColor1; uniform vec3 uColor2; varying float vRad; 
          void main() { if(distance(gl_PointCoord, vec2(0.5))>0.5) discard;
          vec3 col = mix(uColor1, uColor2, smoothstep(0.5, 10.0, vRad));
          gl_FragColor = vec4(col, 0.6); }`,
        transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
      });

      nexusData.singularity = new THREE.Points(geo, mat);
      nexusData.singularity.position.set(12, 2, 25);
      nexusData.singularity.rotation.x = Math.PI / 6;
      scene.add(nexusData.singularity);
    })();

    // ── Topo Floor (150x150, 80x80 segments, WireframeGeometry + LineSegments) ──
    (function setupTopo() {
      const geo = new THREE.PlaneGeometry(150, 150, 80, 80);
      const mat = new THREE.LineBasicMaterial({ color: 0x444455, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending });
      const wire = new THREE.LineSegments(new THREE.WireframeGeometry(geo), mat);
      wire.rotation.x = -Math.PI / 2;
      wire.position.y = -12;
      wire.position.z = 10;
      scene.add(wire);
      nexusData.topo = wire;
    })();

    // ── Kinetic Wall (80x40 = 3200 instanced boxes) ──
    (function setupKinetic() {
      const cx = 80, cy = 40, total = cx * cy;
      const mat = new THREE.MeshStandardMaterial({ color: 0x22222a, roughness: 0.2, metalness: 0.8 });
      nexusData.kinetic = new THREE.InstancedMesh(new THREE.BoxGeometry(0.9, 0.9, 5), mat, total);
      nexusData.kineticBlocks = [];
      nexusData.dummy = new THREE.Object3D();

      let i = 0;
      for (let x = 0; x < cx; x++) {
        for (let y = 0; y < cy; y++) {
          let px = (x - cx / 2) * 0.95, py = (y - cy / 2) * 0.95;
          nexusData.kineticBlocks.push({ bx: px, by: py, z: 0, vz: 0 });
          nexusData.dummy.position.set(px, py, 0);
          nexusData.dummy.updateMatrix();
          nexusData.kinetic.setMatrixAt(i++, nexusData.dummy.matrix);
        }
      }
      nexusData.kinetic.position.z = -20;
      scene.add(nexusData.kinetic);

      nexusData.ambientLight = new THREE.AmbientLight(0x333344);
      scene.add(nexusData.ambientLight);
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
      dirLight.position.set(10, 20, 10);
      scene.add(dirLight);
      nexusData.pointLight = new THREE.PointLight(0xA855F7, 4, 40);
      scene.add(nexusData.pointLight);
    })();
  }

  // ── Nexus Render Frame (exact from original) ──
  function renderNexus() {
    if (!renderer || !scene || !camera || !clock) return;
    const time = clock.getElapsedTime();

    // Camera fly-through (zoom on scroll, parallax from mouse)
    const baseTargetZ = window.innerWidth < 768 ? 75 : 55;
    const scrollZoomMul = window.innerWidth < 768 ? 85 : 65;
    const targetZ = baseTargetZ - (scrollPercent * scrollZoomMul);
    const targetY = 5 - (scrollPercent * 3);

    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.position.x += (normX * 2 - camera.position.x) * 0.05;
    camera.lookAt(0, 0, -20);

    // Raycasting for kinetic wall & topo interactions
    const vec = new THREE.Vector3(normX, normY, 0.5);
    vec.unproject(camera);
    const dir = vec.sub(camera.position).normalize();
    const distWall = (-20 - camera.position.z) / dir.z;
    const mouseWallPos = camera.position.clone().add(dir.clone().multiplyScalar(distWall));
    const distFloor = (-12 - camera.position.y) / dir.y;
    const mouseFloorPos = camera.position.clone().add(dir.clone().multiplyScalar(distFloor));

    // Storm particles
    if (nexusData.storm && nexusData.stormBases) {
      const pos = nexusData.storm.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let bx = nexusData.stormBases[i*3], by = nexusData.stormBases[i*3+1], bz = nexusData.stormBases[i*3+2];
        pos.setXYZ(i, bx + Math.sin(time + by * 0.1) * 2.0, by + Math.cos(time + bx * 0.1) * 2.0, bz);
      }
      pos.needsUpdate = true;
      nexusData.storm.rotation.y = time * 0.02;
    }

    // Singularity
    if (nexusData.singularity) {
      nexusData.singularityUniforms.uTime.value = time;
      nexusData.singularity.rotation.y = time * 0.05;
      nexusData.singularity.rotation.x = Math.PI / 6 + normY * 0.05;
    }

    // Topo floor (wave + mouse crater)
    if (nexusData.topo) {
      const pos = nexusData.topo.geometry.attributes.position;
      for (let i = 0; i < pos.count; i += 2) {
        let x = pos.getX(i), y = pos.getY(i);
        let w = Math.sin(x * 0.1 + time) * 1.5 + Math.cos(y * 0.1 + time) * 1.5;
        let d = Math.sqrt(Math.pow(x - mouseFloorPos.x, 2) + Math.pow(y - (mouseFloorPos.z - 10), 2));
        let crater = d < 8 ? (8 - d) * 1.0 : 0;
        pos.setZ(i, w - crater);
        if (i + 1 < pos.count) pos.setZ(i + 1, w - crater);
      }
      pos.needsUpdate = true;
    }

    // Kinetic wall (mouse push + spring physics)
    if (nexusData.kinetic) {
      nexusData.pointLight.position.set(mouseWallPos.x, mouseWallPos.y, -16);
      let idx = 0;
      nexusData.kineticBlocks.forEach(b => {
        let d = Math.sqrt((b.bx - mouseWallPos.x) ** 2 + (b.by - mouseWallPos.y) ** 2);
        let forceMulti = Math.max(0.1, scrollPercent);
        let tz = d < 8 ? -(8 - d) * 3.0 * forceMulti : Math.sin(b.bx * 0.2 + time) * 0.3;
        b.vz += (tz - b.z) * 0.15;
        b.vz *= 0.8;
        b.z += b.vz;
        nexusData.dummy.position.set(b.bx, b.by, b.z);
        nexusData.dummy.updateMatrix();
        nexusData.kinetic.setMatrixAt(idx++, nexusData.dummy.matrix);
      });
      nexusData.kinetic.instanceMatrix.needsUpdate = true;
    }

    renderer.render(scene, camera);
  }

  // Theme sync for Nexus
  function updateNexusTheme(isLight) {
    if (!scene) return;
    if (isLight) {
      scene.fog.color.setHex(0xf4f0f8);
      if (nexusData.ambientLight) { nexusData.ambientLight.color.setHex(0xffffff); nexusData.ambientLight.intensity = 0.8; }
      if (nexusData.topo) nexusData.topo.material.color.setHex(0xb76e79);
      if (nexusData.pointLight) nexusData.pointLight.color.setHex(0xb76e79);
      if (nexusData.storm) nexusData.storm.material.color.setHex(0xb76e79);
      if (nexusData.kinetic) { nexusData.kinetic.material.color.setHex(0xe0dae6); nexusData.kinetic.material.roughness = 0.6; }
      if (nexusData.singularityUniforms) { nexusData.singularityUniforms.uColor1.value.setHex(0xffffff); nexusData.singularityUniforms.uColor2.value.setHex(0xb76e79); }
    } else {
      scene.fog.color.setHex(0x1a1a24);
      if (nexusData.ambientLight) { nexusData.ambientLight.color.setHex(0x333344); nexusData.ambientLight.intensity = 1.0; }
      if (nexusData.topo) nexusData.topo.material.color.setHex(0x444455);
      if (nexusData.pointLight) nexusData.pointLight.color.setHex(0xA855F7);
      if (nexusData.storm) nexusData.storm.material.color.setHex(0x888888);
      if (nexusData.kinetic) { nexusData.kinetic.material.color.setHex(0x22222a); nexusData.kinetic.material.roughness = 0.2; }
      if (nexusData.singularityUniforms) { nexusData.singularityUniforms.uColor1.value.setHex(0xffffff); nexusData.singularityUniforms.uColor2.value.setHex(0xA855F7); }
    }
  }

  // ─── Video Curve Data ─────────────────────────────────────────────
  const CURVES = [
    { t:0.00, b:11.1, e:1.1, c:50.4 }, { t:0.25, b:11.5, e:1.2, c:51.3 },
    { t:0.50, b:11.9, e:1.3, c:50.9 }, { t:0.75, b:12.5, e:1.5, c:52.5 },
    { t:1.00, b:13.2, e:1.6, c:53.6 }, { t:1.25, b:14.0, e:1.7, c:54.3 },
    { t:1.50, b:14.7, e:1.7, c:55.4 }, { t:1.75, b:15.6, e:1.8, c:56.0 },
    { t:2.00, b:16.6, e:1.9, c:56.2 }, { t:2.25, b:21.3, e:2.2, c:72.4 },
    { t:2.50, b:25.6, e:2.5, c:78.8 }, { t:2.75, b:30.4, e:2.9, c:74.7 },
    { t:3.00, b:33.8, e:3.2, c:77.4 }, { t:3.25, b:36.8, e:3.6, c:82.8 },
    { t:3.50, b:39.7, e:4.1, c:83.6 }, { t:3.75, b:41.9, e:4.6, c:85.6 },
    { t:4.00, b:45.2, e:5.3, c:84.7 }, { t:4.25, b:48.9, e:5.9, c:80.0 },
    { t:4.50, b:53.2, e:6.7, c:78.5 }, { t:4.75, b:56.7, e:7.7, c:78.0 },
    { t:5.00, b:60.3, e:8.5, c:78.7 }, { t:5.25, b:63.2, e:9.5, c:78.9 },
    { t:5.50, b:65.2, e:10.6, c:79.2 }, { t:5.75, b:67.6, e:10.9, c:78.0 },
    { t:6.00, b:70.5, e:11.8, c:75.0 }, { t:6.25, b:72.0, e:11.2, c:73.0 },
    { t:6.50, b:70.0, e:11.0, c:68.0 }, { t:6.75, b:70.0, e:10.5, c:65.0 },
    { t:7.00, b:73.0, e:10.4, c:65.0 }, { t:7.25, b:76.0, e:9.9,  c:65.0 },
    { t:7.50, b:67.0, e:9.6,  c:65.0 }, { t:7.75, b:65.0, e:8.8,  c:73.0 },
    { t:8.00, b:59.0, e:9.5,  c:57.0 }, { t:8.25, b:58.0, e:9.5,  c:55.0 },
    { t:8.50, b:58.0, e:9.4,  c:55.0 }, { t:8.75, b:57.0, e:9.3,  c:53.0 },
    { t:9.00, b:58.0, e:9.2,  c:53.0 }, { t:9.25, b:55.0, e:9.1,  c:51.0 },
    { t:9.50, b:56.0, e:9.3,  c:51.0 }, { t:10.0, b:54.0, e:8.9,  c:50.0 }
  ];

  // ─── 6 Stage Keyframes ────────────────────────────────────────────
  const HERO_KF        = [[0.0, 1.0], [1.4, 1.0], [2.0, 0.0]];
  const ABOUT_KF       = [[1.4, 0.0], [2.0, 1.0], [2.8, 1.0], [3.4, 0.0]];
  const SKILLS_KF      = [[2.8, 0.0], [3.4, 1.0], [4.4, 1.0], [5.0, 0.0]];
  const PROJECTS_KF    = [[4.4, 0.0], [5.0, 1.0], [6.4, 1.0], [7.0, 0.0]];
  const CREDENTIALS_KF = [[6.4, 0.0], [7.0, 1.0], [8.2, 1.0], [8.8, 0.0]];
  const CONTACT_KF     = [[8.2, 0.0], [8.8, 1.0], [10.0, 1.0]];

  // ─── Image Sequence Setup ──────────────────────────────────────────
  const TOTAL_FRAMES = 150;
  const frames = [];
  let loadedCount = 0;
  let smoothScrollRatio = 0;
  let currentFrameIdx = 0;
  let metricsAnimated = false;
  let fpsCount = 0, fpsLast = performance.now(), currentFps = 60;

  // ─── Resize ────────────────────────────────────────────────────────
  function resizeAll() {
    if (seqCanvas) { seqCanvas.width = window.innerWidth; seqCanvas.height = window.innerHeight; drawFrame(currentFrameIdx); }
    if (renderer && camera) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }
  window.addEventListener('resize', resizeAll);

  // ─── Preload 150 Frames ───────────────────────────────────────────
  function preloadFrames() {
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const numStr = String(i).padStart(4, '0');
      img.src = `frames/frame_${numStr}.jpg`;
      img.onload = () => {
        loadedCount++;
        const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
        if (loaderFill) loaderFill.style.width = pct + '%';
        if (loaderStatus) loaderStatus.textContent = `Preloading image sequence (${loadedCount}/${TOTAL_FRAMES})...`;
        if (loadedCount === TOTAL_FRAMES && loader) setTimeout(() => loader.classList.add('hidden'), 300);
      };
      img.onerror = () => {
        const fb = new Image();
        fb.src = `frames/frame_${numStr}.webp`;
        fb.onload = () => { frames[i - 1] = fb; loadedCount++; if (loadedCount === TOTAL_FRAMES && loader) setTimeout(() => loader.classList.add('hidden'), 300); };
      };
      frames.push(img);
    }
  }

  // ─── Draw Frame ───────────────────────────────────────────────────
  function drawFrame(idx) {
    if (!seqCtx || !seqCanvas) return;
    const img = frames[idx];
    if (!img || !img.complete || img.naturalWidth === 0) return;
    const cw = seqCanvas.width, ch = seqCanvas.height;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const iA = iw / ih, cA = cw / ch;
    let rw, rh, ox, oy;
    if (cA > iA) { rw = cw; rh = cw / iA; ox = 0; oy = (ch - rh) / 2; }
    else { rh = ch; rw = ch * iA; ox = (cw - rw) / 2; oy = 0; }
    seqCtx.clearRect(0, 0, cw, ch);
    seqCtx.drawImage(img, ox, oy, rw, rh);
  }

  // ─── Math helpers ─────────────────────────────────────────────────
  function lerp(a, b, t) { return a + (b - a) * t; }

  function sampleKF(kf, time) {
    if (time <= kf[0][0]) return kf[0][1];
    if (time >= kf[kf.length-1][0]) return kf[kf.length-1][1];
    for (let i = 0; i < kf.length - 1; i++) {
      const [t0, v0] = kf[i], [t1, v1] = kf[i + 1];
      if (time >= t0 && time <= t1) { const p = (time - t0) / (t1 - t0); return lerp(v0, v1, p * p * (3 - 2 * p)); }
    }
    return 0;
  }

  function sampleCurve(time, prop) {
    if (time <= 0) return CURVES[0][prop];
    if (time >= 10.0) return CURVES[CURVES.length-1][prop];
    for (let i = 0; i < CURVES.length - 1; i++) {
      if (time >= CURVES[i].t && time <= CURVES[i+1].t) {
        const p = (time - CURVES[i].t) / (CURVES[i+1].t - CURVES[i].t);
        return lerp(CURVES[i][prop], CURVES[i+1][prop], p);
      }
    }
    return 0;
  }

  // ─── 3D Spatial Depth Transform ───────────────────────────────────
  function apply3DSpatialTransform(el, opacity, enterStart, peakStart, peakEnd, exitEnd, time) {
    if (!el) return;
    const op = Math.max(0, Math.min(1, opacity));
    el.style.opacity = op.toFixed(4);
    if (op < 0.005) {
      el.style.transform = 'translate3d(0, 0, -140px) scale(0.75)';
      el.style.filter = 'blur(12px)';
      el.classList.remove('active');
      return;
    }
    el.classList.add('active');
    let scale = 1.0, translateZ = 0, blur = 0;
    if (time < peakStart) {
      const p = Math.max(0, Math.min(1, (time - enterStart) / Math.max(0.01, peakStart - enterStart)));
      scale = lerp(0.78, 1.0, p); translateZ = lerp(-120, 0, p); blur = lerp(8, 0, p);
    } else if (time > peakEnd) {
      const p = Math.max(0, Math.min(1, (time - peakEnd) / Math.max(0.01, exitEnd - peakEnd)));
      scale = lerp(1.0, 1.12, p); translateZ = lerp(0, 80, p); blur = lerp(0, 8, p);
    }
    el.style.transform = `translate3d(0, 0, ${translateZ.toFixed(1)}px) scale(${scale.toFixed(4)})`;
    el.style.filter = `blur(${blur.toFixed(1)}px)`;
  }

  // ─── MAIN ENGINE LOOP ──────────────────────────────────────────────
  function engineLoop(now) {
    fpsCount++;
    if (now - fpsLast >= 1000) {
      currentFps = Math.round((fpsCount * 1000) / (now - fpsLast));
      if (hudFps) hudFps.textContent = currentFps;
      fpsCount = 0; fpsLast = now;
    }

    const scrollY = window.scrollY || window.pageYOffset;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const rawRatio = Math.max(0, Math.min(1, scrollY / maxScroll));
    smoothScrollRatio += (rawRatio - smoothScrollRatio) * 0.15;
    scrollPercent = smoothScrollRatio; // For Nexus camera fly-through

    const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.floor(smoothScrollRatio * TOTAL_FRAMES));
    const videoTime = smoothScrollRatio * 10.0;

    // 1. Draw Canvas Frame
    if (frameIndex !== currentFrameIdx) { currentFrameIdx = frameIndex; drawFrame(currentFrameIdx); }

    // 2. HYBRID BACKGROUND CROSS-FADE
    // Frames run till About section (t≈3.8), then Nexus takes over
    let seqOpacity = 1.0, webglOpacity = 0.0;
    if (videoTime < 3.2) { seqOpacity = 1.0; webglOpacity = 0.0; }
    else if (videoTime <= 4.2) { const p = (videoTime - 3.2) / 1.0; seqOpacity = 1.0 - p; webglOpacity = p; }
    else { seqOpacity = 0.0; webglOpacity = 1.0; }
    if (seqCanvas) seqCanvas.style.opacity = seqOpacity.toFixed(3);
    if (webglCanvas) webglCanvas.style.opacity = webglOpacity.toFixed(3);

    // 3. Render Nexus WebGL
    renderNexus();

    // 4. Section opacities
    const heroOp   = sampleKF(HERO_KF, videoTime);
    const aboutOp  = sampleKF(ABOUT_KF, videoTime);
    const skillsOp = sampleKF(SKILLS_KF, videoTime);
    const projOp   = sampleKF(PROJECTS_KF, videoTime);
    const credOp   = sampleKF(CREDENTIALS_KF, videoTime);
    const contOp   = sampleKF(CONTACT_KF, videoTime);

    // 5. 3D Spatial Transforms
    apply3DSpatialTransform(secHero,        heroOp,   0.0, 0.0, 1.4, 2.0, videoTime);
    apply3DSpatialTransform(secAbout,       aboutOp,  1.4, 2.0, 2.8, 3.4, videoTime);
    apply3DSpatialTransform(secSkills,      skillsOp, 2.8, 3.4, 4.4, 5.0, videoTime);
    apply3DSpatialTransform(secProjects,    projOp,   4.4, 5.0, 6.4, 7.0, videoTime);
    apply3DSpatialTransform(secCredentials, credOp,   6.4, 7.0, 8.2, 8.8, videoTime);
    apply3DSpatialTransform(secContact,     contOp,   8.2, 8.8, 10.0, 10.5, videoTime);

    // 6. Reactive CSS Custom Properties
    const centerB = sampleCurve(videoTime, 'c');
    const edgeD   = sampleCurve(videoTime, 'e');
    const bright  = sampleCurve(videoTime, 'b');
    document.documentElement.style.setProperty('--hero-glow', Math.max(0, Math.min(1, (centerB - 50) / 36)).toFixed(3));
    document.documentElement.style.setProperty('--card-glow', Math.max(0, Math.min(1, (edgeD - 3) / 8.8)).toFixed(3));
    document.documentElement.style.setProperty('--v-bright', (bright / 76).toFixed(3));

    // 7. HUD
    if (progressBar) progressBar.style.width = (smoothScrollRatio * 100).toFixed(1) + '%';
    if (hudFrame) hudFrame.textContent = `${String(currentFrameIdx + 1).padStart(3, '0')}/${TOTAL_FRAMES}`;
    if (hudTime) hudTime.textContent = videoTime.toFixed(2) + 's';
    if (n1) n1.classList.toggle('active', videoTime < 1.8);
    if (n2) n2.classList.toggle('active', videoTime >= 1.8 && videoTime < 3.8);
    if (n3) n3.classList.toggle('active', videoTime >= 3.8 && videoTime < 6.2);
    if (n4) n4.classList.toggle('active', videoTime >= 6.2 && videoTime < 8.2);
    if (n5) n5.classList.toggle('active', videoTime >= 8.2);

    // 8. Metrics animation
    if (credOp > 0.5 && !metricsAnimated) { metricsAnimated = true; animateMetrics(); }
    if (credOp < 0.01) { metricsAnimated = false; resetMetrics(); }

    requestAnimationFrame(engineLoop);
  }

  // ─── Counter Animations ───────────────────────────────────────────
  function animateMetrics() {
    document.querySelectorAll('.m-num').forEach(el => {
      const target = parseFloat(el.dataset.target), prefix = el.dataset.prefix || '', suffix = el.dataset.suffix || '';
      const isFloat = target % 1 !== 0, start = performance.now(), dur = 1300;
      function step(now) {
        const p = Math.min(1, (now - start) / dur), ease = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + (isFloat ? (target * ease).toFixed(1) : Math.floor(target * ease)) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
    document.querySelectorAll('.m-fill').forEach(bar => { const w = bar.dataset.width; if (w) setTimeout(() => { bar.style.width = w; }, 100); });
  }
  function resetMetrics() {
    document.querySelectorAll('.m-num').forEach(el => { el.textContent = (el.dataset.prefix||'') + '0' + (el.dataset.suffix||''); });
    document.querySelectorAll('.m-fill').forEach(bar => { bar.style.width = '0%'; });
  }

  // Theme toggle listener
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      setTimeout(() => updateNexusTheme(document.body.classList.contains('light-theme')), 50);
    });
  }

  // ─── RESTORED LOGIC FROM ORIGINAL ──────────────────────────────────
  
  // 1. CURSOR LOGIC
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  let mouseX = window.innerWidth/2, mouseY = window.innerHeight/2;
  let ringX = mouseX, ringY = mouseY;

  document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      if(cursorDot) {
          cursorDot.style.left = mouseX + 'px'; 
          cursorDot.style.top = mouseY + 'px';
      }
  });

  function animateCursor() {
      ringX += (mouseX - ringX) * 0.15; 
      ringY += (mouseY - ringY) * 0.15;
      if(cursorRing) {
          cursorRing.style.left = ringX + 'px'; 
          cursorRing.style.top = ringY + 'px';
      }
      requestAnimationFrame(animateCursor);
  }
  animateCursor();

  function initCursorHover() {
      document.body.addEventListener('mouseover', (e) => {
          if (!cursorDot || !cursorRing) return;
          const target = e.target.closest('.hover-target, a, button, h1, h2, h3, .project-card, .skill-card, .editorial-card, .cert-link, .nav-link, .nav-logo, .contact-link-icon');
          if (target) {
              // if (!target.contains(e.relatedTarget)) SoundEngine.playHover();
              cursorDot.style.width = '70px'; cursorDot.style.height = '70px';
              cursorRing.style.width = '0px'; cursorRing.style.height = '0px';
              cursorRing.style.opacity = '0';
          }
      });
      document.body.addEventListener('mouseout', (e) => {
          if (!cursorDot || !cursorRing) return;
          const target = e.target.closest('.hover-target, a, button, h1, h2, h3, .project-card, .skill-card, .editorial-card, .cert-link, .nav-link, .nav-logo, .contact-link-icon');
          if (target && !target.contains(e.relatedTarget)) {
              cursorDot.style.width = '8px'; cursorDot.style.height = '8px';
              cursorRing.style.width = '36px'; cursorRing.style.height = '36px';
              cursorRing.style.opacity = '1';
          }
      });
  }
  initCursorHover();

  // 2. SKILLS DATA & INJECTION
  const skillsData = [
      { category: 'Languages', items: ['Python', 'JavaScript (ES6+)', 'TypeScript', 'SQL', 'C++'] },
      { category: 'AI / GenAI', items: ['LangChain', 'LangGraph', 'Gemini API', 'HuggingFace', 'Ollama'] },
      { category: 'Machine Learning', items: ['TensorFlow', 'PyTorch', 'Scikit-Learn', 'Pandas', 'OpenCV'] },
      { category: 'Backend & APIs', items: ['FastAPI', 'Node.js', 'Express', 'REST', 'GraphQL'] },
      { category: 'Databases', items: ['ChromaDB', 'PostgreSQL', 'MongoDB', 'Redis', 'Pinecone'] },
      { category: 'Cloud & DevOps', items: ['AWS', 'Docker', 'Vercel', 'Git', 'Linux'] }
  ];

  const skillsGrid = document.getElementById('skills-grid');
  if (skillsGrid) {
      skillsData.forEach(cat => {
          let html = `<div class='skill-card hover-target'><h3 class='skill-cat-title'>${cat.category}</h3><div class='skill-tags'>`;
          cat.items.forEach(item => { html += `<span class='skill-tag'>${item}</span>`; });
          html += `</div></div>`;
          skillsGrid.innerHTML += html;
      });
  }

  // 3. PROJECTS INJECTION
  const PROJECTS_DATA = [
      {
          "id": "project-01",
          "title": "Wheat Guardian - AI Disease Detection",
          "main_desc": "AI-Based Wheat Disease Detection System using EfficientNetV2 and FastAPI.",
          "stack": ["TensorFlow", "EfficientNetV2", "FastAPI", "OpenCV", "Docker"],
          "links": { "live": "https://wheat-analysis-app.vercel.app", "github": null }
      },
      {
          "id": "project-02",
          "title": "Aahar - AI-Powered Diet & Wellness Companion",
          "main_desc": "RAG-based nutrition assistant with vector retrieval for Indian diet planning.",
          "stack": ["LangChain", "Gemini API", "ChromaDB", "FastAPI", "Next.js"],
          "links": { "live": "https://aahar-react.vercel.app/", "github": null }
      },
      {
          "id": "project-05",
          "title": "Intent Compiler – Multi-Agent AI Architecture Generator",
          "main_desc": "AI system that converts product ideas into structured system architecture using LLM orchestration.",
          "stack": ["LangGraph", "Groq LLaMA", "Streamlit", "Python"],
          "links": { "live": "https://intent-compiler-bydyno.streamlit.app/", "github": "https://github.com/DYNOSuprovo/intent-compiler" }
      }
  ];

  const projContainer = document.getElementById('project-list');
  if (projContainer && typeof PROJECTS_DATA !== 'undefined') {
      PROJECTS_DATA.forEach((p, idx) => {
          let stackHtml = p.stack.map(s => `<span class='tag-pill ${s.includes('Tensor')||s.includes('Lang')?'accent':''}'>${s}</span>`).join('');
          projContainer.innerHTML += `
              <div class='project-card hover-target' onclick='openProjectModal(${idx})'>
                  <h3 class='p-title'>${p.title}</h3>
                  <p class='p-desc'>${p.main_desc}</p>
                  <div class='p-tags' style='display:flex; flex-wrap:wrap; gap:5px; margin-top:10px;'>${stackHtml}</div>
              </div>
          `;
      });
  }

  // 4. LOADER DYNAMIC TEXT
  let loadProgress = 0;
  const loaderBar = document.getElementById('loader-bar');
  const loaderText = document.getElementById('loader-percentage');
  const loaderWrapper = document.getElementById('loader');
  const dynamicSuuu = document.getElementById('dynamic-suuu');
  let suuuText = 'S';
  let timeAccumulator = 0;
  
  function simulateLoading() {
      let increment = 2 * (Math.random() * 0.8 + 0.6); 
      loadProgress += increment;
      timeAccumulator += 50;
      
      if (timeAccumulator > 150 && loadProgress < 98) { 
          suuuText += loadProgress < 75 ? 'u' : '!';
          if (dynamicSuuu) dynamicSuuu.innerText = suuuText;
          timeAccumulator = 0;
      }

      if (loadProgress >= 100) {
          loadProgress = 100;
          if(loaderBar) loaderBar.style.width = '100%';
          if(loaderText) loaderText.innerHTML = '<span class=\"loader-ready-text\">SYSTEM READY</span>';
          setTimeout(() => {
              if(dynamicSuuu) {
                  dynamicSuuu.innerText = 'SUPROVO';
                  dynamicSuuu.style.animation = 'none';
                  dynamicSuuu.style.textShadow = 'none';
                  dynamicSuuu.style.color = 'var(--text-main)';
                  dynamicSuuu.style.letterSpacing = '1px';
              }
              if(loaderWrapper) {
                  loaderWrapper.style.transition = "transform 1s cubic-bezier(0.77, 0, 0.175, 1), border-radius 1s cubic-bezier(0.77, 0, 0.175, 1)";
                  loaderWrapper.classList.add('slide-out');
              }
              document.body.classList.add('app-ready');
              setTimeout(() => { if(loaderWrapper) loaderWrapper.style.display = 'none'; }, 1000);
          }, 400);
      } else {
          if(loaderBar) loaderBar.style.width = loadProgress + '%';
          if(loaderText) loaderText.innerText = Math.floor(loadProgress) + '%';
          setTimeout(simulateLoading, 50);
      }
  }

  // 5. AI SUMMARY FETCH LOGIC
  const aiSummaryModal = document.getElementById('ai-summary-modal');
  const aiSummaryText = document.getElementById('ai-summary-text');
  const aiCloseBtn = document.getElementById('ai-summary-close-btn');

  window.fetchAISummary = function(projectIndex) {
      if(!aiSummaryModal || !aiSummaryText) return;
      const p = PROJECTS_DATA[projectIndex];
      aiSummaryModal.style.display = 'flex';
      aiSummaryText.innerHTML = `<i>Analyzing architecture for ${p.title}...</i>`;
      
      // Simulate Gemini API response
      setTimeout(() => {
          aiSummaryText.innerHTML = `<strong>AI Analysis:</strong> ${p.title} is an advanced implementation utilizing ${p.stack.join(', ')}. The architecture focuses on optimizing latency and integrating state-of-the-art models for real-world impact.`;
      }, 1500);
  }

  if (aiCloseBtn) {
      aiCloseBtn.addEventListener('click', () => { aiSummaryModal.style.display = 'none'; });
  }

  window.openProjectModal = function(idx) {
      fetchAISummary(idx);
  };

  // ─── INIT & START ──────────────────────────────────────────────────
  initNexus();
  resizeAll();
  requestAnimationFrame(engineLoop);
  preloadFrames();
  simulateLoading();
});
