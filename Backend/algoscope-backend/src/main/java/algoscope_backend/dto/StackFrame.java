package algoscope_backend.dto;

public class StackFrame {
    private String label;
    private Integer returnedValue;

    public StackFrame(String label, Integer returnedValue) {
        this.label = label;
        this.returnedValue = returnedValue;
    }

    public String getLabel() {
        return label;
    }

    public Integer getReturnedValue() {
        return returnedValue;
    }
}