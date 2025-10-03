import * as React from "react";
import { useState } from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { SignInPage } from "@toolpad/core/SignInPage";
import { useTheme } from "@mui/material/styles";
import SignUp from "./SignUp";
import SignIn from "./SignIn";

export default function Authentication() {
  return (
    <div>
      <SignIn></SignIn>
    </div>
  );
}
