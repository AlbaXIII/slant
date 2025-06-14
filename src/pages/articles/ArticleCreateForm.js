import React, { useRef, useState } from "react";
import { useRedirect } from "../../hooks/useRedirect";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

import { Image } from "react-bootstrap"

import styles from "../../styles/ArticleCreateEditForm.module.css";

import { useHistory } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

function ArticleCreateForm() {
  useRedirect("loggedOut");
  const [errors, setErrors] = useState({});

  const [articleData, setArticleData] = useState({
    publisher: "",
    subject: "",
    title: "",
    link:"",
    body: "",
    image: "",
  });

  const { publisher, subject, title, link, body, image, } = articleData;

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
    formData.append("link", link)
    formData.append("body", body)
    
    if (imageInput.current.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }

    try {
        const { data } = await axiosReq.post("/articles/", formData);
        history.push(`/articles/${data.id}`);
    } catch (err) {
        //console.log(err);
        if (err.response?.status !== 401) {
            setErrors(err.response?.data);
        }
    }
  }

  const textFields = (
      <Container> 
        <Row>
          <Col>
            <Form.Group>
              <Form.Label className="d-none">Publisher</Form.Label>
              <Form.Control
                as="select"
                name="publisher"
                value={publisher}
                onChange={handleChange}
                placeholder="Publisher*"
                aria-label="publisher"
                required
              >
                <option value="original content">Original Content</option>
                <option value="the guardian">The Guardian</option>
                <option value="daily mai">Daily Mail</option>
                <option value="the independant">The Independant</option>
                <option value="daily telegraph">Daily Telegraph</option>
                <option value="daily express">Daily Express</option>
                <option value="the sun">The Sun</option>
                <option value="financial times">Financial Times</option>
                <option value="metro">Metro</option> 
                <option value="the times">The Times</option> 
                <option value="other">Other</option> 
              </Form.Control>
            </Form.Group> 
            <Form.Group>
              <Form.Label className="d-none">Subject</Form.Label>
              <Form.Control
                as="select"
                name="subject"
                value={subject}
                onChange={handleChange}
                aria-label="subject"
                required
              >
                <option value="news">News</option>
                <option value="sport">Sport</option>
                <option value="culture">Culture</option>
                <option value="opinion">Opinion</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="reviews">Reviews</option>
                <option value="travel">Travel</option>
                <option value="other">Other</option>
              </Form.Control>
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
              Create
            </Button>
          </Col>
        </Row>
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
                                  <hr></hr>
                                  <div>Upload an image</div>
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

export default ArticleCreateForm;