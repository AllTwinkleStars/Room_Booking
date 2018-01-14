import React, { Component } from 'react';
import './App.css';
import SignInForm from './components/SignInForm'
import { signIn } from './api/auth'
import { listRooms } from './api/rooms'
import { setToken } from './api/init'

class App extends Component {
  state = {
    decodedToken: null
  }

  // Pass supplied email & password to the signIn function, returns the users token
  onSignIn = ({email, password}) => {
    signIn({ email, password })
      .then((decodedToken) => {
        console.log('signed in', decodedToken)
        this.setState({ decodedToken })
      })
  }

  render() {
    const { decodedToken } = this.state

    return (
      <div className="App">
        <h1>Red Hill Room System</h1>
        {
          !!decodedToken ? (
            <h3>Signed in User: {decodedToken.email}</h3>
          ) : (
            <SignInForm onSignIn={ this.onSignIn } />
          )
        }
      </div>
    );
  }

  // When the App first renders
  componentDidMount() {
    // Load room data from database
    listRooms()
      .then((rooms) => {
        console.log('Room data:', rooms)
      })
      .catch((error) => {
        console.error('Error loading room data', error)
      })
  }
}

export default App;
