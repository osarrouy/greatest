const chalk = require("chalk");

const PROXY_REGISTRY = {
  rinkeby: "0xf57b2c51ded3a29e6891aba85459d600256cf317",
  mainnet: "0xa5409ec958c83c3f309868babaca7c86dcb077c1",
};

async function main() {
  const GSAT = await ethers.getContractFactory("GSAT");
  const GSATFactory = await ethers.getContractFactory("GSATFactory");

  const token = await GSAT.deploy();
  await token.deployed();

  const factory = await GSATFactory.deploy(token.address, PROXY_REGISTRY.rinkeby);
  await factory.deployed();

  console.log(`Token deployed at ${chalk.cyan(token.address)}`);
  console.log(`Factory deployed at ${chalk.cyan(factory.address)}`);

  const tx0 = await token.mint("0x8873b045d40A458e46E356a96279aE1820a898bA", 0);
  await tx0.wait();
  const tx = await token.transferOwnership(factory.address);
  await tx.wait();

  console.log("Ownership transferred");

  // mint once
  // const tx1 = await greatest.mint();
  // await tx1.wait();
  // // mint twice
  // const tx2 = await greatest.mint();
  // await tx2.wait();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
