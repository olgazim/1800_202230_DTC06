// function showCheckbox() {
//     document.getElementById("#checkboxDays").style.display = "block";
// }

function hideCheckbox() {
    $("#checkboxDays").hide();
}


function showCheckbox() {
    $("#checkboxDays").show();
}


function setup() {
    var checkbox = document.getElementById("checkboxDays");
    checkbox.style.display = "none";

    $("#form-check-input-selectDays").on("click", showCheckbox);
    $("#form-check-input-everyDay").on("click", hideCheckbox);
}



$(document).ready(setup);