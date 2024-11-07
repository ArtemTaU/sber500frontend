<script setup>
import { computed, ref } from 'vue';

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
        default: 300
    }
});

const pulseValueFont = ref(Math.round(props.size * 0.254));
const judgeNumberFont = ref(Math.round(props.size / 10));
const circleBorderWidth = ref(Math.round(props.size / 35));
const judgeContainerMinWidth = ref(Math.round(props.size / 3));

const colorRanges = [
    { min: 0, max: 150, color: 'white', frequency: 2000, opacity: 0.1 },
    { min: 151, max: 350, color: 'blue', frequency: 1000, opacity: 0.4 },
    { min: 351, max: 1000, color: 'purple', frequency: 500, opacity: 0.7 },
];

const getColor = computed(() => {
    const range = colorRanges.find(r => props.value >= r.min && props.value <= r.max);
    return range ? range.color : 'gray';
});

const getColorRGB = computed(() => {
    switch (getColor.value) {
        case 'white': return '153, 153, 153';
        case 'blue': return '0, 191, 255';
        case 'purple': return '173, 77, 255';
        default: return '128, 128, 128'; // Серый цвет по умолчанию
    }
});

const blinkFrequency = computed(() => {
    const range = colorRanges.find(r => props.value >= r.min && props.value <= r.max);
    return range ? range.frequency : 1000; // Значение по умолчанию — 1 секунда
});

const getOpacity = computed(() => {
    const range = colorRanges.find(r => props.value >= r.min && props.value <= r.max);
    return range ? range.opacity : 0.5; // Default opacity
});
</script>

<template>
    <div class="circle_container">
        <div class="main_circle" :style="{
            height: `${size}px`,
            width: `${size}px`,
            borderWidth: `${circleBorderWidth}px`,
            borderColor: `rgba(${getColorRGB})`, /* Устанавливаем цвет для границы */
            '--shadowColor': getColorRGB,
            '--shadowMaxOpacity': getOpacity,
            animationDuration: `${blinkFrequency}ms`,  // Здесь мы устанавливаем частоту мерцания
            boxShadow: `0 0 30px 15px rgba(${getColorRGB}, ${getOpacity}),
                        0 0 60px 30px rgba(${getColorRGB}, ${getOpacity * 0.6}),
                        0 0 90px 45px rgba(${getColorRGB}, ${getOpacity * 0.3})`
        }">
            <p class="pulse_value" :style="{ fontSize: `${pulseValueFont}px` }">
                {{ Math.round(value) }}
            </p>
            <div class="judge_number_container" :style="{ minWidth: `${judgeContainerMinWidth}px` }">
                <p class="judge_number" :style="{ fontSize: `${judgeNumberFont}px` }">
                    {{ judgeNumber }}
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
    border-width: 8px;
    border-style: solid;
    position: relative;
    animation: blinkShadow infinite alternate;
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
    transform: translateX(-50%) translateY(-50%);
    min-width: 100px;
    padding: 0px 15px;
    border-radius: 16px;
    border: 1px solid rgba(153, 153, 153, 0.853);
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
    text-align: center;
}

@keyframes blinkShadow {
    0% {
        box-shadow: 0 0 30px 15px rgba(var(--shadowColor), var(--shadowMaxOpacity)),
            0 0 60px 30px rgba(var(--shadowColor), calc(var(--shadowMaxOpacity) * 0.6)),
            0 0 90px 45px rgba(var(--shadowColor), calc(var(--shadowMaxOpacity) * 0.3));
    }

    100% {
        box-shadow: 0 0 40px 20px rgba(var(--shadowColor), calc(var(--shadowMaxOpacity) * 0.1)),
            0 0 80px 40px rgba(var(--shadowColor), calc(var(--shadowMaxOpacity) * 0.05)),
            0 0 120px 60px rgba(var(--shadowColor), calc(var(--shadowMaxOpacity) * 0.02));
    }
}
</style>
