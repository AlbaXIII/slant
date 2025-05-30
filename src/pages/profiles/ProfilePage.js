import React, { useState, useEffect } from 'react';

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";

import styles from "../../styles/ProfilePage.module.css"

import { useParams } from "react-router-dom";
import InfiniteScroll from 'react-infinite-scroll-component';

import { axiosReq } from "../../api/axiosDefaults";
import Article from "../articles/Article"; 
import Asset from "../../components/Asset";
import { fetchMoreData } from "../../utils/utils";
import { ProfileEditDropdown } from "../../components/MoreDropdown";

function ProfilePage() {
    const [hasLoaded, setHasLoaded] = useState(false);
    const [profileArticles, setProfileArticles] = useState({ results: [] });
    const [favouriteArticles, setfavouriteArticles] = useState({ results: [] });
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('articles');

    const { id } = useParams();

    const getUserArticles = async (userId) => {
        try {
            const response = await axiosReq.get(`/articles/`, {
                params: {
                    owner: userId 
                }
            });
            return response.data;
        } catch (err) {
        //console.log(err);
        }
    };

    const getUserfavourites = async (userId) => {
        try {
            const response = await axiosReq.get(`/articles/`, { 
                params: {
                    favourites__owner__profile: userId  
                }
            });
            return response.data;
        } catch (err) {
        //console.log(err);
        }
    };

    const getUserProfile = async (userId) => {
        try {
            const response = await axiosReq.get(`/profiles/${userId}/`);
            return response.data;
        } catch (err) {
        //console.log(err);
        }
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setHasLoaded(false);
                setError(null);
                
                const profileData = await getUserProfile(id);
                setProfile(profileData);
                
                const [articlesData, favouritesData] = await Promise.all([
                    getUserArticles(id),
                    getUserfavourites(id)
                ]);
                
                setProfileArticles(articlesData);
                setfavouriteArticles(favouritesData);
                
                setHasLoaded(true);
            } catch (err) {
                //console.log(err);
                setError('Failed to load profile data');
                setHasLoaded(true);
            }
        };

        if (id) {
            fetchProfileData();
        }
    }, [id]);

    const userArticlesTab = (
        <>
            {profileArticles.results?.length ? (
                <InfiniteScroll
                    children={profileArticles.results.map((article) => (
                        <Article 
                            key={article.id} 
                            {...article} 
                            setArticles={setProfileArticles} 
                        />
                    ))}
                    dataLength={profileArticles.results.length}
                    loader={<Asset spinner />}
                    hasMore={!!profileArticles.next}
                    next={() => fetchMoreData(profileArticles, setProfileArticles)}
                />
            ) : (
                <Container className="text-center">
                    <h4 className={styles.nofaves}>{profile?.owner} hasn't posted any articles yet!</h4>
                </Container>
            )}
        </>
    );

    const userfavouritesTab = (
        <>
            {favouriteArticles.results?.length ? (
                <InfiniteScroll
                    children={favouriteArticles.results.map((article) => (
                        <Article 
                            key={article.id} 
                            {...article} 
                            setArticles={setfavouriteArticles} 
                        />
                    ))}
                    dataLength={favouriteArticles.results.length}
                    loader={<Asset spinner />}
                    hasMore={!!favouriteArticles.next}
                    next={() => fetchMoreData(favouriteArticles, setfavouriteArticles)}
                />
            ) : (
                <Container className="text-center">
                    <h4 className={styles.nofaves}>{profile?.owner} hasn't favourited any articles yet!</h4>
                </Container>
            )}
        </>
    );

    if (!hasLoaded && !error) {
        return (
            <Row>
                <Col>
                    <Container className="text-center">
                        {<Asset spinner />}
                    </Container>
                </Col>
            </Row>
        );
    }

    if (error) {
        return (
            <Row>
                <Col>
                    <Container className="text-center">
                        <h4>Error: {error}</h4>
                    </Container>
                </Col>
            </Row>
        );
    }

    return (
        <Container>
            <Row>
                <Col>
                    {profile ? (
                        <>
                            <div className={styles.profileheader}>
                                <h3>{profile.owner}'s Profile</h3>
                                {profile.bio && <p>{profile.bio}</p>}
                                <Container>
                                    {profile?.is_owner && <ProfileEditDropdown id={profile?.id} />}
                                </Container>
                            </div>

                            <Tab.Container 
                                activeKey={activeTab} 
                                onSelect={(k) => setActiveTab(k)}
                            >
                                <Nav variant="tabs">
                                    <Nav.Item>
                                        <Nav.Link eventKey="articles" className={styles.tabs}>
                                            Articles ({profileArticles.results?.length || 0})
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="favourites" className={styles.tabs}>
                                            Favourites ({favouriteArticles.results?.length || 0})
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>

                                <Tab.Content>
                                    <Tab.Pane eventKey="articles">
                                        {userArticlesTab}
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="favourites">
                                        {userfavouritesTab}
                                    </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>
                        </>
                        ) : (
                        <Container>
                            <h4>User profile not found!</h4>
                        </Container>  
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default ProfilePage;