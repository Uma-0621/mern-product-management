import { useEffect, useState } from "react";
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

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get(`/products/${id}`);

      setProduct(
        response.data.product
      );
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

  if (loading) {
    return (
      <main className="page-shell">
        <div className="state-box">
          Loading product...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-shell">
        <div className="alert error-alert">
          {error}
        </div>

        <button
          className="secondary-button"
          onClick={() =>
            navigate("/products")
          }
        >
          Back to Products
        </button>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="page-shell">
        <div className="state-box">
          Product not found.
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <div className="page-header">
        <div>
          <h1>Product Details</h1>
          <p>
            Complete product information.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={() =>
            navigate("/products")
          }
        >
          Back to Products
        </button>
      </div>

      <section className="details-layout">
        <div className="card details-image-card">
          {product.imageUrl ? (
            <img
              src={imageUrl(
                product.imageUrl
              )}
              alt={product.name}
              className="details-image"
            />
          ) : (
            <div className="details-image-placeholder">
              No Image
            </div>
          )}
        </div>

        <div className="card details-card">
          <div className="detail-title-row">
            <div>
              <h2>{product.name}</h2>

              <span>
                {product.sku ||
                  "No SKU"}
              </span>
            </div>

            <span
              className={`status-pill ${
                product.status
                  ? "active"
                  : "inactive"
              }`}
            >
              {product.status
                ? "Active"
                : "Inactive"}
            </span>
          </div>

          <Detail
            label="Description"
            value={
              product.description ||
              "-"
            }
          />

          <Detail
            label="Category"
            value={
              product.Category?.name ||
              "-"
            }
          />

          <Detail
            label="Price"
            value={`₹${Number(
              product.price || 0
            ).toLocaleString(
              "en-IN",
              {
                minimumFractionDigits: 2,
              }
            )}`}
          />

          <Detail
            label="Stock"
            value={product.stock ?? 0}
          />

          <Detail
            label="Product Type"
            value={
              product.productType ||
              "-"
            }
          />

          <Detail
            label="Availability"
            value={
              product.availability ||
              "-"
            }
          />

          <Detail
            label="Featured"
            value={
              product.featured
                ? "Yes"
                : "No"
            }
          />

          <Detail
            label="Returnable"
            value={
              product.returnable
                ? "Yes"
                : "No"
            }
          />

          <Detail
            label="Available Date"
            value={
              product.availableDate ||
              "-"
            }
          />

          <div className="detail-actions">
            <button
              className="primary-button"
              onClick={() =>
                navigate(
                  `/products/${id}/edit`
                )
              }
            >
              Edit Product
            </button>

            <button
              className="secondary-button"
              onClick={() =>
                navigate("/products")
              }
            >
              Back
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function Detail({ label, value }) {
  return (
    <div className="detail-row">
      <span className="detail-label">
        {label}
      </span>

      <strong className="detail-value">
        {value}
      </strong>
    </div>
  );
}

export default ProductDetails;