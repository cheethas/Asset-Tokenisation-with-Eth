
pragma solidity ^0.7.4;

import "@openzeppelin/contracts/access/Ownable.sol";

/** KYC Contract
    The purpose of this contract is to add a know your customer functionality that is required for many asset sales 
    such as this one in many juristrictions.

    We will need to do an email check etc, and make sure that the user who tries to purchase tokens is actually allowed
    to do so.
*/
contract KYCContract is Ownable{

    // only users whose addresses are within this mapping are allowed to purchase
    mapping(address => bool) allowed;

    // this sets the kyc mapping for the provided address to true;
    function setKycCompleted(address _adr) public {
        allowed[_adr] = true;
    }

    function setKycRevoked(address _adr) public onlyOwner{
        allowed[_adr] = false;
    }

    // a forced getter function for a particular address of the allowed mapping
    function kycCompleted(address _adr) public view returns(bool) {
        return allowed[_adr];
    }
}
