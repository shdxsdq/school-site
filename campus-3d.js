import * as THREE from './vendor/three/build/three.module.js';
import { OrbitControls } from './vendor/three/examples/jsm/controls/OrbitControls.js';

const canvas = document.querySelector('#campus-canvas');

if (canvas) {
  try {
    const stage = canvas.closest('.campus-stage');
    const engineStatus = document.querySelector('#campus-engine-status');
    const tourToggle = document.querySelector('#tour-toggle');
    const resetButton = document.querySelector('#reset-view');
    const navButtons = Array.from(document.querySelectorAll('.campus-quicknav button[data-spot]'));
    const viewButtons = Array.from(document.querySelectorAll('.campus-viewbar button[data-view]'));

    const panel = {
      image: document.querySelector('#spot-image'),
      type: document.querySelector('#spot-type'),
      name: document.querySelector('#spot-name'),
      subtitle: document.querySelector('#spot-subtitle'),
      description: document.querySelector('#spot-description'),
      facts: document.querySelector('#spot-facts'),
      tags: document.querySelector('#spot-tags'),
    };

    const labels = {
      ready: (revision) => `Three.js 引擎运行中 · r${revision}`,
      tourStart: '自动巡览',
      tourStop: '停止巡览',
      initError: '三维导览初始化失败',
    };

    const spotData = {
      overview: {
        type: '校园总览',
        name: '南部县第五小学三维导览',
        subtitle: '保持实时渲染，可持续拖拽和切换观察角度',
        description: '当前页面不会停在静态截图，而是持续进行实时渲染。你可以自由拖拽旋转，也可以点击下方视角按钮切换到校门、教学楼、操场或俯瞰观察方式。',
        image: './assets/images/hero-home-1.jpg',
        tags: ['实时渲染', '自由观察', '视角切换'],
        facts: [
          ['渲染状态', '持续运行'],
          ['观察方式', '拖拽 / 缩放 / 按钮切换'],
          ['布局依据', '校园平面示意'],
        ],
        camera: [16, 18, 16],
        target: [0, 0.8, 1.2],
      },
      gate: {
        type: '校园入口',
        name: '校门入口',
        subtitle: '右下角主进入路线的起点视角',
        description: '从校门方向观察整个校园，更接近访客进入校园后的第一印象。后续可以继续叠加真实校门照片、导览牌和安保信息。',
        image: './assets/images/hero-home-1.jpg',
        tags: ['入口视角', '访客动线', '右下区域'],
        facts: [
          ['空间位置', '右下角'],
          ['适合展示', '校门形象 / 导览牌'],
          ['观察重点', '入校方向'],
        ],
        camera: [17.5, 8.5, 2.8],
        target: [10.2, 0.6, -6.2],
      },
      teaching: {
        type: '教学核心区',
        name: '主教学楼',
        subtitle: '左上 U 形楼体的主观察节点',
        description: '这个节点对应左上区域的 U 形主教学楼。适合继续接入教学空间、班级楼层、走廊文化和课堂照片。',
        image: './assets/images/hero-home-2.jpg',
        tags: ['U 形楼', '教学区', '左上区域'],
        facts: [
          ['空间位置', '左上区域'],
          ['建筑形态', 'U 形楼'],
          ['主要功能', '课堂教学'],
        ],
        camera: [-8.6, 10.5, 13.6],
        target: [-5.4, 1.3, 6.5],
      },
      complex: {
        type: '综合功能区',
        name: '综合楼',
        subtitle: '右上条形楼体的观察节点',
        description: '这个区域适合承载功能教室、综合教室或行政空间介绍，也方便后续加入真实平面图和分层说明。',
        image: './assets/images/hero-home-3.jpg',
        tags: ['条形楼', '右上区域', '功能空间'],
        facts: [
          ['空间位置', '右上区域'],
          ['建筑形态', '条形楼'],
          ['推荐内容', '功能教室介绍'],
        ],
        camera: [12.5, 10.2, 12.8],
        target: [6.9, 1.3, 6.1],
      },
      library: {
        type: '左侧独立楼',
        name: '办公楼',
        subtitle: '左侧小楼体，适合作为办公或教研节点',
        description: '左侧独立楼在整体布局上更适合作为办公楼或教研楼来展示，便于后续承接办公室、会议室或教师发展空间内容。',
        image: './assets/images/featured/featured-03.jpg',
        tags: ['独立楼', '办公空间', '左侧区域'],
        facts: [
          ['空间位置', '左侧区域'],
          ['空间特征', '独立楼体'],
          ['建议方向', '办公 / 教研'],
        ],
        camera: [-15.2, 8.5, 5.8],
        target: [-11.2, 1.1, 0.9],
      },
      canteen: {
        type: '中部连接区',
        name: '功能馆',
        subtitle: '中间连接体块，用作功能馆或连廊节点',
        description: '中部这条细长体块适合做成功能馆、连廊或公共服务空间的节点，后续可以按真实功能名称继续替换。',
        image: './assets/images/featured/featured-02.jpg',
        tags: ['中部区域', '连接节点', '可继续重命名'],
        facts: [
          ['空间位置', '中部区域'],
          ['形态特征', '细长连接体块'],
          ['后续处理', '替换为真实名称'],
        ],
        camera: [2.8, 9.2, 12.6],
        target: [1.5, 1.1, 5.4],
      },
      playground: {
        type: '体育活动区',
        name: '操场',
        subtitle: '下方大面积活动区域的观察节点',
        description: '操场区域适合持续观察体育活动空间关系，也便于后续接入运动会、升旗仪式和课间活动内容。',
        image: './assets/images/featured/featured-05.jpg',
        tags: ['下方区域', '体育活动', '开放空间'],
        facts: [
          ['空间位置', '中下区域'],
          ['区域形态', '操场 / 活动场地'],
          ['适合展示', '体育与集会'],
        ],
        camera: [-1.6, 10.5, -15.5],
        target: [-0.8, 0.4, -4.2],
      },
    };

    const viewPresets = {
      overview: { camera: [16, 18, 16], target: [0, 0.8, 1.2] },
      gate: { camera: [18, 8.6, 3.2], target: [8.8, 0.9, -4.8] },
      teaching: { camera: [-11, 10.5, 14.2], target: [-5.8, 1.2, 6.3] },
      playground: { camera: [-1.8, 11.2, -16.8], target: [-0.7, 0.5, -4.1] },
      top: { camera: [0.2, 24, 0.2], target: [0, 0, 0] },
    };

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#d8e5ee');
    scene.fog = new THREE.Fog('#d8e5ee', 24, 58);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 160);
    camera.position.set(...viewPresets.overview.camera);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 8;
    controls.maxDistance = 36;
    controls.maxPolarAngle = Math.PI / 2.02;
    controls.autoRotate = false;
    controls.target.set(...viewPresets.overview.target);
    controls.update();

    canvas.dataset.engine = `three.js r${THREE.REVISION}`;
    if (engineStatus) engineStatus.textContent = labels.ready(THREE.REVISION);

    const root = new THREE.Group();
    scene.add(root);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const spotGroups = new Map();
    const interactiveMeshes = [];

    let selectedSpot = 'overview';
    let activeView = 'overview';
    let hoverSpot = null;
    let tourTimer = null;
    let tourIndex = 0;

    const desiredCamera = new THREE.Vector3(...viewPresets.overview.camera);
    const desiredTarget = new THREE.Vector3(...viewPresets.overview.target);

    const ambient = new THREE.HemisphereLight('#f8fbff', '#5d7186', 1.35);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight('#fff8e0', 1.85);
    sun.position.set(14, 24, 18);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -24;
    sun.shadow.camera.right = 24;
    sun.shadow.camera.top = 24;
    sun.shadow.camera.bottom = -24;
    scene.add(sun);

    const fill = new THREE.DirectionalLight('#b9d8ff', 0.62);
    fill.position.set(-16, 18, -14);
    scene.add(fill);

    function roundRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }

    function roundedLabel(text, theme = '#12386d') {
      const labelCanvas = document.createElement('canvas');
      labelCanvas.width = 320;
      labelCanvas.height = 104;
      const ctx = labelCanvas.getContext('2d');

      ctx.clearRect(0, 0, labelCanvas.width, labelCanvas.height);
      ctx.fillStyle = 'rgba(10, 31, 60, 0.15)';
      roundRect(ctx, 18, 22, 284, 52, 24);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      roundRect(ctx, 12, 14, 284, 52, 24);
      ctx.fill();

      ctx.fillStyle = theme;
      ctx.font = '700 30px Microsoft YaHei';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, labelCanvas.width / 2, labelCanvas.height / 2 - 4);

      const texture = new THREE.CanvasTexture(labelCanvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(4.8, 1.56, 1);
      return sprite;
    }

    function createSiteTexture() {
      const mapCanvas = document.createElement('canvas');
      mapCanvas.width = 1400;
      mapCanvas.height = 1100;
      const ctx = mapCanvas.getContext('2d');

      ctx.fillStyle = '#dfeaf1';
      ctx.fillRect(0, 0, mapCanvas.width, mapCanvas.height);

      ctx.strokeStyle = '#cad2d9';
      ctx.lineWidth = 44;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const roads = [
        [[260, 150], [760, 115], [1080, 130], [1180, 260], [1120, 410], [930, 505], [620, 510], [390, 440], [300, 300], [260, 150]],
        [[210, 480], [120, 565], [110, 695], [210, 785], [345, 770], [380, 635], [315, 520], [210, 480]],
        [[650, 515], [760, 650], [925, 812], [1130, 1020]],
        [[630, 525], [540, 650], [500, 820]],
        [[695, 505], [810, 260]],
      ];

      roads.forEach((points) => {
        ctx.beginPath();
        points.forEach(([x, y], index) => {
          if (index === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      });

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 28;
      roads.forEach((points) => {
        ctx.beginPath();
        points.forEach(([x, y], index) => {
          if (index === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
      });

      const texture = new THREE.CanvasTexture(mapCanvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    }

    function registerInteractive(group, spotId) {
      group.userData.spotId = spotId;
      group.traverse((child) => {
        if (!child.isMesh) return;
        child.castShadow = true;
        child.receiveShadow = true;
        child.userData.spotId = spotId;
        child.userData.baseEmissive = child.material.emissive ? child.material.emissive.clone() : new THREE.Color('#000000');
        child.userData.baseIntensity = 'emissiveIntensity' in child.material ? child.material.emissiveIntensity : 0;
        interactiveMeshes.push(child);
      });
      spotGroups.set(spotId, group);
      root.add(group);
    }

    function createGround() {
      const slab = new THREE.Mesh(
        new THREE.BoxGeometry(28, 0.8, 22),
        new THREE.MeshStandardMaterial({ color: '#cfd7dc', roughness: 1 }),
      );
      slab.position.y = -0.45;
      slab.receiveShadow = true;
      root.add(slab);

      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(26.8, 21),
        new THREE.MeshStandardMaterial({
          map: createSiteTexture(),
          roughness: 1,
        }),
      );
      plane.rotation.x = -Math.PI / 2;
      plane.position.y = 0.02;
      plane.receiveShadow = true;
      root.add(plane);
    }

    function createMaterial(color, roofColor) {
      return {
        wall: new THREE.MeshStandardMaterial({ color, roughness: 0.74, metalness: 0.04 }),
        roof: new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.48 }),
        base: new THREE.MeshStandardMaterial({ color: '#f6f8fb', roughness: 0.44 }),
      };
    }

    function createBoxPart(width, height, depth, materials) {
      const group = new THREE.Group();
      const base = new THREE.Mesh(new THREE.BoxGeometry(width * 1.06, 0.28, depth * 1.06), materials.base);
      base.position.y = 0.14;
      const body = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), materials.wall);
      body.position.y = height / 2;
      const roof = new THREE.Mesh(new THREE.BoxGeometry(width * 1.04, 0.2, depth * 1.04), materials.roof);
      roof.position.y = height + 0.1;
      group.add(base, body, roof);
      return group;
    }

    function createRectBuilding(spotId, labelText, width, height, depth, position, rotationY, colors) {
      const materials = createMaterial(colors[0], colors[1]);
      const group = new THREE.Group();
      group.add(createBoxPart(width, height, depth, materials));
      const label = roundedLabel(labelText);
      label.position.set(0, height + 1.4, 0);
      group.add(label);
      group.position.set(...position);
      group.rotation.y = rotationY;
      registerInteractive(group, spotId);
    }

    function createUBuilding() {
      const materials = createMaterial('#dbe6f3', '#e6b26f');
      const group = new THREE.Group();

      const leftWing = createBoxPart(2.2, 3.3, 4.3, materials);
      leftWing.position.set(-2.15, 0, 0);
      const rightWing = createBoxPart(2.2, 3.3, 4.3, materials);
      rightWing.position.set(2.15, 0, 0);
      const rearWing = createBoxPart(6.6, 3.3, 1.7, materials);
      rearWing.position.set(0, 0, -1.35);

      const label = roundedLabel('主教学楼');
      label.position.set(0, 4.9, 0.3);

      group.add(leftWing, rightWing, rearWing, label);
      group.position.set(-5.2, 0, 6.2);
      registerInteractive(group, 'teaching');
    }

    function createPlayground() {
      const group = new THREE.Group();

      const track = new THREE.Mesh(
        new THREE.CylinderGeometry(4.7, 4.7, 0.12, 48),
        new THREE.MeshStandardMaterial({ color: '#c4745c', roughness: 0.92 }),
      );
      track.scale.z = 0.72;
      track.position.y = 0.08;

      const field = new THREE.Mesh(
        new THREE.CylinderGeometry(3.5, 3.5, 0.15, 48),
        new THREE.MeshStandardMaterial({ color: '#86b86f', roughness: 0.96 }),
      );
      field.scale.z = 0.58;
      field.position.y = 0.11;

      const stand = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.58, 0.9),
        new THREE.MeshStandardMaterial({ color: '#f1f3f7', roughness: 0.7 }),
      );
      stand.position.set(0.2, 0.32, 3.35);

      const lineMaterial = new THREE.MeshStandardMaterial({ color: '#f7f8fa', roughness: 1 });
      const line1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 6.4), lineMaterial);
      line1.position.set(0, 0.18, 0);
      const line2 = new THREE.Mesh(new THREE.BoxGeometry(4.9, 0.18, 0.08), lineMaterial);
      line2.position.set(0, 0.18, 0);

      const label = roundedLabel('操场');
      label.position.set(0, 2.8, 0);

      group.add(track, field, stand, line1, line2, label);
      group.position.set(-0.8, 0, -4.1);
      registerInteractive(group, 'playground');
    }

    function createGate() {
      const group = new THREE.Group();
      const pillarMaterial = new THREE.MeshStandardMaterial({ color: '#f5f8fc', roughness: 0.48 });
      const beamMaterial = new THREE.MeshStandardMaterial({ color: '#143b72', roughness: 0.42 });
      const roadMaterial = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.95 });

      const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(0.78, 2.1, 0.78), pillarMaterial);
      leftPillar.position.set(-1.05, 1.05, 0);
      const rightPillar = leftPillar.clone();
      rightPillar.position.x = 1.05;

      const beam = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.34, 0.78), beamMaterial);
      beam.position.set(0, 1.95, 0);

      const road = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.06, 1.5), roadMaterial);
      road.position.set(0, 0.03, 0.15);

      const label = roundedLabel('校门入口');
      label.position.set(0, 3.2, 0.2);

      group.add(road, leftPillar, rightPillar, beam, label);
      group.rotation.y = -0.72;
      group.position.set(10.2, 0, -6.2);
      registerInteractive(group, 'gate');
    }

    function addTrees() {
      const points = [
        [-12.4, 8.2], [-10.8, 8.8], [-8.8, 9.3], [7.8, 8.7], [9.6, 7.9], [11.2, 6.6],
        [-13.2, 0.6], [-12.3, -1.2], [-10.9, -3.1], [7.8, -7.3], [10.2, -5.3], [12.2, -3.5],
        [3.8, -8.4], [-4.8, -8.7], [1.8, 9.1],
      ];

      points.forEach(([x, z], index) => {
        const trunk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.18, 1.15, 8),
          new THREE.MeshStandardMaterial({ color: '#7b5b40', roughness: 0.95 }),
        );
        const canopy = new THREE.Mesh(
          new THREE.SphereGeometry(index % 2 === 0 ? 0.82 : 0.7, 18, 18),
          new THREE.MeshStandardMaterial({ color: '#5c9958', roughness: 0.94 }),
        );
        canopy.position.y = 1.42;
        const tree = new THREE.Group();
        tree.position.set(x, 0, z);
        tree.add(trunk, canopy);
        root.add(tree);
      });
    }

    function buildCampus() {
      createGround();
      createGate();
      createUBuilding();
      createRectBuilding('complex', '综合楼', 3.0, 3.6, 5.5, [6.9, 0, 6.0], 0.14, ['#e4edf7', '#dc9466']);
      createRectBuilding('library', '办公楼', 2.8, 2.6, 3.9, [-11.3, 0, 1.0], -0.02, ['#d6e3ee', '#d59d6f']);
      createRectBuilding('canteen', '功能馆', 1.1, 2.7, 4.8, [1.6, 0, 5.1], -0.38, ['#efe4c6', '#be7f57']);
      createPlayground();
      addTrees();
    }

    function updatePanel(spotId) {
      const data = spotData[spotId];
      if (!data) return;

      panel.image.src = data.image;
      panel.image.alt = `${data.name}预览图`;
      panel.type.textContent = data.type;
      panel.name.textContent = data.name;
      panel.subtitle.textContent = data.subtitle;
      panel.description.textContent = data.description;
      panel.facts.innerHTML = data.facts
        .map(([label, value]) => `<div class="spot-fact"><span>${label}</span><strong>${value}</strong></div>`)
        .join('');
      panel.tags.innerHTML = data.tags
        .map((tag) => `<span>${tag}</span>`)
        .join('');
    }

    function applySpotState() {
      spotGroups.forEach((group, spotId) => {
        const isActive = spotId === selectedSpot;
        group.scale.setScalar(isActive ? 1.045 : 1);
        group.traverse((child) => {
          if (!child.isMesh || !('emissive' in child.material)) return;
          child.material.emissive.set(isActive ? '#4bc2ff' : child.userData.baseEmissive);
          child.material.emissiveIntensity = isActive ? 0.22 : child.userData.baseIntensity;
        });
      });

      navButtons.forEach((button) => {
        button.classList.toggle('active', button.dataset.spot === selectedSpot);
      });
    }

    function applyViewState() {
      viewButtons.forEach((button) => {
        button.classList.toggle('active', button.dataset.view === activeView);
      });
    }

    function setView(viewName) {
      const preset = viewPresets[viewName];
      if (!preset) return;
      activeView = viewName;
      desiredCamera.set(...preset.camera);
      desiredTarget.set(...preset.target);
      applyViewState();
      stopTour();
    }

    function focusSpot(spotId, options = {}) {
      const data = spotData[spotId];
      if (!data) return;

      selectedSpot = spotId;
      desiredCamera.set(...data.camera);
      desiredTarget.set(...data.target);
      updatePanel(spotId);
      applySpotState();

      if (!options.keepView) {
        activeView = 'overview';
        applyViewState();
      }

      if (!options.keepTour) {
        stopTour();
      }
    }

    function focusOverview() {
      selectedSpot = 'overview';
      updatePanel('overview');
      desiredCamera.set(...viewPresets.overview.camera);
      desiredTarget.set(...viewPresets.overview.target);
      activeView = 'overview';
      applyViewState();

      spotGroups.forEach((group) => {
        group.scale.setScalar(1);
        group.traverse((child) => {
          if (!child.isMesh || !('emissive' in child.material)) return;
          child.material.emissive.set(child.userData.baseEmissive);
          child.material.emissiveIntensity = child.userData.baseIntensity;
        });
      });

      navButtons.forEach((button) => button.classList.remove('active'));
    }

    function startTour() {
      const order = ['gate', 'teaching', 'complex', 'library', 'canteen', 'playground'];
      tourIndex = 0;
      focusSpot(order[tourIndex], { keepTour: true });
      if (tourToggle) {
        tourToggle.textContent = labels.tourStop;
        tourToggle.classList.add('is-active');
      }

      tourTimer = window.setInterval(() => {
        tourIndex = (tourIndex + 1) % order.length;
        focusSpot(order[tourIndex], { keepTour: true });
      }, 4200);
    }

    function stopTour() {
      if (!tourTimer) return;
      window.clearInterval(tourTimer);
      tourTimer = null;
      if (tourToggle) {
        tourToggle.textContent = labels.tourStart;
        tourToggle.classList.remove('is-active');
      }
    }

    function toggleTour() {
      if (tourTimer) stopTour();
      else startTour();
    }

    function onPointerMove(event) {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(interactiveMeshes, false)[0];
      hoverSpot = hit?.object?.userData?.spotId ?? null;
      canvas.style.cursor = hoverSpot ? 'pointer' : 'grab';
    }

    function onCanvasClick(event) {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(interactiveMeshes, false)[0];
      const spotId = hit?.object?.userData?.spotId;

      if (spotId) focusSpot(spotId);
    }

    function resizeRenderer() {
      const { clientWidth, clientHeight } = stage;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight, false);
    }

    function animate() {
      requestAnimationFrame(animate);
      camera.position.lerp(desiredCamera, 0.045);
      controls.target.lerp(desiredTarget, 0.06);
      controls.update();
      renderer.render(scene, camera);
    }

    buildCampus();
    focusOverview();
    resizeRenderer();
    animate();

    navButtons.forEach((button) => {
      button.addEventListener('click', () => focusSpot(button.dataset.spot));
    });

    viewButtons.forEach((button) => {
      button.addEventListener('click', () => setView(button.dataset.view));
    });

    tourToggle?.addEventListener('click', toggleTour);
    resetButton?.addEventListener('click', () => {
      stopTour();
      focusOverview();
    });

    controls.addEventListener('start', () => {
      stopTour();
      activeView = 'overview';
      applyViewState();
    });

    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', () => {
      hoverSpot = null;
      canvas.style.cursor = 'grab';
    });
    canvas.addEventListener('click', onCanvasClick);

    window.addEventListener('resize', resizeRenderer);
  } catch (error) {
    const title = document.querySelector('#campus-engine-status');
    const hint = document.querySelector('.campus-stage-bottom p');
    const description = document.querySelector('#spot-description');
    const message = error instanceof Error ? error.message : labels.initError;

    if (title) title.textContent = labels.initError;
    if (hint) hint.textContent = `${labels.initError}：${message}`;
    if (description) description.textContent = `${labels.initError}：${message}`;
    console.error(error);
  }
}
