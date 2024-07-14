import React from "react";
import {
  Card,
  Stack,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Box,
  AspectRatio,
  Button,
} from "@chakra-ui/react";
import { useUser } from "../../../store";
import { useRouter } from "next/router";
import Copybutton from "../../components/Copybutton";
import Whatsapp from "../../components/whatsapp";

import Contestinfo from "../../components/contesti";

function contest() {
  const useUse = useUser((state) => state.user);
  console.log("useUse", useUse);
  const router = useRouter();

  return (
    <>
      <Text fontSize={{ base: "3xl", md: "4xl", lg: "4xl", xl: "4xl" }}>
        {" "}
        Do you want to win prize worth thousands ?{" "}
      </Text>
      <Box m={7}>
        <Box
          position={"relative"}
          height={"auto"}
          rounded={"2xl"}
          boxShadow={"2xl"}
          width={{ base: "full", md: "750px", lg: "750px", xl: "750px" }}
          overflow={"hidden"}
          alignContent={"center"}
          justifyContent={"center"}
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

        <Stack>
          {/* calll to action */}
          <Heading size="md"> &nbsp; Than you are on a Gold Mine !</Heading>
          <Stack direction={"row"}>
            {" "}
            {useUse && useUse.user_id ? (
              <Copybutton schoolName={useUse.user_id} />
            ) : (
              <>
                <Button
                  colorScheme="teal"
                  onClick={() => {
                    router.push("/form");
                  }}
                >
                  Register platform
                </Button>
              </>
            )}
            &nbsp; &nbsp;
            {useUse && useUse.user_id ? (
              <Whatsapp schoolName={useUse.user_id} />
            ) : (
              <>
                {" "}
                <Button
                  onClick={() => {
                    router.push("/aboutcontest");
                  }}
                >
                  Know more
                </Button>{" "}
              </>
            )}
          </Stack>{" "}
          {/* </CardFooter> */}
          {/* <CardBody> */}
          <Text py="3" as="b">
            Share this link to your students and get chance to win prizes worth
            thousands !
            <br />
            <b>Participate in the contest and show the strength you have 💪 </b>
          </Text>
          <br />
          <br />
          <br />
          <Text py="3" size={"3xl"} as="b">
            Get assured prices by participating 🚀
          </Text>
          {/* </CardBody> */}
        </Stack>

        <Contestinfo />
      </Box>
    </>
  );
}

export default contest;
