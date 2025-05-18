import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import logo from "../assets/slant-default-image_thumbnail.png";
import styles from "../styles/NavBar.module.css";

const NavBar = () => {
  return (
    <Navbar expand="md" fixed="top" className={styles.navbar}>
      <Container>
        <Navbar.Brand>
          <img src={logo} alt="logo" height="35" className={styles.brand} />
          <h2 className={styles.maintitle}>slant.</h2>
        </Navbar.Brand>
        <div className={styles.upload}>
          <i href="#" height="35" class="fa-solid fa-2xl fa-arrow-up-from-bracket"></i>
          <p>Upload</p>
        </div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-right">
            <Nav.Link to="/login">
              Login
            </Nav.Link>
            <Nav.Link to="/signup">
              Sign up
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;