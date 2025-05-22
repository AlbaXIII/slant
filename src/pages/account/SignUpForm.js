import React, { useState } from "react";
import axios from "axios";

import { Link, useHistory } from "react-router-dom";

import styles from "../../styles/SignUpForm.module.css"

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";


const SignUpForm = () => {

    const [newUserData, setNewUserData] = useState({
        username: "",
        password1: "",
        password2: "",
    })

    const { username, password1, password2 } = newUserData;

    const [errors, setErrors] = useState({});

    const history = useHistory();

    const handleChange = (event) => {
        setNewUserData({
            ...newUserData,
            [event.target.name]: event.target.value,
        })
    }

    const handleSignUp = async (event) => {
        event.preventDefault();
        try {
            await axios.post('dj-rest-auth/registration/', newUserData)
            history.push("/login")
        } catch(err){
            setErrors(err.response?.data)
        }
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Join the <em>conversation.</em></h2>
            <Form onSubmit={handleSignUp} className={styles.form}>
                <Form.Group controlId="username">
                    <Form.Label className="d-none">Username</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter Username" 
                        name="username"
                        value={username}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                {errors.username?.map((message, idx) =>
                    <Alert variant="warning" key={idx}>{message}</Alert>
                )}

                <Form.Group controlId="password">
                    <Form.Label className="d-none">Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Enter Password" 
                        name="password1"
                        value={password1}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                {errors.password?.map((message, idx) =>
                    <Alert variant="warning" key={idx}>{message}</Alert>
                )}

                <Form.Group controlId="passwordConfirm">
                    <Form.Label className="d-none">Confirm Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        placeholder="Confirm Password" 
                        name="password2"
                        value={password2}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                {errors.passwordConfirm?.map((message, idx) =>
                    <Alert variant="warning" key={idx}>{message}</Alert>
                )}

                <Button variant="dark" type="submit">
                    Sign Up
                </Button>
                {errors.non_field_errors?.map((message, idx) => (
                    <Alert key={idx} variant="warning" className="mt-3">
                        {message}
                    </Alert>
                ))}
            </Form>
            <Container>
                Already have an account? <Link className={styles.link} to="/login">Login here.</Link>
            </Container>
        </div>
    )
}

export default SignUpForm