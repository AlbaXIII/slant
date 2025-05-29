import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";

import { axiosRes } from "../../api/axiosDefaults";

function CommentCreateForm(props) {
  const { article, setArticle, setComments } = props;
  const [body, setBody] = useState("");

  const handleChange = (event) => {
    setBody(event.target.value);
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
    } catch (err) {
      //console.log(err);
    }
  };

  return (
    <Form className="mt-2" onSubmit={handleSubmit}>
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