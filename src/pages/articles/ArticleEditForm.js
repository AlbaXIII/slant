import React, { useEffect, useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { Image } from "react-bootstrap"

import styles from "../../styles/ArticleCreateEditForm.module.css";

import { useHistory, useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

function ArticleEditForm() {

  const [errors, setErrors] = useState({});
  // const currentUser = useCurrentAuthUser;

  const [articleData, setArticleData] = useState({
    publisher: "",
    subject: "",
    title: "",
    link: "",
    body: "",
    image: "",
  });

  const { publisher, subject, title, link, body, image } = articleData;

  const imageInput = useRef(null);
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/articles/${id}/`);
        const { publisher, subject, title, link, body, image, is_owner } = data;

        is_owner ? setArticleData({ publisher, subject, title, link, body, image }) : history.push("/");
      } catch (err) {
        console.log(err);
      }
    };
    
    handleMount();
  }, [history, id]);

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
    formData.append("link", link)
    formData.append("body", body)
    formData.append("image", imageInput.current.files[0]);

    if (imageInput?.current?.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }

    try {
      await axiosReq.put(`/articles/${id}/`, formData);
      history.push(`/articles/${id}`);
    } catch (err) {
      console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  const textFields = (
      <Container>
        <Form.Group>
          <Form.Label className="d-none">Publisher</Form.Label>
          <Form.Control
            type="text"
            name="publisher"
            value={publisher}
            onChange={handleChange}
            placeholder="Publisher*"
            required
          />
        </Form.Group> 
        <Form.Group>
          <Form.Label className="d-none">Subject</Form.Label>
          <Form.Control
            type="text"
            name="subject"
            value={subject}
            onChange={handleChange}
            placeholder="Subject*"
            required
          />
        </Form.Group>  
        <Form.Group>
          <Form.Label className="d-none">Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={title}
            placeholder="Title*"
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="d-none">Link</Form.Label>
          <Form.Control
          type="text"
          name="link"
          value={link}
          placeholder="Link"
          onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label className="d-none">Body</Form.Label>
          <Form.Control
            as="textarea"
            rows={10}
            name="body"
            value={body}
            placeholder="Body text (optional)"
            onChange={handleChange}
          />
        </Form.Group>
      
        <Button className={styles.Button} variant="dark" onClick={() => history.goBack()}>
          Cancel
        </Button>
        <Button className={styles.Button} variant="dark" type="submit">
          Edit
        </Button>
      </Container>
  );

  return (
    <Form onSubmit={handleSubmit} className={styles.container}>
        <Row>
            <Col>
                <Container>
                    <h2 className={styles.heading}>
                        Add to the <em>conversation.</em>
                    </h2>
                    <div className={styles.imageupload}>
                      <Form.Group>
                          {image ? (
                              <>
                                  <figure>
                                      <Image src={image} rounded />
                                  </figure>
                                  <div>
                                      <Form.Label htmlFor="image-upload">
                                          <i height="35" class="fa-solid fa-2xl fa-arrow-up-from-bracket"></i>
                                      </Form.Label>
                                  </div>
                              </>
                          ) : (
                              <Form.Label htmlFor="image-upload">
                                  <i height="35" class="fa-solid fa-2xl fa-arrow-up-from-bracket"></i>
                              </Form.Label>
                          )}

                          <Form.File
                              id="image-upload"
                              accept="image/*"
                              onChange={handleChangeImage}
                              ref={imageInput}
                          />
                      </Form.Group>
                    </div>
                    {errors?.image?.map((message, idx) => (
                        <Alert variant="warning" key={idx}>
                            {message}
                        </Alert>
                    ))}
                    <div className={styles.formfields}>
                      <Container>
                          {textFields}
                      </Container>
                    </div>
                </Container>
            </Col>
        </Row>
    </Form>
  );
}

export default ArticleEditForm;