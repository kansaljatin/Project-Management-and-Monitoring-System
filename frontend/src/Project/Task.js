import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Task.css";
import PropTypes from "prop-types";
import moment from "moment";
// import { getProfileProjects } from "../../../db/JIITDB";

const Task = (props) => {
  const [editTextAreaValue, setTextAreaValue] = useState(props.task.taskText);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editTitleAreaValue, setTitleAreaValue] = useState(
    props.task.taskTitle
  );
  const [editdateAreaValue, setdateAreaValue] = useState(props.task.taskdate);

  let loggedIn = useRef(null);
  let closeModalButton = useRef(null);
  const [showAddFileForm, setShowAddFileForm] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(loggedIn);
  const [loggedInUser, setLoggedInUser] = useState({});
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [userJob, setUserJob] = useState(false);
  const [dateColor, setDateColor] = useState(false);

  const handlefileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

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

  function getCurrentDate() {
    let newDate = new Date();
    return newDate;
  }

  useEffect(() => {
    function checkDate() {
      var x = getCurrentDate();

      let tt = moment(props.task.taskdate).format("YYYY-MM-DD");
      var y = new Date(tt);

      // console.log("Dates -> ", x, y, tt, props.task.taskdate);
      if (x.getTime() < y.getTime()) setDateColor(false);
      else if (x.toDateString() === y.toDateString()) setDateColor(false);
      else setDateColor(true);
    }
    checkDate();
  }, [props.task.taskdate]);

  // const [fileName, setFileName] = useState("19103296.pdf");

  const updateTimelineForm = useRef(null);
  let timelineSelectedValue = "";

  const updateTaskDetails = async (event) => {
    event.preventDefault();
    const result = await fetch("/projects/updatetaskdetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.task._id,
        newText: editTextAreaValue,
        newTitle: editTitleAreaValue,
        newdate: editdateAreaValue,
      }),
    });
    if (result) {
      document.querySelector(`#editTextModal${props.task._id}`).click();
      props.taskUpdated();
      toast.dark("Successfully updated task!");
    } else {
      toast.error("Couldn't updated task :(");
    }
  };

  // this updates the task's state when they select a new timeline status
  const updateTimeline = async (event) => {
    event.preventDefault();
    if (timelineSelectedValue) {
      const result = await fetch("/projects/updateTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: props.task._id,
          newState: timelineSelectedValue,
        }),
      });
      if (result) {
        document
          .querySelector(`#closeUpdateModalButton${props.task._id}`)
          .click();
        props.taskUpdated();
        toast.dark("Successfully updated task state!");
      }
    } else {
      console.log("successfully caught bad update value");
      toast.error("Unsuccessfully updated task state :(");
    }
  };

  // this function haldnes the form changes in updating the status of a task
  const onTimeLineChange = (event) => {
    timelineSelectedValue = event.target.value;
  };

  const deleteTask = async () => {
    const result = await fetch("/projects/deletetask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskId: props.task._id,
      }),
    });
    if (result) {
      props.taskUpdated();
      toast.error("Deleted task");
    }
  };

  const viewFile = async (event) => {
    event.preventDefault();

    // console.log(selectedFile);
    // uploadFile();
    console.log("OOOOOOOOOO");
    // var x = "19103296.pdf";
    // setFileName(x);
    // console.log(fileName);
    console.log(props.task.taskFile);

    await fetch(`/projects/getFile/${props.task.taskFile}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // projectId: props.projectId,
        // taskTitle: taskTitleValue,
        // taskText: taskTextValue,
        // taskFile: selectedFile,
        // taskState: "todo",
      }),
    })
      .then((data) => {
        return data.blob();
      })
      .then((data) => {
        if (data.size === 0) {
          throw new Error("File not found");
        }
        const fileURL = URL.createObjectURL(data);
        //const Link = document.createElement("a");
        //Link.href = fileURL;
        //Link.click();
        window.open(fileURL, "_blank");
      });
  };

  const handleEditTextChange = (event) => {
    setTextAreaValue(event.target.value);
  };

  const handleEditTitleChange = (event) => {
    setTitleAreaValue(event.target.value);
  };
  const handleEditdateChange = (event) => {
    setdateAreaValue(event.target.value);
  };

  const uploadFile = async (event) => {
    console.log("reached");
    //event.preventDefault();
    console.log("EEEEEE");
    const formData = new FormData();
    console.log("EEEEEE");
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
      .post(
        "https://jiit-project-portal.herokuapp.com/projects/upload",
        formData,
        config
      )
      .then((response) => {
        //alert("The file is successfully uploaded");
      })
      .catch((error) => {
        //alert("Failed to upload ");
      });
    console.log("UPLOADED.............");
  };

  const updateFileLocation = async (event) => {
    event.preventDefault();

    await uploadFile();

    const result = await fetch("/projects/updatefilelocation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.task._id,
        newFileLocation: selectedFile.name,
      }),
    });
    if (result) {
      document.querySelector(`#editTextModal${props.task._id}`).click();
      props.taskUpdated();
      closeModalButton.current.click();
      toast.dark("Successfully added file!");
    } else {
      toast.error("Couldn't add file");
    }
  };

  return (
    <div>
      <div className="card mt-3 border shadow">
        <div className="card-body">
          <h3>{props.task.taskTitle}</h3>
          <p className="card-text">{props.task.taskText}</p>

          <p></p>

          <button className="btn" id="da">
            Due Date :- {moment(props.task.taskdate).format("DD-MM-YYYY")}
          </button>

          {props.task.taskState === "done" && !dateColor ? (
            <button className="btn" id="date">
              <>Handed in</>
            </button>
          ) : props.task.taskState === "done" ? (
            <button className="btn" id="miss">
              <>Turned in late</>
            </button>
          ) : (
            <></>
          )}

          <p></p>

          {/* <form> */}
          {props.task.taskState === "todo" ? (
            <button
              className="btn addBtn me-2"
              data-bs-toggle="modal"
              data-bs-target={"#AddFileModal" + props.task._id}
            >
              Add File
            </button>
          ) : (
            <></>
          )}

          <button className="btn addBtn me-2" type="submit" onClick={viewFile}>
            View File
          </button>

          {/* <a href="http://localhost:3000/projects/getFile">link</a> */}
          <hr />
          <div>
            {/* start of update progress button */}
            <button
              type="button"
              className="btn"
              data-bs-toggle="modal"
              data-bs-target={"#stateModal" + props.task._id}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                enableBackground="new 0 0 24 24"
                height="24"
                viewBox="0 0 24 24"
                width="24"
              >
                <g>
                  <rect fill="none" height="24" width="24" />
                </g>
                <g>
                  <g>
                    <g>
                      <path d="M23,8c0,1.1-0.9,2-2,2c-0.18,0-0.35-0.02-0.51-0.07l-3.56,3.55C16.98,13.64,17,13.82,17,14c0,1.1-0.9,2-2,2s-2-0.9-2-2 c0-0.18,0.02-0.36,0.07-0.52l-2.55-2.55C10.36,10.98,10.18,11,10,11s-0.36-0.02-0.52-0.07l-4.55,4.56C4.98,15.65,5,15.82,5,16 c0,1.1-0.9,2-2,2s-2-0.9-2-2s0.9-2,2-2c0.18,0,0.35,0.02,0.51,0.07l4.56-4.55C8.02,9.36,8,9.18,8,9c0-1.1,0.9-2,2-2s2,0.9,2,2 c0,0.18-0.02,0.36-0.07,0.52l2.55,2.55C14.64,12.02,14.82,12,15,12s0.36,0.02,0.52,0.07l3.55-3.56C19.02,8.35,19,8.18,19,8 c0-1.1,0.9-2,2-2S23,6.9,23,8z" />
                    </g>
                  </g>
                </g>
              </svg>{" "}
              Update Task
            </button>
            {/* start of edit task description button */}
            {userJob && props.task.taskState === "todo" ? (
              <button
                className="btn"
                data-bs-toggle="modal"
                data-bs-target={"#editTextModal" + props.task._id}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                </svg>{" "}
                Edit Task
              </button>
            ) : (
              <></>
            )}
            {/* start of delete task button */}
            {userJob && props.task.taskState === "todo" ? (
              <button className="btn" onClick={deleteTask}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>{" "}
                Delete Task
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      {/* start of update progress modal */}
      <div
        className="modal fade"
        id={"stateModal" + props.task._id}
        tabIndex="-1"
        aria-label="timelineModal"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">
                Edit progress for task: {props.task.taskText}
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form
                onChange={onTimeLineChange}
                onSubmit={updateTimeline}
                ref={updateTimelineForm}
              >
                <div
                  className="btn-group"
                  role="group"
                  aria-label="Basic radio toggle button group"
                >
                  <input
                    type="radio"
                    className="btn-check active"
                    name="btnradio"
                    value="todo"
                    id={"todoRadioButton" + props.task._id}
                    autoComplete="off"
                  />
                  <label
                    className="btn btn-outline-primary"
                    htmlFor={"todoRadioButton" + props.task._id}
                  >
                    To-do
                  </label>

                  {/* <input
                    type="radio"
                    className="btn-check"
                    name="btnradio"
                    value="inprogress"
                    id={"inProgressRadioButton" + props.task._id}
                    autoComplete="off"
                  />
                  <label
                    className="btn btn-outline-primary"
                    htmlFor={"inProgressRadioButton" + props.task._id}
                  >
                    In Progress
                  </label> */}

                  <input
                    type="radio"
                    className="btn-check"
                    value="done"
                    name="btnradio"
                    id={"doneRadioButton" + props.task._id}
                    autoComplete="off"
                  />
                  <label
                    className="btn btn-outline-primary"
                    htmlFor={"doneRadioButton" + props.task._id}
                  >
                    Done
                  </label>
                </div>
                <div className="modal-footer mt-2">
                  <button
                    type="button"
                    className="btn btnClose"
                    data-bs-dismiss="modal"
                    id={"closeUpdateModalButton" + props.task._id}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btnUpdate">
                    Update progress
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* start of edit task text modal */}
      <div
        className="modal fade"
        id={"editTextModal" + props.task._id}
        tabIndex="-1"
        aria-labelledby={"editTextModalLabel" + props.task._id}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4
                className="modal-title"
                id={"editTextModalLabel" + props.task._id}
              >
                Edit Task
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form
                id={"editTaskTextForm" + props.task._id}
                onSubmit={updateTaskDetails}
              >
                <div className="mb-3">
                  <label
                    htmlFor={"editTitleArea" + props.task._id}
                    className="col-form-label"
                  >
                    Title:
                  </label>
                  <textarea
                    className="form-control"
                    id={"editTitleArea" + props.task._id}
                    value={editTitleAreaValue}
                    onChange={handleEditTitleChange}
                  />
                  <label
                    htmlFor={"editTextArea" + props.task._id}
                    className="col-form-label"
                  >
                    Description:
                  </label>
                  <textarea
                    className="form-control"
                    id={"editTextArea" + props.task._id}
                    value={editTextAreaValue}
                    onChange={handleEditTextChange}
                  />
                  <label
                    htmlFor={"editTextArea" + props.task._id}
                    className="col-form-label"
                  >
                    Due Date:
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id={"editdateArea" + props.task._id}
                    value={editdateAreaValue}
                    onChange={handleEditdateChange}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btnClose"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btnUpdate">
                    Update Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* start of add file text modal */}
      <div
        className="modal fade"
        id={"AddFileModal" + props.task._id}
        tabIndex="-1"
        aria-labelledby={"AddFileModalLabel" + props.task._id}
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4
                className="modal-title"
                id={"AddFileModalLabel" + props.task._id}
              >
                Add File
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={updateFileLocation}>
                <div className="mb-3">
                  {/* <label htmlFor="taskFile" className="form-label">
                  Add attachment
                </label> */}
                  <input
                    type="file"
                    // value={selectedFile}
                    onChange={handlefileChange}
                    className="form-control"
                    id="taskFile"
                    name="taskFile"
                    required
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btnClose"
                    data-bs-dismiss="modal"
                    id="closeModalButton"
                    ref={closeModalButton}
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="btn addBtn me-2"
                    //data-bs-dismiss="modal"
                  >
                    Turn In
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Task.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    taskText: PropTypes.string.isRequired,
    taskTitle: PropTypes.string.isRequired,
    taskFile: PropTypes.string.isRequired,
  }),
  taskUpdated: PropTypes.func.isRequired,
};

export default Task;

{
  /* <div className="card p-3 border mt-3 shadow">
<form onSubmit={updateFileLocation}>
  <div className="mb-3">
    <label htmlFor="taskFile" className="form-label">
      Add attachment
    </label> 
    <input
      type="file"
      onChange={handlefileChange}
      className="form-control"
      id="taskFile"
      name="taskFile"
      required
    ></input>
  </div>

  <button className="btn addBtn me-2" type="submit">
    Turn In
  </button>
  
</form>
</div> */
}
