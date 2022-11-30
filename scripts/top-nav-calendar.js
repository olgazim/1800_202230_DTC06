//Displays the current weekly calendar at the top of multiple screens
function fillWeeklyCalendarHeader() {
  const datesThisWeek = getDatesThisWeek();
  const todaysDate = new Date().getDate();
  for (let i = 0; i < 7; i++) {
    const date = datesThisWeek[i];
    //fills the calendar one day at a time and displays the calendar through the 'day_' html element
    const currentElement = document.getElementById("day_" + i);
    if (date == todaysDate) {
      //Marks the current day by using the 'active_day' class
      currentElement.classList.add("active_day");
    }
    currentElement.innerHTML = date;
  }
}

//Returns date of Sunday on week of the date provided
function getSunday(date) {
  var day = date.getDay(),
    diff = date.getDate() - day;
  return new Date(date.setDate(diff));
}

//Returns dates of days of the current week
function getDatesThisWeek() {
  const result = [];
  const day = getSunday(new Date());
  for (let i = 0; i < 7; i++) {
    result.push(day.getDate());
    day.setDate(day.getDate() + 1);
  }
  return result;
}

//Displays the current monthly calendar at the top of the notifications screen
function fillMonthlyCalendar() {
  const todaysDate = new Date().getDate();
  //Dynamically changes the number of total days in a month according to what the current month is by using a helper function
  for (let i = 1; i <= getTotalDaysInMonth(new Date()); i++) {
    //fills the calendar one day at a time and displays the calendar through the 'day_' html element
    $("ul#days").append(
      `
      <li id="day_${i}">${i}</li>
      `
    );
  }
  //Marks the current day by using the 'active_day' style
  document
    .getElementById("day_" + todaysDate.toString())
    .classList.add("active_day");
}

//Helper function used in fillMonthlyCalendar to provide the total number of days of the current month. Returns the total number
//of days as an integer
function getTotalDaysInMonth(date) {
  const days = parseInt(
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  );
  return days;
}

//function is always called upon opening the notifications screen page
fillMonthlyCalendar();
