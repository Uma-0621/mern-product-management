import {
  useEffect,
  useState,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import api from "../services/api";

const API_ORIGIN = "http://localhost:5000";

function imageUrl(path) {
  if (!path) {
    return "";
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return `${API_ORIGIN}${path}`;
}

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] =
    useState([]);

  const [form, setForm] =
    useState(null);

  const [image, setImage] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    return () => {
      if (
        preview &&
        preview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(
          preview
        );
      }
    };
  }, [preview]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        productResponse,
        categoryResponse,
      ] = await Promise.all([
        api.get(`/products/${id}`),
        api.get("/categories"),
      ]);

      const product =
        productResponse.data.product;

      setCategories(
        categoryResponse.data
          .categories || []
      );

      setForm({
        name: product.name || "",
        sku: product.sku || "",
        description:
          product.description || "",
        price:
          product.price ?? "",
        stock:
          product.stock ?? 0,
        categoryId:
          product.categoryId ??
          product.Category?.id ??
          "",
        featured: Boolean(
          product.featured
        ),
        returnable: Boolean(
          product.returnable
        ),
        productType:
          product.productType ||
          "Physical",
        availability:
          product.availability ||
          "Available",
        availableDate:
          product.availableDate ||
          "",
      });

      if (product.imageUrl) {
        setPreview(
          imageUrl(
            product.imageUrl
          )
        );
      } else {
        setPreview("");
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load product"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((current) => ({
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

    if (
      preview &&
      preview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(
        preview
      );
    }

    setPreview(
      URL.createObjectURL(file)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError(
        "Product name is required"
      );
      return;
    }

    if (
      form.price === "" ||
      Number(form.price) < 0
    ) {
      setError("Enter a valid price");
      return;
    }

    if (
      form.stock === "" ||
      Number(form.stock) < 0
    ) {
      setError("Enter a valid stock");
      return;
    }

    if (!form.categoryId) {
      setError(
        "Please select a category"
      );
      return;
    }

    try {
      setSubmitting(true);

      const data =
        new FormData();

      data.append(
        "name",
        form.name.trim()
      );

      data.append(
        "sku",
        form.sku.trim()
      );

      data.append(
        "description",
        form.description.trim()
      );

      data.append(
        "price",
        String(
          Number(form.price)
        )
      );

      data.append(
        "stock",
        String(
          Number(form.stock)
        )
      );

      data.append(
        "categoryId",
        String(
          Number(form.categoryId)
        )
      );

      data.append(
        "featured",
        String(form.featured)
      );

      data.append(
        "returnable",
        String(form.returnable)
      );

      data.append(
        "productType",
        form.productType
      );

      data.append(
        "availability",
        form.availability
      );

      if (form.availableDate) {
        data.append(
          "availableDate",
          form.availableDate
        );
      }

      if (image) {
        data.append(
          "image",
          image
        );
      }

      await api.put(
        `/products/${id}`,
        data
      );

      setSuccess(
        "Product updated successfully"
      );

      setTimeout(() => {
        navigate(
          `/products/${id}`
        );
      }, 700);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update product"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !form) {
    return (
      <main className="page-shell">
        <div className="state-box">
          Loading product...
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <div className="page-header">
        <div>
          <h1>Edit Product</h1>
          <p>
            Update product information.
          </p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={() =>
            navigate(
              `/products/${id}`
            )
          }
        >
          Back to Details
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
                value={form.name}
                onChange={handleChange}
                disabled={submitting}
              />
            </Field>

            <Field label="SKU">
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
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
                value={form.description}
                onChange={handleChange}
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
                value={form.price}
                onChange={handleChange}
                disabled={submitting}
              />
            </Field>

            <Field label="Stock *">
              <input
                name="stock"
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={handleChange}
                disabled={submitting}
              />
            </Field>

            <Field label="Category *">
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="">
                  Select category
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  )
                )}
              </select>
            </Field>

            <Field label="Available Date">
              <input
                name="availableDate"
                type="date"
                value={
                  form.availableDate
                }
                onChange={handleChange}
                disabled={submitting}
              />
            </Field>
          </div>
        </section>

        <section className="card form-section-card">
          <h2>Options</h2>

          <div className="option-grid">
            <label className="check-option">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                disabled={submitting}
              />
              Featured Product
            </label>

            <label className="check-option">
              <input
                type="checkbox"
                name="returnable"
                checked={form.returnable}
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
                  form.productType ===
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
                  form.productType ===
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
                  form.availability ===
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
                  form.availability ===
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
              Replace Image
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
              navigate(
                `/products/${id}`
              )
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
              ? "Updating..."
              : "Update Product"}
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

export default EditProduct;