
<template>
<div class="container mx-auto p-8 bg-opacity-20 bg-white backdrop-filter backdrop-blur-lg rounded-xl shadow-lg max-w-md">
<h1 class="text-3xl font-bold mb-6 text-green-400">Wrap ETH to WETH</h1>
<div class="mb-4">
<label class="block text-sm font-medium text-green-300 mb-2" for="ethAmount">Amount of ETH to wrap</label>
<input class="w-full px-3 py-2 bg-opacity-20 bg-white backdrop-filter backdrop-blur-sm rounded-md border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-green-100" id="ethAmount" min="0" placeholder="Enter ETH amount" step="0.01" type="number" v-model="ethAmount"/>
</div>
<button @click="wrapEth" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
      Wrap ETH
    </button>
<div class="mt-6 p-4 bg-opacity-30 bg-green-900 rounded-md">
<p class="text-green-300">Your WETH Balance: {{ wethBalance }} WETH</p>
</div>
</div>
</template>
<script>
import { ethers } from 'ethers'

export default {
  name: 'WrapEthComponent',
  data() {
    return {
      ethAmount: '',
      wethBalance: '0',
      contract: null,
      signer: null,
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
              "name": "balance",
              "type": "uint256"
            }
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
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          this.signer = provider.getSigner()
          this.contract = new ethers.Contract(this.contractAddress, this.abi, this.signer)
          this.updateBalance()
        } catch (error) {
          console.error('Failed to connect wallet:', error)
        }
      } else {
        console.error('MetaMask is not installed')
      }
    },
    async checkNetwork() {
      if (this.signer) {
        const network = await this.signer.provider.getNetwork()
        if (network.chainId !== this.chainId) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: ethers.utils.hexValue(this.chainId) }],
            })
          } catch (error) {
            console.error('Failed to switch network:', error)
          }
        }
      }
    },
    async wrapEth() {
      if (!this.signer) {
        await this.connectWallet()
      }
      await this.checkNetwork()

      if (this.contract && this.ethAmount) {
        try {
          const tx = await this.contract.deposit({
            value: ethers.utils.parseEther(this.ethAmount)
          })
          await tx.wait()
          this.updateBalance()
          this.ethAmount = ''
        } catch (error) {
          console.error('Error wrapping ETH:', error)
        }
      }
    },
    async updateBalance() {
      if (this.contract && this.signer) {
        try {
          const address = await this.signer.getAddress()
          const balance = await this.contract.balanceOf(address)
          this.wethBalance = ethers.utils.formatEther(balance)
        } catch (error) {
          console.error('Error fetching WETH balance:', error)
        }
      }
    }
  },
  mounted() {
    this.connectWallet()
  }
}
</script>
