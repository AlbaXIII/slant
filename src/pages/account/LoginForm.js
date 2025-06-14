import React, { useState } from "react";
import axios from "axios";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";

import styles from "../../styles/LoginForm.module.css"

import { Link, useHistory } from "react-router-dom";

import { useSetCurrentAuthUser } from "../../contexts/AuthUserContext";
import { useRedirect } from "../../hooks/useRedirect";
import { setTokenTimestamp } from "../../utils/utils";

function LoginForm(){

    const setCurrentAuthUser = useSetCurrentAuthUser();

    useRedirect("loggedIn");

    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
    });

    const { username, password } = loginData

    const [errors, setErrors] = useState({});

    const history = useHistory();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const { data } = await axios.post("/dj-rest-auth/login/", loginData)
            setCurrentAuthUser(data.user);
            setTokenTimestamp(data);
            history.goBack();
        } catch (err) {
            setErrors(err.response?.data)
        }
    }

    const handleChange = (event) => {
        setLoginData({
            ...loginData,
            [event.target.name]: event.target.value,
        });
    };

    return (
            <div className={styles.container}>
                <h2 className={styles.heading}>Log <em>In.</em></h2>
                <Form onSubmit={handleLogin}>
                    <Form.Group controlId="username">
                        <Form.Label className="d-none">Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Username"
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
                            placeholder="Password"
                            name="password"
                            value={password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    {errors.password?.map((message, idx) =>
                        <Alert variant="warning" key={idx}>{message}</Alert>
                    )}

                    <Button variant="dark" type="submit">
                        Log In
                    </Button>
                    {errors.non_field_errors?.map((message, idx) => (
                        <Alert key={idx} variant="warning" className="mt-3">
                            {message}
                        </Alert>
                    ))}
                </Form>
            <Container>
                Need an account? <Link className={styles.link} to="/signup">Sign up here.</Link>
            </Container>
        </div>
    )
}

export default LoginForm