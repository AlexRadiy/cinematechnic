import * as THREE from 'https://cdn.skypack.dev/three@0.150.1';


//It`s all vibe coding, plus I was learning on the go. Don`t judge harshly. 

let camera, scene, renderer, listener;
let mouseX = 0, mouseY = 0;
let FlickerLight, headlamp1Light, fan, condgrid;
let fanstrip1, fanstrip2, fanstrip3;
let CigaretteButt, CigaretteLight;
let Smoke1, Smoke2;
let StandGuy;
let INTERSECTED = null;
let StandGuyScrewedYou = false;
let SpinForMeBaby = false;
let socks, socksLight;
let booom, meow, buzz, buzz2, click, sockssound, paper;
let boomboxplay, boomboxhiss, boomboxchange, boomboxstop;
let speechFiles;
let jar;
let chooselife, vacation, SA, siganim;
let cassette1, cassette2, cassette3;
let freefilms;
let boomboxMesh;
let room1, room2, room3;
let pause, play;
let Esc = false;
let turnoff, outro, OverallLight, goodbye;
let mobileDevice = false;

//SECRETS CHECKER

let menuOpen = false;
let YOURFavStatus = false;
let secretfound = {
  SA: false,
  vacation: false,
  chooselife: false,
};

function allSecretsFound() {
  return secretfound.SA && secretfound.vacation && secretfound.chooselife;
}



let highlightBox = null;

            let gridThumbUp = [
              ".......##........", 
              "......###........", 
              ".....####........",
              ".....###.........",
              "....####........",  
              "...###########..", 
              "...###########..", 
              "...########.....",
              "...###########..",
              "..############..",
              "..############..", 
              "..#########.....", 
              "..############..", 
              "...###########..", 
              "....#########...", 
              "................" 
            ];

// Label for displaying object names
let nameLabel = document.createElement('div');
nameLabel.style.position = 'absolute';
nameLabel.style.background = 'rgba(30,23,20,0.85)';
nameLabel.style.color = 'white';
nameLabel.style.padding = '4px 12px';
nameLabel.style.borderRadius = '18px';
nameLabel.style.pointerEvents = 'none';
nameLabel.style.fontFamily = 'monospace';
nameLabel.style.fontSize = '16px';
nameLabel.style.display = 'none';
document.body.appendChild(nameLabel);

let boombox = {
  isOn: false,
  isBroken: false,
  toggleCount: 0,
  maxToggles: 25,
  currentTrack: null,
};

let music1, music2, music3;

let lastPromptQ1 = "";
let lastPromptQ2 = "";
let isSocksOverlayOpen = false;

// remember last InitialOptions carousel index
let lastInitialIndex = 0;

const windowHalf = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
};
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const overlay = document.getElementById("overlay");
const message = document.getElementById("message");
const buttonsDiv = document.getElementById("buttons");


//LOADING SCREEN
(function addLoadingOverlay() {
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loading-overlay';
  loadingDiv.style.position = 'fixed';
  loadingDiv.style.top = '0';
  loadingDiv.style.left = '0';
  loadingDiv.style.width = '100vw';
  loadingDiv.style.height = '100vh';
  loadingDiv.style.background = 'rgba(30,23,20,1)';
  loadingDiv.style.display = 'flex';
  loadingDiv.style.alignItems = 'center';
  loadingDiv.style.justifyContent = 'center';
  loadingDiv.style.zIndex = '99999';
  loadingDiv.style.color = 'white';
  loadingDiv.style.fontFamily = 'Press Start 2P';
  loadingDiv.style.fontSize = '2em';
  loadingDiv.innerText = 'Loading...';
  document.body.appendChild(loadingDiv);


  //RAINBOW
  if (!document.getElementById('rainbow-shine-style')) {
  const style = document.createElement('style');
  style.id = 'rainbow-shine-style';
  style.textContent = `
  .rainbow-shine {
    background: linear-gradient(270deg, #ff004c, #fffc00, #2fff00, #00fff7, #002bff, #ff00ea, #ff004c);
    background-size: 1400% 1400%;
    color: transparent !important;
    -webkit-background-clip: text !important;
    background-clip: text !important;
    animation: rainbow-shine 5s linear infinite;
    font-weight: bold;
    filter: brightness(1.2) drop-shadow(0 1px 2px #0008);
    font-size: 1.5rem !important;
  }
  @keyframes rainbow-shine {
    0% { background-position: 0% 50% }
    50% { background-position: 100% 50% }
    100% { background-position: 0% 50% }
  }
  `;
  document.head.appendChild(style);
}


//LOADING
  function removeOverlay() {
    if (loadingDiv.parentNode) loadingDiv.parentNode.removeChild(loadingDiv);
  }

  if (document.readyState === 'complete') {
    removeOverlay();
  } else {
    window.addEventListener('load', removeOverlay);
  }
})();

// simple animation scheduler
let _anims = [];

function _easeInOut(t) {
  // easeInOutQuad
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function animateNumber(get, set, to, duration = 300) {
  const from = get();
  const start = performance.now();
  const anim = {
    update(now) {
      const t = Math.min((now - start) / duration, 1);
      const v = from + (to - from) * _easeInOut(t);
      set(v);
      return t < 1;
    }
  };
  _anims.push(anim);
}

function animateCameraForward(delta = -150, duration = 300) {
  animateNumber(
    () => camera.position.z,
    (v) => { camera.position.z = v; },
    camera.position.z + delta,
    duration
  );
}

// rooms handling
const rooms = [];
let activeRoomIndex = 0;
const roomOffsetX = 1600;

function setActiveRoom(index, duration = 300) {
  activeRoomIndex = Math.max(0, Math.min(2, index));
  rooms.forEach((r, i) => {
    const targetX = (i - activeRoomIndex) * roomOffsetX;
    animateNumber(
      () => r.position.x,
      (v) => { r.position.x = v; },
      targetX,
      duration
    );
  });
}


if (!isMobileDevice()) {
  init();
  animate();
} else {
  showInitialOptionsMobile();
  switchToLightModernTheme();
}

function init() {

  
  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
  camera.position.set(0, 50, 100);

  // Camera-sound
  listener = new THREE.AudioListener(); 
  camera.add(listener); 

  //Light


  OverallLight = new THREE.AmbientLight(0x7a6b5c, 0.4, 10000);
OverallLight.position.set(0, 200, -100);
scene.add(OverallLight);

  const CeilingLight = new THREE.PointLight(0x7a6b5c, 0, 1000);
CeilingLight.position.set(400, 330, -100);
scene.add(CeilingLight);


  const SpotLight = new THREE.PointLight(0x635a52, 3, 1000);
SpotLight.position.set(0, 120, 0);
scene.add(SpotLight);

  const CeilingLight2 = new THREE.PointLight(0x7a6b5c, 1.1, 1000);
CeilingLight2.position.set(400, 330, -500);
scene.add(CeilingLight2);
  
  const CeilingLight3 = new THREE.PointLight(0xffffff, 0, 1000);
CeilingLight3.position.set(-400, 330, -100);
scene.add(CeilingLight3);

  FlickerLight = new THREE.PointLight(0x7a6b5c, 1.1, 1000);
FlickerLight.position.set(-400, 330, -500);
scene.add(FlickerLight);

  CigaretteButt = new THREE.PointLight(0xff532b, 100, 10);
CigaretteButt.position.set(55.5, 30, -499);
scene.add(CigaretteButt);

  CigaretteLight = new THREE.PointLight(0xb33417, 0.5, 200);
CigaretteLight.position.set(55.5, 30, -470);
scene.add(CigaretteLight);

  socksLight = new THREE.PointLight(0xffffff, 0, 500);
  socksLight.position.set(300, -200, -250);
scene.add(socksLight);
  
const pointLightHelper1 = new THREE.PointLightHelper( CeilingLight, 0);
const pointLightHelper2 = new THREE.PointLightHelper( CeilingLight2, 0);
const pointLightHelper3 = new THREE.PointLightHelper( CeilingLight3, 0);
const pointLightHelper4 = new THREE.PointLightHelper( FlickerLight, 0);
scene.add( pointLightHelper1 );
scene.add( pointLightHelper2 );
scene.add( pointLightHelper3 );
scene.add( pointLightHelper4 );
  

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //SOUNDS

  booom = new THREE.Audio(listener); new THREE.AudioLoader().load('booom.mp3', b => booom.setBuffer(b));
  booom.setVolume(0.05);

  meow = new THREE.Audio(listener); new THREE.AudioLoader().load('meow.mp3', b => meow.setBuffer(b));
  meow.setVolume(0.1);

  buzz = new THREE.PositionalAudio(listener); new THREE.AudioLoader().load('buzz.mp3', b => buzz.setBuffer(b));
  buzz.setLoop(true);
  buzz.setRefDistance(20);
  buzz.position.set(-600, 330, -100);
  scene.add(buzz);


  buzz2 = new THREE.PositionalAudio(listener); new THREE.AudioLoader().load('buzz2.mp3', b => buzz2.setBuffer(b));
  buzz2.setLoop(true);
  buzz2.setRefDistance(2000);
  buzz2.position.set(200, 330, -100);
  scene.add(buzz2);

  click = new THREE.PositionalAudio(listener); new THREE.AudioLoader().load('click.mp3', b => click.setBuffer(b));
  click.setRefDistance(2000);
  click.position.set(-9, 50, 80);
  scene.add(click);
  camera.add(click);

  music1 = new THREE.Audio(listener); new THREE.AudioLoader().load('music1.mp3', b => music1.setBuffer(b));
  music1.setVolume(0.05);

  music2 = new THREE.Audio(listener); new THREE.AudioLoader().load('music2.mp3', b => music2.setBuffer(b));
  music2.setVolume(0.05);

  music3 = new THREE.Audio(listener); new THREE.AudioLoader().load('music3.mp3', b => music3.setBuffer(b));
  music3.setVolume(0.05);

  boomboxchange = new THREE.Audio(listener); new THREE.AudioLoader().load('boombox-change.mp3', b => boomboxchange.setBuffer(b));
  boomboxchange.setVolume(0.2);

  boomboxplay = new THREE.Audio(listener); new THREE.AudioLoader().load('boombox-play.mp3', b => boomboxplay.setBuffer(b));
  boomboxplay.setVolume(0.5);

  boomboxhiss = new THREE.Audio(listener); new THREE.AudioLoader().load('boombox-hiss.mp3', b => boomboxhiss.setBuffer(b));
  boomboxhiss.setVolume(0.3);
   
  boomboxstop = new THREE.Audio(listener); new THREE.AudioLoader().load('boombox-stop.mp3', b => boomboxstop.setBuffer(b));
  boomboxstop.setVolume(0.3);

  sockssound = new THREE.Audio(listener); new THREE.AudioLoader().load('socks.mp3', b => sockssound.setBuffer(b));
  sockssound.setVolume(0.1);
  sockssound.setLoop(true);

  paper = new THREE.Audio(listener); new THREE.AudioLoader().load('paper.mp3', b => paper.setBuffer(b));
  paper.setVolume(0.5);

  turnoff = new THREE.Audio(listener); new THREE.AudioLoader().load('turnoff.mp3', b => turnoff.setBuffer(b));
  turnoff.setVolume(0.9);

  outro = new THREE.Audio(listener); new THREE.AudioLoader().load('outro.mp3', b => outro.setBuffer(b));
  outro.setVolume(0.9);

speechFiles = [
  'speech1.mp3',
  'speech2.mp3',
  'speech3.mp3',
  'speech4.mp3',
  'speech5.mp3',
];

[music1, music2, music3].forEach(track => {
  track.onEnded = () => {
    boombox.isOn = false;
    play.visible = false;
    pause.visible = true;
    boomboxstop.play();
  };
});


  // Box textures
  const loader = new THREE.TextureLoader();
  const roommaterials = [
    new THREE.MeshLambertMaterial({ map: loader.load('Wall2.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Wall2.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Ceiling.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Floor2.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Wall2.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Wall2.png'), side: THREE.BackSide })  
  ];

    const room2materials = [
    new THREE.MeshLambertMaterial({ map: loader.load('Wall1Q2.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Wall1Q2.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Ceiling.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Floor.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Wall1Q2.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Wall1Q2.png'), side: THREE.BackSide })  
  ];

    const room3materials = [
    new THREE.MeshLambertMaterial({ map: loader.load('wall1Q3.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('wall1Q3.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Ceiling.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('Floor.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('wall1Q3.png'), side: THREE.BackSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('wall1Q3.png'), side: THREE.BackSide })  
  ];
  
  const tabletopmaterials = [
    new THREE.MeshLambertMaterial({ map: loader.load('tabletop_side.png'), side: THREE.DoubleSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('tabletop_side.png'), side: THREE.DoubleSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('tabletop_top2.png'), side: THREE.DoubleSide }),   
    new THREE.MeshLambertMaterial({ map: loader.load('tabletop_top2.png'), side: THREE.DoubleSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('tabletop_front2.png'), side: THREE.DoubleSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('tabletop_front2.png'), side: THREE.DoubleSide }),
  ];

  const headlampmaterials = [
    new THREE.MeshLambertMaterial({ map: loader.load('headlamp.png'), transparent: true, side: THREE.DoubleSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('headlamp.png'), transparent: true, side: THREE.DoubleSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('headlamp.png'), transparent: true, side: THREE.DoubleSide }),   
    new THREE.MeshBasicMaterial({ map: loader.load('headlamp.png'), transparent: true, side: THREE.DoubleSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('headlamp.png'), transparent: true, side: THREE.DoubleSide }), 
    new THREE.MeshLambertMaterial({ map: loader.load('headlamp.png'), transparent: true, side: THREE.DoubleSide }),
  ];


  //CONDITIONER
  
  const condpart1 = new THREE.Mesh(new THREE.CylinderGeometry(20, 20, 2000, 32), new THREE.MeshLambertMaterial({ map: loader.load('cond.png'), transparent: false, side: THREE.DoubleSide }));
  condpart1.position.set(300, 330, -630);
  condpart1.rotation.z = Math.PI / 2;
  scene.add(condpart1);

  const condpart2 = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshLambertMaterial({ map: loader.load('cond.png'), transparent: true, side: THREE.DoubleSide }));
  condpart2.position.set(400, 300, -680);
  condpart2.rotation.y = Math.PI / 2;
  scene.add(condpart2);

  condgrid = new THREE.Mesh(new THREE.PlaneGeometry(200, 170), new THREE.MeshLambertMaterial({ map: loader.load('cond-grid.png'), transparent: true, side: THREE.DoubleSide }));
  condgrid.position.set(500, 280, -580);
  scene.add(condgrid);

  const condpart3 = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshLambertMaterial({ map: loader.load('cond-back.png'), transparent: true, side: THREE.DoubleSide }));
  condpart3.position.set(500, 300, -600);
  scene.add(condpart3);

    const condpart4 = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshLambertMaterial({ map: loader.load('cond-back.png'), transparent: true, side: THREE.DoubleSide }));
  condpart4.position.set(600, 300, -680);
    condpart4.rotation.y = Math.PI / 2;
  scene.add(condpart4);

    const condpart5 = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshLambertMaterial({ map: loader.load('cond.png'), transparent: true, side: THREE.DoubleSide }));
  condpart5.position.set(500, 200, -680);
  condpart5.rotation.x = Math.PI / 2;
  scene.add(condpart5);

  fan = new THREE.Mesh(new THREE.PlaneGeometry(140, 140), new THREE.MeshLambertMaterial({ map: loader.load('fan.png'), transparent: true, side: THREE.DoubleSide }));
  fan.position.set(506, 289, -598);
  scene.add(fan);

  fanstrip1 = new THREE.Mesh(new THREE.PlaneGeometry(22, 49), new THREE.MeshLambertMaterial({ map: loader.load('fanstrips.png'), transparent: true, side: THREE.DoubleSide }));
  fanstrip1.position.set(540, 260, -579);
  scene.add(fanstrip1);

  fanstrip2 = new THREE.Mesh(new THREE.PlaneGeometry(22, 49), new THREE.MeshLambertMaterial({ map: loader.load('fanstrips2.png'), transparent: true, side: THREE.DoubleSide }));
  fanstrip2.position.set(540, 260, -579);
  scene.add(fanstrip2);

  fanstrip3 = new THREE.Mesh(new THREE.PlaneGeometry(22, 49), new THREE.MeshLambertMaterial({ map: loader.load('fanstrips3.png'), transparent: true, side: THREE.DoubleSide }));
  fanstrip3.position.set(540, 260, -579);
  scene.add(fanstrip3);

  //BOOMBOX & CASSETES

  boomboxMesh = new THREE.Mesh(new THREE.BoxGeometry(182, 84, 84), new THREE.MeshLambertMaterial({ map: loader.load('boombox.png'), transparent: true, side: THREE.DoubleSide }));
  boomboxMesh.position.set(270, -58, -410);
  boomboxMesh.rotation.y = -0.3;
  scene.add(boomboxMesh);

      const boomboxhandle = new THREE.Mesh(new THREE.PlaneGeometry(140, 30), new THREE.MeshLambertMaterial({ map: loader.load('boomboxhandle.png'), transparent: true, side: THREE.DoubleSide }));
  boomboxhandle.position.set(270, -5, -410);
  boomboxhandle.rotation.x = Math.PI / 1;
  boomboxhandle.rotation.y = 0.3;
  scene.add(boomboxhandle);

  cassette1 = new THREE.Mesh(new THREE.BoxGeometry(50, 10, 40), new THREE.MeshLambertMaterial({ map: loader.load('cover1.png'), transparent: true, side: THREE.DoubleSide }));
  cassette1.position.set(150, -94, -320);
  cassette1.rotation.y = -1;
  scene.add(cassette1);

  cassette2 = new THREE.Mesh(new THREE.BoxGeometry(50, 10, 40), new THREE.MeshLambertMaterial({ map: loader.load('cover2.png'), transparent: true, side: THREE.DoubleSide }));
  cassette2.position.set(240, -94, -315);
  scene.add(cassette2);

  cassette3 = new THREE.Mesh(new THREE.BoxGeometry(50, 10, 40), new THREE.MeshLambertMaterial({ map: loader.load('cover3.png'), transparent: true, side: THREE.DoubleSide }));
  cassette3.position.set(350, -94, -315);
  cassette3.rotation.y = 0.5;
  scene.add(cassette3);

  pause = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), new THREE.MeshLambertMaterial({ map: loader.load('pause.png'), transparent: true, side: THREE.DoubleSide }));
  pause.position.set(211, -31, -360);
  pause.rotation.y = -0.3;
  pause.material.opacity = 1;
  scene.add(pause);

  play = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), new THREE.MeshLambertMaterial({ map: loader.load('play.png'), transparent: true, side: THREE.DoubleSide }));
  play.position.set(211, -31, -360);
  play.rotation.y = -0.3;
  play.material.opacity = 1;
  scene.add(play);

  //SOCKS
  socks = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshLambertMaterial({ map: loader.load('socks.png'), transparent: true, side: THREE.DoubleSide }));
  socks.position.set(300, -200, -270);
  scene.add(socks);

  //POSTERS

 chooselife = new THREE.Mesh(new THREE.PlaneGeometry(88, 168), new THREE.MeshLambertMaterial({ map: loader.load('choose-life.png'), transparent: true, side: THREE.DoubleSide }));
  chooselife.position.set(-550, 100, -350);
  chooselife.rotation.y = 1.55555;
    chooselife.rotation.x = 0.01;
  scene.add(chooselife);

   vacation = new THREE.Mesh(new THREE.PlaneGeometry(92, 126), new THREE.MeshLambertMaterial({ map: loader.load('vietnam.png'), transparent: true, side: THREE.DoubleSide }));
  vacation.position.set(350, 180, -639);
  vacation.rotation.z = 0.1;
  scene.add(vacation);

  SA = new THREE.Mesh(new THREE.PlaneGeometry(92, 126), new THREE.MeshLambertMaterial({ map: loader.load('SA.png'), transparent: true, side: THREE.DoubleSide }));
  SA.position.set(550, 100, -350);
  SA.rotation.x = 0.01;
  SA.rotation.y = Math.PI / 0.5;
  SA.rotation.y += 4.6;
  scene.add(SA);

  siganim = new THREE.Mesh(new THREE.PlaneGeometry(50, 57), new THREE.MeshLambertMaterial({ map: loader.load('siganim.png'), transparent: true, side: THREE.DoubleSide }));
  siganim.position.set(-480, 210, -637);
  siganim.rotation.z = -0.05;
  scene.add(siganim);

  // Headlamps
  const headlamp1 = new THREE.Mesh(new THREE.BoxGeometry(90, 24, 300), headlampmaterials);
  headlamp1.position.set(-400, 350, -410);
  scene.add(headlamp1);

  const headlamp2 = new THREE.Mesh(new THREE.BoxGeometry(90, 24, 300), headlampmaterials);
  headlamp2.position.set(400, 350, -410);
  scene.add(headlamp2);

  headlamp1Light = new THREE.Mesh(new THREE.PlaneGeometry(90, 300), new THREE.MeshLambertMaterial({ map: loader.load('headlamp.png'), transparent: true, side: THREE.DoubleSide }));
  headlamp1Light.position.set(-400, 337, -410);
    headlamp1Light.rotation.x = 1.57;
  scene.add(headlamp1Light);

  // Rooms
  room1 = new THREE.Mesh(new THREE.BoxGeometry(1280, 720, 1280), roommaterials);
  room1.position.set(0, 0, 0);
  scene.add(room1);

  room2 = new THREE.Mesh(new THREE.BoxGeometry(1280, 720, 1280), room2materials);
  room2.position.set(roomOffsetX, 0, 0);
  scene.add(room2);

  room3 = new THREE.Mesh(new THREE.BoxGeometry(1280, 720, 1280), room3materials);
  room3.position.set(-roomOffsetX, 0, 0);
  scene.add(room3);

  rooms.push(room1, room2, room3);
  setActiveRoom(0, 0);

  // table&tabletop cube
  const tabletop = new THREE.Mesh(new THREE.BoxGeometry(785, 21, 231), tabletopmaterials);
  tabletop.position.set(0, -110, -400);
  scene.add(tabletop);

  const table = new THREE.Mesh(new THREE.BoxGeometry(750, 157, 207), new THREE.MeshLambertMaterial({ map: loader.load('table_front3.png'), transparent: true, side: THREE.DoubleSide }));
  table.position.set(0, -180, -400);
  scene.add(table);


  //JAR
jar = new THREE.Mesh(
  new THREE.CylinderGeometry(25, 25, 60, 80),
  new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load('jar.png') })
);
jar.position.set(-150, -72, -320);
jar.rotation.y = Math.PI / 1;
jar.scale.set(0.75, 0.75, 0.75);
scene.add(jar);

const jarBottom = new THREE.Mesh(
  new THREE.SphereGeometry(25, 80, 40, 0, Math.PI * 2, 0, Math.PI / 2),
  new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load('cond.png') })
);
jarBottom.position.set(-150, -94, -320);
jarBottom.rotation.x = Math.PI;
jarBottom.scale.set(0.75, 0.35 * 0.75, 0.75);
scene.add(jarBottom);

const jarTop = new THREE.Mesh(
  new THREE.SphereGeometry(25, 80, 40, 0, Math.PI * 2, 0, Math.PI / 2),
  new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load('cond.png') })
);
jarTop.position.set(-150, -50, -320);
jarTop.scale.set(0.75, 0.35 * 0.75, 0.75);
scene.add(jarTop);

const jarlid = new THREE.Mesh(
  new THREE.CylinderGeometry(20, 20, 7, 160),
  new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load('Ceiling.png') })
);
jarlid.position.set(-150, -42, -320);
jarlid.scale.set(0.75, 0.75, 0.75);
scene.add(jarlid);

  // SHELVES and FREE box
  freefilms = new THREE.Mesh(new THREE.BoxGeometry(200, 100, 80), new THREE.MeshLambertMaterial({ map: loader.load('free.png'), transparent: true, side: THREE.DoubleSide }));
  freefilms.position.set(-400, -28, -580);
  scene.add(freefilms);

 const shelveback = new THREE.Mesh(new THREE.PlaneGeometry(480, 590), new THREE.MeshLambertMaterial({ map: loader.load('shelveback.png'), transparent: true, side: THREE.DoubleSide }));
  shelveback.position.set(-393, -20, -639);
  scene.add(shelveback);

   const shelvegrid = new THREE.Mesh(new THREE.PlaneGeometry(480, 590), new THREE.MeshLambertMaterial({ map: loader.load('shelvegrid.png'), transparent: true, side: THREE.DoubleSide }));
  shelvegrid.position.set(-393, -20, -638);
  scene.add(shelvegrid);

const shelve1 = new THREE.Mesh(new THREE.BoxGeometry(450, 10, 90), new THREE.MeshLambertMaterial({ map: loader.load('shelve.png'), transparent: true, side: THREE.DoubleSide }));
  shelve1.position.set(-393, -87, -590);
  scene.add(shelve1);

  const shelve2 = new THREE.Mesh(new THREE.BoxGeometry(450, 10, 90), new THREE.MeshLambertMaterial({ map: loader.load('shelve.png'), transparent: true, side: THREE.DoubleSide }));
  shelve2.position.set(-393, 36, -590);
  scene.add(shelve2);

    const shelve3 = new THREE.Mesh(new THREE.BoxGeometry(450, 10, 90), new THREE.MeshLambertMaterial({ map: loader.load('shelve.png'), transparent: true, side: THREE.DoubleSide }));
  shelve3.position.set(-393, 154, -590);
  scene.add(shelve3);

  const shelvetape = new THREE.Mesh(new THREE.BoxGeometry(50, 10, 40), new THREE.MeshLambertMaterial({ map: loader.load('shelve.png'), transparent: true, side: THREE.DoubleSide }));
  shelvetape.position.set(-393, 154, -590);
  scene.add(shelvetape);

    const shelvefilms = new THREE.Mesh(new THREE.BoxGeometry(200, 100, 50), new THREE.MeshLambertMaterial({ map: loader.load('shelvefilms.png'), transparent: true, side: THREE.DoubleSide }));
  shelvefilms.position.set(-490, 93, -570);
  scene.add(shelvefilms);


  const shelvefilms1 = new THREE.Mesh(new THREE.BoxGeometry(70, 100, 50), new THREE.MeshLambertMaterial({ map: loader.load('shelvefilms1.png'), transparent: true, side: THREE.DoubleSide }));
  shelvefilms1.position.set(-550, -28, -580);
  scene.add(shelvefilms1);

    const shelvefilms2 = new THREE.Mesh(new THREE.BoxGeometry(70, 100, 50), new THREE.MeshLambertMaterial({ map: loader.load('shelvefilms2.png'), transparent: true, side: THREE.DoubleSide }));
  shelvefilms2.position.set(-260, -28, -580);
  scene.add(shelvefilms2);

     const shelveside = new THREE.Mesh(new THREE.PlaneGeometry(170, 515), new THREE.MeshLambertMaterial({ map: loader.load('shelve.png'), transparent: true, side: THREE.DoubleSide }));
  shelveside.position.set(-639, 16, -660);
  shelveside.rotation.y = Math.PI / 2;
 //scene.add(shelveside);


  // Guy texture
StandGuy = new THREE.Mesh(new THREE.PlaneGeometry(222, 327), new THREE.MeshLambertMaterial({ map: loader.load('Stand.png'), transparent: true, side: THREE.DoubleSide }));
StandGuy.position.set(0, 0, -500);
scene.add(StandGuy);

  const menu = new THREE.Mesh(new THREE.PlaneGeometry(100, 20), new THREE.MeshLambertMaterial({ map: loader.load('menu.png'), transparent: false, side: THREE.DoubleSide }));
  menu.position.set(0, -50, -499);
 //////scene.add(menu);

 goodbye = new THREE.Mesh(new THREE.PlaneGeometry(60, 100), new THREE.MeshLambertMaterial({ map: loader.load('goodbye.png'), transparent: true, side: THREE.DoubleSide }));
  goodbye.position.set(1000, -94, -340);
  goodbye.rotation.x = Math.PI / 2;
  goodbye.rotation.z = Math.PI / 1.1;

scene.add(goodbye);

  // Smoke texture
Smoke1 = new THREE.Mesh(new THREE.PlaneGeometry(46, 141), new THREE.MeshLambertMaterial({ map: loader.load('Stand smoke 2.png'), transparent: true, side: THREE.DoubleSide }));
Smoke1.position.set(90, 140, -480);
scene.add(Smoke1);

Smoke2 = new THREE.Mesh(new THREE.PlaneGeometry(46, 141), new THREE.MeshLambertMaterial({ map: loader.load('Stand smoke.png'), transparent: true, side: THREE.DoubleSide }));
Smoke2.position.set(90, 140, -480);
scene.add(Smoke2);





  //TOTAL OBJECTS AND THEIR NAMES
  chooselife.name = "poster";
  vacation.name = "photo";
  SA.name = "photo";
  StandGuy.name = "MENU";
  boomboxMesh.name = "music";
  cassette1.name = "Plastic Bouquet";
  cassette2.name = "Vacation in Zen";
  cassette3.name = "Call me Junk E.";
  socks.name = "Socks";
  freefilms.name = "free films";
  siganim.name = "booklet";
  goodbye.name = "photo";
  jar.name = "basically ashtray";

  // Mouse move and click
  document.addEventListener('mousemove', onDocumentMouseMove);
  document.addEventListener('click', onClick, false);

  // Resize
  window.addEventListener('resize', onWindowResize);
}

function getRandomSound() {
  const idx = Math.floor(Math.random() * speechFiles.length);
  return new Audio(speechFiles[idx]);
}


function speechAnimation(text, container, speed = 100) {
  if (isMobileDevice()) {
    container.textContent = text;
    return Promise.resolve();
  }
  return new Promise(resolve => {
    container.textContent = '';
    let i = 0;
    function typeNext() {
      if (i < text.length) {
        container.textContent += text[i];
        if (text[i].trim()) {
          const sound = getRandomSound();
          sound.volume = 0.5;
          sound.play();
        }
        i++;
        setTimeout(typeNext, speed);
      } else {
        resolve();
      }
    }
    typeNext();
  });
}

function setSubtext(value) {
  // Find or create the subtext element once per overlay
  let el = overlay.querySelector('.overlay-subtext');
  if (!el && value != null && value !== false && value !== '') {
    el = document.createElement('div');
    el.className = 'overlay-subtext';
    message.insertAdjacentElement('afterend', el);
  }
  if (!el) return;
  el.classList.add('rainbow-shine');
  if (value == null || value === false || value === '') {
    el.hidden = true;          
  } else {
    el.hidden = false;
    el.textContent = String(value);
  }
}

// helper: top-left back/home button
function ensureTopLeftButton(key, label, onClick) {
  if (buttonsDiv.querySelector(`button[data-role="${key}"]`)) return;
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.dataset.role = key;
  btn.style.position = "fixed";
  btn.style.left = "16px";
  btn.style.top = "-21px";
  btn.style.zIndex = "1000";
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    onClick();
  });
  buttonsDiv.appendChild(btn);
}



function onClick() {
  raycaster.setFromCamera(mouse, camera);
    setTimeout(() => {
    buzz.play();
    buzz2.play();
  }, 10);

  if (overlay.style.display === "flex") return;

  if (Esc){
    const goodbyeIntersects = raycaster.intersectObject(goodbye);
  if (goodbyeIntersects.length > 0) {goodbyeFunction();}
    return;
  }

  if (StandGuyScrewedYou) {
    showGoodbyeMessage();
    return;
  }

  // StandGuy
  const standIntersects = raycaster.intersectObject(StandGuy);
  if (standIntersects.length > 0) {
    showInitialOptions();
  }

  const socksIntersects = raycaster.intersectObject(socks);
  if (socksIntersects.length > 0) {
    socksCredits();
  }

  const chooselifeIntersects = raycaster.intersectObject(chooselife);
  if (chooselifeIntersects.length > 0) {
    secretfound.chooselife = true;
    chooselifefunction();
  }

  const vacationIntersects = raycaster.intersectObject(vacation);
  if (vacationIntersects.length > 0) {
    secretfound.vacation = true;
    vacationfunction();
  } 

    const SAIntersects = raycaster.intersectObject(SA);
  if (SAIntersects.length > 0) {
    secretfound.SA = true;
    SAfunction();
  } 

  const boomboxIntersects = raycaster.intersectObject(boomboxMesh);
  if (boomboxIntersects.length > 0) {
    boomboxfunction();
    playsound();
  }

  const cassette1Intersects = raycaster.intersectObject(cassette1);
  if (cassette1Intersects.length > 0) {
    insertCassette(1);
  }

  const cassette2Intersects = raycaster.intersectObject(cassette2);
  if (cassette2Intersects.length > 0) {
    insertCassette(2);
  }

  const cassette3Intersects = raycaster.intersectObject(cassette3);
  if (cassette3Intersects.length > 0) {
    insertCassette(3);
  }

    const freefilmsIntersects = raycaster.intersectObject(freefilms);
  if (freefilmsIntersects.length > 0) {
    freefilmsfunction();
  }

    const siganimIntersects = raycaster.intersectObject(siganim);
  if (siganimIntersects.length > 0) {
    siganimfunction();
  }

    const jarIntersects = raycaster.intersectObject(jar);
  if (jarIntersects.length > 0) {
    window.open('https://ko-fi.com/admin99', '_blank');
  }

}

function siganimfunction() {
  overlay.style.display = "flex";
  buttonsDiv.innerHTML = "";
  message.innerText = "";
  paper.play();

  const img = document.createElement("img");
  img.src = "siganim.png";
  img.style.width = "400px";
  img.style.height = "auto";
  img.style.display = "block";
  img.style.margin = "0 auto";

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "close";
  closeBtn.style.display = "block";
  closeBtn.style.margin = "18px auto 0 auto";
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    overlay.style.display = "none";
  });

  buttonsDiv.appendChild(img);
  buttonsDiv.appendChild(closeBtn);
}


function goodbyeFunction(){
  overlay.style.display = "flex";
  buttonsDiv.innerHTML = "";
  message.innerText = "";
  paper.play();

  const img = document.createElement("img");
  img.src = "goodbye.png";
  img.style.width = "400px";
  img.style.height = "auto";
  img.style.display = "block";
  img.style.margin = "0 auto";

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "close";
  closeBtn.style.display = "block";
  closeBtn.style.margin = "18px auto 0 auto";
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    overlay.style.display = "none";
  });

  buttonsDiv.appendChild(img);
  buttonsDiv.appendChild(closeBtn);
}

function freefilmsfunction() {
  overlay.style.display = "flex";
  buttonsDiv.innerHTML = "";

  speechAnimation("Free of charge. Public domain - ever heard of it?", message, 30)
    .then(() => {
      // Carousel Data
      const carouselScreens = [
        {
          poster: "poster1.png",
          text: "Soviet arthouse - modern operator`s textbook",
          link: "https://youtu.be/3GyNB4-eN1E?si=SPlw--8JxHheAt7g"
        },
        {
          poster: "poster2.png",
          text: "Greatest slapstick comedy of all time",
          link: "https://youtu.be/efydqBb5_Wc?si=8XkFCfMxH1eA53VJ"
        },
        {
          poster: "poster3.png",
          text: "Incredible performances",
          link: "https://youtu.be/P_gly_fIfEE?si=9YlUsMCulztplpQ_"
        },
        {
          poster: "poster4.png",
          text: "First truely blockbuster movie",
          link: "https://youtu.be/1CVLz1_MrCk?si=4oLmztjFV4iZTXCj"
        }
      ];

      // Carousel Setup
      const SCREEN_GAP = 25;
      const carousel = document.createElement("div");
      carousel.id = "carousel";
      carousel.style.display = "grid";
      carousel.style.gridTemplateColumns = "auto 1fr auto";
      carousel.style.alignItems = "center";
      carousel.style.columnGap = "16px";
      carousel.style.justifyContent = "center";
      carousel.style.width = "min(440px, 90vw)";
      carousel.style.margin = "0 auto";

      const leftBtn = document.createElement("button");
      leftBtn.className = "nav-btn";
      leftBtn.textContent = "<";

      const rightBtn = document.createElement("button");
      rightBtn.className = "nav-btn";
      rightBtn.textContent = ">";

      const viewport = document.createElement("div");
      viewport.className = "viewport";
      viewport.style.overflow = "hidden";
      viewport.style.justifySelf = "center";
      viewport.style.width = "min(400px, 80vw)";
      viewport.style.maxWidth = "100%";

      const inner = document.createElement("div");
      inner.className = "inner";
      inner.style.display = "flex";
      inner.style.gap = `${SCREEN_GAP}px`;
      inner.style.transition = "transform 0.25s cubic-bezier(.4,2,.2,1)";

      // Create carousel screens
      carouselScreens.forEach((screen, idx) => {
        const screenDiv = document.createElement("div");
        screenDiv.className = "carousel-screen";
        screenDiv.style.display = "flex";
        screenDiv.style.flexDirection = "column";
        screenDiv.style.alignItems = "center";
        screenDiv.style.justifyContent = "center";
        screenDiv.style.height = "450px";
        screenDiv.style.boxSizing = "border-box";

        // Poster image
        const img = document.createElement("img");
        img.src = screen.poster;
        img.alt = `Poster ${idx + 1}`;
        img.style.width = "200px";
        img.style.height = "auto";
        img.style.border = "7px solid #bbb";
        img.style.borderRadius = "6px";
        img.style.cursor = "pointer";
        img.style.transition = "border-color 0.2s";
        img.addEventListener("mouseover", () => {
          img.style.borderColor = "#ff9900ff";
        });
        img.addEventListener("mouseout", () => {
          img.style.borderColor = "#bbb";
        });
        img.addEventListener("click", () => {
          window.open(screen.link, "_blank");
        });

        // Text
        const txt = document.createElement("div");
        txt.textContent = screen.text;
        txt.style.marginTop = "18px";
        txt.style.textAlign = "center";
        txt.style.fontSize = "1em";
        txt.style.color = "#fffcfcff";

        screenDiv.appendChild(img);
        screenDiv.appendChild(txt);
        inner.appendChild(screenDiv);
      });

      viewport.appendChild(inner);

      // Carousel logic
      let index = 0;
      const clampIndex = (i) => ((i + carouselScreens.length) % carouselScreens.length);

      const updateCarousel = () => {
        const viewportWidth = viewport.clientWidth || 0;
        if (viewportWidth === 0) return; // guard for early calls before layout

        [...inner.children].forEach((s) => {
          s.style.flex = `0 0 ${viewportWidth}px`;
          s.style.width = `${viewportWidth}px`;
        });
        inner.style.width = `${viewportWidth * carouselScreens.length + SCREEN_GAP * (carouselScreens.length - 1)}px`;
        const offset = index * (viewportWidth + SCREEN_GAP);
        inner.style.transform = `translate3d(-${offset}px, 0, 0)`;
        leftBtn.disabled = false;
        rightBtn.disabled = false;
        leftBtn.classList.remove("disabled");
        rightBtn.classList.remove("disabled");
      };

      leftBtn.addEventListener("click", () => {
        index = clampIndex(index - 1);
        updateCarousel();
      });
      rightBtn.addEventListener("click", () => {
        index = clampIndex(index + 1);
        updateCarousel();
      });

      window.addEventListener("resize", updateCarousel, { passive: true });

      // Build DOM
      carousel.appendChild(leftBtn);
      carousel.appendChild(viewport);
      carousel.appendChild(rightBtn);

      // Insert carousel before buttons so it has layout
      buttonsDiv.appendChild(carousel);

      // Trigger initial layout AFTER it's in the DOM
      requestAnimationFrame(updateCarousel);

      // Also observe container size changes (more robust than window resize alone)
      let ro;
      if (typeof ResizeObserver !== "undefined") {
        ro = new ResizeObserver(() => updateCarousel());
        ro.observe(viewport);
      }

      // Buttons
      ///////const linkBtn = document.createElement("button");
      //linkBtn.textContent = "youtube playlist";
      //linkBtn.style.display = "block";
      //linkBtn.style.margin = "20px auto";
      //linkBtn.addEventListener("click", () => {
      //  window.open("https://youtube.com/playlist?list=PLTYZuvjJPVnGYlXEiFujZFQNk6WMIp6u7&si=4ftAFitm_h-m8bwI", "_blank");});
      //buttonsDiv.appendChild(linkBtn);
      const closeBtn = document.createElement("button");
      closeBtn.textContent = "close";
      closeBtn.style.display = "block";
      closeBtn.style.margin = "20px auto";
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        overlay.style.display = "none";
        // cleanup observers/listeners
        if (ro) ro.disconnect();
        window.removeEventListener("resize", updateCarousel);
      });

      
      buttonsDiv.appendChild(closeBtn);
    });
}

function stopAllMusic() {
  [music1, music2, music3].forEach((a) => {
    if (a && a.isPlaying) a.stop();
  });
}

function playsound(){
  if (play.visible === false){boomboxplay.play()
  }else{boomboxstop.play()}
}

function boomboxfunction() {
  if (boombox.isBroken) {
    return;
  }

  if (boombox.currentTrack === null){ 
    overlay.style.display = "flex";
    buttonsDiv.innerHTML = "";
    speechAnimation("You`ve gotta insert the tape, man..", message, 30)
    setTimeout(() => {overlay.style.display = "none";}, 1800);
  }

  boombox.toggleCount += 1;
  if (boombox.toggleCount > boombox.maxToggles) {
    boombox.isBroken = true;
    boombox.isOn = false;
    if (boombox.currentTrack) {
        boombox.currentTrack.pause();
        boombox.currentTrack.currentTime = 0;
        }
    boombox.currentTrack = null;
    boomboxhiss.play();

    buttonsDiv.innerHTML = "";
    setTimeout(() => {
    overlay.style.display = "flex"; 
    speechAnimation("You broke my boombox! I`ll remember that!", message, 30);
    setTimeout(() => {overlay.style.display = "none";}, 2200);
  }, 400);
    return;
  }

  boombox.isOn = !boombox.isOn;

  if (boombox.isOn) {
    if (boombox.currentTrack) {
      stopAllMusic();
boombox.currentTrack.play();
    }
  } else {
    stopAllMusic();
  }
}


function insertCassette(n) {
  if (boombox.isBroken) return;

  const nextTrack = n === 1 ? music1 : n === 2 ? music2 : music3;

  if (boombox.currentTrack === nextTrack) return;
    
  if (boombox.isOn ===true){boomboxstop.play();}

  boomboxchange.play();
  boombox.currentTrack = nextTrack;
  boombox.isOn = false;
  stopAllMusic();

  if (boombox.isOn && nextTrack) {
    stopAllMusic();
    nextTrack.play();
  }
}

function SAfunction(){
      overlay.style.display = "flex";
    buttonsDiv.innerHTML = "";
  speechAnimation("Ze Birds there Don't Sing, zey Screech in Pain.", message, 30)
    .then(() => {
      const closeBtn = document.createElement("button");
      closeBtn.textContent = "close";
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        overlay.style.display = "none";
      });
      buttonsDiv.appendChild(closeBtn);
    });
}

function vacationfunction(){
      overlay.style.display = "flex";
    buttonsDiv.innerHTML = "";
  speechAnimation("Saigon… Every time I think I'm gonna wake up back in the jungle.", message, 30)
    .then(() => {
      const closeBtn = document.createElement("button");
      closeBtn.textContent = "close";
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        overlay.style.display = "none";
      });
      buttonsDiv.appendChild(closeBtn);
    });
}


function chooselifefunction(){
  
      overlay.style.display = "flex";
      buttonsDiv.innerHTML = "";
speechAnimation("Choose Life. Choose a job. Choose a career. Choose a good movie to watch", message, 30)
    .then(() => {
      const closeBtn = document.createElement("button");
      closeBtn.textContent = "close";
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        overlay.style.display = "none";
      });
      buttonsDiv.appendChild(closeBtn);
    });
  }


function socksCredits() {
    overlay.style.display = "flex";
    isSocksOverlayOpen = true;
    buttonsDiv.innerHTML = "";
    message.innerHTML = `Website by`;
    setSubtext(`NOTInteresting`);
    SpinForMeBaby = !SpinForMeBaby;

    // Use a <div> for the feedback label
    const Feedbackform = document.createElement("div");
    Feedbackform.textContent = "Feedback form:";
    Feedbackform.style.display = "block";
    Feedbackform.style.marginTop = "60px"; 
    Feedbackform.style.fontWeight = "bold";

    // feedback input
    const input = document.createElement("textarea");
    input.rows = 1;
    input.maxLength = 400;
    input.placeholder = "";
    input.classList.add("overlay-input");
    input.style.resize = "none";
    input.style.overflowY = "hidden";
    input.addEventListener("input", () => {
        input.rows = 1;
        const lines = input.value.split("\n").length;
        const scrollRows = Math.ceil(input.scrollHeight / 24);
        input.rows = Math.min(Math.max(lines, scrollRows), 4);
    });
    input.style.display = "block";
    input.style.marginTop = "18px"; // Add margin under label

    // Send feedback
    const SendBtn = document.createElement("button");
    SendBtn.textContent = "Send";
    SendBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        const feedbackText = input.value;

        if (!feedbackText.trim()) {
            message.innerText = "You ok? Say hi at least.";
            return;
        }
        message.innerText = "Pending..."
        buttonsDiv.innerHTML = "";
        setSubtext(``);
        emailjs.init("j6eGEWxM4dbVz2LIQ");
        emailjs.send("service_d1s52e7", "template_ss3e15y", {
            message: feedbackText
        })
        .then(() => {  
            message.innerText = "Thanks!!";
            SpinForMeBaby = !SpinForMeBaby;
            setTimeout(() => {
                overlay.style.display = "none";
            }, 1500);
        })
        .catch((error) => {
            console.error("Email send error:", error);
            message.innerText = "Error. sry";
        });
    });
    SendBtn.style.display = "block";

    // Link
    const LinkBtn = document.createElement("button");
    LinkBtn.textContent = "Project`s Discord";
    LinkBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        window.open('https://discord.gg/nB7gYuAa', '_blank');
    });
    LinkBtn.style.display = "block";
    LinkBtn.classList.add("centered");
    LinkBtn.style.marginTop = "18px";

    // Meow
    const SocksBtn = document.createElement("button");
    SocksBtn.textContent = "Socks";
    SocksBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        meow.play();
    });
    SocksBtn.style.display = "block";

    // Close
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "close";
    closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        overlay.style.display = "none";
        SpinForMeBaby = !SpinForMeBaby;
        setSubtext(``);
    });
    closeBtn.style.marginTop = "68px";

    // Add elements to the overlay
    buttonsDiv.appendChild(Feedbackform);
    buttonsDiv.appendChild(input);
    buttonsDiv.appendChild(SendBtn);
    buttonsDiv.appendChild(LinkBtn);
    buttonsDiv.appendChild(SocksBtn);
    buttonsDiv.appendChild(closeBtn);
}


  function showInitialOptionsMobile() {
  // Show overlay and set menu state
  overlay.style.display = "flex";
  if (!menuOpen) {
    message.innerText = "Wassup. What you want?";
  } else {
    message.innerText = "What else?";
  }
  menuOpen = true;
  mobileDevice = true;

  setSubtext('');
  buttonsDiv.innerHTML = "";

  // Button data
  const items = [
    { text: "Film Oracle",    handler: handleQ1, room: 0 },
    { text: "Find-a-film",    handler: handleQ2, room: 1 },
    { text: "Pro mode",    handler: handleQ3, room: 2 },
  ];


    const credits = document.createElement("button");
        credits.textContent = "credits";
        credits.style.marginBottom = "18px";
        credits.style.marginTop = "400px";     
        credits.addEventListener("click", () => {
          socksCreditsMobile();
        });
       


  // Create buttons vertically
  items.forEach((item, idx) => {
    const btn = document.createElement("button");
    btn.textContent = item.text;
    btn.style.display = "block";
    btn.style.margin = "22px auto";
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      lastInitialIndex = idx;
      setActiveRoom(idx, 300);
      item.handler();
    });


    buttonsDiv.appendChild(btn);
    buttonsDiv.appendChild(credits);
  });
}

function socksCreditsMobile() {
    overlay.style.display = "flex";
    isSocksOverlayOpen = true;
    buttonsDiv.innerHTML = "";
    message.innerHTML = `Website by <span style="font-size:1.3em;font-weight:bold;">NOTInteresting</span><br><br><br>Feedback form:`;
    
    //feedback input
    const input = document.createElement("textarea");
  input.rows = 1;
  input.maxLength = 400;
  input.placeholder = "";
  input.classList.add("overlay-input");
  input.style.resize = "none";
  input.style.overflowY = "hidden";
  input.addEventListener("input", () => {
    input.rows = 1;
    const lines = input.value.split("\n").length;
    const scrollRows = Math.ceil(input.scrollHeight / 24);
    input.rows = Math.min(Math.max(lines, scrollRows), 4);
  });
  input.style.display = "block";
    

    //Send feedback
const SendBtn = document.createElement("button");
SendBtn.textContent = "Send";

SendBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  const feedbackText = input.value;

  if (!feedbackText.trim()) {
    message.innerText = "You ok? Say hi at least.";
    return;
  }
  message.innerText = "Pending..."
  buttonsDiv.innerHTML = "";
  emailjs.init("j6eGEWxM4dbVz2LIQ");
  emailjs.send("service_d1s52e7", "template_ss3e15y", {
    message: feedbackText
  })
  .then(() => {  
    message.innerText = "Thanks!!";
    SpinForMeBaby = !SpinForMeBaby;
    setTimeout(() => {
      overlay.style.display = "none";
    }, 1500);
  })
  .catch((error) => {
    console.error("Email send error:", error);
    message.innerText = "Error. sry";
  });
});
SendBtn.style.display = "block";


      //Link
    const LinkBtn = document.createElement("button");
      LinkBtn.textContent = "Project`s Discord";
      LinkBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        window.open('https://discord.gg/nB7gYuAa', '_blank');
      });
    LinkBtn.style.display = "block";
    LinkBtn.classList.add("centered");
    LinkBtn.style.marginTop = "18px";

      //meow
    const SocksBtn = document.createElement("button");
      SocksBtn.textContent = "Socks";
      SocksBtn.addEventListener("click", (e) => {
        e.stopPropagation();
       new Audio('meow.mp3').play();
      });
    SocksBtn.style.display = "block";

      //close
    const closeBtn = document.createElement("button");
      closeBtn.textContent = "close";
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showInitialOptionsMobile();
      });
      closeBtn.style.marginTop = "68px";

      buttonsDiv.appendChild(input);
      buttonsDiv.appendChild(SendBtn);
      buttonsDiv.appendChild(LinkBtn);
      buttonsDiv.appendChild(SocksBtn);
      buttonsDiv.appendChild(closeBtn);
  }

//mainmenu
function showInitialOptions() {
  if (overlay.style.display !== "flex") animateCameraForward(-130, 300);

  overlay.style.display = "flex";
  overlay.style.padding = "40px 100px";
  if (menuOpen === false) {
    speechAnimation("Wassup. What you want?", message, 30)
  } else {
    message.innerText = "What else?"
  }
  menuOpen = true;

  // Add all the subtexts here in order
  const subtexts = [
    "Get a movie rec based on your personality",
    "Describe events - I`ll find them filmed",
    "Advanced search for creators and cinephiles"
  ];
  setSubtext(subtexts[0]);

  buttonsDiv.innerHTML = "";

  // Carousel
  const carousel = document.createElement("div");
  carousel.id = "carousel";

  carousel.style.display = "grid";
  carousel.style.gridTemplateColumns = "auto 1fr auto";
  carousel.style.alignItems = "center";
  carousel.style.columnGap = "16px";

  const leftBtn = document.createElement("button");
  leftBtn.className = "nav-btn";
  leftBtn.textContent = "<";
  leftBtn.style.fontSize = "2.7rem";
  leftBtn.style.padding = "32px 8px";
  leftBtn.style.borderRadius = "3px";

  const rightBtn = document.createElement("button");
  rightBtn.className = "nav-btn";
  rightBtn.textContent = ">";
  rightBtn.style.fontSize = "2.7rem";
  rightBtn.style.padding = "32px 8px";
  rightBtn.style.borderRadius = "3px";

  const viewport = document.createElement("div");
  viewport.className = "viewport";
  viewport.style.overflow = "hidden";
  viewport.style.justifySelf = "center";
  viewport.style.width = "min(500px, 100%)";
  viewport.style.maxWidth = "100%";

  viewport.style.scrollSnapType = "x mandatory";

  const inner = document.createElement("div");
  inner.className = "inner";
  inner.style.display = "flex";
  inner.style.gap = "120px";
  inner.style.justifyContent = "flex-start";
  viewport.appendChild(inner);

  const items = [
    { text: "Film Oracle", handler: handleQ1 },
    { text: "Find-a-film", handler: handleQ2 },
    { text: "Pro mode", handler: handleQ3 },
  ];

  const leftPad = document.createElement("div");
  leftPad.style.minWidth = "calc((min(500px, 100%) - 120px) / 2)";
  leftPad.style.pointerEvents = "none";
  inner.appendChild(leftPad);

  const buttons = items.map((q, idx) => {
    const btn = document.createElement("button");
    btn.textContent = q.text;
    btn.style.scrollSnapAlign = "center";
    btn.style.fontSize = "2rem";
    btn.style.padding = "35px 8px";
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      lastInitialIndex = idx;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      setSubtext(subtexts[idx]); // <--- ADDED
      scrollToIndex(idx);
      q.handler();
    });
    inner.appendChild(btn);
    return btn;
  });

  const rightPad = document.createElement("div");
  rightPad.style.minWidth = "calc((min(500px, 100%) - 120px) / 2)";
  rightPad.style.pointerEvents = "none";
  inner.appendChild(rightPad);

  carousel.appendChild(leftBtn);
  carousel.appendChild(viewport);
  carousel.appendChild(rightBtn);

  let currentIndex = lastInitialIndex;
  const duration = 300;

  function itemWidth() {
    const first = buttons[0];
    if (!first) return 200;
    const rect = first.getBoundingClientRect();
    const gapStr = getComputedStyle(inner).gap || getComputedStyle(inner).columnGap || "8px";
    const gap = parseFloat(gapStr) || 8;
    return rect.width + gap;
  }

  function updateNavDisabled() {
    leftBtn.disabled = currentIndex === 0;
    rightBtn.disabled = currentIndex === items.length - 1;
    leftBtn.classList.toggle("disabled", leftBtn.disabled);
    rightBtn.classList.toggle("disabled", rightBtn.disabled);
  }

  function scrollToIndex(index, smooth = true) {
    currentIndex = (index + items.length) % items.length;
    lastInitialIndex = currentIndex;

    const btn = buttons[currentIndex];
    if (!btn) return;

    const targetLeft = Math.max(
      0,
      btn.offsetLeft - (viewport.clientWidth - btn.offsetWidth) / 2
    );

    if (smooth) {
      viewport.scrollTo({ left: targetLeft, behavior: "smooth" });
    } else {
      viewport.scrollLeft = targetLeft;
    }

    setActiveRoom(currentIndex, duration);
    setSubtext(subtexts[currentIndex]); // <--- ADDED
    updateNavDisabled();
  }

  leftBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    scrollToIndex(currentIndex - 1);
  });

  rightBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    scrollToIndex(currentIndex + 1);
  });

  window.addEventListener("resize", () => {
    scrollToIndex(currentIndex, false);
  });

  updateNavDisabled();
  scrollToIndex(currentIndex, false);

  function onKey(e) {
    if (overlay.style.display !== "flex") return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollToIndex(currentIndex - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollToIndex(currentIndex + 1);
    }
  }
  document.addEventListener("keydown", onKey);

  const onResize = () => scrollToIndex(currentIndex, false);
  window.addEventListener("resize", onResize);

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "close";
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    overlay.style.display = "none";
    animateCameraForward(130, 300);
    setSubtext('');
    menuOpen = false;
    document.removeEventListener("keydown", onKey);
    window.removeEventListener("resize", onResize);
      overlay.style.padding = "auto";
  });

  buttonsDiv.appendChild(carousel);
  buttonsDiv.appendChild(closeBtn);

  requestAnimationFrame(() => scrollToIndex(lastInitialIndex, false));
}

// ================= Q1 =================
function handleQ1() {
  speechAnimation("You do inputs. I do magic.", message, 30)
  buttonsDiv.innerHTML = "";
  message.subtext = "";
  setSubtext('');

  if (!mobileDevice) {
    ensureTopLeftButton("back-home", "back", () => showInitialOptions());
  } else {
    ensureTopLeftButton("back-home", "back", () => showInitialOptionsMobile());
  }

  let lastPromptQ2 = "";
  let seenMoviesQ2 = [];
  let seenBtnQ2 = null;
  let shareBtnQ2 = null;

  const extractMovieTitle = (text) => {
    if (!text) return "";
    const lines = String(text).split("\n").map((l) => l.trim()).filter(Boolean);
    return lines[0] || "";
  };

  const ensureCloseButton = () => {
    if (!mobileDevice) {
      const alreadyHasClose = [...buttonsDiv.querySelectorAll("button")].some(
        (b) => b.textContent === "close"
      );
      if (!alreadyHasClose) {
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "close";
        closeBtn.style.marginTop = "18px";
        closeBtn.style.marginRight = "18px";
        closeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          overlay.style.display = "none";
          animateCameraForward(130, 300);
        });
      }
    }
  };

  const appendSeenButton = () => {
    if (seenBtnQ2 && seenBtnQ2.isConnected) {
      seenBtnQ2.remove();
    }
    if (shareBtnQ2 && shareBtnQ2.isConnected) {
      shareBtnQ2.remove();
    }
    seenBtnQ2 = document.createElement("button");
    seenBtnQ2.textContent = "I`ve seen that one!";
    seenBtnQ2.style.display = "inline-block";
    seenBtnQ2.style.marginTop = "24px";
    seenBtnQ2.addEventListener("click", () => {
      if (seenMoviesQ2.length >= 10) {
        message.innerText = "No way you`ve seen all of those.";
        buttonsDiv.innerHTML = "";
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "close";
        closeBtn.style.marginTop = "18px";
        closeBtn.style.marginRight = "18px";
        closeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          overlay.style.display = "none";
          animateCameraForward(130, 300);
        });
        buttonsDiv.appendChild(closeBtn);
        const backBtn = document.createElement("button");
        backBtn.textContent = "back";
        backBtn.style.marginTop = "18px";
        backBtn.addEventListener("click", () => {
          handleQ1();
        });
        buttonsDiv.appendChild(backBtn);
      } else {
        const continuationPrompt =
          lastPromptQ2 +
          "\n\n" +
          (seenMoviesQ2.length ? ` (avoid: ${seenMoviesQ2.join(", ")})` : "") +
          "";
        sendPrompt(continuationPrompt, true);
      }
    });
    buttonsDiv.appendChild(seenBtnQ2);

    shareBtnQ2 = document.createElement("button");
    shareBtnQ2.textContent = "Share";
    shareBtnQ2.style.display = "inline-block";
    shareBtnQ2.style.marginLeft = "14px";
    shareBtnQ2.addEventListener("click", () => {
      const txt = message.innerText + "\n\nhttps://alexradiy.github.io/cinematechnic/";
      navigator.clipboard.writeText(txt);
      shareBtnQ2.textContent = "Copied link";
    });
    buttonsDiv.appendChild(shareBtnQ2);
  };

  const sendPrompt = (prompt, isContinuation = false) => {
    message.innerText = "wait a sec...";
    buttonsDiv.innerHTML = "";
    ensureTopLeftButton("back-handler", "back", () => handleQ1());
    fetch("https://gemini-cloud-function-994729946863.europe-west1.run.app", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.reply !== undefined) {
          const raw = String(data.reply).trim();
          const title = extractMovieTitle(raw);

          if (title) {
            message.innerHTML =
              `<span style="font-size:1.5em;font-weight:bold;">${title}</span><br><br>` +
              raw.replace(title, "");
            if (!seenMoviesQ2.includes(title)) seenMoviesQ2.push(title);
          } else {
            message.innerText = raw;
          }

          if (title) {
            const actionsRow = document.createElement("div");
            actionsRow.style.display = "flex";
            actionsRow.style.alignItems = "center";
            actionsRow.style.justifyContent = "center";
            actionsRow.style.gap = "16px";
            actionsRow.style.margin = "14px auto 0";

            const svgFromGrid = (grid, flippedY = false) => {
              const rects = [];
              for (let y = 0; y < grid.length; y++) {
                const row = grid[y].padEnd(16, ".");
                for (let x = 0; x < 16; x++) {
                  if (row[x] === "#") {
                    const yy = flippedY ? 15 - y : y;
                    rects.push(`<rect x="${x}" y="${yy}" width="1" height="1"/>`);
                  }
                }
              }
              return `
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16"
                     shape-rendering="crispEdges" aria-hidden="true">
                  <g fill="currentColor">${rects.join("")}</g>
                </svg>
              `;
            };

            const upSVG = svgFromGrid(gridThumbUp, false);
            const downSVG = svgFromGrid(gridThumbUp, true);

            const makeThumbBtn = (label, svg) => {
              const b = document.createElement("button");
              b.type = "button";
              b.title = label;
              b.setAttribute("aria-label", label);
              b.style.display = "inline-flex";
              b.style.alignItems = "center";
              b.style.justifyContent = "center";
              b.style.width = "56px";
              b.style.height = "56px";
              b.style.padding = "0";
              b.style.border = "2px solid #555";
              b.style.background = "#000";
              b.style.color = "#fff";
              b.style.cursor = "pointer";
              b.style.userSelect = "none";
              b.innerHTML = svg;
              return b;
            };

            const likeBtn = makeThumbBtn("like", upSVG);
            const dislikeBtn = makeThumbBtn("dislike", downSVG);

            let liked = false;
            let disliked = false;

            const updateThumbStyles = () => {
              if (liked) {
                likeBtn.style.background = "#fff";
                likeBtn.style.color = "#000";
              } else {
                likeBtn.style.background = "#000";
                likeBtn.style.color = "#fff";
              }
              if (disliked) {
                dislikeBtn.style.background = "#fff";
                dislikeBtn.style.color = "#000";
              } else {
                dislikeBtn.style.background = "#000";
                dislikeBtn.style.color = "#fff";
              }
            };

            likeBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              liked = !liked;
              if (liked) disliked = false;
              updateThumbStyles();
            });

            dislikeBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              disliked = !disliked;
              if (disliked) liked = false;
              updateThumbStyles();
            });

            const linkBtn = document.createElement("button");
            linkBtn.textContent = "Google it";
            linkBtn.style.display = "inline-block";
            linkBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              window.open(
                "https://www.google.com/search?q=" +
                  encodeURIComponent(title + " film"),
                "_blank"
              );
            });

            actionsRow.appendChild(linkBtn);
            buttonsDiv.appendChild(actionsRow);

            updateThumbStyles();
          }

          ensureCloseButton();
          appendSeenButton();
        } else if (data.error) {
          message.innerText = "Error: " + data.error;
        } else {
          message.innerText = "Error: Unexpected response";
        }
      })
      .catch((err) => {
        message.innerText = "Error: " + err.message;
      });
  };

  const input = document.createElement("textarea");
  input.rows = 1;
  input.maxLength = 400;
  input.placeholder = "About...";
  input.classList.add("overlay-input");
  input.style.resize = "none";
  input.style.overflowY = "hidden";
  input.addEventListener("input", () => {
    input.rows = 1;
    const lines = input.value.split("\n").length;
    const scrollRows = Math.ceil(input.scrollHeight / 24);
    input.rows = Math.min(Math.max(lines, scrollRows), 4);
  });
  input.style.marginTop = "25px";
  input.style.display = "block";

  let moodOn = false;
  const moodBtn = document.createElement("button");
  const setMoodLabel = () => (moodBtn.textContent = `season\`s mood: ${moodOn ? "on" : "off"}`);
  setMoodLabel();
  moodBtn.addEventListener("click", () => {
    moodOn = !moodOn;
    setMoodLabel();
  });
  moodBtn.style.display = "block";
  moodBtn.style.marginTop = "25px";

  const list1 = document.createElement("select");
  list1.classList.add("overlay-input");
  const options1 = [
    { value: "Your MBTI type", label: "Your MBTI type" },
    { value: "ENTJ", label: "ENTJ" }, { value: "ENTP", label: "ENTP" },
    { value: "ENFJ", label: "ENFJ" }, { value: "ENFP", label: "ENFP" },
    { value: "ESTJ", label: "ESTJ" }, { value: "ESTP", label: "ESTP" },
    { value: "ESFJ", label: "ESFJ" }, { value: "ESFP", label: "ESFP" },
    { value: "INTJ", label: "INTJ" }, { value: "INTP", label: "INTP" },
    { value: "INFJ", label: "INFJ" }, { value: "INFP", label: "INFP" },
    { value: "ISTJ", label: "ISTJ" }, { value: "ISTP", label: "ISTP" },
    { value: "ISFJ", label: "ISFJ" }, { value: "ISFP", label: "ISFP" },
  ];
  options1.forEach(({ value, label }) => {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = label;
    list1.appendChild(opt);
  });
  list1.style.display = "block";
  list1.style.marginTop = "25px";

  const list2 = document.createElement("select");
  list2.classList.add("overlay-input");
  const options2 = [
    { value: "Your star sign", label: "Your star sign" },
    { value: "Aries", label: "Aries" }, { value: "Taurus", label: "Taurus" },
    { value: "Gemini", label: "Gemini" }, { value: "Cancer", label: "Cancer" },
    { value: "Leo", label: "Leo" }, { value: "Virgo", label: "Virgo" },
    { value: "Libra", label: "Libra" }, { value: "Scorpio", label: "Scorpio" },
    { value: "Sagittarius", label: "Sagittarius" }, { value: "Capricorn", label: "Capricorn" },
    { value: "Aquarius", label: "Aquarius" }, { value: "Pisces", label: "Pisces" },
  ];
  options2.forEach(({ value, label }) => {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = label;
    list2.appendChild(opt);
  });
  list2.style.display = "block";
  list2.style.marginTop = "25px";

  const btn1 = document.createElement("button");
  btn1.textContent = "Submit";
  btn1.classList.add("centered");
  btn1.style.marginTop = "25px";

  const labelDisclamer = document.createElement("div");
  labelDisclamer.textContent = "Every Input Is Optional";
  labelDisclamer.style.marginTop = "25px";

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      btn1.click();
    }
  });

  btn1.addEventListener("click", () => {
    try {
      const userInput = input.value;

      if (userInput === "escape the matrix") {
        overlay.style.display = "none";
        EscapeTheMatrix();
        return;
      }

      if (userInput === "time to quit") {
        overlay.style.display = "none";
        TimeToQuit();
        return;
      }

      const parts = ["Recommend me a movie!"];
      let pushCount = 0;

      if (typeof userInput === "string" && userInput.trim().length > 0) {
        parts.push(".Key word(s) will be: ", userInput.trim());
        pushCount++;
      }

      if (moodOn) {
        const month = new Date().toLocaleString("en-US", { month: "long" });
        parts.push(".It must correlate with ", month);
        pushCount++;
      }

      if (list1.value !== "Your MBTI type") {
        parts.push(".Its story should be liked by ", list1.value);
        pushCount++;
      }

      if (list2.value !== "Your star sign") {
        parts.push(".And its vibe should be liked by ", list2.value);
        pushCount++;
      }

      if (pushCount >= 2) {
        parts.push("Be sure to include EVERYTHING mentioned in your answer.");
      }

      lastPromptQ2 =
        parts.join(" ") +
        "Strict answer form: first line only the name of the film, then skip a line, " +
        "then highlight why you chose this film in less than 25 words. Write as you are a teenager. No emojis. No formatting.";

      sendPrompt(lastPromptQ2, false);
    } catch (err) {
      message.innerText = "Error: " + (err && err.message ? err.message : String(err));
    }
  });

  if (allSecretsFound()) {
    const btn2 = document.createElement("button");
    btn2.textContent = "What would you recommend?";
    btn2.style.display = "block";
    btn2.style.marginTop = "30px";
    btn2.addEventListener("click", () => {
      YOURFavStatus = true;
             buttonsDiv.innerHTML = ""
      speechAnimation("Hm... You really should check out `Cremator`. Basically Ari Aster style story with Lantimos B&W visuals but 1969 and Cheskoslovakian", message, 30)

          .then(() => {

      const closeBtn = document.createElement("button");
      closeBtn.textContent = "cool";
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        handleQ1();
          });
      buttonsDiv.appendChild(closeBtn);})
    });
    buttonsDiv.appendChild(list1);
    buttonsDiv.appendChild(list2);
    buttonsDiv.appendChild(moodBtn);
    buttonsDiv.appendChild(input);
    buttonsDiv.appendChild(labelDisclamer);
    buttonsDiv.appendChild(btn1);
    buttonsDiv.appendChild(btn2);
  } else {
    if (YOURFavStatus === false){
    const btn2 = document.createElement("button");
    btn2.textContent = "What are YOUR favourites?";
    btn2.style.display = "block";
    btn2.style.marginTop = "30px";
    btn2.addEventListener("click", () => {
      YOURFavStatus = true;
      message.innerText = "You will never be able to comprehend the levels of MY understanding of cinema.";
      booom.play();
      camera.position.z -= 80;
      buttonsDiv.innerHTML = "";

      const closeBtn = document.createElement("button");
      closeBtn.textContent = "whatever.";
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        handleQ1();
        animateCameraForward(80, 300);
      });
      buttonsDiv.appendChild(closeBtn);
    });
    buttonsDiv.appendChild(list1);
    buttonsDiv.appendChild(list2);
    buttonsDiv.appendChild(moodBtn);
    buttonsDiv.appendChild(input);
    buttonsDiv.appendChild(labelDisclamer);
    buttonsDiv.appendChild(btn1);
    buttonsDiv.appendChild(btn2);
    } else {
    buttonsDiv.appendChild(list1);
    buttonsDiv.appendChild(list2);
    buttonsDiv.appendChild(moodBtn);
    buttonsDiv.appendChild(input);
    buttonsDiv.appendChild(labelDisclamer);
    buttonsDiv.appendChild(btn1);
    }
  }
}

// ================= Q2 =================
function handleQ2() {
  speechAnimation("They already made films about everything.", message, 30);
  buttonsDiv.innerHTML = "";
  setSubtext('');

  if (!mobileDevice) {
    ensureTopLeftButton("back-home", "back", () => showInitialOptions());
  } else {
    ensureTopLeftButton("back-home", "back", () => showInitialOptionsMobile());
  }

  let lastPromptQ1 = "";
  let seenMoviesQ1 = [];
  let seenBtnQ1 = null;
  let shareBtnQ1 = null;

  const extractMovieTitle = (text) => {
    if (!text) return "";
    const lines = String(text).split("\n").map((l) => l.trim()).filter(Boolean);
    return lines[0] || "";
  };

  const ensureCloseButton = () => {
    if (!mobileDevice) {
      const alreadyHasClose = [...buttonsDiv.querySelectorAll("button")].some(
        (b) => b.textContent === "close"
      );
      if (!alreadyHasClose) {
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "close";
        closeBtn.style.marginTop = "18px";
        closeBtn.style.marginRight = "18px";
        closeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          overlay.style.display = "none";
          animateCameraForward(130, 300);
        });
      }
    }
  };

  const appendSeenButton = () => {
    if (seenBtnQ1 && seenBtnQ1.isConnected) {
      seenBtnQ1.remove();
    }
    if (shareBtnQ1 && shareBtnQ1.isConnected) {
      shareBtnQ1.remove();
    }
    seenBtnQ1 = document.createElement("button");
    seenBtnQ1.textContent = "I`ve seen that one!";
    seenBtnQ1.style.marginTop = "18px";
    seenBtnQ1.addEventListener("click", () => {
      if (seenMoviesQ1.length >= 10) {
        message.innerText = "No way you`ve seen all of those.";
        buttonsDiv.innerHTML = "";
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "close";
        closeBtn.style.marginTop = "18px";
        closeBtn.style.marginRight = "18px";
        closeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          overlay.style.display = "none";
          animateCameraForward(130, 300);
        });
        buttonsDiv.appendChild(closeBtn);
        const backBtn = document.createElement("button");
        backBtn.textContent = "back";
        backBtn.style.marginTop = "18px";
        backBtn.addEventListener("click", () => {
          handleQ2();
        });
        buttonsDiv.appendChild(backBtn);
      } else {
        const continuationPrompt =
          lastPromptQ1 +
          "\n\n" +
          (seenMoviesQ1.length ? ` (avoid: ${seenMoviesQ1.join(", ")})` : "") +
          "";
        sendPrompt(continuationPrompt, true);
      }
    });
    buttonsDiv.appendChild(seenBtnQ1);

    shareBtnQ1 = document.createElement("button");
    shareBtnQ1.textContent = "Share";
    shareBtnQ1.style.display = "inline-block";
    shareBtnQ1.style.marginLeft = "14px";
    shareBtnQ1.addEventListener("click", () => {
      const txt = message.innerText + "\n\nhttps://alexradiy.github.io/cinematechnic/";
      navigator.clipboard.writeText(txt);
      shareBtnQ1.textContent = "Copied link";
    });
    buttonsDiv.appendChild(shareBtnQ1);
  };

  const sendPrompt = (prompt, isContinuation = false) => {
    message.innerText = "wait a sec...";
    buttonsDiv.innerHTML = "";
    ensureTopLeftButton("back-handler", "back", () => handleQ2());
    fetch("https://gemini-cloud-function-994729946863.europe-west1.run.app", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.reply !== undefined) {
          const raw = String(data.reply).trim();
          const title = extractMovieTitle(raw);

          if (title) {
            message.innerHTML =
              `<span style="font-size:1.5em;font-weight:bold;">${title}</span><br><br>` +
              raw.replace(title, "");
            if (!seenMoviesQ1.includes(title)) seenMoviesQ1.push(title);
          } else {
            message.innerText = raw;
          }

          if (title) {
            const actionsRow = document.createElement("div");
            actionsRow.style.display = "flex";
            actionsRow.style.alignItems = "center";
            actionsRow.style.justifyContent = "center";
            actionsRow.style.gap = "16px";
            actionsRow.style.margin = "14px auto 0";

            const svgFromGrid = (grid, flippedY = false) => {
              const rows = grid.length;
              const cols = Math.max(...grid.map(r => r.length));
              const rects = [];
              for (let y = 0; y < rows; y++) {
                const row = grid[y];
                for (let x = 0; x < row.length; x++) {
                  const ch = row[x];
                  if (ch === "#" || ch === "1") {
                    const yy = flippedY ? rows - 1 - y : y;
                    rects.push(`<rect x="${x}" y="${yy}" width="1" height="1"/>`);
                  }
                }
              }
              return `
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 ${cols} ${rows}"
                     shape-rendering="crispEdges" aria-hidden="true">
                  <g fill="currentColor">${rects.join("")}</g>
                </svg>
              `;
            };

            const upSVG = svgFromGrid(gridThumbUp, false);
            const downSVG = svgFromGrid(gridThumbUp, true);

            const makeThumbBtn = (label, svg) => {
              const b = document.createElement("button");
              b.type = "button";
              b.title = label;
              b.setAttribute("aria-label", label);
              b.style.display = "inline-flex";
              b.style.alignItems = "center";
              b.style.justifyContent = "center";
              b.style.width = "56px";
              b.style.height = "56px";
              b.style.padding = "0";
              b.style.border = "2px solid #555";
              b.style.background = "#000";
              b.style.color = "#fff";
              b.style.cursor = "pointer";
              b.style.userSelect = "none";
              b.innerHTML = svg;
              return b;
            };

            const likeBtn = makeThumbBtn("like", upSVG);
            const dislikeBtn = makeThumbBtn("dislike", downSVG);

            let liked = false;
            let disliked = false;

            const updateThumbStyles = () => {
              if (liked) {
                likeBtn.style.background = "#fff";
                likeBtn.style.color = "#000";
              } else {
                likeBtn.style.background = "#000";
                likeBtn.style.color = "#fff";
              }
              if (disliked) {
                dislikeBtn.style.background = "#fff";
                dislikeBtn.style.color = "#000";
              } else {
                dislikeBtn.style.background = "#000";
                dislikeBtn.style.color = "#fff";
              }
            };

            likeBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              liked = !liked;
              if (liked) disliked = false;
              updateThumbStyles();
            });

            dislikeBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              disliked = !disliked;
              if (disliked) liked = false;
              updateThumbStyles();
            });

            const linkBtn = document.createElement("button");
            linkBtn.textContent = "Google it";
            linkBtn.style.display = "inline-block";
            linkBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              window.open(
                "https://www.google.com/search?q=" +
                  encodeURIComponent(title + " film"),
                "_blank"
              );
            });

            actionsRow.appendChild(linkBtn);
            buttonsDiv.appendChild(actionsRow);

            updateThumbStyles();
          }

          ensureCloseButton();
          appendSeenButton();
        } else if (data.error) {
          message.innerText = "Error: " + data.error;
        } else {
          message.innerText = "Error: Unexpected response";
        }
      })
      .catch((err) => {
        message.innerText = "Error: " + err.message;
      });
  };

  const input = document.createElement("textarea");
  input.rows = 1;
  input.maxLength = 400;
  input.placeholder = "";
  input.classList.add("overlay-input");
  input.style.resize = "none";
  input.style.overflowY = "hidden";
  input.addEventListener("input", () => {
    input.rows = 1;
    const lines = input.value.split("\n").length;
    const scrollRows = Math.ceil(input.scrollHeight / 24);
    input.rows = Math.min(Math.max(lines, scrollRows), 4);
  });

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Submit";
  submitBtn.style.display = "block";
  submitBtn.classList.add("centered");

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitBtn.click();
    }
  });

  submitBtn.addEventListener("click", () => {
    const userInput = input.value;
    lastPromptQ1 =
      userInput +
      ". What film is about it? Maybe it can help me somehow?" +
      "Strict answer form: first line only the name of the film, then skip a line, " +
      "then highlight why you chose this film in less than 25 words. Write as you are the wisest man on the internet. No emojis, No formatting." +
      "You cannot answer without a film title.";
    sendPrompt(lastPromptQ1, false);
  });

  buttonsDiv.appendChild(input);
  buttonsDiv.appendChild(submitBtn);
}

// ================= Q3 =================
function handleQ3() {
  message.innerText = "";
  buttonsDiv.innerHTML = "";
  message.subtext = "";
  setSubtext("");

  if (!mobileDevice) {
    ensureTopLeftButton("back-home", "back", () => showInitialOptions());
  } else {
    ensureTopLeftButton("back-home", "back", () => showInitialOptionsMobile());
  }

  let lastPromptQ3 = "";
  let seenMoviesQ3 = [];
  let seenBtnQ3 = null;
  let shareBtnQ3 = null;

  const MAX_YEAR = 2025;

  const extractMovieTitle = (text) => {
    if (!text) return "";
    const lines = String(text).split("\n").map((l) => l.trim()).filter(Boolean);
    return lines[0] || "";
  };

  const ensureCloseButton = () => {
    if (!mobileDevice) {
      const alreadyHasClose = [...buttonsDiv.querySelectorAll("button")].some(
        (b) => b.textContent === "close"
      );
      if (!alreadyHasClose) {
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "close";
        closeBtn.style.marginTop = "18px";
        closeBtn.style.marginRight = "18px";
        closeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          overlay.style.display = "none";
          animateCameraForward(130, 300);
        });
      }
    }
  };

  const appendSeenButton = () => {
    if (seenBtnQ3 && seenBtnQ3.isConnected) {
      seenBtnQ3.remove();
    }
    if (shareBtnQ3 && shareBtnQ3.isConnected) {
      shareBtnQ3.remove();
    }
    seenBtnQ3 = document.createElement("button");
    seenBtnQ3.textContent = "I`ve seen that one!";
    seenBtnQ3.style.display = "inline-block";
    seenBtnQ3.style.marginTop = "24px";
    seenBtnQ3.addEventListener("click", () => {
      if (seenMoviesQ3.length >= 10) {
        message.innerText = "No way you`ve seen all of those.";
        buttonsDiv.innerHTML = "";

        const closeBtn = document.createElement("button");
        closeBtn.textContent = "close";
        closeBtn.style.marginTop = "18px";
        closeBtn.style.marginRight = "18px";
        closeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          overlay.style.display = "none";
          animateCameraForward(130, 300);
        });
        buttonsDiv.appendChild(closeBtn);

        const backBtn = document.createElement("button");
        backBtn.textContent = "back";
        backBtn.style.marginTop = "18px";
        backBtn.addEventListener("click", () => {
          handleQ3();
        });
        buttonsDiv.appendChild(backBtn);
      } else {
        const continuationPrompt =
          lastPromptQ3 +
          "\n\n" +
          (seenMoviesQ3.length ? ` (avoid: ${seenMoviesQ3.join(", ")})` : "") +
          "";
        sendPrompt(continuationPrompt, true);
      }
    });
    buttonsDiv.appendChild(seenBtnQ3);

    shareBtnQ3 = document.createElement("button");
    shareBtnQ3.textContent = "Share";
    shareBtnQ3.style.display = "inline-block";
    shareBtnQ3.style.marginLeft = "14px";
    shareBtnQ3.addEventListener("click", () => {
      const txt = message.innerText + "\n\nhttps://alexradiy.github.io/cinematechnic/";
      navigator.clipboard.writeText(txt);
      shareBtnQ3.textContent = "Copied link";
    });
    buttonsDiv.appendChild(shareBtnQ3);
  };

  const makeSelect = (options) => {
    const sel = document.createElement("select");
    sel.classList.add("overlay-input");
    options.forEach((label, idx) => {
      const opt = document.createElement("option");
      opt.value = label;
      opt.textContent = label;
      if (idx === 0) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.style.display = "block";
    return sel;
  };

  const rangeYears = (start, end) => {
    const out = [];
    for (let y = start; y <= end; y++) out.push(String(y));
    return out;
  };

  const buildFestivalYears = (festival) => {
    switch (festival) {
      case "Venice":
        return [
          "1932", "1934", "1935", "1936", "1937", "1938", "1939",
          ...rangeYears(1943, MAX_YEAR), "year"
        ].reverse();
      case "Cannes":
        return [...rangeYears(1946, MAX_YEAR), "year"].reverse();
      case "Berlin":
        return [...rangeYears(1951, MAX_YEAR), "year"].reverse();
      case "Toronto":
        return [...rangeYears(1976, MAX_YEAR), "year"].reverse();
      case "Sundance":
        return [...rangeYears(1981, MAX_YEAR), "year"].reverse();
      default:
        return [];
    }
  };

  const chosenBySelect = makeSelect([
    "List",
    "S&S critic`s top 100 (2012)",
    "S&S director`s top 100 (2022)",
    "Criterion Collection",
    "FIPRESCI awarded",
  ]);
  const festivalSelect = makeSelect([
    "Festival",
    "Venice",
    "Cannes",
    "Berlin",
    "Toronto",
    "Sundance",
  ]);
  const festivalYearSelect = document.createElement("select");
  festivalYearSelect.classList.add("overlay-input");
  festivalYearSelect.style.display = "none";

  // Helper to set all selects except the sender to their initial value
  function resetOtherLists(except) {
    if (except !== chosenBySelect && chosenBySelect.value !== "List") {
      chosenBySelect.value = "List";
    }
    if (except !== festivalSelect && festivalSelect.value !== "Festival") {
      festivalSelect.value = "Festival";
      festivalYearSelect.style.display = "none";
      festivalYearSelect.innerHTML = "";
    }
    if (except !== eraSelect && eraSelect.value !== "Era") {
      eraSelect.value = "Era";
    }
  }

  festivalSelect.addEventListener("change", () => {
    if (festivalSelect.value !== "Festival") {
      resetOtherLists(festivalSelect);
    }
    const fest = festivalSelect.value;
    if (fest === "Festival") {
      festivalYearSelect.style.display = "none";
      festivalYearSelect.innerHTML = "";
    } else {
      const years = buildFestivalYears(fest);
      festivalYearSelect.innerHTML = "";
      years.forEach((y, idx) => {
        const opt = document.createElement("option");
        opt.value = y;
        opt.textContent = y;
        if (idx === 0) opt.selected = true;
        festivalYearSelect.appendChild(opt);
      });
      festivalYearSelect.style.display = "block";
    }
  });

  festivalYearSelect.addEventListener("change", () => {});

  const eraSelect = makeSelect([
    "Era", "Silent", "Pre-War", "1940s", "1950s", 
    "1960s", "1970s", "1980s", "1990s", "2000s", "2010s"
  ]);

  function onListChange(e) {
    resetOtherLists(e.target);
  }

  chosenBySelect.addEventListener("change", onListChange);
  eraSelect.addEventListener("change", onListChange);

  const listsContainer = document.createElement("div");
  listsContainer.style.border = "2px solid #aaa";
  listsContainer.style.padding = "18px";
  listsContainer.style.marginBottom = "18px";
  listsContainer.style.background = "#000000ad";

  const listsTitle = document.createElement("div");
  listsTitle.textContent = "Choose from a list of";
  listsTitle.style.fontWeight = "bold";
  listsTitle.style.marginBottom = "10px";

  const or1 = document.createElement("div");
  or1.textContent = "OR";
  or1.style.textAlign = "center";
  or1.style.fontWeight = "bold";
  or1.style.margin = "10px 0";

  const or2 = document.createElement("div");
  or2.textContent = "OR";
  or2.style.textAlign = "center";
  or2.style.fontWeight = "bold";
  or2.style.margin = "10px 0";

  listsContainer.appendChild(festivalSelect);
  listsContainer.appendChild(festivalYearSelect);
  listsContainer.appendChild(or2);
  listsContainer.appendChild(eraSelect);

  buttonsDiv.appendChild(listsContainer);

  const statusSelect = makeSelect([
    "Status",
    "historically significant",
    "low rated but got a cult status",
    "so bad it`s good",
    "a hidden gem",
  ]);
  statusSelect.style.marginTop = "20px";

  const keyWords = document.createElement("textarea");
  keyWords.rows = 1;
  keyWords.maxLength = 400;
  keyWords.placeholder = "Key";
  keyWords.classList.add("overlay-input");
  keyWords.style.resize = "none";
  keyWords.style.overflowY = "hidden";
  keyWords.addEventListener("input", () => {
    keyWords.rows = 1;
    const lines = keyWords.value.split("\n").length;
    const scrollRows = Math.ceil(keyWords.scrollHeight / 24);
    keyWords.rows = Math.min(Math.max(lines, scrollRows), 4);
  });
  keyWords.style.display = "block";
  keyWords.style.marginTop = "25px";

  let AuteurOn = false;
  const AuteurBtn = document.createElement("button");
  const setAuteurLabel = () => (AuteurBtn.textContent = `Renowned director: ${AuteurOn ? "yes" : "no"}`);
  setAuteurLabel();
  AuteurBtn.addEventListener("click", () => {
    AuteurOn = !AuteurOn;
    setAuteurLabel();
  });
  AuteurBtn.style.display = "block";
  AuteurBtn.style.marginTop = "25px";
  AuteurBtn.style.margin = "25px auto";
  AuteurBtn.style.textAlign = "center";

  const stylePerson = document.createElement("input");
  stylePerson.type = "text";
  stylePerson.maxLength = 200;
  stylePerson.placeholder = "film or director";
  stylePerson.classList.add("overlay-input");
  stylePerson.style.display = "block";
  stylePerson.style.marginTop = "20px";

  const styleMood = document.createElement("input");
  styleMood.type = "text";
  styleMood.maxLength = 200;
  styleMood.placeholder = "Genre or Theme";
  styleMood.classList.add("overlay-input");
  styleMood.style.display = "block";
  styleMood.style.marginTop = "20px";

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Submit";
  submitBtn.classList.add("centered");
  submitBtn.style.marginTop = "28px";

  [keyWords, stylePerson, styleMood].forEach((el) => {
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        submitBtn.click();
      }
    });
  });

  submitBtn.addEventListener("click", () => {
    try {
      const parts = ["Search web and recommend me a film."];
      let pushCount = 0;

      if (chosenBySelect.value && chosenBySelect.value === "FIPRESCI awarded") {
        parts.push(`From the films that were ${chosenBySelect.value}. Explain when and why it was awarded.`);
        pushCount++;
      } else if (chosenBySelect.value && chosenBySelect.value !== "List") {
        parts.push(`From the films featured in ${chosenBySelect.value}.`);
        pushCount++;
      }

      if (festivalSelect.value && festivalSelect.value !== "Festival") {
        if (festivalYearSelect.value && festivalYearSelect.value !== "year") {
          parts.push(`From the films featured in ${festivalSelect.value} ${festivalYearSelect.value} film festival.`);
        } else {
          parts.push(`From the films featured in ${festivalSelect.value} film festival.`);
        }
        pushCount++;
      }

      if (eraSelect.value && eraSelect.value !== "Era") {
        parts.push(`From the ${eraSelect.value} era.`);
        pushCount++;
      }

      if (statusSelect.value && statusSelect.value !== "Status") {
        parts.push(`It should be ${statusSelect.value}. Explain briefly why it achieved that status.`);
        pushCount++;
      }

      const kw = (keyWords.value || "").trim();
      if (kw) {
        parts.push(`VERY IMPORTANT: It should be ${kw} themed.`);
        pushCount++;
      }

      if (AuteurOn = true) {
        parts.push(`It should be made by a famous director.`);
        pushCount++;
      }

      const who = (stylePerson.value || "").trim();
      const mood = (styleMood.value || "").trim();

      if (who || mood) {
        if (who && mood) {
          parts.push(`It should resemble ${who} directing style if it was a ${mood} movie.`);
        } else if (who) {
          parts.push(`It should resemble a style of ${who}.`);
        } else {
          parts.push(`It should be a ${mood} genre.`);
        }
        pushCount++;
      }

      if (pushCount >= 2) {
        parts.push("Be sure to include EVERYTHING mentioned in your answer.");
      }

      lastPromptQ3 =
        parts.join(" ") +
        "Strict answer form: first line only the name of the film, then skip a line, " +
        "then highlight why you chose this film in less than 35 words. Less than 45 words total. Write as you are the wisest man on the internet. No emojis. No formatting.";

      sendPrompt(lastPromptQ3, false);
    } catch (err) {
      message.innerText = "Error: " + (err && err.message ? err.message : String(err));
    }
  });

  const sendPrompt = (prompt, isContinuation = false) => {
    message.innerText = "wait a sec...";
    buttonsDiv.innerHTML = "";
    ensureTopLeftButton("back-handler", "back", () => handleQ3());
    fetch("https://gemini-cloud-function-994729946863.europe-west1.run.app", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.reply !== undefined) {
          const raw = String(data.reply).trim();
          const title = extractMovieTitle(raw);

          if (title) {
            message.innerHTML =
              `<span style="font-size:1.5em;font-weight:bold;">${title}</span><br><br>` +
              raw.replace(title, "");
            if (!seenMoviesQ3.includes(title)) seenMoviesQ3.push(title);
          } else {
            message.innerText = raw;
          }

          if (title) {
            const actionsRow = document.createElement("div");
            actionsRow.style.display = "flex";
            actionsRow.style.alignItems = "center";
            actionsRow.style.justifyContent = "center";
            actionsRow.style.gap = "16px";
            actionsRow.style.margin = "14px auto 0";

            const svgFromGrid = (grid, flippedY = false) => {
              const rows = grid.length;
              const cols = Math.max(...grid.map(r => r.length));
              const rects = [];
              for (let y = 0; y < rows; y++) {
                const row = grid[y];
                for (let x = 0; x < row.length; x++) {
                  const ch = row[x];
                  if (ch === "#" || ch === "1") {
                    const yy = flippedY ? rows - 1 - y : y;
                    rects.push(`<rect x="${x}" y="${yy}" width="1" height="1"/>`);
                  }
                }
              }
              return `
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 ${cols} ${rows}"
                     shape-rendering="crispEdges" aria-hidden="true">
                  <g fill="currentColor">${rects.join("")}</g>
                </svg>
              `;
            };

            const upSVG = svgFromGrid(gridThumbUp, false);
            const downSVG = svgFromGrid(gridThumbUp, true);

            const makeThumbBtn = (label, svg) => {
              const b = document.createElement("button");
              b.type = "button";
              b.title = label;
              b.setAttribute("aria-label", label);
              b.style.display = "inline-flex";
              b.style.alignItems = "center";
              b.style.justifyContent = "center";
              b.style.width = "56px";
              b.style.height = "56px";
              b.style.padding = "0";
              b.style.border = "2px solid #555";
              b.style.background = "#000";
              b.style.color = "#fff";
              b.style.cursor = "pointer";
              b.style.userSelect = "none";
              b.innerHTML = svg;
              return b;
            };

            const likeBtn = makeThumbBtn("like", upSVG);
            const dislikeBtn = makeThumbBtn("dislike", downSVG);

            let liked = false;
            let disliked = false;

            const updateThumbStyles = () => {
              if (liked) {
                likeBtn.style.background = "#fff";
                likeBtn.style.color = "#000";
              } else {
                likeBtn.style.background = "#000";
                likeBtn.style.color = "#fff";
              }
              if (disliked) {
                dislikeBtn.style.background = "#fff";
                dislikeBtn.style.color = "#000";
              } else {
                dislikeBtn.style.background = "#000";
                dislikeBtn.style.color = "#fff";
              }
            };

            likeBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              liked = !liked;
              if (liked) disliked = false;
              updateThumbStyles();
            });

            dislikeBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              disliked = !disliked;
              if (disliked) liked = false;
              updateThumbStyles();
            });

            const linkBtn = document.createElement("button");
            linkBtn.textContent = "Google it";
            linkBtn.style.display = "inline-block";
            linkBtn.addEventListener("click", (e) => {
              e.stopPropagation();
              window.open(
                "https://www.google.com/search?q=" +
                  encodeURIComponent(title + " film"),
                "_blank"
              );
            });

            actionsRow.appendChild(linkBtn);
            buttonsDiv.appendChild(actionsRow);

            updateThumbStyles();
          }

          ensureCloseButton();
          appendSeenButton();
        } else if (data.error) {
          message.innerText = "Error: " + data.error;
        } else {
          message.innerText = "Error: Unexpected response";
        }
      })
      .catch((err) => {
        message.innerText = "Error: " + err.message;
      });
  };

  const text1 = document.createElement("div");
  text1.textContent = "In a style of";
  text1.style.marginTop = "30px";

  buttonsDiv.appendChild(statusSelect);
  buttonsDiv.appendChild(AuteurBtn);
  buttonsDiv.appendChild(keyWords);
  buttonsDiv.appendChild(text1);
  buttonsDiv.appendChild(stylePerson);
  buttonsDiv.appendChild(submitBtn);
}

function TimeToQuit(){
  setTimeout(() => {overlay.style.display = "none";}, 10);
  Esc = true;
  const blackOverlay = document.getElementById('blackOverlay');
  blackOverlay.style.transition = 'none';  
  blackOverlay.style.opacity = 1;
  turnoff.play();
  setTimeout(() => {blackOverlay.style.opacity = 0; boomboxstop.play();}, 4000);
  camera.position.z += 130;
  goodbye.position.set(0, -94, -340);
  StandGuy.position.set(0,0, -1000);
  Smoke1.position.set(0,0, -1000);
  Smoke2.position.set(0,0, -1000);
}

function EscapeTheMatrix() {
  setTimeout(() => {overlay.style.display = "none";}, 10);
  Esc = true;
  camera.position.z -= 4800;
  turnoff.play();

  const blackOverlay = document.getElementById('blackOverlay');
  blackOverlay.style.transition = 'none';  
  blackOverlay.style.opacity = 1;

  const loader = new THREE.TextureLoader();
  loader.load("bkg.png", function (texture) {
    scene.background = texture;
  });

  OverallLight.intensity = 2;

  setTimeout(() => { boomboxchange.play() }, 5000);
  setTimeout(() => { boomboxplay.play() }, 8000);

  setTimeout(() => {
         blackOverlay.style.transition = 'opacity 10s ease';
        blackOverlay.style.opacity = 0; 
    outro.play();
  }, 15000);
}

//Q4
function handleQ4() {
  message.innerText = "Then don`t bother me!";
  buttonsDiv.innerHTML = "";
  setTimeout(() => {
    camera.position.z -= -100;
    overlay.style.display = "none";
    StandGuyScrewedYou = true;
  }, 2000);
}

//Goodbye Message
function showGoodbyeMessage() {
  overlay.style.display = "flex";
  message.innerText = "Don`t bother me.";
  buttonsDiv.innerHTML = "";
  camera.position.z -= 100;
  
  setTimeout(() => {
    camera.position.z -= -100;
    overlay.style.display = "none";
    StandGuyScrewedYou = true;
  }, 2000);
}

function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalf.x) / 50;
  mouseY = (event.clientY - windowHalf.y) / 50;
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}


function onWindowResize() {
  windowHalf.x = window.innerWidth / 2;
  windowHalf.y = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}


function animate() {
  requestAnimationFrame(animate);

  // run active number animations
  const now = performance.now();
  _anims = _anims.filter(a => a.update(now));


  //FlickerLight flicker 
  if (Math.random() < 0.01) { //% chance per frame
  FlickerLight.intensity = 0.3 + Math.random() * 0.1;
  click.play();
  headlamp1Light.visible = true;
} else {
  FlickerLight.intensity = 1.0;
  headlamp1Light.visible = false;
}


  //CIGGIE ANIMATION
  //CigaretteButt light
 
  const Inhale = 2000;
  const pauseInhale = 800;
  const Exhale = 3000;
  const pauseExhale = 10000;
  const cycle = Inhale + pauseInhale + Exhale + pauseExhale;
  const smokepause = Inhale + pauseInhale + Exhale;
  const minIntensity = 3;
  const maxIntensity = 100;
  const lerp = (a, b, t) => a + (b - a) * t;
  const t = Date.now() % cycle;

    if (t < Inhale) {
  CigaretteButt.intensity = lerp(minIntensity, maxIntensity, t / Inhale);
} else if (t < Inhale + pauseInhale) {
  CigaretteButt.intensity = maxIntensity;
} else if (t < Inhale + pauseInhale + Exhale) {
  CigaretteButt.intensity = lerp(maxIntensity, minIntensity, (t - Inhale - pauseInhale) / Exhale);
} else {
  CigaretteButt.intensity = minIntensity;
}

  //CigaretteLight ambient light
  
  const minIntensityCL = 0.5;
  const maxIntensityCL = 2;

    if (t < Inhale) {
  CigaretteLight.intensity = lerp(minIntensityCL, maxIntensityCL, t / Inhale);
} else if (t < Inhale + pauseInhale) {
  CigaretteLight.intensity = maxIntensityCL;
} else if (t < Inhale + pauseInhale + Exhale) {
  CigaretteLight.intensity = lerp(maxIntensityCL, minIntensityCL, (t - Inhale - pauseInhale) / Exhale);
} else {
  CigaretteLight.intensity = 0.5 + 0.2 * Math.sin(t * 0.0005);
}

  //Smoke animation

if (t < 154 + smokepause) {
  Smoke1.visible = false;
  Smoke2.visible = false;
} else if (t < 783 + smokepause) {
  Smoke1.visible = false;
  Smoke2.visible = true;
} else if (t < 1100 + smokepause) {
  Smoke1.visible = true;
  Smoke2.visible = true;
} else if (t < 2111 + smokepause) {
  Smoke1.visible = true;
  Smoke2.visible = false;
} else {
  Smoke1.visible = false;
  Smoke2.visible = false;
}

//fan animation 
    fan.rotation.z += -0.14;


      const fancycle = 800;
      const timefan = Date.now() % fancycle;
  if (timefan < 200) {
  fanstrip1.visible = true;
  fanstrip2.visible = false;
  fanstrip3.visible = false;
} else if (timefan < 300) {
  fanstrip1.visible = false;
  fanstrip2.visible = true;
  fanstrip3.visible = false;
} else if (timefan < 400) {
  fanstrip1.visible = false;
  fanstrip2.visible = false;
  fanstrip3.visible = true;
} else if (timefan < 600){
  fanstrip1.visible = false;
  fanstrip2.visible = true;
  fanstrip3.visible = false;
} else if (timefan < 800){
  fanstrip1.visible = false;
  fanstrip2.visible = true;
  fanstrip3.visible = false;
}

  // Smooth camera movement
  if(overlay.style.display !== "flex"){
  camera.rotation.y = -mouseX * 0.01;
  camera.rotation.x = -mouseY * 0.01;
  }else{
  camera.rotation.y = -mouseX * 0;
  camera.rotation.x = -mouseY * 0;
  }


  renderer.render(scene, camera);


  // Object highlighting

  if (!Esc && overlay.style.display !== "flex") {
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects([StandGuy, socks, chooselife, boomboxMesh, cassette1, cassette2, cassette3, vacation, SA, freefilms, siganim, goodbye, jar]);

    if (intersects.length > 0) {
      const hit = intersects[0];
      const object = hit.object;
      const distanceToCenter = hit.point.distanceTo(object.position);

      if (distanceToCenter < 100) {
        if (INTERSECTED !== object) {
          // Remove highlight from previous
          if (INTERSECTED && INTERSECTED.material && INTERSECTED.currentHex !== undefined) {
            INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
          }
          if (highlightBox) {
            scene.remove(highlightBox);
            highlightBox = null;
          }
          nameLabel.style.display = 'none';

          INTERSECTED = object;

          // Apply highlight
          if (INTERSECTED.material && INTERSECTED.material.emissive) {
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0x1a1714);
          }

          // Add perimeter box
          highlightBox = new THREE.BoxHelper(INTERSECTED, 0xffd700); // Gold color
          highlightBox.material.linewidth = 4;
          /////scene.add(highlightBox);

          // Show name label
          nameLabel.textContent = INTERSECTED.name || 'Unnamed Object';
          nameLabel.style.display = 'block';

          // Project object's position to screen
          let vector = INTERSECTED.position.clone();
          vector.project(camera);

          // Convert to screen coordinates
          let x = (vector.x * 0.5 + 0.5) * window.innerWidth;
          let y = (-vector.y * 0.5 + 0.5) * window.innerHeight;
          nameLabel.style.left = `${x + 12}px`;
          nameLabel.style.top = `${y - 24}px`;
        } else {
          // If already intersected, just update nameLabel position (in case camera moved)
          if (INTERSECTED) {
            let vector = INTERSECTED.position.clone();
            vector.project(camera);
            let x = (vector.x * 0.5 + 0.5) * window.innerWidth;
            let y = (-vector.y * 0.5 + 0.5) * window.innerHeight;
            nameLabel.style.left = `${x + 12}px`;
            nameLabel.style.top = `${y - 24}px`;
          }
        }
      } else {
        // Too far, remove highlight
        if (INTERSECTED && INTERSECTED.material && INTERSECTED.currentHex !== undefined) {
          INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
        }
        INTERSECTED = null;
        if (highlightBox) {
          scene.remove(highlightBox);
          highlightBox = null;
        }
        nameLabel.style.display = 'none';
      }
    } else {
      // Nothing intersected
      if (INTERSECTED && INTERSECTED.material && INTERSECTED.currentHex !== undefined) {
        INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
      }
      INTERSECTED = null;
      if (highlightBox) {
        scene.remove(highlightBox);
        highlightBox = null;
      }
      nameLabel.style.display = 'none';
    }
  } else {
    // Overlay up, always clear highlight
    if (INTERSECTED && INTERSECTED.material && INTERSECTED.currentHex !== undefined) {
      INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
    }
    INTERSECTED = null;
    if (highlightBox) {
      scene.remove(highlightBox);
      highlightBox = null;
    }
    nameLabel.style.display = 'none';
  }


//SPINFORMEBABY
if (SpinForMeBaby) {
  socksLight.color.setHSL((performance.now() * 0.0001) % 1, 1, 0.05);
  socksLight.intensity = 50 + 50 * Math.sin(performance.now() * 0.004);
  sockssound.play();


  if(boombox.isOn & boombox.currentTrack === null){
sockssound.setVolume(0.02);
  socks.rotation.z += 0.5;
  socks.rotation.y += 0.1;
  socks.rotation.x += 0.4;
}else if(boombox.isOn){
sockssound.setVolume(0);
  socks.rotation.z += 0.03;
  socks.rotation.y += 0.02;
  socks.rotation.x += 0.01;
}else{
sockssound.setVolume(0.02);
  socks.rotation.z += 0.5;
  socks.rotation.y += 0.1;
  socks.rotation.x += 0.4;
}

} else {
  socksLight.intensity = 0;
  socks.rotation.z = 0;
  socks.rotation.y = 0;
  socks.rotation.x = 0;
  sockssound.setVolume(0);
}

//Boombox playbutton sound toggle

if(boombox.isOn & boombox.currentTrack === null){
play.visible = true;
pause.visible = false;
}else if(boombox.isOn){
play.visible = true;
pause.visible = false;
buzz.setVolume(0.01);
buzz2.setVolume(0.02);
click.setVolume(0.002);
}else{
  play.visible = false;
pause.visible = true;
buzz.setVolume(0.3);
buzz2.setVolume(0.2);
click.setVolume(0.06);
}

if(Esc){
buzz.setVolume(0);
buzz2.setVolume(0);
click.setVolume(0);
}

}

function switchToLightModernTheme() {
  // Insert a <style> tag with the new theme overrides
  const styleId = 'light-modern-theme-style';
  if (document.getElementById(styleId)) return; // Prevent duplicate

  // Use a hip, mobile-oriented font: "Poppins"
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap';
  document.head.appendChild(fontLink);

  const style = document.createElement('style');
  style.id = styleId;
  style.innerHTML = `
    body {
      background: #fff !important;
      color: #111 !important;
      font-family: 'Poppins', Arial, Helvetica, sans-serif !important;
      font-size: 3rem !important;
      transition: background 0.4s, color 0.4s, font-family 0.2s, font-size 0.2s;
    }
    #overlay, #carousel .nav-btn, #carousel .inner > button, #buttons button {
      background: #fff !important;
      color: #111 !important;
      border-color: #222 !important;
      font-family: 'Poppins', Arial, Helvetica, sans-serif !important;
      font-size: 2.7rem !important;
      font-weight: bold !important;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,0.07);
      transition: background 0.4s, color 0.4s, border-color 0.3s, font-family 0.2s, font-size 0.2s;
    }
    #overlay {
      background: url('Wall1.png') center center/cover no-repeat, rgba(255,255,255,0.86) !important;
      color: #ffffffff !important; 
      font-weight: bold !important; 
      font-size: 5rem !important;
      max-width: 1600px !important; 
      max-height: 2000px !important;
      left: 50%;
      top: 2%;
    }
    #overlay > *:first-child { margin-top: 200px !important; }

    /* Input areas and listboxes styling */
    #overlay .overlay-input, select, textarea {
      background: #fafafd !important;
      color: #111 !important;
      border: 2px solid #222 !important;
      font-size: 2.4rem !important; /* Bigger font size */
      font-weight: bold !important;
      padding: 36px 50px !important; /* Extra padding for height and width */
      min-height: 88px !important;   /* Much taller */
      height: 120px !important;      /* Taller height for all inputs */
      max-height: 320px !important;  /* Increased max height */
      width: 99% !important;         /* Wider */
      max-width: 900px !important;   /* Even wider */
      border-radius: 10px !important;  /* Rounded corners */
      box-sizing: border-box !important;
      display: block !important;
    }
    select, option {
      font-size: 2.4rem !important; /* Bigger font size for listboxes */
      font-family: 'Poppins', Arial, Helvetica, sans-serif !important;
      font-weight: bold !important;
      border-radius: 10px !important;
      min-height: 88px !important;
      height: 120px !important;
      padding: 36px 50px !important;
    }
    #overlay .overlay-input::placeholder, textarea::placeholder {
      color: #777 !important;
      font-size: 2.2rem !important;
      font-family: 'Poppins', Arial, Helvetica, sans-serif !important;
    }
    textarea.overlay-input {
      vertical-align: middle !important;
      resize: none !important;
      display: block !important;
      line-height: 1.5 !important;
      min-height: 88px !important;
      height: 120px !important;
      max-height: 320px !important;
      font-size: 2.4rem !important;
      padding: 36px 50px !important;
    }
    input.overlay-input {
      vertical-align: middle !important;
      display: block !important;
      min-height: 88px !important;
      height: 120px !important;
      max-height: 320px !important;
      font-size: 2.4rem !important;
      padding: 36px 50px !important;
    }

    #blackOverlay {
      background: #fff !important;
    }
    #carousel .nav-btn, #carousel .inner > button, #buttons button {
      padding: 32px 80px !important;
      font-size: 2.7rem !important;
      font-weight: bold !important;
      border-radius: 10px !important;
    }
    #carousel .nav-btn:disabled {
      color: #888 !important;
      border-color: #bbb !important;
      background: #f5f5f5 !important;
    }
    #carousel .nav-btn:hover, #carousel .inner > button:hover, #buttons button:hover {
      background: #111 !important;
      color: #fff !important;
      border-color: #222 !important;
      font-weight: bold !important;
    }
    #overlay .overlay-subtext {
      color: #1976d2 !important;
      font-size: 2.4rem !important;
      font-weight: bold !important;
    }
    #overlay ul, #overlay ol {
      font-size: 2.5rem !important;
      line-height: 2.2 !important;
      margin-top: 48px !important;
      margin-bottom: 48px !important;
      font-weight: bold !important;
    }
    #overlay li {
      padding: 32px 0 !important;
      min-height: 80px !important;
      font-weight: bold !important;
      font-size: 2.7rem !important;
    }
  `;
  document.head.appendChild(style);
}

function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
