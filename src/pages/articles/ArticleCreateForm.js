import React, { useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";


import { Image } from "react-bootstrap"

import styles from "../../styles/ArticleCreateEditForm.module.css";
// import appStyles from "../../App.module.css";
// import { useCurrentAuthUser } from "../../contexts/AuthUserContext";

import { useHistory } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

function ArticleCreateForm() {

  const [errors, setErrors] = useState({});
  // const currentUser = useCurrentAuthUser;

  const [articleData, setArticleData] = useState({
    publisher: "",
    subject: "",
    title: "",
    body: "",
    image: "",
  });

  const { publisher, subject, title, body, image } = articleData;

  const imageInput = useRef(null);
  const history = useHistory();

  const handleChange = (event) => {
    setArticleData({
      ...articleData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    if (event.target.files.length) {
      URL.revokeObjectURL(image);
      setArticleData({
        ...articleData,
        image: URL.createObjectURL(event.target.files[0]),
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("publisher", publisher)
    formData.append("subject", subject)
    formData.append("title", title)
    formData.append("body", body)
    formData.append("image", imageInput.current.files[0]);

    try {
        const { data } = await axiosReq.post("/articles/", formData);
        history.push(`/posts/${data.id}`);
    } catch (err) {
        console.log(err);
        if (err.response?.status !== 401) {
            setErrors(err.response?.data);
        }
    }
  }

  const textFields = (
    <div>
      <Form.Group>
        <Form.Label>Publisher</Form.Label>
        <Form.Control
          type="text"
          name="publisher"
          value={publisher}
          onChange={handleChange}
        />
      </Form.Group> 
      <Form.Group>
        <Form.Label>Subject</Form.Label>
        <Form.Control
          type="text"
          name="subject"
          value={subject}
          onChange={handleChange}
        />
      </Form.Group>  
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={title}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Body</Form.Label>
        <Form.Control
          as="textarea"
          rows={10}
          name="body"
          value={body}
          onChange={handleChange}
        />
      </Form.Group>

      <Button className={styles.Button} variant="dark" onClick={() => history.goBack()}>
        cancel
      </Button>
      <Button className={styles.Button} variant="dark" type="submit">
        create
      </Button>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit} className={styles.Form}>
        <Row>
            <Col>
                <Container>
                    <h2>
                        Add to the conversation.
                    </h2>
                    <Form.Group>
                        {image ? (
                            <>
                                <figure>
                                    <Image src={image} rounded />
                                </figure>
                                <div>
                                    <Form.Label htmlFor="image-upload">
                                        Change the image
                                    </Form.Label>
                                </div>
                            </>
                        ) : (
                            <Form.Label htmlFor="image-upload">
                                Change the image
                            </Form.Label>
                        )}

                        <Form.File
                            id="image-upload"
                            accept="image/*"
                            onChange={handleChangeImage}
                            ref={imageInput}
                        />
                    </Form.Group>
                    {errors?.image?.map((message, idx) => (
                        <Alert variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                    <Container>
                        {textFields}
                    </Container>
                </Container>
            </Col>
        </Row>
    </Form>
  );
}



  



export default ArticleCreateForm;