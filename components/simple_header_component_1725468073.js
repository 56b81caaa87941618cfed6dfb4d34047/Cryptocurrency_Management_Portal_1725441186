<!-- 
INSTRUCTION: Summary: The header component is a nav bar on top of the page -- it contains the app's logo and name in a big, bold font, to the left. In the middle there are 4 text items each hyperlinked.
-->

<template>
    <div id="sheep-counter" class="flex flex-col items-center justify-center h-screen bg-blue-100">
        <h1 class="text-4xl font-bold mb-4">Sheep Counter</h1>
        <p class="text-2xl mb-4">{{ sheepCount }} sheep</p>
        <button @click="incrementSheep" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Count Sheep
        </button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            sheepCount: 0
        };
    },
    methods: {
        incrementSheep() {
            this.sheepCount++;
        }
    }
};
</script>
