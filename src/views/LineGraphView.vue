<template>
    <main>
        <div class="chats_container">
            <div class="img_container">
                <BaseImage :src="imageSrc" :alt="`Logo img`"
                    :style="{ height: 'auto', width: '150px', border: 'none', marginTop: '2dvh' }" />
            </div>
            <div class="line_graphs_container">
                <div class="chart_container">
                    <ChartComponent :chartData="dataForTopGraph" :chartOptions="topGraphOptions" />
                </div>
                <div class="chart_container">
                    <ChartComponent :chartData="dataForBottomGraph" :chartOptions="bottomGraphOptions" />
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref } from 'vue';

import ChartComponent from '@/components/ChartComponent.vue';
import { postMethod } from '@/api/fastapi.js/postRequests';
import { onMounted } from 'vue';
import { getIpadData } from '@/api/fastapi.js/getObjectsRequests';
import { createChartData, createChartOptions } from '@/methods/chartConfig';

import BaseImage from '@/components/images/BaseImage.vue';

const imageSrc = new URL('@/assets/images/500Logo.png', import.meta.url).href;

const xData = ref([]);
const topGraphY = ref([]);
const bottomGraphY = ref([]);

const maxTopGraphY = ref(0);
const maxBottomGraphY = ref(0);
const minTopGraphY = ref(0);
const minBottomGraphY = ref(0);

const props = defineProps({
    swaidId: {
        type: String,
        required: true
    }
});

maxTopGraphY.value = Math.max(...topGraphY.value);
minTopGraphY.value = Math.min(...topGraphY.value);

const topGraphOptions = createChartOptions('ПУЛЬС');
const bottomGraphOptions = createChartOptions('СТРЕСС');
const dataForTopGraph = createChartData('#FF1A88');
const dataForBottomGraph = createChartData('#FF1A88');

const startMethodPost = () => {
    postMethod().then(response => {
        console.log('Response:', response.data);
    }).catch(error => {
        console.error('Error:', error);
    });
};

const fetchIpadData = async () => {
    try {
        const response = await getIpadData(props.swaidId);
        const ipadData = response.data[props.swaidId]
        return ipadData
    } catch (error) {
        console.error('Error fetching iPad data:', error);
    }
};

async function updateChartData() {
    const fetchedData = await fetchIpadData();

    if (fetchedData) {
        // Обновляем реактивные переменные
        xData.value = fetchedData.x || [];
        topGraphY.value = fetchedData.hr || [];
        bottomGraphY.value = fetchedData.si || [];
    } else {
        console.warn("Failed to fetch iPad data.");
    }

    if (fetchedData) {
        // Обновляем данные для графиков
        dataForTopGraph.labels = xData.value;
        dataForTopGraph.datasets[0].data = topGraphY.value;

        dataForBottomGraph.labels = xData.value;
        dataForBottomGraph.datasets[0].data = bottomGraphY.value;
    }
};

onMounted(async () => {
    //   startMethodPost();
    updateChartData();
    setInterval(async () => {
        updateChartData();
    }, 15 * 1000);

    //   setInterval(async () => {
    //     startMethodPost();
    //   }, 150 * 1000); 
});
</script>

<style scoped>
.chats_container {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding-top: 5%;
    gap: 25px;
}

.line_graphs_container {
    display: flex;
    flex-direction: column;
    gap: 40px;
    width: 95%;
    height: 80%;
    padding: 20px 30px;
    border-radius: 30px;
    background: linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05));
    border: 1px solid rgb(255 255 255 / 30%);
    backdrop-filter: blur(10px);
    transform: translateY(5%);
}

.chart_container {
    background: linear-gradient(to bottom, #a7b2c642 0%, #606a815c 100%);
    border-radius: 30px;
    height: 48%;
    padding: 20px 30px;
    display: flex;
    justify-content: center;
}

.img_container {
    width: 95%;
}
</style>