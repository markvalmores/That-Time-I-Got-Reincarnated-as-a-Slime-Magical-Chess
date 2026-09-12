import { ControllerPromptStyle, GamepadButtonStatus } from '../types/game';

export interface GamepadActionCallbacks {
  onNavigate?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  onSelect?: () => void; // A / Cross / 1 / B
  onCancel?: () => void; // B / Circle / 2 / A
  onHint?: () => void; // X / Square / 3 / Y
  onAnalyze?: () => void; // Y / Triangle / 4 / X
  onUndo?: () => void; // LB / L1
  onFlip?: () => void; // RB / R1
  onZoomToggle?: () => void; // LT / L2
  onMuteToggle?: () => void; // RT / R2
  onMenu?: () => void; // Start / Options
}

export class GamepadManager {
  private running: boolean = false;
  private animFrameId: number | null = null;
  private promptStyle: ControllerPromptStyle = 'xbox';
  private callbacks: GamepadActionCallbacks = {};
  
  // Previous button states for single-press edge detection
  private prevButtonStates: Record<number, boolean> = {};
  private lastDpadTime: number = 0;
  private dpadRepeatDelay: number = 180; // ms

  public connectedGamepadName: string | null = null;

  constructor(style: ControllerPromptStyle = 'xbox') {
    this.promptStyle = style;
  }

  public setPromptStyle(style: ControllerPromptStyle) {
    this.promptStyle = style;
  }

  public getPromptStyle(): ControllerPromptStyle {
    return this.promptStyle;
  }

  public setCallbacks(callbacks: GamepadActionCallbacks) {
    this.callbacks = callbacks;
  }

  public start() {
    if (this.running) return;
    this.running = true;

    window.addEventListener('gamepadconnected', this.handleConnected);
    window.addEventListener('gamepaddisconnected', this.handleDisconnected);

    this.pollLoop();
  }

  public stop() {
    this.running = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    window.removeEventListener('gamepadconnected', this.handleConnected);
    window.removeEventListener('gamepaddisconnected', this.handleDisconnected);
  }

  private handleConnected = (e: GamepadEvent) => {
    this.connectedGamepadName = e.gamepad.id;
    // Auto-detect PlayStation controller from ID if present
    const idLower = e.gamepad.id.toLowerCase();
    if (idLower.includes('playstation') || idLower.includes('dualshock') || idLower.includes('dualsense') || idLower.includes('sony') || idLower.includes('054c')) {
      this.promptStyle = 'playstation';
    } else if (idLower.includes('nintendo') || idLower.includes('switch') || idLower.includes('057e')) {
      this.promptStyle = 'nintendo';
    } else if (idLower.includes('generic') || idLower.includes('usb gamepad')) {
      this.promptStyle = 'generic';
    } else {
      this.promptStyle = 'xbox';
    }
  };

  private handleDisconnected = () => {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const hasAny = Array.from(gamepads).some(gp => gp !== null);
    if (!hasAny) {
      this.connectedGamepadName = null;
    }
  };

  private pollLoop = () => {
    if (!this.running) return;

    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    let activeGp: Gamepad | null = null;

    for (let i = 0; i < gamepads.length; i++) {
      if (gamepads[i]) {
        activeGp = gamepads[i];
        break;
      }
    }

    if (activeGp) {
      this.connectedGamepadName = activeGp.id;
      this.processGamepadInput(activeGp);
    }

    this.animFrameId = requestAnimationFrame(this.pollLoop);
  };

  private processGamepadInput(gp: Gamepad) {
    const now = performance.now();
    const buttons = gp.buttons;
    const axes = gp.axes;

    const isPressed = (index: number) => buttons[index]?.pressed || false;

    // Helper for single trigger on press
    const checkButtonJustPressed = (btnIndex: number, action?: () => void) => {
      const pressed = isPressed(btnIndex);
      const wasPressed = this.prevButtonStates[btnIndex] || false;
      this.prevButtonStates[btnIndex] = pressed;

      if (pressed && !wasPressed && action) {
        action();
      }
    };

    // Standard Gamepad mapping:
    // Button 0: A (Xbox) / Cross (PS) / 1 (Generic) / B (Nintendo) -> Select / Confirm
    checkButtonJustPressed(0, this.callbacks.onSelect);

    // Button 1: B (Xbox) / Circle (PS) / 2 (Generic) / A (Nintendo) -> Cancel / Back / Undo
    checkButtonJustPressed(1, this.callbacks.onCancel);

    // Button 2: X (Xbox) / Square (PS) / 3 (Generic) / Y (Nintendo) -> Hint
    checkButtonJustPressed(2, this.callbacks.onHint);

    // Button 3: Y (Xbox) / Triangle (PS) / 4 (Generic) / X (Nintendo) -> Deep Analysis
    checkButtonJustPressed(3, this.callbacks.onAnalyze);

    // Button 4: LB / L1 -> Undo Move
    checkButtonJustPressed(4, this.callbacks.onUndo);

    // Button 5: RB / R1 -> Flip Board
    checkButtonJustPressed(5, this.callbacks.onFlip);

    // Button 6: LT / L2 -> Video Zoom Toggle
    checkButtonJustPressed(6, this.callbacks.onZoomToggle);

    // Button 7: RT / R2 -> Audio Mute Toggle
    checkButtonJustPressed(7, this.callbacks.onMuteToggle);

    // Button 9: Start / Options -> Menu / Pause
    checkButtonJustPressed(9, this.callbacks.onMenu);

    // Navigation (D-pad & Left Stick with rate limiting)
    if (now - this.lastDpadTime > this.dpadRepeatDelay) {
      const dpadUp = isPressed(12) || (axes[1] && axes[1] < -0.55);
      const dpadDown = isPressed(13) || (axes[1] && axes[1] > 0.55);
      const dpadLeft = isPressed(14) || (axes[0] && axes[0] < -0.55);
      const dpadRight = isPressed(15) || (axes[0] && axes[0] > 0.55);

      if (dpadUp) {
        this.callbacks.onNavigate?.('up');
        this.lastDpadTime = now;
      } else if (dpadDown) {
        this.callbacks.onNavigate?.('down');
        this.lastDpadTime = now;
      } else if (dpadLeft) {
        this.callbacks.onNavigate?.('left');
        this.lastDpadTime = now;
      } else if (dpadRight) {
        this.callbacks.onNavigate?.('right');
        this.lastDpadTime = now;
      }
    }
  }

  public getButtonLabels() {
    switch (this.promptStyle) {
      case 'playstation':
        return {
          select: '✕ Cross',
          cancel: '○ Circle',
          hint: '□ Square',
          analyze: '△ Triangle',
          undo: 'L1',
          flip: 'R1',
          zoom: 'L2',
          mute: 'R2',
          menu: 'Options'
        };
      case 'nintendo':
        return {
          select: 'B',
          cancel: 'A',
          hint: 'Y',
          analyze: 'X',
          undo: 'L',
          flip: 'R',
          zoom: 'ZL',
          mute: 'ZR',
          menu: '+'
        };
      case 'generic':
        return {
          select: '1 (A)',
          cancel: '2 (B)',
          hint: '3 (X)',
          analyze: '4 (Y)',
          undo: 'L1',
          flip: 'R1',
          zoom: 'L2',
          mute: 'R2',
          menu: 'START'
        };
      case 'xbox':
      default:
        return {
          select: 'A',
          cancel: 'B',
          hint: 'X',
          analyze: 'Y',
          undo: 'LB',
          flip: 'RB',
          zoom: 'LT',
          mute: 'RT',
          menu: 'Menu'
        };
    }
  }
}

export const globalGamepad = new GamepadManager('xbox');
