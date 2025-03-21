// scripts/utils.js
export const Utils = {
  // Angle conversions
  degreesToRadians: (deg) => (deg * Math.PI) / 180,
  radiansToDegrees: (rad) => ((rad * 180) / Math.PI) % 360,

  // Canvas operations
  exportCanvasToPNG: (canvas, filename = "skate-track.png") => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = canvas.toDataURL("image/png");
    link.click();
  },

  // Coordinate formatting
  formatCoordinate: (x, y) => `(${Math.round(x)}, ${Math.round(y)})`,

  // Value validation
  clamp: (value, min, max) => Math.min(Math.max(value, min), max),
  isInRange: (value, min, max) => value >= min && value <= max,

  // Geometry calculations
  calculateEndpoint: (startX, startY, length, angleRad) => ({
    x: startX + length * Math.cos(angleRad),
    y: startY - length * Math.sin(angleRad),
  }),

  // Style helpers
  generateSegmentColor: (index) => `hsl(${index * 60}, 70%, 60%)`,

  // Measurement conversions
  pixelsToMeters: (pixels, conversionRate = 0.1) => pixels * conversionRate,
  metersToPixels: (meters, conversionRate = 0.1) => meters / conversionRate,

  // Event handling
  throttle: (func, limit = 100) => {
    let lastFunc;
    let lastRan;
    return function (...args) {
      if (!lastRan) {
        func.apply(this, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(() => {
          if (Date.now() - lastRan >= limit) {
            func.apply(this, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  },
};

// Optional: Add array extensions
Array.prototype.last = function () {
  return this[this.length - 1];
};
