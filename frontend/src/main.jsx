import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "../components/Login";
import Register from "../components/Register";
import LandingPage from "./LandingPage";
import VerifyEmail from "../components/VerifyEmail";
import Home from "../pages/Home";
import { GoogleOAuthProvider } from "@react-oauth/google";

let router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/Verifyemail",
    Component: VerifyEmail,
  },
  {
    path: "/drive",
    Component: Home,
  },
  {
    path: "/directory/:dirId",
    Component: Home,
  },
]);


createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_FRONTNED_CLIENT_ID}>
    <RouterProvider router={router} />
   </GoogleOAuthProvider>,
);
