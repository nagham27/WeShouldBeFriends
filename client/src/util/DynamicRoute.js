import { useAuthState } from "../context/auth";
import { Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Home from "../pages/Home.js";
import Register from "../pages/Register.js";
import Login from "../pages/Login.js";
import { printIntrospectionSchema } from "graphql";

export default function DynamicRoute(props) {
  let location = useLocation();
  console.log(location);
  console.log(location.state);
  console.log(location.pathname);
  const navigate = useNavigate();
  const { user } = useAuthState();
  console.log(user, "user");
  console.log(props.children.type);
  if (props.children.props.authenticated && !user) {
    console.log("bout to navigate");

    return <Navigate to="/login" replace={true} />;
  } else if (props.children.props.guest && user) {
    console.log("else if");

    return <Navigate to="/" replace={true} />;
  } else {
    console.log("final else");
    return props.children;
  }
}
