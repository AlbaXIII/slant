import React, { useState } from "react";

import styles from "../../styles/Comment.module.css";

import { Media } from "react-bootstrap";
import { Link } from "react-router-dom";

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
          <div>
            <b>{owner} |</b>
          </div>
        </Link>
        <Media.Body className={styles.commentbody}>
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
          <span><em>{updated_on}</em></span>
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