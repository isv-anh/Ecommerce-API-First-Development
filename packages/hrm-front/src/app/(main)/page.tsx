"use client";
import BaseTextField from "@/components/inputs/TextField/BaseTextField/BaseTextField";
import TextField from "@/components/inputs/TextField/TextField";
import { useListPetsSuspense } from "@/generated/endpoints/petstore/petstore";

import Button from "@mui/material/Button";
import { useState } from "react";
import { useForm } from "react-hook-form";

const Home = () => {
  const query = useListPetsSuspense();
  const { control } = useForm<{ test: string }>({
    defaultValues: {
      test: "default",
    },
  });

  const [a, setA] = useState(0);
  console.log("a", a);

  return (
    <div>
      {query.data.data.map((item) => {
        return <div key={item.id}>{item.name}</div>;
      })}

      <Button onClick={() => setA((prev) => prev + 1)}>Button</Button>
      <TextField control={control} name="test" />
      <BaseTextField
        fieldError={{
          message: "this is an error",
          type: "onChange",
        }}
      />
    </div>
  );
};

export default Home;
