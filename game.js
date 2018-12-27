var b = jsboard.board({ attach: "game", size: "4x4" });
var x = jsboard.piece({ text: "X", fontSize: "40px", textAlign: "center" });

var clicked = null;

function getPiece(num) {
    return jsboard.piece({ text: num.toString(), fontSize: "20px", textAlign: "center" }).clone();
}

var nums = Array(16).fill(1);

win = Math.floor((Math.random() * 8) + 2);
sum = (win * 16) - 16;
document.getElementById('win').innerHTML += win;

while (sum != 0) {
    id = Math.floor(Math.random() * 16);
    nums[id]++;
    sum--;
}

console.log(nums);

for(i = 0; i < 4; i++){
    for(i1 = 0; i1 < 4; i1++){
        b.cell([i, i1]).place(getPiece(nums[i * 4 + i1]));
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

