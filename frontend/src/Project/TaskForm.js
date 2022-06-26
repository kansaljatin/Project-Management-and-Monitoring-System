import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "./TaskForm.css";
import PropTypes from "prop-types";
import axios from "axios";
import "react-toastify/dist/ReactToastify.minimal.css";

const TaskForm = (props) => {
  const [taskTextValue, setTaskText] = useState("");
  const [taskTitleValue, setTaskTitle] = useState("");
  const [taskdateValue, setTaskdate] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  let loggedIn = useRef(null);

  const [isLoggedIn, setLoggedIn] = useState(loggedIn);
  const [loggedInUser, setLoggedInUser] = useState({});
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [userJob, setUserJob] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const result = await fetch("/auth/isLoggedIn", { method: "GET" });
      const parsedResult = await result.json();
      loggedIn.current = parsedResult.isLoggedIn;

      setLoggedInUser(parsedResult.user);
      setLoggedIn(loggedIn.current);
      setIsDataLoading(true);
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchUserData() {
      if (loggedInUser && loggedInUser._id) {
        const userDataResult = await fetch(`/userData/${loggedInUser._id}`, {
          method: "GET",
        });
        const parsedUserDataResult = await userDataResult.json();
        setUserData(parsedUserDataResult);
        setUserJob(parsedUserDataResult.job);
        setIsDataLoading(false);
      }
    }
    fetchUserData();
  }, [loggedInUser]);

  const handleTextChange = (event) => {
    setTaskText(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTaskTitle(event.target.value);
  };

  const handledateChange = (event) => {
    setTaskdate(event.target.value);
  };

  const handlefileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const uploadFile = async (event) => {
    // console.log("reached");
    // event.preventDefault();
    // console.log("EEEEEE");
    const formData = new FormData();
    // console.log("EEEEEE");
    formData.append("name", selectedFile.value);
    formData.append("file", selectedFile);
    console.log("EEEEEE");
    console.log(formData);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    // console.log("EEEEEE");
    axios
      .post("http://localhost:3000/projects/upload", formData, config)
      .then((response) => {
        // alert("The file is successfully uploaded");
      })
      .catch((error) => {
        // alert("Failed to upload ");
      });
    console.log("UPLOADED.............");
  };

  const createTask = async (event) => {
    event.preventDefault();

    // console.log(selectedFile);
    // uploadFile();
    console.log("TTTTTTTTTTTTTTTT");
    console.log(selectedFile);
    const response = await fetch("/projects/newTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId: props.projectId,
        taskTitle: taskTitleValue,
        taskText: taskTextValue,
        taskdate: taskdateValue,
        taskFile: null,
        taskState: "todo",
      }),
    });
    if (response) {
      setTaskText("");
      props.newTaskAdded();
      toast.dark("Successfully added in a new task!");
      props.closeTaskForm();
    }
  };

  return (
    // <div className="card p-3 border mt-3 shadow">
    //   <form
    //     ref="uploadForm"
    //     id="uploadForm"
    //     action="http://localhost:8000/projects/upload"
    //     method="post"
    //     enctype="multipart/form-data"
    //   >
    //     <input type="file" name="sampleFile" />
    //     <input type="submit" value="Upload!" />
    //   </form>
    // </div>

    <div className="card p-3 border mt-3 shadow">
      <form onSubmit={createTask}>
        <div className="mb-3">
          <div className="mb-3">
            <label htmlFor="taskTitle" className="form-label">
              Title
            </label>
            <textarea
              className="form-control"
              id="taskTitle"
              name="taskTitle"
              rows="1"
              value={taskTitleValue}
              onChange={handleTitleChange}
              required
            />
          </div>
          <label htmlFor="taskText" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="taskText"
            name="taskText"
            rows="3"
            value={taskTextValue}
            onChange={handleTextChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="taskdate" className="form-label">
            Deadline
          </label>
          <input
            type="date"
            className="form-control"
            id="taskdate"
            name="taskdate"
            rows="1"
            value={taskdateValue}
            onChange={handledateChange}
            required
          />
        </div>

        {/* {userJob?(<div></div>):(<div className="mb-3">
          <label htmlFor="taskFile" className="form-label">
            Add attachment
          </label>
          <input
            type="file"
            // value={selectedFile}
            onChange={handlefileChange}
            className="form-control"
            id="taskFile"
            name="taskFile"
            required
            
          />
        </div>)} */}

        {/* <div className="mb-3">
          <form onSubmit={uploadFile}>
            <h1>File Upload</h1>
            <input
              type="file"
              className="custom-file-input"
              name="taskFile"
              onChange={handlefileChange}
            />
            {console.log(this.state.file)}
            <button className="upload-button" type="submit">
              Upload to DB
            </button>
          </form>
        </div> */}

        <button className="btn addBtn me-2" type="submit">
          Add task
        </button>
        <button
          className="btn btnClose"
          onClick={(event) => {
            event.preventDefault();
            props.closeTaskForm();
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

TaskForm.propTypes = {
  newTaskAdded: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
  closeTaskForm: PropTypes.func.isRequired,
};

export default TaskForm;
