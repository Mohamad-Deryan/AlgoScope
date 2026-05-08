import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import algorithms from "../data/algorithms";

function Library() {
    const [searchParams] = useSearchParams();
    const categoryFromUrl = searchParams.get("category");

    const [selectedCategory, setSelectedCategory] = useState(
        categoryFromUrl || "All"
    );

    useEffect(() => {
        setSelectedCategory(categoryFromUrl || "All");
    }, [categoryFromUrl]);

    const filteredAlgorithms =
        selectedCategory === "All"
            ? algorithms
            : algorithms.filter(
                (algorithm) => algorithm.category === selectedCategory
            );

    return (
        <div className="library-page">
            <header className="library-header">
                <h1>Algorithms Library</h1>
                <p>
                    Browse algorithm categories and open visualizers to learn step by step.
                </p>
            </header>

            <section className="library-filters">
                <button
                    className={selectedCategory === "All" ? "filter-btn active-filter" : "filter-btn"}
                    onClick={() => setSelectedCategory("All")}
                >
                    All
                </button>

                <button
                    className={selectedCategory === "Sorting" ? "filter-btn active-filter" : "filter-btn"}
                    onClick={() => setSelectedCategory("Sorting")}
                >
                    Sorting
                </button>

                <button
                    className={selectedCategory === "Recursion" ? "filter-btn active-filter" : "filter-btn"}
                    onClick={() => setSelectedCategory("Recursion")}
                >
                    Recursion
                </button>

                <button
                    className={selectedCategory === "Graphs" ? "filter-btn active-filter" : "filter-btn"}
                    onClick={() => setSelectedCategory("Graphs")}
                >
                    Graphs
                </button>
            </section>

            <section className="library-grid">
                {filteredAlgorithms.map((algorithm) => (
                    <div className="algorithm-card" key={algorithm.id}>
                        <h3>{algorithm.name}</h3>
                        <p>{algorithm.description}</p>
                        <p>
                            <strong>Complexity:</strong> {algorithm.complexity}
                        </p>
                        <div className="algorithm-card-actions">
                            <Link
                                to={algorithm.visualizerPath}
                                state={{ algorithm: algorithm.name }}
                            >
                                <button>Open Visualizer</button>
                            </Link>

                            <Link to={`/quiz?algorithm=${encodeURIComponent(algorithm.name)}`}>
                                <button>Quiz</button>
                            </Link>
                        </div>
                    </div>
                ))}
            </section>

            <div className="library-back">
                <Link to="/">
                    <button>Back to Home</button>
                </Link>
            </div>
        </div>
    );
}

export default Library;