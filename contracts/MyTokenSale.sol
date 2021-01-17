pragma solidity ^0.7.4;

import "./CrowdSale.sol";

contract MyTokenSale is Crowdsale {

    constructor(uint256 rate, address payable wallet, IERC20 token) Crowdsale(rate, wallet, token) {

    }
}