import { Meta, StoryObj } from "@storybook/react";
import { useForm, Controller } from "react-hook-form";
import BaseTextField from "./BaseTextField";
import { Box } from "@mui/material";

export default {
  title: "Components/BaseTextField",
  component: BaseTextField,
  tags: ["autodocs"],
  argTypes: {
    color: {
      options: ["primary", "secondary", "error", "success", "warning"],
      control: { type: "radio" },
    },
  },
} satisfies Meta<typeof BaseTextField>;

type FormValues = {
  name: string;
};

const Template = (args: Meta<typeof BaseTextField>) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    alert(JSON.stringify(data));
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} width={300}>
      <Controller
        name="name"
        control={control}
        rules={{ required: "This field is required" }}
        render={({ field }) => (
          <BaseTextField
            label="Your Name"
            field={field}
            fieldError={errors.name}
            {...args}
          />
        )}
      />
    </Box>
  );
};

export const Default: StoryObj = {
  args: {
    color: "warning",
  },

  render: (args) => <Template {...args} />,
};
