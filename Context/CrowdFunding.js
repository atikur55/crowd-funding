import React, { useState, useEffect } from "react";
import web3Modal from "web3modal";
import { ethers } from "ethers";

// INTERNAL IMPORTS
import { CrowdFundingABI, CrowdFundingAddress } from "./constants";

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
};
