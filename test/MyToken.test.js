const _deploy_contracts = require("../migrations/2_deploy_contracts");

const MyToken = artifacts.require("./MyToken.sol");

// import chai 
const chai = require("chai");

// set up big number for use
const BN = web3.utils.BN;
const chaiBN = require("chai-bn")(BN);
chai.use(chaiBN);

// set up chai as promised 
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

// Shorten the syntax to use expect
const expect = chai.expect;


contract("Token Contract", (accounts) => {

    it("All tokens should be in my account", async() => {
        // get the token instance from truffle
        const tokenInstance = await MyToken.deployed();
        // this is a solidity getter and so can easily be accessed in this fashion
        let totalSupply = await tokenInstance.totalSupply();
        // expect the balance of the account that created to contract to be the total contract amount
        expect(tokenInstance.balanceOf(accounts[0])).to.eventually.be.a.bignumber.equal(totalSupply);
    });

    // it("Should create a token with a set initial mint", async() => {

    //     const tokenInstance = Token.deployed();


    // })

});