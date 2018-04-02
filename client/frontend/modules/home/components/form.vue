<template lang="pug">

  .col-md-6.ml-auto.mr-auto
    .card.card-signup
      .card-body
        h4.card-title.text-center Chấm điểm tín dụng
        el-form.demo-ruleForm(:model='formCic', label-width='120px', :rules="lstRule", ref="mainForm" )
          el-form-item(label='CMND', prop='id', required)
            el-input(v-model='formCic.id', size="medium", placeholder="Nhập CMND hoặc CCCD")
          el-form-item(label='Mã xác nhận', prop='verifyCode')
            el-input(v-model='formCic.verifyCode', size="medium", placeholder="Nhập Mã Xác Nhận")
          .card-footer.text-center
            a.btn.btn-info.btn-round(@click='onFormSubmit', style='color: #fff;', :disabled='progressNo != 0') CHẤM ĐIỂM

          .progress-area(v-if='progressNo != 0')
            el-progress(:text-inside='true', :stroke-width='18', :percentage='progressNo', color="#8e71c7")

          //- el-progress(:percentage='progressNo', v-if='progressNo != 0') 
          //- status="success")

</template>

<script>
import { randomIntFromInterval, checkValidIdentify } from '../../../../common';
export default {
  props: {
    isDenied: Boolean,
    visableResult: Boolean,
    progressNo: Number,
    formCic: {
      id: '',
      verifyCode: '',
    },
  },

  computed: {
    isShowDepthChecking() {

      if (!this.visableResult) {
        return true;
      }

      return false;
    },
  },

  data() {
    const validateIdentify = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Không được để trống'));
      } else if (!checkValidIdentify(value)) {
        callback(new Error('CMND hoặc CCCD không đúng'));
      } else {
        callback();
      }
    };

    return {
      lstRule: {
        id: [{ validator: validateIdentify, trigger: 'blur' }],
        verifyCode: [
          { required: true, message: 'Không được để trống', trigger: 'blur' },
        ],
      },
    };
  },

  methods: {
    onFormSubmit() {
      this.$refs['mainForm'].validate(valid => {
        if (valid) {
          this.$emit('submit');
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.progress-area {
  padding: 20px 0px 10px 0px;
}
</style>
