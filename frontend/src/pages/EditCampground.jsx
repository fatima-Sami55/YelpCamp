import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { campAPI } from "../services/api";
import CampgroundForm from "../components/CampgroundForm";
import "../styles/campground-form.css";

export default function EditCampground() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [camp, setCamp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  // Fetch existing campground
  useEffect(() => {
    const fetchCamp = async () => {
      try {
        const res = await campAPI.getById(id);
        setCamp(res.data.campground);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load campground");
      } finally {
        setFetching(false);
      }
    };

    fetchCamp();
  }, [id]);

  // Update handler
  const handleUpdate = async (formData) => {
    setLoading(true);
    setError("");

    try {
      await campAPI.update(id, formData);
      navigate(`/campgrounds/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update campground");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="container py-5 text-center">Loading campground...</div>;
  if (error && !camp) return <div className="container py-5"><div className="alert alert-danger">{error}</div></div>;

  return (
    camp && (
      <CampgroundForm
        initialData={camp}
        onSubmit={handleUpdate}
        loading={loading}
        title="Edit Campground"
        submitLabel="Update Campground"
        loadingLabel="Updating..."
        error={error}
      />
    )
  );
}
