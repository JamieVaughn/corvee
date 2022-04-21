export default function useGrowth(cap, n, boost = 1) {
  // the 'boost' in the numerator can be changed to 2 then 3 with research to boost growth
  return boost / (1 / (1 - n / cap) + Math.exp(-n));
}
