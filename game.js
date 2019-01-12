var b = jsboard.board({ attach: "game", size: "4x4" });
var x = jsboard.piece({ text: "X", fontSize: "40px", textAlign: "center" });

var dim = 4;
var clicked = null;
var step_count = 10;

function getPiece(num) {
    return jsboard.piece({ text: num.toString(), fontSize: "20px", textAlign: "center" }).clone();
}


var nums = Array(dim).fill(0).map(() => new Array(dim).fill(0));
var neighbours = [[1, 0], [0, 1], [-1, 0], [0, -1]];

for(i = 0; i < step_count; i++){
    let x = Math.floor(Math.random() * dim);
    let y = Math.floor(Math.random() * dim);
    for(i1 = 0; i1 < 20; i1++) {
        let neigh_id = Math.floor(Math.random() * 4);
        if( x + neighbours[neigh_id][0] >= 0 && x + neighbours[neigh_id][0] < 4 &&
            y + neighbours[neigh_id][1] >= 0 && y + neighbours[neigh_id][1] < 4 ) {

            let num_to_add = Math.floor(Math.random() * 10) + 1;
            nums[x][y] += num_to_add;
            nums[x + neighbours[neigh_id][0]][y + neighbours[neigh_id][1]] += (-num_to_add);
            break;
        }
    }
}

for(i = 0; i < dim; i++){
    for(i1 = 0; i1 < dim; i1++){
        b.cell([i, i1]).place(getPiece(nums[i][i1]));
    }
}

console.log(nums.toString());

//$.getJSON('https://solver-makeitequal.herokuapp.com/astar', {'start_state': nums.toString(), 'final_state': 0, 'dim': dim}).done(function(data){
//    document.getElementById('count').innerHTML += 'Minimum steps: ' + data['length'];
//    document.getElementById('solution').innerHTML += 'Solution steps: ' + data['solution'].map(a => '['+a.join(", ") +']').join(" - ");
//});


var steps = 0;

b.cell("each").on("click", function() {
    if(clicked == null) {
        clicked = b.cell(this).where();
        b.cell(this).style({ background: "lightblue" });
    } else {
        b.cell(clicked).style({ background: "lightgray" });
        let is_neighbour = false;
        for(i = 0; i < 4; i ++){
            if( clicked[0] === b.cell(this).where()[0] + neighbours[i][0] &&
                clicked[1] === b.cell(this).where()[1] + neighbours[i][1]) {
                is_neighbour = true;
            }
        }

        if (!is_neighbour) {
            clicked = null;
            return;
        }

        if ((Number(b.cell(clicked).get()) + Number(b.cell(this).get())) % 2 === 0){
            if(b.cell(clicked).get() !== b.cell(this).get()){
                steps += 1;
            }
            var num = (Number(b.cell(clicked).get()) + Number(b.cell(this).get())) / 2;
            b.cell(clicked).place(getPiece(num));
            b.cell(this).place(getPiece(num));
            document.getElementById('steps').innerHTML = 'Your steps: ' + steps;

        }
         clicked = null;

    }

});

