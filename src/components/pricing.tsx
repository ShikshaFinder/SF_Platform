import {
  chakra,
  VStack,
  HStack,
  Text,
  Container,
  Box,
  Icon,
  Button,
  SimpleGrid,
  useColorModeValue,
  Alert,
  AlertIcon,
  Link,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

// Here we have used react-icons package for the icons

import { BiCheck } from "react-icons/bi";
import { IoIosListBox, IoIosRocket } from "react-icons/io";
import { FaServer } from "react-icons/fa";
import { IconType } from "react-icons";

const plansList = [
  {
    title: "Basic",
    price: "499",
    icon: IoIosListBox,
    features: [
      "50 views of banner ads",
      "minimum 1 admissionForm filled by a student",
      "50 views of video ads",
      "50 views of customized ad",
      "5% discount on next plan purchase(one time)",
    ],
  },
  {
    title: "Advanced",
    price: "4999",
    icon: IoIosRocket,
    features: [
      "750 views of banner ads",
      "minimum 12 forms filled by students",
      "750 views of video ads",
      "750 views of customized ad",
      "10% discount on next plan purchase(one time)",
    ],
  },
  {
    title: "Custom Plan (Pro)",
    price: "Contact Us(plans starts from 5999)",
    icon: FaServer,
    features: [
      "Connect us for custom plan",
      "Custom new placement of ads unlocked !",
      "cost effective than other plans",
      "15% discount on next plan purchase(2 times)",
    ],
  },
];

const ThreeTiersPricing = () => {
  return (
    <Container maxW="7xl" py="8" px="0">
      <Alert status="warning">
        <AlertIcon />
        This Platform is for schools ,coaching classes and Skill classes
        only..If you want to target audience in a larger bucket than{" "}
        <Link href="   https://marketing.shikshafinder.com/" isExternal>
          &nbsp; Marketing with shiksha finder <ExternalLinkIcon mx="2px" />
        </Link>
      </Alert>
      <chakra.h2 fontSize="5xl" fontWeight="bold" textAlign="center" mb={5}>
        We guarantee results from our marketing platform 📈
      </chakra.h2>
      <a href="/terms">
        {" "}
        <Text textAlign="right" fontSize="sm" color={"blue.400"}>
          {" "}
          T&C Applies{" "}
        </Text>
      </a>
      <a href="/termsService"></a>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={1} mt={4}>
        {plansList.map((plan, index) => (
          <PricingCard key={index} {...plan} />
        ))}
      </SimpleGrid>
    </Container>
  );
};

interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  icon: IconType;
}

const PricingCard = ({ title, price, icon, features }: PricingCardProps) => {
  return (
    <>
      <Box
        minW={{ base: "xs", sm: "xs", lg: "sm" }}
        rounded="md"
        bg={useColorModeValue("white", "gray.800")}
        boxShadow="md"
        marginInline="auto"
        my={3}
        p={6}
      >
        <Box textAlign="center">
          <Icon as={icon} h={10} w={10} color="teal.500" />
          <chakra.h2 fontSize="2xl" fontWeight="bold">
            {title}
          </chakra.h2>
          <Text fontSize="7xl" fontWeight="bold">
            {price}
          </Text>
          <Text fontSize="md" color="gray.500">
            Only
          </Text>
        </Box>
        <VStack spacing={2} alignItems="flex-start" my={6}>
          {features.map((feature, index) => (
            <HStack key={index} spacing={3}>
              <Icon as={BiCheck} h={4} w={4} color="green.500" />
              <Text fontSize="md" color={useColorModeValue("black", "white")}>
                {feature}
              </Text>
            </HStack>
          ))}
        </VStack>
        <Link href="/marketingDetail">
          {" "}
          <Button
            colorScheme="teal"
            variant="solid"
            size="md"
            rounded="md"
            w="100%"
          >
            Get Started
          </Button>
        </Link>
      </Box>
    </>
  );
};

export default ThreeTiersPricing;
