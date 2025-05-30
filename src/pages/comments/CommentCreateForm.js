import React, { useState } from "react";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import styles from "../../styles/CommentCreateEditForm.module.css"

import { axiosRes } from "../../api/axiosDefaults";

function CommentCreateForm(props) {
  const { article, setArticle, setComments } = props;
  const [body, setBody] = useState("");
  const [message, setMessage] = useState({ text: "", variant: "" });

    const handleChange = (event) => {
    setBody(event.target.value);
    if (message.text) {
      setMessage({ text: "", variant: "" });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axiosRes.post("/comments/", {
        body,
        article,
      });
      setComments((prevComments) => ({
        ...prevComments,
        results: [data, ...prevComments.results],
      }));
      setArticle((prevArticle) => ({
        results: [
          {
            ...prevArticle.results[0],
            comments_count: prevArticle.results[0].comments_count + 1,
          },
        ],
      }));
      setBody("");
      setMessage({ text: "Comment posted successfully!", variant: "dark" });

      setTimeout(() => {
      setMessage({ text: "", variant: "" });
      }, 3000);
    } catch (err) {
      // console.log(err)
      setMessage({ text: "Failed to post comment. Please try again.", variant: "danger" });
    }
  };

  return (
    <Form className={styles.commentform} onSubmit={handleSubmit}>
      {message.text && (
        <Alert variant={message.variant} className="mb-3">
          {message.text}
        </Alert>
      )}
      <Form.Group>
        <InputGroup>
          <Form.Control
            placeholder="thoughts & feelings..."
            as="textarea"
            value={body}
            onChange={handleChange}
            rows={4}
            cols={50}
          />
        </InputGroup>
      </Form.Group>
      <Button
        disabled={!body.trim()}
        type="submit"
        variant="dark"
      >
        submit
      </Button>
    </Form>
  );
}

export default CommentCreateForm;