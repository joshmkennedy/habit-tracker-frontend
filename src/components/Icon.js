import React from "react";

const Icon = ({ name, color }) => {
  switch (name) {
    case "close":
      return (
        <svg
          x='0px'
          y='0px'
          width='24px'
          height='24px'
          viewBox='0 0 31.11 31.11'
          enableBackground='new 0 0 31.11 31.11'
        >
          <polygon
            fill={color}
            points='31.11,1.41 29.7,0 15.56,14.14 1.41,0 0,1.41 14.14,15.56 0,29.7 1.41,31.11 15.56,16.97   29.7,31.11 31.11,29.7 16.97,15.56 '
          />
        </svg>
      );

    case "options":
      return (
        <svg
          version='1.1'
          id='Capa_1'
          fill={color}
          width='12px'
          viewBox='0 0 408 408'
        >
          <g>
            <g id='more-vert'>
              <path d='M204,102c28.05,0,51-22.95,51-51S232.05,0,204,0s-51,22.95-51,51S175.95,102,204,102z M204,153c-28.05,0-51,22.95-51,51    s22.95,51,51,51s51-22.95,51-51S232.05,153,204,153z M204,306c-28.05,0-51,22.95-51,51s22.95,51,51,51s51-22.95,51-51    S232.05,306,204,306z' />
            </g>
          </g>
        </svg>
      );

    case "checkmark":
      return (
        <svg
          className='checkmark'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 52 52'
        >
          <circle
            className='checkmark__circle'
            cx='26'
            cy='26'
            r='25'
            fill={color}
          />
          <path
            className='checkmark__check'
            fill='none'
            stroke='white'
            d='M14.1 27.2l7.1 7.2 16.7-16.8'
          />
        </svg>
      );
    default:
      return "";
  }
};

export default Icon;
