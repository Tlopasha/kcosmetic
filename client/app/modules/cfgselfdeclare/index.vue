<template lang="pug">
div(v-loading.fullscreen.lock='fullloading') 
  b-card
    el-form.demo-form-inline(:models='formSearch', inline=true, @submit.native.prevent="onTextSearchEnter")
      el-form-item
        el-input(:placeholder='_("EnterYourSearch")', v-model='formSearch.searchText', @keyup.enter.native='onTextSearchEnter($event)')           
      el-form-item
        el-button(type='primary', icon='search',@click='metOnSearch') {{_('Search')}}
      //el-form-item    
        //el-button(type='success', icon='plus', @click='handleAddNew') {{_('Add')}}
    br
    el-row
      el-table(ref='multipleTable', :data='lstDeclare', border='', style='width: 100%', @selection-change='handleSelectionChange')    
        el-table-column(:label='_("HanhDong")', width='82')
          template(slot-scope='scope')
            el-tooltip.item(effect='dark', content='Sửa', placement='left-start')
              el-button(size='small', @click='handleEdit(scope.$index, scope.row)', icon='el-icon-edit')
            //el-tooltip.item(effect='dark', content='Xóa', placement='right-start' )
              //el-button(size='small', type='danger', @click='handleDelete(scope.$index, scope.row)', icon='el-icon-delete', v-if='scope.row.username !== loginUsername')
        el-table-column(type='expand', label='Mở Rộng', width='100')
          template(slot-scope='props')
            ul
              li(v-for='item in props.row.declaredetails')
                | {{ formatAnswer(item, props.row.isFormToQuestion) }}
        el-table-column(prop='option',label='Câu Hỏi', width='600')
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
      el-form(:model='formData', label-width='120px')
        el-form-item(label='Tên Câu Hỏi')
          el-col(:span='11')
            el-input(v-model='formData.option')
          el-col.paddingLeft40(:span='5') Câu Hỏi From To
          el-col(:span='2')
            el-tooltip(content="Lựa chọn này sẽ không sửa được sau khi câu trả lời được thêm", placement='top')
              el-switch(v-model="formData.isFormToQuestion", :disabled="formData.list_option && formData.list_option.length > 0 ? true: false")

        el-form-item(label='Câu Trả Lời' v-if="!formData.isFormToQuestion")
          el-input(v-model='formData.option_detail')
        el-form-item(label='Từ', v-if="formData.isFormToQuestion")
          el-col(:span='6')
            el-input-number(v-model='formData.option_range_from')
          el-col.line(:span='2') Đến
          el-col(:span='11')
            el-input-number(v-model='formData.option_range_to')
        el-form-item(label='Điểm')
          el-col(:span='5')
            el-input(v-model='formData.option_score')
          el-col.paddingLeft10(:span='10')
            el-button(type="primary", @click='addDeclare') {{labelBtn}}
        el-row
          el-table(:data='formData.list_option', border='', style='width: 600px')     
            el-table-column(prop='option_detail',label='Câu Trả Lời', width='300px', v-if="!formData.isFormToQuestion")
            el-table-column(prop='option_range_from',label='From', width='200px', v-if="formData.isFormToQuestion")
            el-table-column(prop='option_range_to',label='To', width='200px', v-if="formData.isFormToQuestion")
            el-table-column(prop='option_score',label='Điểm', width='100px')
            el-table-column(:label='_("HanhDong")', width='150px')
              template(slot-scope='scope')
                el-tooltip.item(effect='dark', content='Sửa', placement='left-start')
                  el-button(size='small', @click='handleEditOption(scope.$index, scope.row)', icon='el-icon-edit')
                el-tooltip.item(effect='dark', content='Xóa', placement='right-start' )
                  el-button(size='small', type='danger', @click='handleDeleteOption(scope.$index, scope.row)', icon='el-icon-delete', v-if='scope.row.username !== loginUsername')
          
      span.dialog-footer(slot='footer')
        el-button(@click='showPopup(false)') {{_('btnClose')}}
        el-button(type='primary', @click='handleSave') {{_('btnSave')}}

</template>

<script>
import VueRouter from 'vue-router';
const route = new VueRouter();
import { mapGetters, mapActions } from 'vuex';
import toastr from '../../core/toastr';
import moment from 'moment';
import _ from 'lodash';

export default {
  computed: {
    ...mapGetters('cfgselfdeclare', ['lstDeclare', 'total', 'dialog']),
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
      pageSizes: [5, 10, 20, 50, 100, 200, 500],
      isNew: false,
      formSearch: {
        searchText: '',
      },
      title: '',
      formData: {
        option: '',
        option_code: '',
        option_detail: '',
        option_range_from: 0,
        option_range_to: 0,
        option_score: 0,
        isFormToQuestion: false,
        list_option: [],
      },

      //
      labelBtn: 'Thêm',
      rowEditing: -1,
      fullloading: false,
    };
  },

  methods: {
    ...mapActions('cfgselfdeclare', [
      'getData',
      'saveDeclare',
      'deleteCicCfg',
      'showPopup',
      'updateList',
    ]),

    formatAnswer(optionDetails, isFromTo) {
      let resultStr = '';
      if (!isFromTo) resultStr += optionDetails.option_detail;
      else
        resultStr +=
          'Tù ' +
          optionDetails.option_range_from +
          ' Tới ' +
          optionDetails.option_range_to;
      resultStr += ' : ' + optionDetails.option_score + ' Điểm';

      return resultStr;
    },

    addDeclare() {
      let formData = this.formData;

      //Validate
      if (!formData.isFormToQuestion) {
        if (!formData.option_detail) {
          toastr.error('Vui lòng nhập câu trả lời');
          return;
        }
      }

      if (!formData.option_score) {
        toastr.error('Vui lòng nhập điểm');
        return;
      }

      let item = {
        option_detail: formData.option_detail ? formData.option_detail : '',
        option_range_from:
          formData.option_range_from !== '' ? formData.option_range_from : '',
        option_range_to:
          formData.option_range_to !== '' ? formData.option_range_to : '',
        option_score: formData.option_score ? formData.option_score : '',
      };

      //Case new option
      if (this.labelBtn === 'Thêm') {
        if (!formData.list_option) formData.list_option = [];
        formData.list_option.push(item);
      } else {
        //Case edit option
        if (this.rowEditing != -1) {
          formData.list_option[
            this.rowEditing
          ].option_detail = formData.option_detail
            ? formData.option_detail
            : '';
          formData.list_option[this.rowEditing].option_range_from =
            formData.option_range_from !== '' ? formData.option_range_from : '';
          formData.list_option[this.rowEditing].option_range_to =
            formData.option_range_to !== '' ? formData.option_range_to : '';
          formData.list_option[
            this.rowEditing
          ].option_score = formData.option_score ? formData.option_score : '';
        }
        this.rowEditing = -1;
        this.labelBtn = 'Thêm';
        formData.option_detail = '';
        formData.option_range_from = 0;
        formData.option_range_to = 0;
        formData.option_score = 0;
      }
    },

    handleEditOption(index, row) {
      console.log(row);
      this.labelBtn = 'Sửa';
      this.rowEditing = index;
      this.formData.option_detail = row.option_detail;
      this.formData.option_range_from = row.option_range_from;
      this.formData.option_range_to = row.option_range_to;
      this.formData.option_score = row.option_score;
    },

    handleDeleteOption(index, row) {
      this.$confirm(this._('BanCoMuonXoa'), this._('Warning'), {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(() => {
        this.formData.list_option.splice(index, 1);
      });
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    handleEdit(index, row) {
      this.showPopup(true);
      this.isNew = false;
      this.title = 'Cập Nhật Thông Tin';
      let cloneDeepRow = _.cloneDeep(row);
      console.log('cloneDeepRow', cloneDeepRow);
      this.formData = {
        option_code: cloneDeepRow.option_code,
        option: cloneDeepRow.option,
        option_detail: '',
        option_range_from: 0,
        option_range_to: 0,
        option_score: 0,
        isFormToQuestion: cloneDeepRow.isFormToQuestion,
        list_option: cloneDeepRow.declaredetails,
      };
    },

    handleAddNew() {
      this.showPopup(true);
      this.isNew = true;
      this.title = 'Tạo Thông Tin';
      this.formData = {
        option_code: '',
        option: '',
        option_detail: '',
        option_range_from: 0,
        option_range_to: 0,
        option_score: 0,
        isFormToQuestion: false,
        list_option: [],
      };
    },

    handleDelete(index, row) {
      this.$confirm(this._('BanCoMuonXoa'), this._('Warning'), {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }).then(() => {
        this.deleteCicCfg({ id: row._id, query: this.query });
      });
    },

    handleSave() {
      //validate form
      if (!this.formData.option) {
        toastr.error('Vui lòng câu hỏi');
        return;
      }

      if (this.formData.list_option && this.formData.list_option.length == 0) {
        toastr.error('Vui lòng tạo câu trả lời');
        return;
      }

      this.formData.isNew = this.isNew;
      let params = {
        data: this.formData,
        query: this.query,
      };
      this.saveDeclare(params);
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

    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    generateProductKey() {
      let tokens = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        chars = 5,
        segments = 4,
        keyString = '';

      for (let i = 0; i < segments; i++) {
        let segment = '';
        for (let j = 0; j < chars; j++) {
          let k = this.getRandomInt(0, 35);
          segment += tokens[k];
        }
        keyString += segment;
        if (i < segments - 1) {
          keyString += '-';
        }
      }
      return keyString;
    },
  },
  watch: {},

  created() {
    //this.fullloading = true;
    this.getData(this.query);
  },

  mounted() {
    // this.$watch('formSearch.searchText', val => {
    //   this.getData(this.query);
    // });
  },
};
</script>
<style lang='scss' scope>
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

.paddingLeft10 {
  padding-left: 10px;
}

.paddingLeft40 {
  padding-left: 40px;
}
</style>
