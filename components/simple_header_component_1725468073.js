
<template>
<div class="container mx-auto p-8 bg-opacity-30 bg-white backdrop-filter backdrop-blur-lg rounded-xl shadow-lg">
<h1 class="text-4xl font-bold mb-8 text-center text-purple-500">WETH Wrapper</h1>
<div class="mb-6">
<p class="text-lg mb-2 text-blue-400">Your ETH Balance: {{ ethBalance }} ETH</p>
<p class="text-lg mb-4 text-green-400">Your WETH Balance: {{ wethBalance }} WETH</p>
</div>
<div class="mb-6">
<label class="block text-lg mb-2 text-pink-500" for="amount">Amount of ETH to wrap:</label>
<input class="w-full p-2 rounded-lg bg-opacity-50 bg-white backdrop-filter backdrop-blur-sm border border-purple-300 focus:border-purple-500 focus:ring focus:ring-purple-200" id="amount" min="0" step="0.000000000000000001" type="number" v-model="amount"/>
</div>
<button @click="wrapEth" class="w-full py-3 px-6 text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-md hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-300">
      Wrap ETH
    </button>
<p class="mt-4 text-red-500" v-if="error">{{ error }}</p>
<p class="mt-4 text-green-500" v-if="success">{{ success }}</p>
</div>
</template>
<script>
import { ethers } from 'ethers'

export default {
  name: 'WethWrapper',
  data() {
    return {
      provider: null,
      signer: null,
      contract: null,
      ethBalance: '0',
      wethBalance: '0',
      amount: '',
      error: '',
      success: '',
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
            { "type": "address" }
          ],
          "outputs": [
            { "type": "uint256" }
          ]
        }
      ]
    }
  },
  methods: {
    async connectWallet() {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' })
          this.provider = new ethers.providers.Web3Provider(window.ethereum)
          this.signer = this.provider.getSigner()
          this.contract = new ethers.Contract(this.contractAddress, this.abi, this.signer)
          await this.checkNetwork()
          await this.updateBalances()
        } catch (err) {
          this.error = 'Failed to connect wallet: ' + err.message
        }
      } else {
        this.error = 'Please install MetaMask!'
      }
    },
    async checkNetwork() {
      const network = await this.provider.getNetwork()
      if (network.chainId !== this.chainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x' + this.chainId.toString(16) }],
          })
        } catch (err) {
          this.error = 'Please switch to the Ethereum mainnet'
          throw new Error('Incorrect network')
        }
      }
    },
    async updateBalances() {
      const address = await this.signer.getAddress()
      const ethBalance = await this.provider.getBalance(address)
      this.ethBalance = ethers.utils.formatEther(ethBalance)
      const wethBalance = await this.contract.balanceOf(address)
      this.wethBalance = ethers.utils.formatEther(wethBalance)
    },
    async wrapEth() {
      this.error = ''
      this.success = ''
      if (!this.signer) {
        await this.connectWallet()
      }
      try {
        await this.checkNetwork()
        const amountWei = ethers.utils.parseEther(this.amount)
        const tx = await this.contract.deposit({ value: amountWei })
        await tx.wait()
        this.success = `Successfully wrapped ${this.amount} ETH to WETH!`
        await this.updateBalances()
        this.amount = ''
      } catch (err) {
        this.error = 'Failed to wrap ETH: ' + err.message
      }
    }
  },
  mounted() {
    this.connectWallet()
  }
}
</script>
