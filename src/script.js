import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  color,
  floor,
  lessThanEqual,
  roughness,
  texture,
} from "three/examples/jsm/nodes/Nodes.js";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import CannonDebugger from 'cannon-es-debugger'

import GUI from "lil-gui";
import * as CANNON from "cannon-es";

//physics
const world = new CANNON.World();
world.gravity.set(0, -9.8, 0);
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;

const defaultMaterial = new CANNON.Material("default");

const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.6,
    restitution: 0.3,
  }
);
world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;
/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

const loadingManager = new THREE.LoadingManager();
const loadingscreen = document.querySelector(".loading");

loadingManager.onStart = () => {
  console.log("loading started");
};
loadingManager.onLoad = () => {
  console.log("loading finished");
  canvas.style.display = "block";
  loadingscreen.style.display= "none";
};
loadingManager.onProgress = (url, loaded, total) => {
  console.log("loading in progress");
  console.log("progress", (loaded / total) * 100, "%");
};
loadingManager.onError = () => {
  console.log("loading Error");
};

// Scene
const scene = new THREE.Scene();

const gui = new GUI();
const gltfLoader = new GLTFLoader(loadingManager);

let colorObj = {
  background: 0x0a0b18,
  light1color: 0xfafafa,
  light2color: 0xfafafa,
  light3color: 0xffffff,
  planeColor: 0x09060b,
  machineColor: 0x28e89b,
};
gui.addColor(colorObj, "background").onChange((value) => {
  scene.background = new THREE.Color(value);
  scene.fog.color.set(value);
});
gui.addColor(colorObj, "light1color").onChange((value) => {
  light.color.set(value);
});
gui.addColor(colorObj, "light2color").onChange((value) => {
  light2.color.set(value);
});
gui.addColor(colorObj, "light3color").onChange((value) => {
  light3.color.set(value);
});
gui.addColor(colorObj, "planeColor").onChange((value) => {
  planeMaterial.color.set(value);
});
gui.addColor(colorObj, "machineColor").onChange((value) => {
  machineMaterial.color.set(value);
});

scene.fog = new THREE.Fog(colorObj.background, 1.0, 10.0);
scene.background = new THREE.Color(colorObj.background);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 2;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.minDistance = 1;
controls.maxDistance = 4;
controls.zoomToCursor = true;
controls.enableZoom = true;
controls.minPolarAngle = -2.4;
controls.maxPolarAngle = Math.PI / 2.4;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//texture
// const image = new Image()
// const texture = new THREE.Texture(image)

// image.onload = () => {
//     texture.needsUpdate = true
// }
// image.src = '/textures/door/metalness.jpg'

const textureLoader = new THREE.TextureLoader(loadingManager);

const colorTexture = textureLoader.load("textures/minecraft.png");
// const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
// const heightTexture = textureLoader.load('/textures/door/height.jpg')
// const normalTexture = textureLoader.load('/textures/door/normal.jpg')
// const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
// const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
// const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const absTexture = textureLoader.load("textures/abstract.jpg");
const scifiTexture = textureLoader.load("textures/scifi.jpg");
const envMapTexture = textureLoader.load("textures/envmap.exr");

// transformations on texture
//repeat vector2
// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3
// allow repeat
// colorTexture.wrapS = THREE.RepeatWrapping
// colorTexture.wrapT = THREE.RepeatWrapping
// repeat with alternate direction
// colorTexture.wrapS = THREE.MirroredRepeatWrapping
// colorTexture.wrapT = THREE.MirroredRepeatWrapping

//offset vector2
// colorTexture.offset.x = 0.5
// colorTexture.offset.y = 0.5

//rotation a simple angle in radians

// colorTexture.rotation = Math.PI * 0.25

// change center for rotation
// colorTexture.center.x = 0.5
// colorTexture.center.y = 0.5

//mipmapping and filtering
// minfilter when the texture is too big
// switch mimpamp off if using min filter
// colorTexture.generateMipmaps = false
// colorTexture.minFilter = THREE.NearestFilter

// magnification filter when texture is too small and blurry
colorTexture.magFilter = THREE.NearestFilter;
// absTexture.minFilter = THREE.LinearFilter

// models

// gltfLoader.load(
//     '/models/lowpolypole.gltf',
//     (gltf) =>{
//        console.log("gltf", gltf, gltf.nodes, gltf.materials)
//        gltf.scene.scale.set(0.05, 0.08, 0.05);

//         for(let i= 0; i <10; i++){
//             gltf.scene.position.set((8 * Math.random()) - 4, 0, i * 0.1 + (8 * Math.random()) - 4)
//             let pole = gltf.scene.clone()
//             // pole.position.set(i * 0.1, 0, 1)
//             console.log("pole pos", pole.position)
//             scene.add(pole)
//             console.log("added pole")
//         }
//     }
// )

const light = new THREE.PointLight(colorObj.light1color, 10, 20);
light.position.set(3, 3, 3);

// gui.add(LightObj, 'color').name('Color Light').onChange( value => {
//     console.log(value)
// })

const light2 = new THREE.PointLight(colorObj.light2color, 1, 2);
light2.position.set(-3, 2, -2);

const light3 = new THREE.HemisphereLight(
  colorObj.light3color,
  colorObj.light3color,
  10
);
light3.position.set(0, 2, 0);

const light4 = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(10, 10, 10);
light.castShadow = true;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 250;
scene.add(light3);

RectAreaLightUniformsLib.init();

const createRectLight = (dimension, position, lightColor = 0xffffff) => {
  let lightscrren = new THREE.Mesh(
    new THREE.BoxGeometry(dimension.x, dimension.y, dimension.z),
    new THREE.MeshPhysicalMaterial({
      color: 0x000000,
      metalness: 1,
      roughness: 0.2,
      reflectivity: 1,
    })
  );
  lightscrren.position.set(position.x, position.y, position.z);

  let rectLight1 = new THREE.RectAreaLight(
    lightColor,
    10,
    dimension.x,
    dimension.y
  );
  rectLight1.position.set(
    position.x,
    position.y,
    position.z + dimension.z / 2 + 0.001
  );
  rectLight1.rotation.set(
    lightscrren.rotation.x + Math.PI,
    lightscrren.rotation.y,
    lightscrren.rotation.z
  );
  // rectLight1.lookAt(0, 0, 0)
  let lightGroup = new THREE.Group();
  scene.add(new RectAreaLightHelper(rectLight1));
  lightGroup.add(lightscrren, rectLight1);
  scene.add(lightGroup);
};

//pole
createRectLight({ x: 0.1, y: 0.9, z: 0.02 }, { x: 0, y: 0.5, z: -4 }, 0x000000);
//billboard
createRectLight({ x: 4, y: 2, z: 0.02 }, { x: 0, y: 2, z: -4 });

//small board
createRectLight({ x: 0.2, y: 1, z: 0.02 }, { x: -0.5, y: 2, z: -0.5 });
//small pole
createRectLight(
  { x: 0.1, y: 2, z: 0.02 },
  { x: -0.5, y: 0.5, z: -0.5 },
  0x000000
);

//textures

const machineColorMap = textureLoader.load("textures/machine/color.png");
const machineMetalnessMap = textureLoader.load(
  "textures/machine/metalness.png"
);
const machineRoughnessMap = textureLoader.load(
  "textures/machine/roughness.png"
);

//base plane
const stone = textureLoader.load("textures/stone-wall.jpg");
const planeGeo = new THREE.PlaneGeometry(10, 10, 10);
console.log("before plane", colorObj.light1color);
const planeMaterial = new THREE.MeshStandardMaterial({
  map: stone,
  color: colorObj.planeColor,
  metalnessMap: machineMetalnessMap,
  metalness: 0.6,
  roughness: 1,
  bumpScale: 1,
});

const plane = new THREE.Mesh(planeGeo, planeMaterial);
// plane.rotation.set( 190, 0, 0)
plane.rotation.set(-3.14 / 2, 0, 0);
plane.position.set(0, 0, 0);
plane.receiveShadow = true;
scene.add(plane);

//vending machine

const machineBumpMap = textureLoader.load("textures/machine/bump.png");
const machineNormalMap = textureLoader.load("textures/machine/normal.png");

const machineMaterial = new THREE.MeshPhysicalMaterial({
  map: machineColorMap,
  color: 0x28e89b,
  metalness: 0.8,
  roughness: 0.1,
  metalnessMap: machineMetalnessMap,
  roughnessMap: machineRoughnessMap,
  bumpMap: machineBumpMap,
  bumpScale: 0.4,
  normalMap: machineNormalMap,
});
const width = 0.5;
const height = 1;
const breadth = 0.4;

const bottomwidth = width;
const bottomheight = height / 5;
const bottombreadth = breadth / 2;

const parts = {
  base: {
    dimension: {
      x: width,
      y: height,
      z: breadth / 2,
    },
    position: {
      x: 0,
      y: height / 2,
      z: 0,
    },
  },
  bottom: {
    dimension: {
      x: bottomwidth,
      y: bottomheight,
      z: bottombreadth,
    },
    position: {
      x: 0,
      y: bottomheight / 2,
      z: bottombreadth,
    },
  },
  rackLeft: {
    dimension: {
      x: 0.02,
      y: 0.8,
      z: 0.2,
    },
    position: {
      x: 0 - bottomwidth / 2 + 0.02 / 2,
      y: height / 2 + bottomheight / 2,
      z: bottombreadth,
    },
  },
  rackRight: {
    dimension: {
      x: 0.02,
      y: 0.8,
      z: 0.2,
    },
    position: {
      x: 0 + bottomwidth / 2 - 0.02 / 2,
      y: height / 2 + bottomheight / 2,
      z: bottombreadth,
    },
  },
  rackTop: {
    dimension: {
      x: 0.5,
      y: 0.02,
      z: 0.2,
    },
    position: {
      x: 0,
      y: height - 0.02 / 2,
      z: bottombreadth,
    },
  },
  side: {
    dimension: {
      x: 0.2,
      y: 1,
      z: 0.4,
    },
    position: {
      x: width / 2 + 0.2 / 2,
      y: height / 2,
      z: 0 + 0.2 / 2,
    },
  },
};

const onlyLight = (
  dimension,
  position,
  rotation,
  lightonside,
  lightColor = 0xffffff
) => {
  // deimnsion.x,  rotationy
  let rectLight = new THREE.RectAreaLight(
    lightColor,
    10,
    dimension.z,
    dimension.y
  );
  if (lightonside == "right") {
    rectLight.position.set(
      position.x - dimension.x / 2 - 0.0001,
      position.y,
      position.z
    );
    rectLight.rotation.set(rotation.x, rotation.y + Math.PI / 2, rotation.z);
  } else if (lightonside == "left") {
    rectLight.position.set(
      position.x + dimension.x / 2 + 0.0001,
      position.y,
      position.z
    );
    rectLight.rotation.set(rotation.x, rotation.y - Math.PI / 2, rotation.z);
  }
  scene.add(new RectAreaLightHelper(rectLight));
  return rectLight;
};

const vendMachinePart = (
  dimension,
  position,
  withLight = false,
  lightonside
) => {
  const machineGeo = new THREE.BoxGeometry(
    dimension.x,
    dimension.y,
    dimension.z
  );
  

  const mesh = new THREE.Mesh(machineGeo, machineMaterial);
  mesh.position.set(position.x, position.y, position.z);
  mesh.castShadow = true;
    

  if (withLight) {
    const group = new THREE.Group();

    group.add(mesh);
    group.add(
      onlyLight(dimension, position, mesh.rotation, lightonside, 0xffffff)
    );
    scene.add(group);
  } else {
    scene.add(mesh);
  }
};

vendMachinePart(parts.base.dimension, parts.base.position);
vendMachinePart(parts.bottom.dimension, parts.bottom.position);
vendMachinePart(
  parts.rackLeft.dimension,
  parts.rackLeft.position,
  true,
  "left"
);
vendMachinePart(
  parts.rackRight.dimension,
  parts.rackRight.position,
  true,
  "right"
);
vendMachinePart(parts.rackTop.dimension, parts.rackTop.position);
vendMachinePart(parts.side.dimension, parts.side.position);

const cocaMap = textureLoader.load("textures/cocaposter.jpg");
const colacanMap = textureLoader.load("textures/colacan.jpg");
const cocaAdMap = textureLoader.load("textures/cocaad.jpg");

createPoster(
  { x: 0.2, y: 0.3 },
  cocaMap,
  {
    x: parts.side.position.x + parts.side.dimension.x / 2 + 0.001,
    y: parts.side.position.y + 0.3,
    z: parts.side.position.z,
  },
  { x: 0, y: Math.PI / 2, z: 0 }
);
createPoster(
    { x: 0.2, y: 0.3 },
    colacanMap,
    {
      x: parts.side.position.x + parts.side.dimension.x / 2 + 0.001,
      y: parts.side.position.y - 0.01,
      z: parts.side.position.z,
    },
    { x: 0, y: Math.PI / 2, z: 0 }
  );
  createPoster({ x: 4, y: 2, z: 0.02 }, cocaAdMap, { x: 0, y: 2, z: -4 + 0.02/2 + 0.001 }, {x: 0, y: 0, z: 0})

function createPoster(dimensions, map, position, rotation){
  const posterGeo = new THREE.PlaneGeometry(dimensions.x, dimensions.y);
  const posterMaterial = new THREE.MeshStandardMaterial({
    map: map,
    color: 0xffffff,
    roughness: 1,
  });
  const posterMesh = new THREE.Mesh(posterGeo, posterMaterial);
  posterMesh.position.set(position.x, position.y, position.z);
  posterMesh.rotation.set(rotation.x, rotation.y, rotation.z);
  scene.add(posterMesh);
};

// console.log(geometry.attributes.uv)

//     const shelf = new THREE.BoxGeometry(1, 0.02, 0.15 );
//     shelf.translate(0, 1/3 * 0 + 0.4, 0.2);
//     const shelf2 = new THREE.BoxGeometry(1, 0.02, 0.15 );
//     shelf2.translate(0, 1/3 * 1 + 0.35, 0.2);
//     const shelf3 = new THREE.BoxGeometry(1, 0.02, 0.15 );
//     shelf3.translate(0, 1/3 * 2 + 0.2, 0.2);

//     const merged =  new mergeBufferGeometries([shelf, shelf2, shelf3]);

//     const newShelfs = new THREE.Mesh(merged, machineMaterial);

//    scene.add(newShelfs)

const glass= new THREE.BoxGeometry(0.5 - 0.041, 0.8 - 0.02, 0.015);

const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#55aaff'),
    ior: 1,
    transparent: false,
    transmission: 1,
    thickness: 0.02,
    reflectivity: 0.05

})

const glassMesh = new THREE.Mesh(glass, glassMaterial)
glassMesh.position.set(0, 0.6 - 0.01, 0.3 - 0.01)
scene.add(glassMesh);

const slabHeight = 0.01;
const slabwidth = 0.5 - 0.04;
const slabbreadth = 0.2 - 0.015;

const glassSlabGeo = new THREE.BoxGeometry(slabwidth, slabHeight, slabbreadth);

const slabMesh1 = new THREE.Mesh(
  glassSlabGeo,
  glassMaterial
)
slabMesh1.position.set(0, 0.2, 0.2);
scene.add(slabMesh1)

const slabMesh2 = new THREE.Mesh( glassSlabGeo, glassMaterial);
slabMesh2.position.set(0, 0.4, 0.2);
scene.add(slabMesh2)

const slabMesh3 = new THREE.Mesh( glassSlabGeo, glassMaterial);
slabMesh3.position.set(0, 0.6, 0.2);
scene.add(slabMesh3)

const slabMesh4 = new THREE.Mesh( glassSlabGeo, glassMaterial);
slabMesh4.position.set(0, 0.8, 0.2);
scene.add(slabMesh4)

gltfLoader.load('/models/cans/scene.gltf', (gltf) => {
  console.log(gltf)
  gltf.scene.scale.set(0.0005, 0.0005, 0.0005);
  gltf.scene.castShadow = true
  // gltf.scene.position.set(0, 0.8, 0.2);
  for(let i=1; i<=4; i++){
    const newCans1 = gltf.scene.clone();
    const newCans2 = gltf.scene.clone();
    const newCans3 = gltf.scene.clone();
    const newCans4 = gltf.scene.clone();
    newCans1.position.set(-0.1, 0.2 * i, 0.125);
    newCans2.position.set(-0.1, 0.2 * i, 0.225);
    newCans3.position.set(0.1, 0.2 * i, 0.125);
    newCans4.position.set(0.1, 0.2 * i, 0.225);

    const group = new THREE.Group();
    group.add(newCans1, newCans2, newCans3, newCans4)
    scene.add(group)

  }
  // scene.add(gltf.scene);
})

gltfLoader.load('/models/bench_model_free/scene.gltf', (gltf) => {
  console.log(gltf)
  gltf.scene.scale.set(0.3, 0.3, 0.3);
  gltf.scene.castShadow = true
  gltf.scene.position.set(1, 0, 0);
  gltf.scene.rotation.set(0, - Math.PI /2, 0)
  scene.add(gltf.scene);
})

const buttonGeo = new THREE.BoxGeometry(0.1, 0.05, 0.02, 30);

// const buttonMat = new THREE.MeshStandardMaterial({
//   color: machine,
//   emissive: 0x004040,
// });

const buttonMesh = new THREE.Mesh(buttonGeo, machineMaterial);

buttonMesh.position.set(0.325, 0.5, 0.3);
scene.add(buttonMesh);
// gui.addColor(buttonMat, "color").onChange((value) => {
//   buttonMat.color.set(value);
//   buttonMat.emissive.set(value);
// });
// Add a point light at the sphere's position
const pointLight = new THREE.PointLight(0xf04da1, 2, 10);
pointLight.position.copy(buttonMesh.position);
scene.add(pointLight);

// physics
// const position = new THREE.Vector3(0, 2, 0)
// const cylinderMaterial = new THREE.MeshStandardMaterial({
//   metalness:0.3,
//   roughness: 0.4
// })

// const cylGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.08, 30)
// const cylMesh = new THREE.Mesh(cylGeo, cylinderMaterial);
// cylMesh.position.copy(position)
// cylMesh.rotation.set(0, 0, Math.PI * 0.5)
// scene.add(cylMesh)

let can = [];

gltfLoader.load("/models/simplecan/scene.gltf", (gltf) => {
  console.log(gltf);
  gltf.scene.castShadow = true;
  console.log("gltf child", gltf.scene.children[0]);
  const newcan = gltf.scene;
  newcan.position.set(0, 1.05, 0.2);
  newcan.scale.set(0.03, 0.03, 0.03);
  can.push({ mesh: newcan });
  scene.add(newcan);
});

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
floorBody.mass = 0;
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(floorBody);

const boxs = {x: 1, y: 0.02, z: 0.2};

const vendFloorGeo = new THREE.BoxGeometry(boxs.x, boxs.y, boxs.z);
const vendFloorMat = new THREE.MeshStandardMaterial({
  color: 0xffffff
})

const vendMesh = new THREE.Mesh(vendFloorGeo, vendFloorMat)
vendMesh.position.set(0, 1, 0)
// scene.add(vendMesh);

const body2 = new THREE.Mesh(vendFloorGeo, vendFloorMat);
// scene.add(body2);

// const smallfloor = new CANNON.Box(new CANNON.Vec3(boxs.x * 0.5, boxs.y * 0.5, boxs.z * 0.5) )
// const smallfloorbody = new CANNON.Body({
//   mass: 0,
//   position: new CANNON.Vec3(0, 1, 2),
//   shape: smallfloor,
//   material: defaultMaterial
// })
// smallfloorbody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI * 0.1);
// world.addBody(smallfloorbody);
// vendMesh.position.copy(smallfloorbody.position)
// vendMesh.quaternion.copy(smallfloorbody.quaternion);

// const shape2= new CANNON.Box(new CANNON.Vec3(boxs.x * 0.5, boxs.y * 0.5, boxs.z * 0.5) )
// const cannonbody2 = new CANNON.Body({
//   mass: 1,
//   position: new CANNON.Vec3(0, 0.75, 2),
//   shape: shape2,
//   material: defaultMaterial,
// })
// cannonbody2.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI * 0.5);
// world.addBody(cannonbody2);
// body2.position.copy(cannonbody2.position)
// body2.quaternion.copy(cannonbody2.quaternion);




// add cylinder code
// const cylinderMaterial = new THREE.MeshStandardMaterial({
//   metalness: 0.3,
//   roughness: 0.4,
// });
// let objectsToUpdate = [];

// const createCylinder = (radius, position) => {
//   const cylinderGeo = new THREE.CylinderGeometry(
//     radius,
//     radius,
//     radius * 2,
//     30
//   );
//   const mesh = new THREE.Mesh(cylinderGeo, cylinderMaterial);

//   mesh.castShadow = true;
//   mesh.position.copy(position);

//   // // scene.add(mesh);

//   const shape = new CANNON.Cylinder(radius, radius, radius * 2, 30);

//   const body = new CANNON.Body({
//     mass: 1,
//     position: new CANNON.Vec3(0, 0, 0),
//     shape: shape,
//     material: defaultMaterial,
//   });
//   body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, -1), Math.PI * 0.5);
//   body.position.copy(position);
//   world.addBody(body);

//   objectsToUpdate.push({ mesh, body });
// };
// createCylinder(0.04, new THREE.Vector3(0, 2, 2));

// const cannonDebugger = new CannonDebugger(scene, world, {
//   // options...
// })
/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // colorTexture.rotation = Math.PI * elapsedTime * 0.15
  const deltaTime = elapsedTime - oldElapsedTime;
  // oldElapsedTime = elapsedTime
  // console.log(elapsedTime)
  // cannonDebugger.update()
  world.step(1 / 60, deltaTime, 3);

  // console.log("sd")
  // if (can.length > 0) {
  //   can[0].mesh.position.copy(objectsToUpdate[0].body.position);
  //   can[0].mesh.quaternion.copy(objectsToUpdate[0].body.quaternion);
  // }
//   vendMesh.position.copy(smallfloorbody.position)
// vendMesh.quaternion.copy(smallfloorbody);
  // Update
  controls.update();

  camera.updateProjectionMatrix();
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
