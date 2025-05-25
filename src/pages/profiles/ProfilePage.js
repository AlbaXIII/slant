import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import { axiosReq } from "../../api/axiosDefaults";
import Article from '../articles/Article'; 
import { fetchMoreData } from "../../utils/utils";

function ProfilePage() {
    const [hasLoaded, setHasLoaded] = useState(false);
    const [profileArticles, setProfileArticles] = useState({ results: [] });
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);

    const { id } = useParams();

    const getUserArticles = async (userId) => {
        try {
            const response = await axiosReq.get(`/articles/`, {
                params: {
                    owner: userId 
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching user articles:', error);
            throw error;
        }
    };

    const getUserProfile = async (userId) => {
        try {
            const response = await axiosReq.get(`/profiles/${userId}/`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setHasLoaded(false);
                setError(null);
                
                const profileData = await getUserProfile(id);
                setProfile(profileData);
                
                const articlesData = await getUserArticles(id);
                setProfileArticles(articlesData);
                
                setHasLoaded(true);
            } catch (err) {
                console.error('Error loading profile data:', err);
                setError('Failed to load profile data');
                setHasLoaded(true);
            }
        };

        if (id) {
            fetchProfileData();
        }
    }, [id]);

    const mainProfilePosts = (
        <>
            <hr />
            <p className="text-center">{profile?.owner || 'User'}'s posts</p>
            <hr />
            {profileArticles.results?.length ? (
                <InfiniteScroll
                    children={profileArticles.results.map((article) => (
                        <Article 
                            key={article.id} 
                            {...article} 
                            setPosts={setProfileArticles} 
                        />
                    ))}
                    dataLength={profileArticles.results.length}
                    loader={<div className="text-center">Loading...</div>}
                    hasMore={!!profileArticles.next}
                    next={() => fetchMoreData(profileArticles, setProfileArticles)}
                />
            ) : (
                <Container className="text-center">
                    <h4>User has not posted yet!</h4>
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
                            <div className="text-center mb-3">
                                <h3>{profile.owner}'s Profile</h3>
                                {profile.bio && <p>{profile.bio}</p>}
                            </div>
                            {mainProfilePosts}
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