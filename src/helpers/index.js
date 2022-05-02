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
