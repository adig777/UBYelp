import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import './Loginpage.css';
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
  
    function validateForm() {
      return username.length > 0 && password.length > 0;
    }
    function handleSubmit(event) {
        fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify({
                'username': username,
                'password': password
            })
        }).then((response) => response.json()
        ).then((id) => {
            if (id !== -1) {
                //If login success, redirect with id transfered
                navigate('/search', { 'state': {'account_id':id}});
            } else {
                //Please try again message
                document.getElementById("error").innerHTML = 'Login Failed!';
            }
        });
        event.preventDefault();
    }
    return (
      <div className="Login">

       <meta charset="UTF-8"></meta>

        <header>
          <h1>UBYelp</h1>
          <h4>&#127854;It's Yelp, but UnBiased&#127856;</h4>
        </header>



        <Form onSubmit={handleSubmit}>
            
            <Form.Group size="lg" controlId="username">
            <Form.Label className="input-header">Enter Username or Email</Form.Label>
            <Form.Control
                autoFocus
                className="input"
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            </Form.Group>


            <Form.Group  size="lg" controlId="password">
            <Form.Label className="input-header">Password</Form.Label>
            <Form.Control
                className="input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </Form.Group>

            <p>
            <Button block size="lg" type="submit" disabled={!validateForm()}>
            Log In
            </Button>
            </p>

            <p>
                <label>Don't Have an Account Yet?</label>
            </p>

            <p>
            <Button block size="lg" onClick={() => { navigate('/signup') }}>
                Sign Up
            </Button>
            </p>


            


        </Form>
        <div id="error" className="error"></div>
      </div>
    );
  }