import React, { useState } from "react";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import styles from "../../styles/CommentCreateEditForm.module.css"

import { axiosRes } from "../../api/axiosDefaults";

function CommentEditForm(props) {
  const { id, body, setShowEditForm, setComments } = props;
  const [formBody, setFormBody] = useState(body);
  const [message, setMessage] = useState({ text: "", variant: "" });

  const handleChange = (event) => {
    setFormBody(event.target.value);
    if (message.text) {
      setMessage({ text: "", variant: "" });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.put(`/comments/${id}/`, {
        body: formBody.trim(),
      });
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.map((comment) => {
          return comment.id === id
            ? {
                ...comment,
                body: formBody.trim(),
                updated_at: "now",
              }
            : comment;
        }),
      }));
      setMessage({ text: "Comment updated successfully!", variant: "dark" });

      setTimeout(() => {
        setShowEditForm(false);
      }, 3000);
    } catch (err) {
      setMessage({ text: "Failed to update comment. Please try again.", variant: "danger" });
      //console.log(err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {message.text && (
        <Alert variant={message.variant} className="mb-3">
          {message.text}
        </Alert>
      )}
      <Form.Group className="pr-1">
        <Form.Control
          as="textarea"
          value={formBody}
          onChange={handleChange}
          rows={4}
          cols={50}
        />
      </Form.Group>
      <div className="text-right m5">
        <Button
          variant="dark"
          onClick={() => setShowEditForm(false)}
          type="button"
          className={styles.editbuttons}
        >
          cancel
        </Button>
        <Button
          variant="dark"
          type="submit"
          className={styles.editbuttons}
        >
          save
        </Button>
      </div>
    </Form>
  );
}

export default CommentEditForm;