package algoscope_backend.dto;

import java.util.List;

public class SortingRequest {
    private List<Integer> input;

    public List<Integer> getInput() {
        return input;
    }

    public void setInput(List<Integer> input) {
        this.input = input;
    }
}