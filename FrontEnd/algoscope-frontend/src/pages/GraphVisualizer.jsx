import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import ControlPanel from "../components/ControlPanel";
import InfoSection from "../components/InfoSection";
import { API_BASE_URL } from "../config/api";
import { useLocation } from "react-router-dom";

function GraphVisualizer() {
    const graphPresets = {
        "Graph 1": {
            nodes: [
                { id: "A", x: 100, y: 80 },
                { id: "B", x: 260, y: 80 },
                { id: "C", x: 180, y: 190 },
            ],
            edges: [
                { from: "A", to: "B", weight: 2 },
                { from: "A", to: "C", weight: 4 },
                { from: "B", to: "C", weight: 1 },
            ],
            startNodes: ["A", "B", "C"],
        },
        "Graph 2": {
            nodes: [
                { id: "A", x: 80, y: 90 },
                { id: "B", x: 220, y: 60 },
                { id: "C", x: 320, y: 170 },
                { id: "D", x: 140, y: 220 },
            ],
            edges: [
                { from: "A", to: "B", weight: 3 },
                { from: "A", to: "D", weight: 5 },
                { from: "B", to: "C", weight: 2 },
                { from: "D", to: "C", weight: 1 },
            ],
            startNodes: ["A", "B", "C", "D"],
        },
    };

    const location = useLocation();

    const [selectedAlgorithm, setSelectedAlgorithm] = useState(
        location.state?.algorithm || "BFS"
    );
    useEffect(() => {
        if (location.state?.algorithm) {
            setSelectedAlgorithm(location.state.algorithm);
        }
    }, [location.state]);
    const [selectedPreset, setSelectedPreset] = useState("Graph 1");
    const [startNode, setStartNode] = useState("A");
    const [loadedGraph, setLoadedGraph] = useState(null);
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const currentPreset = graphPresets[selectedPreset];

    const handlePresetChange = (e) => {
        const newPreset = e.target.value;
        setSelectedPreset(newPreset);
        setStartNode(graphPresets[newPreset].startNodes[0]);
    };

    const handleLoad = async () => {
        const graph = graphPresets[selectedPreset];

        const preparedGraph = {
            ...graph,
            startNode,
            algorithm: selectedAlgorithm,
        };

        setLoadedGraph(preparedGraph);
        setCurrentStep(0);
        setIsPlaying(false);

        try {
            if (selectedAlgorithm === "BFS") {
                const response = await fetch(`${API_BASE_URL}/api/graph/bfs`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        graphId: selectedPreset === "Graph 1" ? "graph1" : "graph2",
                        startNode,
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to generate BFS steps.");
                }

                const data = await response.json();
                setSteps(data.steps);
            } else if (selectedAlgorithm === "DFS") {
                const response = await fetch(`${API_BASE_URL}/api/graph/dfs`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        graphId: selectedPreset === "Graph 1" ? "graph1" : "graph2",
                        startNode,
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to generate DFS steps.");
                }

                const data = await response.json();
                setSteps(data.steps);
            } else if (selectedAlgorithm === "Dijkstra") {
                const response = await fetch(`${API_BASE_URL}/api/graph/dijkstra`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        graphId: selectedPreset === "Graph 1" ? "graph1" : "graph2",
                        startNode,
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to generate Dijkstra steps.");
                }

                const data = await response.json();
                setSteps(data.steps);
            } else {
                setSteps([]);
            }
        } catch (error) {
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

    const currentStepData = steps.length > 0 ? steps[currentStep] : null;
    const visitedNodes = currentStepData ? currentStepData.visited : [];
    const queueState = currentStepData ? currentStepData.queue : [];
    const currentNode = currentStepData ? currentStepData.currentNode : null;
    const currentExplanation = currentStepData
        ? currentStepData.explanation
        : "Step explanation will appear here.";
    const currentLine = currentStepData ? currentStepData.line : 1;
    const finalizedNodes = currentStepData ? currentStepData.finalized || [] : [];
    const currentDistances = currentStepData ? currentStepData.distances || {} : {};

    return (
        <div className="graph-page">
            <PageHeader
                title="Graph Visualizer"
                subtitle="Explore graph algorithms step by step, follow node and edge states, and understand how traversal and shortest-path logic works."
            />

            <div className="graph-input-panel">
                <div className="input-group">
                    <label>Algorithm</label>
                    <select
                        value={selectedAlgorithm}
                        onChange={(e) => setSelectedAlgorithm(e.target.value)}
                    >
                        <option>BFS</option>
                        <option>DFS</option>
                        <option>Dijkstra</option>
                    </select>
                </div>

                <div className="input-group">
                    <label>Preset Graph</label>
                    <select value={selectedPreset} onChange={handlePresetChange}>
                        {Object.keys(graphPresets).map((presetName) => (
                            <option key={presetName} value={presetName}>
                                {presetName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="input-group">
                    <label>Start Node</label>
                    <select
                        value={startNode}
                        onChange={(e) => setStartNode(e.target.value)}
                    >
                        {currentPreset.startNodes.map((nodeId) => (
                            <option key={nodeId} value={nodeId}>
                                {nodeId}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="input-group load-group">
                    <label>&nbsp;</label>
                    <button onClick={handleLoad}>Load</button>
                </div>
            </div>

            <div className="graph-main-layout">
                <div className="graph-canvas-panel">
                    <h3>Graph Canvas</h3>

                    {loadedGraph ? (
                        <div className="graph-canvas">
                            <svg width="100%" height="320" viewBox="0 0 400 300">
                                {loadedGraph.edges.map((edge, index) => {
                                    const fromNode = loadedGraph.nodes.find(
                                        (node) => node.id === edge.from
                                    );
                                    const toNode = loadedGraph.nodes.find(
                                        (node) => node.id === edge.to
                                    );

                                    const midX = (fromNode.x + toNode.x) / 2;
                                    const midY = (fromNode.y + toNode.y) / 2;

                                    return (
                                        <g key={index}>
                                            <line
                                                x1={fromNode.x}
                                                y1={fromNode.y}
                                                x2={toNode.x}
                                                y2={toNode.y}
                                                className="graph-edge"
                                            />
                                            <text
                                                x={midX}
                                                y={midY - 8}
                                                textAnchor="middle"
                                                className="graph-weight"
                                            >
                                                {edge.weight}
                                            </text>
                                        </g>
                                    );
                                })}

                                {loadedGraph.nodes.map((node) => {
                                    let nodeClass = "graph-node";

                                    if (selectedAlgorithm === "BFS" && visitedNodes.includes(node.id)) {
                                        nodeClass = "graph-node visited-graph-node";
                                    }

                                    if (selectedAlgorithm === "Dijkstra" && finalizedNodes.includes(node.id)) {
                                        nodeClass = "graph-node finalized-graph-node";
                                    }

                                    if (node.id === currentNode) {
                                        nodeClass = "graph-node current-graph-node";
                                    }

                                    return (
                                        <g key={node.id}>
                                            <circle
                                                cx={node.x}
                                                cy={node.y}
                                                r="24"
                                                className={nodeClass}
                                            />
                                            <text
                                                x={node.x}
                                                y={node.y + 5}
                                                textAnchor="middle"
                                                className="graph-node-label"
                                            >
                                                {node.id}
                                            </text>
                                        </g>
                                    );
                                })}
                            </svg>
                        </div>
                    ) : (
                        <p className="empty-panel-text">
                            Load a graph to display nodes, edges, and algorithm state changes.
                        </p>
                    )}
                </div>

                {loadedGraph ? (
                    <div className="graph-state-content">
                        <div className="state-section">
                            <h4>Overview</h4>
                            <div className="state-list">
                                <div className="state-item">
                                    <span className="state-label">Algorithm</span>
                                    <span className="state-value">{loadedGraph.algorithm}</span>
                                </div>
                                <div className="state-item">
                                    <span className="state-label">Start Node</span>
                                    <span className="state-value">{loadedGraph.startNode}</span>
                                </div>
                                <div className="state-item">
                                    <span className="state-label">Current Node</span>
                                    <span className="state-value">{currentNode || "-"}</span>
                                </div>
                            </div>
                        </div>

                        {selectedAlgorithm === "BFS" || selectedAlgorithm === "DFS" ? (
                            <>
                                <div className="state-section">
                                    <h4>Visited Nodes</h4>
                                    <div className="tag-list">
                                        {visitedNodes.length > 0 ? (
                                            visitedNodes.map((nodeId) => (
                                                <span key={nodeId} className="state-tag">
                                                    {nodeId}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="empty-state">-</span>
                                        )}
                                    </div>
                                </div>

                                <div className="state-section">
                                    <h4>{selectedAlgorithm === "DFS" ? "Stack" : "Queue"}</h4>
                                    <div className="tag-list">
                                        {queueState.length > 0 ? (
                                            queueState.map((nodeId, index) => (
                                                <span key={`${nodeId}-${index}`} className="state-tag queue-tag">
                                                    {nodeId}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="empty-state">-</span>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="state-section">
                                    <h4>Finalized Nodes</h4>
                                    <div className="tag-list">
                                        {finalizedNodes.length > 0 ? (
                                            finalizedNodes.map((nodeId) => (
                                                <span key={nodeId} className="state-tag finalized-tag">
                                                    {nodeId}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="empty-state">-</span>
                                        )}
                                    </div>
                                </div>

                                <div className="state-section">
                                    <h4>Distance Table</h4>
                                    <div className="distance-list">
                                        {loadedGraph.nodes.map((node) => (
                                            <div key={node.id} className="distance-item">
                                                <span>{node.id}</span>
                                                <span>
                                                    {currentDistances[node.id] === Infinity ||
                                                        currentDistances[node.id] === 2147483647
                                                        ? "∞"
                                                        : currentDistances[node.id] ?? "∞"}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <p>Queue, visited nodes, and distance table will appear here.</p>
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
                    selectedAlgorithm === "BFS" ? (
                        <>
                            <div className={currentLine === 1 ? "code-line active-line" : "code-line"}>
                                1. Mark the start node as visited
                            </div>
                            <div className={currentLine === 2 ? "code-line active-line" : "code-line"}>
                                2. Add the start node to the queue
                            </div>
                            <div className={currentLine === 3 ? "code-line active-line" : "code-line"}>
                                3. Remove the front node from the queue
                            </div>
                            <div className={currentLine === 4 ? "code-line active-line" : "code-line"}>
                                4. Visit its unvisited neighbors
                            </div>
                            <div className={currentLine === 5 ? "code-line active-line" : "code-line"}>
                                5. Add each unvisited neighbor to the queue
                            </div>
                        </>
                    ) : selectedAlgorithm === "DFS" ? (
                        <>
                            <div className={currentLine === 2 ? "code-line active-line" : "code-line"}>
                                1. Push the start node onto the stack
                            </div>
                            <div className={currentLine === 3 ? "code-line active-line" : "code-line"}>
                                2. Pop the top node from the stack
                            </div>
                            <div className={currentLine === 4 ? "code-line active-line" : "code-line"}>
                                3. Mark the current node as visited
                            </div>
                            <div className={currentLine === 5 ? "code-line active-line" : "code-line"}>
                                4. Check each neighbor of the current node
                            </div>
                            <div className={currentLine === 6 ? "code-line active-line" : "code-line"}>
                                5. Push each unvisited neighbor onto the stack
                            </div>
                        </>
                    ) : (
                        <>
                            <div className={currentLine === 1 ? "code-line active-line" : "code-line"}>
                                1. Initialize distances and set start node to 0
                            </div>
                            <div className={currentLine === 2 ? "code-line active-line" : "code-line"}>
                                2. Choose the unvisited node with the smallest distance
                            </div>
                            <div className={currentLine === 3 ? "code-line active-line" : "code-line"}>
                                3. Check each unvisited neighbor
                            </div>
                            <div className={currentLine === 4 ? "code-line active-line" : "code-line"}>
                                4. Relax the edge if a shorter distance is found
                            </div>
                            <div className={currentLine === 5 ? "code-line active-line" : "code-line"}>
                                5. Finalize the current node
                            </div>
                        </>
                    )
                }
                explanation={currentExplanation}
            />
        </div>
    );
}

export default GraphVisualizer;