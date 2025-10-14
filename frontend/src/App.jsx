import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Home from "./common/Home";
import Tree from "./graph/Tree";
import ProfilePage from "./profile/ProfilePage";
import ProfileList from "./profile/ProfileList";
import AddProfileForm from "./profile/AddProfile";
import Navbar from "./common/Navbar";
import SlotsSignIn from "./authentication/SignIn";
import SignUp from "./authentication/SignUp";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./authentication/AuthProvider";
import ProtectedRoute from "./authentication/ProtectedRoute";
import PublicFamilyList from "./publicFamilies/PublicFamilList";
import PublicFamilyTree from "./publicFamilies/PublicFamilyTree";
import AccessDenied from "./authentication/AccessDenied";
import PublicProfilePage from "./publicFamilies/PublicProfilePage";
import SessionExpired from "./authentication/SessionExpired";

export default function App() {
  return (
    <React.StrictMode>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/publicTree/:familyId"
              element={<PublicFamilyTree />}
            />
            <Route path="/publicProfile/:id" element={<PublicProfilePage />} />
            <Route path="/publicFamilies" element={<PublicFamilyList />} />
            <Route path="/sessionExpired" element={<SessionExpired />}></Route>
            <Route path="/tree" element={<Tree />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/listFamily" element={<ProfileList />} />
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
            <Route path="/forbidden" element={<AccessDenied />}></Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </React.StrictMode>
  );
}
