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

    @PostMapping("/merge-sort")
    public SortingResponse mergeSort(@RequestBody SortingRequest request) {
        List<Integer> input = request.getInput();
        List<SortingStep> steps = generateMergeSortSteps(input);

        return new SortingResponse(steps);
    }

    @PostMapping("/quick-sort")
    public SortingResponse quickSort(@RequestBody SortingRequest request) {
        List<Integer> input = request.getInput();
        List<SortingStep> steps = generateQuickSortSteps(input);

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

    private List<SortingStep> generateMergeSortSteps(List<Integer> input) {
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

        mergeSort(temp, 0, temp.size() - 1, steps);

        steps.add(new SortingStep(
                new ArrayList<>(temp),
                "Merge Sort completed. The array is now sorted.",
                -1,
                -1,
                -1,
                6
        ));

        return steps;
    }

    private void mergeSort(List<Integer> arr, int left, int right, List<SortingStep> steps) {
        if (left >= right) {
            steps.add(new SortingStep(
                    new ArrayList<>(arr),
                    "Base case reached for subarray index " + left + ".",
                    left,
                    -1,
                    -1,
                    2
            ));
            return;
        }

        int mid = (left + right) / 2;

        steps.add(new SortingStep(
                new ArrayList<>(arr),
                "Split the array from index " + left + " to " + right + " at middle index " + mid + ".",
                left,
                mid,
                right,
                3
        ));

        mergeSort(arr, left, mid, steps);
        mergeSort(arr, mid + 1, right, steps);

        merge(arr, left, mid, right, steps);
    }

    private void merge(List<Integer> arr, int left, int mid, int right, List<SortingStep> steps) {
        List<Integer> leftPart = new ArrayList<>(arr.subList(left, mid + 1));
        List<Integer> rightPart = new ArrayList<>(arr.subList(mid + 1, right + 1));

        int i = 0;
        int j = 0;
        int k = left;

        steps.add(new SortingStep(
                new ArrayList<>(arr),
                "Merge subarrays from index " + left + " to " + mid + " and " + (mid + 1) + " to " + right + ".",
                left,
                mid,
                right,
                4
        ));

        while (i < leftPart.size() && j < rightPart.size()) {
            steps.add(new SortingStep(
                    new ArrayList<>(arr),
                    "Compare " + leftPart.get(i) + " and " + rightPart.get(j) + ".",
                    k,
                    left + i,
                    mid + 1 + j,
                    5
            ));

            if (leftPart.get(i) <= rightPart.get(j)) {
                arr.set(k, leftPart.get(i));
                i++;
            } else {
                arr.set(k, rightPart.get(j));
                j++;
            }

            steps.add(new SortingStep(
                    new ArrayList<>(arr),
                    "Place the smaller value at index " + k + ".",
                    k,
                    -1,
                    -1,
                    5
            ));

            k++;
        }

        while (i < leftPart.size()) {
            arr.set(k, leftPart.get(i));

            steps.add(new SortingStep(
                    new ArrayList<>(arr),
                    "Copy remaining value " + leftPart.get(i) + " from the left subarray.",
                    k,
                    -1,
                    -1,
                    5
            ));

            i++;
            k++;
        }

        while (j < rightPart.size()) {
            arr.set(k, rightPart.get(j));

            steps.add(new SortingStep(
                    new ArrayList<>(arr),
                    "Copy remaining value " + rightPart.get(j) + " from the right subarray.",
                    k,
                    -1,
                    -1,
                    5
            ));

            j++;
            k++;
        }
    }

    private List<SortingStep> generateQuickSortSteps(List<Integer> input) {
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

        quickSort(temp, 0, temp.size() - 1, steps);

        steps.add(new SortingStep(
                new ArrayList<>(temp),
                "Quick Sort completed. The array is now sorted.",
                -1,
                -1,
                -1,
                6
        ));

        return steps;
    }

    private void quickSort(List<Integer> arr, int low, int high, List<SortingStep> steps) {
        if (low >= high) {
            if (low == high) {
                steps.add(new SortingStep(
                        new ArrayList<>(arr),
                        "Base case reached for single element at index " + low + ".",
                        low,
                        -1,
                        -1,
                        2
                ));
            }
            return;
        }

        steps.add(new SortingStep(
                new ArrayList<>(arr),
                "Choose pivot at index " + high + " with value " + arr.get(high) + ".",
                high,
                -1,
                -1,
                3
        ));

        int pivotIndex = partition(arr, low, high, steps);

        steps.add(new SortingStep(
                new ArrayList<>(arr),
                "Pivot is now placed at its correct position: index " + pivotIndex + ".",
                pivotIndex,
                -1,
                -1,
                5
        ));

        quickSort(arr, low, pivotIndex - 1, steps);
        quickSort(arr, pivotIndex + 1, high, steps);
    }

    private int partition(List<Integer> arr, int low, int high, List<SortingStep> steps) {
        int pivot = arr.get(high);
        int i = low - 1;

        for (int j = low; j < high; j++) {
            steps.add(new SortingStep(
                    new ArrayList<>(arr),
                    "Compare value " + arr.get(j) + " with pivot " + pivot + ".",
                    high,
                    i,
                    j,
                    4
            ));

            if (arr.get(j) <= pivot) {
                i++;

                int tempValue = arr.get(i);
                arr.set(i, arr.get(j));
                arr.set(j, tempValue);

                steps.add(new SortingStep(
                        new ArrayList<>(arr),
                        "Value " + arr.get(i) + " is less than or equal to pivot, so it is moved to the left partition.",
                        high,
                        i,
                        j,
                        4
                ));
            }
        }

        int tempValue = arr.get(i + 1);
        arr.set(i + 1, arr.get(high));
        arr.set(high, tempValue);

        steps.add(new SortingStep(
                new ArrayList<>(arr),
                "Swap pivot into its correct position.",
                i + 1,
                high,
                -1,
                5
        ));

        return i + 1;
    }
}