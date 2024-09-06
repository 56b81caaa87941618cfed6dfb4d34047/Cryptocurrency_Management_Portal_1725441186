
<template>
<div class="container mx-auto p-8">
<div class="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-6 border border-white border-opacity-20">
<h1 class="text-3xl font-bold mb-6 text-purple-400">WETH Wrapper</h1>
<div class="mb-4">
<p class="text-white mb-2">ETH Balance: {{ ethBalance }} ETH</p>
<p class="text-white mb-4">WETH Balance: {{ wethBalance }} WETH</p>
</div>
<div class="mb-6">
<input class="w-full p-2 rounded bg-gray-800 text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600" min="0" placeholder="Amount of ETH to wrap" step="0.000000000000000001" type="number" v-model="amount"/>
</div>
<button @click="wrapEth" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition hover:scale-105">
        Wrap ETH
      </button>
</div>
</div>
</template>
<script>
import { ethers } from 'ethers'

export default {
  name: 'WethWrapper',
  data() {
    return {
      amount: '',
      ethBalance: '0',
      wethBalance: '0',
      contract: null,
      signer: null,
      provider: null,
    }
  },
  methods: {
    async connectWallet() {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' })
          this.provider = new ethers.providers.Web3Provider(window.ethereum)
          this.signer = this.provider.getSigner()
          
          const network = await this.provider.getNetwork()
          if (network.chainId !== 1) {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x1' }],
            })
          }
          
          this.initContract()
          this.updateBalances()
        } catch (error) {
          console.error('Failed to connect wallet:', error)
        }
      } else {
        console.error('MetaMask is not installed')
      }
    },
    initContract() {
      const contractAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
      const abi = [
        {
          "name": "deposit",
          "stateMutability": "payable",
          "inputs": [],
          "outputs": []
        },
        {
          "name": "balanceOf",
          "stateMutability": "view",
          "inputs": [{"type": "address"}],
          "outputs": [{"type": "uint256"}]
        }
      ]
      this.contract = new ethers.Contract(contractAddress, abi, this.signer)
    },
    async updateBalances() {
      const address = await this.signer.getAddress()
      const ethBalance = await this.provider.getBalance(address)
      this.ethBalance = ethers.utils.formatEther(ethBalance)
      
      const wethBalance = await this.contract.balanceOf(address)
      this.wethBalance = ethers.utils.formatEther(wethBalance)
    },
    async wrapEth() {
      if (!this.signer) {
        await this.connectWallet()
      }
      
      try {
        const amountWei = ethers.utils.parseEther(this.amount)
        const tx = await this.contract.deposit({ value: amountWei })
        await tx.wait()
        this.updateBalances()
        this.amount = ''
      } catch (error) {
        console.error('Error wrapping ETH:', error)
      }
    }
  },
  mounted() {
    this.connectWallet()
  }
}
</script>
