<template lang="pug">
  b-card
    el-form.demo-form-inline(:models='formSearch', inline=true, @submit.native.prevent="onTextSearchEnter")
      el-form-item
        el-input(:placeholder='_("EnterYourSearch")', v-model='formSearch.searchText', @keyup.enter.native='onTextSearchEnter($event)')           
      el-form-item
        el-button(type='primary', icon='search',@click='metOnSearch') {{_('Search')}}
      el-form-item    
        el-button(type='success', icon='plus', @click='handleAddNew') {{_('Add')}}
    br
    el-row
      el-table(ref='multipleTable', :data='resultLst', border='', style='width: 100%', @selection-change='handleSelectionChange')        
        el-table-column(:label='_("HanhDong")', width='120')
          template(slot-scope='scope')
            el-tooltip.item(effect='dark', content='Sửa', placement='left-start')
              el-button(size='small', @click='handleEdit(scope.$index, scope.row)', icon='el-icon-edit')
            el-tooltip.item(effect='dark', content='Xóa', placement='right-start' )
              el-button(size='small', type='danger', @click='handleDelete(scope.$index, scope.row)', icon='el-icon-delete', v-if='scope.row.username !== loginUsername')
        el-table-column(prop='isAccept',label='Kết Quả', width='300')
           template(slot-scope='scope') {{formatResult(scope.row.isAccept)}}
        el-table-column(prop='point_from',label='ĐIỂM = CIC -50 + TỰ KHAI', width='300')
           template(slot-scope='scope') {{formatPoint(scope.row)}}
        el-table-column(prop='loan',label='Cho vay (Triệu vnd)', width='300')
        el-table-column(prop='interest_rate',label='lãi xuất/năm', width='200')
        el-table-column(prop='duration',label='Thời hạn tối đa/tháng', width='200')
        el-table-column(property='createAt', :label='_("createAt")', width='170')
          template(slot-scope='scope') {{formatDate(scope.row.createdAt)}}

     
    br
    el-row
      el-pagination(@size-change='handleSizeChange',
                    @current-change='handleCurrentChange', 
                    :current-page.sync='currentPage', 
                    :page-size='pageSize', 
                    :page-sizes='pageSizes', 
                    layout='total, sizes, prev, pager, next, jumper',
                    :total='total')

    el-dialog(:title='title',:visible='dialog', 
              :modal-append-to-body='false',
               @close='showPopup(false)')
      el-form(:model='formData', label-width='200px',  :rules="lstRule", ref="mainForm" )
        el-form-item(label='Điểm từ', prop='point_from')
          el-input(v-model='formData.point_from')
        el-form-item(label='Điểm tới', prop='point_to')
          el-input(v-model='formData.point_to')
        el-form-item(label='Cho vay (Triệu vnd)', prop='loan')
          el-input(v-model='formData.loan')
        el-form-item(label='lãi xuất/năm', prop='interest_rate')
          el-input(v-model='formData.interest_rate')
        el-form-item(label='Thời hạn tối đa/tháng', prop='duration')
          el-input(v-model='formData.duration')

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
    ...mapGetters('result', ['resultLst', 'total', 'dialog']),
    ...mapGetters('session', ['me']),
    query() {
      return {
        searchText: this.formSearch.searchText,
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
      },
      title: '',
      formData: {
        isAccept: true,
        point_from: 0,
        point_to: 0,
        loan: '',
        duration: '',
        interest_rate : ''

      },
      lstRule: {
        point_from: [
          { required: true, message: 'Không được để trống', trigger: 'blur' },
        ],
        point_to: [
          { required: true, message: 'Không được để trống', trigger: 'blur' },
        ],
        loan: [
          { required: true, message: 'Không được để trống', trigger: 'blur' },
        ],
        duration: [
          { required: true, message: 'Không được để trống', trigger: 'blur' },
        ],
        interest_rate: [
          { required: true, message: 'Không được để trống', trigger: 'blur' },
        ],
      },
    };
  },

  methods: {
    ...mapActions('result', [
      'getData',
      'saveResult',
      'deleteResult',
      'showPopup',
    ]),

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    handleEdit(index, row) {
      this.showPopup(true);
      this.isNew = false;
      this.title = 'Cập Nhật Thông Tin';
      this.formData = {
        _id: row._id,
        isAccept: row.isAccept,
        point_from: row.point_from,
        point_to: row.point_to,
        loan: row.loan,
        duration: row.duration,
        interest_rate : row.interest_rate,
      };
    },

    handleAddNew() {
      this.showPopup(true);
      this.isNew = true;
      this.title = 'Tạo Thông Tin';
      this.formData = {
        isAccept: true,
        point_from: 0,
        point_to: 0,
        loan: '',
        duration: '',
        interest_rate : '',
      };
    },

    handleDelete(index, row) {
      this.$confirm(this._('BanCoMuonXoa'), this._('Warning'), {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(() => {
        this.deleteResult({ id: row._id, query: this.query });
      });
    },

    handleSave() {
      this.$refs['mainForm'].validate(valid => {
        if (valid) {
          this.formData.isNew = this.isNew;
          let params = {
            data: this.formData,
            query: this.query,
          };
          this.saveResult(params);
        } else {
          return false;
        }
      });
    },

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
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY HH:mm:ss');
    },

    formatPoint(row){
      return row.point_from + ' - ' + row.point_to;
    },

    formatResult(isAccept){
      return isAccept ? 'Đồng Ý' : 'Từ Chối';
    }
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
