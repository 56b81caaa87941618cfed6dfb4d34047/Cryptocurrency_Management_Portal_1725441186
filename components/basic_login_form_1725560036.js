
<template>
<div class="min-h-screen bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center p-4">
<div class="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg p-8 max-w-2xl w-full">
<h1 class="text-4xl font-bold text-green-100 mb-6 text-center">WETH9 Interaction</h1>
<!-- Token Info Section -->
<div class="mb-8 p-4 bg-green-500 bg-opacity-20 rounded-lg">
<h2 class="text-2xl font-semibold text-green-100 mb-4">Token Info</h2>
<p class="text-green-100">Name: {{ tokenName }}</p>
<p class="text-green-100">Symbol: {{ tokenSymbol }}</p>
<p class="text-green-100">Total Supply: {{ totalSupply }}</p>
<p class="text-green-100">Decimals: {{ tokenDecimals }}</p>
</div>
<!-- Balance and Allowance Section -->
<div class="mb-8 p-4 bg-green-500 bg-opacity-20 rounded-lg">
<h2 class="text-2xl font-semibold text-green-100 mb-4">Balance and Allowance</h2>
<input class="w-full p-2 mb-2 bg-green-100 bg-opacity-20 rounded text-green-100 placeholder-green-200" placeholder="Enter address" v-model="addressToCheck"/>
<button @click="checkBalance" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-2">Check Balance</button>
<p class="text-green-100" v-if="balance !== null">Balance: {{ balance }} WETH</p>
<input class="w-full p-2 mt-4 mb-2 bg-green-100 bg-opacity-20 rounded text-green-100 placeholder-green-200" placeholder="Enter spender address" v-model="spenderAddress"/>
<button @click="checkAllowance" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-2">Check Allowance</button>
<p class="text-green-100" v-if="allowanceAmount !== null">Allowance: {{ allowanceAmount }} WETH</p>
</div>
<!-- Deposit Section -->
<div class="mb-8 p-4 bg-green-500 bg-opacity-20 rounded-lg">
<h2 class="text-2xl font-semibold text-green-100 mb-4">Deposit ETH</h2>
<input class="w-full p-2 mb-2 bg-green-100 bg-opacity-20 rounded text-green-100 placeholder-green-200" placeholder="Amount in ETH" step="0.01" type="number" v-model="depositAmount"/>
<button @click="deposit" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Deposit</button>
</div>
<!-- Withdraw Section -->
<div class="mb-8 p-4 bg-green-500 bg-opacity-20 rounded-lg">
<h2 class="text-2xl font-semibold text-green-100 mb-4">Withdraw ETH</h2>
<input class="w-full p-2 mb-2 bg-green-100 bg-opacity-20 rounded text-green-100 placeholder-green-200" placeholder="Amount in WETH" step="0.01" type="number" v-model="withdrawAmount"/>
<button @click="withdraw" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Withdraw</button>
</div>
<!-- Transfer Section -->
<div class="mb-8 p-4 bg-green-500 bg-opacity-20 rounded-lg">
<h2 class="text-2xl font-semibold text-green-100 mb-4">Transfer WETH</h2>
<input class="w-full p-2 mb-2 bg-green-100 bg-opacity-20 rounded text-green-100 placeholder-green-200" placeholder="Recipient address" v-model="transferTo"/>
<input class="w-full p-2 mb-2 bg-green-100 bg-opacity-20 rounded text-green-100 placeholder-green-200" placeholder="Amount in WETH" step="0.01" type="number" v-model="transferAmount"/>
<button @click="transfer" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Transfer</button>
</div>
<!-- Approve Section -->
<div class="mb-8 p-4 bg-green-500 bg-opacity-20 rounded-lg">
<h2 class="text-2xl font-semibold text-green-100 mb-4">Approve WETH Spending</h2>
<input class="w-full p-2 mb-2 bg-green-100 bg-opacity-20 rounded text-green-100 placeholder-green-200" placeholder="Spender address" v-model="approveAddress"/>
<input class="w-full p-2 mb-2 bg-green-100 bg-opacity-20 rounded text-green-100 placeholder-green-200" placeholder="Amount in WETH" step="0.01" type="number" v-model="approveAmount"/>
<button @click="approve" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Approve</button>
</div>
</div>
</div>
</template>
<script>
import { ethers } from 'ethers';

export default {
  name: 'WETH9Interaction',
  data() {
    return {
      contract: null,
      tokenName: '',
      tokenSymbol: '',
      totalSupply: '',
      tokenDecimals: '',
      addressToCheck: '',
      balance: null,
      spenderAddress: '',
      allowanceAmount: null,
      depositAmount: '',
      withdrawAmount: '',
      transferTo: '',
      transferAmount: '',
      approveAddress: '',
      approveAmount: '',
    };
  },
  methods: {
    async connectWallet() {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const network = await provider.getNetwork();
          if (network.chainId !== 1) {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x1' }],
            });
          }
          const signer = provider.getSigner();
          this.contract = new ethers.Contract(
            '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            [
              "function name() view returns (string)",
              "function symbol() view returns (string)",
              "function totalSupply() view returns (uint256)",
              "function decimals() view returns (uint8)",
              "function balanceOf(address) view returns (uint256)",
              "function allowance(address,address) view returns (uint256)",
              "function deposit() payable",
              "function withdraw(uint256)",
              "function transfer(address,uint256) returns (bool)",
              "function approve(address,uint256) returns (bool)"
            ],
            signer
          );
          await this.updateTokenInfo();
        } catch (error) {
          console.error('Failed to connect wallet:', error);
        }
      } else {
        console.error('MetaMask is not installed');
      }
    },
    async updateTokenInfo() {
      this.tokenName = await this.contract.name();
      this.tokenSymbol = await this.contract.symbol();
      this.totalSupply = ethers.utils.formatEther(await this.contract.totalSupply());
      this.tokenDecimals = await this.contract.decimals();
    },
    async checkBalance() {
      if (!this.contract) await this.connectWallet();
      try {
        const balance = await this.contract.balanceOf(this.addressToCheck);
        this.balance = ethers.utils.formatEther(balance);
      } catch (error) {
        console.error('Error checking balance:', error);
      }
    },
    async checkAllowance() {
      if (!this.contract) await this.connectWallet();
      try {
        const allowance = await this.contract.allowance(this.addressToCheck, this.spenderAddress);
        this.allowanceAmount = ethers.utils.formatEther(allowance);
      } catch (error) {
        console.error('Error checking allowance:', error);
      }
    },
    async deposit() {
      if (!this.contract) await this.connectWallet();
      try {
        const tx = await this.contract.deposit({ value: ethers.utils.parseEther(this.depositAmount) });
        await tx.wait();
        console.log('Deposit successful');
      } catch (error) {
        console.error('Error depositing:', error);
      }
    },
    async withdraw() {
      if (!this.contract) await this.connectWallet();
      try {
        const tx = await this.contract.withdraw(ethers.utils.parseEther(this.withdrawAmount));
        await tx.wait();
        console.log('Withdrawal successful');
      } catch (error) {
        console.error('Error withdrawing:', error);
      }
    },
    async transfer() {
      if (!this.contract) await this.connectWallet();
      try {
        const tx = await this.contract.transfer(this.transferTo, ethers.utils.parseEther(this.transferAmount));
        await tx.wait();
        console.log('Transfer successful');
      } catch (error) {
        console.error('Error transferring:', error);
      }
    },
    async approve() {
      if (!this.contract) await this.connectWallet();
      try {
        const tx = await this.contract.approve(this.approveAddress, ethers.utils.parseEther(this.approveAmount));
        await tx.wait();
        console.log('Approval successful');
      } catch (error) {
        console.error('Error approving:', error);
      }
    },
  },
  mounted() {
    this.connectWallet();
  },
};
</script>
