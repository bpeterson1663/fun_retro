import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";
import RetroContainer from "./components/Retro/RetroContainer";
import SignUp from "./components/Auth/SignUp";
import Login from "./components/Auth/Login";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import AuthContext from "./context/auth-context";
import AdminContainer from "./components/Admin/AdminContainer";
import FAQ from "./components/FAQ/FAQ";
import { authFirebase } from "./firebase";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import IEWarning from "./components/Common/IEWarning";
import ForgotPassword from "./components/Auth/ForgotPassword";

const theme = createMuiTheme({
  palette: {
    primary: { main: "#2196f3" },
    secondary: { main: "#dd33fa" }
  }
});
const App = () => {
  const [authId, setAuthId] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const login = status => {
    setAuthId(status);
  };
  useEffect(() => {
    authFirebase.onAuthStateChanged(user => {
      if (user) {
        setAuthId(user.uid);
      } else {
        setAuthId(false);
      }
      setLoading(false);
    });
  });
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <div className="App">
          <AuthContext.Provider value={{ userId: authId, login: login }}>
            <Navigation />
            {isLoading ? <LinearProgress /> : null}
            <Route
              path="/retro/:id"
              exact
              component={authId ? RetroContainer : Login}
            />
            <Route path="/login" exact component={Login} />
            <Route path="/signup" exact component={SignUp} />
            <Route
              path="/retroList"
              exact
              component={authId ? AdminContainer : Login}
            />
            <Route path="/forgotPassword" exact component={ForgotPassword} />
            <Route path="/faq" exact component={FAQ} />
            <Route path="/" exact component={authId ? AdminContainer : Login} />
            <Footer />
          </AuthContext.Provider>
        </div>
        <IEWarning />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
