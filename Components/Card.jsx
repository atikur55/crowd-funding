import Image from "next/image";
import Link from "next/link";
import React from "react";
const Card = ({ allCampaigns, setOpenModal, setDonate, title }) => {
  const daysLeft = (deadline) => {
    const difference = new Date(deadline).getTime() - Date.now();
    const remainingDays = difference / (1000 * 3600 * 24);
    return remainingDays.toFixed(0);
  };

  console.log(allCampaigns);

  return (
    <div className="px-4 py-16 max-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      <p className="py-16 text-2xl font-bold leading-5">{title}</p>
      <div className="grid gap-5 lg:grid-cols-3 sm:max-w-sm sm:mx-auto lg:max-w-full">
        {allCampaigns?.map((campaign, i) => (
          <div
            onClick={() => (setDonate(campaign), setOpenModal(true))}
            key={i + 1}
            className="cursor-pointer border overflow-hidden transition-shadow duration-300 bg-white rounded"
          >
            <Image
              src="https://images.pexels.com/photos/932638/pexels-photo-932638.jpeg?auto=compress&amp;cs=tinysrgb&amp;dpr=3&amp;h=750&amp;w=1260"
              alt="image"
              width={300}
              height={200}
            />

            <div className="py-5 pl-2">
              <p className="mb-2 tex-xs font-semibold text-gray-600 uppercase">
                Days Left : {daysLeft(campaign.deadline)}
              </p>
              <Link
                href="/"
                className="inline-block mb-3 text-block transition-colors duration-200 hover:text-deep-purple-accent-700"
              >
                <p className="text-2xl font-bold leading-5">{campaign.title}</p>
              </Link>
              <div className="flex space-x-4">
                <p className="font-semibold">Target : {campaign.target}</p>
                <p className="font-semibold">
                  Raised : {campaign.amountCollected}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
