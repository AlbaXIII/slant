import React from "react";
import { Media } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "../../styles/Comment.module.css";
import { useCurrentAuthUser } from "../../contexts/AuthUserContext";


const Comment = (props) => {
  const currentUser = useCurrentAuthUser();  

  const { profile_id, owner, updated_on, body } = props;

  return (
    <div>
      <hr />
      <Media>
        <Link to={`/profiles/${profile_id}`}>
          {currentUser.username}
        </Link>
        <Media.Body className="align-self-center ml-2">
          <span className={styles.Owner}>{owner}</span>
          <span className={styles.Date}>{updated_on}</span>
          <p>{body}</p>
        </Media.Body>
      </Media>
    </div>
  );
};

export default Comment;