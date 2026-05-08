const algorithms = [
  {
    id: 1,
    name: "Selection Sort",
    category: "Sorting",
    description: "Visualize how the smallest element is selected and placed step by step.",
    complexity: "O(n²)",
    visualizerPath: "/sorting",
  },
  {
    id: 2,
    name: "Factorial",
    category: "Recursion",
    description: "Understand recursive calls, base cases, and return values.",
    complexity: "O(n)",
    visualizerPath: "/recursion",
  },
  {
    id: 3,
    name: "BFS",
    category: "Graphs",
    description: "Explore graph traversal using a queue and visited nodes.",
    complexity: "O(V + E)",
    visualizerPath: "/graphs",
  },
  {
    id: 4,
    name: "Dijkstra",
    category: "Graphs",
    description: "Learn how shortest paths are found using distance updates.",
    complexity: "O((V + E) log V)",
    visualizerPath: "/graphs",
  },
];

export default algorithms;