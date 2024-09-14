import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import supabase from "../../../supabase";
import { useAuthContext } from "@/context";
import { BeatLoader } from "react-spinners";

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
  Select,
  useToast,
  Textarea,
  Text,
  Container,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { state } from "@/components/state";
import { BlobServiceClient } from "@azure/storage-blob";
import Nouser from "@/components/Nouser";

function CoachingForm() {
  const Router = useRouter();
  const toast = useToast();
  const { user } = useAuthContext();
  const form = useForm();
  const { register, handleSubmit, control, watch } = form;
  const [states, setStates] = useState<State[]>(state.states);
  const [Image, setImage] = useState<any>(null);
  const [show, setShow] = useState(false);

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
    if (data.locationlink !== "") {
      const location = checkurl(data.locationlink);
      if (location) {
        data.locationlink = location;
      } else {
        toast({
          title: "Error",
          description: "Invalid Google map link",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setShow(false);
        return;
      }
    } else {
      console.log("locationlink is null");
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
      console.log("no image found");
      toast({
        title: "Error",
        description: "No image found",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setShow(false);
      return;
    }
    const { error } = await supabase
      .from("exams")
      .insert([{ ...data, user_id: user.id, img: img_url, email: user.email }]);

    if (error) {
      console.error("Error submitting Form:", error);
      toast({
        title: "Error",
        description: "Error submitting Form",
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
                  Competitive Exams Registration Form Shiksha Finder
                </Heading>
                <br />
                <FormControl isRequired>
                  <FormLabel>Name Of Your Classes</FormLabel>
                  <Input
                    {...register("examsname", {
                      required: true,
                    })}
                    name="examsname"
                    placeholder="ABC Classes"
                    type="text"
                  />
                </FormControl>
                <br />
                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    placeholder="We have this Facility and we are best in this"
                    rows={3}
                    shadow="sm"
                    focusBorderColor="brand.400"
                    {...register("discription", {
                      required: true,
                    })}
                    fontSize={{
                      sm: "sm",
                    }}
                    defaultValue="Welcome to [Coaching Institute Name]

Crack the [Exam Name] with Us!

Are you determined to ace the [Exam Name]? Look no further! [Coaching Institute Name] is your ultimate companion on this challenging journey. Our expert faculty, combined with a result-oriented curriculum, will equip you with the knowledge and strategies to conquer the [Exam Name].

Benefit from our comprehensive online classes, interactive study materials, and mock tests designed to simulate exam conditions. Our personalized guidance will help you identify your strengths and weaknesses, ensuring targeted preparation.

Join our community of high-achievers and get the support you need to succeed. Let's make your dream of cracking the [Exam Name] a reality!

Our Track Record:
[Highlight your coaching institute's success in the [Exam Name], such as the number of selections, top ranks achieved, or student testimonials.]

[Include a strong call to action, such as 'Enroll Now' or 'Start Your Free Trial']"
                  />
                </FormControl>
                <br />
                <FormControl isRequired>
                  <FormLabel>Location</FormLabel>
                  <Input
                    {...register("location", {
                      required: true,
                    })}
                    name="location"
                    placeholder="Exact address of institute"
                  />
                  <br />
                  <Input
                    {...register("locationlink", {
                      required: false,
                    })}
                    name="locationlink"
                    placeholder="Google map link of coaching class"
                    defaultValue={""}
                  />
                </FormControl>
                <br />
                <FormControl isRequired>
                  <FormLabel>State</FormLabel>
                  <Select
                    {...register("State", { required: true })}
                    name="State"
                    placeholder="Select State"
                    // defaultValue={"Gujarat"}
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
                    // defaultValue={"Bhavnagar}
                  >
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </Select>
                </FormControl>{" "}
                <br />{" "}
                <FormControl isRequired>
                  <FormLabel> Sub-District</FormLabel>
                  <Input
                    {...register("subdistrict", { required: true })}
                    name="subdistrict"
                    placeholder="If its main district than just put City name here also"
                  />
                </FormControl>
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
                <FormControl>
                  <FormLabel> website</FormLabel>
                  <Input
                    {...register("website", { required: false })}
                    name="website"
                    type="website"
                    placeholder="website"
                  />
                </FormControl>{" "}
                <br />
                <FormControl isRequired>
                  <FormLabel>
                    <b>Exam</b>{" "}
                  </FormLabel>
                  <b>Undergraduate Level</b>
                  <Controller
                    name="Standard"
                    control={control}
                    defaultValue={[]}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CheckboxGroup {...field}>
                        <HStack spacing="24px" wrap="wrap">
                          <Checkbox value="NTSE">NTSE</Checkbox>
                          <Checkbox value="KVPY">KVPY</Checkbox>
                          <Checkbox value="Olympiads">Olympiads</Checkbox>
                          <Checkbox value="JEE">JEE/NEET</Checkbox>
                          <Checkbox value="NDA">NDA</Checkbox>
                          <Checkbox value="NIFT">NIFT Entrance Exam</Checkbox>
                          <Checkbox value="NID">
                            NID Entrance Exam: For design
                          </Checkbox>
                          <Checkbox value="BITSAT">
                            BITSAT: Birla Institute of Technology and Science
                            Admission Test
                          </Checkbox>
                        </HStack>
                      </CheckboxGroup>
                    )}
                  />
                  <br />
                  <b>Graduate Level</b>
                  <Controller
                    name="Standard"
                    control={control}
                    defaultValue={[]}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <CheckboxGroup {...field}>
                        <HStack spacing="24px" wrap="wrap">
                          <Checkbox value="GATE">GATE</Checkbox>
                          <Checkbox value="CAT">CAT</Checkbox>
                          <Checkbox value="XAT">XAT</Checkbox>
                          <Checkbox value="MAT">JEE/NEET</Checkbox>
                          <Checkbox value="AIIMS PG">AIIMS PG</Checkbox>
                        </HStack>
                      </CheckboxGroup>
                    )}
                  />
                  <br />
                  <b>Post Graduate Level</b>
                  <Controller
                    name="Standard"
                    control={control}
                    defaultValue={[]}
                    rules={{ required: "Enter Exams" }}
                    render={({ field }) => (
                      <CheckboxGroup {...field}>
                        <HStack spacing="24px" wrap="wrap">
                          <Checkbox value="UPSC">UPSC</Checkbox>
                          <Checkbox value="SSC">SSC CGL</Checkbox>
                          <Checkbox value="IBPS">IBPS PO/Clerk</Checkbox>
                          <Checkbox value="SBI">SBI PO/Clerk</Checkbox>
                          <Checkbox value="RRB">RRB NTPC</Checkbox>
                          <Checkbox value="CSIR">CSIR NET</Checkbox>
                          <Checkbox value="UGC">UGC NET</Checkbox>
                          <Checkbox value="CA">CA</Checkbox>
                        </HStack>
                      </CheckboxGroup>
                    )}
                  />
                </FormControl>
                <hr />
                <br />
                <FormControl as="fieldset">
                  <FormLabel as="legend">Board</FormLabel>
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
                          <Checkbox value="State">State Board</Checkbox>
                          <Checkbox value="IB">IB</Checkbox>
                          <Checkbox value="AISSCE">AISSCE</Checkbox>
                          <Checkbox value="NIOS">NIOS</Checkbox>
                        </HStack>
                      </CheckboxGroup>
                    )}
                  />
                </FormControl>
                <br />
                <FormControl as="fieldset">
                  <FormLabel as="legend">Medium</FormLabel>
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
                    onClick={handleSubmit(onSubmit)}
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

export default CoachingForm;
