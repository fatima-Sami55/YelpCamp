/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CampgroundMap from "../components/CampgroundMap";
import { useAuth } from "../context/AuthContext";
import { campAPI, reviewAPI } from "../services/api";
import "../styles/detail.css";

export default function CampgroundDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [camp, setCamp] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    body: "",
  });

  const fetchCampground = useCallback(async () => {
    try {
      const response = await campAPI.getById(id);
      const campground = response.data.campground;
      setCamp(campground);
      setReviews(campground.reviews || []);
    } catch {
      setError("Failed to load campground");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCampground();
  }, [fetchCampground]);

  async function handleReviewSubmit(e) {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await reviewAPI.create(id, { review: reviewForm });
      setReviewForm({ rating: 5, body: "" });
      fetchCampground();
    } catch {
      setError("Failed to submit review");
    }
  }

  async function handleDeleteCamp() {
    const confirmDelete = window.confirm("Are you sure you want to delete this campground?");
    if (!confirmDelete) return;

    try {
      await campAPI.delete(id);
      navigate("/campgrounds");
    } catch {
      setError("Failed to delete campground");
    }
  }

  async function handleDeleteReview(reviewId) {
    try {
      await reviewAPI.delete(id, reviewId);
      fetchCampground();
    } catch {
      setError("Failed to delete review");
    }
  }

  if (loading) return <div className="container py-5 text-center">Loading...</div>;
  if (error) return <div className="container py-5"><div className="alert alert-danger">{error}</div></div>;
  if (!camp) return <div className="container py-5"><div className="alert alert-danger">Campground not found</div></div>;

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-lg-6">
          <div id="campgroundCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {(camp.images?.length ? camp.images : [{ url: "https://res.cloudinary.com/dvm6ebpga/image/upload/v1621511639/YelpCamp/itzzxpqusafoc5ktrdmw.jpg" }]).map((img, index) => (
                <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={img.filename || img.url}>
                  <img src={img.url} className="d-block w-100 detail-carousel-img" alt={camp.title} />
                </div>
              ))}
            </div>

            {camp.images?.length > 1 && (
              <>
                <button className="carousel-control-prev" type="button" data-bs-target="#campgroundCarousel" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true" />
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#campgroundCarousel" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true" />
                  <span className="visually-hidden">Next</span>
                </button>
              </>
            )}
          </div>

          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{camp.title}</h5>
              <p className="card-text">{camp.description}</p>
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item text-muted">{camp.location}</li>
              <li className="list-group-item">${camp.price}/night</li>
              {camp.author && (
                <li className="list-group-item">Submitted by {camp.author.username}</li>
              )}
            </ul>

            <div className="card-body">
              {user && user._id === camp.author?._id && (
                <>
                  <Link to={`/campgrounds/${id}/edit`} className="card-link btn btn-warning">
                    Edit
                  </Link>
                  <button className="card-link btn btn-danger" onClick={handleDeleteCamp}>
                    Delete
                  </button>
                </>
              )}
              <Link to="/campgrounds" className="card-link btn btn-success">
                Back to all Camps
              </Link>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <CampgroundMap campground={camp} />

          {user && (
            <>
              <h2 className="h4 mt-3">Leave a review</h2>
              <form onSubmit={handleReviewSubmit} className="mb-3">
                <div className="mb-3">
                  <div className="star-rating" aria-label="Rating">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        type="button"
                        className={`star-button ${rating <= reviewForm.rating ? "selected" : ""}`}
                        key={rating}
                        onClick={() => setReviewForm({ ...reviewForm, rating })}
                        aria-label={`${rating} star${rating > 1 ? "s" : ""}`}
                        aria-pressed={Number(reviewForm.rating) === rating}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="body">Review</label>
                  <textarea
                    className="form-control"
                    id="body"
                    rows="3"
                    value={reviewForm.body}
                    onChange={(e) => setReviewForm({ ...reviewForm, body: e.target.value })}
                    required
                  />
                </div>
                <button className="btn btn-success">Submit</button>
              </form>
            </>
          )}

          {reviews.map((review) => (
            <div className="card mb-3" key={review._id}>
              <div className="card-body">
                <h5 className="card-title">{review.author?.username}</h5>
                <p className="review-rating" aria-label={`Rated ${review.rating} stars`}>
                  {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </p>
                <p className="card-text">Review: {review.body}</p>
                {user && user._id === review.author?._id && (
                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteReview(review._id)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
