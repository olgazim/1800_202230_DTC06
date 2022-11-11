function fillWeeklyCalendarHeader() {
    const datesThisWeek = getDatesThisWeek();
    const todaysDate = (new Date()).getDate();
    for (let i = 0; i < 7; i++) {
        const date = datesThisWeek[i];
        const currentElement = document.getElementById("day_" + i);
        if (date == todaysDate) {
            // currentElement.classList.add("bg-primary");
            currentElement.classList.add("active_day");
        }
        currentElement.innerHTML = date;
    }
}

function getSunday(d) {
    var day = d.getDay(),
        diff = d.getDate() - day;
    return new Date(d.setDate(diff));
}

function getDatesThisWeek(){
    const result = [];
    const day = getSunday(new Date());
    for(let i = 0; i < 7; i++){
        result.push(day.getDate());
        day.setDate(day.getDate() + 1);
    }
    return result;
}