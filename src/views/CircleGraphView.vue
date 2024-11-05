<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import SphericalGraph from '@/components/SphericalGraph.vue';
import { circlesDataGeneration } from '@/store/data_generation';
import { distributeRows } from '@/methods/CircleDataProcess';

import { getCirclesData } from '@/api/fastapi.js/getObjectsRequests';

const colorsOfCircles = ['#9001FE', '#063AF3', '#FF036D', '#0BEDDA', '#5201A7', '#FF036D', '#0BEDDA', '#063AF3', '#9001FE', '#DF0367'];

const svgGraphSize = 300;

const numCircles = ref(12);

const userData = ref({});
const upperRow = ref([]);
const lowerRow = ref([]);

const upperColors = ref([]);
const lowerColors = ref([]);

onMounted(async () => {
  const responseData = await getCirclesData();
  console.log(responseData);
  userData.value = responseData.data

  userData.value = circlesDataGeneration(numCircles.value);
  const rows = distributeRows(userData.value, colorsOfCircles);

  upperRow.value = rows.upperRow;
  upperColors.value = rows.upperColor;
  lowerRow.value = rows.lowerRow;
  lowerColors.value = rows.lowerColor;

});

</script>

<template>
  <main>
    <div class="rows">
      <div class="upper_row">
        <div v-for="(value, key, index) in upperRow" :key="key">
          <SphericalGraph :judgeNumber="key" :pulseValue="value.average_pulse" :x="value.x" :y="value.y"
            :size="svgGraphSize" :color="upperColors[index]" />
        </div>
      </div>
      <div class="lower_row">
        <div v-for="(value, key, index) in lowerRow" :key="index">
          <SphericalGraph :judgeNumber="key" :pulseValue="value.average_pulse" :x="value.x" :y="value.y"
            :size="svgGraphSize" :color="lowerColors[index]" />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.rows {
  display: flex;
  flex-direction: column;
  gap: 50px;
}

.upper_row,
.lower_row {
  display: flex;
  flex-direction: row;
  gap: 240px;
  min-width: 40vw;
  justify-content: center;
}
</style>
