"use client";
import React, { useState, useEffect, useContext } from "react";

import { CrowdFundingContext } from "@/Context/CrowdFunding";
import { Hero, Card, PopUp } from "@/Components";

const Home = () => {
  const { titleData, createCampaign, donate, getDonations, currentAccount } =
    useContext(CrowdFundingContext);

  const [allCampaigns, setAllCampaings] = useState();
  const [userCampaigns, setUserCampaigns] = useState();

  useEffect(() => {
    // const getCampaignsData = getCampaigns();
    // const getUserCampaignsData = getUserCampaigns();
    // return async () => {
    //   const allData = await getCampaignsData;
    //   const userData = await getUserCampaignsData;
    //   setAllCampaings(allData);
    //   setUserCampaigns(userData);
    // };
  }, []);

  const [openModal, setOpenModal] = useState(false);
  const [donateCampaign, setDonateCampaign] = useState();

  return (
    <>
      <Hero title={titleData} createCampaign={createCampaign} />
      <Card
        title="All Listed Campaign"
        allCampaigns={allCampaigns}
        setOpenModal={setOpenModal}
        setDonate={setDonateCampaign}
      />
      <Card
        title="Your Created Campaign"
        allCampaigns={userCampaigns}
        setOpenModal={setOpenModal}
        setDonate={setDonateCampaign}
      />

      {openModal && (
        <PopUp
          setOpenModal={setOpenModal}
          getDonations={getDonations}
          donate={donateCampaign}
          donateFunction={donate}
        />
      )}
    </>
  );
};

export default Home;
