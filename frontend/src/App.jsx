import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Home from "./common/Home";
import Tree from "./graph/Tree";
import ProfileLogic from "./profile/ProfilePage";
import ProfileList from "./profile/ProfileList";
import AddProfileForm from "./profile/AddProfile";
import Navbar from "./common/Navbar";
import SlotsSignIn from "./authentication/SignIn";
import SignUp from "./authentication/SignUp";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./authentication/AuthProvider";
import ProtectedRoute from "./authentication/ProtectedRoute";

export default function App() {
  return (
    <React.StrictMode>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tree" element={<Tree />} />
            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <ProfileLogic />
                </ProtectedRoute>
              }
            />
            <Route
              path="/list"
              element={
                <ProtectedRoute>
                  <ProfileList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addProfile"
              element={
                <ProtectedRoute>
                  <AddProfileForm />
                </ProtectedRoute>
              }
            ></Route>
            <Route path="/signin" element={<SlotsSignIn />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </React.StrictMode>
  );
}
