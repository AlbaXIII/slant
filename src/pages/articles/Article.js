import React from "react";
import styles from "../../styles/Article.module.css";
import { useCurrentAuthUser } from "../../contexts/AuthUserContext";
import { Card, Media, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";

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
        <Card>
            <Card.Body>
                <Link to={`/profiles/${profile_id}`}>
                    {owner}
                </Link>
                <div>
                    <span>{updated_on}</span>
                    {is_owner && articlePage && "..."}
                </div>
            </Card.Body>
            <Link to={`/articles/${id}`}>
                <Card.Img src={image} alt={title} />
            </Link>
            <Card.Body>
                {publisher && <Card.Title>{publisher}</Card.Title>}
                {subject && <Card.Text>{subject}</Card.Text>}
                {title && <Card.Title>{title}</Card.Title>}
                {body && <Card.Text>{body}</Card.Text>}
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
                </div>
            </Card.Body>
        </Card>
    );
};

export default Article
