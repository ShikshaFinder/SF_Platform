import React, { useEffect, useState } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Button,
  Box,
  useTab,
  useMultiStyleConfig,
 
} from "@chakra-ui/react";
import { useAuthContext } from "@/context";
import Profilee from "../components/profile";
import Leaderbord from "../components/Leaderbord";
// import { useRouter } from "next/router";
import  {useUser}  from "../../store";
import Nouser from "@/components/Nouser";

function Profile() {
  // const router = useRouter();
  // const user = useAuthContext();
  const { user } = useAuthContext();
  if (!user.email) {
    return <Nouser />;
  }

    const useUse = useUser((state) => state.user);

  const CustomTab = React.forwardRef<HTMLElement, any>((props, ref) => {
    const tabProps = useTab({ ...props, ref });
    const isSelected = !!tabProps["aria-selected"];
    const styles = useMultiStyleConfig("Tabs", tabProps);


   
  

    return (
      <Button __css={styles.tab} {...tabProps}>
        <Box as="span" mr="2">
          {isSelected ? "😎" : "😐"}
        </Box>
        {tabProps.children}
      </Button>
    );
  });
  let institute;
  if (user && user.user_metadata && user.user_metadata.lastName === "School") {
    institute = "school";
  } else if (
    user &&
    user.user_metadata &&
    user.user_metadata.lastName === "coaching"
  ) {
    institute = "coaching";
  } else if (
    user &&
    user.user_metadata &&
    user.user_metadata.lastName === "onlineform"
  ) {
    institute = "onlineform";
  } else if (
    user &&
    user.user_metadata &&
    user.user_metadata.lastName === "skillclass"
  ) {
    institute = "skillclass";
  } else if (
    user &&
    user.user_metadata &&
    user.user_metadata.lastName === "exams"
  ) {
    institute = "exams";
  } else {
    console.log("error");
  }
  

  return (
    <>
      <Tabs>
        <TabList>
          <CustomTab>Profile</CustomTab>
          <CustomTab>Leaderbord</CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {" "}
            <Profilee
              name={
                useUse?.schoolname ||
                useUse?.coachingname ||
                useUse?.skillclassname ||
                useUse?.examsname ||
                "Your Name"
              }
              email={useUse?.email || "youmail@gmail.com"}
              state={useUse?.State || useUse?.website || "your state"}
              Board={useUse?.Board || useUse?.skilltype || "GSEB"}
              Medium={useUse?.medium || "English"}
              Standard={useUse?.Standard || useUse?.subdistrict || "10th"}
              city={useUse?.District || useUse?.city || "Your City"}
              studentnumber={
                useUse?.studentnumber || useUse?.mobile || useUse?.mobile1 || 0
              }
              institute={institute || "onlineplatforms"}
              userid={useUse?.user_id || "99ac208f-a72e-4221-9ea0-905e62bccd53"}
            />
          </TabPanel>
          <TabPanel>
            <Leaderbord />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

export default Profile;
