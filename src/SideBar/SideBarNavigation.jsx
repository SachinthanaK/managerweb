import { NavLink } from "react-router-dom";
import classes from "./SideBarNavigation.module.css";
import {
  MdDashboard,
  MdOutlineFormatListBulleted,
  MdAccountBalanceWallet,
  MdAccountTree,
  MdMessage,
  MdPeople,
  MdSettings,
  MdLogout,
} from "react-icons/md";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import defaultAvatar from "../assets/userAvator.svg";
import { CiSearch } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import Swal from "sweetalert2";

function SideBarNavigation() {
  const handleLogout = async () => {
    try {
      Swal.fire({
        icon: "question",
        title: "Logging Out",
        text: "Are you sure you want to log out?",
        showCancelButton: true,
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.value) {
          Swal.fire({
            timer: 1500,
            showConfirmButton: false,
            willOpen: () => {
              Swal.showLoading();
            },
            willClose: async () => {
              try {
                await signOut(auth); // Perform sign-out
                localStorage.setItem("is_authenticated", false); // Update local storage
                window.location.href = "http://localhost:5173/"; // Redirect to homepage
              } catch (error) {
                console.error("Error logging out:", error);
              }
            },
          });
        }
      });
    } catch (error) {
      console.error("Error initiating logout:", error);
    }
  };

  function handleProfile() {
    console.log("profile show here");
  }
  return (
    <>
      <header className={classes.header}>
        <nav>
          <ul className={classes.list}>
            <li className={classes.listhide}>
              <div className={classes.user} onClick={handleProfile}>
                <img
                  src={defaultAvatar}
                  alt="User Avatar"
                  className={classes.avatar}
                />
                <p>Welcome, Yohan! Manager</p>
              </div>
            </li>

            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
                end
              >
                <MdDashboard size={24} />
                DashBoard
              </NavLink>
            </li>
            <li className={classes.listhide}>
              <span
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                <CiSearch size={24} />
                Search
              </span>
            </li>
            <li className={classes.listhide}>
              <span
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                <IoIosNotificationsOutline size={24} />
                Notifications
              </span>
            </li>
            <li>
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                <MdOutlineFormatListBulleted size={24} />
                Orders
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/finances"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                <MdAccountBalanceWallet size={24} />
                Finances
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                <MdAccountTree size={24} />
                Products
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/messages"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                <MdMessage size={24} />
                Messages
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/customers"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                <MdPeople size={24} />
                Customers
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                <MdSettings size={24} />
                Settings
              </NavLink>
            </li>
            <li onClick={handleLogout} className={classes.logout}>
              <button type="button" className={classes.logoutButton}>
                <MdLogout size={24} />
                Log Out
              </button>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}

export default SideBarNavigation;
