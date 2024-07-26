import React from "react";
import { AspectRatio, Card } from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  RadioGroup,
  Radio,
  HStack,
  Wrap,
  Button,
  Stack,
  Heading,
  CardBody,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAuthContext } from "@/context";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";
import supabase from "../../supabase";
import { state } from "@/components/state";

function vedAI() {
  const toast = useToast();
  const { user } = useAuthContext();

  const form = useForm();
  const router = useRouter();

  const { register, handleSubmit, control, watch } = form;
  const selectedState = watch("State");

  function handleSubmitt() {
    toast({
      title: "Form submitted!",
      description: "Thank you for your Form",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    router.push("https://shikshafinder.com/Onbording");
  }
  interface State {
    districts: string[];
    state: string;
  }



  const [states, setStates] = useState<State[]>(state.states);
  const districts =
    states.find((state) => state.state === selectedState)?.districts || [];
  const onSubmit = async (data: any) => {
    const { error } = await supabase
      .from("vedAI")
      .insert([{ ...data}]);

    if (error) {
      console.error("Error submitting Form:", error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      handleSubmitt();
    }
  };
  return (
    <>
      <AspectRatio maxW="560px" ratio={1.75}>
        <iframe
          title="hihello"
          src={`https://www.youtube.com/embed/-18W-tH_ATM?autoplay=1`}
          allowFullScreen
        />
      </AspectRatio>

      <Stack spacing="4">
        <Card variant="outline">
          <CardBody>
            <Heading size="md" fontSize="26px">
              Participation form for vedAI X ShikshaFinder
            </Heading>
            <br />
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                {...register("name", {
                  required: true,
                })}
                name="name"
                placeholder="Your Name"
              />
            </FormControl>{" "}
            <br />
            <FormControl isRequired>
              <FormLabel>Mobile Number</FormLabel>
              <Input
                {...register("mobile", {
                  required: true,
                })}
                name="mobile"
                placeholder="7984140706"
              />
            </FormControl>{" "}
            <br />
            <br />
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                {...register("email", {
                  required: true,
                })}
                name="email"
                placeholder="johndoe@gmail.com"
              />
            </FormControl>{" "}
            <br />
            <FormControl isRequired>
              <FormLabel>State</FormLabel>
              <Select
                {...register("State", { required: true })}
                name="State"
                placeholder="Select State"
              >
                {states.map((stateObj) => (
                  <option key={stateObj.state} value={stateObj.state}>
                    {stateObj.state}
                  </option>
                ))}
              </Select>
            </FormControl>
            <br />
            <FormControl isRequired>
              <FormLabel>District/city</FormLabel>
              <Select
                {...register("city", { required: true })}
                name="city"
                placeholder="Select District"
              >
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </Select>
            </FormControl>{" "}
            <br />
            <FormControl isRequired>
              <FormLabel>Standard category </FormLabel>
              <Select
                {...register("standardcategory", { required: true })}
                name="standardcategory"
                placeholder="standardcategory"
              >
                <option value="Nursery">Kinder Garden</option>
                <option value="1">1-10</option>
                <option value="2">11-12 Science</option>
                <option value="3">11-12 Commerce</option>
                <option value="4">11-12 Arts</option>
              </Select>
            </FormControl>
            <br />
            <Button
              colorScheme="teal"
              size="md"
              onClick={handleSubmit(onSubmit)}
            >
              Submit
            </Button>
          </CardBody>
        </Card>
      </Stack>
    </>
  );
}

export default vedAI;
