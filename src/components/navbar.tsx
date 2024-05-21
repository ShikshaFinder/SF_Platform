import Link from "next/link";
import {
  FaWpforms,
  FaCloudUploadAlt,
  FaPaintBrush,
  FaAward,
  FaBullhorn,
} from "react-icons/fa";
import ThemeButton from "@/components/ThemeButton";
import { Show } from "@chakra-ui/react";


import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { useStore } from "../../store";
import { useAuthContext } from "@/context";

export default function Navbar() {
  const isMobileNav = useBreakpointValue({ base: true, md: false });
  const { user } = useAuthContext();

  return (
    <Box>
      {" "}
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <Show breakpoint="(max-width: 480px)">
            <ThemeButton />
          </Show>
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Text
            textAlign={useBreakpointValue({ base: "center", md: "left" })}
            fontFamily={"heading"}
            color={useColorModeValue("gray.900", "white")}
            fontSize="inherit"
          >
            <Link href={"/"}>ShikshaFinder</Link>
          </Text>

          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          {user && user.email ? (
            <>
              <Button
                as={Link}
                href={"/profile"}
                passHref
                fontSize={"sm"}
                fontWeight={400}
                variant={"link"}
              >
                Profile
              </Button>

              <Show above="sm">
                <Show breakpoint="(min-width: 400px)">
                  <ThemeButton />
                </Show>
              </Show>
            </>
          ) : (
            <>
              <Button
                as={Link}
                href={"/login"}
                passHref
                fontSize={"sm"}
                fontWeight={400}
                variant={"link"}
              >
                Sign In
              </Button>
              <Button
                as={Link}
                href={"/signup"}
                passHref
                display={{ base: "none", md: "inline-flex" }}
                fontSize={"sm"}
                fontWeight={600}
                color={"white"}
                bg={"blue"}
                _hover={{
                  bg: "blue.300",
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Stack>
      </Flex>
      <Box>{isMobileNav ? <MobileNav /> : null}</Box>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Box
                as={Link}
                href={navItem.href ?? "../form"}
                passHref
                p={2}
                fontSize={"sm"}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Box>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Box
      as={Link}
      href={href}
      passHref
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("blue.50", "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "blue.400" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"blue.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Box>
  );
};

const MobileNav = () => {
  const handleClick = (iconName: string) => {
    useStore.getState().setSelectedIcon(iconName);
  };
  const boxColor = useColorModeValue("gray.100", "gray.800");
  return (
    <>
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        p={4}
        bg={boxColor}
        zIndex={10}
        borderTopWidth="1px"
        borderColor="gray"
      >
        <Flex
          direction={["row", "row"]}
          wrap="wrap"
          justify="space-around"
          align="center"
        >
          <Link href={"/form"}>
            <FaWpforms
              size={15}
              color={
                useStore.getState().selectedIcon === "form" ? "blue" : "initial"
              }
              style={{ marginInline: "auto" }}
              onClick={() => handleClick("form")}
            />
            <Text fontSize={"xs"}>create</Text>
          </Link>
          <Link href={"/uploadDemolecture"}>
            <FaCloudUploadAlt
              size={15}
              color={
                useStore.getState().selectedIcon === "upload"
                  ? "blue"
                  : "initial"
              }
              style={{ marginInline: "auto" }}
              onClick={() => handleClick("upload")}
            />
            <Text fontSize={"xs"}>upload</Text>
          </Link>
          <Link href={"/contest"}>
            <FaAward
              size={15}
              color={
                useStore.getState().selectedIcon === "contest"
                  ? "blue"
                  : "initial"
              }
              style={{ marginInline: "auto" }}
              onClick={() => handleClick("contest")}
            />
            <Text fontSize={"xs"}>contest</Text>
          </Link>
          <Link href={"/marketing"}>
            <FaBullhorn
              size={15}
              color={
                useStore.getState().selectedIcon === "marketing"
                  ? "blue"
                  : "initial"
              }
              style={{ marginInline: "auto" }}
              onClick={() => handleClick("marketing")}
            />{" "}
            <Text fontSize={"xs"}>marketing</Text>
          </Link>
          <Link href={"/analytics"}>
            <FaPaintBrush
              size={15}
              color={
                useStore.getState().selectedIcon === "analytics"
                  ? "blue"
                  : "initial"
              }
              style={{ marginInline: "auto" }}
              onClick={() => handleClick("analytics")}
            />{" "}
            <Text fontSize={"xs"}>analytics</Text>
          </Link>
        </Flex>
      </Box>
    </>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Create & Edit your platform",
    children: [
      {
        label: "Create & Edit your platform",
        subLabel: "Let the world know the quality of your education",
        href: "/form",
      },
      {
        label: "Upload demo lectures",
        subLabel: "Let the students know the quality of your Education",
        href: "/uploadDemolecture",
      },
    ],
  },
  {
    label: "Participate in contest",
    href: "/contest",
    children: [
      {
        label: "Participate in the ShikshaStar contest",
        subLabel: "And showcase the trust of your students on you 😎",
        href: "/contest",
      },
      {
        label: "About this Contest",
        subLabel: "what is this contest & how i can avail the benefits of ",
        href: "/aboutcontest",
      },
    ],
  },
  {
    label: "Analytics",
    href: "/analytics",
  },
  {
    label: "Start Marketing",
    href: "/marketing",
  },
];
