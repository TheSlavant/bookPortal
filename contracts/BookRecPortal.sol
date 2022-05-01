// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract BookRecPortal {
  uint256 totalBookRecs;

  constructor() {
      console.log("Life is a playground - or nothing.");
  }

  function submitRec() public {
    totalBookRecs += 1;
    console.log("%s has recommended a book!", msg.sender);
  }

  function getTotalRecs() public view returns (uint256) {
    console.log("We have %d total book recs!", totalBookRecs);
    return totalBookRecs;
  }
}
