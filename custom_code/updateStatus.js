const matches = require("../models/matches");
const dates = require("./dates");

// _______________________
//updating the active value every 1 min

function update() {
  //find all matches
  matches.find().then((result) => {
    //iterate over objects
    result.map((p) => {
      //convert startTime string to date object
      const d1 = new Date(p.startTime);
      //convert endTime string to date object
      const d2 = new Date(p.endTime);
      //   get the current data : date can be different in other machines we should use a standard time
      const d3 = new Date();
      //compare if the current time between startTime and endTime or not
      if (dates.inRange(d3, d1, d2) && p.isActive == false) {
        //update the value if in between and the value is false
        matches
          .findByIdAndUpdate({ _id: p._id }, { isActive: true })
          .then((res) => console.log(res));
      } else if (p.isActive == true && !dates.inRange(d3, d1, d2)) {
        //this step we can implement else but we have to make additional update
        matches
          .findByIdAndUpdate({ _id: p._id }, { isActive: false })
          .then((res) => console.log(res));
      }
    });
    //use setTimeOut to make intervals and call the function again every 1 min
    setTimeout(update, 10000);
  });
}
update();
