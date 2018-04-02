<template lang="pug">
.dashboard
  .row
    .col-lg-4
      .card.card-chart
        .card-header
          h5.card-category Tháng hiện tại ({{currentMonth}})
          h4.card-title Lượt chấm điểm mới
        .card-body
          .chart-area
            stats-chart(:data='monthlyChartDatas.datas', :labels='monthlyChartDatas.labels')
        .card-footer
          .stats
            i.now-ui-icons.arrows-1_refresh-69
            |  Just Updated
    .col-lg-4.col-md-6
      .card.card-chart
        .card-header
          h5.card-category 2018 Sales
          h4.card-title All products
        .card-body
          .chart-area
            stats-chart(:data='bigChartDatas.data', :labels='bigChartDatas.labels')
        .card-footer
          .stats
            i.now-ui-icons.arrows-1_refresh-69
            |  Just Updated
    .col-lg-4.col-md-6
      .card.card-chart
        .card-header
          h5.card-category Ngày Hiện Tại ({{currentDate}})
          h4.card-title Trong Vòng 24 giờ
        .card-body
          .chart-area
            stats-chart(:data='dailyChartDatas.datas', :labels='dailyChartDatas.labels')
        .card-footer
          .stats
            i.now-ui-icons.ui-2_time-alarm
            |  Last 24 Hours
  .row
    .col-md-6
      .card
        .card-header
          h4.card-title  Danh Sách Hồ Sơ
        .card-body
          .table-responsive
            table.table
              thead.text-primary
                th
                  | CMND
                th
                  | SDT
                th
                  | Điểm CIC
                th
                  | Điểm Cuối
                th
                  | Ngày
                th.text-right
                  | Status
              tbody
                tr(v-for="logInfo in logInfos")  
                  td {{logInfo.identity_number}}
                  td {{logInfo.phone_number}}
                  td {{logInfo.cib_point}}
                  td {{logInfo.final_score}}
                  td {{formatDate(logInfo.createdAt)}}
                  td.text-right {{formatStatu(logInfo.status)}}
          el-row
            el-pagination(@size-change='handleSizeChange',
                          @current-change='handleCurrentChange', 
                          :current-page.sync='currentPage', 
                          :page-size='pageSize', 
                          :page-sizes='pageSizes', 
                          layout='total, sizes, prev, pager, next, jumper',
                          :total='total')
               
    .col-md-6
      .card
        .card-header
          h4.card-title  Danh Sách Referal
        .card-body
          .table-responsive
            table.table
              thead.text-primary
                th
                  | Referal Key
                th.text-right
                  | Số lần check
              tbody
                    tr(v-for="referel in referels") 
                      td {{referel.referal_key}}
                      td.text-right {{referel.count}}
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
import { StatsChart } from '../../core/components';

export default {
  components: {
    StatsChart,
  },

  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 50, 100, 200, 500],
    };
  },

  computed: {
    ...mapGetters('dashboard', [
      'bigChartDatas',
      'monthlyChartDatas',
      'dailyChartDatas',
      'referels',
      'logInfos',
      'total'
    ]),

    currentMonth() {
      const date = new Date();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${month > 9 ? month : '0' + month}/${year}`;
    },

    currentDate() {
      let currentDateStr = moment().format('YYYY-MM-DD');
      return currentDateStr;
    },

    query() {
      return {
        size: this.pageSize,
        skip: this.pageSize * (this.currentPage - 1)
      };
    },
  },

  methods: {
    ...mapActions('dashboard', [
      'getBigChartData',
      'getMonthlyChartDatas',
      'getReferals',
      'getDailyChartDatas',
      'getLogInfo'
    ]),

    handleSizeChange(val) {
      this.pageSize = val;
      this.getLogInfo(this.query);
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getLogInfo(this.query);
    },

    formatDate(date) {
      return moment(date).format('DD/MM/YYYY HH:mm');
    },

    formatStatu(status) {
      if(status){
        if(status === 'sent')
          return 'Đã Gữi'
        if(status === 'saved')
          return 'Lưu'
      }
      return ''
    }
  },

  created() {
    this.getMonthlyChartDatas();
    this.getReferals();
    this.getDailyChartDatas();
    this.getLogInfo(this.query);
  },
};
</script>

<style lang="scss" scoped>

</style>
