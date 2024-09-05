
<template>
<div class="container mx-auto p-8">
<div class="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-8 border border-white border-opacity-20">
<h1 class="text-4xl font-bold mb-8 text-center text-purple-400">WETH Wrapper</h1>
<div class="mb-6">
<p class="text-lg text-blue-300">ETH Balance: {{ ethBalance }} ETH</p>
<p class="text-lg text-green-300">WETH Balance: {{ wethBalance }} WETH</p>
</div>
<div class="mb-6">
<label class="block text-lg text-pink-300 mb-2" for="ethAmount">Amount of ETH to Wrap:</label>
<input class="w-full p-2 rounded-md bg-gray-800 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600" id="ethAmount" min="0" placeholder="Enter ETH amount" step="0.000000000000000001" type="number" v-model="ethAmount"/>
</div>
<button @click="wrapEth" class="w-full py-3 px-6 text-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-md shadow-md hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transform hover:scale-105 transition-all duration-200">
        Wrap ETH
      </button>
<p class="mt-4 text-red-500" v-if="error">{{ error }}</p>
</div>
</div>
</template>
<script>
import { ethers } from 'ethers';

export default {
  name: 'WETHWrapper',
  data() {
    return {
      ethAmount: '',
      ethBalance: '0',
      wethBalance: '0',
      error: '',
      provider: null,
      signer: null,
      contract: null,
      contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      chainId: 1,
      abi: [
        {
          "name": "deposit",
          "stateMutability": "payable",
          "inputs": [],
          "outputs": []
        },
        {
          "name": "balanceOf",
          "stateMutability": "view",
          "inputs": [
            {
              "name": "account",
              "type": "address"
            }
          ],
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ]
        }
      ]
    };
  },
  methods: {
    async connectWallet() {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          this.provider = new ethers.providers.Web3Provider(window.ethereum);
          this.signer = this.provider.getSigner();
          this.contract = new ethers.Contract(this.contractAddress, this.abi, this.signer);
          await this.checkNetwork();
          await this.updateBalances();
        } catch (err) {
          this.error = 'Failed to connect wallet: ' + err.message;
        }
      } else {
        this.error = 'Please install MetaMask!';
      }
    },
    async checkNetwork() {
      const network = await this.provider.getNetwork();
      if (network.chainId !== this.chainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: ethers.utils.hexValue(this.chainId) }],
          });
        } catch (err) {
          this.error = 'Please switch to the Ethereum mainnet';
        }
      }
    },
    async updateBalances() {
      try {
        const address = await this.signer.getAddress();
        const ethBalance = await this.provider.getBalance(address);
        this.ethBalance = ethers.utils.formatEther(ethBalance);
        
        const wethBalance = await this.contract.balanceOf(address);
        this.wethBalance = ethers.utils.formatEther(wethBalance);
      } catch (err) {
        this.error = 'Failed to update balances: ' + err.message;
      }
    },
    async wrapEth() {
      if (!this.signer) {
        await this.connectWallet();
      }
      
      if (!this.ethAmount || this.ethAmount <= 0) {
        this.error = 'Please enter a valid amount';
        return;
      }
      
      try {
        const tx = await this.contract.deposit({
          value: ethers.utils.parseEther(this.ethAmount)
        });
        await tx.wait();
        await this.updateBalances();
        this.ethAmount = '';
        this.error = '';
      } catch (err) {
        this.error = 'Failed to wrap ETH: ' + err.message;
      }
    }
  },
  mounted() {
    this.connectWallet();
  }
};
</script>
