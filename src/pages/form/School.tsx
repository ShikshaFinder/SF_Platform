import React, { useState, useEffect } from "react";
import { useForm, Controller, set } from "react-hook-form";
import { Text, useToast } from "@chakra-ui/react";
import supabase from "../../../supabase";
import { useAuthContext } from "@/context";
import Nouser from "@/components/Nouser";
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
  Textarea,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { state } from "@/components/state";
import { BlobServiceClient } from "@azure/storage-blob";
import { ErrorMessage } from "@hookform/error-message";

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

    let img_url;
    try {
      img_url = await uploadImageToBlobStorage(Image);
      console.log("public url : ", img_url);
    } catch (error) {
      toast({
        title: "Error",
        description:
          "There is an error uploading image please wait and try again.",
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
      .from("School")
      .insert([{ ...data, user_id: user.id, img: img_url, email: user.email }]);

    if (error) {
      console.error("Error submitting Form:", error);
      toast({
        title: "Error",
        description: "Error submitting Form ! Please try again/contact us",
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
        <Stack spacing="4">
          <Card variant="outline">
            <CardBody>
              <Heading size="md" fontSize="26px">
                School Registration With Shiksha Finder.{" "}
              </Heading>
              <br />
              <FormControl isRequired>
                <FormLabel>School Name</FormLabel>
                <Input
                  {...register("schoolname", {
                    required: "Enter School Name",
                  })}
                  name="schoolname"
                  placeholder="schoolname"
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
                  placeholder="Description of your school"
                  rows={3}
                  shadow="sm"
                  focusBorderColor="brand.400"
                  {...register("discription", {
                    required: "Enter Description",
                  })}
                  fontSize={{
                    sm: "sm",
                  }}
                  defaultValue="Welcome to [School Name]

We're a community where students love to learn and grow. Our dedicated teachers create a supportive environment for everyone. From exploring exciting subjects to joining fun clubs and sports, there's something for every student.

Our goal is to help you discover your passions and reach your full potential. Let's build a bright future together!

What we are proud of at [School Name]:
[Highlight school's achievements, awards, or student successes here. For example: Our students have won multiple science fair awards, excelled in state-level competitions, and received scholarships to top universities.]

Extra Curricular Activities:
[List popular clubs, sports, or extracurricular activities. For example: Join our robotics club, drama troupe, or soccer team. We offer a variety of options to help you discover your talents.]"
                />
              </FormControl>
              <br />
              <FormControl isRequired>
                <FormLabel>Location</FormLabel>
                <Input
                  {...register("location", {
                    required: "Enter Location",
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
                  placeholder="Google map link of school <in form of https only"
                />
              </FormControl>
              <br />
              <FormControl isRequired>
                <FormLabel>State</FormLabel>
                <Select
                  {...register("State", { required: "Enter state" })}
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
                  {...register("District", { required: "Enter District" })}
                  name="District"
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
                <FormLabel> Sub-District</FormLabel>
                <Input
                  {...register("subdistrict", {
                    required: "Enter subdistrict",
                  })}
                  name="subdistrict"
                  placeholder="If its main district than just put City name here also"
                />
              </FormControl>
              <br />
              <FormControl>
                <FormLabel>Website</FormLabel>
                <Input
                  {...register("website", {
                    required: false,
                  })}
                  name="website"
                  placeholder="https://example.com/"
                />
              </FormControl>
              <br />
              <FormControl isRequired>
                <FormLabel> Mobile Number</FormLabel>
                <Input
                  {...register("mobile1", { required: "Enter Mobile Number" })}
                  name="mobile1"
                  type="number"
                  placeholder="Contact number"
                />
              </FormControl>
              <br />
              <FormControl isRequired>
                <FormLabel>Number Of Students</FormLabel>
                <Select
                  {...register("studentnumber", {
                    required: "Enter Number Of Students",
                  })}
                  name="studentnumber"
                  placeholder="Number Of Students"
                >
                  <option value="15">10-20</option>
                  <option value="25">20-30</option>
                  <option value="55">50-60</option>
                  <option value="85">80-90</option>
                  <option value="125">100-150</option>
                  <option value="250">200-500</option>
                  <option value="850">700-1000</option>
                  <option value="1500">1200-1800</option>
                  <option value="2250">2000-2500</option>
                  <option value="3000">more</option>
                </Select>

                <br />
              </FormControl>{" "}
              <br />
              <FormControl isRequired>
                <FormLabel> DISE code</FormLabel>
                <Input
                  {...register("DISE", { required: false })}
                  name="DISE"
                  type="number"
                  placeholder="DISE code"
                />
              </FormControl>{" "}
              <br />
              <FormControl isRequired>
                <FormLabel>Standard </FormLabel>
                <Controller
                  name="Standard"
                  control={control}
                  defaultValue={[]}
                  rules={{ required: "Enter standard" }}
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
              </FormControl>
              <br />
              <FormControl as="fieldset">
                <FormLabel as="legend">Board</FormLabel>
                <Controller
                  name="Board"
                  control={control}
                  defaultValue={[]}
                  rules={{ required: "Enter Board" }}
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
                <FormLabel> exam</FormLabel>
                <Input
                  {...register("exam", { required: "Enter Exam" })}
                  name="exam"
                  placeholder="JEE,NEET,etc"
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
      </>
    </>
  );
}

export default formm;
