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
      .from("coaching")
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
      
        <Stack spacing="4">
          <Card variant="outline">
            <CardBody>
              <Heading size="md" fontSize="26px">
                Coaching Class Registration Shiksha Finder
              </Heading>
              <br />
              <FormControl isRequired>
                <FormLabel>Coaching Name</FormLabel>
                <Input
                  {...register("coachingname", {
                    required: "Enter Coaching Name",
                  })}
                  name="coachingname"
                  placeholder="coaching name"
                  type="text"
                />
              </FormControl>
              <br />
              <FormControl isRequired>
                <FormLabel>Description </FormLabel>
                <b>
                  {" "}
                  <small>
                    Remember to change details according to your institute
                  </small>
                </b>
                <Textarea
                  placeholder="Description of coaching class"
                  rows={3}
                  shadow="sm"
                  focusBorderColor="brand.400"
                  {...register("discription", {
                    required: "Enter Description",
                  })}
                  fontSize={{
                    sm: "sm",
                  }}
                  defaultValue="Welcome to [Coaching Institute Name]

Are you ready to achieve your academic goals? We're here to help you succeed! Our expert teachers provide top-notch guidance and support to help you excel in your studies.

We focus on [mention core subjects or exam preparation]. Our proven teaching methods and comprehensive study materials will equip you with the knowledge and skills needed to achieve your best.

Join us and experience the difference. Let's work together to make your academic dreams a reality!

Our Results Speak for Themselves:
[Highlight the coaching institute's achievements, success rates, or student testimonials. For example: Our students consistently achieve top ranks in [exam name], with many securing admissions to prestigious colleges.]"
                />
              </FormControl>
              <br />
              <FormControl isRequired>
                <FormLabel>Location</FormLabel>
                <Input
                  {...register("location", {
                    required: "Enter location",
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
                />
              </FormControl>
              <br />
              <FormControl isRequired>
                <FormLabel>State</FormLabel>
                <Select
                  {...register("State", { required: "Select State" })}
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
              <br />{" "}
              <FormControl isRequired>
                <FormLabel> Sub-District</FormLabel>
                <Input
                  {...register("subdistrict", { required: "Enter subdistrict" })}
                  name="subdistrict"
                  placeholder="If its main district than just put City name here also"
                />
              </FormControl>
              <br />
              <FormControl isRequired>
                <FormLabel> Mobile Number</FormLabel>
                <Input
                  {...register("mobile", { required: "Enter Mobile Number" })}
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
                <FormLabel>Standard/Exam </FormLabel>
                <Controller
                  name="Standard"
                  control={control}
                  defaultValue={[]}
                  rules={{ required: "Enter Standard/Exams" }}
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
                  onClick={handleSubmit(onSubmit,(err)=>{
                    const Error = Object.values(err).map((error) => error?.message).filter(Boolean);
                    toast({
                      title: "Error",
                      description: Error.join(", "),
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                    })
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
      </>
    </>
  );
}

export default CoachingForm;
