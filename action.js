
let selCourse;
let selTee;
let allCourses;
let numPlayers = 4;
let right = $(".right");

loadDoc();

function loadDoc() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            allCourses = JSON.parse(this.responseText);
            for(let i = 0; i < allCourses.courses.length; i++) {
                $(".courseDropDown").append("<option value='"+ allCourses.courses[i].id +"'>" + allCourses.courses[i].name + "</option>");
            }
        }
    };
    xhttp.open("GET", "https://uxcobra.com/golfapi/courses.txt", true);
    xhttp.send();
}

function chooseCourse(courseId) {
    $(".chooseTee").html('');
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            selCourse = JSON.parse(this.responseText);
            let holeonetees = selCourse.data.holes[0].teeBoxes;
            for(let i = 0; i < holeonetees.length; i++){
                $(".teeDropDown").append("<option value='"+ i +"'>"+ holeonetees[i].teeType +"</option>");
            }
        }
    };
    xhttp.open("GET", "https://uxcobra.com/golfapi/course"+ courseId +".txt", true);
    xhttp.send();
}

function setTee(teeindex){
    $(right).html('');
    $(right).append(
        "<div class='column' id='colLabel'>"+
        "<div class='colHead box'>" + "Hole #" + "</div>"+
        "<div class='yds box'>" + "Yards" + "</div>"+
        "<div class='par box'>" + "Par" + "</div>"+
        "<div class='hcp box'>" + "Hcp" + "</div>"+
        "</div>"
    );

    selTee = teeindex;

    let frontTotalYds = 0;
    let frontTotalPar = 0;
    let backTotalYds = 0;
    let backTotalPar = 0;
    let totalYds = 0;
    let totalPar = 0;
    let totalScore = 0;


    let mycourse = selCourse.data.holes;
    for(let i = 0; i < mycourse.length; i++){
        $(right).append(
            "<div class='column' id='c"+ i +"'>"+
            "<div class='colHead box'>"+ (i+1) + "</div>"+
            "<div class='yds box'>"+ mycourse[i].teeBoxes[teeindex].yards +"</div>"+
            "<div class='par box'>"+ mycourse[i].teeBoxes[teeindex].par +"</div>"+
            "<div class='hcp box'>"+ mycourse[i].teeBoxes[teeindex].hcp +"</div>"+
            "</div>");
        }

        $(right).append(
            "<div class='column' id='colLabel'>"+
            "<div class='colHead box'>In</div>"+
            "<div class='yds totalIn box' id='backNineTotalYds'>" + backTotalYds + "</div>"+
            "<div class='par totalIn box' id='backNineTotalPar'>" + backTotalPar + "</div>"+
            "<div class='hcp box'>" + '' +"</div>"+
            "</div>"+
            "<div class='column' id='totalCol'>"+
            "<div class='colHead box'>" + "Total" + "</div>"+
            "<div class='yds box'>" + totalYds + "</div>"+
            "<div class='par box'>" + totalPar + "</div>"+
            "<div class='hcp box'>" + '' +"</div>"+
            //"<div class='total box'>" + '' +"</div>"+
            "</div>"
        );


        $("#c8").after(
            "<div class='column out'>"+
            "<div class='colHead box'>Out</div>"+
            "<div class='yds box' id='frontNineYdsTot'>" + frontTotalYds + "</div>"+
            "<div class='par box' id='frontNineParTot'>" + frontTotalPar + "</div>"+
            "<div class='hcp box'>" + '' +"</div>"+
            //"<div class='totalOut box' '+ p +'>" + '' +"</div>"+
            "</div>"

        );

    createGolfCard();

}

function createGolfCard(){
    for(let p = 1; p <= numPlayers; p++){
        $(".left").append(
            "<div class='playerLabel playa golfer" + p + "'>" +
            "<span onclick='deletePlayer(" + p + ")' class='far fa-trash-alt'></span>" +
            "<span class='playerTag' contenteditable='true'>Player " + p + "</span>" +
            "</div>");

        $("#totalCol ").append("<div class='tot box playerTotal pTotal" + p + " playa golfer" + p + "'>0</div>");

        for(let h = 0; h <= selCourse.data.holes.length; h++){
            $("#c" + h).append("<input onkeyup='calcGolfScore(" + p + ")' class='holeInput playa golfer" + p + "' id='p"+ p +"h"+ h +"' type='text'>");
        }
    }
}

amtOfHoles = 18;

function calcGolfScore(myVal){
    let tempScore = 0;
    for(let i = 1; i <= amtOfHoles; i++){
        tempScore += Number($("#p" + myVal + "h" + (i-1)).val());
        //tempScore += inValue;
    }
    $(".pTotal" + myVal).html(tempScore);
}

function deletePlayer(playernum){
    $(".golfer" + playernum).remove();
    $(".total" + playernum).remove();
    for(let i = 1; i <= amtOfHoles; i++){
        $("#p" + playernum + "h" + i).remove();
    }
}
