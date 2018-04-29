// *****************************************
// Things that need working on:
// Handicap is not set up.
// Yard/par not set up for in/out totals
// Message to the player stating if above, below or at par
// ******************************************

let selCourse;
let selTee;
let allCourses;
let numPlayers = 4;
let right = $(".right");
let left = $(".left");

loadDoc();

function loadDoc() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            allCourses = JSON.parse(this.responseText);
            console.log(allCourses);
            for(let i = 0; i < allCourses.courses.length; i++) {
                $(".courseDropDown").append("<option value='"+ allCourses.courses[i].id +"'>" + allCourses.courses[i].name + "</option>");
            }
        }
    };
    xhttp.open("GET", "https://uxcobra.com/golfapi/courses.txt", true);
    xhttp.send();
}

function getCourse(courseId) {
    console.log("you chose a course");
    $(".chooseTee").text('');
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            selCourse = JSON.parse(this.responseText);
            console.log(selCourse);
            let holeonetees = selCourse.data.holes[0].teeBoxes;
            for(let i = 0; i < holeonetees.length; i++){
                $(".teeDropDown").append("<option value='"+ i +"'>"+ holeonetees[i].teeType +"</option>");
            }
        }
    };
    xhttp.open("GET", "https://uxcobra.com/golfapi/course"+ courseId +".txt", true);
    xhttp.send();
}

let frontTotalYds = 0;
let frontTotalPar = 0;
let backTotalYds = 0;
let backTotalPar = 0;
let totalYds = 0;
let totalPar = 0;
let totalScore = 0;

function setTee(teeindex){
    $(right).text('');
    $("#totalPar").text('');
    $("#totalYds").text('');
    $(right).append(
        "<div class='column' id='colLabel'>"+
        "<div class='colHead box'>" + "Hole #" + "</div>"+
        "<div class='yds box'>" + "Yards" + "</div>"+
        "<div class='par box'>" + "Par" + "</div>"+
        "<div class='hcp box'>" + "Hcp" + "</div>"+
        "</div>"
    );

    selTee = teeindex;

    let mycourse = selCourse.data.holes;
    for(let i = 0; i < mycourse.length; i++){
        $(right).append(
            "<div class='column' id='c"+ i +"'>"+
            "<div class='colHead box'>"+ (i+1) + "</div>"+
            "<div class='yds box'>"+ mycourse[i].teeBoxes[teeindex].yards +"</div>"+
            "<div class='par box'>"+ mycourse[i].teeBoxes[teeindex].par +"</div>"+
            "<div class='hcp box'>"+ mycourse[i].teeBoxes[teeindex].hcp +"</div>"+
            "</div>");


        totalPar += parseInt(mycourse[i].teeBoxes[teeindex].par);
        console.log(totalPar);
        totalYds += parseInt(mycourse[i].teeBoxes[teeindex].yards);
        //frontTotalYds += parseInt(mycourse[i].teeBoxes[teeindex].yards);
        }

        $(right).append(
            "<div class='column' id='inCol'>"+
            "<div class='colHead box'>In</div>"+
            "<div class='yds box' id='backNineTotalYds'></div>"+
            "<div class='par box' id='backNineTotalPar'></div>"+
            "<div class='hcp box'>" + '' +"</div>"+
            "</div>"+
            "<div class='column' id='totalCol'>"+
            "<div class='colHead box'>" + "Total" + "</div>"+
            "<div class='yds box' id='totalYds'></div>"+
            "<div class='par box' id='totalPar'></div>"+
            "<div class='hcp box'>" + '' +"</div>"+
            "</div>"//+
            // "<div class='column' id='totalHcp'>"+
            // "<div class='colHead box'>" + "Hcp" + "</div>"+
            // "<div class='yds box'>" + totalYds + "</div>"+
            // "<div class='par box'>" + totalPar + "</div>"+
            // "<div class='hcp box'>" + '' +"</div>"+
            // "</div>"+
            // "<div class='column' id='netTotal'>"+
            // "<div class='colHead box'>" + "Net" + "</div>"+
            // "<div class='yds box'>" + totalYds + "</div>"+
            // "<div class='par box'>" + totalPar + "</div>"+
            // "<div class='hcp box'>" + '' +"</div>"+
            // "</div>"
        );


        $("#c8").after(
            "<div class='column out' id='outCol'>"+
            "<div class='colHead box'>Out</div>"+
            "<div class='yds box' id='frontNineYdsTot'></div>"+
            "<div class='par box' id='frontNineParTot'></div>"+
            "<div class='hcp box'>" + '' +"</div>"+
            //"<div class='totalOut box' '+ p +'>" + '' +"</div>"+
            "</div>"

        );

        $("#totalPar").append(totalPar);
        $("#totalYds").append(totalYds);
        //$("#frontNineYdsTot").append(frontTotalYds);

    createGolfCard();

}

function createGolfCard(){
    $(left).text('');
    for(let p = 1; p <= numPlayers; p++){
        $(left).append(
            "<div class='playerLabel playa golfer" + p + "'>" +
            "<span onclick='deletePlayer(" + p + ")' class='far fa-trash-alt'></span>" +
            "<span class='playerTag' contenteditable='true'>Player " + p + "</span>" +
            "</div>");

        $("#totalCol ").append("<div class='tot box playerTotal pTotal" + p + " playa golfer" + p + "'>0</div>");
        $("#outCol ").append("<div class='tot box playerTotal outTotal" + p + " playa golfer" + p + "'>0</div>");
        $("#inCol ").append("<div class='tot box playerTotal inTotal" + p + " playa golfer" + p + "'>0</div>");

        for(let h = 0; h <= selCourse.data.holes.length; h++){
            $("#c" + h).append("<input onkeyup='calcGolfScore(" + p + ")' class='holeInput playa golfer" + p + "' id='p"+ p +"h"+ h +"' type='text'>");
        }
    }
}

totalNumHoles = 18;
front9Holes = 9;
back9Holes = 18;

function calcGolfScore(myVal) {
    let tempScoreTotal = 0;
    let tempScoreFrontNine = 0;
    let tempScoreBackNine = 0;
    for (let i = 1; i <= totalNumHoles; i++) {
        tempScoreTotal += Number($("#p" + myVal + "h" + (i - 1)).val());
    }
    $(".pTotal" + myVal).text(tempScoreTotal);

    for (let i = 1; i <= front9Holes; i++) {
        tempScoreFrontNine += Number($("#p" + myVal + "h" + (i - 1)).val());
    }
    $(".outTotal" + myVal).text(tempScoreFrontNine);

    for (let i = 10; i <= back9Holes; i++) {
        tempScoreBackNine += Number($("#p" + myVal + "h" + (i - 1)).val());
    }
    $(".inTotal" + myVal).text(tempScoreBackNine);
}

function deletePlayer(playernum){
    $(".golfer" + playernum).remove();
    $(".total" + playernum).remove();
    for(let i = 1; i <= totalNumHoles; i++){
        $("#p" + playernum + "h" + i).remove();
    }
    for(let i = 1; i <= front9Holes; i++){
        $("#p" + playernum + "h" + i).remove();
    }
    for(let i = 1; i <= back9Holes; i++){
        $("#p" + playernum + "h" + i).remove();
    }
}

// completeGame();
//
// function completeGame(){
//     for(let p = 0; p <= totalScore; p++) {
//         if ($(".pTotal" + p) <= $("totalPar")) {
//             document.getElementsByClassName("scoreMessageBox").innerHTML = "Great score";
//         } else {
//             console.log("Better luck next time");
//         }
//     }
// }


