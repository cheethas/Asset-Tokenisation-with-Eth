var MyToken = artifacts.require("./MyToken.sol");

// Use the truffle provided deployer object to deploy the ERC 20 contract to the chain
// As the constructor for the mytoken contract contains an argument 
// We must add another parameter which is the initial supply of the token.
module.exports = function(deployer) {
  deployer.deploy(MyToken, 1000000);
};
