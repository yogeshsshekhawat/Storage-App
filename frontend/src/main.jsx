import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "../components/Login";
import Register from "../components/Register";
import LandingPage from "./LandingPage";
import VerifyEmail from "../components/VerifyEmail";
import Home from "../pages/Home";
import PrivacyPolicy from "../components/PrivacyPolicy";
import TermsOfService from "../components/TermsOfService";
import AboutUs from "../components/AboutUs";
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
  {
    path: "/privacy-policy",
    Component: PrivacyPolicy,
  },
  {
    path: "/privacy",
    Component: PrivacyPolicy,
  },
  {
    path: "/terms-of-service",
    Component: TermsOfService,
  },
  {
    path: "/terms",
    Component: TermsOfService,
  },
  {
    path: "/about-us",
    Component: AboutUs,
  },
  {
    path: "/about",
    Component: AboutUs,
  },
]);


createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_FRONTNED_CLIENT_ID}>
    <RouterProvider router={router} />
   </GoogleOAuthProvider>,
);
