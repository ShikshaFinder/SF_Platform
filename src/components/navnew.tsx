import React from "react";
import Link from "next/link";
import { Button } from "@chakra-ui/react";

function Navnew() {
  return (
    <Link href="/form">
      <Button
        rounded={"full"}
        size={"lg"}
        fontWeight={"normal"}
        px={6}
        colorScheme={"blue"}
        _hover={{ bg: "blue.500" }}
      >
        Let's explore
      </Button>
    </Link>
  );
}

export default Navnew;
