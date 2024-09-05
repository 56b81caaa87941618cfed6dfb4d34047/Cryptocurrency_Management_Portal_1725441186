<!-- 
INSTRUCTION: Summary: The header component is a nav bar on top of the page -- it contains the app's logo and name in a big, bold font, to the left. In the middle there are 4 text items each hyperlinked.
-->

<template>
    <div id="sheep-counter" style="min-height: 670px"  class="flex flex-col items-center justify-center h-screen bg-purple-100">
        <h1 class="text-4xl font-bold mb-4">Number Counter</h1>
        <p class="text-2xl mb-4">{{ count }}</p>
        <button @click="incrementCount" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
            Count
        </button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            count: 0
        };
    },
    methods: {
        incrementCount() {
            this.count++;
        }
    }
};
</script>
