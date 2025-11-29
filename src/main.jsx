import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProductProvider } from "./context/ProductContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header/Haeder.jsx";
import Footer from "./components/Footer/Footer.jsx";
import ManList from "./pages/ManList.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import MyPage from "./pages/MyPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CartSidebar from "./components/Cart/CartSidebar.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <Header />
            <Routes>
              <Route path="/" element={<ManList />} />
              <Route path="/manList" element={<ManList />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
            <Footer />
            <CartSidebar />
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
