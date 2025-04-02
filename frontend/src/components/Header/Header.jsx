import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "../Navbar/Navbar";
import img1 from "../../assets/images/pexels-altan-kendi-rci-591734586-20089339.jpg";
import img2 from "../../assets/images/pexels-actually_jet-2150578553-31214002.jpg";
import img3 from "../../assets/images/pexels-reinaldo-30953505.jpg";
import "./Header.css";

const images = [img1, img2, img3];

function Header() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    fade: true,
    arrows: false,
  };

  return (
    <header className="header">
      <Slider {...settings} className="header-slider">
        {images.map((image, index) => (
          <div key={index} className="slide">
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="slide-image"
            />
          </div>
        ))}
      </Slider>
      <Navbar />
    </header>
  );
}

export default Header;
