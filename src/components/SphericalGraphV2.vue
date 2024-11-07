<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { circleCoordsCalculation, generateMainCircle } from '@/methods/CircleDataProcess';

const props = defineProps({
    value: {
        type: Number,
        required: true
    },
    x: {
        type: Array,
        required: true
    },
    y: {
        type: Array,
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

const viewBox = ref(`0 0 ${props.size} ${props.size}`);
const color = ref('');

const svgCenterX = ref(props.size / 2);
const svgCenterY = ref(props.size / 2);

const mainFontCoefficient = 4;
const secondFontCoefficient = 10;

const svgFontMain = ref(props.size / mainFontCoefficient);
const svgFontSecond = ref(props.size / secondFontCoefficient);
const svgTextGap = ref(0);
svgTextGap.value = props.size / mainFontCoefficient / 1.61;

const pathDataCircle = ref('');
const pathMainCircle = ref('');


const colorRanges = [
    { min: 0, max: 150, color: 'white', frequency: 2000, opacity: 0.1 },
    { min: 151, max: 350, color: 'blue', frequency: 1000, opacity: 0.4 },
    { min: 351, max: 1000, color: 'purple', frequency: 500, opacity: 0.7 },
];


// Computed property to determine color based on value
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

const getFillColor = computed(() => {
    return `rgba(${getColorRGB.value}, 1)`; // Using RGBA with lower opacity for the fill
});

// Watcher to update the SVG path color when `value` changes
watch(() => props.value, () => {
    // Update color of the SVG path based on the current value
    document.querySelector('.svg__data_circle').style.stroke = getColorRGB.value;
});


onMounted(() => {
    pathDataCircle.value = circleCoordsCalculation(props.x, props.y, props.size);
});


</script>

<template>
    <div class="spherical-graph">
        <svg :width="size" :height="size" :viewBox=viewBox>
            <path :d="pathDataCircle" class="svg__data_circle" :stroke="`rgba(${getColorRGB}, 0.4)`"
                :fill="`rgba(${getColorRGB}, 0.5)`" />
        </svg>
    </div>
</template>

<style scoped>
.spherical-graph {
    display: inline-block;
    /* margin: 10px; */
    position: absolute;
    top: 0;
    /* padding: 20px; */
}

.svg__data_circle {
    fill: none;
    stroke-width: 12;
    /* filter: drop-shadow(0px 0px 8px #ce0082); */
    stroke-linejoin: round;
    stroke-linecap: round;
    z-index: 1;
}

.svg__main_circle {
    fill: none;
    stroke: #ffffff;
    stroke-width: 3;
    z-index: 0;
}

.heart-icon {
    position: absolute;
}
</style>
