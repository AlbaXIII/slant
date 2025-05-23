import React, { useState } from "react";
import { Media } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "../../styles/Comment.module.css";
import CommentEditForm from "./CommentEditForm";
import { MoreDropdown } from "../../components/MoreDropdown";
import { useCurrentAuthUser } from "../../contexts/AuthUserContext";
import { axiosRes } from "../../api/axiosDefaults"

const Comment = (props) => {
  
  const { profile_id, owner, updated_on, body, id, setArticle, setComments, } = props;

  const [showEditForm, setShowEditForm] = useState(false);

  const currentUser = useCurrentAuthUser();  
  const is_owner = currentUser?.username === owner;

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/comments/${id}`);
      setArticle((prevArticle) => ({
        results: [{
          ...prevArticle.results[0],
          comments_count: prevArticle.results[0].comments_count,
        }
        ]
      }));

      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.filter((comment) => comment.id !== id),
      }));
    } catch (err) {}
  };

  return (
    <div>
      <hr />
      <Media>
        <Link to={`/profiles/${profile_id}`}>
          {owner}
        </Link>
        <Media.Body className="align-self-center ml-2">
          <span className={styles.Owner}>{owner}</span>
          <span className={styles.Date}>{updated_on}</span>
          {showEditForm ? (
            <CommentEditForm
              id={id}
              profile_id={profile_id}
              body={body}
              setComments={setComments}
              setShowEditForm={setShowEditForm}
            />
          ) : (
            <p>{body}</p>
          )}
        </Media.Body>
          {is_owner && !showEditForm && (
          <MoreDropdown
            handleEdit={() => setShowEditForm(true)}
            handleDelete={handleDelete}
          />
        )}
      </Media>
    </div>
  );
};

export default Comment;