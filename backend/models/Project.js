const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  assignedMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  projectManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  startDate: {
    type: Date
  },

  deadline: {
    type: Date
  },

  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"],
    default: "Not Started"
  }

}, { timestamps: true });

module.exports = mongoose.model("Project", ProjectSchema);
