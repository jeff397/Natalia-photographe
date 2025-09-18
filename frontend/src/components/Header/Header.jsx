import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/autoplay";
import Navbar from "../Navbar/Navbar";

import "./header.css";

const images = [
  "/assets/images/slide1.webp",
  "/assets/images/slide2.webp",
  "/assets/images/slide4.webp",
  "/assets/images/slide5.webp",
  "/assets/images/slide8.webp",
];

function Header() {
  return (
    <header className="header">
      <div className="slider-title">
        <h1>"Laissez-vous emporter par l'art de la photographie"</h1>
      </div>

      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        speed={1000}
        className="my-swiper"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="slide-image"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Navbar />
    </header>
  );
}

export default Header;
