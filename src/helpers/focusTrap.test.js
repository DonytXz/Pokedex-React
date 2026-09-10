import { describe, it, expect, vi } from "vitest";
import { handleFocusTrap } from "./focusTrap";

describe("handleFocusTrap helper", () => {
  it("does nothing when containerElement is null or undefined", () => {
    const event = { shiftKey: false, preventDefault: vi.fn() };
    expect(() => handleFocusTrap(event, null)).not.toThrow();
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it("does nothing when there are no focusable elements", () => {
    const container = document.createElement("div");
    const event = { shiftKey: false, preventDefault: vi.fn() };
    handleFocusTrap(event, container);
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it("cycles focus from last element to first on Tab press", () => {
    const container = document.createElement("div");
    const btn1 = document.createElement("button");
    const btn2 = document.createElement("button");
    Object.defineProperty(btn1, "offsetParent", { value: document.body });
    Object.defineProperty(btn2, "offsetParent", { value: document.body });
    container.appendChild(btn1);
    container.appendChild(btn2);
    document.body.appendChild(container);

    btn2.focus();
    const event = { shiftKey: false, preventDefault: vi.fn() };
    const focusSpy = vi.spyOn(btn1, "focus");

    handleFocusTrap(event, container);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(focusSpy).toHaveBeenCalled();
    document.body.removeChild(container);
  });

  it("cycles focus from first element to last on Shift+Tab press", () => {
    const container = document.createElement("div");
    const btn1 = document.createElement("button");
    const btn2 = document.createElement("button");
    Object.defineProperty(btn1, "offsetParent", { value: document.body });
    Object.defineProperty(btn2, "offsetParent", { value: document.body });
    container.appendChild(btn1);
    container.appendChild(btn2);
    document.body.appendChild(container);

    btn1.focus();
    const event = { shiftKey: true, preventDefault: vi.fn() };
    const focusSpy = vi.spyOn(btn2, "focus");

    handleFocusTrap(event, container);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(focusSpy).toHaveBeenCalled();
    document.body.removeChild(container);
  });
});
