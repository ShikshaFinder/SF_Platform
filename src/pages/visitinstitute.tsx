import React from "react";
import { Stack, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useUser } from "../../store";

function visitinstitute() {
  const router = useRouter();
  const useUse = useUser((state) => state.user);

  const addInstitution = (type: string) => {
    if (useUse) {
     router.push(` https://shikshafinder.com/${type}/${useUse.user_id}`);
    } else {    
        router.push(`/`);
    }
  };
  return (
    <Stack spacing={6} direction="column" align="center">
      {" "}
      <Button
        colorScheme="teal"
        size="md"
        onClick={() => addInstitution("school")}
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
        onClick={() => addInstitution("onlineplatforms")}
      >
        I Have A Online Platform 🌎
      </Button>
      <Button
        colorScheme="teal"
        size="md"
        onClick={() => addInstitution("skillclass")}
      >
        I Have A Skill Class 🎨
      </Button>
    </Stack>
  );
}

export default visitinstitute;
