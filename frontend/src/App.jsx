import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Tree from "./graph/Tree";
import ProfilePage from "./profile/ProfilePage";
import ProfileList from "./profile/ProfileList";
import Navbar from "./common/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
  {
    path: "/tree",
    element: <Tree />,
  },
  {
    path: "/Profile",
    element: <ProfilePage />,
  },
  {
    path: "/list",
    element: <ProfileList></ProfileList>,
  },
]);

export default function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<div>Hello world!</div>} />
          <Route path="/tree" element={<Tree />} />
          <Route path="/Profile" element={<ProfilePage />} />
          <Route path="/list" element={<ProfileList />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
}
