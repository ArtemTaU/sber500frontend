<script setup>
import { computed } from 'vue';

const props = defineProps({
    judgeNumber: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        default: 'red'
    },
    size: {
        type: Number,
    }
});

const colorRanges = [
    { min: 0, max: 250, color: 'green' },
    { min: 251, max: 500, color: 'blue' },
    { min: 501, max: 750, color: 'purple' },
    { min: 751, max: 1000, color: 'red' }
];

const getColor = computed(() => {
    const range = colorRanges.find(r => props.value >= r.min && props.value <= r.max);
    return range ? range.color : 'gray';
});

const getColorRGB = computed(() => {
    switch (getColor.value) {
        case 'green': return '0, 128, 0';
        case 'blue': return '0, 0, 255';
        case 'purple': return '128, 0, 128';
        case 'red': return '255, 0, 0';
        default: return '128, 128, 128'; // Серый цвет по умолчанию
    }
});

</script>

<template>
    <div class="circle_container">
        <div class="main_circle" :style="{
            height: `${size}px`,
            width: `${size}px`,
            borderColor: getColor, /* Устанавливаем цвет для границы */
            boxShadow: `0 0 30px 15px rgba(${getColorRGB}, 0.5),
                        0 0 60px 30px rgba(${getColorRGB}, 0.3),
                        0 0 90px 45px rgba(${getColorRGB}, 0.1)`
        }">
            <p class="pulse_value">
                {{ Math.round(value) }}
            </p>
            <div class="judge_number_container">
                <p class="judge_number">
                    #{{ judgeNumber }}
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.circle_container {
    padding: 20px;
}

.main_circle {
    border-radius: 50%;
    border-width: 10px;
    border-style: solid;
    position: relative;
}

.pulse_value {
    font-size: 100px;
    color: aliceblue;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-55%);
}

.judge_number_container {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-60%);
    min-width: 100px;
    padding: 0px 15px;
    border-radius: 8px;
    border: 2px solid rgba(255, 255, 255, 0.853);
    display: flex;
    justify-content: center;
    background-color: transparent;
    overflow: hidden;
}

.judge_number_container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(116, 116, 116, 0.6);
    transform: scale(1.1);
    filter: blur(1px);
    z-index: -1;
    border-radius: 8px;
}


.judge_number {
    font-size: 30px;
    color: aliceblue;
    position: relative;
    z-index: 1;
}
</style>
