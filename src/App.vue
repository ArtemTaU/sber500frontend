<script setup>
import { onMounted, ref } from 'vue';
import { getCirclesData, getJuryData } from '@/api/fastapi.js/getObjectsRequests';
import { useRoute } from 'vue-router';
import { circlesDataGeneration } from '@/store/data_generation';

const route = useRoute();
const userData = ref({});

const fetchData = async () => {
    try {
        // const response = await getCirclesData();
        const response = await getJuryData();
        userData.value = response.data;
        // userData.value = circlesDataGeneration(5);
        console.log(userData);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

onMounted(fetchData);
</script>

<template>
    <main>
        <nav v-if="route.path === '/'">
            <!-- <router-link to="/circle_graphs" class="nav-button">Circle Graph</router-link> -->
            <router-link to="/circles_final" class="nav-button">Основной экран</router-link>
            <router-link to="/circles_translation" class="nav-button">Трансляция</router-link>
            <div v-for="(value, key) in userData" :key="key">
                <router-link :to="{ name: 'line_graph', params: { swaidId: key } }" class="nav-button">
                    График судьи: {{ key }}
                </router-link>
            </div>
        </nav>
        <RouterView />
    </main>
</template>

<style scoped>
nav {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 20px;
    justify-content: center;
    flex-direction: column;
}

.nav-button {
    display: inline-block;
    padding: 10px 20px;
    font-size: 1.2em;
    text-align: center;
    color: white;
    background-color: #8642aa;
    border-radius: 8px;
    border: 2px solid white;
    text-decoration: none;
    transition: background-color 0.3s ease;
}

.nav-button:hover {
    background-color: #68258c;
}

.nav-button:active {
    background-color: #68258c;
}
</style>
