<!-- ════════════════════════════════════════════
     JAVASCRIPT
     ════════════════════════════════════════════ -->
<script>
/* ────────────────────────────────────────────────────────────
   CONSTANTS
   ──────────────────────────────────────────────────────────── */
const VOWELS      = new Set(['A','E','I','O','U']);
const VOWEL_COST  = 500;

/* ────────────────────────────────────────────────────────────
   FALLBACK DATA (usato se phrases.json non è trovato)
   ──────────────────────────────────────────────────────────── */
const FALLBACK_BOARDS = [
  { id:1, topic:"CINEMA ITALIANO",  phrase:"NUOVO CINEMA PARADISO",
    wheel:[
      {label:"200",value:200,type:"score",color:"#C0392B"},{label:"300",value:300,type:"score",color:"#D35400"},
      {label:"500",value:500,type:"score",color:"#B7950B"},{label:"PASSA\nMANO",value:0,type:"passamano",color:"#2471A3"},
      {label:"400",value:400,type:"score",color:"#1E8449"},{label:"600",value:600,type:"score",color:"#117A65"},
      {label:"PERDE\nTUTTO",value:0,type:"perdetutto",color:"#1C2833"},{label:"250",value:250,type:"score",color:"#7D3C98"},
      {label:"350",value:350,type:"score",color:"#5D6D7E"},{label:"RADDOPPIA",value:0,type:"raddoppia",color:"#B7950B"},
      {label:"450",value:450,type:"score",color:"#922B21"},{label:"700",value:700,type:"score",color:"#1A5276"}
    ]
  },
  { id:2, topic:"GASTRONOMIA", phrase:"PIZZA E SPAGHETTI",
    wheel:[
      {label:"150",value:150,type:"score",color:"#A93226"},{label:"400",value:400,type:"score",color:"#BA4A00"},
      {label:"PASSA\nMANO",value:0,type:"passamano",color:"#1F618D"},{label:"300",value:300,type:"score",color:"#1E8449"},
      {label:"600",value:600,type:"score",color:"#0E6655"},{label:"200",value:200,type:"score",color:"#6C3483"},
      {label:"800",value:800,type:"score",color:"#154360"},{label:"PERDE\nTUTTO",value:0,type:"perdetutto",color:"#1C2833"},
      {label:"350",value:350,type:"score",color:"#9A7D0A"},{label:"500",value:500,type:"score",color:"#616A6B"},
      {label:"RADDOPPIA",value:0,type:"raddoppia",color:"#B7950B"},{label:"250",value:250,type:"score",color:"#1A6DA3"}
    ]
  },
  { id:3, topic:"ARTE E CULTURA", phrase:"LA GIOCONDA DI LEONARDO",
    wheel:[
      {label:"300",value:300,type:"score",color:"#C0392B"},{label:"PASSA\nMANO",value:0,type:"passamano",color:"#2471A3"},
      {label:"450",value:450,type:"score",color:"#CA6F1E"},{label:"200",value:200,type:"score",color:"#B7950B"},
      {label:"RADDOPPIA",value:0,type:"raddoppia",color:"#B7950B"},{label:"600",value:600,type:"score",color:"#1E8449"},
      {label:"350",value:350,type:"score",color:"#117A65"},{label:"PERDE\nTUTTO",value:0,type:"perdetutto",color:"#1C2833"},
      {label:"500",value:500,type:"score",color:"#2471A3"},{label:"250",value:250,type:"score",color:"#7D3C98"},
      {label:"700",value:700,type:"score",color:"#424949"},{label:"400",value:400,type:"score",color:"#922B21"}
    ]
  },
  { id:4, topic:"MUSICA ITALIANA", phrase:"LUCIO BATTISTI E MOGOL",
    wheel:[
      {label:"400",value:400,type:"score",color:"#922B21"},{label:"250",value:250,type:"score",color:"#CA6F1E"},
      {label:"RADDOPPIA",value:0,type:"raddoppia",color:"#B7950B"},{label:"550",value:550,type:"score",color:"#1E8449"},
      {label:"PASSA\nMANO",value:0,type:"passamano",color:"#1F618D"},{label:"300",value:300,type:"score",color:"#6C3483"},
      {label:"700",value:700,type:"score",color:"#2C3E50"},{label:"450",value:450,type:"score",color:"#0E6655"},
      {label:"PERDE\nTUTTO",value:0,type:"perdetutto",color:"#1C2833"},{label:"200",value:200,type:"score",color:"#A04000"},
      {label:"600",value:600,type:"score",color:"#1A5276"},{label:"350",value:350,type:"score",color:"#7D6608"}
    ]
  },
  { id:5, topic:"SPORT ITALIANO", phrase:"CAMPIONI DEL MONDO",
    wheel:[
      {label:"500",value:500,type:"score",color:"#C0392B"},{label:"300",value:300,type:"score",color:"#A04000"},
      {label:"PASSA\nMANO",value:0,type:"passamano",color:"#1F618D"},{label:"800",value:800,type:"score",color:"#1E8449"},
      {label:"250",value:250,type:"score",color:"#B7950B"},{label:"PERDE\nTUTTO",value:0,type:"perdetutto",color:"#1C2833"},
      {label:"600",value:600,type:"score",color:"#0E6655"},{label:"400",value:400,type:"score",color:"#6C3483"},
      {label:"RADDOPPIA",value:0,type:"raddoppia",color:"#B7950B"},{label:"350",value:350,type:"score",color:"#1A5276"},
      {label:"700",value:700,type:"score",color:"#922B21"},{label:"1000",value:1000,type:"score",color:"#7D6608"}
    ]
  }
];

/* ────────────────────────────────────────────────────────────
   GAME STATE
   ──────────────────────────────────────────────────────────── */
const G = {
  boards:         [],
  players:        [],   // [{name, roundScore, totalScore}]
  curPlayer:      0,
  curBoard:       0,
  grid:           [],   // 4×12 [{type, char, revealed}]
  usedLetters:    new Set(),
  spinResult:     null,
  wheelAngle:     0,
  spinning:       false,
  phase:          'spin',  // 'spin' | 'guess' | 'raddoppia'
  evCallback:     null,
};

/* ────────────────────────────────────────────────────────────
   SCREEN SWITCH
   ──────────────────────────────────────────────────────────── */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/* ────────────────────────────────────────────────────────────
   LOAD BOARDS
   ──────────────────────────────────────────────────────────── */
async function loadBoards() {
  try {
    const r = await fetch('phrases.json');
    if (!r.ok) throw new Error('no json');
    const d = await r.json();
    G.boards = d.boards;
  } catch {
    G.boards = FALLBACK_BOARDS;
  }
}

/* ────────────────────────────────────────────────────────────
   NAVIGATION
   ──────────────────────────────────────────────────────────── */
function goPlayers() { showScreen('screen-players'); }

function getPlayerCount() {
  return Number(document.getElementById('player-count').value);
}

function updatePlayerInputs() {
  const count = getPlayerCount();
  for (let i = 1; i <= 4; i++) {
    const row = document.getElementById(`player-row-${i}`);
    const input = document.getElementById(`p${i}`);
    const visible = i <= count;
    row.style.display = visible ? 'flex' : 'none';
    if (!visible) input.value = '';
  }
}

function startGame() {
  const count = getPlayerCount();
  const rawNames = Array.from({length:count}, (_,i) =>
    document.getElementById(`p${i+1}`).value.trim() || `Giocatore ${i+1}`
  );
  G.players = rawNames.map(name => ({name, roundScore:0, totalScore:0}));
  G.curBoard = 0; G.curPlayer = 0;
  showTransition();
}

function showTransition() {
  const b = G.boards[G.curBoard];
  document.getElementById('tr-manche').textContent = `TABELLONE ${G.curBoard+1} DI ${G.boards.length}`;
  document.getElementById('tr-topic').textContent  = b.topic;
  document.getElementById('tr-player').textContent = G.players[G.curPlayer].name;
  showScreen('screen-transition');
}

/* ────────────────────────────────────────────────────────────
   LAUNCH BOARD
   ──────────────────────────────────────────────────────────── */
function launchBoard() {
  G.players.forEach(p => p.roundScore = 0);
  G.usedLetters = new Set();
  G.spinResult  = null;
  G.phase       = 'spin';

  const b = G.boards[G.curBoard];
  G.grid = buildGrid(b.phrase);

  document.getElementById('g-topic').textContent = b.topic;
  updateDots();
  renderGrid();
  renderKeyboard();
  renderVowels();
  renderScores();
  resetResultUI();
  drawWheel(G.wheelAngle);

  showScreen('screen-game');
}

/* ────────────────────────────────────────────────────────────
   GRID BUILDER  (12 cols × 4 rows)
   ──────────────────────────────────────────────────────────── */
function buildGrid(phrase) {
  const words = phrase.toUpperCase().split(' ');
  const COLS = 12, ROWS = 4;
  // Pack words into rows
  const rows = [];
  let cur = [], curLen = 0;
  for (const w of words) {
    const need = curLen === 0 ? w.length : w.length + 1;
    if (curLen + need <= COLS) { cur.push(w); curLen += need; }
    else { if (cur.length) rows.push(cur); cur=[w]; curLen=w.length; }
  }
  if (cur.length) rows.push(cur);

  // Build cell matrix (center each row)
  const grid = [];
  for (let r = 0; r < ROWS; r++) {
    const rowWords = rows[r] || [];
    const rowStr   = rowWords.join(' ');
    const startCol = Math.floor((COLS - rowStr.length) / 2);
    const cells    = [];
    for (let c = 0; c < COLS; c++) {
      const idx = c - startCol;
      if (!rowStr.length || idx < 0 || idx >= rowStr.length)
        cells.push({type:'empty',  char:null, revealed:false});
      else if (rowStr[idx] === ' ')
        cells.push({type:'space',  char:null, revealed:false});
      else
        cells.push({type:'letter', char:rowStr[idx], revealed:false});
    }
    grid.push(cells);
  }
  return grid;
}

/* ────────────────────────────────────────────────────────────
   RENDER GRID
   ──────────────────────────────────────────────────────────── */
function renderGrid() {
  const el = document.getElementById('board-grid');
  el.innerHTML = '';
  G.grid.forEach(row => row.forEach(cell => {
    const d = document.createElement('div');
    d.className = `cell cell-${cell.type}`;
    if (cell.type === 'letter' && cell.revealed) {
      d.classList.add('revealed');
      d.textContent = cell.char;
    }
    el.appendChild(d);
  }));
}

/* ────────────────────────────────────────────────────────────
   REVEAL HELPERS
   ──────────────────────────────────────────────────────────── */
function revealLetter(letter) {
  let count = 0;
  G.grid.forEach(row => row.forEach(cell => {
    if (cell.type === 'letter' && cell.char === letter && !cell.revealed) {
      cell.revealed = true; count++;
    }
  }));
  return count;
}
function revealAll() {
  G.grid.forEach(row => row.forEach(cell => { if (cell.type==='letter') cell.revealed=true; }));
}
function allRevealed() {
  return G.grid.every(row => row.every(cell => cell.type!=='letter' || cell.revealed));
}

/* ────────────────────────────────────────────────────────────
   KEYBOARD  (consonants only — vowels are in the left panel)
   ──────────────────────────────────────────────────────────── */
function renderKeyboard() {
  const el = document.getElementById('keyboard');
  el.innerHTML = '';
  // Two rows of consonants only (no A E I O U)
  ['BCDFGHJKLMN', 'PQRSTVWXYZ'].forEach(row => {
    const rd = document.createElement('div'); rd.className='kb-row';
    row.split('').forEach(l => {
      const b = document.createElement('button');
      b.className='kb-key'; b.id='kb-'+l; b.textContent=l;
      b.onclick = () => handleLetter(l);
      if (G.usedLetters.has(l)) {
        b.disabled=true;
        const wasFound = G.grid.some(r=>r.some(c=>c.type==='letter'&&c.char===l&&c.revealed));
        b.classList.add(wasFound?'found':'miss');
      }
      rd.appendChild(b);
    });
    el.appendChild(rd);
  });
  syncKeyboard();
}

function syncKeyboard() {
  const canType = G.phase==='guess' || G.phase==='raddoppia';
  document.querySelectorAll('.kb-key').forEach(b => {
    if (!G.usedLetters.has(b.textContent)) b.disabled = !canType;
  });
  const spinBtn = document.getElementById('btn-spin');
  if (spinBtn) spinBtn.disabled = G.phase!=='spin' || G.spinning;
  syncVowels();
}

/* ────────────────────────────────────────────────────────────
   VOWELS PANEL  (left panel, cost 500 pt)
   ──────────────────────────────────────────────────────────── */
function renderVowels() {
  const el = document.getElementById('vowel-row');
  el.innerHTML='';
  ['A','E','I','O','U'].forEach(v => {
    const b = document.createElement('button');
    b.className='vow-key'; b.id='vow-'+v; b.textContent=v;
    b.onclick = () => handleVowel(v);
    if (G.usedLetters.has(v)) {
      b.disabled=true;
      const wasFound = G.grid.some(r=>r.some(c=>c.type==='letter'&&c.char===v&&c.revealed));
      b.classList.add(wasFound?'found':'miss');
    }
    el.appendChild(b);
  });
  syncVowels();
}

function syncVowels() {
  const canBuy = (G.phase==='spin'||G.phase==='guess'||G.phase==='raddoppia');
  document.querySelectorAll('.vow-key').forEach(b => {
    if (!G.usedLetters.has(b.textContent)) b.disabled = !canBuy;
  });
}

function handleVowel(letter) {
  if (G.usedLetters.has(letter)) return;
  if (G.phase!=='spin' && G.phase!=='guess' && G.phase!=='raddoppia') return;

  const p = G.players[G.curPlayer];
  if (p.roundScore < VOWEL_COST) {
    toast(`Punti insufficienti! Servono 500 pt per acquistare una vocale.`);
    return;
  }

  p.roundScore -= VOWEL_COST;
  G.usedLetters.add(letter);

  const btn = document.getElementById('vow-'+letter);
  if (btn) btn.disabled=true;

  const count = revealLetter(letter);
  renderGrid(); renderScores();

  if (count > 0) {
    if (btn) btn.classList.add('found');
    toast(`Vocale "${letter}": ${count} trovata/e  (−500 pt) 🎉`);
    if (allRevealed()) { setTimeout(()=>boardSolved(G.curPlayer), 700); return; }
    // Buying a vowel ends the action; back to spin
    G.phase='spin'; G.spinResult=null;
    document.getElementById('result-val').textContent='—';
  } else {
    if (btn) btn.classList.add('miss');
    toast(`"${letter}" non presente  (−500 pt). Turno al prossimo...`);
    setTimeout(nextPlayer, 1400);
    return;
  }
  syncKeyboard();
}

/* ────────────────────────────────────────────────────────────
   HANDLE LETTER CLICK
   ──────────────────────────────────────────────────────────── */
function handleLetter(letter) {
  if (G.usedLetters.has(letter)) return;
  if (G.phase!=='guess' && G.phase!=='raddoppia') return;

  G.usedLetters.add(letter);
  const btn = document.getElementById('kb-'+letter);
  btn.disabled = true;

  const count = revealLetter(letter);
  renderGrid();

  if (count > 0) {
    btn.classList.add('found');
    if (G.phase === 'raddoppia') {
      G.players[G.curPlayer].roundScore *= 2;
      toast(`${count} lettera/e trovata/e — PUNTEGGIO RADDOPPIATO! 🎉`);
    } else {
      const pts = count * G.spinResult.value;
      G.players[G.curPlayer].roundScore += pts;
      toast(`${count} × ${G.spinResult.value} = +${pts} punti!`);
    }
    renderScores();
    if (allRevealed()) { setTimeout(()=>boardSolved(G.curPlayer), 700); return; }
    // Player can spin again
    G.phase='spin'; G.spinResult=null;
    document.getElementById('result-val').textContent='—';
  } else {
    btn.classList.add('miss');
    toast('Lettera non presente! Turno al prossimo...');
    setTimeout(nextPlayer, 1300);
    return;
  }
  syncKeyboard();
}

/* ────────────────────────────────────────────────────────────
   WHEEL — DRAW
   ──────────────────────────────────────────────────────────── */
function drawWheel(angleDeg) {
  const canvas = document.getElementById('wheel-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W=248, H=248, cx=124, cy=124, R=112;
  const segs = G.boards[G.curBoard] ? G.boards[G.curBoard].wheel : FALLBACK_BOARDS[0].wheel;
  const n = segs.length;
  const aps = (2*Math.PI)/n; // angle per segment

  ctx.clearRect(0,0,W,H);

  // Outer glow ring
  const og = ctx.createRadialGradient(cx,cy,R-2,cx,cy,R+8);
  og.addColorStop(0,'rgba(255,215,0,0.35)');
  og.addColorStop(1,'transparent');
  ctx.beginPath(); ctx.arc(cx,cy,R+6,0,2*Math.PI);
  ctx.fillStyle=og; ctx.fill();

  ctx.save();
  ctx.translate(cx,cy);
  ctx.rotate(angleDeg*Math.PI/180);

  segs.forEach((seg,i) => {
    const sa = i*aps - Math.PI/2;
    const ea = sa + aps;

    // Sector fill
    ctx.beginPath(); ctx.moveTo(0,0);
    ctx.arc(0,0,R,sa,ea); ctx.closePath();
    ctx.fillStyle = seg.color; ctx.fill();

    // Sector border
    ctx.strokeStyle='rgba(255,255,255,0.25)'; ctx.lineWidth=1.5; ctx.stroke();

    // Label
    ctx.save();
    ctx.rotate(sa + aps/2);
    ctx.textAlign='center';
    ctx.fillStyle='#fff';
    ctx.shadowColor='rgba(0,0,0,0.6)'; ctx.shadowBlur=4;

    const lines = seg.label.split('\n');
    const dist  = R*0.64;
    if (lines.length===1) {
      const fs = seg.type==='score' ? (seg.value>=1000?11:13) : (seg.label.length>8?10:12);
      ctx.font = `bold ${fs}px Oswald,sans-serif`;
      ctx.fillText(seg.label, dist, 5);
    } else {
      ctx.font = 'bold 10px Oswald,sans-serif';
      ctx.fillText(lines[0], dist, -4);
      ctx.fillText(lines[1], dist,  9);
    }
    ctx.restore();
  });

  // Center cap
  const cg = ctx.createRadialGradient(0,0,1,0,0,20);
  cg.addColorStop(0,'#FFE55C'); cg.addColorStop(1,'#8B6000');
  ctx.beginPath(); ctx.arc(0,0,20,0,2*Math.PI);
  ctx.fillStyle=cg; ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.6)'; ctx.lineWidth=2; ctx.stroke();
  ctx.restore();

  // Pointer triangle at top
  ctx.save();
  ctx.translate(cx, cy-R+2);
  ctx.beginPath(); ctx.moveTo(0,-4); ctx.lineTo(-9,-18); ctx.lineTo(9,-18); ctx.closePath();
  ctx.fillStyle='#FFD700'; ctx.fill();
  ctx.strokeStyle='#fff'; ctx.lineWidth=1.5; ctx.stroke();
  ctx.restore();
}

/* ────────────────────────────────────────────────────────────
   WHEEL — SPIN
   ──────────────────────────────────────────────────────────── */
function spinWheel() {
  if (G.spinning || G.phase!=='spin') return;
  G.spinning=true;
  document.getElementById('btn-spin').disabled=true;
  document.getElementById('result-val').textContent='...';

  const segs = G.boards[G.curBoard].wheel;
  const n = segs.length;
  const segDeg = 360/n;

  // Pick random target segment
  const tIdx = Math.floor(Math.random()*n);
  const within = Math.random()*segDeg*0.6 + segDeg*0.2;

  // Angle where tIdx lands at pointer after rotation R:
  // segment at pointer: floor(((360 - R%360)%360)/segDeg) = tIdx
  // => R%360 = (360 - tIdx*segDeg - within + 3600) % 360
  const curMod    = G.wheelAngle % 360;
  const wantMod   = (360 - tIdx*segDeg - within + 3600) % 360;
  let   extraDeg  = (wantMod - curMod + 360) % 360;
  if   (extraDeg < 15) extraDeg += 360;

  const spins    = 6 + Math.floor(Math.random()*4);
  const totalRot = spins*360 + extraDeg;
  const absStart = G.wheelAngle;
  const absEnd   = absStart + totalRot;
  const dur      = 4200;
  const t0       = performance.now();

  function tick(now) {
    const p = Math.min((now-t0)/dur, 1);
    const e = 1 - Math.pow(1-p, 3.5);
    G.wheelAngle = absStart + totalRot*e;
    drawWheel(G.wheelAngle);
    if (p<1) { requestAnimationFrame(tick); }
    else {
      G.wheelAngle = absEnd % 360;
      drawWheel(G.wheelAngle);
      G.spinning = false;
      onSpinDone(tIdx);
    }
  }
  requestAnimationFrame(tick);
}

function onSpinDone(idx) {
  const seg = G.boards[G.curBoard].wheel[idx];
  G.spinResult = seg;
  const lbl = seg.label.replace('\n',' ');
  document.getElementById('result-val').textContent =
    seg.type==='score' ? `${seg.value} PT` : lbl;

  if (seg.type==='score') {
    G.phase='guess'; syncKeyboard();
    toast(`${seg.value} punti! Chiama una lettera.`);
  } else if (seg.type==='passamano') {
    showEvent('🔄','PASSAMANO!','Il turno passa al prossimo concorrente.', ()=>nextPlayer());
  } else if (seg.type==='perdetutto') {
    const name = G.players[G.curPlayer].name;
    showEvent('💀','PERDE TUTTO!',`${name} perde tutti i punti accumulati!`, ()=>{
      G.players[G.curPlayer].roundScore = 0;
      G.players[G.curPlayer].totalScore = 0;
      renderScores(); nextPlayer();
    });
  } else if (seg.type==='raddoppia') {
    G.phase='raddoppia';
    showEvent('✖️2','RADDOPPIA!',
      'Chiama una lettera: se è presente, il tuo punteggio di manche si raddoppia!',
      ()=>{ syncKeyboard(); }
    );
  }
}

/* ────────────────────────────────────────────────────────────
   NEXT PLAYER
   ──────────────────────────────────────────────────────────── */
function nextPlayer() {
  G.curPlayer = (G.curPlayer+1) % G.players.length;
  G.phase='spin'; G.spinResult=null;
  document.getElementById('result-val').textContent='—';
  renderScores(); syncKeyboard();
}

/* ────────────────────────────────────────────────────────────
   SOLVE
   ──────────────────────────────────────────────────────────── */
function promptSolve() {
  const name = G.players[G.curPlayer].name;
  document.getElementById('solve-sub').textContent = `${name} ha dato la soluzione. È corretta?`;
  document.getElementById('modal-solve').classList.add('on');
}
function resolveSolve(ok) {
  document.getElementById('modal-solve').classList.remove('on');
  if (ok) {
    revealAll(); renderGrid(); spawnConfetti();
    setTimeout(()=>boardSolved(G.curPlayer), 600);
  } else {
    toast('Soluzione errata! Turno al prossimo...');
    setTimeout(nextPlayer, 1300);
  }
}

/* ────────────────────────────────────────────────────────────
   BOARD SOLVED
   ──────────────────────────────────────────────────────────── */
function boardSolved(winIdx) {
  revealAll(); renderGrid(); spawnConfetti();
  const w = G.players[winIdx];
  w.totalScore += w.roundScore;
  renderScores();
  showWin('🏆',
    `${w.name} VINCE LA MANCHE!`,
    `Manche: ${fmt(w.roundScore)} pt  ·  Totale: ${fmt(w.totalScore)} pt`,
    ()=>{
      G.curBoard++;
      if (G.curBoard >= G.boards.length) { setTimeout(showPodium,300); }
      else {
        G.curPlayer = (winIdx+1) % G.players.length;
        showTransition();
      }
    }
  );
}

/* ────────────────────────────────────────────────────────────
   SCORES RENDER
   ──────────────────────────────────────────────────────────── */
function renderScores() {
  const el = document.getElementById('score-cards');
  el.innerHTML='';
  document.getElementById('turn-name').textContent = G.players[G.curPlayer].name;
  G.players.forEach((p,i) => {
    const d = document.createElement('div');
    d.className='sc-card'+(i===G.curPlayer?' active':'');
    d.innerHTML=`
      <div class="sc-name">${p.name}</div>
      <div class="sc-round-lbl">MANCHE</div>
      <div class="sc-round-val">${fmt(p.roundScore)}</div>
      <hr class="sc-divider">
      <div class="sc-total-row">
        <span class="sc-total-lbl">TOTALE</span>
        <span class="sc-total-val">${fmt(p.totalScore)}</span>
      </div>`;
    el.appendChild(d);
  });
}

/* ────────────────────────────────────────────────────────────
   DOTS
   ──────────────────────────────────────────────────────────── */
function updateDots() {
  document.querySelectorAll('.g-dot').forEach((d,i)=>{
    d.className='g-dot';
    if (i<G.curBoard)  d.classList.add('done');
    if (i===G.curBoard) d.classList.add('now');
  });
}

/* ────────────────────────────────────────────────────────────
   PODIUM
   ──────────────────────────────────────────────────────────── */
function showPodium() {
  const sorted = [...G.players].sort((a,b)=>b.totalScore-a.totalScore);
  const stage  = document.getElementById('podium-stage');
  stage.innerHTML='';
  const medals=['🥈','🥇','🥉'];
  const order  = sorted.length>=3 ? [1,0,2] : sorted.length===2 ? [1,0] : [0];
  const pclass = [2,1,3];

  order.forEach((si,di)=>{
    const p   = sorted[si];
    const pc  = pclass[di];
    const div = document.createElement('div');
    div.className=`p-place p-place-${pc} anim-up`;
    div.style.animationDelay=`${di*0.18}s`;
    div.innerHTML=`
      <div class="p-name">${p.name}</div>
      <div class="p-score">${fmt(p.totalScore)}</div> <!-- pt</div> -->
      <div class="p-block">${medals[di]}</div>`;
    stage.appendChild(div);
  });

  spawnConfetti();
  showScreen('screen-podium');
}

/* ────────────────────────────────────────────────────────────
   EVENT MODAL
   ──────────────────────────────────────────────────────────── */
function showEvent(icon, title, sub, cb) {
  document.getElementById('ev-icon').textContent = icon;
  document.getElementById('ev-title').textContent= title;
  document.getElementById('ev-sub').textContent  = sub;
  G.evCallback = cb;
  document.getElementById('modal-event').classList.add('on');
}
function closeEventModal() {
  document.getElementById('modal-event').classList.remove('on');
  if (G.evCallback) { const cb=G.evCallback; G.evCallback=null; cb(); }
}

/* Win announcement — small modal at bottom */
function showWin(icon, title, sub, cb) {
  document.getElementById('win-icon').textContent  = icon;
  document.getElementById('win-title').textContent = title;
  document.getElementById('win-sub').textContent   = sub;
  G.evCallback = cb;
  document.getElementById('modal-win').classList.add('on');
}
function closeWinModal() {
  document.getElementById('modal-win').classList.remove('on');
  if (G.evCallback) { const cb=G.evCallback; G.evCallback=null; cb(); }
}

/* ────────────────────────────────────────────────────────────
   TOAST
   ──────────────────────────────────────────────────────────── */
let toastTm;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent=msg; el.classList.add('on');
  clearTimeout(toastTm);
  toastTm=setTimeout(()=>el.classList.remove('on'), 2800);
}

/* ────────────────────────────────────────────────────────────
   CONFETTI
   ──────────────────────────────────────────────────────────── */
function spawnConfetti() {
  const c = document.getElementById('confetti');
  c.innerHTML='';
  const cols=['#FFD700','#FF4D4D','#4FC3F7','#81C784','#CE93D8','#FFB74D','#fff'];
  for (let i=0;i<90;i++) {
    const p=document.createElement('div'); p.className='cpiece';
    const size=6+Math.random()*10;
    p.style.cssText=`left:${Math.random()*100}%;width:${size}px;height:${size}px;
      background:${cols[Math.floor(Math.random()*cols.length)]};
      border-radius:${Math.random()>.5?'50%':'3px'};
      animation-duration:${2+Math.random()*3}s;
      animation-delay:${Math.random()*0.6}s;
      transform:rotate(${Math.random()*360}deg);`;
    c.appendChild(p);
  }
  setTimeout(()=>c.innerHTML='',6000);
}

/* ────────────────────────────────────────────────────────────
   UTILS
   ──────────────────────────────────────────────────────────── */
function fmt(n) { return n.toLocaleString('it-IT'); }
function resetResultUI() {
  document.getElementById('result-val').textContent='—';
  document.getElementById('btn-spin').disabled=false;
}
function restartGame() {
  showScreen('screen-players');
  updatePlayerInputs();
}

/* ────────────────────────────────────────────────────────────
   INIT
   ──────────────────────────────────────────────────────────── */
async function init() {
  await loadBoards();
  updatePlayerInputs();
  // Draw wheel with first board segments (just to show something on logo screen)
  drawWheel(G.wheelAngle);
}
init();
</script>
