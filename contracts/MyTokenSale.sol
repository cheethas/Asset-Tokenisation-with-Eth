pragma solidity ^0.7.4;

import "./CrowdSale.sol";
import "./KYCContract.sol";

contract MyTokenSale is Crowdsale {

    // used to make sure the addresses that try to purchase tokens are whitelisted!!
    KYCContract kycContract;

    constructor(uint256 rate, address payable wallet, IERC20 token, KYCContract _kyc) Crowdsale(rate, wallet, token) {
        
        // set the kyc contract to be the one sent from the constructor arguments
        kycContract = _kyc;
    }

    // override the validate prepurchase contract!
    /**
     * @dev Validation of an incoming purchase. Use require statements to revert state when conditions are not met.
     * Use `super` in contracts that inherit from Crowdsale to extend their validations.
     * Example from CappedCrowdsale.sol's _preValidatePurchase method:
     *     super._preValidatePurchase(beneficiary, weiAmount);
     *     require(weiRaised().add(weiAmount) <= cap);
     * @param beneficiary Address performing the token purchase
     * @param weiAmount Value in wei involved in the purchase
     */
    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal view override{
        super._preValidatePurchase(beneficiary, weiAmount);
        require(kycContract.kycCompleted(msg.sender), "This user has not completed the required know your customer checks");
        // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
    }
}