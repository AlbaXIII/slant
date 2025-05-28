import React, { useState, useCallback, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import { useCurrentAuthUser } from "../../contexts/AuthUserContext";
import styles from "../../styles/RatingForm.module.css";

function RatingForm() {
  const { id } = useParams();
  const currentUser = useCurrentAuthUser();
  const [rating, setRating] = useState(5);
  const [averageRating, setAverageRating] = useState(0);
  const [userRating, setUserRating] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [hasUserRated, setHasUserRated] = useState(false);

  const fetchRatingsData = useCallback(async () => {
    if (!id) return;
    
    try {
      console.log('Fetching ratings for article ID:', id);
      
      try {
        const statsResponse = await axiosReq.get(`/articles/${id}/rating-stats/`);
        setAverageRating(statsResponse.data.average_rating || 0);
      } catch (statsError) {
        
        const ratingsResponse = await axiosReq.get(`/ratings/?article=${id}`);
        const ratings = ratingsResponse.data.results || ratingsResponse.data;
        
        if (ratings.length > 0) {
          const total = ratings.reduce((sum, ratingObj) => sum + ratingObj.rating, 0);
          const average = total / ratings.length;
          setAverageRating(average);
        } else {
          setAverageRating(0);
        }
      }

      if (currentUser) {
        const userRatingsResponse = await axiosReq.get(`/ratings/?article=${id}`);
        const ratings = userRatingsResponse.data.results || userRatingsResponse.data;
        
        const existingUserRating = ratings.find(r => r.owner === currentUser.username);
        
        if (existingUserRating) {
          setUserRating(existingUserRating);
          setRating(existingUserRating.rating);
          setHasUserRated(true);
        } else {
          setHasUserRated(false);
          setUserRating(null);
        }
      }
    } catch (err) {
      setAverageRating(0);
    }
  }, [id, currentUser]);

  useEffect(() => {
    fetchRatingsData();
  }, [fetchRatingsData]);

  const handleChange = useCallback((event) => {
    const newRating = parseInt(event.target.value, 10);
    setRating(newRating);
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    if (!currentUser) {
      setSubmitMessage('Please log in to submit a rating.');
      setIsSubmitting(false);
      return;
    }

    try {
      const requestData = {
        article: parseInt(id, 10),
        rating: rating
      };

      if (hasUserRated && userRating) {
        await axiosRes.put(`/ratings/${userRating.id}/`, requestData);
        setSubmitMessage('Rating updated successfully!');
      } else {
        await axiosRes.post("/ratings/", requestData);
        setSubmitMessage('Rating submitted successfully!');
        setHasUserRated(true);
      }

      await fetchRatingsData();

    } catch (error) {
      if (error.response?.data?.detail === 'possible duplicate') {
        setSubmitMessage('You have already rated this article.');
      } else if (error.response?.status === 401) {
        setSubmitMessage('Please log in to submit a rating.');
      } else {
        setSubmitMessage('Failed to submit rating. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [rating, id, hasUserRated, userRating, currentUser, fetchRatingsData]);

  return (
    <div className={styles.ratingform}>
      <div>
        <label>
          Average Rating: {averageRating.toFixed(1)}
        </label>
        
        <input
          type="range"
          min="1"
          max="10"
          value={averageRating}
          disabled
        />
      </div>

      {currentUser ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label>
              {hasUserRated ? 'Update your rating:' : 'Please rate from 1 to 10:'}
            </label>
            
            <input
              id="rating-range"
              type="range"
              min="1"
              max="10"
              value={rating}
              onChange={handleChange}
            />
            <hr />
            <div>
              <span>
                Your Rating: {rating}/10
              </span>
            </div>
            
            <Button
              type="submit"
              disabled={isSubmitting}
              variant="dark"
              className={`font-medium ${
                isSubmitting
                  ? 'cursor-not-allowed'
                  : 'hover:bg-blue-700 active:bg-blue-800'
              } text-black`}
            >
              {isSubmitting 
                ? 'Submitting...' 
                : hasUserRated 
                  ? 'Update Rating' 
                  : 'Submit Rating'
              }
            </Button>
            
            {submitMessage && (
              <div className={`p-3 rounded-md text-sm ${
                submitMessage.includes('successfully') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {submitMessage}
              </div>
            )}
          </div>
        </form>
      ) : (
        <div className="p-3 text-sm">
          Please log in to rate this article.
        </div>
      )}
    </div>
  );
}

export default RatingForm;