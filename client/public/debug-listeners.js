// Listener Debugging Tool
// How to use:
// 1. Open Chrome DevTools Console
// 2. Paste this entire file and press Enter
// 3. Open/close 3D model dialogs and watch console for listener adds/removes

(function proxyListeners(){
  if (window.__proxyListenersInstalled) {
    console.log('[listener-proxy] already installed');
    return;
  }
  window.__proxyListenersInstalled = true;

  const SENSITIVE = new Set(['touchstart','touchmove','wheel']);
  const orig = EventTarget.prototype.addEventListener;
  const origRemove = EventTarget.prototype.removeEventListener;

  const counts = { touchstart: 0, touchmove: 0, wheel: 0 };

  EventTarget.prototype.addEventListener = function(type, listener, options){
    if (SENSITIVE.has(type)) {
      counts[type]++;
      const passive = options?.passive ?? false;
      console.log(
        `%c[ADD] ${type} %c(Total: ${counts[type]}) %c${passive ? 'PASSIVE ✓' : 'NON-PASSIVE ⚠️'}`,
        'color: #22c55e; font-weight: bold',
        'color: #3b82f6',
        passive ? 'color: #22c55e' : 'color: #f59e0b'
      );
      console.log('  Target:', this);
      console.log('  Options:', options);
      console.trace('  Stack:');
    }
    return orig.call(this, type, listener, options);
  };

  EventTarget.prototype.removeEventListener = function(type, listener, options){
    if (SENSITIVE.has(type)) {
      counts[type]--;
      console.log(
        `%c[REMOVE] ${type} %c(Total: ${counts[type]})`,
        'color: #ef4444; font-weight: bold',
        'color: #3b82f6'
      );
      console.log('  Target:', this);
    }
    return origRemove.call(this, type, listener, options);
  };

  console.log(
    '%c[listener-proxy] Installed! ✓',
    'background: #22c55e; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold'
  );
  console.log('Monitoring: touchstart, touchmove, wheel');
  console.log('Open/close 3D model dialogs to see listener lifecycle');
})();
