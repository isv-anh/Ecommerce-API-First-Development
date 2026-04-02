import { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";
import TextField from "./TextField";
import { Box } from "@mui/material";

export default {
  title: "Components/TextField",
  component: TextField,
  tags: ["autodocs"],
  argTypes: {
    color: {
      options: ["primary", "secondary", "error", "success", "warning"],
      control: { type: "radio" },
    },
  },
} as Meta<typeof TextField>;

type FormValues = {
  name: string;
};

const Template = (args: Meta<typeof TextField>) => {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    alert(JSON.stringify(data));
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} width={300}>
      <TextField {...args} label="Your Name" control={control} name="name" />
    </Box>
  );
};

export const Default: StoryObj = {
  render: (args) => <Template {...args} />,
};
