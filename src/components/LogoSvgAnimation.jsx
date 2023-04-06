import React from 'react';
import useScreenSize from './useScreenSize';

function LogoSvgAnimation() {
  const { isSm, isMd, isLg, screen } = useScreenSize();
  let positionStyle = {};
  switch (screen) {
    case 'sm':
      positionStyle = {
        position: 'absolute',
        scale: '1',
        transform: 'none',
      };
      break;
    case 'md':
      positionStyle = {
        position: 'absolute',
        scale: '1',
        transform: 'translate(0px, -400px)',
      };
      break;
    case 'lg':
      positionStyle = {
        position: 'absolute',
        scale: '1.0',
        maxWidth: '1200px',
        transform: 'translate(0px, -800px)',
      };
      break;
    default:
      positionStyle = {
        position: 'absolute',
        transform: 'translate(0px, -160px)',
        scale: '1.0'
      };
  }
  console.log('ok', screen, positionStyle)

  return (
    <>
      <svg
        viewBox="0 0 1440 570"
        preserveAspectRatio="xMinYMin meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="floatingFooterCTA"
      >
        <g clipPath="url(#clip0_1002_83860)">
          <g
            id="bottom"
            style={{
              animation: 'floatUpAndDownBottom 3s ease-in-out infinite'
            }}
          >
            <path fillRule="evenodd" clipRule="evenodd" d="M732.44 494.821V570.292L490.795 508.597V433.929L731.32 495.081L732.44 494.821Z" fill="url(#paint0_linear_1002_83860)" />
            <path fillRule="evenodd" clipRule="evenodd" d="M732.439 494.818V570.274L881.362 532.534C891.388 529.898 915.785 520.805 919.651 508.426C920.282 506.403 920.185 504.834 920.185 502.792V433.109C919.395 444.629 900.337 456.177 863.418 464.676L732.439 494.818Z" fill="url(#paint1_linear_1002_83860)" />
            <path fillRule="evenodd" clipRule="evenodd" d="M490.795 435.583L621.333 404.768C693.129 387.818 806.341 387.804 872.916 404.736C939.49 421.663 935.309 449.786 863.424 466.333L731.32 496.739L490.795 435.583Z" fill="url(#paint2_linear_1002_83860)" />
            <g filter="url(#filter0_f_1002_83860)">
              <path fillRule="evenodd" clipRule="evenodd" d="M490.795 435.583L621.333 404.768C693.129 387.818 806.341 387.804 872.916 404.736C939.49 421.663 935.309 449.786 863.424 466.333L731.32 496.739L490.795 435.583Z" fill="url(#paint3_linear_1002_83860)" />
            </g>
            <g filter="url(#filter1_f_1002_83860)">
              <path fillRule="evenodd" clipRule="evenodd" d="M490.795 435.583L621.333 404.768C693.129 387.818 806.341 387.804 872.916 404.736C939.49 421.663 935.309 449.786 863.424 466.333L731.32 496.739L490.795 435.583Z" fill="url(#paint4_linear_1002_83860)" />
            </g>
            <g style={{ 'mixBlendMode': 'soft-light' }} filter="url(#filter2_f_1002_83860)">
              <path fillRule="evenodd" clipRule="evenodd" d="M490.795 453.709L621.333 410.065C693.129 386.057 806.341 386.037 872.916 410.019C939.49 433.994 935.309 473.825 863.424 497.261L731.32 540.327L490.795 453.709Z" fill="url(#paint5_linear_1002_83860)" />
            </g>
            <g style={{ 'mixBlendMode': 'overlay' }} filter="url(#filter3_f_1002_83860)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M871.47 410.407C805.878 393.725 693.627 393.714 622.68 410.464L515.378 435.794L731.389 490.717L862.108 460.629C879.813 456.554 892.966 451.845 901.759 446.986C910.893 441.939 913.88 437.549 914.3 434.796C914.632 432.616 913.587 428.891 906.356 424.03C899.317 419.297 887.839 414.569 871.47 410.407ZM619.985 399.072C692.631 381.92 806.804 381.881 874.361 399.063C891.279 403.365 904.244 408.5 912.898 414.318C921.361 420.008 927.261 427.522 925.884 436.557C924.594 445.019 917.219 451.821 907.431 457.229C897.302 462.826 882.977 467.838 864.739 472.036L731.251 502.761L489.35 441.255L489.447 429.887L619.985 399.072C619.985 399.072 619.985 399.072 619.985 399.072Z"
                fill="white"
                style={{
                  transform: 'translate(40px,20px)',
                  scale: '0.95',
                }}
              />
            </g>
          </g>
          <g
            id="middle"
            style={{
              animation: 'floatUpAndDownMiddle 3s ease-in-out infinite'
            }}
          >
            <g
              style={{
                'mixBlendMode': 'overlay',
                // scale up and down animation
                animation: 'scaleUpAndDown2 3s infinite',
                transformOrigin: 'center',
                filter: 'url(#blurFilter)'
              }}
            >
              <ellipse cx="720" cy="420" rx="100" ry="25" fill="#9600FF" />
            </g>
            <path fillRule="evenodd" clipRule="evenodd" d="M732.44 391.773V467.244L490.795 405.549V330.881L731.32 392.033L732.44 391.773Z" fill="url(#paint6_linear_1002_83860)" />
            <path fillRule="evenodd" clipRule="evenodd" d="M732.439 391.787V467.244L881.362 429.499C891.388 426.863 915.785 417.77 919.651 405.391C920.282 403.367 920.185 401.803 920.185 399.756V330.074C919.395 341.594 900.337 353.142 863.418 361.64L732.439 391.787Z" fill="url(#paint7_linear_1002_83860)" />
            <path fillRule="evenodd" clipRule="evenodd" d="M490.795 330.889L621.333 300.074C693.129 283.123 806.341 283.109 872.916 300.041C939.49 316.969 935.309 345.092 863.424 361.639L731.32 392.045L490.795 330.889Z" fill="url(#paint8_linear_1002_83860)" />
            <g filter="url(#filter4_f_1002_83860)">
              <path fillRule="evenodd" clipRule="evenodd" d="M490.795 330.89L621.333 300.075C693.129 283.125 806.341 283.111 872.916 300.043C939.49 316.97 935.309 345.093 863.424 361.64L731.32 392.046L490.795 330.89Z" fill="url(#paint9_linear_1002_83860)" />
            </g>
            <g style={{ 'mixBlendMode': 'soft-light' }} filter="url(#filter5_f_1002_83860)">
              <path fillRule="evenodd" clipRule="evenodd" d="M490.795 330.89L621.333 300.075C693.129 283.125 806.341 283.111 872.916 300.043C939.49 316.97 935.309 345.093 863.424 361.64L731.32 392.046L490.795 330.89Z" fill="url(#paint10_linear_1002_83860)" />
            </g>
            <g filter="url(#filter6_f_1002_83860)">
              <path fillRule="evenodd" clipRule="evenodd" d="M490.795 330.89L621.333 300.075C693.129 283.125 806.341 283.111 872.916 300.043C939.49 316.97 935.309 345.093 863.424 361.64L731.32 392.046L490.795 330.89Z" fill="url(#paint11_linear_1002_83860)" />
            </g>
            <g style={{ 'mixBlendMode': 'overlay' }} filter="url(#filter7_f_1002_83860)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M871.47 305.055C805.878 288.372 693.627 288.361 622.68 305.111L515.378 330.441L731.389 385.364L862.108 355.276C879.813 351.201 892.966 346.492 901.759 341.633C910.893 336.586 913.88 332.196 914.3 329.443C914.632 327.264 913.587 323.539 906.356 318.677C899.317 313.945 887.839 309.217 871.47 305.055ZM619.985 293.719C692.631 276.568 806.804 276.529 874.361 293.711C891.279 298.012 904.244 303.147 912.898 308.966C921.361 314.655 927.261 322.169 925.884 331.205C924.594 339.667 917.219 346.468 907.431 351.877C897.302 357.474 882.977 362.485 864.739 366.683L731.251 397.408L489.35 335.902L489.447 324.534L619.985 293.719C619.985 293.719 619.985 293.719 619.985 293.719Z"
                fill="white"
                style={{
                  transform: 'translate(40px,20px)',
                  scale: '0.95',
                }}
              />
            </g>
          </g>
          <g
            id="top"
            style={{
              animation: 'floatUpAndDownTop 3s ease-in-out infinite'
            }}
          >
            <g
              style={{
                'mixBlendMode': 'overlay',
                // scale up and down animation
                animation: 'scaleUpAndDown 3s infinite',
                transformOrigin: 'center'
              }}
              filter="url(#filter0_f_1059_31287)"
            >
              <ellipse cx="720" cy="340" rx="100" ry="25" fill="#9600FF" />
            </g>
            <path fillRule="evenodd" clipRule="evenodd" d="M732.44 287.339V362.81L490.795 301.115V226.447L731.32 287.599L732.44 287.339Z" fill="url(#paint12_linear_1002_83860)" />
            <path fillRule="evenodd" clipRule="evenodd" d="M732.439 287.353V362.81L881.362 325.065C891.388 322.429 915.785 313.336 919.651 300.958C920.282 298.934 920.185 297.37 920.185 295.323V225.64C919.395 237.16 900.337 248.708 863.418 257.207L732.439 287.353Z" fill="url(#paint13_linear_1002_83860)" />
            <path fillRule="evenodd" clipRule="evenodd" d="M490.795 226.455L621.333 195.64C693.129 178.689 806.341 178.675 872.916 195.607C939.49 212.535 935.309 240.658 863.424 257.205L731.32 287.611L490.795 226.455Z" fill="url(#paint14_linear_1002_83860)" />
            <rect y="0.0942383" width="1440" height="467.149" fill="url(#paint15_radial_1002_83860)" />
          </g>
        </g>
        <defs>
          <filter id="blurFilter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
          </filter>
          <filter id="filter0_f_1059_31287" x="0.857422" y="0.779785" width="993.526" height="381.849" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            {/* <feFlood floodOpacity="0" result="BackgroundImageFix" /> */}
            {/* <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" /> */}
            <feGaussianBlur stdDeviation="10" result="effect1_foregroundBlur_1059_31287" />
          </filter>
          <filter id="filter0_f_1059_31288" x="0.857422" y="0.779785" width="993.526" height="381.849" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            {/* <feFlood floodOpacity="0" result="BackgroundImageFix" /> */}
            {/* <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" /> */}
            <feGaussianBlur stdDeviation="10" result="effect1_foregroundBlur_1059_31288" />
          </filter>
          <filter id="filter0_f_1002_83860" x="470.795" y="372.046" width="469.424" height="144.693" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="10" result="effect1_foregroundBlur_1002_83860" />
          </filter>
          <filter id="filter1_f_1002_83860" x="470.795" y="372.046" width="469.424" height="144.693" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="10" result="effect1_foregroundBlur_1002_83860" />
          </filter>
          <filter id="filter2_f_1002_83860" x="450.795" y="352.046" width="509.424" height="228.281" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="20" result="effect1_foregroundBlur_1002_83860" />
          </filter>
          <filter id="filter3_f_1002_83860" x="485.35" y="382.192" width="444.734" height="124.568" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_1002_83860" />
          </filter>
          <filter id="filter4_f_1002_83860" x="470.795" y="267.353" width="469.424" height="144.693" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="10" result="effect1_foregroundBlur_1002_83860" />
          </filter>
          <filter id="filter5_f_1002_83860" x="450.795" y="247.353" width="509.424" height="184.693" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="20" result="effect1_foregroundBlur_1002_83860" />
          </filter>
          <filter id="filter6_f_1002_83860" x="470.795" y="267.353" width="469.424" height="144.693" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="10" result="effect1_foregroundBlur_1002_83860" />
          </filter>
          <filter id="filter7_f_1002_83860" x="485.35" y="276.84" width="444.734" height="124.568" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_1002_83860" />
          </filter>
          <linearGradient id="paint0_linear_1002_83860" x1="552.176" y1="348.701" x2="757.564" y2="437.524" gradientUnits="userSpaceOnUse">
            <stop stopColor="#020E1E" />
            <stop offset="1" stopColor="#0D233C" />
          </linearGradient>
          <linearGradient id="paint1_linear_1002_83860" x1="920.189" y1="448.988" x2="754.588" y2="560.032" gradientUnits="userSpaceOnUse">
            <stop stopColor="#020E1E" />
            <stop offset="1" stopColor="#0D233C" />
          </linearGradient>
          <linearGradient id="paint2_linear_1002_83860" x1="552.895" y1="427.122" x2="899.141" y2="436.136" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0E00FF" />
            <stop offset="1" stopColor="#7C00FB" />
          </linearGradient>
          <linearGradient id="paint3_linear_1002_83860" x1="552.895" y1="427.122" x2="899.141" y2="436.136" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0E00FF" />
            <stop offset="1" stopColor="#7C00FB" />
          </linearGradient>
          <linearGradient id="paint4_linear_1002_83860" x1="552.895" y1="427.122" x2="899.141" y2="436.136" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0E00FF" />
            <stop offset="1" stopColor="#7C00FB" />
          </linearGradient>
          <linearGradient id="paint5_linear_1002_83860" x1="552.895" y1="441.725" x2="899.259" y2="448.092" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0E00FF" />
            <stop offset="1" stopColor="#7C00FB" />
          </linearGradient>
          <linearGradient id="paint6_linear_1002_83860" x1="552.176" y1="245.653" x2="757.564" y2="334.476" gradientUnits="userSpaceOnUse">
            <stop stopColor="#020E1E" />
            <stop offset="1" stopColor="#0D233C" />
          </linearGradient>
          <linearGradient id="paint7_linear_1002_83860" x1="920.189" y1="345.954" x2="754.584" y2="456.996" gradientUnits="userSpaceOnUse">
            <stop stopColor="#020E1E" />
            <stop offset="1" stopColor="#0D233C" />
          </linearGradient>
          <linearGradient id="paint8_linear_1002_83860" x1="552.895" y1="322.428" x2="899.141" y2="331.442" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0E00FF" />
            <stop offset="1" stopColor="#7C00FB" />
          </linearGradient>
          <linearGradient id="paint9_linear_1002_83860" x1="552.895" y1="322.429" x2="899.141" y2="331.443" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0E00FF" />
            <stop offset="1" stopColor="#7C00FB" />
          </linearGradient>
          <linearGradient id="paint10_linear_1002_83860" x1="552.895" y1="322.429" x2="899.141" y2="331.443" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0E00FF" />
            <stop offset="1" stopColor="#7C00FB" />
          </linearGradient>
          <linearGradient id="paint11_linear_1002_83860" x1="552.895" y1="322.429" x2="899.141" y2="331.443" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0E00FF" />
            <stop offset="1" stopColor="#7C00FB" />
          </linearGradient>
          <linearGradient id="paint12_linear_1002_83860" x1="552.176" y1="141.219" x2="757.564" y2="230.042" gradientUnits="userSpaceOnUse">
            <stop stopColor="#020E1E" />
            <stop offset="1" stopColor="#0D233C" />
          </linearGradient>
          <linearGradient id="paint13_linear_1002_83860" x1="920.189" y1="241.52" x2="754.584" y2="352.563" gradientUnits="userSpaceOnUse">
            <stop stopColor="#020E1E" />
            <stop offset="1" stopColor="#0D233C" />
          </linearGradient>
          <linearGradient id="paint14_linear_1002_83860" x1="920.217" y1="195.038" x2="811.221" y2="414.049" gradientUnits="userSpaceOnUse">
            <stop stopColor="#020E1E" />
            <stop offset="1" stopColor="#0D233C" />
          </linearGradient>
          <radialGradient id="paint15_radial_1002_83860" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(720 295.543) rotate(90) scale(171.701 529.272)">
            <stop stopColor="#040A19" />
            <stop offset="1" stopColor="#040A19" stopOpacity="0" />
          </radialGradient>
          <clipPath id="clip0_1002_83860">
            <rect width="679" height="387" fill="white" transform="translate(380.453 182.917)" />
          </clipPath>
        </defs>
      </svg >

    </>
  )
};

export default LogoSvgAnimation;


