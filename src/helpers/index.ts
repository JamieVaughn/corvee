import { Accessor } from "solid-js";
import { units } from '../data/pieces'

export function isEdge(musterId, adjId, dimension) {
  return (
    (adjId % dimension === 0 && (musterId + 1) % dimension === 0) ||
    ((adjId + 1) % dimension === 0 && musterId % dimension === 0)
  );
}

export function growthFactor(cap, n, boost = 1) {
  // the 'boost' in the numerator can be changed to 2 then 3 with research to boost growth
  return boost / (1 / (1 - n / cap) + Math.exp(-n));
}


// If fps is at 10 so
// each frame must take 100ms
// Now frame executes in 16ms (60fps) so
// the loop iterates 7 times (16*7 = 112ms) ...
export function draw(now, {then = now, delta = 0, drawCallback, fps = 30}) {
    let interval = 1000 / fps
    requestAnimationFrame(timestamp => draw(timestamp, {then, delta: now - then, drawCallback, fps}));
    if (delta > interval) { // track if elapsed time is more than render interval 
        then = now - (delta % interval) // shave extra/residual ms
        // Frame Animation side effects here ...
        drawCallback()
    }
}

export function handleFallback<T>(item: T, index: Accessor<number>): Element {
  throw new Error('Function not implemented.')
}

export const canReach = ([pos, unit], dimension = 8) => {
  let row = Math.ceil(pos / dimension);
  let col = pos % dimension;
  const speed = units[unit.type]?.speed
  const iter = Array.from({length: speed}).map((_, i) => i )
  const west = iter.map(w => pos + w)
  const east = iter.map(e => pos - e)
  const north = iter.map(n => pos - n*dimension)
  const south = iter.map(s => pos + s*dimension)
  const se = iter.map(se => pos + se*dimension + 1)

  const reach = [...west, ...east, ...north, ...south, ...se].filter(p => p < (dimension ** 2) - 1 && p >= 0)
  console.log('reach', pos, reach)
  let coef = row % 2 === 0 ? -1 * speed : 1 * speed;
  if (row % 2 === 0 && col === 0) coef = 1 * speed;
  if (row % 2 === 1 && col === 0) coef = 0;
  // return reach
  return [-dimension + coef, -dimension, -1, 1, dimension, dimension + coef];
}
