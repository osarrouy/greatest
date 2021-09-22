const hre = require("hardhat");
const ethers = hre.ethers;
const opensea = require("opensea-js");
const OpenSeaPort = opensea.OpenSeaPort;
const Network = opensea.Network;
const { Eip1193Bridge } = require("@ethersproject/experimental");

const MNEMONIC = process.env.MNEMONIC;
const NODE_API_KEY = process.env.INFURA_KEY || process.env.ALCHEMY_KEY;
const isInfura = !!process.env.INFURA_KEY;
const FACTORY_CONTRACT_ADDRESS = process.env.FACTORY_CONTRACT_ADDRESS;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const NETWORK = process.env.NETWORK;
const API_KEY = process.env.API_KEY || ""; // API key is optional but useful if you're doing a high volume of requests.

const DUTCH_AUCTION_OPTION_ID = "1";
const DUTCH_AUCTION_START_AMOUNT = 100;
const DUTCH_AUCTION_END_AMOUNT = 50;
const NUM_DUTCH_AUCTIONS = 3;

const FIXED_PRICE_OPTION_ID = "2";
const NUM_FIXED_PRICE_AUCTIONS = 10;
const FIXED_PRICE = 0.05;

async function main() {
  // hre.web3 = new Web3(new Web3HTTPProviderAdapter(hre.network.provider));
  // console.log(hre.web3.currentProvider);
  console.log("Accounts");
  // console.log(await hre.web3.eth.getAccounts());
  console.log(hre.ethers.provider);
  // console.log(ethers.provider);
  // console.log(await ethers.getSigners());
  const signer = (await ethers.getSigners)[0];
  const provider = ethers.provider;

  const eip1193Provider = new Eip1193Bridge(signer, provider);
  const seaport = new OpenSeaPort(eip1193Provider, {
    networkName: Network.Main,
  });
  // Example: many fixed price auctions for a factory option.
  console.log("Creating fixed price auctions...");
  const fixedSellOrders = await seaport.createFactorySellOrders({
    assets: [
      {
        tokenId: FIXED_PRICE_OPTION_ID,
        tokenAddress: FACTORY_CONTRACT_ADDRESS,
      },
    ],
    accountAddress: OWNER_ADDRESS,
    startAmount: FIXED_PRICE,
    numberOfOrders: NUM_FIXED_PRICE_AUCTIONS,
  });
  console.log(`Successfully made ${fixedSellOrders.length} fixed-price sell orders! ${fixedSellOrders[0].asset.openseaLink}\n`);

  // Example: many fixed price auctions for multiple factory options.
  console.log("Creating fixed price auctions...");
  const fixedSellOrdersTwo = await seaport.createFactorySellOrders({
    assets: [
      { tokenId: "3", tokenAddress: FACTORY_CONTRACT_ADDRESS },
      { tokenId: "4", tokenAddress: FACTORY_CONTRACT_ADDRESS },
      { tokenId: "5", tokenAddress: FACTORY_CONTRACT_ADDRESS },
      { tokenId: "6", tokenAddress: FACTORY_CONTRACT_ADDRESS },
    ],
    factoryAddress: FACTORY_CONTRACT_ADDRESS,
    accountAddress: OWNER_ADDRESS,
    startAmount: FIXED_PRICE,
    numberOfOrders: NUM_FIXED_PRICE_AUCTIONS,
  });
  console.log(`Successfully made ${fixedSellOrdersTwo.length} fixed-price sell orders for multiple assets at once! ${fixedSellOrders[0].asset.openseaLink}\n`);

  // Example: many declining Dutch auction for a factory.
  console.log("Creating dutch auctions...");

  // Expire one day from now
  const expirationTime = Math.round(Date.now() / 1000 + 60 * 60 * 24);
  const dutchSellOrders = await seaport.createFactorySellOrders({
    assets: [
      {
        tokenId: DUTCH_AUCTION_OPTION_ID,
        tokenAddress: FACTORY_CONTRACT_ADDRESS,
      },
    ],
    accountAddress: OWNER_ADDRESS,
    startAmount: DUTCH_AUCTION_START_AMOUNT,
    endAmount: DUTCH_AUCTION_END_AMOUNT,
    expirationTime: expirationTime,
    numberOfOrders: NUM_DUTCH_AUCTIONS,
  });
  console.log(`Successfully made ${dutchSellOrders.length} Dutch-auction sell orders! ${dutchSellOrders[0].asset.openseaLink}\n`);
}

main();
