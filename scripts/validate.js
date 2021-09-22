const got = require("got");
const chalk = require("chalk");

const address = "0x795335B7c8A1a25e773012fcE4077389bDEa0abF";

const main = async () => {
  for (let i = 0; i < 500; i++) {
    process.stdout.write(`» validating token ${chalk.cyan("#" + i)} `);
    try {
      await got(`https://testnets-api.opensea.io/asset/${address}/${i}/validate`).json();
      console.log(chalk.green("OK"));
    } catch (error) {
      console.log(chalk.red("KO"));
    }
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
