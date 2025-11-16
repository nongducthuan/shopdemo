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
  const [quantity, setQuantity] = useState(1);

  const formatPrice = (price) => Number(price).toLocaleString("vi-VN");

  // Fetch product detail
  useEffect(() => {
    fetch(`${backendUrl}/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        // Prepend backendUrl cho image nếu cần
        if (data.image_url && !data.image_url.startsWith("http")) {
          data.image_url = `${backendUrl}${data.image_url}`;
        }
        if (data.colors?.length > 0) {
          data.colors = data.colors.map((c) => ({
            ...c,
            image_url:
              c.image_url && !c.image_url.startsWith("http")
                ? `${backendUrl}${c.image_url}`
                : c.image_url,
          }));
        }

        setProduct(data);

        // Chọn màu mặc định
        if (data.colors?.length > 0) {
          setSelectedColor(data.colors[0]);
          setMainImage(data.colors[0].image_url || data.image_url);
          setSelectedSize(data.colors[0].sizes?.[0] || null);
        } else {
          setMainImage(data.image_url);
          setSelectedColor(null);
          setSelectedSize(null);
        }
      })
      .catch((err) => console.error("Error fetching product detail:", err));
  }, [id]);

  // Reset quantity khi đổi màu/size
  useEffect(() => {
    if (!product) return;
    let stock =
      selectedSize?.stock ??
      (selectedColor && selectedColor.sizes?.length === 0 ? product.stock : 0);
    setQuantity(stock > 0 ? 1 : 0);
  }, [selectedColor, selectedSize, product]);

  if (!product) return <div>Loading...</div>;

  // Stock hiện tại
  const currentStock = selectedSize
    ? selectedSize.stock
    : selectedColor?.sizes?.length === 0
      ? product.stock
      : 0;

  // Thông báo stock
  const getStockMessage = () => {
    if (selectedColor?.sizes?.length > 0) {
      if (!selectedSize) return "Vui lòng chọn size";
      return selectedSize.stock > 0
        ? `Số lượng có sẵn: ${selectedSize.stock}`
        : "Hết hàng";
    }
    return product.stock > 0 ? `Còn lại: ${product.stock}` : "Hết hàng";
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8 justify-center items-start">
      {/* Cột ảnh */}
      <div className="flex-1 max-w-md">
        <div className="w-full max-w-md mx-auto">
          <div className="w-full aspect-square bg-gray-100 rounded-lg flex justify-center items-center overflow-hidden">
            <img
              src={
                mainImage || "https://via.placeholder.com/400x400?text=No+Image"
              }
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
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
                  setSelectedSize(color.sizes?.[0] || null);
                }}
                className={`w-10 h-10 rounded-full cursor-pointer border-2 transition-transform ${selectedColor?.id === color.id
                  ? "border-black"
                  : "border-gray-300"
                  }`}
                style={{ backgroundColor: color.color_code }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              ></div>
            ))}
          </div>
        )}
      </div>

      {/* Cột thông tin sản phẩm */}
      <div className="flex-1 max-w-md flex flex-col">
        <h2 className="text-2xl font-bold">{product.name}</h2>
        <p className="text-gray-700">{product.description}</p>
        <p className="text-xl font-semibold mt-2">
          Giá:{" "}
          <span className="text-red-600">{formatPrice(product.price)} VND</span>
        </p>

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
                    : "bg-gray-200 text-black border-gray-200 hover:bg-gray-200"
                    }`}
                >
                  {size.size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Nút số lượng kiểu viên thuốc */}
        <div className="flex items-center justify-between mt-4 w-36 rounded-full bg-gray-200 px-4 py-2 shadow-sm">
          <button
            disabled={quantity <= (currentStock > 0 ? 1 : 0)}
            onClick={() => setQuantity((q) => q - 1)}
            className="text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed text-2xl font-medium transition-colors"
          >
            -
          </button>

          <input
            type="number"
            value={quantity}
            min={currentStock > 0 ? 1 : 0}
            max={currentStock}
            onChange={(e) => {
              let val = Number(e.target.value);
              if (val < 1) val = 1;
              if (val > currentStock) val = currentStock;
              setQuantity(val);
            }}
            className="w-12 text-center border-0 outline-none focus:ring-0 bg-transparent text-gray-900 font-semibold text-lg [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />

          <button
            disabled={quantity >= currentStock}
            onClick={() => setQuantity((q) => q + 1)}
            className="text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed text-2xl font-medium transition-colors"
          >
            +
          </button>
        </div>

        {/* Thông báo stock */}
        <p className="text-gray-600 mt-1 text-sm">{getStockMessage()}</p>

        {/* Thêm vào giỏ */}
        <button
          disabled={
            currentStock === 0 ||
            (selectedColor?.sizes?.length > 0 && !selectedSize)
          }
          onClick={() =>
            addToCart(
              {
                id: product.id,
                name: product.name,
                price: product.price,
                color_id: selectedColor?.id ?? null,
                color: selectedColor?.color_name ?? null,
                color_image: selectedColor?.image_url ?? null,
                size_id: selectedSize?.id ?? null,
                size: selectedSize?.size ?? null,
                quantity: quantity,
                stock: currentStock
              },
            )
          }
          className={`sm:w-1/2 mt-6 px-6 py-3 rounded-md transition-colors ${currentStock === 0 ||
            (selectedColor?.sizes?.length > 0 && !selectedSize)
            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
            }`}
        >
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}
