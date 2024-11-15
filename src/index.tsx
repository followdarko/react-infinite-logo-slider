import React, { useEffect, useRef, useCallback } from "react";

interface SliderProps {
  children: React.ReactElement[]; // Expecting an array of React elements as children
  width?: string; // Optional width prop for each slide
  duration?: number; // Optional duration for the animation in seconds
  toRight?: boolean; // Optional boolean to control direction of the animation
  pauseOnHover?: boolean; // Optional boolean to pause animation on hover
  blurBorders?: boolean; // Optional boolean to add blur effects on the borders
  blurBorderColor?: string; // Optional color for blur border effect
}

interface SlideProps {
  children: React.ReactNode; // Children for each individual slide
  width?: string; // Optional width for each slide
}

const Slider: React.FC<SliderProps> & { Slide: React.FC<SlideProps> } = ({
  children,
  width = "200px",
  duration = 40,
  toRight = false,
  pauseOnHover = false,
  blurBorders = false,
  blurBorderColor = "#fff",
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);

  useEffect(() => {
    if (!children.length) return;

    // Calculate the total translation value based on children length and width
    const totalTranslateX = `calc(${toRight ? '' : '-'}${width} * ${
        children.length
    })`;

    const keyframes = [
        { transform: 'translateX(0px)' },
        { transform: `translateX(${totalTranslateX})` },
    ];

    animationRef.current = sliderRef.current?.animate(keyframes, {
        duration: duration * 1000,
        easing: 'linear',
        iterations: Infinity,
    }) || null;
  }, [toRight, width, children, duration]);

  const handleEnter = useCallback(() => {
    if (pauseOnHover) {
          animationRef.current?.pause();
      }
  }, [pauseOnHover]);

  const handleLeave = useCallback(() => {
      if (pauseOnHover) {
          animationRef.current?.play();
      }
  }, [pauseOnHover]);

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          width: "100%",
          height: "auto",
          margin: "auto",
          overflow: "hidden",
          position: "relative",
        }}
        onMouseEnter={() => pauseOnHover && handleEnter()}
        onMouseLeave={() => pauseOnHover && handleLeave()}
        onTouchStart={handleEnter}
        onTouchEnd={handleLeave}
      >
        <div
          style={{
            display: "flex",
            width: `calc(${width} * ${children.length * 3})`,
          }}
          ref={sliderRef}
        >
          {children.map((child, i) => (
            <React.Fragment key={i}>
              {React.cloneElement(child, { width })}
            </React.Fragment>
          ))}
          {children.map((child, i) => (
            <React.Fragment key={i}>
              {React.cloneElement(child, { width })}
            </React.Fragment>
          ))}
          {children.map((child, i) => (
            <React.Fragment key={i}>
              {React.cloneElement(child, { width })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {blurBorders && (
        <>
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: "180px",
              transform: "rotate(180deg)",
              zIndex: 10,
              height: "105%",
              background: `linear-gradient(90deg, ${blurBorderColor} 10%, rgba(255, 255, 255, 0) 80%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "180px",
              zIndex: 10,
              height: "120%",
              background: `linear-gradient(90deg, ${blurBorderColor} 10%, rgba(255, 255, 255, 0) 80%)`,
            }}
          />
        </>
      )}
    </div>
  );
};

// Slide component definition with TypeScript
const Slide: React.FC<SlideProps> = ({
  children,
  width = "200px",
  ...props
}) => {
  return (
    <div
      style={{
        width: width,
        alignItems: "center",
        display: "flex",
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// Assign the Slide component to Slider.Slide
Slider.Slide = Slide;

export default Slider;
