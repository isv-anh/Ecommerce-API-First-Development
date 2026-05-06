import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import BaseTextField from "./BaseTextField";
import { Controller, useForm } from "react-hook-form";

afterEach(() => {
  cleanup();
});

describe("BaseTextField", () => {
  it("should render BaseTextField component", () => {
    render(<BaseTextField />);
    expect(screen.getByRole("textbox"));
  });

  it("should render BaseTextField with controller", () => {
    vi.clearAllMocks();
    const Component = () => {
      const { control } = useForm<{ test: string }>({
        defaultValues: {
          test: "test",
        },
      });
      return (
        <Controller
          control={control}
          name="test"
          render={({ field, fieldState }) => {
            return (
              <BaseTextField field={field} fieldError={fieldState.error} />
            );
          }}
        />
      );
    };
    render(<Component />);
    expect(screen.getByRole("textbox"));
    expect(screen.getByDisplayValue("test"));
  });
});
