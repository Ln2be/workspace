export class TrackManager {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.state = null;
    this.grid = null;
  }

  initialize(canvas, ctx, stateManager, gridManager) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.state = stateManager;
    this.grid = gridManager;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.grid.drawGrid();
    this.drawSegments();
    this.drawStartMarker();
  }

  drawSegments() {
    const { segments, initialState } = this.state.getState();
    let currentPos = { ...initialState }; // Start from initial position

    segments.forEach((segment, index) => {
      this.ctx.beginPath();
      this.ctx.moveTo(currentPos.x, currentPos.y);
      this.applySegmentStyle(index);

      if (segment.type === "incline") {
        currentPos = this.drawIncline(segment, currentPos);
      } else if (segment.type === "arc") {
        currentPos = this.drawArc(segment, currentPos);
      }

      this.ctx.stroke();
    });
  }

  drawIncline(segment, currentPos) {
    const angleRad = currentPos.angle + (segment.angle * Math.PI) / 180;
    const dx = segment.length * Math.cos(angleRad);
    const dy = -segment.length * Math.sin(angleRad);

    this.ctx.lineTo(currentPos.x + dx, currentPos.y + dy);
    return {
      x: currentPos.x + dx,
      y: currentPos.y + dy,
      angle: angleRad,
    };
  }

  drawArc(segment, currentPos) {
    const centerAngleRad =
      currentPos.angle + (segment.centerAngle * Math.PI) / 180;
    const centerX = currentPos.x + segment.radius * Math.cos(centerAngleRad);
    const centerY = currentPos.y - segment.radius * Math.sin(centerAngleRad);

    const startAngle = Math.atan2(
      currentPos.y - centerY,
      currentPos.x - centerX
    );
    const isAbove = segment.side === "above";
    const endAngle =
      startAngle + ((segment.angle * Math.PI) / 180) * (isAbove ? 1 : -1);

    this.ctx.arc(
      centerX,
      centerY,
      segment.radius,
      startAngle,
      endAngle,
      !isAbove
    );

    return {
      x: centerX + segment.radius * Math.cos(endAngle),
      y: centerY + segment.radius * Math.sin(endAngle),
      angle: endAngle + (isAbove ? Math.PI / 2 : -Math.PI / 2),
    };
  }

  applySegmentStyle(index) {
    this.ctx.strokeStyle = `hsl(${index * 60}, 70%, 60%)`;
    this.ctx.lineWidth = 3;
    this.ctx.setLineDash(index % 2 === 0 ? [] : [5, 5]);
  }

  drawStartMarker() {
    const { initialState } = this.state.getState();

    this.ctx.beginPath();
    this.ctx.arc(initialState.x, initialState.y, 5, 0, Math.PI * 2);
    this.ctx.fillStyle = "#e74c3c";
    this.ctx.fill();
  }
}
