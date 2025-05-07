import "@testing-library/jest-dom";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // or any theme you're using
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
// Mock matchMedia (JSDOM doesn't support it)

global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      matches: false,

      addListener: jest.fn(),

      removeListener: jest.fn(),
    };
  };

// Mock getComputedStyle to prevent JSDOM errors on CSS variables

global.getComputedStyle = () => ({
  getPropertyValue: () => "",
});
