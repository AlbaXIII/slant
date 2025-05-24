import React from "react";
import styles from "../../styles/Article.module.css";
import appStyles from "../../App.module.css";
import { useCurrentAuthUser } from "../../contexts/AuthUserContext";
import { Card, OverlayTrigger, Tooltip, Col, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Article = (props) => {
    const {
        id,
        owner,
        profile_id,
        comments_count,
        favourites_count,
        favourite_id,
        rating_id,
        ratings_count,
        publisher,
        subject,
        link,
        title,
        body,
        image,
        created_on,
        updated_on,
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

    return (
        <Card border="secondary" className={styles.cards}>
            <Card.Body>
                <span className={styles.profileinfo}> 
                    <Link to={`/profiles/${profile_id}`}>
                        <b>{owner}</b>
                    </Link>
                    {publisher && <Card.Title><em>{publisher}</em></Card.Title>}
                </span>
                <span className={styles.maininfo}>
                    {subject && <Card.Title>{subject}</Card.Title>}
                    {title && <Card.Title className={styles.title}>{title}</Card.Title>}
                    <span>{link}</span>
                    <span>{created_on}</span>
                    {is_owner && articlePage && "..."}
                </span>
            </Card.Body>
            <Link to={`/articles/${id}`}>
                <div>
                    <Card.Img variant="top" src={image} alt={title}/>
                </div>
            </Link>
            <Card.Body>
                {body && <Card.Text className={styles.body}>{body}</Card.Text>}
                <div>
                    {is_owner ? (
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>You cannot favourite your own submissions.</Tooltip>}
                        >
                            <i className="fa-regular fa-xl fa-star"></i>
                        </OverlayTrigger>
                    ) : favourite_id ? (
                        <span onClick={handleUnfavourite}>
                            <i className="fa-solid fa-xl fa-star"></i>
                        </span>
                    ) : currentUser ? (
                        <span onClick={handleFavourite}>
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
                    {favourites_count}
                    <Link to={`/articles/${id}`}>
                        <i className="fa-solid fa-comments"></i>
                    </Link>
                    {comments_count}
                    <Link to={`/articles/${id}`}>
                        <i className="fa-solid fa-gauge"></i>
                    </Link>
                    {ratings_count}
                </div>
            </Card.Body>
            <Card.Body>
                <Row>
                    {is_owner ? (
                        <Col>
                            <Link onClick={handleEdit}>
                                <i className="fas fa-edit" />
                            </Link>
                            <Link onClick={handleDelete}>
                                <i className="fas fa-trash-alt" />
                            </Link>
                        </Col>
                    ) : <Col>
                            <>
                            </>
                        </Col>}
                </Row>
            </Card.Body>
        </Card>
    );
};

export default Article
