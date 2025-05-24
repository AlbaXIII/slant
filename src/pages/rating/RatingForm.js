import React, {useState, useCallback} from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useParams } from "react-router";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import Article from "../articles/Article";


function RatingForm() {

  const { id } = useParams();
  const [article, setArticle] = useState({ results: [] });

  const [rating, setRating] = useState();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = useCallback((event) => {
    const newRating = parseInt(event.target.value, 10);
    setRating(newRating);
    console.log('Slider moved to:', newRating);
  }, []);
  
  const handleRating = async (data) => {
    try {
        const { data } = await axiosRes.post("/ratings/", { article: id });
        setArticle((prevArticles) => ({
            ...prevArticles,
            results: prevArticles.results.map((article) => {
                return article.id === id
                    ? { ...article, favourites_count: article.rating_count + 1, rating_id: data.id }
                    : article;
                }),
            }));
        } catch (err) {
        console.log(err);
        }
    };

  const handleSubmit = useCallback(async (event) => {

    event.preventDefault()

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const formData = {
        rating: rating,
        timestamp: new Date().toISOString(),
      };

      const result = await handleRating(formData);
      
      if (result.success) {
        setSubmitMessage('✅ Rating submitted successfully!');
      } else {
        setSubmitMessage('❌ Failed to submit rating. Please try again.');
      }
      } catch (error) {
      console.error('Submission error:', error);
      setSubmitMessage('❌ Network error. Please check your connection.');
      } finally {
      setIsSubmitting(false);
      }
    }, [rating]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        {/* Range Input Section */}
        <div className="space-y-4">
          <label >
            Please rate from Left to Right:
          </label>
          
          {/* The range input itself */}
          <input
            id="rating-range"
            type="range"
            min="1"
            max="10"
            value={rating}
            onChange={handleChange}
          />
          <span className="font-semibold text-lg text-blue-600">
            Current: {rating}
          </span>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            } text-white`}
            >
            {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </button>
        </div>
    </form>
  );
}

export default RatingForm
