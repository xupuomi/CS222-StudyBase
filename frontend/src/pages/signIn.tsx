import { ChangeEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './signIn.css';

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleKeepSignedInChange = () => {
    setKeepSignedIn(!keepSignedIn);
  };

  const handleSignIn = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', {
        "username": username,
        "password": password
      });

      const { notes } = response.data;

      localStorage.setItem('username', username);
      localStorage.setItem('notes', JSON.stringify(notes));

      window.location.href = '/home';
    } catch (error) {
      console.error('Error signing in:', error|| 'Failed to sign in');
    }
  };

  return (
    <div className="container">
      <div className="signin-form">
        <h2>Sign In</h2>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={keepSignedIn}
              onChange={handleKeepSignedInChange}
            />
            Keep me signed in
          </label>
        </div>
        <button className="btn btn-primary btn-block" onClick={handleSignIn}>
          Sign In
        </button>
        <Link to="/signup" className="btn btn-secondary btn-block mt-2 signup-link">
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default SignIn;