import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import Article from "./Article";

import styles from "../../styles/ArticlesPage.module.css";
import appStyles from "../../App.module.css";
import { useLocation } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

function ArticlesPage({ message, filter = "" }) {
    const [articles, setArticles] = useState({ results: [] });
    const [hasLoaded, setHasLoaded] = useState(false);
    const { pathname } = useLocation();

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const { data } = await axiosReq.get(`/articles/?${filter}`);
                setArticles(data);
                setHasLoaded(true);
            } catch (err) {
                console.log(err);
            }
        };

        setHasLoaded(false);
        fetchArticles();
    }, [filter, pathname] )

    return (
        <Row>
            <Col>
                {hasLoaded ? (
                <>
                    {articles.results.length ? (
                    articles.results.map((article) => (
                        <Article key={article.id} {...article} setPosts={setArticles} />
                    ))
                    ) : (
                    <Container>
                        No results.
                    </Container>
                    )}
                </>
                ) : (
                <Container className={styles.loading}>
                    Loading articles...
                </Container>
                )}
            </Col>
        </Row>
  );
}

export default ArticlesPage