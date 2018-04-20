
let selCourse;
let selTee;
let allcourses;
let numPlayers = 4;

loadDoc();

function loadDoc() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            allcourses = JSON.parse(this.responseText);
            console.log(allcourses);
            for(let i = 0; i < allcourses.courses.length; i++) {
                $(".courseDropdown").append("<option value='"+ allcourses.courses[i].id +"'>" + allcourses.courses[i].name + "</option>");
            }
        }
    };
    xhttp.open("GET", "https://uxcobra.com/golfapi/courses.txt", true);
    xhttp.send();
}

function getCourse(courseid) {
    console.log(courseid);
    $(".teeDropdown").html('');
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            selCourse = JSON.parse(this.responseText);
            console.log(selCourse);
            let holeonetees = selCourse.data.holes[0].teeBoxes;
            for(let i = 0; i < holeonetees.length; i++){
                $(".teeDropdown").append("<option value='"+ i +"'>"+ holeonetees[i].teeType +"</option>");
            }
        }
    };
    xhttp.open("GET", "https://uxcobra.com/golfapi/course"+ courseid +".txt", true);
    xhttp.send();
}

function setTee(teeindex){
    $(".right").html('');
    selTee = teeindex;
    let mycourse = selCourse.data.holes;
    for(let i = 0; i < mycourse.length; i++){
        $(".right").append("<div class='column' id='c"+ 1 +"'>"+
            "<div class='cheader'>"+ (i+1) + "</div>"+
            "<div class='yds'>"+ mycourse[i].teeBoxes[teeindex].yards +"</div>"+
            "</div>");
        }
    fillCard();
}


function fillCard(){
    for(let p = 1; p <= numPlayers; p++){
        $(".left").append("<div class='playerLabel' contenteditable='true'>Player " + p + "</div>");
        for(let h = 0; h < selCourse.data.holes.length; h++){
            $("#c" + h).append("<input class='holeInput' id='p"+ p +"h"+ h +"' type='text'>");
        }
    }
}

// function createCard(thetee){
//     chosentee = thetee;
//     $(".right").html('');
//     $(".left").html('');
//     for(let j = 0; j < course.holes.length; j++){
//         $(".right").append("<div id='row"+ j +"' class='holeRow'><div class='rowHead'>"+ course.holes[j].name +"</div></div>");
//     }
//
// }
//
