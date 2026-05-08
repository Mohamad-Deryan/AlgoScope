package algoscope_backend.controller;

import algoscope_backend.dto.*;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/recursion")
@CrossOrigin(origins = "http://localhost:5173")
public class RecursionController {

    @PostMapping("/factorial")
    public RecursionResponse factorial(@RequestBody FactorialRequest request) {
        List<RecursionStep> steps = generateFactorialSteps(request.getN());
        return new RecursionResponse(steps);
    }

    private List<RecursionStep> generateFactorialSteps(int n) {
        List<RecursionStep> steps = new ArrayList<>();
        buildSteps(n, new ArrayList<>(), steps);
        return steps;
    }

    private int buildSteps(int value, List<StackFrame> stack, List<RecursionStep> steps) {
        List<StackFrame> newStack = new ArrayList<>(stack);
        newStack.add(new StackFrame("factorial(" + value + ")", null));

        steps.add(new RecursionStep(
                copyStack(newStack),
                "Call factorial(" + value + ").",
                1
        ));

        if (value == 0) {
            List<StackFrame> baseStack = copyStack(newStack);
            int lastIndex = baseStack.size() - 1;

            StackFrame lastFrame = baseStack.get(lastIndex);
            baseStack.set(lastIndex, new StackFrame(lastFrame.getLabel(), 1));

            steps.add(new RecursionStep(
                    baseStack,
                    "Base case reached: factorial(0) returns 1.",
                    2
            ));

            return 1;
        }

        int resultFromBelow = buildSteps(value - 1, newStack, steps);
        int result = value * resultFromBelow;

        List<StackFrame> returnedStack = copyStack(newStack);
        int lastIndex = returnedStack.size() - 1;

        StackFrame lastFrame = returnedStack.get(lastIndex);
        returnedStack.set(lastIndex, new StackFrame(lastFrame.getLabel(), result));

        steps.add(new RecursionStep(
                returnedStack,
                "Return to factorial(" + value + "), which evaluates to " + result + ".",
                3
        ));

        return result;
    }

    private List<StackFrame> copyStack(List<StackFrame> stack) {
        List<StackFrame> copy = new ArrayList<>();

        for (StackFrame frame : stack) {
            copy.add(new StackFrame(frame.getLabel(), frame.getReturnedValue()));
        }

        return copy;
    }
}