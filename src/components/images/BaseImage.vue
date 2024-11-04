<template>
    <img
      :src="src"
      :alt="alt"
      :style="imageStyle"
      :class="computedClass"
      @error="handleError"
    />
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { defineProps } from 'vue';
  
  const props = defineProps({
      src: {
          type: String,
          required: true, 
      },
      alt: {
          type: String,
          default: 'Image',
      },
      width: {
          type: [String, Number],
          default: null,
      },
      height: {
          type: [String, Number],
          default: null,
      },
      rounded: {
          type: Boolean,
          default: false,
      }
  });
  
  const computedClass = computed(() => {
      return {
          'rounded': props.rounded,
      };
  });
  
  // Преобразование ширины и высоты в строку с единицами измерения, если это число
  const imageStyle = computed(() => {
      const style = {};
      if (props.width) {
          style.width = typeof props.width === 'number' ? `${props.width}px` : props.width;
      }
      if (props.height) {
          style.height = typeof props.height === 'number' ? `${props.height}px` : props.height;
      }
      return style;
  });
  
  const handleError = (event) => {
      event.target.src = 'https://via.placeholder.com/150';
  };
  </script>
  
  <style scoped>
  img {
      max-width: 100%; 
      object-fit: contain;    
  }
  
  .rounded {
    border-radius: 8px;
    box-shadow: 0 0 7px 0;
  }
  
  </style>
  