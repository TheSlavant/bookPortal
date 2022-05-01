const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log("Deploying contracts with account: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());

  // Compile smart contract code
  const recContractFactory = await hre.ethers.getContractFactory("BookRecPortal");
  // Deploy smart contract
  const recContract = await recContractFactory.deploy();
  await recContract.deployed();

  console.log("BookRecPortal address: ", recContract.address);
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
