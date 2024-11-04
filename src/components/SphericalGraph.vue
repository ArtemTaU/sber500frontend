<script setup>
import { ref, onMounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { circleCoordsCalculation, generateMainCircle } from '@/methods/CircleDataProcess';

const props = defineProps({
  judgeNumber:{
    type: String,
    required: true
  },
  pulseValue: {
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
  colorStart: {
    type: String,
    default: 'red'
  },
  colorEnd: {
    type: String,
    default: 'blue'
  },
  size: {
    type: Number,
  }
});

const viewBox=ref(`0 0 ${props.size} ${props.size}`);

const svgCenterX = ref(props.size / 2);
const svgCenterY = ref(props.size / 2);

const mainFontCoefficient = 4;
const secondFontCoefficient = 10;

const svgFontMain = ref(props.size / mainFontCoefficient);
const svgFontSecond = ref(props.size / secondFontCoefficient);
const svgTextGap = ref(0);
svgTextGap.value = props.size / mainFontCoefficient / 1.5;

const pathDataCircle = ref('');
const pathMainCircle = ref('');

const heartIconStyle = ref({
    fontSize: svgFontSecond.value,
    color: props.color,
    top: props.size / 1.65,
    left: props.size / 2.5
})


onMounted(() => {
  pathDataCircle.value = circleCoordsCalculation(props.x, props.y, props.size);
  pathMainCircle.value =  generateMainCircle(props.size);
});


</script>

<template>
  <div class="spherical-graph">
    <svg :width="size" :height="size" :viewBox=viewBox>  
      <path
            :d="pathMainCircle"   
            class="svg__main_circle"
      />    
      <path
            :d="pathDataCircle"            
            class="svg__data_circle"
            :stroke="props.color"
      />      
      <text 
      :x="svgCenterX" 
      :y="svgCenterY" 
      text-anchor="middle" 
      dominant-baseline="middle" 
      :font-size=svgFontMain fill="#FFF"      
      >        
        {{ `#${judgeNumber}` }}
      </text>
      <text 
      :x="svgCenterX + 30" 
      :y="svgCenterY + svgTextGap" 
      text-anchor="middle" 
      dominant-baseline="middle" 
      :font-size=svgFontSecond 
      :fill="props.color"
      >
        {{ pulseValue }}
      </text>
      
    </svg>
    <font-awesome-icon :icon="['fas', 'heart']" class="heart-icon"
    :style="heartIconStyle"/>
  </div>
</template>

<style scoped>
.spherical-graph {
  display: inline-block;
  margin: 10px;
  position: relative;
}

.svg__data_circle{
    fill: none;
    stroke-width: 8;
    /* filter: drop-shadow(0px 0px 8px #ce0082); */
    stroke-linejoin: round; 
    stroke-linecap: round;
    z-index: 1;
}

.svg__main_circle{
    fill: none;
    stroke: #ffffff;
    stroke-width: 3;
    z-index: 0;
}

.heart-icon{
    position: absolute;
}
</style>
