import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Carousel.css";

export type CarouselProps = {
  dots?: boolean;
  infinite?: boolean;
  speed?: number;
  slidesToShow?: number;
  slidesToScroll?: number;
  children: React.ReactNode;
  className?: string;
};

export function Carousel({
  dots = true,
  infinite = false,
  speed = 500,
  slidesToShow = 1,
  slidesToScroll = 1,
  children,
  className = "",
}: CarouselProps) {
  const settings = {
    dots,
    infinite,
    speed,
    slidesToShow,
    slidesToScroll,
  };

  return (
    <div className={`carousel-container ${className}`}>
      <Slider {...settings}>{children}</Slider>
    </div>
  );
}
