import React, { act } from "react";
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

  it("handles audio onended and resets playing state", () => {
    let createdAudio;
    global.Audio = vi.fn().mockImplementation(function (src) {
      this.src = src;
      this.currentTime = 0;
      this.play = playMock;
      this.pause = pauseMock;
      createdAudio = this;
    });

    render(
      <AudioCry
        cryUrl="https://example.com/cries/25.ogg"
        pokemonName="Pikachu"
      />
    );

    const button = screen.getByRole("button", { name: /play cry for pikachu/i });
    fireEvent.click(button);
    expect(screen.getByText("Playing Cry...")).toBeInTheDocument();

    // Trigger onended callback
    act(() => {
      createdAudio.onended();
    });
    expect(screen.getByText("Cry")).toBeInTheDocument();
  });

  it("handles audio onerror and resets playing state", () => {
    let createdAudio;
    global.Audio = vi.fn().mockImplementation(function (src) {
      this.src = src;
      this.currentTime = 0;
      this.play = playMock;
      this.pause = pauseMock;
      createdAudio = this;
    });

    render(
      <AudioCry
        cryUrl="https://example.com/cries/25.ogg"
        pokemonName="Pikachu"
      />
    );

    const button = screen.getByRole("button", { name: /play cry for pikachu/i });
    fireEvent.click(button);
    expect(screen.getByText("Playing Cry...")).toBeInTheDocument();

    // Trigger onerror callback
    act(() => {
      createdAudio.onerror();
    });
    expect(screen.getByText("Cry")).toBeInTheDocument();
  });

  it("handles audio play promise rejection gracefully", async () => {
    playMock = vi.fn().mockRejectedValue(new Error("Audio play blocked by browser policy"));
    global.Audio = vi.fn().mockImplementation(function (src) {
      this.src = src;
      this.currentTime = 0;
      this.play = playMock;
      this.pause = pauseMock;
    });

    render(
      <AudioCry
        cryUrl="https://example.com/cries/25.ogg"
        pokemonName="Pikachu"
      />
    );

    const button = screen.getByRole("button", { name: /play cry for pikachu/i });
    fireEvent.click(button);

    await screen.findByText("Cry");
    expect(screen.getByText("Cry")).toBeInTheDocument();
  });

  it("uses default fallback 'Pokémon' when pokemonName prop is omitted", () => {
    render(<AudioCry cryUrl="https://example.com/cries/25.ogg" />);

    const button = screen.getByRole("button", { name: "Play cry for Pokémon" });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.getByRole("button", { name: "Stop cry for Pokémon" })).toBeInTheDocument();
  });

  it("pauses active audio on cryUrl change or unmount cleanup", () => {
    const { rerender, unmount } = render(
      <AudioCry
        cryUrl="https://example.com/cries/25.ogg"
        pokemonName="Pikachu"
      />
    );

    const button = screen.getByRole("button", { name: /play cry for pikachu/i });
    fireEvent.click(button);

    // Rerender with a new cryUrl triggers cleanup
    rerender(
      <AudioCry
        cryUrl="https://example.com/cries/26.ogg"
        pokemonName="Raichu"
      />
    );
    expect(pauseMock).toHaveBeenCalled();

    // Unmount also triggers cleanup
    unmount();
  });
});

