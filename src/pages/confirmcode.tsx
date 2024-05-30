import * as React from "react";
import {
  Container,
  chakra,
  Stack,
  Text,
  Button,
  Box,
  Input,
} from "@chakra-ui/react";
// Here we have used react-icons package for the icons
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";

const HeroSection = () => {
  const router = useRouter(); // Initialize the router
  const [Code, setCode] = React.useState("");
    const Toast = useToast();
  function Check() {
    if (
      Code === "FederationGujarat2024" ||
      Code === "AssociationBhavnagar2024"
    ) {
      router.push("/formm");
        Toast({
          title: "success",
          description: "Welcome to the Shiksha Finder's special guest programme 🚀",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
    } else {

      Toast({
        title: "Error",
        description: "Please enter the correct code",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.log("Please enter the correct code");
    }
  }

  return (
    <Container p={{ base: 8, sm: 14 }}>
      <Stack direction="column" spacing={6} alignItems="center">
        <Box
          py={2}
          px={3}
          bg="teal"
          w="max-content"
          color="white"
          rounded="md"
          fontSize="sm"
        >
          <Stack alignItems={"center"}>
            <Text fontWeight="bold">
              Welcome to Shiksha Finder Special Access program 🚀
            </Text>
            
            <Text>Let's promote the quality of education</Text>
          </Stack>
        </Box>
        <chakra.h1
          fontSize={{ base: "4xl", sm: "5xl" }}
          fontWeight="bold"
          textAlign="center"
          maxW="600px"
        >
          Shiksha Finder Special Code
        </chakra.h1>

        <Stack
          direction={{ base: "column", sm: "row" }}
          w={{ base: "100%", sm: "auto" }}
          spacing={5}
        >
          <Input
            onChange={(e) => setCode(e.target.value)}
            placeholder="Please Enter the code"
            size="lg"
          />

          <Button
            colorScheme="teal"
            variant="outline"
            rounded="md"
            size="lg"
            height="3.5rem"
            fontSize="1.2rem"
            onClick={Check}
          >
            Verify Code
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default HeroSection;
