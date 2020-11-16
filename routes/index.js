var express = require("express");
var router = express.Router();
const dates = require("../custom_code/dates");
const matches = require("../models/matches");

// ________________________________________
/* GET home page. */
router.get("/", function (req, res, next) {
  res.send(`
 <h1>Hi you have 3 end points </h1>
 <ul>
<li>/list_of_matches</li>
<li>/matches_date/:date</li>
<li>/team_name/:name</li>
<li>/group</li>
 </ul>
 `);
});
// all matches data endpoint
// return a array of object
/*simple of data
   {
        "homeTeam": "Scotland",
        "awayTeam": "Slovakia",
        "status": "Finished"
    }
*/
router.get("/list_of_matches", (req, res) => {
  //create this array to push objects
  var arr = [];
  //matches.find get all the matchs data
  matches.find().then((result) => {
    //iterate over the objects
    result.map((p) => {
      //create this empty obj to add spacific data that i wanna send to user
      var obj = {};
      // create status variable to spacify that the match finished or will start or active now
      var status;
      //compare the date to assign status
      if (dates.compare(new Date(p.startTime), new Date()) == 1) {
        status = "Wil Start";
      } else if (dates.compare(new Date(), new Date(p.endTime)) == 1) {
        status = "Finished";
      } else {
        status = "Actine now";
      }
      //add values to empty object
      obj.homeTeam = p.homeTeam;
      obj.awayTeam = p.awayTeam;
      obj.status = status;
      //push this object to empty array
      arr.push(obj);
    });
    //send array as a response
    res.send(arr);
  });
});
//filter matches by date
router.get("/matches_date/:date", (req, res) => {
  //empty array to push filtered objects
  var holder = [];
  //get the date from url param
  const date = req.params.date;
  //convert string to date object
  const dateObj = new Date(date);
  //get days
  const dayParam = dateObj.getDate();
  //get months
  const monthParam = dateObj.getMonth();
  //get years
  const yearParam = dateObj.getFullYear();
  //get all matched from database
  matches.find().then((result) => {
    //itrate over result of objects
    result.map((p) => {
      //convert startTime from string to date object
      const d = new Date(p.startTime);
      //get days
      const day = d.getDate();
      //get months
      const month = d.getMonth();
      //get years
      const year = d.getFullYear();
      //compare this value with params
      if (yearParam == year && monthParam == month && dayParam == day) {
        //if matches push into empty array
        holder.push(p);
      }
    });
    //send the response to user
    res.send(holder);
  });
});
//end of matches by date
//matches by team name
router.get("/team_name/:name", (req, res) => {
  //take the team name as param
  const name = req.params.name;
  //get the values in the database that match homeTeam or awayTeam
  matches
    .find({
      $or: [{ homeTeam: name }, { awayTeam: name }],
    })
    .then((result) => {
      //send response to user
      res.send(result);
    });
});
//group matched based on date
router.get("/group", (req, res) => {
  //array to check that i have assign this value before or not
  var check = [false];
  //counter to assign in check array with key and assign group array
  var counter = 0;
  //group array this will be the filnal response
  var group = [];
  //find all matches in database
  matches.find().then((result) => {
    //interate over objects
    result.map((p) => {
      //convert startTime string to date object
      const d = new Date(p.startTime);
      //get Days
      const day = d.getDate();
      //get months
      const month = d.getMonth();
      //get years
      const year = d.getFullYear();
      //make key value and convert it to string to be unique
      const key = day + "" + month + year;
      //ckeck if the key have assgined before
      if (typeof check[key] != "undefined") {
        group[check[key]].push(p);
      } else {
        //if not assign counter to check array by key value
        check[key] = counter;
        //and make empty array so a can use push to push new objects
        group[counter] = [];
        //push new objects
        group[counter].push(p);
        //add +1 to counter value to iterate over index
        counter += 1;
      }
    });
    //send final respose to user
    res.send(group);
  });
});
//export the router
module.exports = router;
