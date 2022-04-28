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
