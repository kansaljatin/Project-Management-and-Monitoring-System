const express = require("express");
const router = express.Router();
const opDB = require("../db/JIITDB");
// const multer = require('multer');
// const { MongoClient, ObjectId } = require("mongodb");
// const uuidv4 = require('uuid/v4');

const fileUpload = require("express-fileupload");
// const app = express();

router.use(fileUpload());

router.post("/getFile/:id", (req, res) => {
  console.log("Go -> ", req.params.id);

  res.sendFile(`./uploads/${req.params.id}`, { root: __dirname });
});

// router.post("/uploaded", function (req, res) {
//   console.log("YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY");
//   console.log(req.files);
//   // console.log(req.files.file); // the uploaded file object
// });

router.post("/upload", async (req, res) => {
  let sampleFile;
  let uploadPath;

  console.log("YYYY-> ", req.files);

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send("No files were uploaded.");
    console.log("NOOOOOOOOOO");
    return;
  }

  console.log("req.files >>>", req.files); // eslint-disable-line

  sampleFile = req.files.file;

  uploadPath = __dirname + "/uploads/" + sampleFile.name;

  sampleFile.mv(uploadPath, function (err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.send("File uploaded to " + uploadPath);
  });
});

// get all of the users projects
router.get("/:id", async (req, res) => {
  const projectArray = await opDB.getUserProjects(req.params.id);
  if (projectArray) {
    res.send(projectArray);
  }
});

// get most recent projects for profile page
router.get("/:id/profile", async (req, res) => {
  const projectArray = await opDB.getProfileProjects(req.params.id);
  if (projectArray) {
    res.send(projectArray);
  }
});

//get a paginated amount of projects to return to the dashboard
router.get("/:id/page/:pagenumber", async (req, res) => {
  const projectArray = await opDB.getPageProjects(
    req.params.id,
    req.params.pagenumber
  );
  if (projectArray) {
    res.send(projectArray);
  }
});

router.get("/:id/count", async (req, res) => {
  const projectsCount = await opDB.getUserProjectCount(req.params.id);
  console.log("HELLLLLOOOOO", req.params.id);
  if (projectsCount) {
    res.send({ count: projectsCount });
  }
});

// router.get("/admin/count", async (req, res) => {
//   const projectsCount = await opDB.getAdminProjectCount();
//   if (projectsCount) {
//     res.send({ count: projectsCount });
//   }
// });

router.get("/projectData/:id", async (req, res) => {
  const projectData = await opDB.getProject(req.params.id);
  if (projectData) {
    res.send(projectData);
  }
});

router.post("/", async (req, res) => {
  const postResult = await opDB.createProject(req.body);
  if (postResult) {
    res.send(postResult);
  }
});

router.post("/newtask", async (req, res) => {
  const newTaskResult = await opDB.createTask(req.body);
  if (newTaskResult) {
    res.send(newTaskResult);
  }
});

router.get("/:id/tasks", async (req, res) => {
  const projectTasks = await opDB.getTasks(req.params.id);
  if (projectTasks) {
    res.send(projectTasks);
  }
});

router.post("/updatetask", async (req, res) => {
  const newTaskTimelineObject = req.body;
  const result = await opDB.updateTaskTimelineState(newTaskTimelineObject);
  if (result) {
    res.send({ done: true });
  }
});

router.post("/updatetaskdetails", async (req, res) => {
  console.log(req.body);
  const result = await opDB.updateTaskDetails(req.body);
  if (result) {
    res.send({ done: true });
  }
});

router.post("/updatefilelocation", async (req, res) => {
  console.log(req.body);
  const result = await opDB.updateFileLocation(req.body);
  if (result) {
    res.send({ done: true });
  }
});

router.post("/deletetask", async (req, res) => {
  const taskId = req.body.taskId;
  const result = await opDB.deleteTask(taskId);
  if (result) {
    res.send(result);
  }
});

router.post("/updateProject/:id", async (req, res) => {
  const projectId = req.params.id;
  const newName = req.body.newName;
  const newDescription = req.body.newDescription;
  const result = await opDB.updateProject(projectId, newName, newDescription);
  if (result) {
    res.send({ updated: true });
  }
});

router.post("/deleteProject/:id", async (req, res) => {
  const projectId = req.params.id;
  const result = await opDB.deleteProject(projectId);
  if (result) {
    res.send({ deleted: true });
  }
});

//  const DIR = './public/';

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, DIR);
//     },
//     filename: (req, file, cb) => {
//         const fileName = file.originalname.toLowerCase().split(' ').join('-');
//         cb(null, uuidv4() + '-' + fileName)
//     }
// });

// var upload = multer({
//     storage: storage,
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
//             cb(null, true);
//         } else {
//             cb(null, false);
//             return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
//         }
//     }
// });

module.exports = router;
