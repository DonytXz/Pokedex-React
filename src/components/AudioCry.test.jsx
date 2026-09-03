import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AudioCry from "./AudioCry";

describe("AudioCry Component", () => {
  let playMock;
  let pauseMock;

  beforeEach(() => {
    vi.restoreAllMocks();
    playMock = vi.fn().mockResolvedValue(undefined);
    pauseMock = vi.fn();

    global.Audio = vi.fn().mockImplementation(function (src) {
      this.src = src;
      this.currentTime = 0;
      this.play = playMock;
      this.pause = pauseMock;
    });
  });

  it("renders nothing when cryUrl is not provided", () => {
    const { container } = render(<AudioCry cryUrl={null} pokemonName="Pikachu" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders audio button and plays cry when clicked", () => {
    render(
      <AudioCry
        cryUrl="https://example.com/cries/25.ogg"
        pokemonName="Pikachu"
      />
    );

    const button = screen.getByRole("button", { name: /play cry for pikachu/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(global.Audio).toHaveBeenCalledWith("https://example.com/cries/25.ogg");
    expect(playMock).toHaveBeenCalled();
    expect(screen.getByText("Playing Cry...")).toBeInTheDocument();
  });

  it("stops playback when clicked again while playing", () => {
    render(
      <AudioCry
        cryUrl="https://example.com/cries/25.ogg"
        pokemonName="Pikachu"
      />
    );

    const button = screen.getByRole("button", { name: /play cry for pikachu/i });
    fireEvent.click(button);
    expect(playMock).toHaveBeenCalled();

    // Click again to pause/stop
    fireEvent.click(button);
    expect(pauseMock).toHaveBeenCalled();
    expect(screen.getByText("Cry")).toBeInTheDocument();
  });
});
