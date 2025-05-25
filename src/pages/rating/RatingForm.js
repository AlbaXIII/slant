import React, {useState, useCallback, useEffect } from "react";
import { useParams } from "react-router";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import { useCurrentAuthUser } from "../../contexts/AuthUserContext";


function RatingForm() {

  const { id } = useParams();
  const [rating, setRating] = useState(5);
  const [averageRating, setAverageRating] = useState(0);
  const [userRating, setUserRating] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [hasUserRated, setHasUserRated] = useState(false);

  useEffect(() => {
    fetchRatingsData();
  }, [id]);

  const fetchRatingsData = async () => {
    try {
      const response = await axiosReq.get(`/ratings/?article=${id}`);
      const ratings = response.data.results || response.data;
      
      if (ratings.length > 0) {
        const total = ratings.reduce((sum, ratingObj) => sum + ratingObj.rating, 0);
        const average = total / ratings.length;
        setAverageRating(average);
        

        const currentUser = getCurrentUser();
        const existingUserRating = ratings.find(r => r.owner === currentUser?.username);
        
        if (existingUserRating) {
          setUserRating(existingUserRating.rating);
          setRating(existingUserRating.rating);
          setHasUserRated(true);
        }
      }
    } catch (err) {
      console.log('Error fetching ratings:', err);
    }
  };

  const getCurrentUser = useCurrentAuthUser();

  const handleChange = useCallback((event) => {
    const newRating = parseInt(event.target.value, 10);
    setRating(newRating);
  }, []);

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const requestData = {
        article: parseInt(id, 10),
        rating: rating
      };

      let response;
        if (hasUserRated) {
          response = await axiosRes.put(`/ratings/${userRating.id}/`, requestData);
          setSubmitMessage('Rating updated successfully!');
        } else {
          response = await axiosRes.post("/ratings/", requestData);
          setSubmitMessage('Rating submitted successfully!');
          setHasUserRated(true);
        }

      await fetchRatingsData();

        } catch (error) {
          console.error('Submission error:', error);
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
    }, [rating, id, hasUserRated, userRating]);

  return (
    <div>
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
          <hr></hr>
          <div>
            <span>(Left)</span>
            <span>
              Your Rating:{rating}/10
            </span>
            <span>(Right)</span>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
              isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            } text-white`}
          >
            {isSubmitting 
              ? 'Submitting...' 
              : hasUserRated 
                ? 'Update Rating' 
                : 'Submit Rating'
            }
          </button>
          
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
        <div>
          {hasUserRated && userRating && (
            <div>
              {userRating.rating}/10
            </div>
          )} 
        </div>
      </form>
    </div>
  );
}

export default RatingForm;
