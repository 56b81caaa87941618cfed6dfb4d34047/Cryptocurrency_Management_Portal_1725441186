
<template>
  <div class="container mx-auto p-8">
    <div class="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-8 max-w-md mx-auto">
      <h1 class="text-3xl font-bold mb-6 text-center text-purple-400">{{ contractName }} ({{ contractSymbol }})</h1>
      <div class="mb-6">
        <label for="ethAmount" class="block text-sm font-medium text-gray-300 mb-2">Amount of ETH to wrap:</label>
        <input
          id="ethAmount"
          v-model="ethAmount"
          type="number"
          min="0"
          step="0.01"
          class="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Enter ETH amount"
        >
      </div>
      <button
        @click="wrapEth"
        class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
      >
        Wrap ETH
      </button>
      <div class="mt-6 text-center">
        <p class="text-gray-300">Your WETH Balance: <span class="font-bold text-purple-400">{{ wethBalance }} WETH</span></p>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers';

export default {
  name: 'WethWrapper',
  data() {
    return {
      provider: null,
      signer: null,
      contract: null,
      ethAmount: '',
      wethBalance: '0',
      contractName: '',
      contractSymbol: '',
      contractAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      chainId: 1,
      abi: [
        {
          "name": "name",
          "stateMutability": "view",
          "inputs": [],
          "outputs": [{"type": "string"}]
        },
        {
          "name": "symbol",
          "stateMutability": "view",
          "inputs": [],
          "outputs": [{"type": "string"}]
        },
        {
          "name": "balanceOf",
          "stateMutability": "view",
          "inputs": [{"type": "address"}],
          "outputs": [{"type": "uint256"}]
        },
        {
          "name": "deposit",
          "stateMutability": "payable",
          "inputs": [],
          "outputs": []
        }
      ]
    };
  },
  methods: {
    async connectWallet() {
      try {
        if (typeof window.ethereum !== 'undefined') {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          this.provider = new ethers.BrowserProvider(window.ethereum);
          this.signer = await this.provider.getSigner();
          this.contract = new ethers.Contract(this.contractAddress, this.abi, this.signer);
          await this.checkNetwork();
          await this.updateBalance();
          await this.getContractInfo();
        } else {
          throw new Error('Please install MetaMask or another Ethereum wallet');
        }
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    },
    async checkNetwork() {
      const network = await this.provider.getNetwork();
      if (network.chainId !== BigInt(this.chainId)) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${this.chainId.toString(16)}` }],
          });
        } catch (error) {
          console.error('Failed to switch network:', error);
          throw new Error('Please switch to the Ethereum mainnet in your wallet');
        }
      }
    },
    async updateBalance() {
      if (this.contract && this.signer) {
        const address = await this.signer.getAddress();
        const balance = await this.contract.balanceOf(address);
        this.wethBalance = ethers.formatEther(balance);
      }
    },
    async getContractInfo() {
      if (this.contract) {
        this.contractName = await this.contract.name();
        this.contractSymbol = await this.contract.symbol();
      }
    },
    async wrapEth() {
      if (!this.signer) {
        await this.connectWallet();
      }
      await this.checkNetwork();

      try {
        const tx = await this.contract.deposit({
          value: ethers.parseEther(this.ethAmount)
        });
        await tx.wait();
        await this.updateBalance();
        this.ethAmount = '';
      } catch (error) {
        console.error('Error wrapping ETH:', error);
      }
    }
  },
  mounted() {
    this.connectWallet();
  }
};
</script>
