export class GridManager {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.GRID_SIZE = 50;
  }

  initialize(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext("2d");
  }

  drawGrid() {
    this.ctx.save();
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    this.ctx.lineWidth = 0.5;

    // Vertical lines
    for (let x = 0; x <= this.canvas.width; x += this.GRID_SIZE) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= this.canvas.height; y += this.GRID_SIZE) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }
}
