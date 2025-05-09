import classes from "./NavBar.module.css";
import { CiSearch } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import defaultAvatar from "../assets/userAvator.svg";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../config/firebase";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TfiMenu } from "react-icons/tfi";
import SideDrawer from "../SideDrawer/SideDrawer";
import Backdrop from "../components/Backdrop";
import SideBarNavigation from "../SideBar/SideBarNavigation";
import { onAuthStateChanged } from "firebase/auth";

function NavBar({ searchQuery, onSearch }) {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    position: "Loading",
    name: "",
    avatarUrl: defaultAvatar,
  });

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };

  const handleInputChange = (e) => {
    onSearch(e.target.value);
  };

  function handleNotification() {
    console.log("notification show here");
  }

  function handleProfile() {
    console.log("profile show here");
  }

  const navigate = useNavigate();

  const getFirstLetter = (str) => {
    return str ? str.charAt(0).toUpperCase() : "";
  };

  const fetchUserDetails = async (user) => {
    try {
      if (user) {
        const userDocRef = doc(db, "users", user.email);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const { role, name, avatarUrl } = userDoc.data();
          setUserInfo({
            position:
              role.charAt(0).toUpperCase() + role.slice(1).toLowerCase(),
            name: name || "User",
            avatarUrl: avatarUrl || defaultAvatar,
          });
        } else {
          console.error("No such user document");
        }
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserDetails(user);
      } else {
        console.error("No user is signed in!");
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  return (
    <>
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
        <nav className="main-navigation__drawer-nav">
          <SideBarNavigation />
        </nav>
      </SideDrawer>

      <nav className={classes.Navbar}>
        <div className={classes.container}>
          <div
            onClick={() => navigate("")} // Navigate to "/dashboard" when clicked
            className={classes.logocontainer}
            style={{ cursor: "pointer" }} // Add pointer cursor for better UX
          >
            <img src="logo.png" alt="Dashboard Logo" />
          </div>
          <div className={classes.serchbar}>
            <CiSearch size={30} />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleInputChange}
            />
          </div>
          <div className={classes.rightcontainer}>
            <div className={classes.searchIcon}>
              <CiSearch size={30} color="#fff" />
            </div>
            <div className={classes.notifyicon}>
              <span onClick={handleNotification}>
                <IoIosNotificationsOutline size={30} color="#fff" />
              </span>
            </div>
            <div className={classes.user} onClick={handleProfile}>
              <div className={classes.avatar}>
                <img
                  src={userInfo.avatarUrl}
                  alt="User Avatar"
                  className={classes.avatar}
                />
                {!userInfo.avatarUrl && (
                  <div className={classes.avatarIcon}>
                    {getFirstLetter(userInfo.name || userInfo.position)}
                  </div>
                )}
              </div>
              <p>
                Welcome, {userInfo.name} {userInfo.position}
              </p>
            </div>
            <div className={classes.lines} onClick={openDrawerHandler}>
              <TfiMenu size={30} color="#fff" />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
