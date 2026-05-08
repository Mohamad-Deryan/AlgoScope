function ControlPanel({
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onReset,
  disablePlay,
  disableNext,
  disablePrevious,
  disableReset,
  currentStep,
  totalSteps,
}) {
  return (
    <div className="sorting-controls-panel">
      <div className="sorting-controls">
        <button onClick={onPlayPause} disabled={disablePlay}>
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button onClick={onNext} disabled={disableNext}>
          Next
        </button>

        <button onClick={onPrevious} disabled={disablePrevious}>
          Previous
        </button>

        <button onClick={onReset} disabled={disableReset}>
          Reset
        </button>
      </div>

      <div className="step-badge">
        Step {totalSteps > 0 ? currentStep + 1 : 0} / {totalSteps}
      </div>
    </div>
  );
}

export default ControlPanel;