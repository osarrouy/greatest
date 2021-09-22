const chalk = require("chalk");
const owner = "0x817c5294d8B9B2768Ac2b50691D72f5850C9721B";

const PROXY_REGISTRY = {
  rinkeby: "0xf57b2c51ded3a29e6891aba85459d600256cf317",
  mainnet: "0xa5409ec958c83c3f309868babaca7c86dcb077c1",
};

const transferTokenOwnership = async (ctx) => {
  const tx = await ctx.token.transferOwnership(ctx.factory.address);
  await tx.wait();
  console.log("Token ownership transferred to factory");
};

const transferFactoryOwnership = async (ctx) => {
  const tx = await ctx.factory.transferOwnership(owner);
  await tx.wait();
  console.log("Factory ownership transferred to " + owner);
};

const deploy = {
  token: async (ctx) => {
    const Token = await ethers.getContractFactory("GSAT");
    ctx.token = await Token.deploy();
    await ctx.token.deployed();
    console.log(`Token deployed at ${chalk.cyan(ctx.token.address)}`);
  },
  factory: async (ctx) => {
    const Factory = await ethers.getContractFactory("GSATFactory");
    ctx.factory = await Factory.deploy(ctx.token.address, PROXY_REGISTRY.rinkeby);
    await ctx.factory.deployed();
    console.log(`Factory deployed at ${chalk.cyan(ctx.factory.address)}`);

    await transferTokenOwnership(ctx);
    await transferFactoryOwnership(ctx);
  },
};

const mint = async (ctx, tokenId, to = "0x8873b045d40A458e46E356a96279aE1820a898bA") => {
  const tx = await ctx.token.mint(to, tokenId);
  await tx.wait();
  console.log(`Minted token ${chalk.cyan("#" + tokenId)}`);
};

const main = async () => {
  await deploy.token(this);
  await deploy.factory(this);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
