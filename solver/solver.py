from heapq import *
from flask import Flask, jsonify, request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


class Node:
    def __init__(self, state, parent, operator):
        self.parent = parent
        self.state = state
        self.operator = operator

    def copy(self):
        state = {}
        for a in self.state:
            state[a] = self.state[a]
        return state

    def __lt__(self, other):
        return 1


def heuristic(begin, final, dim):
    k = None
    for key in final:
        k = key
    if k not in begin:
        value = dim * dim / 2
    else:
        value = ((dim * dim) - begin[k]) / 2
    return value


def heuristic_new(begin):
    count = 0
    for a in begin:
        for b in a:
            if b == 0:
                count += 1
    return (16 - count) / 2


def create_road(node):
    curr_node = node
    path = []
    while curr_node is not None:
        path.append(curr_node.operator)
        curr_node = curr_node.parent
    return path[::-1]


def astar_new(initial_state, final_state):
    initial_state = [
        [2, -2, 0, 8],
        [6, -3, 4, -10],
        [0, -3, -8, 6],
        [-10, 10, 0, 0]
    ]
    initial_state_string = str(initial_state)

    final_state = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]
    result = []
    open_queue = []
    open_set = set()
    closed_set = set()
    distance = {}
    neighbours = [(-1, 0), (0, -1), (1, 0), (0, 1)]

    open_queue.append((heuristic_new(initial_state), Node(initial_state, None, None)))
    open_set.add(initial_state_string)
    distance[initial_state_string] = 0

    while len(open_queue) > 0:
        curr_hvalue, curr_node = heappop(open_queue)
        if(len(closed_set) > 500000):
            break
        if curr_node.state == final_state:
            result = create_road(curr_node)
            break
        curr_state_string = str(curr_node.state)
        if curr_state_string in closed_set:
            continue
        open_set.remove(curr_state_string)
        closed_set.add(curr_state_string)

        for x in range(len(curr_node.state)):
            for y in range(len(curr_node.state)):
                for x_n, y_n in neighbours:
                    if x + x_n < 0 or x + x_n >= len(initial_state) or \
                            y + y_n < 0 or y + y_n >= len(initial_state):
                        continue
                    if (curr_node.state[x][y] + curr_node.state[x + x_n][y + y_n]) % 2 != 0:
                        continue

                    new_state = copy_state(curr_node.state)
                    new_state[x][y] = (curr_node.state[x][y] + curr_node.state[x + x_n][y + y_n]) / 2
                    new_state[x + x_n][y + y_n] = (curr_node.state[x][y] +
                                                   curr_node.state[x + x_n][y + y_n]) / 2

                    new_state_string = str(new_state)

                    if new_state_string in closed_set:
                        continue
                    path_value = distance[curr_state_string] + 1
                    if new_state_string not in open_set:
                        heappush(open_queue,(path_value + heuristic_new(new_state),
                                             Node(new_state, curr_node, ((x, y), (x + x_n, y + y_n)))))
                        open_set.add(new_state_string)
                    elif path_value >= distance[new_state_string]:
                        continue
                    else:
                        heappush(open_queue, (path_value + heuristic_new(new_state),
                                              Node(new_state, curr_node, ((x, y), (x + x_n, y + y_n)))))
                    distance[new_state_string] = path_value

    return result


def A_star(initial_state, final_state, dim):
    result = []
    initial_state = [int(a) for a in initial_state.split(',')]
    open_queue = []
    open_set = set()
    closed_set = set()
    distance = {}
    init_state = {}
    for a in initial_state:
        if a not in init_state:
            init_state[a] = 1
        else:
            init_state[a] += 1
    initial_state_string = str([(int(k), int(init_state[k])) for k in sorted(init_state)])
    open_queue.append((heuristic(init_state, final_state, dim), Node(init_state, None, None)))
    open_set.add(initial_state_string)
    distance[initial_state_string] = 0
    while len(open_queue) > 0:
        curr_hvalue, curr_node = heappop(open_queue)
        if(len(closed_set) > 500000):
            break
        if curr_node.state == final_state:
            result = create_road(curr_node)
            break
        curr_state_string = str([(int(k), int(curr_node.state[k])) for k in sorted(curr_node.state)])
        if curr_state_string in closed_set:
            continue
        open_set.remove(curr_state_string)
        closed_set.add(curr_state_string)

        for key in curr_node.state:
            for key1 in curr_node.state:
                if key == key1:
                    continue
                if (key + key1) % 2 != 0:
                    continue
                new_state = curr_node.copy()
                new_state[key] -= 1
                new_state[key1] -= 1
                if new_state[key] == 0:
                    del new_state[key]
                if new_state[key1] == 0:
                    del new_state[key1]

                if (key + key1) / 2 not in new_state:
                    new_state[(key + key1) / 2] = 2
                else:
                    new_state[(key + key1) / 2] += 2

                new_state_string = str([(int(k), int(new_state[k])) for k in sorted(new_state)])

                if new_state_string in closed_set:
                    continue
                path_value = distance[curr_state_string] + 1
                if new_state_string not in open_set:
                    heappush(open_queue,(path_value + heuristic(new_state, final_state, dim),
                                         Node(new_state, curr_node, (key, key1))))
                    open_set.add(new_state_string)
                elif path_value >= distance[new_state_string]:
                    continue
                else:
                    heappush(open_queue, (path_value + heuristic(new_state, final_state, dim),
                                          Node(new_state, curr_node, (key, key1))))
                distance[new_state_string] = path_value

    return result


def copy_state(state):
    res = []
    for a in state:
        res.append(a[:])
    return res


def idfs(initial_state, final_state):
    initial_state = [
        [2, -2, 0, 8],
        [6, -3, 4, -10],
        [0, -3, -8, 6],
        [-10, 10, 0, 0]
    ]

    final_state = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    neighbours = [(-1, 0), (0, -1), (1, 0), (0, 1)]

    for d in range(20):
        closed_set = set()
        open_set = set()
        stack = [(0, initial_state)]
        while(len(stack) > 0):
            depth, curr = stack[-1]
            stack = stack[:-1]
            closed_set.add(str(curr))
            if curr == final_state:
                print('Got solution')
                break
            for x in range(len(initial_state)):
                for y in range(len(initial_state)):
                    for x_n, y_n in neighbours:
                        if x + x_n < 0 or x + x_n >= len(initial_state) or \
                                y + y_n < 0 or y + y_n >= len(initial_state):
                            continue
                        if (curr[x][y] + curr[x + x_n][y + y_n]) % 2 != 0:
                            continue
                        new_state = copy_state(curr)
                        new_state[x][y] = (curr[x][y] + curr[x + x_n][y + y_n]) / 2
                        new_state[x + x_n][y + y_n] = (curr[x][y] + curr[x + x_n][y + y_n]) / 2
                        if str(new_state) in closed_set:
                            continue
                        if str(new_state) not in open_set and depth <= 11:
                            stack.append((depth + 1, new_state))
                            open_set.add(str(new_state))



@app.route('/astar')
def solve():
    dim = request.args.get('dim')
    dim = int(dim)
    begin_state = request.args.get('start_state')
    final_state = {int(request.args.get('final_state')): dim * dim}
    result = A_star(begin_state, final_state, dim)[1:]
    return jsonify({'solution': result, 'length': len(result)})

print(astar_new([],[]))
#idfs([],[])