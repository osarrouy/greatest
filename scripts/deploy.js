const chalk = require("chalk");

const PROXY_REGISTRY = {
  rinkeby: "0xf57b2c51ded3a29e6891aba85459d600256cf317",
  mainnet: "0xa5409ec958c83c3f309868babaca7c86dcb077c1",
};

const transferOwnership = async (ctx) => {
  const tx = await ctx.token.transferOwnership(ctx.factory.address);
  await tx.wait();
  console.log("Token ownership transferred to factory");
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

    await transferOwnership(ctx);
  },
};

const mint = async (ctx, tokenId, to = "0x8873b045d40A458e46E356a96279aE1820a898bA") => {
  const tx = await ctx.token.mint(to, tokenId);
  await tx.wait();
  console.log(`Minted token ${chalk.cyan("#" + tokenId)}`);
};

async function main() {
  await deploy.token(this);
  await deploy.factory(this);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
