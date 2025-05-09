import { Outlet } from "react-router-dom";

import classes from "./RootLayout.module.css";
import SideBarNavigation from "../SideBar/SideBarNavigation";
function RootLayout() {
  return (
    <>
      <div className={classes.body}>
        <div className={classes.bodycontainer}>
          <div className={classes.sideBar}>
            <SideBarNavigation />
          </div>
          <main className={classes.content}>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

export default RootLayout;
