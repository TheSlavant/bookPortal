// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract BookRecPortal {

  // Keeps track of the total number of recs I got
  uint256 totalBookRecs;
  // Seed for generating a random number
  uint256 private seed;

  // Emitted when a new rec is submitted
  event NewRec(address indexed from, uint256 timestamp, string recommendation);

  struct BookRec {
      address recommender; // The address of the user who sent the recommendation.
      string recommendation; // The message the user sent.
      uint256 timestamp; // The timestamp when the user sent the recommendation.
  }

  /*
  * A variable that stores an array of structs.
  * It holds all the book recs anyone ever sends to me!
  */
  BookRec[] bookRecs;

  /*
   * Address => uint mapping that associates an address with a number.
   * We're storing the address with the last time the user submitted a rec.
   */
  mapping(address => uint256) public lastSubmit;


  constructor() payable {
      console.log("Contract constructed!");
      // Set initial seed
      seed = (block.timestamp + block.difficulty) % 100;
  }

  function recommend(string memory _recommendation) public {
    // Current timestamp must be at least 30 min bigger than the last timestamp stored
    require(
        lastSubmit[msg.sender] + 15 minutes < block.timestamp,
        "Wait 15 minutes before submitting another recommendation."
    );

    // Update the current timestamp for the user
    lastSubmit[msg.sender] = block.timestamp;

    totalBookRecs += 1;
    console.log("%s sent a recommendation: %s", msg.sender, _recommendation);
    // Add book rec to the array
    bookRecs.push(BookRec(msg.sender, _recommendation, block.timestamp));

    // Generate a new seed for the next user that sends a wave
    seed = (block.difficulty + block.timestamp + seed) % 100;
    console.log("Random # generated: %d", seed);

    // 51% chance of winning, personalised by Yours Truly :)
    if (seed >= 27 && seed <= 77) {
         // Determine the prize for submitting a book rec (hint: ASCII)
         uint256 prizeAmount = 0.00008983 ether;

         // Announce the winner
         console.log("%s won!", msg.sender);

         // Make sure smart contract has enough ETH
         require(
         prizeAmount <= address(this).balance,
         "Trying to withdraw more money than the contract has."
         );

         // Send money to recommender and check for success
         (bool success, ) = (msg.sender).call{value: prizeAmount}("");
         require(success, "Failed to withdraw money from contract.");
    }

    // Emit the event with rec and metadata
    emit NewRec(msg.sender, block.timestamp, _recommendation);
  }

  // Function to retrieve recs from the website
  function getAllRecs() public view returns (BookRec[] memory) {
      return bookRecs;
  }

  function getTotalNumRecs() public view returns (uint256) {
    console.log("We have %d total book recs!", totalBookRecs);
    return totalBookRecs;
  }
}
