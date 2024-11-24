"use client";
import React, { useState, useEffect, useContext } from "react";

import { CrowdFundingContext } from "@/Context/CrowdFunding";
import { Hero, Card, PopUp } from "@/Components";

const Home = () => {
  const {
    titleData,
    createCampaign,
    donate,
    getDonations,
    currentAccount,
    getCampaigns,
    getUserCampaigns,
  } = useContext(CrowdFundingContext);

  const [allCampaigns, setAllCampaigns] = useState();
  const [userCampaigns, setUserCampaigns] = useState();

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const allData = await getCampaigns();
        const userData = await getUserCampaigns();

        setAllCampaigns(allData);
        setUserCampaigns(userData);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };

    fetchCampaignData();
  }, [getCampaigns, getUserCampaigns]);

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
