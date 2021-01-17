var MyToken = artifacts.require("./MyToken.sol");
var MyTokenSale = artifacts.require("./MyTokenSale.sol");

// Use the truffle provided deployer object to deploy the ERC 20 contract to the chain
// As the constructor for the mytoken contract contains an argument 
// We must add another parameter which is the initial supply of the token.

// We must now set up our token sale with all of the funds that are originally sent to our deployer address
// We must manually do this from deployment, which is a bit of a pain, but here we are :)
module.exports = async function(deployer) {
  var address = await web3.eth.getAccounts();
  var initialTokenAmount = 1000000;
  await deployer.deploy(MyToken, initialTokenAmount);

  // the crowd sale takes the rate at which tokens are minted - in this case 1
  // it will take the address to send all of the funds, which is the creator address in this case
  // then it takes the address of the ERC20 token that is being minted!! as we await for the previous operation, it has 
  // already been deployed to the chain and assigned an address so we can just call it's address here!
  await deployer.deploy(MyTokenSale, 1, address[0], MyToken.address);

  // get the instance of the deployed token, then send all of the funds to the token sale
  let instance = await MyToken.deployed();
  await instance.transfer(MyTokenSale.address, initialTokenAmount);

};
