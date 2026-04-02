import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("should have test", () => {
  it(() => {
    render(<Home />);
    expect(screen.getByText("this is an error"));
  });
});
