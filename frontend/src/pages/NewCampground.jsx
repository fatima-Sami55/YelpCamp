import CampgroundForm from "../components/CampgroundForm";
import { campAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/campground-form.css";

export default function NewCampground() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function createCamp(data) {
    setLoading(true);
    setError("");
    try {
      const res = await campAPI.create(data);
      navigate(`/campgrounds/${res.data.campground._id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create campground");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CampgroundForm
      onSubmit={createCamp}
      loading={loading}
      title="New Campground"
      submitLabel="Create new Campground"
      loadingLabel="Creating..."
      error={error}
    />
  );
}
