import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Nav, Tab } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import { axiosReq } from "../../api/axiosDefaults";
import Article from '../articles/Article'; 
import { fetchMoreData } from "../../utils/utils";

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
        console.log(err);
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
        console.log(err);
        }
    };

    const getUserProfile = async (userId) => {
        try {
            const response = await axiosReq.get(`/profiles/${userId}/`);
            return response.data;
        } catch (err) {
        console.log(err);
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
                console.log(err);
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
                    loader={<div className="text-center">Loading more art...</div>}
                    hasMore={!!profileArticles.next}
                    next={() => fetchMoreData(profileArticles, setProfileArticles)}
                />
            ) : (
                <Container className="text-center">
                    <h4>{profile?.owner} hasn't posted any articles yet!</h4>
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
                    loader={<div className="text-center">Loading more favourites...</div>}
                    hasMore={!!favouriteArticles.next}
                    next={() => fetchMoreData(favouriteArticles, setfavouriteArticles)}
                />
            ) : (
                <Container className="text-center">
                    <h4>{profile?.owner} hasn't favourited any articles yet!</h4>
                </Container>
            )}
        </>
    );

    if (!hasLoaded && !error) {
        return (
            <Row>
                <Col className="py-2 p-0 p-lg-2" lg={8}>
                    <Container className="text-center">
                        <div>Loading profile...</div>
                    </Container>
                </Col>
            </Row>
        );
    }

    if (error) {
        return (
            <Row>
                <Col className="py-2 p-0 p-lg-2" lg={8}>
                    <Container className="text-center">
                        <h4>Error: {error}</h4>
                    </Container>
                </Col>
            </Row>
        );
    }

    return (
        <Row>
            <Col className="py-2 p-0 p-lg-2" lg={8}>
                <Container>
                    {profile ? (
                        <>
                            {/* Profile Header */}
                            <div className="text-center mb-4">
                                <h3>{profile.owner}'s Profile</h3>
                                {profile.bio && <p className="mb-3">{profile.bio}</p>}
                            </div>

                            {/* Tabbed Navigation */}
                            <Tab.Container 
                                activeKey={activeTab} 
                                onSelect={(k) => setActiveTab(k)}
                            >
                                <Nav variant="tabs" className="justify-content-center mb-4">
                                    <Nav.Item>
                                        <Nav.Link eventKey="articles">
                                            Articles ({profileArticles.results?.length || 0})
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="favourites">
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
                        <Container className="text-center">
                            <h4>User profile not found!</h4>
                        </Container>  
                    )}
                </Container>
            </Col>
        </Row>
    );
}

export default ProfilePage;