<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { circlesDataGeneration } from '@/store/data_generation';
import { distributeRows } from '@/methods/CircleDataProcess';

import { checkUpdateScreen, checkUpdateTranslation, getCirclesData } from '@/api/fastapi.js/getObjectsRequests';
import CircleComponent from '@/components/CircleComponent.vue';

import BaseImage from '@/components/images/BaseImage.vue';

const imageSrc = new URL('@/assets/images/500Logo.png', import.meta.url).href;

const colorsOfCircles = ['#9001FE', '#063AF3', '#FF036D', '#0BEDDA', '#5201A7', '#FF036D', '#0BEDDA', '#063AF3', '#9001FE', '#DF0367'];

const svgGraphSize = 284;

const numCircles = ref(7);

const userData = ref({});
const upperRow = ref([]);
const lowerRow = ref([]);

const upperColors = ref([]);
const lowerColors = ref([]);

const checkUpdateStatus = async () => {
    try {
        const response = await checkUpdateScreen();
        console.log(response.data);
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};


const fetchData = async () => {
    try {
        const response = await getCirclesData();
        userData.value = response.data
        // userData.value = circlesDataGeneration(numCircles.value);
        const rows = distributeRows(userData.value, colorsOfCircles);
        console.log('User data fetched.');
        upperRow.value = rows.upperRow;
        upperColors.value = rows.upperColor;
        lowerRow.value = rows.lowerRow;
        lowerColors.value = rows.lowerColor;
        return response
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};


onMounted(async () => {
    fetchData();

    setInterval(async () => {
        const updateStatus = await checkUpdateTranslation();
        console.log(updateStatus);
        if (updateStatus.data === 1) {
            fetchData();
        }
    }, 5 * 1000);
});
// onUnmounted(() => {
//   clearInterval(intervalId);
// });

</script>

<template>
    <main>
        <div class="img_container" @click="fetchData">
            <BaseImage :src="imageSrc" :alt="`Logo img`" :style="{ height: 'auto', width: '240px', border: 'none' }" />
        </div>
        <div class="rows_container">
            <div class="rows">
                <div class="upper_row">
                    <div v-for="(value, key, index) in upperRow" :key="key">
                        <CircleComponent :judgeNumber="value.name" :value="value.average_si" :size="svgGraphSize"
                            :color="upperColors[index]" />
                    </div>
                </div>
                <div class="lower_row">
                    <div v-for="(value, key, index) in lowerRow" :key="key">
                        <CircleComponent :judgeNumber="value.name" :value="value.average_si" :size="svgGraphSize"
                            :color="lowerColors[index]" />
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
.rows_container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.rows {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.upper_row,
.lower_row {
    display: flex;
    flex-direction: row;
    gap: 24px;
    justify-content: center;
}


.img_container {
    position: absolute;
    top: 64px;
    left: 64px;
}
</style>
