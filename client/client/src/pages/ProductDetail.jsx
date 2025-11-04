import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const backendUrl = "http://localhost:5000"; // URL backend

  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const formatPrice = (price) => Number(price).toLocaleString("vi-VN");

  useEffect(() => {
    fetch(`${backendUrl}/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        // prepend backendUrl cho image
        if (data.image_url && !data.image_url.startsWith("http")) {
          data.image_url = `${backendUrl}${data.image_url}`;
        }
        if (data.colors?.length > 0) {
          data.colors = data.colors.map((c) => ({
            ...c,
            image_url: c.image_url && !c.image_url.startsWith("http") ? `${backendUrl}${c.image_url}` : c.image_url,
          }));
        }

        setProduct(data);

        if (data.colors?.length > 0) {
          setSelectedColor(data.colors[0]);
          setMainImage(data.colors[0].image_url || data.image_url);
        } else {
          setMainImage(data.image_url);
        }

        setSelectedSize(null); // reset size khi load product mới
      })
      .catch((err) => console.error("Error fetching product detail:", err));
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div style={{ display: "flex", gap: "2rem", padding: "2rem" }}>
      {/* Ảnh chính */}
      <div>
        <img
          src={mainImage || "https://via.placeholder.com/400x400?text=No+Image"}
          alt={product.name}
          style={{ width: "400px", height: "400px", objectFit: "cover" }}
        />

        {/* Chọn màu */}
        {product.colors?.length > 0 && (
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            {product.colors.map((color) => (
              <div
                key={color.id}
                onClick={() => {
                  setSelectedColor(color);
                  setMainImage(color.image_url || product.image_url);
                  setSelectedSize(null);
                }}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: selectedColor?.id === color.id ? "3px solid black" : "1px solid #ccc",
                  backgroundColor: color.color_code,
                  cursor: "pointer",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              ></div>
            ))}
          </div>
        )}
      </div>

      {/* Thông tin sản phẩm */}
      <div style={{ flex: 1 }}>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>Giá: {formatPrice(product.price)} VND</p>

        {/* Chọn size */}
        {selectedColor?.sizes?.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <p>Chọn size:</p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {selectedColor.sizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: selectedSize?.id === size.id ? "blue" : "lightgray",
                    color: selectedSize?.id === size.id ? "white" : "black",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {size.size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Thêm vào giỏ */}
        {(!selectedColor?.sizes || selectedColor.sizes.length === 0 || selectedSize) && (
          <button
            onClick={() =>
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                color_id: selectedColor?.id ?? null,
                color: selectedColor?.color_name ?? null,
                color_image: selectedColor?.image_url ?? null,
                size_id: selectedSize?.id ?? null,
                size: selectedSize?.size ?? null,
              })
            }
            style={{
              marginTop: "2rem",
              padding: "1rem 2rem",
              backgroundColor: "green",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Thêm vào giỏ
          </button>
        )}
      </div>
    </div>
  );
}
