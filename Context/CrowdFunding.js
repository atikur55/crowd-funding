"use client";
import React, { useState, useEffect } from "react";
import { ethers, parseEther, formatEther } from "ethers";
import Web3Modal from "web3modal";

// INTERNAL IMPORTS
import { CrowdFundingABI, CrowdFundingAddress } from "./contants";

// FETCHING THE CROWDFUNDING MARKETPLACE

const fetchContract = (singerOrProvider) => {
  return new ethers.Contract(
    CrowdFundingAddress,
    CrowdFundingABI,
    singerOrProvider
  );
};

export const CrowdFundingContext = React.createContext();

export const CrowdFundingProvider = ({ children }) => {
  const titleData = "Crowd Funding Contract";
  const [currentAccount, setCurrentAccount] = useState("");

  const createCampaign = async (campaign) => {
    const { title, description, amount, deadline } = campaign;
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = fetchContract(signer);

    try {
      const transaction = await contract.createCampaign(
        currentAccount,
        title,
        description,
        parseEther(amount, 18),
        new Date(deadline).getTime()
      );

      await transaction.wait();
      console.log("Campaign created successfully!");
    } catch (error) {
      console.log("Contact call error:", error);
    }
  };

  const getCampaigns = async () => {
    const provider = new ethers.JsonRpcProvider(
      "https://polygon-amoy.g.alchemy.com/v2/tRPpvon7YNh4r1vYiVA0AbOmAMZ2x28g"
    );
    const contract = fetchContract(provider);
    const campaigns = await contract.getCampaigns();
    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber
        ? campaign.deadline.toNumber()
        : Number(campaign.deadline),
      amountCollected: formatEther(campaign.amountCollected.toString()),
      pId: i,
    }));
    console.log(parsedCampaigns);

    return parsedCampaigns;
  };

  const getUserCampaigns = async () => {
    const provider = new ethers.JsonRpcProvider(
      "https://polygon-amoy.g.alchemy.com/v2/tRPpvon7YNh4r1vYiVA0AbOmAMZ2x28g"
    );

    const contract = fetchContract(provider);
    const allCampaigns = await contract.getCampaigns();
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    const currentAccount = accounts[0];
    console.log(currentAccount);

    const filteredCampaigns = allCampaigns.filter(
      (campaign) =>
        campaign.owner.toLowerCase() === currentAccount.toLowerCase()
    );

    const userData = filteredCampaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber
        ? campaign.deadline.toNumber()
        : Number(campaign.deadline),
      amountCollected: formatEther(campaign.amountCollected.toString()),
      pId: i,
    }));

    return userData;
  };

  const donate = async (pId, amount) => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    // const provider = new ethers.providers.Web3Provider(connection);
    // const signer = provider.getSigner();

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = fetchContract(signer);

    const campaignData = await contract.donateToCampaign(pId, {
      value: parseEther(amount),
    });

    await campaignData.wait();
    location.reload();
    return campaignData;
  };

  const getDonations = async (pId) => {
    const provider = new ethers.JsonRpcProvider(
      "https://rpc-amoy.polygon.technology"
    );
    const contract = fetchContract(provider);

    const donations = await contract.getDonators(pId);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];
    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  // ---CHECK IF WALLET IS CONNECTED---

  const checkIfWalletConnected = async () => {
    try {
      if (!window) {
        return setOpenError(true), setError("Install Metamask");
      }
      const account = await window.ethereum.request({
        method: "eth_accounts",
      });

      if (account.length) {
        setCurrentAccount(account[0]);
      } else {
        console.log("No account found");
      }
    } catch (error) {
      console.log("something went wrong");
    }
  };

  useEffect(() => {
    checkIfWalletConnected;
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        console.log("Install Metamask");
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("Error while connecting to wallet");
    }
  };
  return (
    <CrowdFundingContext.Provider
      value={{
        titleData,
        currentAccount,
        connectWallet,
        createCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </CrowdFundingContext.Provider>
  );
};
