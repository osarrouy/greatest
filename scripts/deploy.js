const chalk = require("chalk");
const owner = "0x817c5294d8B9B2768Ac2b50691D72f5850C9721B";
const Batch = {
  Arkhe: 0,
  Drop: 1,
  A: 2,
  B: 3,
};

const PROXY_REGISTRY = {
  rinkeby: "0xf57b2c51ded3a29e6891aba85459d600256cf317",
  mainnet: "0xa5409ec958c83c3f309868babaca7c86dcb077c1",
};

const deploy = {
  token: async (ctx) => {
    const Token = await ethers.getContractFactory("GSAT");
    ctx.token = await Token.deploy(PROXY_REGISTRY.rinkeby);
    await ctx.token.deployed();
    console.log(`Token deployed at ${chalk.cyan(ctx.token.address)} and arkhe batch minted`);
    await (await ctx.token.mint(Batch.Drop)).wait();
    console.log("Token drop minted");
    await (await ctx.token.mint(Batch.A)).wait();
    console.log("Token batch A minted");
    await (await ctx.token.mint(Batch.B)).wait();
    console.log("Token batch B minted");
  },
};

const main = async () => {
  await deploy.token(this);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
