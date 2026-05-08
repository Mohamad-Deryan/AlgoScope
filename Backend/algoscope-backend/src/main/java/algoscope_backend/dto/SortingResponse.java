package algoscope_backend.dto;

import java.util.List;

public class SortingResponse {
    private List<SortingStep> steps;

    public SortingResponse(List<SortingStep> steps) {
        this.steps = steps;
    }

    public List<SortingStep> getSteps() {
        return steps;
    }
}