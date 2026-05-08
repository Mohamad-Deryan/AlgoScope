import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import ControlPanel from "../components/ControlPanel";
import InfoSection from "../components/InfoSection";
import { API_BASE_URL } from "../config/api";

function RecursionVisualizer() {
    const [selectedFunction, setSelectedFunction] = useState("Factorial");
    const [inputValue, setInputValue] = useState("4");
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState("");

    const [isPlaying, setIsPlaying] = useState(false);

    const handleLoad = async () => {
        const n = Number(inputValue);

        if (
            inputValue.trim() === "" ||
            Number.isNaN(n) ||
            !Number.isInteger(n) ||
            n < 0
        ) {
            setError("Please enter a non-negative integer.");
            setSteps([]);
            setCurrentStep(0);
            setIsPlaying(false);
            return;
        }

        try {
            setError("");
            setIsPlaying(false);

            const response = await fetch(`${API_BASE_URL}/api/recursion/factorial`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ n }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate recursion steps.");
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

    const handlePlayPause = () => {
        if (steps.length === 0) return;
        setIsPlaying((prev) => !prev);
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

    const currentStack = steps.length > 0 ? steps[currentStep].stack : [];
    const currentExplanation =
        steps.length > 0
            ? steps[currentStep].explanation
            : "Step explanation will appear here.";

    const currentLine = steps.length > 0 ? steps[currentStep].line : 1;

    return (
        <div className="recursion-page">
            <PageHeader
                title="Recursion Visualizer"
                subtitle="Explore recursive calls step by step, follow the call stack, and understand how values return during unwind."
            />

            <div className="recursion-input-panel">
                <div className="input-group">
                    <label>Function</label>
                    <select
                        value={selectedFunction}
                        onChange={(e) => setSelectedFunction(e.target.value)}
                    >
                        <option>Factorial</option>
                    </select>
                </div>

                <div className="input-group">
                    <label>Input (n)</label>
                    <input
                        type="number"
                        placeholder="Enter n"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                </div>

                <div className="input-group load-group">
                    <label>&nbsp;</label>
                    <button onClick={handleLoad}>Load</button>
                </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="recursion-stack-panel">
                <h3>Call Stack</h3>

                {currentStack.length > 0 ? (
                    <div className="stack-list">
                        {[...currentStack].reverse().map((frame, index) => (
                            <div
                                key={index}
                                className={index === 0 ? "stack-frame active-frame" : "stack-frame"}
                            >
                                {frame.returnedValue !== null
                                    ? `${frame.label} = ${frame.returnedValue}`
                                    : frame.label}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="empty-panel-text">
                        Load a value for n to see the recursive call stack build and unwind.
                    </p>
                )}
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
                            1. factorial(n)
                        </div>
                        <div className={currentLine === 2 ? "code-line active-line" : "code-line"}>
                            2. if n === 0 return 1
                        </div>
                        <div className={currentLine === 3 ? "code-line active-line" : "code-line"}>
                            3. return n × factorial(n - 1)
                        </div>
                    </>
                }
                explanation={currentExplanation}
            />
        </div>
    );
}

export default RecursionVisualizer;