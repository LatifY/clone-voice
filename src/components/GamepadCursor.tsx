import React from 'react';
import { useGamepad } from '../hooks/useGamepad';

export const GamepadCursor: React.FC = () => {
  const { gamepadState, buttons, activateGamepad, deactivateGamepad } = useGamepad();

  if (!gamepadState.isConnected) {
    return null;
  }

  return (
    <>
      {/* Gamepad Status Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center gap-3 bg-black/80 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
          <div className={`w-3 h-3 rounded-full ${gamepadState.isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
          <span className="text-white text-sm font-mono">
            {gamepadState.isConnected ? 'Gamepad Connected' : 'Gamepad Disconnected'}
          </span>
          {gamepadState.isConnected && !gamepadState.isActive && (
            <button
              onClick={activateGamepad}
              className="bg-white text-black px-3 py-1 rounded-full text-xs font-semibold hover:bg-gray-200 transition-colors font-body"
            >
              Activate
            </button>
          )}
          {gamepadState.isActive && (
            <button
              onClick={deactivateGamepad}
              className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-red-600 transition-colors font-body"
            >
              Deactivate
            </button>
          )}
        </div>
      </div>

      {/* Custom Cursor */}
      {gamepadState.isActive && (
        <div
          className="fixed pointer-events-none z-[9999] transition-all duration-75"
          style={{
            left: gamepadState.cursor.x - 16,
            top: gamepadState.cursor.y - 16,
          }}
        >
          {/* Cursor Ring */}
          <div className="relative">
            <div className="w-8 h-8 border-2 border-white rounded-full bg-white/20 backdrop-blur-sm animate-pulse"></div>
            <div className="absolute inset-0 w-8 h-8 border-2 border-blue-400 rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
          </div>
          
          {/* Click Indicator */}
          {buttons.A && (
            <div className="absolute -inset-2 border-4 border-green-400 rounded-full animate-ping"></div>
          )}
        </div>
      )}

      {/* Controls Info Panel */}
      {gamepadState.isActive && (
        <div className="fixed bottom-4 left-4 z-50">
          <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-white font-mono text-sm max-w-xs">
            <h4 className="font-semibold mb-2 text-blue-400 font-heading">🎮 Gamepad Controls</h4>
            <div className="space-y-1 text-xs font-body">
              <div>🕹️ Right Stick: Move cursor</div>
              <div>🕹️ Left Stick: Scroll page</div>
              <div>🅰️ A Button: Click</div>
              <div>🅱️ B Button: Right click</div>
              <div>❌ X Button: Toggle mode</div>
              <div>▶️ Start: Activate gamepad</div>
            </div>
            <div className="mt-3 pt-2 border-t border-white/20 text-xs text-gray-300 font-body">
              <div>Status: <span className="text-green-400 font-semibold">Active</span></div>
              <div>F310 Compatible ✅</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};