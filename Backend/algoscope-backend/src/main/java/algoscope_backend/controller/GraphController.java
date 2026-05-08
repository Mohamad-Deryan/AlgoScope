package algoscope_backend.controller;

import algoscope_backend.dto.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/graph")
@CrossOrigin(origins = "http://localhost:5173")
public class GraphController {

    @PostMapping("/bfs")
    public GraphResponse bfs(@RequestBody GraphRequest request) {
        Map<String, List<String>> graph = getGraph(request.getGraphId());
        List<GraphStep> steps = generateBfsSteps(graph, request.getStartNode());
        return new GraphResponse(steps);
    }

    @PostMapping("/dijkstra")
    public GraphResponse dijkstra(@RequestBody GraphRequest request) {
        WeightedGraph graph = getWeightedGraph(request.getGraphId());
        List<GraphStep> steps = generateDijkstraSteps(graph, request.getStartNode());
        return new GraphResponse(steps);
    }

    private static class WeightedEdge {
        String to;
        int weight;

        WeightedEdge(String to, int weight) {
            this.to = to;
            this.weight = weight;
        }
    }

    private static class WeightedGraph {
        Map<String, List<WeightedEdge>> adjacency = new LinkedHashMap<>();
    }

    private WeightedGraph getWeightedGraph(String graphId) {
        WeightedGraph graph = new WeightedGraph();

        if ("graph2".equals(graphId)) {
            graph.adjacency.put("A", Arrays.asList(
                    new WeightedEdge("B", 3),
                    new WeightedEdge("D", 5)
            ));
            graph.adjacency.put("B", Arrays.asList(
                    new WeightedEdge("A", 3),
                    new WeightedEdge("C", 2)
            ));
            graph.adjacency.put("C", Arrays.asList(
                    new WeightedEdge("B", 2),
                    new WeightedEdge("D", 1)
            ));
            graph.adjacency.put("D", Arrays.asList(
                    new WeightedEdge("A", 5),
                    new WeightedEdge("C", 1)
            ));
        } else {
            graph.adjacency.put("A", Arrays.asList(
                    new WeightedEdge("B", 2),
                    new WeightedEdge("C", 4)
            ));
            graph.adjacency.put("B", Arrays.asList(
                    new WeightedEdge("A", 2),
                    new WeightedEdge("C", 1)
            ));
            graph.adjacency.put("C", Arrays.asList(
                    new WeightedEdge("A", 4),
                    new WeightedEdge("B", 1)
            ));
        }

        return graph;
    }

    private Map<String, List<String>> getGraph(String graphId) {
        Map<String, List<String>> graph = new LinkedHashMap<>();

        if ("graph2".equals(graphId)) {
            graph.put("A", Arrays.asList("B", "D"));
            graph.put("B", Arrays.asList("A", "C"));
            graph.put("C", Arrays.asList("B", "D"));
            graph.put("D", Arrays.asList("A", "C"));
        } else {
            graph.put("A", Arrays.asList("B", "C"));
            graph.put("B", Arrays.asList("A", "C"));
            graph.put("C", Arrays.asList("A", "B"));
        }

        return graph;
    }

    private List<GraphStep> generateBfsSteps(Map<String, List<String>> graph, String start) {
        List<GraphStep> steps = new ArrayList<>();
        Set<String> visited = new LinkedHashSet<>();
        Queue<String> queue = new LinkedList<>();

        queue.add(start);

        steps.add(new GraphStep(
                null,
                new ArrayList<>(visited),
                new ArrayList<>(queue),
                new ArrayList<>(),
                new HashMap<>(),
                "Initialize queue with start node " + start + ".",
                2
        ));

        while (!queue.isEmpty()) {
            String current = queue.poll();

            if (!visited.contains(current)) {
                visited.add(current);

                steps.add(new GraphStep(
                        current,
                        new ArrayList<>(visited),
                        new ArrayList<>(queue),
                        new ArrayList<>(),
                        new HashMap<>(),
                        "Visit node " + current + ".",
                        3
                ));

                for (String neighbor : graph.get(current)) {
                    steps.add(new GraphStep(
                            current,
                            new ArrayList<>(visited),
                            new ArrayList<>(queue),
                            new ArrayList<>(),
                            new HashMap<>(),
                            "Check neighbor " + neighbor + " of node " + current + ".",
                            4
                    ));


                    if (!visited.contains(neighbor) && !queue.contains(neighbor)) {
                        queue.add(neighbor);

                        steps.add(new GraphStep(
                                current,
                                new ArrayList<>(visited),
                                new ArrayList<>(queue),
                                new ArrayList<>(),
                                new HashMap<>(),
                                "Add neighbor " + neighbor + " to the queue.",
                                5
                        ));
                    }
                }
            }
        }

        return steps;
    }

    private List<GraphStep> generateDijkstraSteps(WeightedGraph graph, String startNode) {
        List<GraphStep> steps = new ArrayList<>();
        Map<String, Integer> distances = new LinkedHashMap<>();
        Set<String> finalized = new LinkedHashSet<>();
        Set<String> unvisited = new LinkedHashSet<>();

        for (String node : graph.adjacency.keySet()) {
            distances.put(node, Integer.MAX_VALUE);
            unvisited.add(node);
        }

        distances.put(startNode, 0);

        steps.add(new GraphStep(
                null,
                new ArrayList<>(),
                new ArrayList<>(),
                new ArrayList<>(finalized),
                new LinkedHashMap<>(distances),
                "Initialize Dijkstra with start node " + startNode + ". Set its distance to 0 and all others to ∞.",
                1
        ));

        while (!unvisited.isEmpty()) {
            String current = null;
            int smallestDistance = Integer.MAX_VALUE;

            for (String node : unvisited) {
                if (distances.get(node) < smallestDistance) {
                    smallestDistance = distances.get(node);
                    current = node;
                }
            }

            if (current == null || distances.get(current) == Integer.MAX_VALUE) {
                break;
            }

            steps.add(new GraphStep(
                    current,
                    new ArrayList<>(),
                    new ArrayList<>(),
                    new ArrayList<>(finalized),
                    new LinkedHashMap<>(distances),
                    "Choose the unvisited node with the smallest tentative distance: " + current + ".",
                    2
            ));

            for (WeightedEdge edge : graph.adjacency.get(current)) {
                if (!unvisited.contains(edge.to)) {
                    continue;
                }

                steps.add(new GraphStep(
                        current,
                        new ArrayList<>(),
                        new ArrayList<>(),
                        new ArrayList<>(finalized),
                        new LinkedHashMap<>(distances),
                        "Check edge " + current + " → " + edge.to + " with weight " + edge.weight + ".",
                        3
                ));

                int newDistance = distances.get(current) + edge.weight;

                if (newDistance < distances.get(edge.to)) {
                    distances.put(edge.to, newDistance);

                    steps.add(new GraphStep(
                            current,
                            new ArrayList<>(),
                            new ArrayList<>(),
                            new ArrayList<>(finalized),
                            new LinkedHashMap<>(distances),
                            "Update distance of " + edge.to + " to " + newDistance + ".",
                            4
                    ));
                }
            }

            finalized.add(current);
            unvisited.remove(current);

            steps.add(new GraphStep(
                    current,
                    new ArrayList<>(),
                    new ArrayList<>(),
                    new ArrayList<>(finalized),
                    new LinkedHashMap<>(distances),
                    "Finalize node " + current + ". Its shortest distance is now fixed.",
                    5
            ));
        }

        return steps;
    }
}