import { GridManager } from "./grid.js";
import { TrackManager } from "./track.js";
import { StateManager } from "./state.js";
import { UIManager } from "./ui.js";

export class App {
  constructor() {
    this.canvas = document.getElementById("trackCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.grid = new GridManager();
    this.state = new StateManager();
    this.track = new TrackManager();
    this.ui = new UIManager(this.state, this.track, {
      inclineAngle: document.getElementById("inclineAngle"),
      inclineLength: document.getElementById("inclineLength"),
      centerAngle: document.getElementById("centerAngle"),
      arcRadius: document.getElementById("arcRadius"),
      arcAngle: document.getElementById("arcAngle"),
      arcSide: document.getElementById("arcSide"),
    });
  }

  initialize() {
    // Initialize components
    this.grid.initialize(this.canvas);
    this.track.initialize(this.canvas, this.ctx, this.state, this.grid);
    this.ui.initialize();

    // Initial draw
    this.track.draw();
  }
}

// Start application
const app = new App();
app.initialize();
