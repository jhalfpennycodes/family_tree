import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Home from "./common/Home";
import Tree from "./graph/Tree";
import ProfileLogic from "./profile/ProfilePage";
import ProfileList from "./profile/ProfileList";
import AddProfileForm from "./profile/AddProfile";
import Navbar from "./common/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tree" element={<Tree />} />
          <Route path="/profile/:id" element={<ProfileLogic />} />
          <Route path="/list" element={<ProfileList />} />
          <Route path="/addProfile" element={<AddProfileForm />}></Route>
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}
