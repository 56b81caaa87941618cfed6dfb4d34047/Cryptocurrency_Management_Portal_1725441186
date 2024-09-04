
<template>
  <div class="container mx-auto p-4 bg-opacity-20 bg-white backdrop-filter backdrop-blur-lg rounded-lg shadow-lg">
    <h1 class="text-3xl font-bold mb-4 text-blue-500">WETH Wrapper</h1>
    <div class="mb-4">
      <p class="text-lg text-blue-300">ETH Balance: {{ ethBalance }} ETH</p>
      <p class="text-lg text-blue-300">WETH Balance: {{ wethBalance }} WETH</p>
    </div>
    <div class="mb-4">
      <input
        v-model="amount"
        type="number"
        step="0.01"
        min="0"
        placeholder="Amount of ETH to wrap"
        class="w-full p-2 rounded-lg bg-opacity-20 bg-white backdrop-filter backdrop-blur-lg border border-blue-300 text-blue-500"
      />
    </div>
    <button
      @click="wrapEth"
      class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
      :disabled="isLoading"
    >
      {{ isLoading ? 'Processing...' : 'Wrap ETH' }}
    </button>
  </div>
</template>

<script>
import { ethers } from 'ethers'

const contractAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
const contractABI = [
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

export default {
  name: 'WETHWrapper',
  data() {
    return {
      amount: '',
      ethBalance: '0',
      wethBalance: '0',
      isLoading: false,
    }
  },
  methods: {
    async connectWallet() {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' })
          this.provider = new ethers.providers.Web3Provider(window.ethereum)
          this.signer = this.provider.getSigner()
          this.contract = new ethers.Contract(contractAddress, contractABI, this.signer)
          await this.checkNetwork()
          await this.updateBalances()
        } catch (error) {
          console.error('Failed to connect wallet:', error)
        }
      } else {
        console.error('MetaMask is not installed')
      }
    },
    async checkNetwork() {
      const network = await this.provider.getNetwork()
      if (network.chainId !== 1) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1' }],
          })
        } catch (error) {
          console.error('Failed to switch network:', error)
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
      if (!this.signer) {
        await this.connectWallet()
      }
      await this.checkNetwork()

      if (!this.amount || this.amount <= 0) {
        console.error('Invalid amount')
        return
      }

      this.isLoading = true
      try {
        const tx = await this.contract.deposit({
          value: ethers.utils.parseEther(this.amount.toString())
        })
        await tx.wait()
        await this.updateBalances()
        this.amount = ''
      } catch (error) {
        console.error('Error wrapping ETH:', error)
      } finally {
        this.isLoading = false
      }
    },
  },
  mounted() {
    this.connectWallet()
  },
}
</script>
