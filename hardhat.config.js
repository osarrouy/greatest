require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.1",
        settings: {
          optimizer: {
            enabled: true,
            runs: 2000,
          },
        },
      },
    ],
  },
  networks: {
    frame: {
      url: "http://localhost:1248",
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
  },
};
