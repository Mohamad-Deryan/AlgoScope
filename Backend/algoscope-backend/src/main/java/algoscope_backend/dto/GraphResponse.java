package algoscope_backend.dto;

import java.util.List;

public class GraphResponse {
    private List<GraphStep> steps;

    public GraphResponse(List<GraphStep> steps) {
        this.steps = steps;
    }

    public List<GraphStep> getSteps() {
        return steps;
    }
}