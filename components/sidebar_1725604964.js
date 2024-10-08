<template>
  <nav class="fixed top-0 left-0 w-fit h-full bg-gray-100 space-y-8 sm:w-80 pt-10 text-black z-20">
    <div class="flex flex-col h-full">
      <div class="flex-1 flex flex-col h-full overflow-auto">
        <ul class="px-4 text-sm font-medium flex-1">
          <template v-for="(item, idx) in navigation" :key="idx">
            <li>
              <a :href="item.href" class="flex items-center gap-x-2 text-white-600 p-5 rounded-lg hover:bg-black hover:text-white active:bg-gray-100 w-fit duration-150">
                <div class="text-white-500" v-html="item.icon"></div>
                <span> {{ item.name }} </span>
              </a>
            </li>
          </template>
        </ul>
        <div>
          <ul class="px-4 pb-4 text-sm font-medium">
            <template v-for="(item, idx) in navsFooter" :key="idx">
              <li>
                <a :href="item.href" class="flex items-center gap-x-2 text-white-600 p-2 rounded-lg hover:bg-black hover:text-white active:bg-gray-100 w-fit duration-150">
                  <div class="text-white-500" v-html="item.icon"></div>
                  <span class="p-5"> {{ item.name }}</span>
                </a>
              </li>
            </template>
          </ul>
          <div class="py-4 px-4 w-fit border-t border-black">
            <div class="flex items-center gap-x-4">
              <div>
                <span class="block text-white-700 text-sm font-semibold">Manage Your Crypto</span>
                <a href="javascript:void(0)" class="block mt-px text-white-600 text-xs">Track, trade, and grow your digital assets</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
  
  <!-- Wrap ETH Component -->
  <div class="fixed bottom-4 right-4 bg-green-100 p-6 rounded-lg shadow-lg w-80">
    <h2 class="text-2xl font-bold text-green-800 mb-4">Wrap ETH</h2>
    <div class="mb-4">
      <label for="ethAmount" class="block text-sm font-medium text-green-700">ETH Amount</label>
      <input type="number" id="ethAmount" v-model="ethAmount" class="mt-1 block w-full rounded-md border-green-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50" placeholder="0.0">
    </div>
    <button @click="wrapEth" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
      Wrap ETH
    </button>
    <div v-if="transactionStatus" :class="['mt-4 p-2 rounded', transactionStatus === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800']">
      {{ transactionStatus === 'success' ? 'Transaction Successful!' : 'Transaction Failed' }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      navigation: [
        {
          href: 'javascript:void(0)',
          name: 'Dashboard',
          icon:
            `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' class='w-5 h-5'>
              <path stroke-linecap='round' stroke-linejoin='round' d='M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122' />
            </svg>`
        },
        {
          href: 'javascript:void(0)',
          name: 'Portfolio',
          icon:
            `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' class='w-5 h-5'>
              <path stroke-linecap='round' stroke-linejoin='round' d='M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z' />
            </svg>`
        },
        {
          href: 'javascript:void(0)',
          name: 'Transactions',
          icon:
            `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' class='w-5 h-5'>
              <path stroke-linecap='round' stroke-linejoin='round' d='M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' />
            </svg>`
        },
        {
          href: 'javascript:void(0)',
          name: 'Market',
          icon:
            `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' class='w-5 h-5'>
              <path stroke-linecap='round' stroke-linejoin='round' d='M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3' />
            </svg>`
        }
      ],
      navsFooter: [
        {
          href: 'javascript:void(0)',
          name: 'Settings',
          icon:
            `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' class='w-5 h-5'>
              <path stroke-linecap='round' stroke-linejoin='round' d='M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z' />
            </svg>`
        },
        {
          href: 'javascript:void(0)',
          name: 'Support',
          icon:
            `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' class='w-5 h-5'>
              <path stroke-linecap='round' stroke-linejoin='round' d='M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z' />
              <path stroke-linecap='round' stroke-linejoin='round' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
            </svg>`
        },
        {
          href: 'javascript:void(0)',
          name: 'Logout',
          icon:
            `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' class='w-5 h-5'>
              <path stroke-linecap='round' stroke-linejoin='round' d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9' />
            </svg>`
        }
      ]
    };
  },
  data() {
    return {
      ethAmount: '',
      transactionStatus: null
    }
  },
  methods: {
    // Wrap ETH method
    async wrapEth() {
      // Implement the wrapping logic here
      // This is a placeholder for the actual implementation
      try {
        // Simulating a transaction
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.transactionStatus = 'success';
      } catch (error) {
        this.transactionStatus = 'failed';
      }
    }
    // End of Wrap ETH method
  }
};
</script>

<style scoped>
/* Add any additional styles here */
</style>
</script>
