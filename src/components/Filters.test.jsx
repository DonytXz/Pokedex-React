import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Filters from "./Filters";

describe("Filters Component", () => {
  it("renders generation selector, type selector, and favorites toggle", () => {
    render(
      <Filters
        selectedGen="all"
        selectedType="all"
        isFavoritesOnly={false}
        favoritesCount={3}
      />
    );

    expect(screen.getByLabelText(/Region:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Type:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /show 3 favorite pokémon/i })).toBeInTheDocument();
  });

  it("calls onSelectGen when generation changes", () => {
    const onSelectGenMock = vi.fn();
    render(
      <Filters
        selectedGen="all"
        onSelectGen={onSelectGenMock}
      />
    );

    const genSelect = screen.getByLabelText(/Region:/i);
    fireEvent.change(genSelect, { target: { value: "1" } });

    expect(onSelectGenMock).toHaveBeenCalledWith("1");
  });

  it("calls onSelectType when elemental type changes", () => {
    const onSelectTypeMock = vi.fn();
    render(
      <Filters
        selectedType="all"
        onSelectType={onSelectTypeMock}
      />
    );

    const typeSelect = screen.getByLabelText(/Type:/i);
    fireEvent.change(typeSelect, { target: { value: "fire" } });

    expect(onSelectTypeMock).toHaveBeenCalledWith("fire");
  });

  it("shows Clear Filters button when any filter is active and triggers onResetFilters", () => {
    const onResetFiltersMock = vi.fn();
    render(
      <Filters
        selectedGen="1"
        onResetFilters={onResetFiltersMock}
      />
    );

    const clearBtn = screen.getByRole("button", { name: /reset all filters/i });
    expect(clearBtn).toBeInTheDocument();

    fireEvent.click(clearBtn);
    expect(onResetFiltersMock).toHaveBeenCalled();
  });
});
