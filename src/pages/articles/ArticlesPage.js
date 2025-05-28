import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

import Article from "./Article";
import Asset from "../../components/Asset";

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
    const [selectedSubject, setSelectedSubject] = useState("all");
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [allArticles, setAllArticles] = useState({ results: [] });

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const { data } = await axiosReq.get(`/articles/?${filter}search=${query}`);
                setAllArticles(data);
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

     useEffect(() => {
        if (allArticles.results.length > 0) {
            const subjects = [...new Set(
                allArticles.results
                    .map(article => article.subject)
                    .filter(subject => subject && subject.trim() !== "")
            )].sort();
            
            setAvailableSubjects(subjects);

            if (selectedSubject === "all") {
                setArticles(allArticles);
            } else {
                const filteredResults = allArticles.results.filter(
                    article => article.subject === selectedSubject
                );
                setArticles({
                    ...allArticles,
                    results: filteredResults
                });
            }
        } else {
            setArticles(allArticles);
        }
    }, [allArticles, selectedSubject]);

    const clearFilters = () => {
        setSelectedSubject("all");
        setQuery("");
    };


    return (
        <Row>
            <Col>
                <Container className={styles.mainheaders}>
                    <div>
                        <h1>News, <em>Untilted.</em></h1>
                    </div>

                    <div>
                        <h2>Stories without the <em>noise.</em></h2>
                    </div>
                </Container>
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
                
                <div className={styles.subjectpane}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h4 className="mb-0 justify-content-center">Filter by Subject:</h4>
                            <div className="text-center">
                                {(selectedSubject !== "all" || query) && (
                                    <Button 
                                        variant="dark" 
                                        size="m"
                                        onClick={clearFilters}
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                            </div>
                    </div>
                    
                    <div className="d-flex flex-wrap p5 justify-content-center">
                        <Button
                            variant={selectedSubject === "all" ? "dark" : "outline-secondary"}
                            size="sm"
                            onClick={() => setSelectedSubject("all")}
                            className="mb-2"
                        >
                            All Subjects
                        </Button>
                        
                        {availableSubjects.map((subject) => (
                            <Button
                                key={subject}
                                variant={selectedSubject === subject ? "dark" : "outline-secondary"}
                                size="sm"
                                onClick={() => setSelectedSubject(subject)}
                                className="mb-2"
                            >
                                {subject}
                            </Button>
                        ))}
                    </div>
                </div>

                {(selectedSubject !== "all" || query) && (
                    <div className="mb-3 p-2 bg-light rounded">
                        <large>
                            Active filters: 
                            {selectedSubject !== "all" && (
                                <span className="badge bg-secondary ms-2 me-2 text-white">
                                    {selectedSubject}
                                </span>
                            )}
                            {query && (
                                <span className="badge bg-secondary ms-2 me-2 text-white">
                                    Search: "{query}"
                                </span>
                            )}
                        </large>
                    </div>
                )}
                
                {hasLoaded ? (
                <>
                    {articles.results.length ? (
                    <InfiniteScroll
                        children={articles.results.map((article) => (
                        <Article key={article.id} 
                        {...article} 
                        setPosts={setArticles}
                        showImageAndBody={false} 
                    />
                    ))}
                        dataLength={articles.results.length}
                        loader={<Asset spinner />}
                        hasMore={!!articles.next}
                        next={() => fetchMoreData(articles, setArticles)}
                    />
                    ) : (
                    <Container>
                                <div className={styles.noresults}>
                                    <h4>No articles found</h4>
                                    <p className="text-muted">
                                        {selectedSubject !== "all" || query 
                                            ? "Try adjusting your filters or search terms"
                                            : "No articles available at the moment"
                                        }
                                    </p>
                                </div>
                    </Container>
                    )}
                </>
                ) : (
                <Container>
                    <Row className={styles.loading}>
                        <Col>
                            {<Asset spinner />}
                        </Col>
                    </Row>
                </Container>
                )}
            </Col>
        </Row>
  );
}

export default ArticlesPage