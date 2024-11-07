<template>
    <main>
        <div class="chats_container">
            <div class="img_container">
                <BaseImage :src="imageSrc" :alt="`Logo img`"
                    :style="{ height: 'auto', width: '150px', border: 'none', marginTop: '2dvh' }" />
            </div>
            <div class="line_graphs_container">
                <div class="chart_container">
                    <ChartComponent :chartData="dataForBottomGraph" :chartOptions="bottomGraphOptions" />
                    <p class="two_minutes"> 2 мин </p>
                </div>
                <!-- <div class="chart_container">
                    <ChartComponent :chartData="dataForTopGraph" :chartOptions="topGraphOptions" />
                </div> -->
            </div>
        </div>
        <font-awesome-icon :icon="['fas', 'circle-question']" class="fa_circle_question" @click="showPopup = true" />

        <div v-if="showPopup" class="popup_overlay" @click.self="showPopup = false">
            <div class="popup_content">
                <div class="img_container full_image">
                    <BaseImage :src="imageBracerSrc" :alt="`Logo img`" />
                </div>
                <!-- <div class="button-container">
                    <button @click="showPopup = false">Закрыть</button>
                </div> -->
                <font-awesome-icon :icon="['fas', 'circle-xmark']" class="fa_circle_question"
                    @click="showPopup = false" />
            </div>
        </div>
    </main>
</template>

<script setup>
import { ref } from 'vue';

import ChartComponent from '@/components/ChartComponent.vue';
import { postMethod } from '@/api/fastapi.js/postRequests';
import { onMounted, onUnmounted } from 'vue';
import { getIpadData } from '@/api/fastapi.js/getObjectsRequests';
import { createChartData, createChartOptions } from '@/methods/chartConfig';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import BaseImage from '@/components/images/BaseImage.vue';

const imageSrc = new URL('@/assets/images/500Logo.png', import.meta.url).href;
const imageBracerSrc = new URL('@/assets/images/Bracer_info.png', import.meta.url).href;

const showPopup = ref(false);

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

const topGraphOptions = createChartOptions('ПУЛЬС', 0, 160);
const bottomGraphOptions = createChartOptions('ИНДЕКС ЭМОЦИЙ', 0, 1000, 200);
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
        const ipadData = response.data[props.swaidId];
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


// onUnmounted(() => {
//     clearInterval(intervalId);
// });

</script>

<style scoped>
.chats_container {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding-top: 5%;
    gap: 70px;
}

.line_graphs_container {
    display: flex;
    flex-direction: column;
    gap: 40px;
    width: 95%;
    height: 65%;
    padding: 35px 35px;
    border-radius: 30px;
    background: linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05));
    border: 1px solid rgb(255 255 255 / 30%);
    backdrop-filter: blur(10px);
    transform: translateY(5%);
}

.chart_container {
    background: linear-gradient(to bottom, #a7b2c642 0%, #606a815c 100%);
    border-radius: 30px;
    /* height: 48%; */
    height: 100%;
    padding: 20px 30px;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-wrap: wrap;
}

.img_container {
    width: 95%;
}

.fa_circle_question {
    font-size: 40px;
    color: #FFFF;
    position: absolute;
    bottom: 20px;
    right: 20px;
}

.popup_overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.popup_content {
    background: #ffffff;
    border-radius: 8px;
    width: 80%;
    height: auto;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.popup_content h3 {
    margin-top: 0;
}

.button-container {
    width: 100%;
    display: flex;
    justify-content: center;
}

.popup_content button {
    margin-top: 25px;
    padding: 8px 16px;
    border: none;
    min-width: 15%;
    background-color: #FF1A88;
    color: #ffffff;
    border-radius: 4px;
    cursor: pointer;
}

.popup_content h3 {
    font-size: 24px;
    text-align: center;
}

.popup_content p {
    font-size: 18px;
    margin-top: 20px;
}

.img_container.full_image {
    width: 100%;
    height: auto;
    /* Высота будет автоматически подстраиваться под ширину */
    display: flex;
    justify-content: center;
    align-items: center;
}

.img_container.full_image img {
    width: 100%;
    /* Занимает всю ширину контейнера */
    height: auto;
    /* Высота подстраивается для сохранения пропорций */
    object-fit: contain;
    /* Контейнер сохраняет пропорции изображения */
}

.two_minutes {
    position: absolute;
    right: 68px;
    bottom: 122px;
    font-size: 18px;
    color: #ffffff;
}
</style>