import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import Article from "./Article";

import styles from "../../styles/ArticlesPage.module.css";
import { useLocation } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";

function ArticlesPage({ message, filter = "" }) {
    const [articles, setArticles] = useState({ results: [] });
    const [hasLoaded, setHasLoaded] = useState(false);
    const { pathname } = useLocation();

    const [query, setQuery] = useState("");

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const { data } = await axiosReq.get(`/articles/?${filter}search=${query}`);
                setArticles(data);
                setHasLoaded(true);
            } catch (err) {
                console.log(err);
            }
        };

        setHasLoaded(false);

        const timer = setTimeout(() => {
            fetchArticles();
        }, 1000);

        return () => {
            clearTimeout(timer);
        };

    }, [filter, query, pathname] )

    return (
        <Row>
            <Col>

                <div>
                    <h2>News, <em>Untilted</em></h2>
                </div>

                <Form 
                className={styles.SearchBar}
                onSubmit={(event) => event.preventDefault()}
                >
                    <Form.Control
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        type="text"
                        className="mr-sm-2"
                        placeholder="Search posts"
                    />
                </Form>
                
                
                {hasLoaded ? (
                <>
                    {articles.results.length ? (
                    <InfiniteScroll
                        children={articles.results.map((article) => (
                        <Article key={article.id} {...article} setPosts={setArticles} />
                        ))}
                        dataLength={articles.results.length}
                        loader="Loading..."
                        hasMore={!!articles.next}
                        next={() => fetchMoreData(articles, setArticles)}
                    />
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