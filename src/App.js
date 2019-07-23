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
  const [authId, setAuthId] = useState(false);
  const login = (status) => {
    setAuthId(status);
  };
  useEffect(() => {
    firebase.auth()
          .onAuthStateChanged((user) => {
            console.log("ON AUTH CALLED: ")
            if(user){
              setAuthId(user.uid);
            }else{
              setAuthId(false);
            }
          });
  });
  return (
    <BrowserRouter>
      <div className="App">

        <AuthContext.Provider value={{userId: authId, login: login}}>
          <Navigation/>
          <Route path="/retro/:id" component={authId ? RetroContainer : null} />
          <Route path="/login" component={Login} />
          <Route path="/signup" exact component={SignUp} />
          <Route path="/retroList" component={authId ? AdminContainer : null} />
        </AuthContext.Provider>  
      </div>
  </BrowserRouter>
  );
}

export default App;
