import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import './Signup.css';

export default function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    function validateForm() {
        if (password === repeatPassword) {
            if (password.length > 0) {
                document.getElementById("passwordError").innerHTML = '';
            }
            return username.length > 0 && password.length > 0 && email.length > 0;
        } else if (password.length > 0 && repeatPassword.length > 0) {
            document.getElementById("passwordError").innerHTML = 'Passwords do not match!';
            return false;
        }
    }

    function handleSubmit(event) {
        fetch('http://localhost:3001/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify({
                'username': username,
                'password': password,
                'email': email
            })
        }).then((response) => response.json()
        ).then((res) => {
            if (res === -1) {
                //Please try again message
                document.getElementById("error").innerHTML = 'Username already exists';
            } else if (res === -2) {
                document.getElementById("error").innerHTML = 'Account already created with this email!';
            } else {
                //If signup success, redirect with ?id=[id]
                navigate('/search', { 'state': { 'id': res } });
            }
        });
        event.preventDefault();
    }
    return (
        <div className="Signup">


          <div className="form-group">
            <h5>Sign Up</h5>
           </div>

            <Form onSubmit={handleSubmit}>
 
            <div className="form-group">   
            <p>
            <label for="username">Enter Username:</label>
                <Form.Group size="lg" controlId="username">
                    <Form.Control
                        autoFocus
                        type="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>
                </p>
            </div>

            <div className="form-group">
                <p>
            <label for="password">Enter Password:</label>            
                <Form.Group size="lg" controlId="password">
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                </p>
            </div>

            <div className="form-group">
                <p>
                <label for="password">Reenter Password:</label>
                <Form.Group size="lg" controlId="repeatPassword">
                    <Form.Control
                        type="password"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        />
                </Form.Group>
                </p>
             </div>

             <div className="form-group">
                 <p>
                <label for="email">Enter Email:</label>
                <Form.Group size="lg" controlId="email">
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Group>
                </p>
            </div>


            <div className="form-group">
                <p>
                <Button block size="lg" type="submit" disabled={!validateForm()}>
                    Sign Up
                </Button>
                </p>
            </div>

                <div id="error" className="error"></div>
                <div id="passwordError" className="error"></div>
            </Form>
        </div>
    );
}