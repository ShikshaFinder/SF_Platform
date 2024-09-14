import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@chakra-ui/react";
import supabase from "../../../supabase";
import { useAuthContext } from "@/context";
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
  Textarea,
  Stack,
  Card,
  CardBody,
  Select,
  Text,
  Container
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { state } from "@/components/state";
import { BeatLoader } from "react-spinners";
import { BlobServiceClient } from "@azure/storage-blob";

function formm() {
  const Router = useRouter();
  const toast = useToast();
  const { user } = useAuthContext();
  const form = useForm();
  const { register, handleSubmit, watch } = form;
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
      .from("skillclass")
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
    console.log(file);
    // console.log(Image);
  };

  return (
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
                skillclass Registration With Shiksha Finder.{" "}
              </Heading>
              <br />
              <FormControl isRequired>
                <FormLabel>Type Of Skill</FormLabel>
                <Select
                  {...register("skilltype", { required: "Skill Type is required" })}
                  name="skilltype"
                  placeholder="SKill Type"
                >
                  <option value="art">Art & Crafts</option>
                  <option value="Business">Business</option>
                  <option value="coding">coding</option>
                  <option value="dance">Dance</option>
                  <option value="designing">Designing</option>
                  <option value="self-defence">self-deffence</option>
                  <option value="singing">singing</option>
                  <option value="sports">sports</option>
                  <option value="photography">Photography</option>
                  <option value="other">Other</option>
                </Select>
              </FormControl>
              <br />
              <FormControl isRequired>
                <FormLabel>Skillclass Name</FormLabel>
                <Input
                  {...register("skillclassname", {
                    required: "Skillclass Name is required",
                  })}
                  name="skillclassname"
                  placeholder="SkillClass Name"
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
                <br />
                <Textarea
                  placeholder="Description of your skillclass"
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

Master Your [Skill Type] Today!

Looking to enhance your [skill type] skills? You've come to the right place! At [Coaching Institute Name], we offer expert online training to help you master [skill type] and take your abilities to the next level.

Our experienced instructors provide comprehensive lessons, interactive exercises, and personalized guidance. Whether you're a beginner or looking to refine your skills, our courses are designed to meet your needs.

Join our vibrant online community and connect with fellow learners. Together, we'll unlock your full potential in [skill type]!

See the Transformation:
[Highlight the impact of your coaching institute on students' skills. For example: Our students have landed high-paying jobs, started successful businesses, or created groundbreaking projects in [skill type].]

[Include a strong call to action, such as 'Enroll Now' or 'Start Your Free Trial']"
                />
              </FormControl>
              <br />
              <FormControl isRequired>
                <FormLabel>Location</FormLabel>
                <Input
                  {...register("location", {
                    required: "Location is required",
                  })}
                  name="location"
                  placeholder="Exact address of institute"
                />
              </FormControl>
              <br />
              <FormControl isRequired>
                <Input
                  {...register("locationlink", {
                    required: false,
                  })}
                  name="locationlink"
                  placeholder="Google map link of skillclass"
                />
              </FormControl>
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
                  {...register("city", { required: "District is required" })}
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
                <FormLabel> Sub-District</FormLabel>
                <Input
                  {...register("subdistrict", { required: "subdistrict is required" })}
                  name="subdistrict"
                  placeholder="If its main district than just put City name here also"
                />
              </FormControl>
              <br />
              <FormControl isRequired>
                <FormLabel> Mobile Number</FormLabel>
                <Input
                  {...register("mobile", { required: "Mobile Number is required" })}
                  name="mobile"
                  type="number"
                  placeholder="Contact number"
                />
              </FormControl>{" "}
              <br />
              <FormControl>
                <FormLabel>Website</FormLabel>
                <Input
                  {...register("website", { required: false })}
                  name="website"
                  placeholder="Website link"
                />{" "}
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
                      duration: 4000,
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
        </Container>
      </>
  );
}

export default formm;
