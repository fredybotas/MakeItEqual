var b = jsboard.board({ attach: "game", size: "4x4" });
var x = jsboard.piece({ text: "X", fontSize: "40px", textAlign: "center" });

var dim = 4;
var clicked = null;

function getPiece(num) {
    return jsboard.piece({ text: num.toString(), fontSize: "20px", textAlign: "center" }).clone();
}


var nums = Array(dim * dim).fill(1);

//win = Math.floor((Math.random() * 15) + 5);
win = 15;

sum = (win * dim * dim) - (dim * dim);
document.getElementById('win').innerHTML += 'Number to get: 0';

while (sum != 0) {
    id = Math.floor(Math.random() * dim * dim);
    nums[id]++;
    sum--;
}

for(i = 0; i < dim; i++){
    for(i1 = 0; i1 < dim; i1++){
        nums[i * dim + i1] -= win;
        b.cell([i, i1]).place(getPiece(nums[i * dim + i1]));
    }
}

console.log(nums.toString());

$.getJSON('https://solver-makeitequal.herokuapp.com/astar', {'start_state': nums.toString(), 'final_state': 0, 'dim': dim}).done(function(data){
    document.getElementById('count').innerHTML += 'Minimum steps: ' + data['length'];
    document.getElementById('solution').innerHTML += 'Solution steps: ' + data['solution'].map(a => '['+a.join(", ") +']').join(" - ");
});


var steps = 0;

b.cell("each").on("click", function() {
    if(clicked == null) {
        clicked = b.cell(this).where();
        b.cell(this).style({ background: "lightblue" });
    } else {
        b.cell(clicked).style({ background: "lightgray" });
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

