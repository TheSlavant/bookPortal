const main = async () => {

  /* Optional info
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();
  console.log("Deploying contracts with account: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());
  */

  // Compile smart contract code
  const bookContractFactory = await hre.ethers.getContractFactory("BookRecPortal");
  // Deploy smart contract
  const bookContract = await bookContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.001"),
  });
  await bookContract.deployed();

  console.log("BookRecPortal address: ", bookContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
