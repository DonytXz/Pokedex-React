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

  it("closes when Escape key is pressed", () => {
    const onCloseMock = vi.fn();
    render(
      <TeamBuilder
        team={mockTeam}
        isOpen={true}
        onClose={onCloseMock}
      />
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("triggers onClearTeam when clear team button is clicked", () => {
    const onClearMock = vi.fn();
    render(
      <TeamBuilder
        team={mockTeam}
        isOpen={true}
        onClose={vi.fn()}
        onClearTeam={onClearMock}
      />
    );

    const clearBtn = screen.getByRole("button", { name: /clear all team members/i });
    fireEvent.click(clearBtn);
    expect(onClearMock).toHaveBeenCalled();
  });

  it("triggers onSelectPokemon and onClose when a team member is selected", () => {
    const onSelectMock = vi.fn();
    const onCloseMock = vi.fn();
    render(
      <TeamBuilder
        team={mockTeam}
        isOpen={true}
        onClose={onCloseMock}
        onSelectPokemon={onSelectMock}
      />
    );

    const selectBtn = screen.getByRole("button", { name: /view pikachu details/i });
    fireEvent.click(selectBtn);

    expect(onCloseMock).toHaveBeenCalled();
    expect(onSelectMock).toHaveBeenCalledWith("pikachu");
  });

  it("traps focus inside dialog on Tab and Shift+Tab", () => {
    render(
      <TeamBuilder
        team={mockTeam}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    const dialog = screen.getByRole("dialog");
    const focusable = Array.from(dialog.querySelectorAll("button"));
    const firstBtn = focusable[0];
    const lastBtn = focusable[focusable.length - 1];

    // Focus first element and press Shift+Tab -> should wrap to last element
    firstBtn.focus();
    expect(document.activeElement).toBe(firstBtn);
    fireEvent.keyDown(window, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(lastBtn);

    // Focus last element and press Tab -> should wrap to first element
    lastBtn.focus();
    expect(document.activeElement).toBe(lastBtn);
    fireEvent.keyDown(window, { key: "Tab", shiftKey: false });
    expect(document.activeElement).toBe(firstBtn);
  });
});
