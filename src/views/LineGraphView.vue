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
                </div>
                <div class="chart_container">
                    <ChartComponent :chartData="dataForTopGraph" :chartOptions="topGraphOptions" />
                </div>
            </div>
        </div>
        <font-awesome-icon :icon="['fas', 'circle-question']" class="fa_circle_question" @click="showPopup = true" />

        <div v-if="showPopup" class="popup_overlay" @click.self="showPopup = false">
            <div class="popup_content">
                <h3>Информация</h3>
                <p>
                    Браслет, который сейчас находится на Вас, измеряет ритм сердцебиения и
                    может не только считать количество ударов в минуту, но и отслеживать даже
                    небольшие колебания между ударами сердца. На основе этих данных браслет
                    оценивает уровень стресса по индексу Баевского.
                </p>
                <br>
                <p>
                    <strong>Индекс Баевского</strong> (иногда также называемый индексом напряжения,
                    стресс-индикатором или, как мы его назвали, <strong>Индексом эмоций</strong>) – это показатель,
                    разработанный Романом Марковичем Баевским, российским ученым в области биофизики.
                    Этот показатель помогает оценить эмоциональное состояние организма,
                    анализируя вариабельность сердечного ритма, то есть изменения интервалов
                    между ударами сердца, которые отражают активность вегетативной нервной системы.

                </p>
                <br>
                <p>Индекс Баевского измеряется в условных единицах и его значения можно интерпретировать по шкале:</p>

                <ul>
                    <li><strong>
                            0-150 единиц</strong> – нормальное состояние, низкий уровень стресса.
                    </li>
                    <li>
                        <strong>150-500 единиц</strong> – психоэмоциональное напряжение,
                        свидетельствует о повышенной активности симпатической нервной системы.
                    </li>
                    <li>
                        <strong>Более 500 единиц</strong> – существенное повышение уровня стресса,
                        указывает на высокое напряжение в организме.
                    </li>
                </ul>

                <p>У каждого человека свой уровень состояния эмоционального спокойствия,
                    но обычно он находится в пределах от 0 до 150 единиц. Однако резкие
                    пики на графике могут указывать на временное повышенное эмоциональное напряжение.
                    Эти пики отражают моменты эмоциональных всплесков, заинтересованности,
                    ожидания, удивления или, наоборот, несогласия и сопротивления.
                    Современные технологии пока не способны определять, была ли эмоция положительной
                    или отрицательной – наука ещё не дошла до этого. В рамках нашего мероприятия
                    подобные эмоциональные всплески помогут идентифицировать, оставил ли питч стартапа
                    Вас в спокойном состоянии или вызвал всплеск эмоций в ту или иную сторону.
                </p>
                <div class="button-container">
                    <button @click="showPopup = false">Закрыть</button>
                </div>
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
    gap: 25px;
}

.line_graphs_container {
    display: flex;
    flex-direction: column;
    gap: 40px;
    width: 95%;
    height: 78%;
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
    height: 48%;
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
    padding: 20px;
    border-radius: 8px;
    width: 80%;
    max-width: 80%;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    text-align: left;
    display: flex;
    flex-direction: column;
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
</style>