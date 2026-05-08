package algoscope_backend.dto;

import java.util.List;
import java.util.Map;

public class GraphStep {
    private String currentNode;
    private List<String> visited;
    private List<String> queue;
    private List<String> finalized;
    private Map<String, Integer> distances;
    private String explanation;
    private int line;

    public GraphStep(
            String currentNode,
            List<String> visited,
            List<String> queue,
            List<String> finalized,
            Map<String, Integer> distances,
            String explanation,
            int line
    ) {
        this.currentNode = currentNode;
        this.visited = visited;
        this.queue = queue;
        this.finalized = finalized;
        this.distances = distances;
        this.explanation = explanation;
        this.line = line;
    }

    public String getCurrentNode() { return currentNode; }
    public List<String> getVisited() { return visited; }
    public List<String> getQueue() { return queue; }
    public List<String> getFinalized() { return finalized; }
    public Map<String, Integer> getDistances() { return distances; }
    public String getExplanation() { return explanation; }
    public int getLine() { return line; }
}