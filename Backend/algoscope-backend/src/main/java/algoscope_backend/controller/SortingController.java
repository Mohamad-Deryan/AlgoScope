package algoscope_backend.controller;

import algoscope_backend.dto.SortingRequest;
import algoscope_backend.dto.SortingResponse;
import algoscope_backend.dto.SortingStep;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/sorting")
@CrossOrigin(origins = "http://localhost:5173")
public class SortingController {

    @PostMapping("/selection-sort")
    public SortingResponse selectionSort(@RequestBody SortingRequest request) {
        List<Integer> input = request.getInput();
        List<SortingStep> steps = generateSelectionSortSteps(input);

        return new SortingResponse(steps);
    }

    private List<SortingStep> generateSelectionSortSteps(List<Integer> input) {
        List<SortingStep> steps = new ArrayList<>();
        List<Integer> temp = new ArrayList<>(input);

        steps.add(new SortingStep(
                new ArrayList<>(temp),
                "Initial array loaded.",
                -1,
                -1,
                -1,
                1
        ));

        for (int i = 0; i < temp.size(); i++) {
            int minIndex = i;

            steps.add(new SortingStep(
                    new ArrayList<>(temp),
                    "Starting pass " + (i + 1) + ".",
                    i,
                    -1,
                    -1,
                    2
            ));

            steps.add(new SortingStep(
                    new ArrayList<>(temp),
                    "Assume the minimum is at index " + i + " with value " + temp.get(i) + ".",
                    i,
                    i,
                    -1,
                    3
            ));

            for (int j = i + 1; j < temp.size(); j++) {
                steps.add(new SortingStep(
                        new ArrayList<>(temp),
                        "Comparing current minimum " + temp.get(minIndex)
                                + " with value " + temp.get(j)
                                + " at index " + j + ".",
                        i,
                        minIndex,
                        j,
                        4
                ));

                if (temp.get(j) < temp.get(minIndex)) {
                    minIndex = j;

                    steps.add(new SortingStep(
                            new ArrayList<>(temp),
                            "New minimum found at index " + j + " with value " + temp.get(j) + ".",
                            i,
                            minIndex,
                            j,
                            4
                    ));
                }
            }

            if (minIndex != i) {
                int tempValue = temp.get(i);
                temp.set(i, temp.get(minIndex));
                temp.set(minIndex, tempValue);

                steps.add(new SortingStep(
                        new ArrayList<>(temp),
                        "Swapped value at index " + i
                                + " with the minimum value found at index " + minIndex + ".",
                        i,
                        minIndex,
                        -1,
                        6
                ));
            } else {
                steps.add(new SortingStep(
                        new ArrayList<>(temp),
                        "No swap needed because index " + i + " already contains the minimum value.",
                        i,
                        minIndex,
                        -1,
                        5
                ));
            }
        }

        return steps;
    }
}