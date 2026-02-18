import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

import { useForm } from "react-hook-form";
import TextField from "./TextField";

afterEach(() => {
  cleanup();
});

describe("TextField", () => {
  it("should render TextField with controller", () => {
    vi.clearAllMocks();
    const Component = () => {
      const { control } = useForm<{ test: string }>({
        defaultValues: {
          test: "test",
        },
      });
      return <TextField control={control} name="test" />;
    };
    render(<Component />);
    expect(screen.getByRole("textbox"));
    expect(screen.getByDisplayValue("test"));
  });
});
