const _deploy_contracts = require("../migrations/2_deploy_contracts");
// enviornment variables
require("dotenv").config({path: "../.env"});
const MyToken = artifacts.require("./MyToken.sol");

const chai = require("./setupChai.js");
// Shorten the syntax to use expect
const BN = web3.utils.BN;
const expect = chai.expect;


contract("Token Contract", (accounts) => {

    // delegate accounts
    const [deployerAccount, recipientAccount, anotherAccount] = accounts;

    // The before Each hook allows us to redeploy our smart contract before each of the test cases run
    // Therefore we are completely detatched from what happens within our migrations file.
    beforeEach(async() => {
        this.tokenInstance = await MyToken.new(new BN(process.env.INITIAL_TOKENS));
    })

    it("All tokens should be in my account", async() => {
        // get the token instance from truffle
        const tokenInstance = this.tokenInstance;
        // this is a solidity getter and so can easily be accessed in this fashion
        let totalSupply = await tokenInstance.totalSupply();
        // expect the balance of the account that created to contract to be the total contract amount
        return expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
    });

    it("Is possible to send tokens between accounts", async() => {
        const sendTokens = 1;
        const tokenInstance = this.tokenInstance;
        let totalSupply = await tokenInstance.totalSupply();
        expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
        
        // the fufilled keyword for chai basically just wants the promise to finish, and will not care what happens next 
        expect(tokenInstance.transfer(recipientAccount, sendTokens)).to.eventually.be.fulfilled;
        expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
        return expect(tokenInstance.balanceOf(recipientAccount)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
    });

    it("is not possible to send more tokens than are available in total", async() => {
        const tokenInstance = this.tokenInstance;
        let balanceOfDeployer = await tokenInstance.balanceOf(deployerAccount);

        // we will expect this to fail, as there are too many tokens being sent, so we say that it will eventually be rejected
        expect(tokenInstance.transfer(recipientAccount, new BN(balanceOfDeployer+1))).to.eventually.be.rejected;

        // we expect any transaction that takes place to be rolled back
        return expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceOfDeployer);
    });


    // })

});