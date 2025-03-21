export class UIManager {
  constructor(stateManager, trackManager, controls) {
    this.state = stateManager;
    this.track = trackManager;
    this.controls = controls;
  }

  initialize() {
    this.initializeInputs();
    this.initializeEventListeners();
    this.updateStatus();
  }

  initializeInputs() {
    document.querySelectorAll('input[type="range"]').forEach((input) => {
      this.updateInputValueDisplay(input.id, input.value);
    });
  }

  initializeEventListeners() {
    document
      .getElementById("addIncline")
      .addEventListener("change", () => this.toggleControls("incline"));
    document
      .getElementById("addArc")
      .addEventListener("change", () => this.toggleControls("arc"));

    // Input listeners
    Object.values(this.controls).forEach((control) => {
      control.addEventListener("input", (e) => {
        this.updateInputValueDisplay(e.target.id, e.target.value);
        this.track.draw();
      });
    });

    // Button listeners
    document
      .getElementById("addSegmentBtn")
      .addEventListener("click", () => this.handleAddSegment());
    document
      .getElementById("clearTrackBtn")
      .addEventListener("click", () => this.handleClearTrack());
    document
      .getElementById("exportPngBtn")
      .addEventListener("click", () => this.handleExport());
  }

  toggleControls(segmentType) {
    const isIncline = segmentType === "incline";

    Object.keys(this.controls).forEach((key) => {
      this.controls[key].disabled = key.startsWith("arc")
        ? isIncline
        : !isIncline;
    });
  }

  handleAddSegment() {
    const segmentType = document.querySelector(
      'input[name="segmentType"]:checked'
    )?.value;
    if (!segmentType) return alert("Please select a segment type first!");

    try {
      const segment = this.getCurrentSegmentConfig(segmentType);
      if (this.state.addSegment(segment)) {
        this.track.draw();
        this.updateStatus();
      } else {
        alert("Cannot add segment - position would be outside canvas bounds!");
      }
    } catch (error) {
      console.error("Error adding segment:", error);
      alert("Error creating segment. Check console for details.");
    }
  }

  getCurrentSegmentConfig(type) {
    return {
      type,
      ...(type === "incline"
        ? {
            angle: parseInt(this.controls.inclineAngle.value),
            length: parseInt(this.controls.inclineLength.value),
          }
        : {
            centerAngle: parseInt(this.controls.centerAngle.value),
            radius: parseInt(this.controls.arcRadius.value),
            angle: parseInt(this.controls.arcAngle.value),
            side: this.controls.arcSide.value,
          }),
    };
  }

  updateInputValueDisplay(inputId, value) {
    const suffix = inputId.includes("Angle") ? "°" : "px";
    document.getElementById(
      `${inputId}Value`
    ).textContent = `${value}${suffix}`;
  }

  handleClearTrack() {
    this.state.clearSegments();
    this.track.draw();
    this.updateStatus();
  }

  handleExport() {
    const link = document.createElement("a");
    link.download = "skate-track.png";
    link.href = this.track.canvas.toDataURL();
    link.click();
  }

  updateStatus() {
    const { currentEnd, segments } = this.state.getState();
    document.getElementById("segmentCount").textContent = segments.length;
    document.getElementById("currentX").textContent = Math.round(currentEnd.x);
    document.getElementById("currentY").textContent = Math.round(currentEnd.y);
    document.getElementById("currentAngle").textContent = Math.round(
      ((currentEnd.angle * 180) / Math.PI) % 360
    );
  }
}
