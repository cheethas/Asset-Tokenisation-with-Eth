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
  state = { loaded: false, kycAddress: "123"};

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
        this.deployedNetwork && this.deployedNetwork.address,
      );

      // get the token sale contract
      this.tokenSaleInstance = new this.web3.eth.Contract(
        MyTokenSale.abi,
        this.deployedNetwork && this.deployedNetwork.address,
      );

      // get the KYC contract
      this.kycInstance = new this.web3.eth.Contract(
        KYC.abi,
        this.deployedNetwork && this.deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      this.setState({loaded: true});
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
    // call the set kyc completed functionality to write the address of the user to the smart contract
    await this.kycInstance.methods.setKycCompleted(this.state.kycAddress).send({from: this.accounts[0]});
    // notify the user that the operation has completed
    alert("KYC address " + this.state.kycAddress + " added successfully");
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
      </div>
    );
  }
}

export default App;
