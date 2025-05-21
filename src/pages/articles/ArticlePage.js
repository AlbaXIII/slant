import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Article from "./Article"
// import { set } from "msw/lib/types/context";

function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: article }] = await Promise.all([
          axiosReq.get(`/articles/${id}`),
        ]);
        setArticle({ results: [article] });
        console.log(article);
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [id]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <Article {...article.results[0]} setArticle={setArticle} ArticlePage />
        <Container>Comments</Container>
      </Col>
    </Row>
  );
}

export default ArticlePage;