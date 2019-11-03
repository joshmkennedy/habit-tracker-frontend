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
          strokeWidth='3 '
        >
          <circle
            className='checkmark__circle'
            cx='26'
            cy='26'
            r='25'
            fill='none'
            stroke={color}
          />
          <path
            className='checkmark__check'
            fill='none'
            stroke={color}
            d='M14.1 27.2l7.1 7.2 16.7-16.8'
          />
        </svg>
      );
    case "edit":
      return (
        <svg
          x='0px'
          y='0px'
          viewBox='0 0 709.1 709.1'
          width='24px'
          fill={color}
        >
          <g id='pencil'>
            <g id='pencil-2'>
              <path
                d='M502.4,191.4L488,214l-1-0.8L278.2,510.9l-65.6,46.3l18.8-77l214.3-302.9l0.3,0.2l6.1-9.2l7.8-11
			c8.2-11.5,24.2-14.3,35.7-6.1C508.5,160.4,511.6,178.4,502.4,191.4z'
              />
            </g>
          </g>
          <g id='Layer_3'>
            <circle
              fill='none'
              stroke={color}
              strokeWidth='40'
              strokeMiterlimit='10'
              cx='354.5'
              cy='354.5'
              r='342'
            />
          </g>
        </svg>
      );
    case "delete":
      return (
        <svg
          className='checkmark'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 52 52'
          strokeWidth='3 '
        >
          <circle
            className='checkmark__circle'
            cx='26'
            cy='26'
            r='25'
            fill='none'
            stroke={color}
          />
          <path
            className='checkmark__check'
            fill='none'
            stroke={color}
            d='M14 14 L38 38'
          />
          <path
            className='checkmark__check'
            fill='none'
            stroke={color}
            d='M14 38 L38 14'
          />
        </svg>
      );
    default:
      return "";
  }
};

export default Icon;
