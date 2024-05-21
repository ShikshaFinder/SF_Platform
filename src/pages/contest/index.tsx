import React from "react";
import {
  Card,
  Stack,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Image,
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
      <Text as="mark"> Do you have satisfied Students ?</Text>
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
      >
        <Image
          objectFit="cover"
          maxW={{ base: "100%", sm: "40%" }}
          height="50vh"
          src="https://images.unsplash.com/photo-1516463859456-ce782449bfe0?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Caffe Latte"
        />

        <Stack>
          {/* calll to action */}
          <Heading size="md"> &nbsp; Than you are on a Gold Mine !</Heading>
          <CardFooter>
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
          </CardFooter>
          <CardBody>
            <Text py="3" as="b">
              Share this link to your students and get chance to win prizes
              worth thousands !
              <br />
              <b>
                Participate in the contest and show the strength you have 💪{" "}
              </b>
            </Text><br /><br /><br />
            <Text py="3" size={"3xl"} as="b">
              Get assured prices by participating{" "}🚀
            </Text>
          </CardBody>
        </Stack>
      </Card>

      <Contestinfo />
    </>
  );
}

export default contest;
