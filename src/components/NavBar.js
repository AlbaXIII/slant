import React from "react";

import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";

import logo from "../assets/slant-default-image_thumbnail.png";

import styles from "../styles/NavBar.module.css";

import { NavLink } from "react-router-dom";

import { useCurrentAuthUser } from "../contexts/AuthUserContext";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";

const NavBar = () => {
  
  const currentUser = useCurrentAuthUser();

  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  const authLinks = (
    <>
      <NavLink to={"/create"}>
        Create
      </NavLink>
      <NavLink to={`/profiles/${currentUser?.profile_id}`}>
        {currentUser?.username}
      </NavLink>
      <NavLink to="/logout" style={{ textDecoration: 'none' }}>
        Logout
      </NavLink>
    </>
  )

  const nonAuthLinks = (
    <>
      <NavLink to="/login" style={{ textDecoration: 'none' }}>
        Login
      </NavLink>
      <NavLink to="/signup" style={{ textDecoration: 'none' }}>
        Sign up
      </NavLink>
    </>
  )

  return (
    <Navbar expanded={expanded} expand="md" fixed="top" className={styles.navbar}>
      <Container>
        <Navbar.Brand>
          <NavLink to="/" style={{ textDecoration: 'none' }}>
            <img src={logo} alt="logo" height="35" className={styles.brand} />
            <h2 className={styles.maintitle}>slant.</h2>
          </NavLink>
        </Navbar.Brand>
        <Navbar.Toggle
          ref={ref}
          onClick={() => setExpanded(!expanded)}
          aria-controls="basic-navbar-nav"
          className={styles.togglebutton}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-right">
            {currentUser ? authLinks : nonAuthLinks}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;