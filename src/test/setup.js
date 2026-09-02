import "@testing-library/jest-dom/vitest";
import * as matchers from "vitest-axe/matchers";
import { expect, vi, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

expect.extend(matchers);

// Mock HTMLCanvasElement for JSDOM environment
HTMLCanvasElement.prototype.getContext = () => ({
  fillRect: () => {},
  clearRect: () => {},
  getImageData: () => ({ data: [] }),
  putImageData: () => {},
  createImageData: () => [],
  setTransform: () => {},
  drawImage: () => {},
  save: () => {},
  fillText: () => {},
  restore: () => {},
  beginPath: () => {},
  moveTo: () => {},
  lineTo: () => {},
  closePath: () => {},
  stroke: () => {},
  translate: () => {},
  scale: () => {},
  rotate: () => {},
  arc: () => {},
  fill: () => {},
  measureText: () => ({ width: 0 }),
  transform: () => {},
  rect: () => {},
  clip: () => {},
});

// Mock offsetParent for JSDOM
Object.defineProperty(HTMLElement.prototype, "offsetParent", {
  get() {
    return this.parentElement;
  },
});

afterEach(() => {
  cleanup();
});


