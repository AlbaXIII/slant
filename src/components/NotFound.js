import React from "react";

import Container from "react-bootstrap/Container"

import styles from "../styles/NotFound.module.css"

import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <Container className={styles.notfound}>
            <div>
                <h2>Sorry, the page you're looking for doesn't exist!</h2>
                <Link to={"/"}>
                    <h3><b>Click here to return home.</b></h3>
                </Link>
            </div>
        </Container>
    );
};

export default NotFound;