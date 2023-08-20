import {
  ElementRef,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  StyledCarousel,
  StyledCarouselUl,
  StyledLeftButton,
  StyledRightButton,
} from "./Carousel.styled";

import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import useThrottledCallback from "./hooks/useThrottledCallback";

interface CarouselProps {
  images: {
    src: string;
    alt: string;
  }[];
}

const SLIDE_DURATION = 400;

export default function Carousel({ images }: CarouselProps) {
  const imageLength = images.length;
  const [current, setCurrent] = useState(images.length > 1 ? 1 : 0);
  const [translateX, setTranslateX] = useState(0);
  const slideRef = useRef<ElementRef<"ul">>(null);

  const slides = useMemo(() => {
    const items = images.map((image) => (
      <li key={image.src}>
        <img src={image.src} alt={image.alt} />
      </li>
    ));

    if (images.length > 1) {
      return [
        <li key="last-image">
          <img
            src={images[imageLength - 1].src}
            alt={images[imageLength - 1].alt}
          />
        </li>,
        ...items,
        <li key="first-image">
          <img src={images[0].src} alt={images[0].alt} />
        </li>,
      ];
    }

    return items;
  }, [images, imageLength]);

  const onMoveSlide = (mode: "prev" | "next") => {
    if (slideRef.current) {
      slideRef.current.style.transitionDuration = `${SLIDE_DURATION}ms`;
      const clientWidth = slideRef.current.clientWidth;
      if (mode === "prev") {
        if (current <= 1) {
          setTranslateX(0);
          setCurrent(imageLength);
        } else {
          setTranslateX(clientWidth * (current - 1));
          setCurrent((prev) => prev - 1);
        }
      } else {
        if (current >= imageLength) {
          setTranslateX(clientWidth * (imageLength + 1));
          setCurrent(1);
        } else {
          setTranslateX(clientWidth * (current + 1));
          setCurrent((prev) => prev + 1);
        }
      }
    }
  };

  const onPrev = useThrottledCallback(() => {
    onMoveSlide("prev");
  }, SLIDE_DURATION + 10);

  const onNext = useThrottledCallback(() => {
    onMoveSlide("next");
  }, SLIDE_DURATION + 10);

  useEffect(() => {
    const transitionEnd = () => {
      if (current <= 1 && slideRef.current) {
        slideRef.current.style.transitionDuration = "0ms";
        setTranslateX(slideRef.current.clientWidth * current);
      }

      if (current >= imageLength && slideRef.current) {
        slideRef.current.style.transitionDuration = "0ms";
        setTranslateX(slideRef.current.clientWidth * current);
      }
    };

    document.addEventListener("transitionend", transitionEnd);

    return () => {
      document.removeEventListener("transitionend", transitionEnd);
    };
  }, [current, imageLength]);

  // 최초 렌더링 시에만 첫번째 페이지로 이동하기 위하여 실행됨
  useLayoutEffect(() => {
    setTranslateX((slideRef.current?.clientWidth || 0) * current);
  }, []);

  return (
    <StyledCarousel>
      <StyledCarouselUl
        ref={slideRef}
        style={{
          transform: `translate3d(${-translateX}px, 0, 0)`,
        }}
      >
        {slides}
      </StyledCarouselUl>
      <StyledLeftButton onClick={onPrev}>
        <AiOutlineLeft />
      </StyledLeftButton>
      <StyledRightButton onClick={onNext}>
        <AiOutlineRight />
      </StyledRightButton>
    </StyledCarousel>
  );
}
