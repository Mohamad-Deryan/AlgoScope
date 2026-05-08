package algoscope_backend.dto;

import java.util.List;

public class RecursionStep {
    private List<StackFrame> stack;
    private String explanation;
    private int line;

    public RecursionStep(List<StackFrame> stack, String explanation, int line) {
        this.stack = stack;
        this.explanation = explanation;
        this.line = line;
    }

    public List<StackFrame> getStack() {
        return stack;
    }

    public String getExplanation() {
        return explanation;
    }

    public int getLine() {
        return line;
    }
}