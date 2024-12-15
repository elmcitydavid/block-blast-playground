function setup() {
  createCanvas(400, 400);
}

let cur_index = 0;
const undo_stack = [0n];
function push_state(state) {
  undo_stack[++cur_index] = state;
}
function push_state_safe(state) {
  if (state != undo_stack[cur_index]) push_state(state);
}
function undo() {
  if (cur_index > 0) cur_index--;
}
function redo() {
  if (cur_index < undo_stack.length - 1) cur_index++;
}
function blast() {
  const cur_state = undo_stack[cur_index];
  const mask = masks
    .filter((mask) => (mask & cur_state) == mask)
    .reduce((initial, mask) => initial | mask);
  push_state_safe(cur_state ^ mask);
}
const COLUMN_MASK = 0x0101010101010101n;
const masks = [].concat(
  Array.from({ length: 8 }, (_, i) => 255n << (8n * BigInt(i))),
  Array.from({ length: 8 }, (_, i) => COLUMN_MASK << BigInt(i))
);

function inBounds(x, y) {
  return x >= 0 && x < width && y >= 0 && y < height;
}

let draw_mask = 0n;
function draw() {
  background("white");
  const cur_state = undo_stack[cur_index];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const c = 1n << (BigInt(i) * 8n + BigInt(j));
      fill("midnightblue");
      if (cur_state & c) {
        fill("red");
        if (
          masks
            .filter((mask) => (mask & cur_state) == mask)
            .some((mask) => mask & c)
        )
          fill("magenta");
      }
      if (draw_mask & c) fill("skyblue");
      rect(j * 50, i * 50, 50, 50);
    }
  }
  if (mouseIsPressed) {
    let x = pmouseX;
    let y = pmouseY;
    const dx = mouseX - x;
    const dy = mouseY - y;
    let d = Math.sqrt(dx * dx + dy * dy);
    if (d == 0) d = 1;
    for (let t = 0; t <= d; t += 0.01)
      if (inBounds(x + (dx / d) * t, y + (dy / d) * t)) {
        const col = Math.floor((x + (dx / d) * t) / 50);
        const r = Math.floor((y + (dy / d) * t) / 50);
        draw_mask |= 1n << (BigInt(r) * 8n + BigInt(col));
      }
  }
  if (!mouseIsPressed && draw_mask != 0n) {
    if ((cur_state & draw_mask) == draw_mask) {
      push_state_safe(cur_state ^ draw_mask);
    } else {
      push_state_safe(cur_state | draw_mask);
    }
    draw_mask = 0n;
  }
}
