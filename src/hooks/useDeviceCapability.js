import { useState, useEffect } from 'react';

export function useDeviceCapability() {
  const [capability, setCapability] = useState(() => detectCapability());

  useEffect(() => {
    // Re-detect on resize (orientation change on mobile)
    const handler = () => setCapability(detectCapability());
    window.addEventListener('resize', handler, { passive: true });
    return () => window.removeEventListener('resize', handler);
  }, []);

  return capability;
}

function detectCapability() {
  const nav = navigator;

  // Hardware cores
  const cores = nav.hardwareConcurrency || 2;

  // Device memory (in GB)
  const memory = (nav.deviceMemory || 2);

  // GPU detection via WebGL renderer
  let gpuClass = 'unknown';
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
        // Exclude known weak GPUs
        if (
          renderer.includes('intel') ||
          renderer.includes('mali') ||
          renderer.includes('adreno 3') ||
          renderer.includes('adreno 4') ||
          renderer.includes('powervr') ||
          renderer.includes('apple gpu') // older iPads
        ) {
          gpuClass = 'low';
        } else if (
          renderer.includes('adreno 5') ||
          renderer.includes('adreno 6') ||
          renderer.includes('nvidia') ||
          renderer.includes('geforce') ||
          renderer.includes('radeon rx')
        ) {
          gpuClass = 'high';
        } else {
          gpuClass = 'medium';
        }
      }
    }
  } catch { /* WebGL not available */ }

  // Touch vs desktop - check multiple indicators
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(nav.userAgent) ||
    (typeof window !== 'undefined' && window.ontouchstart !== undefined) ||
    (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0);

  // Screen pixel ratio
  const dpr = Math.min(window.devicePixelRatio || 1, 3);

  // Score-based tier
  let score = 0;
  if (cores >= 8) score += 2;
  else if (cores >= 4) score += 1;

  if (memory >= 8) score += 2;
  else if (memory >= 4) score += 1;

  if (gpuClass === 'high') score += 3;
  else if (gpuClass === 'medium') score += 1;
  else if (gpuClass === 'low') score -= 1;

  if (isMobile) score -= 2;

  // Also penalize high DPR on lower-tier devices
  if (dpr > 1.5 && score < 4) score -= 1;

  let tier;
  if (score >= 5) tier = 'high';
  else if (score >= 2) tier = 'medium';
  else tier = 'low';

  return { tier, isMobile, gpuClass, cores, memory, dpr };
}
