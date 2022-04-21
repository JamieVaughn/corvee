export default function useEdge(musterId, adjId, dimension) {
  return (
    (adjId % dimension === 0 && (musterId + 1) % dimension === 0) ||
    ((adjId + 1) % dimension === 0 && musterId % dimension === 0)
  );
}
