import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Categories from "./pages/Categories";
import Products from "./pages/Products";
import CreateProduct from "./pages/CreateProduct";
import ProductDetails from "./pages/ProductDetails";
import EditProduct from "./pages/EditProduct";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/products" replace />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/categories"
          element={<Categories />}
        />

        <Route
          path="/products/new"
          element={<CreateProduct />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/products/:id/edit"
          element={<EditProduct />}
        />

        <Route
          path="*"
          element={<Navigate to="/products" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;