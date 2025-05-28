import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import CommentCreateForm from "../comments/CommentCreateForm";
import { useCurrentAuthUser } from "../../contexts/AuthUserContext";

import styles from "../../styles/ArticlePage.module.css";

import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Article from "./Article"
import Comment from "../comments/Comment";
import RatingForm from "../rating/RatingForm";

function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState({ results: [] });

  const currentUser = useCurrentAuthUser();
  const [ comments, setComments ] = useState({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: article }, { data: comments }] = await Promise.all([
          axiosReq.get(`/articles/${id}`),
          axiosReq.get(`/comments/?article=${id}`),
        ]);
        setArticle({ results: [article] });
        console.log(article);
        setComments(comments);
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [id]);

  return (
    <Row>
      <Col>
        <Article 
          {...article.results[0]} 
          setArticle={setArticle} 
          articlePage={true}
        />
        <Container>
          <RatingForm />
        </Container>
        <Container className={styles.comments}>
          {currentUser ? (
            <CommentCreateForm
              profile_id={currentUser.profile_id}
              article={id}
              setArticle={setArticle}
              setComments={setComments}
            />
          ) : null}
          {comments.results.length ? (
            comments.results.map((comment) => (
              <Comment 
                key={comment.id} 
                {...comment} 
                setArticle={setArticle} 
                setComments={setComments} 
              />
            ))
          ) : currentUser ? (
            <div className={styles.commentplaceholder}><b>Be the first to comment!</b></div>
          ) : (
            <div className={styles.commentplaceholder}><b>No comments... yet.</b></div>
          )}
        </Container>
      </Col>
    </Row>
  );
}

export default ArticlePage;