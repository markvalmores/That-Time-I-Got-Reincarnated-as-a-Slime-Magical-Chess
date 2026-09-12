import { DeviceInfo } from '../types/game';

// Inspect WebGL / GPU Renderer details safely
export function getGPUInfo(): { renderer: string; vendor: string; maxTextureSize: number; webgl2: boolean } {
  if (typeof window === 'undefined') {
    return { renderer: 'Unknown GPU', vendor: 'Unknown Vendor', maxTextureSize: 4096, webgl2: false };
  }

  try {
    const canvas = document.createElement('canvas');
    const gl2 = canvas.getContext('webgl2');
    const gl = gl2 || canvas.getContext('webgl') || (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

    if (!gl) {
      return { renderer: 'Software Rasterizer (No WebGL)', vendor: 'Generic', maxTextureSize: 2048, webgl2: false };
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR);
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 4096;

    return {
      renderer: renderer || 'Standard Graphics Accelerator',
      vendor: vendor || 'Generic Hardware',
      maxTextureSize,
      webgl2: !!gl2
    };
  } catch (e) {
    return { renderer: 'Default Hardware Device', vendor: 'Generic', maxTextureSize: 4096, webgl2: false };
  }
}

// Full device inspector & diagnostics
export async function detectCompleteDeviceInfo(): Promise<DeviceInfo> {
  const gpu = getGPUInfo();
  const cpuCores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 8 : 4;
  const deviceMemory = (navigator as any)?.deviceMemory || 8; // in GB
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';
  const platform = typeof navigator !== 'undefined' ? (navigator as any)?.userAgentData?.platform || navigator.platform || 'Unknown OS' : 'Web';
  const screenResolution = typeof window !== 'undefined' ? `${window.screen.width} x ${window.screen.height}` : '1920 x 1080';
  const pixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

  // Network connection info if available
  const connection = (navigator as any)?.connection || (navigator as any)?.mozConnection || (navigator as any)?.webkitConnection;
  const downlinkMbps = connection?.downlink || 50;
  const rttMs = connection?.rtt || 20;

  // Fetch client IP and server data
  let ip = '127.0.0.1';
  let networkIp = '192.168.1.100 (Local)';
  try {
    const res = await fetch('/api/device-info');
    if (res.ok) {
      const data = await res.json();
      ip = data.ip || '127.0.0.1';
      networkIp = `${data.ip} (${data.protocol || 'https'})`;
    }
  } catch {
    // Fallback if offline
    ip = '127.0.0.1 (Local Client)';
  }

  // Determine optimal graphics quality based on GPU and CPU
  let graphicsQuality: 'ultra' | 'high' | 'medium' | 'low' = 'high';
  const rendererLower = gpu.renderer.toLowerCase();
  if (rendererLower.includes('rtx') || rendererLower.includes('radeon rx') || rendererLower.includes('apple m') || rendererLower.includes('geforce') || cpuCores >= 8) {
    graphicsQuality = 'ultra';
  } else if (cpuCores >= 4 && deviceMemory >= 4) {
    graphicsQuality = 'high';
  } else if (cpuCores >= 2) {
    graphicsQuality = 'medium';
  } else {
    graphicsQuality = 'low';
  }

  return {
    ip,
    networkIp,
    deviceIp: ip,
    userAgent,
    platform,
    cpuCores,
    deviceMemory,
    gpuRenderer: gpu.renderer,
    gpuVendor: gpu.vendor,
    maxTextureSize: gpu.maxTextureSize,
    webgl2Supported: gpu.webgl2,
    screenResolution,
    pixelRatio,
    screenRefreshRateEstimate: 144,
    targetFPS: 144,
    currentFPS: 144,
    frameTimeMs: 6.94,
    downlinkMbps,
    rttMs,
    graphicsQuality
  };
}

// Real-time FPS Tracker Class
export class FPSTracker {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private frameTime = 16.6;
  private rafId: number | null = null;
  private onUpdate?: (fps: number, frameTime: number) => void;

  public start(callback: (fps: number, frameTime: number) => void) {
    this.onUpdate = callback;
    this.lastTime = performance.now();
    this.frameCount = 0;

    const loop = (now: number) => {
      this.frameCount++;
      const delta = now - this.lastTime;
      if (delta >= 500) {
        this.fps = Math.round((this.frameCount * 1000) / delta);
        this.frameTime = parseFloat((delta / this.frameCount).toFixed(2));
        this.frameCount = 0;
        this.lastTime = now;
        if (this.onUpdate) {
          this.onUpdate(this.fps, this.frameTime);
        }
      }
      this.rafId = requestAnimationFrame(loop);
    };

    this.rafId = requestAnimationFrame(loop);
  }

  public stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}
