import {
  Box,
  VStack,
  Button,
  Flex,
  Divider,
  chakra,
  Grid,
  GridItem,
  Container,
} from "@chakra-ui/react";
import router from "next/router";
import Link from "next/link";

interface FeatureProps {
  heading: string;
  text: string;
}

const Feature = ({ heading, text }: FeatureProps) => {
  return (
    <GridItem>
      <chakra.h3 fontSize="xl" fontWeight="600">
        {heading}
      </chakra.h3>
      <chakra.p>{text}</chakra.p>
    </GridItem>
  );
};

export default function gridListWithCTA() {
  return (
    <Box as={Container} maxW="7xl" mt={14} p={4}>
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(2, 1fr)",
        }}
        gap={4}
      >
        <GridItem colSpan={1}>
          <VStack alignItems="flex-start" spacing="20px">
            <chakra.h2 fontSize="3xl" fontWeight="700">
              Promote the quality of education
            </chakra.h2>
            <Link href={"/paysf"}>
              <Button
                colorScheme="green"
                size="md"
                onClick={() => {
                  router.push(
                    " https://api.whatsapp.com/send?phone=917984140706&text=Hi%2C%20i%20am%20interested%20in%20shiksha%20finder%27s%20marketing%20services%20and%20i%20want%20to%20complete%20the%20payment"
                  );
                }}
              >
                Pay 1,999 Now & Get Special Access
              </Button>
            </Link>
          </VStack>
        </GridItem>
        <GridItem>
          <Flex>
            <chakra.p>
              By enrolling in our special access program, you will be able to
            </chakra.p>
          </Flex>
        </GridItem>
      </Grid>
      <Divider mt={12} mb={12} />
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(4, 1fr)",
        }}
        gap={{ base: "8", sm: "12", md: "16" }}
      >
        <Feature
          heading={"Show case your introduction video"}
          text={"Introduce yourself to parents and students with a video"}
        />
        <Feature
          heading={"Add Features & Services"}
          text={"Let them know what you offer and how you are different"}
        />
        <Feature
          heading={"Unlimited admission forms"}
          text={"Get access to the details of all the students who apply"}
        />
        <Feature
          heading={"Upload unlimited demo lectures"}
          text={"With shiksha finder upload the demo lectures and get more students"}
        />
      </Grid>
    </Box>
  );
}
