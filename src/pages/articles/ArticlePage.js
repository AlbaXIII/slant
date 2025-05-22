import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import CommentCreateForm from "../comments/commentCreateForm";
import { useCurrentAuthUser } from "../../contexts/AuthUserContext";

import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Article from "./Article"
import Comment from "../comments/Comment";

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
          axiosReq.get(`/comments/?articles=${id}`),
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
        <Article {...article.results[0]} setArticle={setArticle} ArticlePage />
        <Container>
          {currentUser ? (
            <CommentCreateForm
              profile_id={currentUser.profile_id}
              article={id}
              setArticle={setArticle}
              setComments={setComments}
            />
          ) : comments.results.length ? (
            "Comments"
          ) : null}
          {comments.results.length ? (
            comments.results.map((comment) => (
              <Comment key={comment.id} {...comment} />
            ))
          ) : currentUser ? (
            <span>Be the first to comment!</span>
          ) : (
            <span>No comments... yet</span>
          )}
        </Container>
      </Col>
    </Row>
  );
}

export default ArticlePage;