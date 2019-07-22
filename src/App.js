import React, {useState, useEffect} from 'react';
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom';
import RetroContainer from './components/Retro/RetroContainer';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Navigation from './components/Navigation';
import AuthContext from './auth-context';
import AdminContainer from './components/Admin/AdminContainer';
import firebase from 'firebase';
const App = (props) => {
  const [authStatus, setAuthStatus] = useState(false);
  const login = (status) => {
    setAuthStatus(status);
  };
  useEffect(() => {
    firebase.auth()
          .onAuthStateChanged((user) => {
            if(user){
              setAuthStatus(true);
            }else{
              setAuthStatus(false);
            }
          });
  });
  return (
    <BrowserRouter>
      <div className="App">

        <AuthContext.Provider value={{status: authStatus, login: login}}>
          <Navigation/>
          <Route path="/retroList" component={null} />
          <Route path="/retro" component={authStatus ? RetroContainer : null} />
          <Route path="/login" component={Login} />
          <Route path="/signup" exact component={SignUp} />
          <Route path="/adminPortal" component={authStatus ? AdminContainer : null} />
        </AuthContext.Provider>  
      </div>
  </BrowserRouter>
  );
}

export default App;
