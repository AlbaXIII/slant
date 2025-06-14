import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import styles from "../../styles/ProfileEditForm.module.css";

import { axiosReq } from "../../api/axiosDefaults";
import {
    useCurrentAuthUser,
    useSetCurrentAuthUser,
} from "../../contexts/AuthUserContext";

const ProfileEditForm = () => {

    const currentUser = useCurrentAuthUser();
    const setCurrentUser = useSetCurrentAuthUser();
    const { id } = useParams();
    const history = useHistory();

    
    const [profileData, setProfileData] = useState({
        bio: "",
    });
    const { bio } = profileData;

    const [errors, setErrors] = useState({});

    useEffect(() => {

        const abortController = new AbortController();
        let isMounted = true; 

        const handleMount = async () => {
            if (currentUser?.profile_id?.toString() === id) {
                try {
                    const { data } = await axiosReq.get(`/profiles/${id}/`, {
                        signal: abortController.signal 
                    });
                    const { name, bio } = data;
                    if (isMounted) {
                        setProfileData({ name, bio });
                    }
                } catch (err) {
                    if (err.name !== 'AbortError' && isMounted) {
                        //console.log(err);
                        history.push("/");
                    }
                }
            } else {
                if (isMounted) {
                    history.push("/");
                }
            }
        };
        handleMount();
        return () => {
            isMounted = false; 
            abortController.abort(); 
        };
    }, [currentUser, history, id]);

    const handleChange = (event) => {
        setProfileData({
            ...profileData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        setErrors({});
        
        const formData = new FormData();
        formData.append("bio", bio);
        
        try {
            const { data } = await axiosReq.put(`/profiles/${id}/`, formData);
            setCurrentUser((currentUser) => ({
                ...currentUser,
                ...data,
            }));
            history.goBack();
        } catch (err) {
            setErrors(err.response?.data || {});
        }
    };

    const textFields = (
        <>
            <Form.Group>
                <Form.Label>Edit Bio</Form.Label>
                <Form.Control
                as="textarea"
                value={bio}
                onChange={handleChange}
                name="bio"
                rows={7}
            />
            </Form.Group>

            {errors?.bio?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                {message}
                </Alert>
            ))}
            <Button
                variant="dark"
                onClick={() => history.goBack()}
                className={styles.biobuttons}
            >
                cancel
            </Button>
            <Button 
                variant="dark" 
                type="submit"
                className={styles.biobuttons}
            >
                save
            </Button>
        </>
    );

    return(
    <div className={styles.bioform}>
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col>
                    <Container>{textFields}</Container>
                </Col>
            </Row>
        </Form>
    </div>
  );
};

export default ProfileEditForm;

