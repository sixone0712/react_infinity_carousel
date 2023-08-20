import styled from "styled-components";

export const StyledCarousel = styled.div`
  width: 600px;
  height: 400px;
  position: relative;
  overflow: hidden;
`;

export const StyledCarouselUl = styled.ul`
  display: flex;
  width: 100%;
  height: 100%;
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    flex-shrink: 0;
    width: 100%;
    height: 100%;
  }
`;

export const StyledLeftButton = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  svg {
    width: 50px;
    height: 50px;
  }
  margin: 0 10px;
  cursor: pointer;
`;

export const StyledRightButton = styled(StyledLeftButton)`
  left: unset;
  right: 0;
`;
