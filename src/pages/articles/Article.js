import React from "react";
import styles from "../../styles/Article.module.css";
import { useCurrentAuthUser } from "../../contexts/AuthUserContext";
import { Card, OverlayTrigger, Tooltip } from "react-bootstrap";
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { MoreDropdown } from "../../components/MoreDropdown";

const Article = (props) => {
    const {
        id,
        owner,
        profile_id,
        comments_count,
        favourites_count,
        favourite_id,
        publisher,
        subject,
        link,
        title,
        body,
        image,
        created_on,
        articlePage,
        setArticles,
    } = props;

    const currentUser = useCurrentAuthUser();
    const is_owner = currentUser?.username === owner;
    const history = useHistory();

    const handleEdit = () => {
        history.push(`/articles/${id}/edit`);
    }

    const handleDelete = async () => {
        try {
        await axiosRes.delete(`/articles/${id}/`);
        history.goBack();
        } catch (err) {
        console.log(err);
        }
    };

    const handleFavourite = async () => {
        try {
            const { data } = await axiosRes.post("/favourites/", { article: id });
            setArticles((prevArticles) => ({
                ...prevArticles,
                results: prevArticles.results.map((article) => {
                    return article.id === id
                        ? { ...article, favourites_count: article.favourites_count + 1, favourite_id: data.id }
                        : article;
                }),
            }));
        } catch (err) {
        console.log(err);
        }
    };

    const handleUnfavourite = async () => {
        try {
            await axiosRes.delete(`/favourites/${favourite_id}/`);
            setArticles((prevArticles) => ({
                ...prevArticles,
                results: prevArticles.results.map((article) => {
                    return article.id === id
                        ? { ...article, likes_count: article.likes_count - 1, favourite_id: null }
                        : article;
                }),
            }));
        } catch (err) {
        console.log(err);
        }
    };

    if (articlePage) {
        return (
            <Card border="secondary">
                {image && (
                    <div style={{ maxHeight: '400px', overflow: 'hidden' }}>
                        <Card.Img 
                            variant="top" 
                            src={image} 
                            alt={title}
                            style={{ 
                                width: '100%', 
                                height: 'auto',
                                maxHeight: '400px',
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                )}
                <ListGroup>
                    <ListGroup.Item>
                        <Link to={`/profiles/${profile_id}`}>
                            <strong>{owner}</strong>
                        </Link>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        {created_on}
                    </ListGroup.Item>

                    <ListGroup.Item className={styles.maininfo}>
                        {subject && (
                            <div className="mb-2">
                                <span className="badge bg-secondary">{subject}</span>
                            </div>
                        )}
                        {title && <Card.Title className={styles.title}>{title}</Card.Title>}
                        {publisher && (
                            <Card.Subtitle className="mb-2 text-muted">
                                <em>{publisher}</em>
                            </Card.Subtitle>
                        )}
                        {link && (
                            <div className="mb-3">
                                <span>{link}</span>
                            </div>
                        )}
                    </ListGroup.Item>
                </ListGroup>

                <Card.Body>   
                    {body && <Card.Text className={styles.body}>{body}</Card.Text>}

                    <div className={styles.engagement}>
                        <div className="d-flex align-items-center gap-1">
                            {is_owner ? (
                                <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip>You cannot favourite your own submissions.</Tooltip>}
                                >
                                    <i className="fa-regular fa-xl fa-star"></i>
                                </OverlayTrigger>
                            ) : favourite_id ? (
                                <span onClick={handleUnfavourite} style={{ cursor: 'pointer' }}>
                                    <i className="fa-solid fa-xl fa-star text-warning"></i>
                                </span>
                            ) : currentUser ? (
                                <span onClick={handleFavourite} style={{ cursor: 'pointer' }}>
                                    <i className="fa-regular fa-xl fa-star"></i>
                                </span>
                            ) : (
                                <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip>Log in to favourite posts!</Tooltip>}
                                >
                                    <i className="fa-regular fa-xl fa-star"></i>
                                </OverlayTrigger>
                            )}
                            <span className="fw-bold">{favourites_count}</span>
                            <Link to={`/articles/${id}`} className="text-decoration-none">
                                <i className="fa-solid fa-comments"></i>
                            </Link>
                            <span className="fw-bold mr-4">{comments_count}</span>
                            {is_owner && (
                            <MoreDropdown
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                            />
                            )}
                        </div>
                    </div>
                </Card.Body>
            </Card>
        )
    }

    return (
        <Card border="secondary" className={`${styles.cards} mb-3`}>
            <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1 me-3">
                        <div className="mb-2">
                            <Link to={`/profiles/${profile_id}`} className="text-decoration-none">
                                <strong>{owner}</strong>
                            </Link>
                            <div className="text-muted small">{created_on}</div>
                        </div>   
                        {title && (
                            <div className="mb-2">
                                <Link to={`/articles/${id}`} className="text-decoration-none">
                                    <Card.Title className={styles.title}>{title}</Card.Title>
                                </Link>
                            </div>
                        )}
                        {subject && (
                            <div className="mb-2">
                                <span className="badge bg-secondary">{subject}</span>
                            </div>
                        )}
                        {publisher && (
                            <div className="mb-2">
                                <small className="text-muted">
                                    Publisher: <em>{publisher}</em>
                                </small>
                            </div>
                        )}
                        {link && (
                            <div className="mb-3">
                                <span>{link}</span>
                            </div>
                        )}
                    </div>
                    <div className="d-flex flex-column align-items-end gap-2">
                        <div className="d-flex align-items-center gap-1">
                            {is_owner ? (
                                <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip>You cannot favourite your own submissions.</Tooltip>}
                                >
                                    <i className="fa-regular fa-star text-muted"></i>
                                </OverlayTrigger>
                            ) : favourite_id ? (
                                <span onClick={handleUnfavourite} style={{ cursor: 'pointer' }}>
                                    <i className="fa-solid fa-star text-warning"></i>
                                </span>
                            ) : currentUser ? (
                                <span onClick={handleFavourite} style={{ cursor: 'pointer' }}>
                                    <i className="fa-regular fa-star"></i>
                                </span>
                            ) : (
                                <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip>Log in to favourite posts!</Tooltip>}
                                >
                                    <i className="fa-regular fa-star text-muted"></i>
                                </OverlayTrigger>
                            )}
                            <span className="fw-bold">{favourites_count}</span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                            <Link to={`/articles/${id}`} className="text-decoration-none">
                                <i className="fa-solid fa-comments"></i>
                            </Link>
                            <span className="fw-bold">{comments_count}</span>
                        </div>
                        {is_owner && (
                            <MoreDropdown
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                            />
                        )}
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default Article
