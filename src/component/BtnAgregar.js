import React from "react";
import styled from "styled-components";

const ButtonM = ({ onClick }) => {  // Acepta la propiedad onClick
  return (
    <StyledWrapper>
      <button type="button" className="button" onClick={onClick}>  {/* Agrega onClick aquí */}
        <span className="button__text">Añadir servicio</span>
        <span className="button__icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            viewBox="0 0 24 24"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            stroke="currentColor"
            height="28"
            fill="none"
            className="svg"
          >
            <line y2="19" y1="5" x2="12" x1="12" />
            <line y2="12" y1="12" x2="19" x1="5" />
          </svg>
        </span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .button {
    --main-focus: #2d8cf0;
    --font-color: #dedede;
    --bg-color-sub: #222;
    --bg-color: #323232;
    --main-color: #dedede;
    position: relative;
    width: 200px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    border: 2px solid var(--main-color);
    box-shadow: 4px 4px var(--main-color);
    background-color: var(--bg-color);
    border-radius: 10px;
    overflow: hidden;
  }

  .button, .button__icon, .button__text {
    transition: all 0.3s;
  }

  .button .button__text {
    transform: translateX(15px);
    color: var(--font-color);
    font-weight: 600;
  }

  .button .button__icon {
    position: absolute;
    transform: translateX(155px);
    height: 100%;
    width: 39px;
    background-color: var(--bg-color-sub);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .button .svg {
    width: 20px;
    stroke: var(--main-color);
  }

  .button:hover {
    background: var(--bg-color);
  }

  .button:hover .button__text {
    color: transparent;
  }

  .button:hover .button__icon {
    width: 190px;
    transform: translateX(0);
  }

  .button:active {
    transform: translate(3px, 3px);
    box-shadow: 0px 0px var(--main-color);
  }
`;

export default ButtonM;
