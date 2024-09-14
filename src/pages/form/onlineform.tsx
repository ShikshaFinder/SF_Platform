import React, { useState, useEffect } from "react";
import { useForm, Controller, set } from "react-hook-form";
import { Container, Text, Toast, useToast } from "@chakra-ui/react";
import supabase from "../../../supabase";
import { useAuthContext } from "@/context";
import { BeatLoader } from "react-spinners";
import Nouser from "@/components/Nouser";

interface State {
  districts: string[];
  state: string;
}
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Checkbox,
  Stack,
  HStack,
  Card,
  CardBody,
  CheckboxGroup,
  Textarea,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { state } from "@/components/state";
import { BlobServiceClient } from "@azure/storage-blob";

function formm() {
  const Router = useRouter();
  const toast = useToast();
  const { user } = useAuthContext();
  const form = useForm();
  const { register, handleSubmit, control, watch } = form;
  const [states, setStates] = useState<State[]>(state.states);
  const [Image, setImage] = useState<any>(null);
  const [show, setShow] = useState(false);

  interface FormInputs {
    singleErrorInput: string;
  }
  const {
    formState: { errors },
  } = useForm<FormInputs>();
  console.log(errors);
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

  function checkurl(url: string) {
    const prefix = "https://";
    if (url.startsWith(prefix)) {
      return url;
    } else {
      return null;
    }
  }

  async function Harsh() {
    try {
      const { error } = await supabase
        .from("votes")
        .insert([{ user_id: user.id }]);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setShow(false);
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
    setTimeout(() => {
      Router.reload();
    }, 2000);

    Router.push("/aboutcontest");
  };
  if (!user.email) {
    return <Nouser />;
  }

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
    setShow(true);
    if (data.website !== "") {
      const website = checkurl(data.website);
      if (website) {
        data.website = website;
      } else {
        toast({
          title: "Error",
          description: "Invalid Website link",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setShow(false);
        return;
      }
    } else {
      console.log("website is null");
    }

    if (data.videolink !== "") {
      const videoId = extractVideoId(data.videolink);

      if (videoId) {
        data.videolink = videoId;
      } else {
        toast({
          title: "Error",
          description:
            "Invalid YouTube video URL,please take link from youtube app",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setShow(false);
        return;
      }
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
      setShow(false);
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
      setShow(false);
      return;
    }
    const { error } = await supabase
      .from("onlineform")
      .insert([{ ...data, user_id: user.id, img: img_url, email: user.email }]);

    if (error) {
      console.error("Error submitting Form:", error);
      toast({
        title: "Error",
        description: "Error submitting Form !",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setShow(false);
    } else {
      await Harsh();
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
      <>
        <Container
          maxW="container.xl"
          py={{ base: 4, md: 8, lg: 12 }} // Adds padding based on screen size
          px={{ base: 4, md: 6, lg: 8 }}
          borderRadius="md"
          shadow="lg"
        >
          <Stack spacing="4">
            <Card variant="outline">
              <CardBody>
                <Heading size="md" fontSize="26px">
                  Online Platfrom Registration Shiksha Finder
                </Heading>
                <br />
                <FormControl isRequired>
                  <FormLabel>Online Platform Name</FormLabel>
                  <Input
                    {...register("coachingname", {
                      required: "Name is required",
                    })}
                    name="coachingname"
                    placeholder="Online Platform Name"
                    type="text"
                  />
                </FormControl>
                <br />
                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <b>
                    {" "}
                    <small>
                      Remember to change details according to your institute
                    </small>
                  </b>
                  <Textarea
                    placeholder="Description of your platform"
                    rows={3}
                    shadow="sm"
                    focusBorderColor="brand.400"
                    {...register("discription", {
                      required: "Description is required",
                    })}
                    fontSize={{
                      sm: "sm",
                    }}
                    defaultValue="Welcome to [Coaching Institute Name]
Ignite Your Potential, Online!

Are you ready to unlock your full academic potential? At [Coaching Institute Name], we're committed to helping you achieve your goals, right from the comfort of your home. Our expert instructors deliver top-tier education through engaging online classes, designed to fit your schedule.

We specialize in [mention core subjects or exam preparation]. Our proven curriculum, combined with interactive learning tools, will equip you with the knowledge and skills to excel.

Experience the future of learning with us. Let's transform your academic journey together!

Our Students, Our Success:
[Highlight your online coaching institute's achievements, such as high success rates, student testimonials, or placement records. For example: Our students consistently achieve top percentiles in [exam name], with many securing admissions to [top universities].]

[Include a strong call to action, such as 'Enroll Now' or 'Start Your Free Trial']"
                  />
                </FormControl>
                <br />
                <FormControl>
                  <FormLabel>State</FormLabel>
                  <Input
                    {...register("State", {
                      required: false,
                    })}
                    name="State"
                    placeholder="State"
                  />
                </FormControl>
                <br />
                <FormControl>
                  <FormLabel>App Name</FormLabel>
                  <Input
                    {...register("app", { required: false })}
                    name="app"
                    placeholder="App name in playstore"
                  />
                </FormControl>
                <br />
                <FormControl>
                  <FormLabel> Playstore link</FormLabel>
                  <Input
                    {...register("link", { required: false })}
                    name="link"
                    placeholder="link of playstore"
                  />
                </FormControl>
                <br />
                <FormControl isRequired>
                  <FormLabel> Mobile Number</FormLabel>
                  <Input
                    {...register("mobile", { required: "Enter Mobile Number" })}
                    name="mobile"
                    type="tel"
                    placeholder="Contact number"
                  />
                </FormControl>{" "}
                <br />
                <FormControl isRequired>
                  <FormLabel> website</FormLabel>
                  <Input
                    {...register("website", { required: "Enter Website" })}
                    name="website"
                    type="website"
                    placeholder="website"
                  />
                </FormControl>{" "}
                <br />
                <FormControl isRequired>
                  <FormLabel>Standard/Exam </FormLabel>
                  <Controller
                    name="Standard"
                    control={control}
                    defaultValue={[]}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CheckboxGroup {...field}>
                        <HStack spacing="24px" wrap="wrap">
                          <Checkbox value="Kg">Kinder Garden</Checkbox>
                          <Checkbox value="ten">1-10</Checkbox>
                          <Checkbox value="science">11-12 Science</Checkbox>
                          <Checkbox value="Commerce">11-12 Commerce</Checkbox>
                          <Checkbox value="Arts">11-12 Arts</Checkbox>
                        </HStack>
                      </CheckboxGroup>
                    )}
                  />
                  <br />
                  <Input
                    {...(register("Standard"), { required: false })}
                    name="Standard"
                    placeholder="If Teaching for any exam than mention here"
                  />
                </FormControl>
                <br />
                <FormControl>
                  <FormLabel>Board</FormLabel>
                  <Input
                    {...register("Board", { required: false })}
                    name="Board"
                    placeholder="Board / If applicable"
                  />
                </FormControl>
                <br />
                <FormControl as="fieldset">
                  <FormLabel as="legend">Medium</FormLabel>
                  <Controller
                    name="medium"
                    control={control}
                    defaultValue={[]}
                    rules={{ required: "Enter Medium" }}
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
                <FormControl isRequired>
                  <FormLabel>Upload cover Image</FormLabel>
                  <Input type="file" accept="image/*" onChange={handleImage} />
                </FormControl>{" "}
                <br />
                <FormControl>
                  <FormLabel> Introduction video Youtube video link</FormLabel>
                  <Text fontSize="xs">You can upload video later</Text>
                  <Input
                    {...register("videolink", { required: false })}
                    name="videolink"
                    placeholder="enter the youtube video link"
                  />
                </FormControl>{" "}
                <br />
                {show === false ? (
                  <Button
                    colorScheme="teal"
                    size="md"
                    onClick={handleSubmit(onSubmit, (err) => {
                      const error = Object.values(err)
                        .map((error) => error?.message)
                        .filter(Boolean);

                      toast({
                        title: "Error",
                        description: error.join(",   "),
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                      });
                    })}
                  >
                    Submit
                  </Button>
                ) : (
                  <Button
                    isLoading
                    colorScheme="blue"
                    spinner={<BeatLoader size={8} color="white" />}
                  >
                    Click me
                  </Button>
                )}{" "}
              </CardBody>
            </Card>
          </Stack>
        </Container>
      </>
    </>
  );
}

export default formm;
