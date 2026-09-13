import { useEffect, useState } from "react";
import api from "../services/api";

function Categories() {
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/categories");

      setCategories(response.data.categories || []);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    clearMessages();

    const value = name.trim();

    if (!value) {
      setError("Category name is required");
      return;
    }

    try {
      setSubmitting(true);

      await api.post("/categories", {
        name: value,
      });

      setName("");
      setSuccess("Category added successfully");

      await fetchCategories();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to create category"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditStart = (category) => {
    clearMessages();

    setEditingId(category.id);
    setEditName(category.name);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    clearMessages();

    const value = editName.trim();

    if (!value) {
      setError("Category name is required");
      return;
    }

    try {
      setSubmitting(true);

      await api.put(`/categories/${editingId}`, {
        name: value,
      });

      setEditingId(null);
      setEditName("");

      setSuccess("Category updated successfully");

      await fetchCategories();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update category"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    clearMessages();
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }

    try {
      clearMessages();

      await api.delete(`/categories/${id}`);

      setSuccess("Category deleted successfully");

      await fetchCategories();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to delete category"
      );
    }
  };

  const handleStatus = async (category) => {
    try {
      clearMessages();

      await api.patch(
        `/categories/${category.id}/status`,
        {
          status: !category.status,
        }
      );

      setSuccess(
        `Category ${
          !category.status
            ? "activated"
            : "deactivated"
        } successfully`
      );

      await fetchCategories();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to update category status"
      );
    }
  };

  return (
    <main className="page-shell">
      <div className="page-header">
        <div>
          <h1>Categories</h1>
          <p>Manage product categories.</p>
        </div>
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

      <section className="card form-card">
        <h2>
          {editingId
            ? "Edit Category"
            : "Add Category"}
        </h2>

        <form
          className="inline-form"
          onSubmit={
            editingId ? handleUpdate : handleAdd
          }
        >
          <input
            type="text"
            value={editingId ? editName : name}
            onChange={(e) =>
              editingId
                ? setEditName(e.target.value)
                : setName(e.target.value)
            }
            placeholder="Enter category name"
            disabled={submitting}
          />

          <button
            className="primary-button"
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Saving..."
              : editingId
              ? "Update Category"
              : "Add Category"}
          </button>

          {editingId && (
            <button
              type="button"
              className="secondary-button"
              onClick={cancelEdit}
              disabled={submitting}
            >
              Cancel
            </button>
          )}
        </form>
      </section>

      <section className="card table-card">
        {loading ? (
          <div className="state-box">
            Loading categories...
          </div>
        ) : categories.length === 0 ? (
          <div className="state-box">
            <h3>No categories found</h3>
            <p>Add a category to get started.</p>
          </div>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td>#{category.id}</td>

                    <td>
                      <strong>{category.name}</strong>
                    </td>

                    <td>
                      <span
                        className={`status-pill ${
                          category.status
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        {category.status
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <div className="action-row">
                        <button
                          type="button"
                          className="small-button edit"
                          onClick={() =>
                            handleEditStart(category)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="small-button status"
                          onClick={() =>
                            handleStatus(category)
                          }
                        >
                          {category.status
                            ? "Deactivate"
                            : "Activate"}
                        </button>

                        <button
                          type="button"
                          className="small-button delete"
                          onClick={() =>
                            handleDelete(category.id)
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
        )}
      </section>
    </main>
  );
}

export default Categories;