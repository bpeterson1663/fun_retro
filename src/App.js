import React, {useState} from 'react';
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom';
import RetroContainer from './components/Retro/RetroContainer';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Navigation from './components/Navigation';
import AuthContext from './auth-context';
function App() {
  const [authStatus, setAuthStatus] = useState(false);
  const [authToken, setAuthToken] = useState('')
  const login = (data) => {
    setAuthStatus(true);
    setAuthToken(data.idToken)
  };
  return (
    <BrowserRouter>
      <div className="App">

        <AuthContext.Provider value={{status: authStatus, authToken: authToken, login: login}}>
          <Navigation/>
          <Route path="/retroList" component={null} />
          <Route path="/retro" component={RetroContainer} />
          <Route path="/login" component={Login} />
          <Route path="/signup" exact component={SignUp} />
        </AuthContext.Provider>  
      </div>
  </BrowserRouter>
  );
}

export default App;
