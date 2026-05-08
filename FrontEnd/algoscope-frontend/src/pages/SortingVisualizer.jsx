import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import ControlPanel from "../components/ControlPanel";
import InfoSection from "../components/InfoSection";
import { API_BASE_URL } from "../config/api";

function SortingVisualizer() {
    const [input, setInput] = useState("5,2,8,1");
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);

    const [isPlaying, setIsPlaying] = useState(false);

    const [selectedPreset, setSelectedPreset] = useState("Small Example");

    const [error, setError] = useState("");

    const currentArray = steps.length > 0 ? steps[currentStep].array : [];
    const currentExplanation =
        steps.length > 0 ? steps[currentStep].explanation : "Step explanation will appear here";

    const activeIndex = steps.length > 0 ? steps[currentStep].activeIndex : -1;
    const minIndex = steps.length > 0 ? steps[currentStep].minIndex : -1;

    const currentLine = steps.length > 0 ? steps[currentStep].line : 1;

    const comparingIndex = steps.length > 0 ? steps[currentStep].comparingIndex : -1;

    const presets = {
        "Small Example": "5,2,8,1",
        "Reverse Order": "9,4,7,3,1",
        "Mixed Values": "6,3,8,2,5",
    };

    const handleLoad = async () => {
        const parts = input.split(",").map((num) => num.trim());

        if (parts.length === 0 || parts.some((part) => part === "")) {
            setError("Please enter a valid comma-separated list of numbers.");
            setSteps([]);
            setCurrentStep(0);
            setIsPlaying(false);
            return;
        }

        const arr = parts.map(Number);

        if (arr.some((num) => Number.isNaN(num))) {
            setError("Input must contain numbers only.");
            setSteps([]);
            setCurrentStep(0);
            setIsPlaying(false);
            return;
        }

        try {
            setError("");
            setIsPlaying(false);

            const response = await fetch(`${API_BASE_URL}/api/sorting/selection-sort`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ input: arr }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate sorting steps.");
            }

            const data = await response.json();

            setSteps(data.steps);
            setCurrentStep(0);
        } catch (error) {
            setError("Could not connect to the backend. Make sure Spring Boot is running.");
            setSteps([]);
            setCurrentStep(0);
            setIsPlaying(false);
        }
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleReset = () => {
        if (steps.length > 0) {
            setCurrentStep(0);
            setIsPlaying(false);
        }
    };

    useEffect(() => {
        if (!isPlaying) return;

        if (currentStep >= steps.length - 1) {
            setIsPlaying(false);
            return;
        }

        const interval = setInterval(() => {
            setCurrentStep((prevStep) => {
                if (prevStep >= steps.length - 1) {
                    clearInterval(interval);
                    setIsPlaying(false);
                    return prevStep;
                }
                return prevStep + 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying, currentStep, steps]);

    const handlePlayPause = () => {
        if (steps.length === 0) return;
        setIsPlaying((prev) => !prev);
    };
    return (
        <div className="sorting-page">
            <PageHeader
                title="Selection Sort Visualizer"
                subtitle="Explore Selection Sort step by step with animated bars, explanations, and pseudocode guidance."
            />

            <div className="sorting-input-panel">
                <div className="input-group">
                    <label>Preset</label>
                    <select
                        value={selectedPreset}
                        onChange={(e) => {
                            const chosenPreset = e.target.value;
                            setSelectedPreset(chosenPreset);
                            setInput(presets[chosenPreset]);
                        }}
                    >
                        {Object.keys(presets).map((presetName) => (
                            <option key={presetName} value={presetName}>
                                {presetName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="input-group input-group-wide">
                    <label>Custom Input</label>
                    <input
                        placeholder="Enter numbers (e.g. 5,2,8,1)"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>

                <div className="input-group load-group">
                    <label>&nbsp;</label>
                    <button onClick={handleLoad}>Load</button>
                </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="sorting-visualization">
                <div className="bars-container">
                    {currentArray.length > 0 ? (
                        <div className="bars-container">
                            {currentArray.map((value, index) => {
                                let barClass = "bar";

                                if (index === activeIndex) {
                                    barClass = "bar active-bar";
                                }

                                if (index === minIndex) {
                                    barClass = "bar min-bar";
                                }

                                if (index === comparingIndex) {
                                    barClass = "bar comparing-bar";
                                }

                                return (
                                    <div
                                        key={index}
                                        className={barClass}
                                        style={{ height: `${value * 25}px` }}
                                    >
                                        <span>{value}</span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="empty-panel-text">
                            Load an array to begin visualizing Selection Sort.
                        </p>
                    )}
                </div>
            </div>

            <ControlPanel
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onNext={handleNext}
                onPrevious={handlePrevious}
                onReset={handleReset}
                disablePlay={steps.length === 0}
                disableNext={currentStep >= steps.length - 1 || steps.length === 0}
                disablePrevious={currentStep === 0 || steps.length === 0}
                disableReset={steps.length === 0}
                currentStep={currentStep}
                totalSteps={steps.length}
            />

            <InfoSection
                pseudocodeContent={
                    <>
                        <div className={currentLine === 1 ? "code-line active-line" : "code-line"}>
                            1. Start with the unsorted array
                        </div>
                        <div className={currentLine === 2 ? "code-line active-line" : "code-line"}>
                            2. For each position i in the array
                        </div>
                        <div className={currentLine === 3 ? "code-line active-line" : "code-line"}>
                            3. Assume the minimum is at index i
                        </div>
                        <div className={currentLine === 4 ? "code-line active-line" : "code-line"}>
                            4. Scan the rest of the array for a smaller element
                        </div>
                        <div className={currentLine === 5 ? "code-line active-line" : "code-line"}>
                            5. If index i already has the minimum, keep it
                        </div>
                        <div className={currentLine === 6 ? "code-line active-line" : "code-line"}>
                            6. Otherwise, swap with the minimum element found
                        </div>
                    </>
                }
                explanation={currentExplanation}
            />
        </div>
    );
}

export default SortingVisualizer;