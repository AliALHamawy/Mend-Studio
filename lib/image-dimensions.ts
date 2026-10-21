/** Maximum edge length for client-side canvas encoding (memory & main-thread safety). */
export const MAX_IMAGE_EDGE = 4096;

export function fitImageDimensions(width: number, height: number, maxEdge = MAX_IMAGE_EDGE) {
  const longest = Math.max(width, height);
  if (longest <= maxEdge) {
    return { width, height, scaled: false };
  }
  const scale = maxEdge / longest;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
    scaled: true,
  };
}
