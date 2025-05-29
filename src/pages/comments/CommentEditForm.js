import React, { useState } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { axiosRes } from "../../api/axiosDefaults";

function CommentEditForm(props) {
  const { id, content, setShowEditForm, setComments } = props;

  const [formBody, setFormBody] = useState(content);

  const handleChange = (event) => {
    setFormBody(event.target.value);
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
                content: formBody.trim(),
                updated_at: "now",
              }
            : comment;
        }),
      }));
      setShowEditForm(false);
    } catch (err) {
      //console.log(err);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="pr-1">
        <Form.Control
          as="textarea"
          value={formBody}
          onChange={handleChange}
          rows={4}
          cols={50}
        />
      </Form.Group>
      <div className="text-right">
        <Button
          variant="dark"
          onClick={() => setShowEditForm(false)}
          type="button"
        >
          cancel
        </Button>
        <Button
          variant="dark"
          type="submit"
        >
          save
        </Button>
      </div>
    </Form>
  );
}

export default CommentEditForm;