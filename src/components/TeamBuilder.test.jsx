import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TeamBuilder from "./TeamBuilder";

describe("TeamBuilder Component", () => {
  const mockTeam = [
    {
      id: 25,
      name: "pikachu",
      sprites: { front_default: "https://example.com/25.png" },
      types: [{ type: { name: "electric" } }],
      stats: [{ base_stat: 35, stat: { name: "hp" } }],
    },
  ];

  it("renders null when isOpen is false", () => {
    const { container } = render(
      <TeamBuilder team={mockTeam} isOpen={false} onClose={vi.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders team members and empty slots when open", () => {
    render(
      <TeamBuilder team={mockTeam} isOpen={true} onClose={vi.fn()} />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("pikachu")).toBeInTheDocument();
    expect(screen.getByText("Slot 2")).toBeInTheDocument();
    expect(screen.getByText("Slot 6")).toBeInTheDocument();
  });

  it("triggers onRemoveMember when remove button is clicked", () => {
    const onRemoveMock = vi.fn();
    render(
      <TeamBuilder
        team={mockTeam}
        isOpen={true}
        onClose={vi.fn()}
        onRemoveMember={onRemoveMock}
      />
    );

    const removeBtn = screen.getByRole("button", { name: /remove pikachu from team/i });
    fireEvent.click(removeBtn);

    expect(onRemoveMock).toHaveBeenCalledWith(25);
  });

  it("closes when close button is clicked", () => {
    const onCloseMock = vi.fn();
    render(
      <TeamBuilder
        team={mockTeam}
        isOpen={true}
        onClose={onCloseMock}
      />
    );

    const closeBtn = screen.getByRole("button", { name: /close team builder/i });
    fireEvent.click(closeBtn);

    expect(onCloseMock).toHaveBeenCalled();
  });
});
