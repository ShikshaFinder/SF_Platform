import React from "react";
import { Button, Stack, AspectRatio, Box, Toast } from "@chakra-ui/react";
import supabase from "../../supabase";
import { useRouter } from "next/router";
import { useUser } from "../../store";
import { useToast } from "@chakra-ui/react";

function form() {
  const router = useRouter();
  const useUse = useUser();
  function addInstitutionn(institute: string) {
    router.push("updateprofile/" + institute);
  }

  async function addInstitution(institute: string) {
    const typeOfInstitute = institute;

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { lastName: typeOfInstitute },
      });
    } catch (error) {
      console.log(error);
        Toast({
            title: "Error",
            description: "Error in updating the user data. Please try again.",
            status: "error",
            duration: 5000,
            isClosable: true,
            });

    }
    router.push("form/" + institute);
  }

  if (useUse.user !== null) {
    return (
      <>
        <Stack spacing={6} direction="column" align="center">
          {" "}
          <Button
            colorScheme="teal"
            size="md"
            onClick={() => addInstitutionn("school")}
          >
            Update School Informtion🏫
          </Button>{" "}
          <Button
            colorScheme="teal"
            size="md"
            onClick={() => addInstitutionn("coaching")}
          >
            Update Coaching Center Informtion🏢
          </Button>
          <Button
            colorScheme="teal"
            size="md"
            onClick={() => addInstitutionn("onlineform")}
          >
            Update Online Platform Informtion🌎
          </Button>
          <Button
            colorScheme="teal"
            size="md"
            onClick={() => addInstitutionn("skillclass")}
          >
            Update Skill Class Informtion 🎨
          </Button>
          <Button
            colorScheme="teal"
            size="md"
            onClick={() => addInstitutionn("exams")}
          >
            Update exams Informtion 📚
          </Button>
        </Stack>
        <br />
        <br />
        <Box display="flex" justifyContent="center" alignItems="center">
          <Box
            position={"relative"}
            height={"auto"}
            rounded={"2xl"}
            boxShadow={"2xl"}
            width={{ base: "full", md: "1000px", lg: "1000px", xl: "1000px" }}
            overflow={"hidden"}
            alignContent={"center"}
          >
            <AspectRatio ratio={16 / 9}>
              <iframe
                width="600"
                height="400"
                src="https://www.youtube.com/embed/-18W-tH_ATM?si=Sw3ltDu7tq0Up7FU"
                title="Shiksha Finder video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              ></iframe>
            </AspectRatio>
          </Box>
        </Box>
      </>
    );
  }

  return (
    <>
      <Stack spacing={6} direction="column" align="center">
        {" "}
        <Button
          colorScheme="teal"
          size="md"
          onClick={() => addInstitution("School")}
        >
          I Have A School 🏫
        </Button>{" "}
        <Button
          colorScheme="teal"
          size="md"
          onClick={() => addInstitution("coaching")}
        >
          I Have A Coaching Center 🏢
        </Button>
        <Button
          colorScheme="teal"
          size="md"
          onClick={() => addInstitution("onlineform")}
        >
          I Have A Online Platform 🌎
        </Button>
        <Button
          colorScheme="teal"
          size="md"
          onClick={() => addInstitution("skillclass")}
        >
          &nbsp; &nbsp; &nbsp; I Have A Skill Class 🎨&nbsp; &nbsp;
        </Button>
        <Button
          colorScheme="teal"
          size="md"
          onClick={() => addInstitution("exams")}
        >
          I specialize in Exams 📚
        </Button>
      </Stack>
      <br />
      <br />
      <Box display="flex" justifyContent="center" alignItems="center">
        <Box
          position={"relative"}
          height={"auto"}
          rounded={"2xl"}
          boxShadow={"2xl"}
          width={{ base: "full", md: "1000px", lg: "1000px", xl: "1000px" }}
          overflow={"hidden"}
          alignContent={"center"}
        >
          <AspectRatio ratio={16 / 9}>
            <iframe
              width="600"
              height="400"
              src="https://www.youtube.com/embed/-18W-tH_ATM?si=Sw3ltDu7tq0Up7FU"
              title="Shiksha Finder video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          </AspectRatio>
        </Box>
      </Box>
    </>
  );
}

export default form;
