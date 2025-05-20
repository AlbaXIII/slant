import React from "react";
import axios from "axios";

import { Link, useHistory } from "react-router-dom";

import styles from "../../styles/LogoutForm.module.css"

import { useSetCurrentAuthUser } from "../../contexts/AuthUserContext";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

function LogoutForm(){
    
    const setCurrentAuthUser = useSetCurrentAuthUser();

    const history = useHistory();
    
    const handleSignout = async () => {
        try {
            await axios.post("dj-rest-auth/logout/");
            setCurrentAuthUser(null);
            history.push("/");
            } catch (err) {
            console.log(err);
            }
        };

    return (
        <div className={styles.container}>
            <h2>Are you sure you want to logout?</h2>
            <Container>
                <Button className={styles.button} variant="dark" onClick={handleSignout}>Yes</Button>
                <Link to="/">
                     <Button className={styles.button} variant="dark">No</Button>
                </Link>
            </Container>
        </div>
    )
}

export default LogoutForm