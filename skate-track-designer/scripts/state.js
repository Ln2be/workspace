export class StateManager {
  constructor() {
    this.state = {
      segments: [],
      currentEnd: { x: 50, y: 200, angle: 0 }, // Current position
      initialState: { x: 50, y: 200, angle: 0 }, // Add this line
      canvasSize: { width: 600, height: 400 },
    };
  }

  getState() {
    return this.state;
  }

  addSegment(segment) {
    const newPosition = this.calculateNewPosition(segment);

    if (this.isPositionValid(newPosition)) {
      this.state.segments.unshift(segment);
      this.state.currentEnd = newPosition;
      return true;
    }
    return false;
  }

  calculateNewPosition(segment) {
    const current = this.state.currentEnd;

    if (segment.type === "incline") {
      const angleRad = current.angle + (segment.angle * Math.PI) / 180;
      return {
        x: current.x + segment.length * Math.cos(angleRad),
        y: current.y - segment.length * Math.sin(angleRad),
        angle: angleRad,
      };
    }

    if (segment.type === "arc") {
      const centerAngleRad =
        current.angle + (segment.centerAngle * Math.PI) / 180;
      const centerX = current.x + segment.radius * Math.cos(centerAngleRad);
      const centerY = current.y - segment.radius * Math.sin(centerAngleRad);

      const startAngle = Math.atan2(current.y - centerY, current.x - centerX);
      const isAbove = segment.side === "above";
      const endAngle =
        startAngle + ((segment.angle * Math.PI) / 180) * (isAbove ? 1 : -1);

      return {
        x: centerX + segment.radius * Math.cos(endAngle),
        y: centerY + segment.radius * Math.sin(endAngle),
        angle: endAngle + (isAbove ? Math.PI / 2 : -Math.PI / 2),
      };
    }

    return current;
  }

  isPositionValid(position) {
    return (
      position.x >= 0 &&
      position.x <= this.state.canvasSize.width &&
      position.y >= 0 &&
      position.y <= this.state.canvasSize.height
    );
  }

  clearSegments() {
    this.state.segments = [];
    this.state.currentEnd = { x: 50, y: 200, angle: 0 };
  }
}
