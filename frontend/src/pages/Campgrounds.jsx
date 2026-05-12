import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CampgroundClusterMap from "../components/CampgroundClusterMap";
import { useAuth } from "../context/AuthContext";
import { campAPI } from "../services/api";
import "../styles/campgrounds.css";

export default function Campgrounds() {
  const { user } = useAuth();
  const [campgrounds, setCampgrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCampgrounds();
  }, []);

  async function fetchCampgrounds() {
    try {
      const response = await campAPI.getAll();
      setCampgrounds(response.data.campgrounds || []);
    } catch {
      setError("Failed to load campgrounds");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="container py-5 text-center">Loading...</div>;
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <>
      <CampgroundClusterMap campgrounds={campgrounds} />

      <div className="container my-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="h3 mb-0">All Campgrounds</h1>
          {user && (
            <Link to="/campgrounds/new" className="btn btn-success">
              New Campground
            </Link>
          )}
        </div>

        {campgrounds.length === 0 ? (
          <div className="alert alert-info">No campgrounds found.</div>
        ) : (
          <div>
            {campgrounds.map((camp) => (
              <div className="card mb-3" key={camp._id}>
                <div className="row g-0">
                  <div className="col-md-4">
                    <img
                      className="img-fluid campground-index-img"
                      src={camp.images?.[0]?.url || "https://res.cloudinary.com/dvm6ebpga/image/upload/v1621511639/YelpCamp/itzzxpqusafoc5ktrdmw.jpg"}
                      alt={camp.title}
                    />
                  </div>

                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{camp.title}</h5>
                      <p className="card-text">{camp.description}</p>
                      <p className="card-text">
                        <small className="text-muted">{camp.location}</small>
                      </p>

                      <Link to={`/campgrounds/${camp._id}`} className="btn btn-primary">
                        Show {camp.title}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
