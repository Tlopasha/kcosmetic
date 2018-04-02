<template lang="pug">

.col-md-8.ml-auto.mr-auto
  .card.card-upgrade
    .card-header.text-center
      h4.card-title
        |  Xác Nhận Hồ Sơ
        
    .card-body
      p.card-category
        | Thông Tin Cá Nhân
      .table-responsive.table-upgrade
        table.table
          tbody
            tr
              td(style='width: 50%;') Họ Tên : {{lstDeclareDefault.name}}
              td(style='width: 50%;') {{ formatValue(0) }}
            tr
              td(style='width: 50%;') {{ formatValue(1) }}
              td(style='width: 50%;') {{ formatValue(2) }}
            tr
              td(style='width: 50%;') {{ formatValue(3) }}
              td(style='width: 50%;') {{ formatValue(4) }}
            tr
              td(style='width: 50%;') {{ formatValue(5) }}
              //td(style='width: 50%;') {{ formatValue(6) }}
              td(style='width: 50%;') Khoảng Muốn Vay : {{lstDeclareDefault.wantMuch}}
            tr
              td(style='width: 50%;') Số Điện Thoại : {{lstDeclareDefault.phone}}
              td(style='width: 50%;') Email : {{lstDeclareDefault.email}}
            tr
              td(style='width: 50%;') Công ty đang làm việc : {{lstDeclareDefault.company}}
              
      p.card-category
        | Kết Quả Kiểm Tra
      .table-responsive.table-upgrade
        table.table
          tbody
            tr
              td(style='width: 50%;') Điểm CIC: {{dataResult ? dataResult.cic_point : ''}} Điểm
              td(style='width: 50%;') Điểm Tính Dụng: {{dataResult ? dataResult.score : ''}} Điểm
            tr
              td(style='width: 50%;') Được vay trong khoảng : {{dataResult ? dataResult.loan : ''}} Triệu VNĐ
              td(style='width: 50%;') Lãi xuất : {{dataResult ? dataResult.duration : ''}} %/Năm
            tr
              td(style='width: 50%;') Kỳ hạn tối đa : {{dataResult ? dataResult.interest_rate : ''}} Tháng
      p.card-category
        | Hồ Sơ Sẽ Được Gửi Cho
      .table-responsive.table-upgrade
        table.table
          //- thead
          //-   th Tên
          //-   th SĐT
          //-   th Email        
          tbody
            tr(v-for='company in selectedCompany')
              td {{company.alt}}
              //- td(style='width: 50%;') {{company.phone}}
              //- td(style='width: 50%;') {{company.email}}
    .card-footer.text-center
      div.footer-button
        a.btn.btn-round.btn-info(@click='onBackFinal',style='color: #fff;') QUAY LẠI
        a.btn.btn-round.btn-primary(@click='onSubmitFinal', style='color: #fff;') GỬI HỒ SƠ
									
</template>
          
            

<script>
import toastr from 'fecore/toastr';
import { checkValidPhoneNumber } from './../../../../common';

export default {
  props: {
    isRescored: Boolean,
    lstDeclare: Array,
    lstDeclareDefault: Object,
    dataResult: Object,
    selectedCompany: Array
  },
  components: {
  },

  data() {

    return {
    };
  },

  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },

  mounted() {
     
  },

  methods: {
    formatValue(index){
      if(this.lstDeclare){
        return `${this.lstDeclare[index].option} : ${this.lstDeclare[index].value}`
      }else
        return '';
    },
    onBackFinal() {
       this.$emit('onFinalBack');
    },

     onSubmitFinal() {
       this.$emit('onFinalSend');
    }
  },
};
</script>

<style lang="scss" scoped>
.card-category {
  text-align: center;
}
</style>
