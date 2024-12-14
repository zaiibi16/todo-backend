const db = require("../models");
const Task = db.task;

const sendTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({
      userId: req.userId,
      completed: false,
    }).exec();
    return res.status(200).send({ data: tasks });
  } catch (err) {
    next(err);
  }
};
exports.getTasks = async (req, res, next) => {
  await sendTasks(req, res, next);
};

const updateTask = (prop, value) => (req, res, next) => {
  Task.findOneAndUpdate(
    { _id: req.body._id },
    {
      $set: {
        [prop]: value,
        modifyDate: Date.now(),
      },
    },
    { new: true, useFindAndModify: false }
  )
    .exec()
    .then((task) => {
      if (!task) {
        return res.status(200).send({
          success: false,
          error: {
            message: "Task find error "
          }
          }
          );
      }
      sendTasks(req, res, next);
    })
    .catch(next);
};

exports.markDone = updateTask("completed", true);

exports.markUnDone = updateTask("completed", false);

exports.createTask = async (req, res, next) => {
  try {
    let description = req.body.description;
    if (!description) {
      return res.status(200).send({
        success: false,
        error: {
          message: "Task has no description"
        }
        });
    }
    const task = new Task({
      userId: req.userId,
      description: description,
    });
    await task.save();
    res.send({ success: true, data: {message: "Task Added Successfully" }});
  } catch (err) {
    next();
  }
};
