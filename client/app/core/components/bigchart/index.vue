
<template lang="pug">
canvas(ref='bigChart')
</template>

<script>
import Chart from 'chart.js';
import options from './options';

const chartColor = '#FFFFFF';

export default {
  props: ['data', 'labels'],
  data() {
    return {
      chart: null,
      gradientFill: null,
    };
  },

  computed: {
    datasets() {
      return [
        {
          label: 'Data',
          borderColor: chartColor,
          pointBorderColor: chartColor,
          pointBackgroundColor: '#1e3d60',
          pointHoverBackgroundColor: '#1e3d60',
          pointHoverBorderColor: chartColor,
          pointBorderWidth: 1,
          pointHoverRadius: 7,
          pointHoverBorderWidth: 2,
          pointRadius: 5,
          fill: true,
          backgroundColor: this.gradientFill,
          borderWidth: 2,
          data: this.data,
        },
      ];
    },
  },

  mounted() {
    const ctx = this.$refs.bigChart.getContext('2d');

    const gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, '#80b6f4');
    gradientStroke.addColorStop(1, chartColor);

    this.gradientFill = ctx.createLinearGradient(0, 200, 0, 50);
    this.gradientFill.addColorStop(0, 'rgba(128, 182, 244, 0)');
    this.gradientFill.addColorStop(1, 'rgba(255, 255, 255, 0.24)');

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: this.datasets,
      },
      options,
    });
  },

  watch: {
    data(data) {
      if (this.chart) {
        this.data = data;
        this.chart.data.datasets = this.datasets;
        this.chart.update();
      }
    },

    labels(data) {
      this.chart.data.labels = data;
      this.chart.update();
    },
  },
};
</script>

<style>

</style>
