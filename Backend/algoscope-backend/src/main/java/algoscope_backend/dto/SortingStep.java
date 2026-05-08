package algoscope_backend.dto;

import java.util.List;

public class SortingStep {
    private List<Integer> array;
    private String explanation;
    private int activeIndex;
    private int minIndex;
    private int comparingIndex;
    private int line;

    public SortingStep(
            List<Integer> array,
            String explanation,
            int activeIndex,
            int minIndex,
            int comparingIndex,
            int line
    ) {
        this.array = array;
        this.explanation = explanation;
        this.activeIndex = activeIndex;
        this.minIndex = minIndex;
        this.comparingIndex = comparingIndex;
        this.line = line;
    }

    public List<Integer> getArray() {
        return array;
    }

    public String getExplanation() {
        return explanation;
    }

    public int getActiveIndex() {
        return activeIndex;
    }

    public int getMinIndex() {
        return minIndex;
    }

    public int getComparingIndex() {
        return comparingIndex;
    }

    public int getLine() {
        return line;
    }
}