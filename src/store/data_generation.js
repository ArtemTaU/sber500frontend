function calculateAverages(data) {
  // Вычисляем среднее значение для массива
  function calculateAverage(array) {
    const sum = array.reduce((acc, val) => acc + val, 0);
    return sum / array.length;
  }

  const averagePulse = calculateAverage(data);
  const averageSI = calculateAverage(data.map(value => value * 0.7)); // Пример расчёта SI
  
  return {
    average_pulse: parseFloat(averagePulse.toFixed(1)), // Округляем до 1 знака после запятой
    average_si: parseFloat(averageSI.toFixed(1))
  };
}


function circleData() {
  const arraysLength = 60;
  const possibility = 0.05; // Вероятность пикового значения
  const peaksAmplitude = 300; // Максимальное добавочное значение для пика
  const minY = 0; // Минимальное значение для y
  const maxY = 100; // Максимальное значение для y

  const yCoordinates = Array.from({ length: arraysLength }, () => {
    // Если случайное число меньше вероятности, создаем пик выше maxY
    if (Math.random() < possibility) {
      return Math.floor(Math.random() * peaksAmplitude) + maxY + 1;
    } else {
      // В противном случае значение находится в диапазоне от minY до maxY
      return Math.floor(Math.random() * (maxY - minY + 1)) + minY;
    }
  });

  const averages = calculateAverages(yCoordinates);

  const xCoordinates = Array.from({ length: arraysLength }, (_, i) => i + 1); // Generates [1, 2, 3, ..., 150]

  return {
    x: xCoordinates,
    y: yCoordinates,
    average_pulse: averages['average_pulse'], // исправлено на корректный ключ
    average_si: averages['average_si']       // исправлено на корректный ключ
  };
} 


function circlesDataGeneration(judgesNumber) {
  const judges = Array.from({ length: judgesNumber }, (_, i) => i + 1);
  const dataDict = {};

  judges.forEach(judge => {
    dataDict[judge] = circleData();
  });

  return dataDict;
}

export {circlesDataGeneration};