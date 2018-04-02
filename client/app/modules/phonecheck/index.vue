<template lang="pug">
  b-card
    el-form.demo-form-inline(:models='formSearch', inline=true, @submit.native.prevent="onTextSearchEnter")
      el-form-item
        el-input(:placeholder='_("EnterYourSearch")', v-model='formSearch.searchText', @keyup.enter.native='onTextSearchEnter($event)')           
      el-form-item
              el-date-picker(v-model='formSearch.rangeValue', type='daterange',
              start-placeholder='Start Date', 
              end-placeholder='End Date',
              format="dd-MM-yyyy", 
              value-format="yyyy-MM-dd")
            
      el-form-item
        el-button(type='primary', icon='search',@click='metOnSearch') {{_('Search')}}
      //- el-form-item    
      //-   el-button(type='success', icon='plus', @click='handleAddNew') {{_('Add')}}
    br
    el-row
      el-table(ref='multipleTable', :data='logLst', border='', style='width: 100%')    
        el-table-column(:label='_("HanhDong")', width='82')
          template(slot-scope='scope')
            el-tooltip.item(effect='dark', content='Đặt lại số lần kiểm tra', placement='left-start')
              el-button(size='small', @click='handleEdit(scope.$index, scope.row)', icon='el-icon-edit')
            //- el-tooltip.item(effect='dark', content='Xóa', placement='right-start' )
            //-   el-button(size='small', type='danger', @click='handleDelete(scope.$index, scope.row)', icon='el-icon-delete', v-if='scope.row.username !== loginUsername')
        el-table-column(type='expand', label='Tự Khai', width='150')
          template(slot-scope='props')
            ul
              li(v-for='item in props.row.self_declare_info')
                | {{ formatAnswer(item) }}    
        el-table-column(prop='phone_number',label='SDT', width='100')
        el-table-column(prop='identity_number',label='CMND', width='100')
        el-table-column(prop='check_counter',label='Số Lần Kiểm Tra', width='200')
        el-table-column(prop='cid_result',label='Kết quả CIC', width='600')
        el-table-column(prop='cib_point',label='Điểm CIC', width='100')
        el-table-column(prop='cib_random_point',label='Điểm Random', width='150')
        el-table-column(prop='final_score',label='Điểm Cuối Cùng', width='150')
        el-table-column(prop='check_time',label='Thời điểm Kiểm Tra', width='200')
          template(slot-scope='scope') {{formatDate(scope.row.check_time)}}          
        el-table-column(prop='status',label='Tình Trạng', width='200')
          template(slot-scope='scope') {{formatStatus(scope.row.status)}}    
        
    br
    el-row
      el-pagination(@size-change='handleSizeChange',
                    @current-change='handleCurrentChange', 
                    :current-page.sync='currentPage', 
                    :page-size='pageSize', 
                    :page-sizes='pageSizes', 
                    layout='total, sizes, prev, pager, next, jumper',
                    :total='total')

    el-dialog(title='Dặt lại số lần kiểm tra',:visible='dialog', 
              :modal-append-to-body='false',
               @close='showPopup(false)')
      el-form(:model='formData', label-width='200px')
       
        el-form-item(label='Số Lần kiểm tra')
          el-input-number(v-model='formData', :min='1', :max='10')

      span.dialog-footer(slot='footer')
        el-button(@click='showPopup(false)') {{_('btnClose')}}
        el-button(type='primary', @click='handleSave()') {{_('btnSave')}}

</template>

<script>
import VueRouter from 'vue-router';
const route = new VueRouter();
import { mapGetters, mapActions } from 'vuex';
import toastr from '../../core/toastr';
import moment from 'moment';

export default {
  computed: {
    ...mapGetters('phonecheck', ['logLst', 'total', 'dialog']),
    ...mapGetters('session', ['me']),
    query() {
      const [fromDt, toDt] = this.formSearch.rangeValue;
      return {
        searchText: this.formSearch.txtName,
        startDate: moment(fromDt).format('YYYY-MM-DD'),
        endDate: moment(toDt).format('YYYY-MM-DD'),
        size: this.pageSize,
        skip: this.pageSize * (this.currentPage - 1),
      };
    },
    loginUsername() {
      return this.me ? this.me.username : '';
    },
  },

  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 50, 100, 200, 500],
      isNew: false,
      formSearch: {
        searchText: '',
        rangeValue: [this.firstDayOfMonth(), this.endDayOfMonth()],
      },

      formData: {
        id: '',
        checkTime: 1,
      },
    };
  },

  methods: {
    ...mapActions('phonecheck', ['getData', 'resetCouter']),

    handleEdit(index, row) {
      this.$prompt('Số Lần Kiểm Tra', 'Đặt Lại Sô Lần Kiểm Tra', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        inputValue: parseInt(row.check_counter),
        inputPattern: /[0-9]/,
        inputErrorMessage: 'Chỉ được nhập số',
      })
        .then(value => {
          let params = {
            data: { phone: row.phone_number, check_counter: value.value },
            query: this.query,
          };
          this.resetCouter(params);
        })
        .catch(() => {
          console.log('cancel update');
        });
    },

    // handleSave() {
    //   this.$refs['mainForm'].validate(valid => {
    //       if (valid) {
    //         this.formData.isNew = this.isNew;
    //         let params = {
    //           data: this.formData,
    //           query: this.query
    //         }
    //         this.saveCicCfg(params);
    //       }
    //       else{ return false;}
    //   });
    // },

    metOnSearch() {
      this.getData(this.query);
    },

    onTextSearchEnter(event) {
      event.preventDefault();
      this.getData(this.query);
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.getData(this.query);
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData(this.query);
    },

    formatStatus(status) {
      if (!status || status === 'saved') return 'Hồ sơ chưa được gửi';
      return 'Đã gửi';
    },

    formatDate(date) {
      return moment(date, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss');
    },

    formatAnswer(aItem) {
      if (!aItem) return '';

      let answer = '';
      if (aItem.questionId && aItem.questionId === 'Q002')
        answer = aItem.answer
          ? new Date().getFullYear() - parseInt(aItem.answer)
          : '';
      else if (aItem.questionId && aItem.questionId === 'Q006') {
        answer = aItem.answer ? parseInt(aItem.answer) * 1000000 : '';
        answer = this.formatCurrency(answer.toString());
      } else answer = aItem.answer ? aItem.answer : '';

      let question = aItem.question ? aItem.question : '';
      let point = aItem.point ? aItem.point : '0';
      return `${question} : '${answer}' = ${point} điểm`;
    },

    formatCurrency(inputValue) {
      if (inputValue) {
        return parseFloat(inputValue.replace(/\./g, ''))
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      }
      return '0';
    },

    firstDayOfMonth() {
      const date = new Date();
      const y = date.getFullYear();
      const m = date.getMonth();
      const firstDay = new Date(y, m, 1);
      return firstDay;
      // return moment(firstDay).format('YYYY-MM-DD');
    },

    endDayOfMonth() {
      const date = new Date();
      const y = date.getFullYear();
      const m = date.getMonth();
      const lastDay = new Date(y, m + 1, 0);
      return lastDay;
      //return moment(lastDay).format('YYYY-MM-DD');
    },
  },

  watch: {},

  created() {
    this.getData(this.query);
  },

  mounted() {
    // this.$watch('formSearch.searchText', val => {
    //   this.getData(this.query);
    // });
  },
};
</script>
<style lang='scss'>
.el-dialog {
  width: 65% !important;
}
.container {
  padding-bottom: 1rem;
}

.header {
  margin: 1rem;
}

.el-dialog {
  z-index: 100;
}
</style>
