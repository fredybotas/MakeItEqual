var b = jsboard.board({ attach: "game", size: "5x5" });
var x = jsboard.piece({ text: "X", fontSize: "40px", textAlign: "center" });

var clicked = null;

function getPiece(num) {
    return jsboard.piece({ text: num.toString(), fontSize: "20px", textAlign: "center" }).clone();
}

var nums = Array(25).fill(1);

win = Math.floor((Math.random() * 10) + 5);
sum = (win * 25) - 25;
document.getElementById('win').innerHTML += win;

while (sum != 0) {
    id = Math.floor(Math.random() * 25);
    nums[id]++;
    sum--;
}

console.log(nums);

for(i = 0; i < 5; i++){
    for(i1 = 0; i1 < 5; i1++){
        b.cell([i, i1]).place(getPiece(nums[i * 5 + i1]));
    }
}

b.cell("each").on("click", function() {
    if(clicked == null) {
        clicked = b.cell(this).where();
        b.cell(this).style({ background: "lightblue" });
    } else {
        b.cell(clicked).style({ background: "lightgray" });
        if ((Number(b.cell(clicked).get()) + Number(b.cell(this).get())) % 2 === 0){
            var num = (Number(b.cell(clicked).get()) + Number(b.cell(this).get())) / 2;
            b.cell(clicked).place(getPiece(num));
            b.cell(this).place(getPiece(num));
        }
        clicked = null;
    }

});

