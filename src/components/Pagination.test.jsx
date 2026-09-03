import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Pagination from "./Pagination";

describe("Pagination Component", () => {
  const defaultProps = {
    page: 0,
    total: 10,
    onLeftClick: vi.fn(),
    onRightClick: vi.fn(),
    firstPage: vi.fn(),
    secondPage: vi.fn(),
    underLatsPage: vi.fn(),
    lastPage: vi.fn(),
  };

  it("disables previous button on first page and enables next button", () => {
    render(<Pagination {...defaultProps} page={0} />);

    const prevBtn = screen.getByRole("button", { name: "Previous page" });
    const nextBtn = screen.getByRole("button", { name: "Next page" });

    expect(prevBtn).toBeDisabled();
    expect(nextBtn).not.toBeDisabled();
  });

  it("disables next button on last page and enables previous button", () => {
    render(<Pagination {...defaultProps} page={9} total={10} />);

    const prevBtn = screen.getByRole("button", { name: "Previous page" });
    const nextBtn = screen.getByRole("button", { name: "Next page" });

    expect(prevBtn).not.toBeDisabled();
    expect(nextBtn).toBeDisabled();
  });

  it("renders buttons for page 1, 2, ellipsis, total-1, and total when total > 4", () => {
    render(<Pagination {...defaultProps} page={0} total={10} />);

    expect(screen.getByRole("button", { name: "Page 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 2" })).toBeInTheDocument();
    expect(screen.getByText("...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 9" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 10" })).toBeInTheDocument();
  });

  it("marks aria-current on the active page button", () => {
    const { rerender } = render(<Pagination {...defaultProps} page={0} total={5} />);
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute("aria-current", "page");

    rerender(<Pagination {...defaultProps} page={1} total={5} />);
    expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute("aria-current", "page");

    rerender(<Pagination {...defaultProps} page={3} total={5} />);
    expect(screen.getByRole("button", { name: "Page 4" })).toHaveAttribute("aria-current", "page");

    rerender(<Pagination {...defaultProps} page={4} total={5} />);
    expect(screen.getByRole("button", { name: "Page 5" })).toHaveAttribute("aria-current", "page");
  });

  it("calls callback functions when navigation buttons are clicked", () => {
    const onLeftClick = vi.fn();
    const onRightClick = vi.fn();
    const firstPage = vi.fn();
    const secondPage = vi.fn();
    const underLatsPage = vi.fn();
    const lastPage = vi.fn();

    render(
      <Pagination
        page={1}
        total={6}
        onLeftClick={onLeftClick}
        onRightClick={onRightClick}
        firstPage={firstPage}
        secondPage={secondPage}
        underLatsPage={underLatsPage}
        lastPage={lastPage}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Previous page" }));
    expect(onLeftClick).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onRightClick).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Page 1" }));
    expect(firstPage).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Page 2" }));
    expect(secondPage).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Page 5" }));
    expect(underLatsPage).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Page 6" }));
    expect(lastPage).toHaveBeenCalled();
  });

  it("renders correctly when total pages is small (total = 1 or 2)", () => {
    const { rerender } = render(<Pagination {...defaultProps} page={0} total={1} />);
    expect(screen.getByRole("button", { name: "Page 1" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Page 2" })).toBeNull();

    rerender(<Pagination {...defaultProps} page={0} total={2} />);
    expect(screen.getByRole("button", { name: "Page 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 2" })).toBeInTheDocument();
    expect(screen.queryByText("...")).toBeNull();
  });

  it("renders active middle page button when page is between ends", () => {
    render(<Pagination {...defaultProps} page={5} total={20} />);
    const page6 = screen.getByRole("button", { name: "Page 6" });
    expect(page6).toBeInTheDocument();
    expect(page6).toHaveAttribute("aria-current", "page");
  });
});
