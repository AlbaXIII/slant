import React, { useEffect, useState } from "react";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import styles from "../../styles/UsernameForm.module.css"

import { useHistory, useParams } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import {
    useCurrentAuthUser,
    useSetCurrentAuthUser,
} from "../../contexts/AuthUserContext";

const UsernameForm = () => {
    const [username, setUsername] = useState("");
    const [errors, setErrors] = useState({});

    const history = useHistory();
    const { id } = useParams();

    const currentUser = useCurrentAuthUser();
    const setCurrentUser = useSetCurrentAuthUser();

    useEffect(() => {
        if (currentUser?.profile_id?.toString() === id) {
            setUsername(currentUser.username);
        } else {
            history.push("/");
        }
    }, [currentUser, history, id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
            try {
                await axiosRes.put("/dj-rest-auth/user/", {
                username,
            });
            setCurrentUser((prevUser) => ({
                ...prevUser,
                username,
        }));
        history.goBack();
        } catch (err) {
        //console.log(err);
        setErrors(err.response?.data);
        }
    };

    return (
        <div className={styles.userform}>
            <Row>
                <Col>
                    <Container>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>change username</Form.Label>
                                <Form.Control
                                    placeholder="username"
                                    type="text"
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)}
                                />
                            </Form.Group>
                            {errors?.username?.map((message, idx) => (
                                <Alert key={idx} variant="warning">
                                    {message}
                                </Alert>
                            ))}
                            <Button
                                variant="dark"
                                onClick={() => history.goBack()}
                            >
                            cancel
                            </Button>
                            <Button
                                variant="dark"
                                type="submit"
                            >
                            save
                            </Button>
                        </Form>
                    </Container>
                </Col>
            </Row>
        </div>
    );
};

export default UsernameForm;