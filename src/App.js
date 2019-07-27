import React, {useState, useEffect} from 'react';
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom';
import RetroContainer from './components/Retro/RetroContainer';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Navigation from './components/Navigation';
import AuthContext from './auth-context';
import LoadingContext from './loading-context';
import AdminContainer from './components/Admin/AdminContainer';
import firebase from 'firebase';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {main:'#2196f3'},
    secondary: {main: '#dd33fa'},
  }
});
const App = () => {
  const [authId, setAuthId] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = (status) => {
    setAuthId(status);
  };
  useEffect(() => {
    firebase.auth()
          .onAuthStateChanged((user) => {
            if(user){
              setAuthId(user.uid);
            }else{
              setAuthId(false);
            }
          });
  });
  return (
    <ThemeProvider theme={theme}>
      <LoadingContext.Provider value={{isLoading: loading, setLoading: setLoading}}>
          <BrowserRouter>
            <div className="App">

              <AuthContext.Provider value={{userId: authId, login: login}}>
                  <Navigation/>
                  <Route path="/retro/:id" exact component={authId ? RetroContainer : Login} />
                  <Route path="/login" exact component={Login} />
                  <Route path="/signup" exact component={SignUp} />
                  <Route path="/retroList" exact component={authId ? AdminContainer : Login} />
                  <Route path="/" exact component={authId ? AdminContainer : Login} />
              </AuthContext.Provider>  
            </div>
        </BrowserRouter>
    </LoadingContext.Provider>
  </ThemeProvider>
  );
}

export default App;
