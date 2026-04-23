// Encapsulated Coffee Bean Snake game.
// Exported API: initGame({canvasId, overlayId, startBtnId}), openModal(), closeModal(), pause(), resume()
export function initGame({ canvasId='snake-canvas', overlayId='game-overlay', startBtnId='btn-start-game', scoreIds={score:'val-score', best:'val-best'} } = {}) {
  const canvas = document.getElementById(canvasId);
  const overlay = document.getElementById(overlayId);
  const startBtn = document.getElementById(startBtnId);
  const scoreEl = document.getElementById(scoreIds.score);
  const bestEl = document.getElementById(scoreIds.best);
  const scoreDisplay = document.getElementById('game-score-display');

  const ctx = canvas?.getContext && canvas.getContext('2d');
  if (!canvas || !ctx) {
    console.warn('initGame: canvas or context not found');
    return { openModal:()=>{}, closeModal:()=>{}, pause:()=>{}, resume:()=>{}, reset:()=>{}, setDir:()=>{} };
  }

  const CELL = 22, COLS = 24, ROWS = 18;
  const W = CELL * COLS, H = CELL * ROWS;
  canvas.width = W; canvas.height = H;

  let snake = [], dir = {x:1,y:0}, nextDir = {x:1,y:0}, food = {x:0,y:0};
  let score = 0, best = 0, over = false, started = false, raf = null, lastTime = 0, accum = 0, speed = 130;

  function rp(){ return { x: Math.floor(Math.random()*COLS), y: Math.floor(Math.random()*ROWS) }; }

  function initState(){
    snake = [{x:12,y:9},{x:11,y:9},{x:10,y:9}];
    dir = {x:1,y:0}; nextDir = {x:1,y:0};
    food = rp(); over = false; score = 0; speed = 130; updateUI();
  }

  function updateUI(){ if(scoreEl) scoreEl.textContent = score; if(bestEl) bestEl.textContent = best; }

  function drawBean(x,y,r,alpha=1){
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x,y);
    ctx.beginPath(); ctx.ellipse(0,0,r*0.6,r*0.42,0,0,Math.PI*2);
    ctx.fillStyle = "#FFDFAF"; // brighter bean core for contrast
    ctx.fill();
    ctx.beginPath(); ctx.ellipse(-r*0.1,-r*0.09,r*0.12,r*0.08,-0.5,0,Math.PI*2);
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.fill();
    ctx.restore();
  }

  function drawSnake(){
    ctx.fillStyle = "#0e0e0e"; ctx.fillRect(0,0,W,H);
    // grid lightly
    ctx.strokeStyle = "rgba(200,169,126,0.04)"; ctx.lineWidth = 0.4;
    for(let x=0;x<=COLS;x++){ ctx.beginPath(); ctx.moveTo(x*CELL,0); ctx.lineTo(x*CELL,H); ctx.stroke(); }
    for(let y=0;y<=ROWS;y++){ ctx.beginPath(); ctx.moveTo(0,y*CELL); ctx.lineTo(W,y*CELL); ctx.stroke(); }

    // food
    ctx.save(); ctx.shadowColor = "#C8A97E"; ctx.shadowBlur = 12;
    drawBean(food.x*CELL+CELL/2, food.y*CELL+CELL/2, CELL*0.45, 1);
    ctx.restore();

    // snake body with contrast color
    snake.forEach((s,i)=>{
      const a = Math.max(0.5,1 - i*0.04);
      drawBean(s.x*CELL+CELL/2, s.y*CELL+CELL/2, CELL*0.44, a);
    });
  }

  function tick(ts){
    if(over) return;
    const dt = Math.min(ts - lastTime, 200);
    lastTime = ts; accum += dt;
    if(accum >= speed){
      accum -= speed; dir = {...nextDir};
      const hd = { x:(snake[0].x + dir.x + COLS) % COLS, y:(snake[0].y + dir.y + ROWS) % ROWS };
      if(snake.some(sg => sg.x === hd.x && sg.y === hd.y)){
        over = true;
        if(score > best) { best = score; saveBest(); }
        showOverlay(true);
        updateUI();
        return;
      }
      snake.unshift(hd);
      if(hd.x === food.x && hd.y === food.y){
        score += 10; speed = Math.max(52, speed - 2);
        updateUI();
        let nf; do { nf = rp(); } while(snake.some(sg=>sg.x===nf.x && sg.y===nf.y));
        food = nf;
      } else {
        snake.pop();
      }
    }
    drawSnake();
    raf = requestAnimationFrame(tick);
  }

  function showOverlay(isGameOver){
    overlay.classList.remove('hidden');
    // hide live score while overlay is visible (unless you want to show on game over)
    scoreDisplay?.classList.add('hidden');
    overlay.querySelector('#game-title')?.setAttribute('data-state', isGameOver ? 'over' : 'play');
    if(isGameOver) {
      overlay.querySelector('#game-title').textContent = 'GAME OVER';
      overlay.querySelector('#game-subtitle').textContent = 'Score: ' + score;
      overlay.querySelector('#btn-start-game').textContent = 'Play Again';
    }
  }
  function hideOverlay(){
    overlay.classList.add('hidden');
    // reveal live score when overlay is hidden (game area active)
    scoreDisplay?.classList.remove('hidden');
  }

  function setDir(dx,dy){
    if(!started || over) return;
    if(dx !== 0 && dir.x !== 0) return;
    if(dy !== 0 && dir.y !== 0) return;
    nextDir = {x:dx,y:dy};
  }

  // controls
  window.addEventListener('keydown', e=>{
    const map = { ArrowUp:[0,-1], w:[0,-1], ArrowDown:[0,1], s:[0,1], ArrowLeft:[-1,0], a:[-1,0], ArrowRight:[1,0], d:[1,0] };
    const d = map[e.key];
    if(!d) return;
    if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].indexOf(e.key) > -1) e.preventDefault();

    // if not started, start the game (mirror touch start)
    if(!started && !over){
      hideOverlay();
      started = true;
      initState();
      if(raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    }

    setDir(d[0], d[1]);
  });

  // touch
  let touchStartX=0, touchStartY=0;
  canvas.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; touchStartY = e.changedTouches[0].screenY; }, { passive:true });
  canvas.addEventListener('touchend', e =>{
    const tx = e.changedTouches[0].screenX, ty = e.changedTouches[0].screenY;
    const dx = tx - touchStartX, dy = ty - touchStartY;
    if(Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
    if(Math.abs(dx) > Math.abs(dy)) { if(dx > 0) setDir(1,0); else setDir(-1,0); }
    else { if(dy > 0) setDir(0,1); else setDir(0,-1); }
    if(!started && !over){
      hideOverlay(); started = true; initState(); if(raf) cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
    }
  }, { passive:true });

  startBtn?.addEventListener('click', () => {
    hideOverlay(); started = true; initState(); if(raf) cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
  });

  function pause(){ if(raf) cancelAnimationFrame(raf); raf = null; }
  function resume(){ if(!raf && !over && started) { lastTime = performance.now(); raf = requestAnimationFrame(tick); } }
  function reset(){ initState(); drawSnake(); }

  // restore best score
  best = parseInt(localStorage.getItem('kc_best') || '0', 10) || 0;
  function saveBest() { localStorage.setItem('kc_best', String(best)); }

  // ensure UI reflects restored best
  updateUI();

  // expose API
  initState();
  drawSnake();

  return { openModal: showOverlay, closeModal: hideOverlay, pause, resume, reset, setDir };
}