const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const recContractFactory = await hre.ethers.getContractFactory("BookRecPortal");
  const recContract = await recContractFactory.deploy();
  await recContract.deployed();

  console.log("Contract deployed to:", recContract.address);
  console.log("Contract deployed by:", owner.address);

  let recCount;
  recCount = await recContract.getTotalRecs();

  let recTxn = await recContract.submitRec();
  await recTxn.wait();

  recCount = await recContract.getTotalRecs();

  recTxn = await recContract.connect(randomPerson).submitRec();
  await recTxn.wait();

  recCount = await recContract.getTotalRecs();
};

const runMain = async () => {
  try {
    await main();
    process.exit(0); // exit Node process without error
  } catch (error) {
    console.log(error);
    process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
  }
  // Read more about Node exit ('process.exit(num)') status codes here: https://stackoverflow.com/a/47163396/7974948
};

runMain();
