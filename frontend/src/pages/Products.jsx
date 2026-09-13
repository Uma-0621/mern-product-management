import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, search, selectedCategory]);

  const fetchCategories = async () => {
    try {
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
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/products",
        {
          params: {
            page,
            limit: 10,
            ...(search
              ? { search }
              : {}),
            ...(selectedCategory
              ? {
                  categoryId:
                    selectedCategory,
                }
              : {}),
          },
        }
      );

      setProducts(
        response.data.products || []
      );

      if (response.data.pagination) {
        setPagination(
          response.data.pagination
        );
      } else {
        setPagination({
          totalItems: 0,
          currentPage: 1,
          totalPages: 1,
          limit: 10,
        });
      }
    } catch (err) {
      console.error(err);

      setProducts([]);

      setError(
        err.response?.data?.message ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  const handleClear = () => {
    setSearchInput("");
    setSearch("");
    setSelectedCategory("");
    setPage(1);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.delete(`/products/${id}`);

      setSuccess(
        "Product deleted successfully"
      );

      await fetchProducts();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to delete product"
      );
    }
  };

  const handleStatus = async (product) => {
    try {
      setError("");
      setSuccess("");

      await api.patch(
        `/products/${product.id}/status`,
        {
          status: !product.status,
        }
      );

      setSuccess(
        "Product status updated successfully"
      );

      await fetchProducts();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update product status"
      );
    }
  };

  const handleStock = async (product) => {
    const value = window.prompt(
      "Enter stock",
      String(product.stock ?? 0)
    );

    if (value === null) {
      return;
    }

    const stock = Number(value);

    if (
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      setError(
        "Stock must be a non-negative integer"
      );
      return;
    }

    try {
      setError("");
      setSuccess("");

      await api.patch(
        `/products/${product.id}/stock`,
        { stock }
      );

      setSuccess(
        "Stock updated successfully"
      );

      await fetchProducts();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update stock"
      );
    }
  };

  const totalPages =
    pagination.totalPages || 1;

  return (
    <main className="page-shell">
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>
            Manage products, inventory and status.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() =>
            navigate("/products/new")
          }
        >
          + Add Product
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

      <section className="card filters-card">
        <form
          className="filter-form"
          onSubmit={handleSearch}
        >
          <div className="field">
            <label htmlFor="search">
              Search
            </label>

            <input
              id="search"
              type="text"
              value={searchInput}
              onChange={(e) =>
                setSearchInput(
                  e.target.value
                )
              }
              placeholder="Search by name or SKU"
            />
          </div>

          <div className="field">
            <label htmlFor="category">
              Category
            </label>

            <select
              id="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">
                All Categories
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
          </div>

          <div className="filter-buttons">
            <button
              className="primary-button"
              type="submit"
            >
              Search
            </button>

            <button
              className="secondary-button"
              type="button"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </form>
      </section>

      <section className="card table-card">
        {loading ? (
          <div className="state-box">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="state-box">
            <h3>No products found</h3>
            <p>
              Try another search or add a product.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                navigate("/products/new")
              }
            >
              + Add Product
            </button>
          </div>
        ) : (
          <>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="product-cell">
                          {product.imageUrl ? (
                            <img
                              src={imageUrl(
                                product.imageUrl
                              )}
                              alt={product.name}
                              className="table-product-image"
                            />
                          ) : (
                            <div className="table-product-placeholder">
                              P
                            </div>
                          )}

                          <div>
                            <strong>
                              {product.name}
                            </strong>

                            <span>
                              {product.sku ||
                                "No SKU"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        {product.Category
                          ?.name || "-"}
                      </td>

                      <td>
                        ₹
                        {Number(
                          product.price || 0
                        ).toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                          }
                        )}
                      </td>

                      <td>
                        {product.stock ?? 0}
                      </td>

                      <td>
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
                      </td>

                      <td>
                        <div className="action-row">
                          <button
                            type="button"
                            className="small-button view"
                            onClick={() =>
                              navigate(
                                `/products/${product.id}`
                              )
                            }
                          >
                            View
                          </button>

                          <button
                            type="button"
                            className="small-button edit"
                            onClick={() =>
                              navigate(
                                `/products/${product.id}/edit`
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="small-button stock"
                            onClick={() =>
                              handleStock(product)
                            }
                          >
                            Stock
                          </button>

                          <button
                            type="button"
                            className="small-button status"
                            onClick={() =>
                              handleStatus(product)
                            }
                          >
                            {product.status
                              ? "Deactivate"
                              : "Activate"}
                          </button>

                          <button
                            type="button"
                            className="small-button delete"
                            onClick={() =>
                              handleDelete(
                                product.id
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <span>
                Page{" "}
                {pagination.currentPage || page}{" "}
                of {totalPages} ·{" "}
                {pagination.totalItems || 0}{" "}
                products
              </span>

              <div className="pagination-buttons">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() =>
                    setPage((current) =>
                      Math.max(current - 1, 1)
                    )
                  }
                >
                  Previous
                </button>

                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) => index + 1
                ).map((number) => (
                  <button
                    type="button"
                    key={number}
                    className={
                      number === page
                        ? "current"
                        : ""
                    }
                    onClick={() =>
                      setPage(number)
                    }
                  >
                    {number}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={
                    page >= totalPages
                  }
                  onClick={() =>
                    setPage((current) =>
                      Math.min(
                        current + 1,
                        totalPages
                      )
                    )
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default Products;