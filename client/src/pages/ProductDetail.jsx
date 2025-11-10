import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const backendUrl = "http://localhost:5000";

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
    <div className="flex flex-col md:flex-row gap-8 p-8 justify-center items-start">
      {/* Cột ảnh */}
      <div className="flex-1 max-w-md">
        <div className="flex-1 max-w-md flex justify-center">
          <img
            src={mainImage || "https://via.placeholder.com/400x400?text=No+Image"}
            alt={product.name}
            className="w-auto max-w-xs h-auto object-cover rounded-lg"
          />
        </div>
        {/* Chọn màu */}
        {product.colors?.length > 0 && (
          <div className="flex gap-3 mt-4 justify-center">
            {product.colors.map((color) => (
              <div
                key={color.id}
                onClick={() => {
                  setSelectedColor(color);
                  setMainImage(color.image_url || product.image_url);
                  setSelectedSize(null);
                }}
                className={`w-10 h-10 rounded-full cursor-pointer border-2 transition-transform ${selectedColor?.id === color.id ? "border-black" : "border-gray-300"
                  }`}
                style={{ backgroundColor: color.color_code }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              ></div>
            ))}
          </div>
        )}
      </div>

      {/* Cột thông tin sản phẩm */}
      <div className="flex-1 max-w-md flex flex-col">
        <h2 className="text-2xl font-bold">{product.name}</h2>
        <p className="text-gray-700">{product.description}</p>
        <p className="text-xl font-semibold mt-2">Giá: <span className="text-red-600">{formatPrice(product.price)} VND</span></p>

        {/* Chọn size */}
        {selectedColor?.sizes?.length > 0 && (
          <div className="mt-4">
            <p className="font-medium">Chọn size:</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {selectedColor.sizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-md border ${selectedSize?.id === size.id
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-200 text-black border-gray-200"
                    }`}
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
            className="sm:w-1/2 mt-6 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Thêm vào giỏ
          </button>
        )}
      </div>
    </div>
  );
}
