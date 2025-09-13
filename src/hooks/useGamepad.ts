import { useEffect, useState, useCallback, useRef } from 'react';

interface GamepadState {
  isConnected: boolean;
  isActive: boolean;
  cursor: { x: number; y: number };
}

interface GamepadButtons {
  A: boolean;
  B: boolean;
  X: boolean;
  Y: boolean;
  LB: boolean;
  RB: boolean;
  LT: boolean;
  RT: boolean;
  Back: boolean;
  Start: boolean;
  LeftStick: boolean;
  RightStick: boolean;
  DPadUp: boolean;
  DPadDown: boolean;
  DPadLeft: boolean;
  DPadRight: boolean;
}

export const useGamepad = () => {
  const [gamepadState, setGamepadState] = useState<GamepadState>({
    isConnected: false,
    isActive: false,
    cursor: { x: window.innerWidth / 2, y: window.innerHeight / 2 }
  });

  const [buttons, setButtons] = useState<GamepadButtons>({
    A: false,
    B: false,
    X: false,
    Y: false,
    LB: false,
    RB: false,
    LT: false,
    RT: false,
    Back: false,
    Start: false,
    LeftStick: false,
    RightStick: false,
    DPadUp: false,
    DPadDown: false,
    DPadLeft: false,
    DPadRight: false,
  });

  // Use useRef to store previous buttons to avoid state dependency
  const previousButtonsRef = useRef<GamepadButtons>({ ...buttons });
  
  // Use ref for cursor position to enable real-time updates
  const cursorPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  // Gamepad sensitivity settings
  const CURSOR_SPEED = 8;
  const SCROLL_SPEED = 10;
  const DEADZONE = 0.01;

  const updateGamepad = useCallback(() => {
    const gamepads = navigator.getGamepads();
    const gamepad = gamepads[0]; // First connected gamepad

    if (!gamepad) {
      setGamepadState(prev => prev.isConnected ? { ...prev, isConnected: false } : prev);
      return;
    }

    // Read button states
    const currentButtons: GamepadButtons = {
      A: gamepad.buttons[0]?.pressed || false,
      B: gamepad.buttons[1]?.pressed || false,
      X: gamepad.buttons[2]?.pressed || false,
      Y: gamepad.buttons[3]?.pressed || false,
      LB: gamepad.buttons[4]?.pressed || false,
      RB: gamepad.buttons[5]?.pressed || false,
      LT: gamepad.buttons[6]?.pressed || false,
      RT: gamepad.buttons[7]?.pressed || false,
      Back: gamepad.buttons[8]?.pressed || false,
      Start: gamepad.buttons[9]?.pressed || false,
      LeftStick: gamepad.buttons[10]?.pressed || false,
      RightStick: gamepad.buttons[11]?.pressed || false,
      DPadUp: gamepad.buttons[12]?.pressed || false,
      DPadDown: gamepad.buttons[13]?.pressed || false,
      DPadLeft: gamepad.buttons[14]?.pressed || false,
      DPadRight: gamepad.buttons[15]?.pressed || false,
    };

    // Read analog sticks
    const leftStickY = Math.abs(gamepad.axes[1]) > DEADZONE ? gamepad.axes[1] : 0;
    const rightStickX = Math.abs(gamepad.axes[2]) > DEADZONE ? gamepad.axes[2] : 0;
    const rightStickY = Math.abs(gamepad.axes[3]) > DEADZONE ? gamepad.axes[3] : 0;

    // Check if gamepad is active
    let isGamepadActive = false;
    setGamepadState(prev => {
      isGamepadActive = prev.isActive;
      
      let newState = prev;
      let hasChanges = false;

      // Update connection status only if it changed
      if (!prev.isConnected) {
        newState = { ...newState, isConnected: true };
        hasChanges = true;
      }

      // Handle button presses for mode changes
      if (prev.isActive) {
        // X button - toggle gamepad mode
        if (currentButtons.X && !previousButtonsRef.current.X) {
          newState = { ...newState, isActive: !prev.isActive };
          hasChanges = true;
          isGamepadActive = !prev.isActive;
        }
      }

      // Start button - activate gamepad mode
      if (currentButtons.Start && !previousButtonsRef.current.Start) {
        newState = { ...newState, isActive: true };
        hasChanges = true;
        isGamepadActive = true;
      }

      return hasChanges ? newState : prev;
    });

    // Update cursor position with right stick - REAL TIME with ref
    if (isGamepadActive && (rightStickX !== 0 || rightStickY !== 0)) {
      const newX = Math.max(0, Math.min(window.innerWidth, cursorPosRef.current.x + rightStickX * CURSOR_SPEED));
      const newY = Math.max(0, Math.min(window.innerHeight, cursorPosRef.current.y + rightStickY * CURSOR_SPEED));

      // Update ref immediately
      cursorPosRef.current = { x: newX, y: newY };

      // Update state for UI
      setGamepadState(prev => ({
        ...prev,
        cursor: { x: newX, y: newY }
      }));

      // Move actual mouse cursor to follow gamepad cursor - IMMEDIATELY
      try {
        const element = document.elementFromPoint(newX, newY);
        if (element) {
          const mouseMoveEvent = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            clientX: newX,
            clientY: newY,
          });
          element.dispatchEvent(mouseMoveEvent);

          // Trigger mouseenter for hover effects
          const mouseEnterEvent = new MouseEvent('mouseenter', {
            bubbles: true,
            cancelable: true,
            clientX: newX,
            clientY: newY,
          });
          element.dispatchEvent(mouseEnterEvent);
        }
      } catch (error) {
        // Ignore errors in mouse event simulation
      }
    }

    // Handle button presses (only on press, not hold)
    if (isGamepadActive) {
      // A button - click with improved feedback
      if (currentButtons.A && !previousButtonsRef.current.A) {
        const element = document.elementFromPoint(cursorPosRef.current.x, cursorPosRef.current.y);
        if (element) {
          // Trigger mousedown and mouseup for complete click simulation
          const mouseDownEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            clientX: cursorPosRef.current.x,
            clientY: cursorPosRef.current.y,
          });
          element.dispatchEvent(mouseDownEvent);

          setTimeout(() => {
            const mouseUpEvent = new MouseEvent('mouseup', {
              bubbles: true,
              cancelable: true,
              clientX: cursorPosRef.current.x,
              clientY: cursorPosRef.current.y,
            });
            element.dispatchEvent(mouseUpEvent);

            // Finally trigger click
            (element as HTMLElement).click();
          }, 50);
        }
      }

      // B button - right click
      if (currentButtons.B && !previousButtonsRef.current.B) {
        const element = document.elementFromPoint(cursorPosRef.current.x, cursorPosRef.current.y);
        if (element) {
          const rightClickEvent = new MouseEvent('contextmenu', {
            bubbles: true,
            cancelable: true,
            clientX: cursorPosRef.current.x,
            clientY: cursorPosRef.current.y,
          });
          element.dispatchEvent(rightClickEvent);
        }
      }

      // DPAD Up - Scroll up 100px instantly
      if (currentButtons.DPadUp && !previousButtonsRef.current.DPadUp) {
        window.scrollBy(0, -200);
      }

      // DPAD Down - Scroll down 100px instantly
      if (currentButtons.DPadDown && !previousButtonsRef.current.DPadDown) {
        window.scrollBy(0, 200);
      }

      console.log(leftStickY);
      // Scroll with left stick
          if (Math.abs(leftStickY) > 0.1) { // ufak titremeleri engelle
        // Doğrudan kaydır, smooth yok
        window.scrollBy(0, leftStickY * 20); // 10 px * stick değeri
    }
    }

    // Update button states only if they changed
    const buttonsChanged = Object.keys(currentButtons).some(key =>
      currentButtons[key as keyof GamepadButtons] !== previousButtonsRef.current[key as keyof GamepadButtons]
    );

    previousButtonsRef.current = currentButtons;

    if (buttonsChanged) {
      setButtons(currentButtons);
    }
  }, [CURSOR_SPEED, SCROLL_SPEED, DEADZONE]);

  useEffect(() => {
    // Sync cursor ref with initial state
    cursorPosRef.current = gamepadState.cursor;
  }, []);

  useEffect(() => {
    let animationFrame: number;

    // Check for existing gamepads on mount
    const checkInitialGamepads = () => {
      const gamepads = navigator.getGamepads();
      for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
          console.log('Initial gamepad found:', gamepads[i]?.id);
          setGamepadState(prev => ({ ...prev, isConnected: true }));
          break;
        }
      }
    };

    // Check for gamepads immediately
    checkInitialGamepads();

    const gameLoop = () => {
      updateGamepad();
      animationFrame = requestAnimationFrame(gameLoop);
    };

    // Start game loop
    gameLoop();

    // Gamepad connected/disconnected events
    const handleGamepadConnected = (e: GamepadEvent) => {
      console.log('Gamepad connected:', e.gamepad.id);
      setGamepadState(prev => ({ ...prev, isConnected: true }));
    };

    const handleGamepadDisconnected = (e: GamepadEvent) => {
      console.log('Gamepad disconnected:', e.gamepad.id);
      setGamepadState(prev => ({ ...prev, isConnected: false, isActive: false }));
    };

    window.addEventListener('gamepadconnected', handleGamepadConnected);
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('gamepadconnected', handleGamepadConnected);
      window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
    };
  }, [updateGamepad]);

  const activateGamepad = () => {
    setGamepadState(prev => ({ ...prev, isActive: true }));
  };

  const deactivateGamepad = () => {
    setGamepadState(prev => ({ ...prev, isActive: false }));
  };

  return {
    gamepadState,
    buttons,
    activateGamepad,
    deactivateGamepad,
  };
};