const { contracts_build_directory } = require("../truffle-config");

/**
 * Test package for the MyTokenSale contract, it is set up correctly during migrateions so there is no need to deploy
 * a new instance of the contract during each test phase
 */
const MyTokenSaleContract = artifacts.require("./MyTokenSale.sol");
const MyToken = artifacts.require("./MyToken.sol");
const KYCContract = artifacts.require("./KYCContract.sol");

const chai = require("./setupChai.js");
// Shorten the syntax to use expect
const BN = web3.utils.BN;
const expect = chai.expect;


contract("My Token Sale", async(accounts) => {

    const [deployerAccount, testerAccount, anotherAccount] = accounts;

    it("Should not have any tokens in deployer account after initialisation", async() => {
        // get an instance of the deploye contract on the chain
        let instance = await MyToken.deployed();

        // test that within the sale the balance of the deploying contract is 0, since we send the funds back to the contract
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equals(new BN(0));
    });

    it("All the tokens should be in the smart contract at the start", async () => {
        let instance = await MyToken.deployed();

        // check that the address itself holds all of the tokens
        let balanceOfContract = await instance.balanceOf(MyTokenSaleContract.address);
        let totalSupply = await instance.totalSupply();

        return expect(balanceOfContract).to.be.a.bignumber.equal(totalSupply);
    });

    it("Should be possible to purchase tokens", async () => {
        let tokenInstance = await MyToken.deployed();
        let tokenSaleInstance = await MyTokenSaleContract.deployed();
        let kycInstance = await KYCContract.deployed();

        let balanceBefore = await tokenInstance.balanceOf(deployerAccount);

        // to allow a transaction to take place, we need to whitelist the addresses that are performing the transactions with KYC!!
        expect(kycInstance.setKycCompleted(deployerAccount, {from: deployerAccount})).to.eventually.be.fulfilled; // wait for it to be fufilled successfully


        // we will now purchase a token with eth from the deployer account, then check on the erc20 contract that the
        // deployer account has an extra token
        // just check that this goes through at all :)
        expect(tokenSaleInstance.sendTransaction({from: deployerAccount, value: web3.utils.toWei("1", "wei")})).to.be.fulfilled;

        // check that within the token contract that the deployer has one extra token
        let balanceAfter = balanceBefore.add(new BN(1));
        return expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceAfter);
    });
});