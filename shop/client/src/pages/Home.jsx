import { useEffect, useState } from "react";
import API from "../api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products").then((res) => setProducts(res.data));
  }, []);

  return (
    <div className="container mt-4">
      <div className="row g-3">
        {products.map((p) => (
          <div key={p.id} className="col-12 col-md-4 d-flex justify-content-center">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
