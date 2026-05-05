const router = require('express').Router();
const Project = require('../models/Project');
const { auth, adminOnly } = require('../middleware/auth');


router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('createdBy', 'name email')
      .populate('assignedMembers', 'name email')
      .populate('projectManager', 'name email');

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});



router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});


router.put('/:id', auth, async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedProject);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});


router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);

    res.json({
      message: "Project Deleted Successfully"
    });

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
