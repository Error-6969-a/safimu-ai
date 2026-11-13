/* ============================================================
   SaFiMu AI — app.js  (Production Release v1.0)
   ============================================================ */
'use strict';

const $  = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

const KEY = { THEME: 'safimu.theme', HISTORY: 'safimu.history', SAVED: 'safimu.saved', API_KEY: 'safimu.gemini' };

// FIX: Updated to the latest stable model
const MODEL_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const CATEGORIES = [
  { id: 'furniture',   name: 'Furniture',      icon: '🪑', count: 6,  keys: ['chair', 'couch', 'bed', 'dining table', 'toilet', 'potted plant'] },
  { id: 'electronics', name: 'Electronics',    icon: '💻', count: 8,  keys: ['cell phone', 'laptop', 'tv', 'mouse', 'remote', 'keyboard', 'microwave', 'oven'] },
  { id: 'nature',      name: 'Animals & Nature',icon: '🌿', count: 7,  keys: ['dog', 'cat', 'bird', 'horse', 'sheep', 'cow', 'potted plant'] },
  { id: 'daily',       name: 'Daily Objects',  icon: '🏠', count: 7,  keys: ['bottle', 'cup', 'book', 'clock', 'vase', 'scissors', 'toothbrush'] },
  { id: 'vehicles',    name: 'Vehicles',       icon: '🚗', count: 4,  keys: ['car', 'motorcycle', 'bicycle', 'bus'] },
  { id: 'food',        name: 'Food & Kitchen', icon: '🍎', count: 6,  keys: ['banana', 'apple', 'sandwich', 'orange', 'broccoli', 'donut'] },
  { id: 'people',      name: 'People',         icon: '🧑', count: 1,  keys: ['person'] },
  { id: 'tools',       name: 'Industrial & Tools',icon: '🔧', count: 3,  keys: ['electric-motor','bearing','gear'] },
];

const KNOWLEDGE = {
  'person': { icon: '🧑', name: 'Person', category: 'Human', description: 'A human being.', function: 'Varies.', specs: { 'Type': 'Human' }, applications: ['Everywhere'], related: [] },
  'cell phone': { icon: '📱', name: 'Mobile Phone', category: 'Electronics', description: 'A portable device for communication and computing.', function: 'Communication, internet, photography.', specs: { 'Type': 'Smartphone', 'Screen': 'Touchscreen' }, applications: ['Calls', 'Browsing', 'Camera'], related: ['laptop'] },
  'laptop': { icon: '💻', name: 'Laptop', category: 'Electronics', description: 'A portable personal computer with a clamshell form factor.', function: 'Computing, work, entertainment.', specs: { 'Type': 'Notebook PC', 'Screen': 'LCD/OLED' }, applications: ['Work', 'Gaming', 'Education'], related: ['cell phone'] },
  'tv': { icon: '📺', name: 'Television', category: 'Electronics', description: 'A telecommunication medium for transmitting moving images and sound.', function: 'Entertainment, news, and media display.', specs: { 'Display': 'LED/OLED', 'Input': 'HDMI/USB' }, applications: ['Watching shows', 'Gaming', 'Presentations'], related: ['remote'] },
  'mouse': { icon: '🖱️', name: 'Computer Mouse', category: 'Electronics', description: 'A hand-held pointing device that detects two-dimensional motion.', function: 'Navigating computer interfaces.', specs: { 'Type': 'Optical/Wireless', 'Buttons': '2-5' }, applications: ['PC Navigation', 'Gaming'], related: ['laptop', 'keyboard'] },
  'keyboard': { icon: '⌨️', name: 'Keyboard', category: 'Electronics', description: 'A device with a set of keys used to input text and commands.', function: 'Typing and controlling a computer.', specs: { 'Layout': 'QWERTY', 'Connection': 'USB/Bluetooth' }, applications: ['Typing', 'Gaming'], related: ['laptop', 'mouse'] },
  'remote': { icon: '📱', name: 'Remote Control', category: 'Electronics', description: 'A handheld device used to control another device wirelessly.', function: 'Controlling TVs, ACs, or media players.', specs: { 'Tech': 'Infrared/Bluetooth' }, applications: ['TV control', 'AC control'], related: ['tv'] },
  'microwave': { icon: '♨️', name: 'Microwave Oven', category: 'Electronics', description: 'An electric appliance that heats and cooks food using microwaves.', function: 'Heating and cooking food quickly.', specs: { 'Power': '800-1200W', 'Type': 'Countertop' }, applications: ['Reheating food', 'Defrosting'], related: [] },
  'oven': { icon: '🥘', name: 'Oven', category: 'Electronics', description: 'An enclosed compartment used for heating, baking, or drying.', function: 'Baking and roasting food.', specs: { 'Type': 'Electric/Gas', 'Max Temp': '250°C' }, applications: ['Baking', 'Roasting'], related: ['microwave'] },
  'chair': { icon: '🪑', name: 'Chair', category: 'Furniture', description: 'A piece of furniture with a raised surface supported by legs.', function: 'Provides seating for one person.', specs: { 'Legs': 'Usually 4', 'Material': 'Wood/Metal/Plastic' }, applications: ['Sitting', 'Dining', 'Office'], related: ['dining table', 'couch'] },
  'couch': { icon: '🛋️', name: 'Couch / Sofa', category: 'Furniture', description: 'A piece of furniture for seating multiple people.', function: 'Relaxing, sitting, and living room comfort.', specs: { 'Seats': '2-4', 'Material': 'Fabric/Leather' }, applications: ['Living room', 'Lounge'], related: ['chair', 'tv'] },
  'bed': { icon: '🛏️', name: 'Bed', category: 'Furniture', description: 'A piece of furniture used as a place to sleep or relax.', function: 'Provides a comfortable surface for sleeping.', specs: { 'Size': 'Single/Queen/King', 'Material': 'Wood/Metal' }, applications: ['Sleeping', 'Resting'], related: ['potted plant'] },
  'dining table': { icon: '🪵', name: 'Dining Table', category: 'Furniture', description: 'A table used for eating meals.', function: 'Provides a flat surface for dining.', specs: { 'Shape': 'Round/Rectangular', 'Material': 'Wood/Glass' }, applications: ['Eating', 'Working'], related: ['chair'] },
  'toilet': { icon: '🚽', name: 'Toilet', category: 'Furniture', description: 'A sanitation fixture used for waste disposal.', function: 'Waste disposal.', specs: { 'Type': 'Flush', 'Material': 'Ceramic' }, applications: ['Bathroom'], related: [] },
  'potted plant': { icon: '🪴', name: 'Potted Plant', category: 'Nature', description: 'A plant grown indoors in a container.', function: 'Decoration, air purification.', specs: { 'Type': 'Indoor/Outdoor', 'Water': 'Low/Medium' }, applications: ['Home decor', 'Office decor'], related: [] },
  'bottle': { icon: '🍾', name: 'Bottle', category: 'Daily Objects', description: 'A container for liquids.', function: 'Holds water, beverages, or chemicals.', specs: { 'Material': 'Plastic/Glass/Metal', 'Capacity': 'Varies' }, applications: ['Drinking', 'Storage'], related: ['cup'] },
  'cup': { icon: '☕', name: 'Cup', category: 'Daily Objects', description: 'A small open container used for drinking.', function: 'Holds hot or cold beverages.', specs: { 'Material': 'Ceramic/Paper/Plastic' }, applications: ['Drinking tea/coffee'], related: ['bottle'] },
  'book': { icon: '📚', name: 'Book', category: 'Daily Objects', description: 'A collection of printed pages bound together.', function: 'Stores information and stories.', specs: { 'Format': 'Printed/Bound' }, applications: ['Reading', 'Education'], related: ['laptop'] },
  'clock': { icon: '⏰', name: 'Clock', category: 'Daily Objects', description: 'An instrument used to measure, keep, and indicate time.', function: 'Telling time.', specs: { 'Type': 'Analog/Digital', 'Power': 'Battery/Electric' }, applications: ['Timekeeping', 'Decor'], related: ['cell phone'] },
  'vase': { icon: '🏺', name: 'Vase', category: 'Daily Objects', description: 'An open container, often used to hold cut flowers.', function: 'Holding flowers or decoration.', specs: { 'Material': 'Ceramic/Glass' }, applications: ['Decor', 'Flower arrangement'], related: ['potted plant'] },
  'scissors': { icon: '✂️', name: 'Scissors', category: 'Daily Objects', description: 'A hand-operated shearing tool.', function: 'Cutting paper, cloth, or hair.', specs: { 'Type': 'Manual/Electric', 'Material': 'Stainless Steel' }, applications: ['Crafting', 'Cutting'], related: [] },
  'toothbrush': { icon: '🪥', name: 'Toothbrush', category: 'Daily Objects', description: 'An oral hygiene instrument used to clean teeth.', function: 'Cleaning teeth and gums.', specs: { 'Type': 'Manual/Electric', 'Bristle': 'Soft/Medium' }, applications: ['Dental care'], related: [] },
  'dog': { icon: '🐕', name: 'Dog', category: 'Nature', description: 'A domesticated descendant of the wolf.', function: 'Companionship, guarding, working.', specs: { 'Type': 'Mammal', 'Diet': 'Omnivore' }, applications: ['Pets', 'Security', 'Hunting'], related: ['person', 'cat'] },
  'cat': { icon: '🐈', name: 'Cat', category: 'Nature', description: 'A small domesticated carnivorous mammal.', function: 'Companionship, pest control.', specs: { 'Type': 'Mammal', 'Diet': 'Carnivore' }, applications: ['Pets'], related: ['dog'] },
  'bird': { icon: '🐦', name: 'Bird', category: 'Nature', description: 'A warm-blooded egg-laying vertebrate with feathers and wings.', function: 'Varies by species.', specs: { 'Type': 'Aves', 'Diet': 'Varies' }, applications: ['Nature ecosystem', 'Pets'], related: [] },
  'horse': { icon: '🐎', name: 'Horse', category: 'Nature', description: 'A large domesticated mammal used for riding and carrying loads.', function: 'Transportation, sports.', specs: { 'Type': 'Mammal', 'Diet': 'Herbivore' }, applications: ['Riding', 'Agriculture'], related: [] },
  'sheep': { icon: '🐑', name: 'Sheep', category: 'Nature', description: 'A domesticated ruminant mammal typically kept as livestock.', function: 'Wool, meat, milk.', specs: { 'Type': 'Mammal', 'Diet': 'Herbivore' }, applications: ['Farming', 'Wool production'], related: ['cow'] },
  'cow': { icon: '🐄', name: 'Cow', category: 'Nature', description: 'A large domesticated bovine.', function: 'Milk production, meat, farming.', specs: { 'Type': 'Mammal', 'Diet': 'Herbivore' }, applications: ['Dairy', 'Agriculture'], related: ['sheep'] },
  'car': { icon: '🚗', name: 'Car', category: 'Vehicles', description: 'A four-wheeled road vehicle.', function: 'Transports passengers and goods.', specs: { 'Wheels': '4', 'Fuel': 'Petrol/Diesel/EV' }, applications: ['Transportation'], related: [] },
  'motorcycle': { icon: '🏍️', name: 'Motorcycle', category: 'Vehicles', description: 'A two- or three-wheeled motor vehicle.', function: 'Fast, agile transportation.', specs: { 'Wheels': '2', 'Fuel': 'Petrol/Electric' }, applications: ['Transportation', 'Racing'], related: ['bicycle'] },
  'bicycle': { icon: '🚲', name: 'Bicycle', category: 'Vehicles', description: 'A human-powered or motor-powered tandem vehicle.', function: 'Eco-friendly transportation.', specs: { 'Wheels': '2', 'Power': 'Pedal' }, applications: ['Commuting', 'Exercise'], related: ['motorcycle'] },
  'bus': { icon: '🚌', name: 'Bus', category: 'Vehicles', description: 'A large motor vehicle carrying passengers.', function: 'Public transport.', specs: { 'Wheels': '4-6', 'Capacity': '30-80 people' }, applications: ['Public transport', 'School transport'], related: [] },
  'banana': { icon: '🍌', name: 'Banana', category: 'Food', description: 'An elongated curved fruit.', function: 'Food, energy source.', specs: { 'Color': 'Yellow/Green', 'Type': 'Fruit' }, applications: ['Eating', 'Baking'], related: ['apple'] },
  'apple': { icon: '🍎', name: 'Apple', category: 'Food', description: 'A round fruit with red or green skin.', function: 'Food, nutrition.', specs: { 'Color': 'Red/Green', 'Type': 'Fruit' }, applications: ['Eating', 'Juice'], related: ['banana'] },
  'sandwich': { icon: '🥪', name: 'Sandwich', category: 'Food', description: 'Two or more slices of bread with fillings in between.', function: 'Quick meal.', specs: { 'Type': 'Fast food', 'Fillings': 'Varies' }, applications: ['Lunch', 'Snack'], related: [] },
  'orange': { icon: '🍊', name: 'Orange', category: 'Food', description: 'A round citrus fruit.', function: 'Food, vitamin C source.', specs: { 'Color': 'Orange', 'Type': 'Fruit' }, applications: ['Eating', 'Juice'], related: [] },
  'broccoli': { icon: '🥦', name: 'Broccoli', category: 'Food', description: 'An edible green plant in the cabbage family.', function: 'Nutritious vegetable.', specs: { 'Color': 'Green', 'Type': 'Vegetable' }, applications: ['Cooking', 'Salad'], related: [] },
  'donut': { icon: '🍩', name: 'Donut', category: 'Food', description: 'A small ring-shaped fried cake.', function: 'Sweet snack.', specs: { 'Type': 'Dessert', 'Topping': 'Sugar/Glaze' }, applications: ['Snack', 'Breakfast'], related: [] },
  'electric-motor': { icon: '⚙️', name: 'Electric Motor', category: 'Industrial', description: 'Converts electrical energy into mechanical rotation.', function: 'Drives pumps, fans, conveyors.', specs: { 'Voltage': '220–440 V', 'Power': '0.5–7.5 kW' }, applications: ['Pumps','Conveyors'], related: ['bearing'] },
  'bearing': { icon: '🔘', name: 'Ball Bearing', category: 'Industrial', description: 'Reduces friction between rotating parts.', function: 'Supports rotating shafts.', specs: { 'Type': 'Deep groove ball', 'Material': 'Chrome steel' }, applications: ['Motors','Wheels'], related: ['electric-motor'] },
  'gear': { icon: '⚙️', name: 'Gear', category: 'Industrial', description: 'Transmits rotary motion.', function: 'Changes speed or torque.', specs: { 'Material': 'Steel', 'Type': 'Spur/Helical' }, applications: ['Gearboxes','Machines'], related: ['bearing'] }
};

const state = {
  theme: 'dark', currentScreen: 'home',
  camera: { stream: null, track: null, facingMode: 'environment', running: false, zoomCapable: false, torchCapable: false, torchOn: false },
  ai: { model: null, isDetecting: false, loopId: null, detectionInterval: 200 },
  geminiKey: localStorage.getItem(KEY.API_KEY) || '',
  useCloudAI: !!localStorage.getItem(KEY.API_KEY),
  lastImageBase64: null,
  selected: [], lastObjectKey: null, history: [], saved: [], activeCategory: null,
  resumeDetectionAfterSheet: false 
};

document.addEventListener('DOMContentLoaded', init);

function init() {
  loadTheme(); loadStorage(); bindNavigation(); bindTheme(); bindCameraControls(); bindSheets(); bindAssistant(); bindSelectionBar(); bindProfile(); bindImageInput();
  renderHome(); renderDiscover(); renderHistory(); renderSaved(); updateCounts();

  if (state.geminiKey) {
    $('#geminiKeyInput').value = state.geminiKey;
    state.useCloudAI = true;
    $('#localAiSwitch').checked = false;
  }

  setTimeout(() => {
    const splash = $('#splash'); splash.classList.add('hide'); $('#app').classList.remove('hidden');
    setTimeout(() => splash.remove(), 500);
  }, 2500);
}

function loadTheme() { const saved = localStorage.getItem(KEY.THEME) || 'dark'; state.theme = saved; document.documentElement.setAttribute('data-theme', saved); }
function toggleTheme() { state.theme = state.theme === 'dark' ? 'light' : 'dark'; localStorage.setItem(KEY.THEME, state.theme); loadTheme(); toast(state.theme === 'dark' ? '🌙 Dark mode' : '☀️ Light mode'); }
function bindTheme() { $('#themeToggle').addEventListener('click', toggleTheme); }
function loadStorage() { try { state.history = JSON.parse(localStorage.getItem(KEY.HISTORY) || '[]'); state.saved = JSON.parse(localStorage.getItem(KEY.SAVED) || '[]'); } catch { } }
function saveHistory() { localStorage.setItem(KEY.HISTORY, JSON.stringify(state.history)); }
function saveSaved() { localStorage.setItem(KEY.SAVED, JSON.stringify(state.saved)); }

function bindNavigation() { $$('[data-goto]').forEach(el => el.addEventListener('click', () => navigate(el.dataset.goto))); }
function navigate(screenName) {
  if (!screenName) return;
  if (state.currentScreen === 'scan' && screenName !== 'scan') stopCamera();
  $$('.screen').forEach(s => s.classList.remove('active'));
  const target = $('#screen-' + screenName); if (target) target.classList.add('active');
  $$('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.goto === screenName));
  state.currentScreen = screenName;
  if (screenName === 'home') renderHome(); if (screenName === 'history') renderHistory(); if (screenName === 'discover') renderDiscover();
  if (screenName === 'scan') updateScanStatus('idle');
  $('.screens').scrollTo({ top: 0, behavior: 'smooth' });
}

function renderHome() {
  const recentEl = $('#homeRecent'); recentEl.innerHTML = '';
  if (state.history.length === 0) recentEl.innerHTML = `<div class="empty-state">No scans yet. Tap "Start Live Scan".</div>`;
  else state.history.slice(0, 6).forEach(item => recentEl.appendChild(makeMiniCard(item.key, item.text)));

  const catEl = $('#homeCategories'); catEl.innerHTML = '';
  CATEGORIES.slice(0, 4).forEach(c => catEl.appendChild(makeCategoryCard(c)));

  const savedEl = $('#homeSaved'); savedEl.innerHTML = '';
  if (state.saved.length === 0) savedEl.innerHTML = `<div class="empty-state">Nothing saved yet.</div>`;
  else state.saved.slice(0, 6).forEach(item => savedEl.appendChild(makeMiniCard(item.key)));
}

// FIX: Improved title for Cloud Scans
function makeMiniCard(key, text=null) {
  let displayName = key;
  let icon = '✨';
  let cat = 'Cloud Scan';
  
  if (text) {
    // Extract first line or first 25 chars of AI response
    displayName = text.split('\n')[0].replace(/[*#]/g, '').substring(0, 25) + '...';
  } else if (KNOWLEDGE[key]) {
    displayName = KNOWLEDGE[key].name;
    icon = KNOWLEDGE[key].icon;
    cat = KNOWLEDGE[key].category;
  }

  const el = document.createElement('div'); el.className = 'mini-card glass';
  el.innerHTML = `<div class="mc-icon">${icon}</div><div class="mc-name">${displayName}</div><div class="mc-sub">${cat}</div>`;
  el.addEventListener('click', () => {
    if(text) { showGeminiResult(text, false); } else { openObjectSheet(key); }
  }); return el;
}

function makeCategoryCard(cat) {
  const el = document.createElement('div'); el.className = 'cat-card glass'; el.dataset.cat = cat.id;
  el.innerHTML = `<div class="cc-icon">${cat.icon}</div><div class="cc-name">${cat.name}</div><div class="cc-count">${cat.keys.length} objects</div>`;
  el.addEventListener('click', () => { navigate('discover'); selectCategory(cat.id); }); return el;
}

function renderDiscover() {
  const grid = $('#discoverCategories'); grid.innerHTML = '';
  CATEGORIES.forEach(c => { const card = makeCategoryCard(c); if (state.activeCategory === c.id) card.classList.add('active'); grid.appendChild(card); });
  if (state.activeCategory) selectCategory(state.activeCategory, true);
}

function selectCategory(catId, silent) {
  state.activeCategory = catId;
  $$('#discoverCategories .cat-card').forEach(c => c.classList.toggle('active', c.dataset.cat === catId));
  const cat = CATEGORIES.find(c => c.id === catId); const list = $('#categoryObjects'); list.innerHTML = '';
  if (!cat || cat.keys.length === 0) { list.innerHTML = `<div class="empty-state">No objects here.</div>`; return; }
  cat.keys.forEach(k => {
    const info = KNOWLEDGE[k] || { icon: '📦', name: k, category: 'Object' };
    const row = document.createElement('div'); row.className = 'obj-row';
    row.innerHTML = `<div class="or-icon">${info.icon}</div><div><div class="or-name">${info.name}</div><div class="or-meta">${info.category}</div></div>`;
    row.addEventListener('click', () => openObjectSheet(k)); list.appendChild(row);
  });
}

/* ============================================================
   CAMERA & DETECTION
   ============================================================ */
function bindCameraControls() {
  $('#enableCameraBtn').addEventListener('click', () => startCamera());
  $('#stopCameraBtn').addEventListener('click', () => { stopCamera(); toast('Camera stopped'); });
  $('#flipCameraBtn').addEventListener('click', flipCamera);
  $('#toggleDetectBtn').addEventListener('click', toggleDetection);
  $('#zoomSlider').addEventListener('input', applyZoom);
  $('#flashBtn').addEventListener('click', toggleFlash);
  
  $('#captureBtn').addEventListener('click', () => {
    if (state.useCloudAI && state.geminiKey) { captureAndAnalyzeWithGemini(); } else { captureFrame(); }
  });
}

async function startCamera() {
  if (state.camera.running) return;
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { updateScanStatus('error', 'Camera API not available.'); return; }
  updateScanStatus('loading', 'Requesting camera permission…');
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: state.camera.facingMode }, width: { ideal: 640 }, height: { ideal: 480 } }, audio: false,
    });
    const video = $('#cameraFeed'); video.srcObject = stream;
    await video.play().catch(() => {});
    state.camera.stream = stream; state.camera.track = stream.getVideoTracks()[0]; state.camera.running = true;
    
    video.classList.toggle('user', state.camera.facingMode === 'user');
    
    checkCapabilities(); $('#cameraFeed').classList.add('on'); $('#scanPlaceholder').classList.add('hidden');
    updateScanStatus('live', 'Camera active. Loading local AI...');
    await loadAIModel(); startDetectionLoop();
  } catch (err) { updateScanStatus('error', 'Camera error.'); toast('⚠️ Camera failed'); }
}

function stopCamera() {
  stopDetectionLoop();
  if (state.camera.stream) { state.camera.stream.getTracks().forEach(t => t.stop()); state.camera.stream = null; state.camera.track = null; }
  state.camera.running = false;
  const video = $('#cameraFeed'); video.srcObject = null; video.classList.remove('on');
  $('#scanPlaceholder').classList.remove('hidden'); $('#bboxLayer').innerHTML = ''; $('#scanLine').classList.add('hidden');
  $('#zoomContainer').classList.add('hidden'); $('#flashBtn').classList.add('hidden'); $('#flashBtn').classList.remove('active');
  state.camera.torchOn = false; state.selected = []; updateSelectionBar(); updateScanStatus('idle');
}

async function flipCamera() {
  if (!state.camera.running) { toast('Enable camera first'); return; }
  state.camera.facingMode = state.camera.facingMode === 'environment' ? 'user' : 'environment';
  stopCamera(); await startCamera();
}

function checkCapabilities() {
  const track = state.camera.track; if (!track || !track.getCapabilities) return;
  try {
    const caps = track.getCapabilities();
    if (caps.zoom) {
      state.camera.zoomCapable = true; const slider = $('#zoomSlider');
      slider.min = caps.zoom.min || 1; slider.max = caps.zoom.max || 5; slider.step = caps.zoom.step || 0.1; slider.value = caps.zoom.min || 1;
      $('#zoomContainer').classList.remove('hidden'); $('#zoomValue').textContent = (caps.zoom.min || 1).toFixed(1) + 'x';
    } else { $('#zoomContainer').classList.add('hidden'); }
    if (caps.torch) { state.camera.torchCapable = true; $('#flashBtn').classList.remove('hidden'); } else { $('#flashBtn').classList.add('hidden'); }
  } catch (e) { }
}
async function applyZoom(e) { const val = parseFloat(e.target.value); $('#zoomValue').textContent = val.toFixed(1) + 'x'; if (state.camera.track) { try { await state.camera.track.applyConstraints({ advanced: [{ zoom: val }] }); } catch (err) {} } }
async function toggleFlash() { if (!state.camera.track || !state.camera.torchCapable) return; state.camera.torchOn = !state.camera.torchOn; try { await state.camera.track.applyConstraints({ advanced: [{ torch: state.camera.torchOn }] }); $('#flashBtn').classList.toggle('active', state.camera.torchOn); } catch (err) {} }

/* ============================================================
   LOCAL AI (COCO-SSD)
   ============================================================ */
async function loadAIModel() {
  if (state.ai.model) return;
  const badge = $('#aiBadge'); badge.className = 'demo-badge loading'; badge.textContent = 'LOCAL AI LOADING...';
  try {
    state.ai.model = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
    badge.className = 'demo-badge active'; badge.textContent = 'LOCAL AI ACTIVE';
    updateScanStatus('live', 'Local AI Active. Capture for Cloud AI.');
  } catch (err) { badge.className = 'demo-badge error'; badge.textContent = 'AI FAILED'; }
}

function startDetectionLoop() {
  if (state.ai.isDetecting || !state.ai.model) return;
  state.ai.isDetecting = true;
  const video = $('#cameraFeed');
  const detect = async () => {
    if (!state.camera.running || !state.ai.isDetecting) return;
    if (video.readyState === 4) {
      try { const predictions = await state.ai.model.detect(video); drawAIBoundingBoxes(predictions); } catch (e) {}
    }
    state.ai.loopId = setTimeout(detect, state.ai.detectionInterval);
  };
  detect();
}

function stopDetectionLoop() {
  state.ai.isDetecting = false;
  if (state.ai.loopId) { clearTimeout(state.ai.loopId); state.ai.loopId = null; }
  $('#bboxLayer').innerHTML = '';
}

function toggleDetection() {
  if (!state.camera.running) return;
  if (state.ai.isDetecting) { stopDetectionLoop(); $('#toggleDetectBtn').textContent = '▶'; }
  else { $('#toggleDetectBtn').textContent = '⏸'; startDetectionLoop(); }
}

function drawAIBoundingBoxes(predictions) {
  const layer = $('#bboxLayer'); const video = $('#cameraFeed'); const stage = $('#scanStage');
  layer.innerHTML = '';
  if (!predictions || predictions.length === 0) return;
  const videoW = video.videoWidth; const videoH = video.videoHeight;
  const stageW = stage.clientWidth; const stageH = stage.clientHeight;
  const scale = Math.max(stageW / videoW, stageH / videoH);
  const offsetX = (stageW - videoW * scale) / 2; const offsetY = (stageH - videoH * scale) / 2;
  
  predictions.forEach((pred, index) => {
    if (pred.score < 0.50) return;
    const [x, y, w, h] = pred.bbox; const className = pred.class; const conf = Math.round(pred.score * 100);
    let left = (x * scale + offsetX) / stageW * 100; let top = (y * scale + offsetY) / stageH * 100;
    let width = (w * scale) / stageW * 100; let height = (h * scale) / stageH * 100;
    
    if (state.camera.facingMode === 'user') left = 100 - left - width;

    const el = document.createElement('div');
    el.className = 'bbox';
    el.dataset.cls = className;
    if (state.selected.includes(className.toLowerCase())) el.classList.add('selected');
    el.style.left = `${left}%`; el.style.top = `${top}%`; el.style.width = `${width}%`; el.style.height = `${height}%`;
    const objData = { id: `obj-${index}`, class: className, score: pred.score, bbox: [x,y,w,h], conf };
    el.innerHTML = `<div class="bbox-label">${className}<small>${conf}%</small></div>`;
    el.addEventListener('click', (e) => {
      e.stopPropagation(); if (state.ai.isDetecting) { toggleDetection(); state.resumeDetectionAfterSheet = true; }
      openObjectSheet(className.toLowerCase(), objData);
    });
    layer.appendChild(el);
  });
}

/* ============================================================
   CLOUD AI (GEMINI VISION)
   ============================================================ */
async function captureAndAnalyzeWithGemini() {
  if (!state.camera.running) return toast('Camera not active');
  if (!state.geminiKey) return toast('⚠️ Add Gemini API key in Profile');

  if (state.ai.isDetecting) state.resumeDetectionAfterSheet = true;
  stopDetectionLoop(); 
  $('#scanLine').classList.remove('hidden'); 

  const video = $('#cameraFeed');
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
  state.lastImageBase64 = base64Image; 

  const flash = document.createElement('div');
  flash.style.cssText = 'position:absolute;inset:0;background:#fff;z-index:50;opacity:0.85;transition:opacity .35s;pointer-events:none;';
  $('#scanStage').appendChild(flash); requestAnimationFrame(() => { flash.style.opacity = '0'; }); setTimeout(() => flash.remove(), 400);

  await processImageWithGemini(base64Image);
}

function bindImageInput() {
  $('#homePickImage').addEventListener('click', () => $('#imageInput').click());
  $('#imageInput').addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!state.geminiKey) { toast('⚠️ Add Gemini API Key in Profile first'); e.target.value = ''; return; }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new Image();
      img.onerror = () => { toast('❌ Invalid image file'); closeSheet('objectSheet'); e.target.value = ''; };
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        let width = img.width; let height = img.height;
        const maxDim = 1024;
        if (width > maxDim || height > maxDim) {
          if (width > height) { height = Math.round(height * (maxDim / width)); width = maxDim; }
          else { width = Math.round(width * (maxDim / height)); height = maxDim; }
        }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        state.lastImageBase64 = base64Image;
        
        $('#objectSheetBody').innerHTML = `
          <div class="obj-header">
            <div class="oh-icon" style="background:var(--grad); color:white;">✨</div>
            <div><div class="obj-name">Analyzing Image...</div><div class="obj-cat">Gemini Cloud AI</div></div>
          </div>
          <p class="obj-desc">Please wait while AI reads the image and extracts text (OCR)...</p>
        `;
        openSheet('objectSheet');
        
        await processImageWithGemini(base64Image);
        e.target.value = '';
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

async function processImageWithGemini(base64Image) {
  updateScanStatus('loading', 'Sending image to Gemini AI (Vision + OCR)...');
  
  try {
    const response = await fetch(MODEL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': state.geminiKey },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "You are SaFiMu AI Vision. Analyze this image thoroughly. 1. Identify all main objects. 2. If there is a person, state gender and estimated age. 3. IMPORTANT: Extract all visible text, labels, numbers, or barcodes (OCR). Provide a detailed, beautifully formatted response." },
            { inlineData: { mimeType: "image/jpeg", data: base64Image } }
          ]
        }]
      })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't analyze this image. It might be blocked by safety filters.";
    showGeminiResult(resultText);

  } catch (err) {
    console.error(err);
    toast('❌ Cloud AI Error: ' + err.message);
    updateScanStatus('error', 'Cloud AI failed.');
    $('#scanLine').classList.add('hidden');
    closeSheet('objectSheet');
  }
}

function showGeminiResult(text, save = true) {
  updateScanStatus('live', 'Analysis Complete.');
  $('#scanLine').classList.add('hidden');
  
  $('#objectSheetBody').innerHTML = `
    <div class="obj-header">
      <div class="oh-icon" style="background:var(--grad); color:white; font-size:30px;">✨</div>
      <div>
        <div class="obj-name">AI Analysis & OCR</div>
        <div class="obj-cat">Gemini Cloud Engine</div>
      </div>
    </div>
    <p id="geminiResultText" class="obj-desc" style="white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: var(--text);"></p>
    <div class="obj-actions">
      <button class="btn btn-primary" data-act="chat" onclick="closeSheet('objectSheet'); openAssistantWithContext('this image');">🤖 Ask Follow-up</button>
      <button class="btn btn-ghost" data-act="close" onclick="closeSheet('objectSheet')">Done</button>
    </div>
  `;
  document.getElementById('geminiResultText').textContent = text;
  
  openSheet('objectSheet');
  if (save) addToHistory('Cloud AI Scan', text);
}

function captureFrame() {
  if (!state.camera.running) return;
  const boxes = document.querySelectorAll('.bbox');
  if (boxes.length > 0) {
    const cls = boxes[0].dataset.cls;
    addToHistory(cls.toLowerCase()); 
    toast(`📸 Captured: ${cls}`);
    
    // FIX: Silently save frame so chat can still use the image context!
    const video = $('#cameraFeed');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    state.lastImageBase64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
    
  } else { toast('📸 Capture empty (Local AI)'); }
}

function updateScanStatus(mode, text) {
  const el = $('#scanStatus'); if (!el) return;
  el.textContent = text ?? (mode === 'idle' ? 'Camera is off. Tap "Enable Camera" to start preview.' : '');
  el.style.color = mode === 'error' ? '#FF5A7A' : mode === 'live' ? '#00E5FF' : '#9BB0D4';
}

/* ============================================================
   REAL GEMINI AI ASSISTANT
   ============================================================ */
function bindAssistant() {
  $('#quickAssistant').addEventListener('click', () => openAssistantWithContext(state.lastObjectKey));
  $('#sendChatBtn').addEventListener('click', sendChat);
  $('#chatInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(); });
  addMessage('ai', 'Hi! I am your SaFiMu AI Assistant. I can answer anything. For smart image context, capture an image first!');
}

function openAssistantWithContext(key) {
  openSheet('assistantSheet'); setTimeout(() => $('#chatInput').focus(), 350);
}

async function sendChat() {
  const input = $('#chatInput'); const text = input.value.trim();
  if (!text) return; input.value = ''; addMessage('user', text);

  if (!state.geminiKey) {
    setTimeout(() => addMessage('ai', "I need a Gemini API Key to answer smartly. Please add it in the Profile tab!"), 500);
    return;
  }

  const thinkingId = 'msg-' + Date.now();
  addMessage('ai', 'Thinking...', thinkingId);
  
  try {
    const parts = [{ text: text }];
    let usedImage = false;

    if (state.lastImageBase64) {
      parts.push({ inlineData: { mimeType: "image/jpeg", data: state.lastImageBase64 } });
      parts[0].text = "Based on the image I just took, please answer this: " + text;
      usedImage = true;
    }

    const response = await fetch(MODEL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': state.geminiKey },
      body: JSON.stringify({ contents: [{ parts: parts }] })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    updateMessage(thinkingId, reply);
    
    if (usedImage) state.lastImageBase64 = null;

  } catch (err) {
    updateMessage(thinkingId, "Error: " + err.message);
  }
}

function addMessage(role, text, id = null) {
  const log = $('#chatLog'); const div = document.createElement('div');
  div.className = 'msg ' + role; if(id) div.id = id;
  div.textContent = text;
  log.appendChild(div); log.scrollTop = log.scrollHeight;
}

function updateMessage(id, text) {
  const el = document.getElementById(id);
  if (el) { el.textContent = text; $('#chatLog').scrollTop = $('#chatLog').scrollHeight; }
}

/* ============================================================
   UI & SHEETS
   ============================================================ */
function openObjectSheet(key, aiData = null) {
  const safeKey = String(key).toLowerCase().replace(/[<>&]/g, ''); // Basic Sanitization
  let info = KNOWLEDGE[safeKey];
  let isKnown = true;
  if (!info) {
    isKnown = false;
    info = { icon: '📦', name: safeKey, category: 'Detected Object', description: `AI identified this as "${safeKey}".`, function: 'Unknown.', specs: { 'Source': 'Local AI', 'Status': 'Generic' }, applications: ['Varies'], related: [] };
  }
  state.lastObjectKey = safeKey;
  const conf = aiData ? aiData.conf : 90;
  const specsHtml = Object.entries(info.specs).map(([k, v]) => `<li><b>${k}</b><span>${v}</span></li>`).join('');
  const isSelected = state.selected.includes(safeKey);

  $('#objectSheetBody').innerHTML = `
    <div class="obj-header">
      <div class="oh-icon">${info.icon}</div>
      <div><div class="obj-name">${info.name}</div><div class="obj-cat">${info.category} • Confidence ${conf}%</div></div>
    </div>
    <div class="conf-bar"><span style="width:${conf}%"></span></div>
    <p class="obj-desc"><b>Function:</b> ${info.function}</p>
    <p class="obj-desc">${info.description}</p>
    <div class="obj-specs"><h4>Specs</h4><ul>${specsHtml}</ul></div>
    <div class="obj-actions">
      <button class="btn btn-primary" data-act="ask">🤖 Ask AI</button>
      <button class="btn btn-ghost" data-act="save">${state.saved.some(s => s.key === safeKey) ? '✅ Saved' : '⭐ Save'}</button>
      <button class="btn btn-ghost" data-act="select" style="${isSelected ? 'border-color:var(--cyan); color:var(--cyan);' : ''}">${isSelected ? '✕ Remove Compare' : '➕ Compare'}</button>
      <button class="btn btn-ghost" data-act="close" onclick="closeSheet('objectSheet')">Close</button>
    </div>
  `;
  $('#objectSheetBody').querySelectorAll('[data-act]').forEach(btn => btn.addEventListener('click', () => handleObjectAction(btn.dataset.act, safeKey)));
  openSheet('objectSheet');
}

function handleObjectAction(action, key) {
  if (action === 'ask') { closeSheet('objectSheet'); openAssistantWithContext(key); }
  if (action === 'save') {
    const exists = state.saved.find(s => s.key === key);
    if (exists) { state.saved = state.saved.filter(s => s.key !== key); toast('Removed from saved'); }
    else { state.saved.unshift({ key, timestamp: Date.now() }); toast('⭐ Saved!'); }
    saveSaved(); renderSaved(); updateCounts(); openObjectSheet(key); 
  }
  if (action === 'select') {
    if (state.selected.includes(key)) state.selected = state.selected.filter(k => k !== key);
    else { if (state.selected.length >= 3) return toast('Max 3 objects'); state.selected.push(key); }
    updateSelectionBar(); openObjectSheet(key); 
  }
}

function bindSelectionBar() {
  $('#clearSelectionBtn').addEventListener('click', () => { state.selected = []; updateSelectionBar(); });
  $('#compareBtn').addEventListener('click', () => { if (state.selected.length < 2) toast('Select at least 2 objects'); else openCompareSheet(); });
}
function updateSelectionBar() {
  const bar = $('#selectionBar'); const count = state.selected.length;
  if (count === 0) bar.classList.add('hidden');
  else { bar.classList.remove('hidden'); $('#selectionCount').textContent = `${count} selected`; }
}
function openCompareSheet() {
  const items = state.selected.map(k => KNOWLEDGE[k] || { icon: '📦', name: k, category: 'Unknown', specs: {}, function: 'Unknown' });
  const allSpecKeys = new Set(); items.forEach(it => Object.keys(it.specs).forEach(k => allSpecKeys.add(k)));
  let tableHtml = `<div style="overflow-x:auto;"><table style="width:100%;border-collapse:collapse;font-size:12px;"><thead><tr style="background:var(--surface-2);"><th style="padding:12px;border-radius:8px 0 0 0;">Feature</th>${items.map(it => `<th style="padding:12px;color:var(--cyan);">${it.icon} ${it.name}</th>`).join('')}</tr></thead><tbody><tr style="border-bottom:1px solid var(--border);"><td style="padding:10px;font-weight:bold;">Category</td>${items.map(it => `<td style="padding:10px;color:var(--text-dim);">${it.category}</td>`).join('')}</tr>${Array.from(allSpecKeys).map(specKey => `<tr style="border-bottom:1px solid var(--border);"><td style="padding:10px;font-weight:bold;">${specKey}</td>${items.map(it => `<td style="padding:10px;color:var(--text-dim);">${it.specs[specKey] || '—'}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  $('#compareBody').innerHTML = tableHtml; openSheet('compareSheet');
}

/* ============================================================
   PROFILE, SETTINGS & MISC
   ============================================================ */
function bindProfile() {
  $('#saveKeyBtn').addEventListener('click', () => {
    const val = $('#geminiKeyInput').value.trim();
    if (val.length > 10) {
      localStorage.setItem(KEY.API_KEY, val); state.geminiKey = val; state.useCloudAI = true;
      $('#localAiSwitch').checked = false; toast('✅ Gemini AI Key Saved!');
    } else { toast('⚠️ Invalid Key'); }
  });

  $('#localAiSwitch').addEventListener('change', (e) => {
    state.useCloudAI = !e.target.checked;
    if (state.useCloudAI && !state.geminiKey) { toast('⚠️ Enter Key first'); e.target.checked = true; state.useCloudAI = false; }
    else { toast(state.useCloudAI ? '☁️ Cloud AI Active on Capture' : '📱 Local AI Active'); }
  });

  $('#clearHistoryBtn').addEventListener('click', () => {
    if (confirm('Clear all scan history?')) { state.history = []; saveHistory(); renderHistory(); renderHome(); updateCounts(); toast('🗑️ History cleared'); }
  });
}

function addToHistory(key, text = null) {
  state.history.unshift({ key, text, timestamp: Date.now() }); state.history = state.history.slice(0, 100);
  saveHistory(); renderHistory(); renderHome(); updateCounts();
}
function renderHistory() {
  const list = $('#historyList'); list.innerHTML = '';
  if (state.history.length === 0) { list.innerHTML = `<div class="empty-state">No scans yet.</div>`; return; }
  state.history.forEach(item => {
    const info = KNOWLEDGE[item.key] || { icon: '✨', name: item.key, category: 'Cloud AI' };
    const row = document.createElement('div'); row.className = 'obj-row';
    row.innerHTML = `<div class="or-icon">${info.icon}</div><div><div class="or-name">${info.name}</div><div class="or-meta">${new Date(item.timestamp).toLocaleString()}</div></div>`;
    row.addEventListener('click', () => { 
      if(item.text) { showGeminiResult(item.text, false); } 
      else if(!KNOWLEDGE[item.key]) { toast('No data available'); } 
      else { openObjectSheet(item.key); }
    }); list.appendChild(row);
  });
}
function renderSaved() { const list = $('#homeSaved'); if (!list) return; list.innerHTML = ''; if (state.saved.length === 0) list.innerHTML = `<div class="empty-state">Nothing saved yet.</div>`; else state.saved.forEach(item => list.appendChild(makeMiniCard(item.key))); updateCounts(); }
function updateCounts() { const sc = $('#scanCount'); const sv = $('#savedCount'); if (sc) sc.textContent = state.history.length; if (sv) sv.textContent = state.saved.length; }

function bindSheets() { 
  $('#sheetBackdrop').addEventListener('click', () => {
    closeAllSheets(); 
    if (state.resumeDetectionAfterSheet) {
      state.resumeDetectionAfterSheet = false; if (!state.ai.isDetecting && state.camera.running) toggleDetection();
    }
  }); 
  $$('[data-close-sheet]').forEach(btn => btn.addEventListener('click', () => closeSheet(btn.dataset.closeSheet))); 
}
function openSheet(id) { closeAllSheets(true); const sheet = document.getElementById(id); if (!sheet) return; $('#sheetBackdrop').classList.add('show'); sheet.classList.add('show'); }
function closeSheet(id) { 
  const sheet = document.getElementById(id); if (sheet) sheet.classList.remove('show'); 
  if (!$('.sheet.show')) $('#sheetBackdrop').classList.remove('show'); 
  if (id === 'objectSheet' && state.resumeDetectionAfterSheet) { 
    state.resumeDetectionAfterSheet = false; if (!state.ai.isDetecting && state.camera.running) toggleDetection(); 
  } 
}
function closeAllSheets(keepBackdrop) { $$('.sheet').forEach(s => s.classList.remove('show')); if (!keepBackdrop) { $('#sheetBackdrop').classList.remove('show'); } }

let toastTimer = null;
function toast(msg) { const el = $('#toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2400); }
document.addEventListener('visibilitychange', () => { if (document.hidden && state.camera.running) stopCamera(); });
