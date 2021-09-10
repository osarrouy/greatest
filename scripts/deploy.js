const chalk = require("chalk");

const PROXY_REGISTRY = {
  rinkeby: "0xf57b2c51ded3a29e6891aba85459d600256cf317",
  mainnet: "0xa5409ec958c83c3f309868babaca7c86dcb077c1",
};

async function main() {
  const Greatest = await ethers.getContractFactory("GHAT");

  const greatest = await Greatest.deploy(PROXY_REGISTRY.rinkeby);
  await greatest.deployed();

  console.log(`NFT deployed at ${chalk.cyan(greatest.address)}`);

  // mint once
  const tx1 = await greatest.mint();
  await tx1.wait();
  // mint twice
  const tx2 = await greatest.mint();
  await tx2.wait();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
