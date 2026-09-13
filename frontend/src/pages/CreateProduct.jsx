import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] =
    useState([]);

  const [loadingCategories, setLoadingCategories] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    featured: false,
    returnable: false,
    productType: "Physical",
    availability: "Available",
    availableDate: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      setError("");

      const response =
        await api.get("/categories");

      setCategories(
        response.data.categories || []
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load categories"
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file"
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Image size must be 5MB or less"
      );
      return;
    }

    setError("");
    setImage(file);

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError(
        "Product name is required"
      );
      return;
    }

    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {
      setError("Enter a valid price");
      return;
    }

    if (
      formData.stock === "" ||
      Number(formData.stock) < 0
    ) {
      setError("Enter a valid stock");
      return;
    }

    if (!formData.categoryId) {
      setError("Please select a category");
      return;
    }

    try {
      setSubmitting(true);

      const data = new FormData();

      data.append(
        "name",
        formData.name.trim()
      );

      data.append(
        "sku",
        formData.sku.trim()
      );

      data.append(
        "description",
        formData.description.trim()
      );

      data.append(
        "price",
        String(Number(formData.price))
      );

      data.append(
        "stock",
        String(Number(formData.stock))
      );

      data.append(
        "categoryId",
        String(Number(formData.categoryId))
      );

      data.append(
        "featured",
        String(formData.featured)
      );

      data.append(
        "returnable",
        String(formData.returnable)
      );

      data.append(
        "productType",
        formData.productType
      );

      data.append(
        "availability",
        formData.availability
      );

      if (formData.availableDate) {
        data.append(
          "availableDate",
          formData.availableDate
        );
      }

      if (image) {
        data.append("image", image);
      }

      await api.post("/products", data);

      setSuccess(
        "Product created successfully"
      );

      setTimeout(() => {
        navigate("/products");
      }, 700);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to create product"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-shell">
      <div className="page-header">
        <div>
          <h1>Create Product</h1>
          <p>
            Add a new product to your inventory.
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            navigate("/products")
          }
        >
          Back to Products
        </button>
      </div>

      {success && (
        <div className="alert success-alert">
          {success}
        </div>
      )}

      {error && (
        <div className="alert error-alert">
          {error}
        </div>
      )}

      <form
        className="product-form"
        onSubmit={handleSubmit}
      >
        <section className="card form-section-card">
          <h2>Basic Information</h2>

          <div className="form-grid">
            <Field label="Product Name *">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                disabled={submitting}
              />
            </Field>

            <Field label="SKU">
              <input
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Enter SKU"
                disabled={submitting}
              />
            </Field>

            <Field
              label="Description"
              full
            >
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
                disabled={submitting}
              />
            </Field>
          </div>
        </section>

        <section className="card form-section-card">
          <h2>Pricing & Inventory</h2>

          <div className="form-grid">
            <Field label="Price *">
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                disabled={submitting}
              />
            </Field>

            <Field label="Stock *">
              <input
                name="stock"
                type="number"
                min="0"
                step="1"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                disabled={submitting}
              />
            </Field>

            <Field label="Category *">
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                disabled={
                  submitting ||
                  loadingCategories
                }
              >
                <option value="">
                  {loadingCategories
                    ? "Loading categories..."
                    : "Select category"}
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Available Date">
              <input
                name="availableDate"
                type="date"
                value={formData.availableDate}
                onChange={handleChange}
                disabled={submitting}
              />
            </Field>
          </div>
        </section>

        <section className="card form-section-card">
          <h2>Product Options</h2>

          <div className="option-grid">
            <label className="check-option">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                disabled={submitting}
              />
              Featured Product
            </label>

            <label className="check-option">
              <input
                type="checkbox"
                name="returnable"
                checked={formData.returnable}
                onChange={handleChange}
                disabled={submitting}
              />
              Returnable
            </label>
          </div>

          <div className="radio-block">
            <h3>Product Type</h3>

            <label>
              <input
                type="radio"
                name="productType"
                value="Physical"
                checked={
                  formData.productType ===
                  "Physical"
                }
                onChange={handleChange}
                disabled={submitting}
              />
              Physical
            </label>

            <label>
              <input
                type="radio"
                name="productType"
                value="Digital"
                checked={
                  formData.productType ===
                  "Digital"
                }
                onChange={handleChange}
                disabled={submitting}
              />
              Digital
            </label>
          </div>

          <div className="radio-block">
            <h3>Availability</h3>

            <label>
              <input
                type="radio"
                name="availability"
                value="Available"
                checked={
                  formData.availability ===
                  "Available"
                }
                onChange={handleChange}
                disabled={submitting}
              />
              Available
            </label>

            <label>
              <input
                type="radio"
                name="availability"
                value="Unavailable"
                checked={
                  formData.availability ===
                  "Unavailable"
                }
                onChange={handleChange}
                disabled={submitting}
              />
              Unavailable
            </label>
          </div>
        </section>

        <section className="card form-section-card">
          <h2>Product Image</h2>

          <div className="field">
            <label htmlFor="image">
              Choose Image
            </label>

            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={submitting}
            />
          </div>

          {preview && (
            <div className="image-preview-wrapper">
              <img
                src={preview}
                alt="Product preview"
                className="image-preview"
              />
            </div>
          )}
        </section>

        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              navigate("/products")
            }
            disabled={submitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={submitting}
          >
            {submitting
              ? "Creating..."
              : "Create Product"}
          </button>
        </div>
      </form>
    </main>
  );
}

function Field({
  label,
  children,
  full = false,
}) {
  return (
    <div
      className={`field ${
        full ? "full" : ""
      }`}
    >
      <label>{label}</label>
      {children}
    </div>
  );
}

export default CreateProduct;