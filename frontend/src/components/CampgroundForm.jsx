import { useState } from "react";
import { Link } from "react-router-dom";

export default function CampgroundForm({
  initialData,
  onSubmit,
  loading,
  title = "New Campground",
  submitLabel = "Create new Campground",
  loadingLabel = "Saving...",
  error = "",
}) {
  const descriptionLimit = 60;
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    location: initialData?.location || "",
    price: initialData?.price || "",
    description: initialData?.description || "",
  });

  const [images, setImages] = useState([]);
  const [deleteImages, setDeleteImages] = useState([]);
  const [errors, setErrors] = useState({});

  function validate() {
    const err = {};
    const title = formData.title.trim();
    const location = formData.location.trim();
    const description = formData.description.trim();
    const price = Number(formData.price);

    if (!title || title.length < 3)
      err.title = "Title must be at least 3 characters";

    if (title.length > 80)
      err.title = "Title must be 80 characters or fewer";

    if (!location)
      err.location = "Location is required";

    if (location.length > 120)
      err.location = "Location must be 120 characters or fewer";

    if (formData.price === "" || Number.isNaN(price) || price < 0)
      err.price = "Price must be 0 or more";

    if (!description)
      err.description = "Description is required";

    if (description.length > descriptionLimit)
      err.description = `Description must be ${descriptionLimit} characters or fewer`;

    setErrors(err);
    return Object.keys(err).length === 0;
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleImageChange(e) {
    setImages(Array.from(e.target.files || []));
  }

  function handleDeleteImageChange(e) {
    const { checked, value } = e.target;
    setDeleteImages((prev) =>
      checked ? [...prev, value] : prev.filter((filename) => filename !== value)
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const data = new FormData();
    data.append("campground[title]", formData.title.trim());
    data.append("campground[location]", formData.location.trim());
    data.append("campground[price]", formData.price);
    data.append("campground[description]", formData.description.trim());
    images.forEach((img) => data.append("image", img));
    deleteImages.forEach((filename) => data.append("deleteImages", filename));

    onSubmit(data);
  }

  return (
    <div className="container my-4">
      <div className="row">
        <h1 className="text-center mb-4">{title}</h1>
        <div className="col-md-6 offset-md-3">
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-3">
              <label className="form-label" htmlFor="title">Enter name</label>
              <input
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                minLength="3"
                maxLength="80"
                required
              />
              {errors.title && <div className="invalid-feedback">{errors.title}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="location">Enter location</label>
              <input
                className={`form-control ${errors.location ? "is-invalid" : ""}`}
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                maxLength="120"
                required
              />
              {errors.location && <div className="invalid-feedback">{errors.location}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="image">Upload images</label>
              <input
                className="form-control"
                type="file"
                id="image"
                name="image"
                accept="image/png,image/jpeg,image/jpg"
                multiple
                onChange={handleImageChange}
              />
            </div>

            {!!initialData?.images?.length && (
              <div className="mb-3">
                <p className="form-label mb-2">Current images</p>
                {initialData.images.map((image) => (
                  <div className="form-check" key={image.filename || image.url}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`delete-${image.filename}`}
                      value={image.filename}
                      checked={deleteImages.includes(image.filename)}
                      onChange={handleDeleteImageChange}
                    />
                    <label className="form-check-label" htmlFor={`delete-${image.filename}`}>
                      Delete {image.filename}
                    </label>
                  </div>
                ))}
              </div>
            )}

            <div className="mb-3">
              <label className="form-label" htmlFor="price">Enter price</label>
              <div className="input-group">
                <span className="input-group-text" id="price-label">$</span>
                <input
                  type="number"
                  className={`form-control ${errors.price ? "is-invalid" : ""}`}
                  id="price"
                  name="price"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  aria-describedby="price-label"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
                {errors.price && <div className="invalid-feedback">{errors.price}</div>}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="description">Enter description</label>
              <textarea
                className={`form-control ${errors.description ? "is-invalid" : ""}`}
                id="description"
                name="description"
                rows="3"
                maxLength={descriptionLimit}
                value={formData.description}
                onChange={handleChange}
                required
              />
              {errors.description && <div className="invalid-feedback">{errors.description}</div>}
              <div className="form-text">{formData.description.length}/{descriptionLimit} characters</div>
            </div>

            <div className="mb-3 d-flex align-items-center gap-3">
              <button className="btn btn-success" disabled={loading}>
                {loading ? loadingLabel : submitLabel}
              </button>
              <Link to="/campgrounds">Cancel</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
