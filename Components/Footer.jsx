import Link from "next/link";

import React from "react";
const Footer = () => {
  const productList = ["Market", "ERC20 Token", "Donation"];
  const usefulLinks = ["Home", "About Us", "Company Bio"];
  const contactInfo = [
    "support@cryptoexchange.com",
    "info@cryptoexchange.com",
    "Contact Us",
  ];

  return (
    <footer className="text-center text-white backgroundMain lg:text-left">
      <div className="mx-6 py-10 text-center md:text-left">
        <div className="grid-1 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h6 className="mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
              Crypto King
            </h6>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere
              tenetur dignissimos aspernatur nobis, nostrum suscipit animi
              reiciendis veritatis laboriosam consequuntur.
            </p>
          </div>

          <div>
            <h6 className="mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
              Products
            </h6>
            <ul>
              {productList.map((product, index) => (
                <li key={index} className="mb-4">
                  <Link href="/" className="text-white hover:text-gray-400">
                    {product}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h6 className="mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
              Useful Links
            </h6>
            <ul>
              {usefulLinks.map((link, index) => (
                <li key={index} className="mb-4">
                  <Link href="/" className="text-white hover:text-gray-400">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h6 className="mb-4 flex items-center justify-center font-semibold uppercase md:justify-start">
              Contact
            </h6>
            <ul>
              {contactInfo.map((link, index) => (
                <li key={index} className="mb-4">
                  {link}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
