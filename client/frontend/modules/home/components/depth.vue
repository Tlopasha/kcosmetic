<template lang="pug">
  .col-md-7.ml-auto.mr-auto
    .card.card-signup
      .card-body
        h4.card-title.text-center Làm Thủ Tục Nhanh
        //- el-form.custom-form(:model='formData', label-position="top", v-for='(item, index) in lstDeclare')
        //-   .row
        //-     .col-md-6
        //-       el-form-item(:label='item.option', :key='item.declaredetails[0].option_id')
        //-           el-input(v-model='item.declaredetails[0].option_id', size="medium")
        //-     .col-md-6
        //-        el-form-item(label='Giới Tinh')
        //-         el-radio-group.check-box-padding-top(v-model='formData.gender')
        //-           el-radio(label='Nam')
        //-           el-radio(label='Nữ')

        el-form.custom-form(:model='formData', label-position="top", :rules="lstRule", ref="mainForm" )

            .col-md-6
              el-form-item(label='Họ Tên')
                el-input(v-model='formData.name', size="medium", placeholder='Nhập Họ Tên')
       
            .col-md-6(v-for='(questionItem, index) in lstDeclare')
              //Giới Tính
              el-form-item(:label='questionItem.option', v-if='questionItem.option_code == "Q001"' )
                 el-radio-group(ref='questionItem._id', v-model="questionItem.value")
                  el-radio(v-for='(optionItem, index) in questionItem.declaredetails', :label='optionItem.option_detail', :value='optionItem.option_detail', :key='optionItem._id')
              //Năm Sinh
              el-form-item(:label='questionItem.option', v-else-if='questionItem.option_code == "Q002"' )
                el-input(ref='questionItem._id', size="medium", v-model="questionItem.value", placeholder="Nhập Năm Sinh")
              //Gia Đinh
              el-form-item(:label='questionItem.option', v-else-if='questionItem.option_code == "Q003"' )
                 el-radio-group(ref='questionItem._id', v-model="questionItem.value")
                  el-radio(v-for='(optionItem, index) in questionItem.declaredetails', :label='optionItem.option_detail', :value='optionItem.option_detail', :key='optionItem._id')
              //Bao Nhiêu Con
              el-form-item(:label='questionItem.option', v-else-if='questionItem.option_code == "Q004"' )
                el-input(ref='questionItem._id', size="medium", v-model="questionItem.value", placeholder="Nhập Số Con")
              //Có Đi Làm Hay Không
              el-form-item(:label='questionItem.option', v-else-if='questionItem.option_code == "Q005"' )
                 el-radio-group(ref='questionItem._id', v-model="questionItem.value")
                  el-radio(v-for='(optionItem, index) in questionItem.declaredetails', :label='optionItem.option_detail', :value='optionItem.option_detail', :key='optionItem._id')
              //Thu Nhập Bình Quân
              el-form-item(:label='questionItem.option', v-else-if='questionItem.option_code == "Q006"' )
                el-input(ref='questionItem._id', size="medium", v-model="questionItem.value", placeholder="25.000.000",  @keyup.native='formatThuNhap(questionItem.value, questionItem.option_code)')

            .col-md-6
              el-form-item(label='Khoảng muốn vay (Triệu)')
                el-input(v-model='formData.wantMuch',size="medium", placeholder="30.000.000",  @keyup.native='formatWantMuch($event)')
            .col-md-6
              el-form-item(label='Công ty đang làm việc')
                el-select.fullWidth(v-model='formData.company', size="medium"
                          filterable='', clearable='',
                          remote='', reserve-keyword='', 
                          placeholder='Bỏ Trống Nếu Bạn Không Có', 
                          :remote-method='remoteMethod', :loading='loading')
                  el-option(v-for='item in options4', :key='item.address', :label='item.name', :value='item.name')
                    span(style='float: left') {{ item.name }}
                    span(style='float: right; color: #8492a6; font-size: 13px') {{ item.address }}
          
            .col-md-6
              el-form-item(label='Số Điện Thoại', prop='phone', required)
                el-input(v-model='formData.phone', size="medium", placeholder="Nhập Số Điện Thoại")
            .col-md-6
              el-form-item(label='Email', prop='email')
                el-input(v-model='formData.email', size="medium", placeholder="Nhập Email")
            
            .card-footer.text-center
              div.footer-button
                //a.btn.btn-primary.btn-round(@click='onFormSubmit',  v-if='isRescored') GỬI HỒ SƠ
                a.btn.btn-info.btn-round(@click='onFormSubmitReCalc', :disabled='progressNo != 0', style='color: #fff;') CHẤM ĐIỂM LẠI

            .progress-area(v-if='progressNo != 0')
              el-progress(:text-inside='true', :stroke-width='18', :percentage='progressNo', color="#8e71c7")

</template>

<script>
import { Footer as AppFooter } from 'fecore/components';
import toastr from 'fecore/toastr';
import { checkValidPhoneNumber } from './../../../../common';

export default {
  props: {
    isRescored: Boolean,
    lstDeclare: Array,
    formData: {
        name: String,
        wantMuch: String,
        phone: String,
        email: String,
        company: String,
    },
    progressNo : Number,
  },
  components: {
    AppFooter,
  },

  data() {
    const validatePhoneNumber = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Không được để trống'));
      } else if (!checkValidPhoneNumber(value)) {
        callback(new Error('Số điện thoại không đúng'));
      } else {
        callback();
      }
    };

    return {
      options4: [],
      list: [],
      loading: false,
      states: [
        { name: 'DOU Network', address: '19A Cộng Hòa' },
        { name: 'LTV', address: '1 Sao Hỏa' },
        { name: 'FPT', address: '143 Nguyễn Thiện Thục' },
        { name: 'HashTech', address: '134 Trường Chinh' },
      ],

      lstRule: {
        phone: [{ validator: validatePhoneNumber, trigger: 'blur' }],
        email: [
          {
            type: 'email',
            required: true,
            message: 'Nhập đúng định dạng mail',
            trigger: 'blur',
          },
        ],
      },
    };
  },

  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },

  mounted() {
    // this.list = this.states.map(item => {
    //   return { value: item.name, label: item.address };
    // });
  },

  methods: {
    formatThuNhap(value, code) {
      let outputValue = this.formatCurrency(value);
      this.$emit('commitData', { value: outputValue, code });
    },

    formatWantMuch(event) {
      let value = event.target.value;
      this.formData.wantMuch = this.formatCurrency(value);
    },

    formatCurrency(inputValue) {
      if (inputValue) {
        return parseFloat(inputValue.replace(/\./g, ''))
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      }
      return '0';
    },

    // onFormSubmit() {
    //   this.$refs['mainForm'].validate(valid => {
    //     if (valid) {
    //       this.$emit('submit', this.formData);
    //       // this.formData.isNew = this.isNew;
    //       // let params = {
    //       //   data: this.formData,
    //       //   query: this.query
    //       // }
    //       // this.saveCicCfg(params);
    //     } else {
    //       return false;
    //     }
    //   });
    // },

    onFormSubmitReCalc() {
      this.$refs['mainForm'].validate(valid => {
        if (valid) {
          this.$emit('tinhlaidiem', this.formData);
        } else {
          return false;
        }
      });
    },

    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.options4 = this.states.filter(item => {
            return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
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
.card-body {
  /deep/ label {
    margin-bottom: 0px !important;
    padding: 0px;
  }
}

.el-form-item {
  margin-bottom: 1px !important;
}

.custom-form {
  text-align: left !important;
  /deep/ .col-md-6 {
    float: left;
  }
}

.footer-button {
  width: 100%;
  padding-top: 10px;
}

// .check-box-padding-top {
//   padding-top: 7px !important;
// }

.fullWidth {
  width: 100%;
}

.width200 {
  width: 200px;
}

.paddingTop {
  padding-top: 100px;
}

.progress-area {
  padding: 20px 0px 10px 0px;
}
</style>
