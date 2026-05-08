import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Library from "./pages/Library";
import SortingVisualizer from "./pages/SortingVisualizer";
import RecursionVisualizer from "./pages/RecursionVisualizer";
import GraphVisualizer from "./pages/GraphVisualizer";
import QuizPage from "./pages/QuizPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/sorting" element={<SortingVisualizer />} />
        <Route path="/recursion" element={<RecursionVisualizer />} />
        <Route path="/graphs" element={<GraphVisualizer />} />
        <Route path="/quiz" element={<QuizPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;