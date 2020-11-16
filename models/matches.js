const mongoose = require("mongoose");
//make the Schema
const Schema = mongoose.Schema;

matchesSchema = new Schema(
  {
    homeTeam: String,
    awayTeam: String,
    startTime: Date,
    endTime: Date,
    duration: Number,
    homeTeamScore: Number,
    awayTeamScore: Number,
    isActive: Boolean,
    league: String,
  },
  { timestamps: true }
);
const Matshes = mongoose.model("matches", matchesSchema);
// export the model to use this Schema
module.exports = Matshes;
