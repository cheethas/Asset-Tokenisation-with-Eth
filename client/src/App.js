import React, { Component } from "react";

// import our contracts
import MyToken from "./contracts/MyToken.json";
import MyTokenSale from "./contracts/MyTokenSale.json";
import KYC from "./contracts/KYCContract.json";

// import web 3
import getWeb3 from "./getWeb3";

// styling
import "./App.css";

class App extends Component {
  state = { loaded: false, kycAddress: "123", purchaseTokenAddr: null, tokenCount: 0};

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId();
      this.deployedNetwork = MyToken.networks[this.networkId];
      
      // get the token contract 
      this.tokenInstance = new this.web3.eth.Contract(
        MyToken.abi,
        MyToken.networks[this.networkId] && MyToken.networks[this.networkId].address,
      );

      // get the token sale contract
      this.tokenSaleInstance = new this.web3.eth.Contract(
        MyTokenSale.abi,
        MyTokenSale.networks[this.networkId] && MyTokenSale.networks[this.networkId].address,
      );

      // get the KYC contract
      this.kycInstance = new this.web3.eth.Contract(
        KYC.abi,
        KYC.networks[this.networkId] && KYC.networks[this.networkId].address,
      );

      // set up out code to listen to token transfers!!
      this.listenToTokenTransfer();

      // Set web3, accounts, and contract to the state, and then proceed with an
      this.setState({loaded: true, purchaseTokenAddr: MyTokenSale.networks[this.networkId].address}, this.updateUserTokens);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  // handle any generic input change
  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type == "checkbox" ? target.checked : target.value;
    const name = target.name;
    // inset the value of name into the state setter
    this.setState({
      [name]: value
    });
  }

  // handle when the user clicks the kyc submit button
  handleKycSubmit = async() => {
    console.log(this.state.kycAddress);
    console.log(this.accounts[0]);
    // call the set kyc completed functionality to write the address of the user to the smart contract
    await this.kycInstance.methods.setKycCompleted(this.state.kycAddress).send({from: this.accounts[0]});
    // notify the user that the operation has completed
    alert("KYC address " + this.state.kycAddress + " added successfully");
  }

  // when the user purchases tokens from the pag
  updateUserTokens = async () => {
    // call operations are always free!
    let userTokens = await this.tokenInstance.methods.balanceOf(this.accounts[0]).call();
    this.setState({tokenCount: userTokens});
  }

  // listen to whenever the user updates their token amount
  // you can listen to events as normal, but if they are indexed, then you can filter out certain events from the side chain and only
  // listen to the important ones
  listenToTokenTransfer = () => {
    // listen only when the to field is the currently logged in account - then recall the update user tokens function and read 
    // the user's balance from the chain
    this.tokenInstance.events.Transfer({to: this.accounts[0]}).on("data", this.updateUserTokens);
  }

  handleTokenPurchase = async () => {
    // remember to include the value field !!!
    await this.tokenSaleInstance.methods.buyTokens(this.accounts[0])
      .send({
        from: this.accounts[0], 
        value: this.web3.utils.toWei("1", "wei")
      }
    );
  }


  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Bread Token!</h1>
        <p>Bread token token sale, get yours today</p>
        <h2>KYC Whitelisting</h2>
        Address to allow: <input type="text" name="kycAddress" value={this.state.kycAddress} onChange={this.handleInputChange}/>
        <button type="button" name="addToWhitelist" onClick={this.handleKycSubmit}>Add to Whitelist</button>
        <p>If you want to purchase tokens, send Wei to this address: {this.state.purchaseTokenAddr}</p>
        <p>You currently have {this.state.tokenCount} BREAD tokens</p>
        <button type="button" onClick={this.handleTokenPurchase}>Click here to buy more tokens</button>
      </div>
    );
  }
}

export default App;
