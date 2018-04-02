<template lang="pug">
  b-card
    el-form.demo-form-inline(:models='formSearch', inline=true, @submit.native.prevent="onTextSearchEnter")
      el-form-item
        el-input(:placeholder='_("EnterYourSearch")', v-model='formSearch.txtName', @keyup.enter.native='onTextSearchEnter($event)')           
      el-form-item
        el-button(type='primary', icon='search',@click='metOnSearch') {{_('Search')}}
      el-form-item    
        el-button(type='success', icon='plus', @click='handleAddNew()') {{_('Add')}}
    br
    el-row
      el-table(ref='multipleTable', :data='usersLs', border='', style='width: 100%', @selection-change='handleSelectionChange')      
        el-table-column(:label='_("HanhDong")', width='120')
          template(slot-scope='scope')
            el-tooltip.item(effect='dark', content='Sửa', placement='left-start')
              el-button(size='small', @click='handleEdit(scope.$index, scope.row)', icon='el-icon-edit')
            el-tooltip.item(effect='dark', content='Xóa', placement='right-start' )
              el-button(size='small', type='danger', @click='handleDelete(scope.$index, scope.row)', icon='el-icon-delete', v-if='scope.row.username !== loginUsername')  
        el-table-column(prop='username',:label='_("TenDangNhap")', width='200')
        el-table-column(prop='fullName',:label='_("Hoten")', width='280')
        el-table-column(label='Email', prop='email', width='280')
        el-table-column(:label='_("SoDienThoai")', prop='phone', width='200')
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
      el-form(:model='formData', label-width='120px',  :rules="user_rules", ref="validate_user" )
        el-form-item(:label='_("TenDangNhap")', prop='username')
          el-input(v-model='formData.username',:disabled='!isNewUser')
        el-form-item(:label='_("Hoten")', prop='fullName')
          el-input(v-model='formData.fullName')
        el-form-item(:label='_("Password")', prop='password')
          el-input(type='password',v-model='formData.password', :placeholder='passwordPlaceholder')
        el-form-item(label='Email', prop='email')
          el-input(v-model='formData.email')
        el-form-item(:label='_("SoDienThoai")', prop='phone')
          el-input(v-model='formData.phone')
        el-form-item(:label='_("Roles")')
          el-select(v-model='formData.user_type', placeholder='Select')
            el-option(v-for='item in roles', :key='item.value', :label='item.label', :value='item.value')
        el-form-item(label='Logo Url')
          el-input(v-model='formData.logo_url', placeholder='Logo này sẽ hiển thị ở D/s đơn vị đồng ý khi user check CIC')
        el-form-item(label='Disable')
          el-switch(v-model='formData.disableFlg', active-color='#13ce66')
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
    ...mapGetters('user', ['usersLs', 'total', 'dialog', 'roles']),
    ...mapGetters('session', ['me']),
    query() {
      return {
        txtName: this.formSearch.txtName,
        size: this.pageSize,
        skip: this.pageSize * (this.currentPage - 1)
      };
    },
    loginUsername() {
      return this.me ? this.me.username : ''
    },
  },

  data() {
    const validatePassword = (rule, value, callback) => {
      if(this.isNewUser){
        if (!value) {
          callback(new Error(this._('rule_password_empty')));
        }else {
          if(value.length < 6)
            callback(new Error(this._('rule_password_length')));
          else
            callback();
        }
      }
      else{
        if (!value) {
          callback();
        }else {
          if(value.length < 6)
            callback(new Error(this._('rule_password_length')));
          else
            callback();
        }
      }
    }

    return {
      currentPage: 1,
      pageSize: 5,
      pageSizes: [5, 10, 20, 50, 100, 200, 500],
      isNewUser: false,
      formSearch: {
        txtName: ''
      },
      title: '',
      formData: {
        _id : '',
        username: '',
        fullName: '',
        password: '',
        email: '',
        phone: '',
        logo_url : '',
        user_type: 'user',
        disableFlg: false,
      },
      user_rules : {
        username : [
          { required: true, message: this._('rule_username'), trigger: 'blur' }
        ],fullName : [
          { required: true, message: this._('rule_fullname'), trigger: 'blur' }
        ],password : [
          { validator: validatePassword, trigger: 'blur' }
        ],email : [
          { type: 'email', required: true, message: 'Mail không hơp lệ', trigger: 'blur' }
        ],phone : [
          { required: true, message: this._('rule_phone'), trigger: 'blur' }
        ],
      },
      passwordPlaceholder: '',
      
    };
  },

  methods: {
    ...mapActions('user', [
      'getUsers',
      'saveUsers',
      'deleteUser',
      'showPopup'
    ]),

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEdit(index, row) {
      this.showPopup(true);
      this.isNewUser = false;
      this.title = 'Thay đổi thông tin của : ' + '"' + row.username + '"';
      this.passwordPlaceholder = 'Nhập Mật Khẩu Mới Nếu Bạn Muốn Đỗi Mật Khẩu';
      this.formData = {
        _id : row._id,
        username: row.username,
        email: row.email,
        fullName: row.fullName,
        phone: row.phone,
        password: '',
        logo_url: row.logo_url,
        id: row._id,
        user_type: row.user_type,
        disableFlg: row.disableFlg
      };
    },

    handleAddNew() {
      this.showPopup(true);
      this.isNewUser = true;
      this.title = 'Tạo Tài Khoản';
      this.passwordPlaceholder = '';      
      this.formData = {
        _id : '',
        username: null,
        email: null,
        fullName:  null,
        phone:  null,
        password: null,
        companyName: '',
        id: null,
        logo_url : '',
        user_type: 'user',
        disableFlg: false
      };
    },

    handleDelete(index, row) {
      this.$confirm(this._('BanCoMuonXoa'), this._('Warning'), {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.deleteUser({id : row._id, query: this.query});
      });
    },

    handleSave() {
      this.$refs['validate_user'].validate(valid => {
          if (valid) {
            let params = {
              data: this.formData,
              query: this.query
            }
            this.saveUsers(params);
          }
          else{ return false;}
      });
    },

    metOnSearch() {
      this.getUsers(this.query);
    },

    onTextSearchEnter(event) {
      event.preventDefault();
      this.getUsers(this.query);
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.getUsers(this.query);
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getUsers(this.query);
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY HH:mm:ss');
    }
  },

  watch: {},

  created() {
    this.getUsers(this.query);
  },

  mounted() {
    // this.$watch('formSearch.txtName', val => {
    //   this.getUsers(this.query);
    // });
  }
};
</script>
<style lang='scss'>
.el-dialog {
  width: 80% !important;
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
