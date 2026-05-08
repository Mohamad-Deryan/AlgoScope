import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">
      <header className="home-hero">
        <h1>AlgoScope</h1>
        <h2>Interactive Algorithm Learning Platform</h2>
        <p>
          Learn algorithms step by step through visual explanations,
          pseudocode, and interactive controls.
        </p>
      </header>

      <section className="home-section">
        <h3>Explore Categories</h3>

        <div className="category-cards">
            <Link to="/library?category=Sorting" className="card">
            <h4>Sorting</h4>
            <p>Visualize sorting algorithms step by step.</p>
            </Link>

            <Link to="/library?category=Recursion" className="card">
            <h4>Recursion</h4>
            <p>Understand recursive calls and stack behavior.</p>
            </Link>

            <Link to="/library?category=Graphs" className="card">
            <h4>Graphs</h4>
            <p>Explore BFS, DFS, and shortest path algorithms.</p>
            </Link>
        </div>
        </section>

      <section className="home-section">
        <h3>How It Works</h3>
        <p>
          Choose an algorithm category, open a visualizer, enter your input,
          and move through the algorithm step by step. Follow the pseudocode
          and explanation panel to understand what happens at each stage.
        </p>
      </section>

      <footer className="home-footer">
        <p>AlgoScope © 2026</p>
      </footer>
    </div>
  );
}

export default Home;