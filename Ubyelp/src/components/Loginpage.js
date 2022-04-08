import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import './Loginpage.css';
import SearchBar from './SearchBar/SearchBar.js';

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
  
    function validateForm() {
      return username.length > 0 && password.length > 0;
    }
    function handleSubmit(event) {
        fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify({
                'username': document.getElementById("username").value,
                'password': document.getElementById("password").value
            })
        }).then((response) => response.json()
        ).then((id) => {
            console.log(id);
            if (id != -1) {
                //If login success, redirect with ?id=[id]
                return (<SearchBar />);
            } else {
                //Please try again message
            }
        });
        event.preventDefault();
    }
    return (
      <div className="Login">
        <Form onSubmit={handleSubmit}>
          <Form.Group size="lg" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              autoFocus
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group size="lg" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button block size="lg" type="submit" disabled={!validateForm()}>
            Login
          </Button>
          <Button block size="lg" type="submit" disabled={!validateForm()}>
            SignUp
          </Button>

        </Form>
      </div>
    );
  }