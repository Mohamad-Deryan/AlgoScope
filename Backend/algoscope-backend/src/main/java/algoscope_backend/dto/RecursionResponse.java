package algoscope_backend.dto;

import java.util.List;

public class RecursionResponse {
    private List<RecursionStep> steps;

    public RecursionResponse(List<RecursionStep> steps) {
        this.steps = steps;
    }

    public List<RecursionStep> getSteps() {
        return steps;
    }
}