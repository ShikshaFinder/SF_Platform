import React, { use } from "react";
import {
  HStack,
  VStack,
  Text,
  useColorModeValue,
  Flex,
  Icon,
  SimpleGrid,
  Container,
  Stack,
} from "@chakra-ui/react";
import { useAuthContext } from "@/context";
import { motion } from "framer-motion";
import supabase from "../../supabase";
import { HiOutlineMail } from "react-icons/hi";
import { AiOutlineLike, AiOutlineEye } from "react-icons/ai";
import Studentlist from "./studentlist";
import { useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useUser } from "../../store";

interface StatData {
  id: number;
  label: string;
  score: number;
  icon: any;
}

const StatsWithIcons = () => {
  const { user } = useAuthContext();
  const useUse = useUser((state) => state.user);
  const toast = useToast();
  const [userData, setUserData] = React.useState<any>([]);
  const [view, setView] = React.useState<any>([]);

  async function fetchdata() {
    if (user.user_metadata.lastName !== null) {
      if (user.user_metadata.lastName === "School") {
        const { data, error } = await supabase
          .from("viewschool")
          .select("view,demolecturesView")
          .eq("user_id", user.id)
          .single();
        setUserData(data);
      } else if (user.user_metadata.lastName === "coaching") {
        const { data, error } = await supabase
          .from("viewcoaching")
          .select("view,demolecturesView")
          .eq("user_id", user.id)
          .single();
        setUserData(data);
      } else if (user.user_metadata.lastName === "onlineform") {
        const { data, error } = await supabase
          .from("viewonline")
          .select("view,demolecturesView")
          .eq("user_id", user.id)
          .single();
        setUserData(data);
      } else if (user.user_metadata.lastName === "skillclass") {
        const { data, error } = await supabase
          .from("viewskill")
          .select("view,demolecturesView")
          .eq("user_id", user.id)
          .single();
        setUserData(data);
        console.log(data);
      } else {
        toast({
          title: "Error",
          description: "please create your profile first",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  }
  useEffect(() => {
    fetchdata();
  }, [user]);

  const fetchBannerAdView = async () => {
    if (useUse !== null) {
      const { data, error } = await supabase
        .from("banneradview")
        .select("view")
        .eq("user_id", useUse.user_id);

      // .eq("District", user?.Board)
      //percentage * rating

      setView(data);

      if (error) {
        console.error("Error fetching leaderboard data:", error);
      } else {
        console.log(data);
      }
    }
  };

  useEffect(() => {
    fetchBannerAdView();
  }, [useUse]);

  const statData: StatData[] = [
    {
      id: 1,
      label: "First page views (introduction of institute)",
      score: userData && userData.view,
      icon: AiOutlineLike,
    },
    {
      id: 2,
      label: "views in demo lectures (Number of page visits in demo lectures)",
      score: userData && userData.demolecturesView,
      icon: AiOutlineEye,
    },
    {
      id: 3,
      label: "BannerAD & Video Ad views",
      score: view && view[0]?.view,
      icon: HiOutlineMail,
    },
  ];

  return (
    <>
      <Container maxW="7xl" p={{ base: 5, md: 10 }}>
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3 }}
          spacing={5}
          mt={6}
          mb={4}
        >
          {statData.map((data, index) => (
            <Card key={index} data={data} />
          ))}
        </SimpleGrid>
      </Container>
      <Studentlist />
    </>
  );
};

const Card = ({ data }: { data: StatData }) => {
  return (
    <>
      <motion.div whileHover={{ translateY: -5 }}>
        <Stack
          direction="column"
          rounded="md"
          boxShadow={useColorModeValue(
            "0 4px 6px rgba(160, 174, 192, 0.6)",
            "2px 4px 6px rgba(9, 17, 28, 0.9)"
          )}
          w="100%"
          textAlign="left"
          align="start"
          spacing={0}
          role="group"
          overflow="hidden"
        >
          <HStack
            py={6}
            px={5}
            spacing={8}
            bg={useColorModeValue("gray.100", "gray.800")}
            w="100%"
          >
            <Flex
              justify="center"
              alignItems="center"
              rounded="lg"
              p={2}
              bg="green.400"
              position="relative"
              w={12}
              h={12}
              overflow="hidden"
              lineHeight={0}
              boxShadow="inset 0 0 1px 1px rgba(0, 0, 0, 0.015)"
            >
              <Icon as={data.icon} w={6} h={6} color="white" />
            </Flex>
            <VStack spacing={0} align="start" maxW="lg" h="100%">
              <Text as="h3" fontSize="md" noOfLines={2}>
                {data.label}
              </Text>
              <HStack spacing={2}>
                <Text as="h2" fontSize="lg" fontWeight="extrabold">
                  {data.score}
                </Text>
              </HStack>
            </VStack>
          </HStack>
        </Stack>
      </motion.div>
    </>
  );
};

export default StatsWithIcons;
