import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import PageHeader from "../components/PageHeader";

function QuizPage() {
    const quizData = {
        "Selection Sort": [
            {
                question: "What does Selection Sort do in each pass?",
                options: [
                    "Swaps every pair of adjacent elements",
                    "Finds the minimum element and places it in the correct position",
                    "Divides the array into halves",
                    "Uses a queue to sort elements",
                ],
                correctAnswer:
                    "Finds the minimum element and places it in the correct position",
            },
            {
                question: "What is the time complexity of Selection Sort?",
                options: ["O(n)", "O(log n)", "O(n²)", "O(n log n)"],
                correctAnswer: "O(n²)",
            },
        ],
        Factorial: [
            {
                question: "What is the base case for factorial?",
                options: [
                    "n === 1 returns 0",
                    "n === 0 returns 1",
                    "n === 0 returns 0",
                    "n === 1 returns n",
                ],
                correctAnswer: "n === 0 returns 1",
            },
            {
                question: "What does factorial(4) equal?",
                options: ["24", "16", "12", "20"],
                correctAnswer: "24",
            },
        ],
        BFS: [
            {
                question: "Which data structure is typically used in BFS?",
                options: ["Stack", "Queue", "Heap", "Tree"],
                correctAnswer: "Queue",
            },
            {
                question: "What does BFS explore first?",
                options: [
                    "Deepest nodes first",
                    "Random neighbors",
                    "Nearest level of neighbors first",
                    "Only weighted edges",
                ],
                correctAnswer: "Nearest level of neighbors first",
            },
        ],
        Dijkstra: [
            {
                question: "What does Dijkstra’s algorithm compute?",
                options: [
                    "Minimum spanning tree",
                    "Shortest paths from one start node",
                    "Depth-first traversal",
                    "Cycle detection only",
                ],
                correctAnswer: "Shortest paths from one start node",
            },
            {
                question: "What value is assigned to the start node initially in Dijkstra?",
                options: ["∞", "1", "0", "-1"],
                correctAnswer: "0",
            },
        ],

        "DFS": [
            {
                question: "Which data structure is commonly used to implement DFS iteratively?",
                options: ["Queue", "Stack", "Heap", "Priority Queue"],
                correctAnswer: "Stack",
            },
            {
                question: "What does DFS explore first?",
                options: [
                    "All nearest neighbors first",
                    "The shortest path first",
                    "As deep as possible before backtracking",
                    "Only weighted edges",
                ],
                correctAnswer: "As deep as possible before backtracking",
            },
        ],
        "Merge Sort": [
            {
                question: "Which strategy does Merge Sort use?",
                options: [
                    "Greedy approach",
                    "Divide and conquer",
                    "Breadth-first traversal",
                    "Dynamic programming only",
                ],
                correctAnswer: "Divide and conquer",
            },
            {
                question: "What is the time complexity of Merge Sort?",
                options: ["O(n)", "O(n²)", "O(log n)", "O(n log n)"],
                correctAnswer: "O(n log n)",
            },
        ],
        "Quick Sort": [
            {
                question: "What is the main idea of Quick Sort?",
                options: [
                    "Using a queue to visit elements",
                    "Choosing a pivot and partitioning the array",
                    "Splitting the array and merging it",
                    "Counting frequencies of elements",
                ],
                correctAnswer: "Choosing a pivot and partitioning the array",
            },
            {
                question: "What is the worst-case time complexity of Quick Sort?",
                options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
                correctAnswer: "O(n²)",
            },
        ],
    };

    const [searchParams] = useSearchParams();
    const algorithmFromUrl = searchParams.get("algorithm");
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(
        quizData[algorithmFromUrl] ? algorithmFromUrl : "Selection Sort"
    );
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState("");
    const [score, setScore] = useState(0);
    const [hasAnswered, setHasAnswered] = useState(false);

    const currentQuestions = quizData[selectedAlgorithm];
    const currentQuestion = currentQuestions[currentQuestionIndex];

    const handleAlgorithmChange = (e) => {
        setSelectedAlgorithm(e.target.value);
        setCurrentQuestionIndex(0);
        setSelectedOption("");
        setScore(0);
        setHasAnswered(false);
    };

    const handleOptionClick = (option) => {
        if (hasAnswered) return;

        setSelectedOption(option);
        setHasAnswered(true);

        if (option === currentQuestion.correctAnswer) {
            setScore((prev) => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < currentQuestions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedOption("");
            setHasAnswered(false);
        }
    };

    const getOptionClass = (option) => {
        if (!hasAnswered) return "quiz-option";

        if (option === currentQuestion.correctAnswer) {
            return "quiz-option correct-option";
        }

        if (option === selectedOption) {
            return "quiz-option wrong-option";
        }

        return "quiz-option";
    };

    return (
        <div className="quiz-page">
            <PageHeader
                title="Quiz Page"
                subtitle="Test your understanding of algorithms with short multiple-choice questions."
            />

            <div className="quiz-top-panel">
                <div className="input-group">
                    <label>Algorithm</label>
                    <select value={selectedAlgorithm} onChange={handleAlgorithmChange}>
                        <option>Selection Sort</option>
                        <option>Merge Sort</option>
                        <option>Quick Sort</option>
                        <option>Factorial</option>
                        <option>BFS</option>
                        <option>DFS</option>
                        <option>Dijkstra</option>
                    </select>
                </div>

                <div className="score-box">
                    <span>Score</span>
                    <strong>{score} / {currentQuestions.length}</strong>
                </div>
            </div>

            <div className="quiz-card">
                <h3>
                    Question {currentQuestionIndex + 1} of {currentQuestions.length}
                </h3>
                <p>{currentQuestion.question}</p>

                <div className="quiz-options">
                    {currentQuestion.options.map((option) => (
                        <button
                            key={option}
                            className={getOptionClass(option)}
                            onClick={() => handleOptionClick(option)}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                <div className="quiz-actions">
                    <button
                        onClick={handleNextQuestion}
                        disabled={!hasAnswered || currentQuestionIndex === currentQuestions.length - 1}
                    >
                        Next Question
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QuizPage;