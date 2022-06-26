import "./Navbar.css";
import { useEffect, useState, useRef } from "react";
import { Redirect, Link, useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import NavLogo from "../Images/NavLogo.png";

function NavbarWSearch(props) {
  let loggedIn = useRef(null);
  const [isLoggedIn, setLoggedIn] = useState(loggedIn);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [loggedInUser, setLoggedInUser] = useState({});
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [userJob, setUserJob] = useState(false);
  let history = useHistory();

  useEffect(() => {
    async function fetchData() {
      const result = await fetch("/auth/isLoggedIn", { method: "GET" });
      const parsedResult = await result.json();
      loggedIn.current = parsedResult.isLoggedIn;
      // uncomment this code for validation implementation
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
        // setUserData(parsedUserDataResult);
        setUserJob(parsedUserDataResult.job);
        setIsDataLoading(false);
      }
    }
    fetchUserData();
  }, [loggedInUser]);

  const handleSignOut = async () => {
    const response = await fetch("/auth/logout", { method: "GET" });
    const parsedResponse = await response.json();
    if (parsedResponse.logout) {
      setLoggedIn(false);
      props.logoutPressed();
    }
  };

  const handleSignUp = () => {
    history.push("/register");
  };

  const handleSearchSubmit = (event) => {
    setSearchSubmitted(true);
    event.preventDefault();
  };

  const handleSearchFormChange = (event) => {
    setSearchValue(event.target.value);
  };

  if (loggedIn && !searchSubmitted) {
    return (
      <header className="navbar navbar-light sticky-top nav-bg flex-md-nowrap p-0 shadow">
        <Link className="col-md-3 col-lg-2 me-0 px-3 JIIT-brand-text" to="/">
          <img
            src={NavLogo}
            alt="JIIT Logo"
            className="me-1"
            style={{ width: "35px", height: "35px" }}
          />
          JIIT Project Portal
        </Link>
        <button
          className="navbar-toggler position-absolute d-md-none collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebarMenu"
          aria-controls="sidebarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        {/* <form
          className="w-100 ms-4"
          id="navbarSearchForm"
          onSubmit={handleSearchSubmit}
          value={searchValue}
          onChange={handleSearchFormChange}
        >
          <input
            className="form-control w-100 rounded"
            type="text"
            placeholder="Search for a project"
            aria-label="Project search bar"
            required
          />
        </form> */}
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap">
            {userJob === 2 ? (
              <button className="btn nav-bar-sign-out" onClick={handleSignUp}>
                Sign up
              </button>
            ) : (
              <></>
            )}
            <button className="btn nav-bar-sign-out" onClick={handleSignOut}>
              Sign out
            </button>
          </li>
        </ul>
      </header>
    );
  } else if (loggedIn && searchSubmitted) {
    return <Redirect push to={"/search/" + searchValue} />;
  } else {
    return <Redirect to={"/login"} />;
  }
}

NavbarWSearch.propTypes = {
  logoutPressed: PropTypes.func.isRequired,
};

export default NavbarWSearch;
