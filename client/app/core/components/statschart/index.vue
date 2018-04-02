<template lang="pug">
canvas(:ref='chartId')
</template>

<script>
import Chart from 'chart.js';
import { gradientChartOptionsConfiguration } from './options';

const chartColor = '#FFFFFF';

export default {
  props: ['data', 'labels', 'id'],

  data() {
    return {
      chart: null,
      gradientFill: null,
      time: 0,
    };
  },

  computed: {
    chartId() {
      if (this.time === 0) {
        this.time = new Date().getTime();
      }
      return this.id ? this.id : `chart_${this.time}`;
    },

    datasets() {
      return [
        {
          label: 'Lượt chấm điểm mới',
          borderColor: '#f96332',
          pointBorderColor: '#FFF',
          pointBackgroundColor: '#f96332',
          pointBorderWidth: 2,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 1,
          pointRadius: 4,
          fill: true,
          backgroundColor: this.gradientFill,
          borderWidth: 2,
          data: this.data,
        },
      ];
    },
  },

  mounted() {
    const ctx = this.$refs[this.chartId].getContext('2d');

    const gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, '#80b6f4');
    gradientStroke.addColorStop(1, chartColor);

    this.gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
    this.gradientFill.addColorStop(0, 'rgba(128, 182, 244, 0)');
    this.gradientFill.addColorStop(1, 'rgba(249, 99, 59, 0.40)');

    this.chart = new Chart(ctx, {
      type: 'line',
      responsive: true,
      data: {
        labels: this.labels,
        datasets: this.datasets,
      },
      options: gradientChartOptionsConfiguration,
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
