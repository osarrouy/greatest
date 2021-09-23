const hre = require("hardhat");
const chalk = require("chalk");
const { OpenSeaPort, Network } = require("opensea-js");

// const API_KEY
const TOKEN = "0xf515de755a038282dd3ff6a388b1515d39c8ca8e";
const OWNER = "0x8873b045d40a458e46e356a96279ae1820a898ba";
const NETWORK = process.env.NETWORK;
const DUTCH_AUCTION_START_AMOUNT = 7.7;
const DUTCH_AUCTION_END_AMOUNT = 0.5;
const networkName = process.env.NETWORK === "Rinkeby" ? Network.Rinkeby : Network.Main;
const expirationTime = Math.round(Date.now() / 1000 + 6 * 60 * 60);

const assets = () => {
  const _assets = [];
  for (let i = 71; i <= 72; i++) {
    _assets.push({ tokenId: i, tokenAddress: TOKEN });
  }

  return _assets;
};

const main = async () => {
  const seaport = new OpenSeaPort(hre.web3.currentProvider, {
    networkName,
  });

  console.log("Creating dutch auction ...");
  await seaport.createFactorySellOrders({
    assets: assets(),
    accountAddress: OWNER,
    startAmount: DUTCH_AUCTION_START_AMOUNT,
    endAmount: DUTCH_AUCTION_END_AMOUNT,
    expirationTime,
  });
  console.log(chalk.green("Dutch auction successfully opened !"));
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
