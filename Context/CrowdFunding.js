"use client";
import React, { useState, useEffect } from "react";
import web3Modal from "web3modal";
import { ethers } from "ethers";

// INTERNAL IMPORTS
import { CrowdFundingABI, CrowdFundingAddress } from "./contants";

// FETCHING THE CROWDFUNDING MARKETPLACE

const fetchContract = (singerOrProvider) => {
  new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, singerOrProvider);
};

export const CrowdFundingContext = React.createContext();

export const CrowdFundingProvider = ({ children }) => {
  const titleData = "Crowd Funding Contract";
  const [currentAccount, setCurrentAccount] = useState("");

  const createCampaign = async (campaign) => {
    const { title, description, amount, deadline } = campaign;

    const web3Modal = new web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    console.log(currentAccount);

    try {
      const transaction = await contract.createCampaign(
        currentAccount,
        title,
        description,
        ethers.utils.parseUnits(amount, 18),
        new Date(deadline).getTime()
      );

      await transaction.wait();
      console.log("Campaign created successfully!");
    } catch (error) {
      console.log("Contact call error:", error);
    }
  };

  const getCampaigns = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);

    const campaigns = await contract.getCampaigns();

    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      pId: i,
    }));

    return parsedCampaigns;
  };

  const getUserCampaigns = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);

    const allCampaigns = await contract.getCampaigns();

    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    const currentAccount = accounts[0];

    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner === currentAccount
    );

    const userData = filteredCampaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      pId: i,
    }));

    return userData;
  };

  const donate = async (pId, amount) => {
    const web3Modal = new web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const campaignData = await contract.donateToCampaign(pId, {
      value: ethers.utils.parseEther(amount),
    });

    await campaignData.wait();
    location.reload();
    return campaignData;
  };

  const getDonations = async (pId) => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);

    const donations = await contract.getDonators(pId);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];
    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
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
