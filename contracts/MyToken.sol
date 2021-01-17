// SPDX-License-Identifier: UNLISENCED
pragma solidity ^0.7.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    
    /**
        Create an ERC20 token that has the given initial supply using the open zepplin auditied erc20 contracts    
     */
    constructor(uint256 initialSupply) ERC20("Bread Token", "BRD") {
        _mint(msg.sender, initialSupply);
    }
}