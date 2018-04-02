<template lang="pug">
.page-header.section-image
  .page-header-image
  .container
  
    .col-md-8.ml-auto.mr-auto.paddingTop
      .card.card-signup
        .card-body
          h4.card-title.text-center Chấm điểm tín dụng
          el-form.demo-ruleForm(:model='formData', label-width='240px', label-position="right")
            el-form-item(label='Họ Tên', prop='name')
              el-input(v-model='formData.name', size="medium")
            el-form-item.gender(label='Giới Tinh')
              el-radio-group.check-box-padding-top(v-model='formData.gender')
                el-radio(label='Nam')
                el-radio(label='Nữ')
            el-form-item.gender(label='Năm Sinh')
              el-date-picker.width200(v-model='formData.year', type='year', placeholder='Pick a year', size="medium")
            el-form-item.gender(label='Đã Lập Gia Đình')
              el-radio-group.check-box-padding-top(v-model='formData.status')
                el-radio(label='Yes')
                el-radio(label='No')
            el-form-item.gender(label='Có Mấy Con')
              el-input-number(v-model='formData.childrenNo', :min='0', :max='10', size="medium")
            el-form-item(label='Thu Nhập Trung Bình/Tháng', prop='name')
              el-input(placeholder='Please input', v-model='formData.salaryNo', size="medium")
                template(slot='append') Triệu/Tháng
            el-form-item(label='Công ty đang làm việc', prop='region')
              //- el-select.fullWidth(v-model='formData.region', placeholder='Chọn Công Ty ...', size="medium")
              //-   el-option(label='Freelancer', value='shanghai')
              //-   el-option(label='Zone two', value='beijing')
              el-select.fullWidth(v-model='formData.region', size="medium"
                        filterable='', clearable='',
                        remote='', reserve-keyword='', 
                        placeholder='Nhập Tên Công Ty', 
                        :remote-method='remoteMethod', :loading='loading')
                el-option(v-for='item in options4', :key='item.value', :label='item.label', :value='item.value')
                  span(style='float: left') {{ item.label }}
                  span(style='float: right; color: #8492a6; font-size: 13px') {{ item.value }}


            el-form-item(label='Khoảng muốn vay', prop='wantMuch')
              el-input(v-model='formData.wantMuch',size="medium")
            el-form-item(label='Tel', prop='phone')
              el-input(v-model='formData.phone', size="medium")
            el-form-item(label='Email', prop='email')
              el-input(v-model='formData.email', size="medium")
            .card-footer.text-center
              a.btn.btn-primary.btn-round(@click='onFormSubmit') CHẤM ĐIỂM

  app-footer
</template>

<script>
import { Footer as AppFooter } from 'fecore/components';
import toastr from 'fecore/toastr';
export default {
  components: {
    AppFooter,
  },

  data() {
    return {
      formData: {
        name: '',
        gender: '',
        year: '',
        status: '',
        childrenNo: '',
        salaryNo: '',
        workingIn: '',
        wantMuch: '',
        phone: '',
        email: '',
      },

      options4: [],
      value9: [],
      list: [],
      loading: false,
      states: [
        'Alabama',
        'Alaska',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'Florida',
        'Georgia',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Pennsylvania',
        'Rhode Island',
        'South Carolina',
        'South Dakota',
        'Tennessee',
        'Texas',
        'Utah',
        'Vermont',
        'Virginia',
        'Washington',
        'West Virginia',
        'Wisconsin',
        'Wyoming',
      ],
    };
  },

  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },

  mounted() {
    this.list = this.states.map(item => {
      return { value: item, label: item };
    });
  },

  methods: {
    onFormSubmit() {
      toastr.info('onFormSubmit');
    },

    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options4 = this.list.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.options4 = [];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.page-header {
  min-height: 100vh;
  max-height: 999px;
  padding: 0;
  color: #ffffff;
  position: relative;
  overflow: hidden;
}
.page-header-image {
  background-image: url('~images/bg/bg18.jpg');
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.el-form-item {
  margin-bottom: 10px !important;
}

.check-box-padding-top {
  padding-top: 7px !important;
}

.fullWidth {
  width: 100%;
}

.width200 {
  width: 200px;
}

.paddingTop {
  padding-top: 100px;
}
</style>
