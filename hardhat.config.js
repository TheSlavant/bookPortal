require("@nomiclabs/hardhat-waffle");

// To learn how to create a task go to
// https://hardhat.org/guides/create-task.html

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

 module.exports = {
   solidity: "0.8.4",
   networks: {

     rinkeby: {
       url: "https://eth-rinkeby.alchemyapi.io/v2/7eGDKzmJ9eQT8r-vUOAJPA2T38MIqQTI",
       accounts: ["7c7c9d8b39c364acf76fdbca466403807a8f09d3036aa962c759b6842327155b"]
     },
   },
 };
