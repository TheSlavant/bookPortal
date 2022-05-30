const main = async () => {
  const bookContractFactory = await hre.ethers.getContractFactory("BookRecPortal");

  // Deploy with starting balance
  const bookContract = await bookContractFactory.deploy({
    value: hre.ethers.utils.parseEther("0.001"),
  });
  await bookContract.deployed();
  console.log("Contract address:", bookContract.address);

  // Get contract balance
  let contractBalance = await hre.ethers.provider.getBalance(bookContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  // Sending a few book recs
  let recTxn = await bookContract.recommend("Dr. Zhivago is the best book I've ever read");
  await recTxn.wait(); // Wait for the transaction to be mined

  /* Testing the 30 min timeout
   * let recTxn2 = await bookContract.recommend("Gonna get richhhhh");
   * await recTxn.wait(); // Wait for the transaction to be mined
   */

  const [_, randomPerson] = await hre.ethers.getSigners()
  recTxn = await bookContract.connect(randomPerson).recommend("The Three Body Problem trilogy is SYCK");
  await recTxn.wait(); // Wait for the transaction to be mined

  // Check contract balance after transactions
  contractBalance = await hre.ethers.provider.getBalance(bookContract.address);
  console.log(
    "Contract balance:",
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allRecs = await bookContract.getAllRecs();
  console.log(allRecs);

  let recCount;
  recCount = await bookContract.getTotalNumRecs();
  console.log(recCount.toNumber());
};

const runMain = async () => {
  try {
    await main();
    process.exit(0); // exit Node process without error
  } catch (error) {
    console.log(error);
    process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
  }
};

runMain();
