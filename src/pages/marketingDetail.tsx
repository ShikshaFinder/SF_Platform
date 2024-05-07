import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import supabase from "../../supabase";
import Nouser from "@/components/Nouser";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Stack,
  Card,
  CardBody,
  Select,
  useToast,
} from "@chakra-ui/react";
import { state } from "@/components/state";
import { useRouter } from "next/router";
import { useAuthContext } from "@/context";
interface State {
  districts: string[];
  state: string;
}
import { Checkbox, CheckboxGroup, HStack, Input } from "@chakra-ui/react";
import { BlobServiceClient } from "@azure/storage-blob";

//we can have index of news paper and we can have the price of the news paper and we can have the price of the news paper in diffrent states and diffrent districts
//this is the page where we will take the information regarding the target audience of the user
//the objective of making this page is that we want to price them according to district and
//state and here we will take information regarding the target audience ,i.e the students they are targeting,state ,district and standard wise.
//but the problem is it is going to be a lot more variable in the first case so we have to make sure we can do it correctly
//if we want to distribute price according to category and district than there is a lot more calculation which will happen ,we can initially do it in manual way but then it will need some kind of automation
//we can price them in diffrent plan in diffrent way,i.e we will sayv in 499 plan per view you will be charged x amount of money,if you want to go for 999 plan than you will be charged y amount of money

function marketingDetail() {
  const Router = useRouter();
  const toast = useToast();
  const { user } = useAuthContext();
  const form = useForm();
  const { register, handleSubmit, control, watch } = form;
  const [states, setStates] = useState<State[]>(state.states);
  const [Image, setImage] = useState<any>(null);

  if (!user.email) {
    return <Nouser />;
  }

  function extractVideoId(url: string) {
    const prefix = "https://youtu.be/";
    if (url.startsWith(prefix)) {
      const idAndParams = url.slice(prefix.length);
      const [videoId] = idAndParams.split("?");
      return videoId;
    } else {
      return null;
    }
  }

  const handleSubmitt = () => {
    toast({
      title: "Form submitted!",
      description: "Thank you for your Form",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    Router.push("/paynow");
  };

  const uploadImageToBlobStorage = async (file: any) => {
    const accountName = process.env.NEXT_PUBLIC_AZURE_ACCOUNT_NAME;
    const sasUrl = process.env.NEXT_PUBLIC_AZURE_STORAGE_SAS_URL || "";

    const blobServiceClient = BlobServiceClient.fromConnectionString(sasUrl);

    console.log(file);
    const containerName = process.env.NEXT_PUBLIC_AZURE_CONTAINER_NAME || "";
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobName = Date.now() + "_" + file.name;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const uploadBlobResponse = await blockBlobClient.upload(file, file.size);

    const public_url = `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}`;
    return public_url;
  };

  const onSubmit = async (data: any) => {
    const videoId = extractVideoId(data.videolink);
    if (videoId) {
      data.videolink = videoId;
    } else {
      toast({
        title: "Error",
        description: "Invalid YouTube video URL",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    let img_url;
    try {
      img_url = await uploadImageToBlobStorage(Image);
      console.log("public url : ", img_url);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!img_url) {
      toast({
        title: "Error",
        description: "Image not uploaded",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const { error } = await supabase
      .from("marketingDetails")
      .insert([{ ...data, user_id: user.id, img: img_url }]);

    if (error) {
      console.error("Error submitting Form:", error);
      toast({
        title: "Error",
        description:
          "You can submit one banner ad at a time,if you want to submit more contact us",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      handleSubmitt();
    }
  };

  const selectedState = watch("State");

  const districts =
    states.find((state) => state.state === selectedState)?.districts || [];

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    setImage(file);
    console.log(file);
    // console.log(Image);
  };

  return (
    <>
      <Stack spacing="4">
        <Card variant="outline">
          <CardBody>
            <Heading size="md" fontSize="26px">
              Let's promote the quality of education 🚀
            </Heading>
            <br />
            <FormControl isRequired>
              <FormLabel>State</FormLabel>
              <Select
                {...register("State", { required: true })}
                name="State"
                placeholder="Select state of your target audience"
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
                {...register("District", { required: true })}
                name="District"
                placeholder="Select District of your target audience"
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
              <FormLabel> Mobile Number</FormLabel>
              <Input
                {...register("mobile", { required: true })}
                name="mobile"
                type="number"
                placeholder="Contact number"
              />
            </FormControl>{" "}
            <br />
            <FormControl isRequired>
              <FormLabel>Standard You want to target </FormLabel>
              <Select
                {...register("Standard", { required: true })}
                name="Standard"
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
            <br />
            <FormControl as="fieldset">
              <FormLabel as="legend">
                Board in which your target audience studies
              </FormLabel>
              <Controller
                name="Board"
                control={control}
                defaultValue={[]}
                rules={{ required: true }}
                render={({ field }) => (
                  <CheckboxGroup {...field}>
                    <HStack spacing="24px" wrap="wrap">
                      {" "}
                      <Checkbox value="CBSE">CBSE</Checkbox>
                      <Checkbox value="ICSE">ICSE</Checkbox>
                      <Checkbox value="IB">IB</Checkbox>
                      <Checkbox value="AISSCE">AISSCE</Checkbox>
                      <Checkbox value="NIOS">NIOS</Checkbox>
                      <Checkbox value="State">State Board</Checkbox>
                    </HStack>
                  </CheckboxGroup>
                )}
              />
            </FormControl>
            <br />
            <FormControl isRequired>
              <FormLabel> examinations your target audience see</FormLabel>
              <Input
                {...register("exam", { required: false })}
                name="exam"
                placeholder="JEE,NEET,etc"
              />
            </FormControl>
            <br />
            <FormControl isRequired>
              <FormLabel> The site where you want them to redirect</FormLabel>
              <Input
                {...register("redirecturl", { required: true })}
                name="redirecturl"
                placeholder="https:///Your youtube channel URL/Your app URL"
              />
            </FormControl>
            <br />
            <FormControl as="fieldset">
              <FormLabel as="legend">Medium you want to target</FormLabel>
              <Controller
                name="medium"
                control={control}
                defaultValue={[]}
                rules={{ required: true }}
                render={({ field }) => (
                  <CheckboxGroup {...field}>
                    <HStack spacing="24px">
                      <Checkbox value="Hindi">Hindi Medium</Checkbox>
                      <Checkbox value="English">English Medium</Checkbox>
                      <Checkbox value="Native">Native</Checkbox>
                    </HStack>
                  </CheckboxGroup>
                )}
              />
            </FormControl>
            <br />
            <br />
            <FormControl isRequired>
              <FormLabel>Upload cover Image</FormLabel>
              <Input type="file" accept="image/*" onChange={handleImage} />
            </FormControl>{" "}
            <br />
            <FormControl isRequired>
              <FormLabel> Introduction Video Youtube video link</FormLabel>
              <Input
                {...register("videolink", { required: true })}
                name="videolink"
                placeholder="enter the youtube video link"
              />
            </FormControl>{" "}
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

export default marketingDetail;
