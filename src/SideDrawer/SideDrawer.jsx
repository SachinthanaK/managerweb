import ReactDOM from "react-dom";
import React from "react";
import { CSSTransition } from "react-transition-group";

import classes from "./SideDrawer.module.css";

const SideDrawer = (props) => {
  const content = (
    <CSSTransition
      in={props.show}
      timeout={200}
      classNames="slide-right-left" // Updated classNames for right-to-left animation
      mountOnEnter
      unmountOnExit
    >
      <aside className={classes.sideDrawer} onClick={props.onClick}>
        {props.children}
      </aside>
    </CSSTransition>
  );

  return ReactDOM.createPortal(content, document.getElementById("drawer-hook"));
};

export default SideDrawer;
