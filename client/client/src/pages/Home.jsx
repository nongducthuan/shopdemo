import { useEffect, useState } from "react";
import API from "../api";
import ProductCard from "../components/ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import AOS from 'aos';
import 'aos/dist/aos.css';

const featuredItems = [
  { img: "/assets/images/featured1.png", title: "Áo thun" },
  { img: "/assets/images/featured2.png", title: "Áo polo" },
  { img: "/assets/images/featured3.png", title: "Đồ mặc nhà" },
  { img: "/assets/images/featured4.png", title: "Áo len" },
  { img: "/assets/images/featured5.png", title: "Phụ kiện" },
  { img: "/assets/images/featured6.png", title: "Active" },
  { img: "/assets/images/featured7.png", title: "Quần short" },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const backendUrl = "http://localhost:5000";

  useEffect(() => {
    API.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Lỗi tải sản phẩm:", err));
    API.get("/banners")
      .then((res) => setBanners(res.data))
      .catch((err) => console.error("Lỗi tải banner:", err));
    AOS.init({
      duration: 1000,
      offset: 300,
      once: false,
      mirror: false
    });
  }, []);

  return (
    <div className="container-fluid">
      {/* 🖼 Carousel Banner */}
      <div id="heroCarousel" className="carousel slide mb-4" data-bs-ride="carousel">
        <div className="carousel-inner">
          {banners.length > 0 ? (
            banners.map((b, idx) => (
              <div key={b.id} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
                <img
                  src={`${backendUrl}${b.image_url}`}
                  className="d-block w-100 rounded-3"
                  alt={b.title || `Banner ${idx + 1}`}
                />
                {(b.title || b.subtitle) && (
                  <div className="carousel-caption d-md-block">
                    {b.title && <h1 className="fw-bold">{b.title}</h1>}
                    {b.subtitle && <p>{b.subtitle}</p>}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="carousel-item active">
              <img
                src={`${backendUrl}/public/images/placeholder-banner.png`}
                className="d-block w-100 rounded-3"
                alt="Default Banner"
              />
              <div className="carousel-caption d-md-block">
                <h1 className="fw-bold">Chào mừng đến Clothing Shop</h1>
                <p>Bộ sưu tập mới nhất đã có mặt – Giảm giá đến 50% hôm nay!</p>
              </div>
            </div>
          )}
        </div>

        {banners.length > 1 && (
          <>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </>
        )}
      </div>

      {/* 🛍 Danh sách sản phẩm */}
      <section className="my-5" data-aos="fade-up">
        <div className="container-fluid text-center">
          <h2 className="section-title fw-bold mb-3">
            DANH SÁCH SẢN PHẨM
          </h2>
          <div className="row g-3 justify-content-center">
            {products.map((p) => (
              <div key={p.id} className="col-6 col-md-3 d-flex justify-content-center">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🌟 Bộ sưu tập nổi bật */}
      <section className="my-5 collection-banner-section" data-aos="fade-up">
        <div className="container-fluid text-center">
          <h2 className="section-title fw-bold text-center mb-4">
            BỘ SƯU TẬP NỔI BẬT
          </h2>
          <div className="row g-3">
            {/* Banner 1 */}
            <div className="col-12 col-md-4 position-relative">
              <img
                src="/assets/images/banner-family.png"
                alt="Áo phông cho cả gia đình"
                className="img-fluid w-100 rounded-4 shadow"
              />
              <div className="banner-overlay">
                <h3 className="fw-bold">ÁO PHÔNG CHO CẢ GIA ĐÌNH</h3>
                <p>Khám phá bảng màu áo phông đa sắc cho mọi lứa tuổi!</p>
              </div>
            </div>

            {/* Banner 2 */}
            <div className="col-12 col-md-4 position-relative">
              <img
                src="/assets/images/banner-vietnam.png"
                alt="Tự hào Việt Nam ơi"
                className="img-fluid w-100 rounded-4 shadow"
              />
              <div className="banner-overlay">
                <h3 className="fw-bold">TỰ HÀO VIỆT NAM ƠI</h3>
                <p>Khoác lên mình màu cờ sắc áo - tôn vinh tinh thần dân tộc với thiết kế ý nghĩa, lan tỏa tình yêu nước đến mọi trái tim người Việt.</p>
              </div>
            </div>

            {/* Banner 3 */}
            <div className="col-12 col-md-4 position-relative">
              <img
                src="/assets/images/banner-homewear.png"
                alt="Homewear"
                className="img-fluid w-100 rounded-4 shadow"
              />
              <div className="banner-overlay">
                <h3 className="fw-bold">HOMEWEAR</h3>
                <p>Chạm vào sự thoải mái với loạt thiết kế êm nhẹ tinh tế – để từng phút giây ở nhà trở nên thật thư thái.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="home-container mx-5" data-aos="fade-up">
        <div className="banner-section py-4">
          <div className="container-fluid">
            <div className="row">
              {/* Banner nam */}
              <div className="col-12 col-md-6 banner-item">
                <img
                  src="/assets/images/men-wear.png"
                  alt="Men Wear"
                  className="w-100 rounded-4"
                />
                <div className="banner-text">
                  <h2>MEN WEAR</h2>
                  <p>Nhập COOLNEW Giảm 50K đơn đầu tiên từ 299k</p>
                </div>
              </div>

              {/* Banner nữ */}
              <div className="col-12 col-md-6 banner-item">
                <img
                  src="/assets/images/women-active.png"
                  alt="Women Active"
                  className="w-100 rounded-4"
                />
                <div className="banner-text">
                  <h2>WOMEN ACTIVE</h2>
                  <p>Nhập CMVSEAMLESS Giảm 50K cho BST Seamless</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="my-5 featured-slider container" data-aos="fade-up">
        <h2 className="section-title fw-bold text-center mb-3">DÒNG HÀNG NỔI BẬT</h2>
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={5}
          navigation
          loop={true}
          breakpoints={{
            320: { slidesPerView: 2 },
            576: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            992: { slidesPerView: 5 },
          }}
        >
          {featuredItems.map((item, idx) => (
            <SwiperSlide key={idx}>
              <div className="featured-card position-relative overflow-hidden rounded-4">
                <img
                  src={item.img}
                  alt={item.title}
                  className="img-fluid w-100 rounded-4"
                />
                <div className="overlay">
                  <h5 className="text-white fw-bold">{item.title}</h5>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* 👕 Lookbook */}
      <section className="my-5" data-aos="fade-up">
        <div className="container-fluid text-center">
          <h2 className="section-title fw-bold mb-4">
            LOOKBOOK GỢI Ý PHỐI ĐỒ
          </h2>
          <div className="row g-3 justify-content-center">
            <div className="col-11 col-md-3">
              <img
                src="https://www.rails.com/cdn/shop/files/msu24-lookbook-5_1920x.jpg?v=1713387507"
                className="lookbook-img img-fluid rounded-3 shadow"
                alt="Look 1"
              />
            </div>
            <div className="col-11 col-md-3">
              <img
                src="https://www.initialfashion.com/uploads/attachments/cl1x3ldes1httasgxs98428yv-ps-20220225-initial-5914.full.jpg"
                className="lookbook-img img-fluid rounded-3 shadow"
                alt="Look 2"
              />
            </div>
            <div className="col-11 col-md-3">
              <img
                src="https://www.westside.com/cdn/shop/articles/Untitled_design_-_2024-02-16T164143.113.png?v=1708088745&width=533"
                className="lookbook-img img-fluid rounded-3 shadow"
                alt="Look 3"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 🎁 Chính sách ưu đãi */}
      <section className="my-5 text-center" data-aos="fade-up">
        <h2 className="section-title fw-bold text-center mb-4">CHÍNH SÁCH ƯU ĐÃI</h2>
        <div className="row g-3 justify-content-center">
          <div className="col-11 col-md-3">
            <div className="card shadow-sm h-100 policy-card">
              <div className="card-body">
                <h5 className="card-title">🎁 Giảm giá</h5>
                <p className="card-text">Giảm 10% cho khách hàng mới</p>
              </div>
            </div>
          </div>
          <div className="col-11 col-md-3">
            <div className="card shadow-sm h-100 policy-card">
              <div className="card-body">
                <h5 className="card-title">🚚 Freeship</h5>
                <p className="card-text">Miễn phí vận chuyển cho đơn từ 500k</p>
              </div>
            </div>
          </div>
          <div className="col-11 col-md-3">
            <div className="card shadow-sm h-100 policy-card">
              <div className="card-body">
                <h5 className="card-title">🔄 Đổi trả</h5>
                <p className="card-text">Đổi trả miễn phí trong 7 ngày</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ⚙️ Footer */}
      <footer className="footer col-md-12 mt-5 py-4 text-center text-white">
        <p className="mb-1">
          📞 Hotline:{" "}
          <a
            href="tel:0123456789"
            className="text-white text-decoration-none"
          >
            0123-456-789
          </a>
        </p>
        <p className="mb-1">
          📧 Email:{" "}
          <a
            href="mailto:support@shopquanao.com"
            className="text-white text-decoration-none"
          >
            support@shopquanao.com
          </a>
        </p>
        <p className="mb-1">
          🏠 Địa chỉ:{" "}
          <a
            href="https://www.google.com/maps/search/?api=1&query=Đường+Nam+Kỳ+Khởi+Nghĩa,+Phường+Hòa+Phú,+Thủ+Dầu+Một,+Bình+Dương,+Việt+Nam"
            className="text-white text-decoration-none"
            target="_blank"
            rel="noopener noreferrer"
          >
            Đường Nam Kỳ Khởi Nghĩa, Phường Hòa Phú, TP. Thủ Dầu Một, Bình Dương
          </a>
        </p>
        <p className="mb-0">
          © {new Date().getFullYear()} Clothing Shop - All Rights Reserved
        </p>
      </footer>
    </div>
  );
}
