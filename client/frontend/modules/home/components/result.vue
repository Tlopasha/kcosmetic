<template lang="pug">
  .col-md-5.ml-auto.mr-auto
    .card.card-pricing(data-background-color='orange')
      .card-body.cus-body
        h4.card-title.cus-title Kết Quả
        ul.list-result
          li Điểm Tính Dụng : 
            b(v-if='showDepthPoint') {{dataResult.score}} Điểm
            b(v-else) {{dataResult.cic_point}} Điểm
          li Được vay trong khoảng : 
            b {{dataResult.loan}} Triệu VNĐ
          li Lãi xuất : 
            b {{dataResult.interest_rate}} %/Năm
          li Kỳ hạn tối đa : 
            b {{dataResult.duration}} tháng
        .agree-company-area(v-if='isShowAgreeCompany')
          h6.category Đơn Vị Đồng Ý
          vue-select-image(:data-images='dataResult.agree_company ? dataResult.agree_company : []', 
                            :is-multiple="true", 
                            @onselectmultipleimage='onSelectMultipleImage',
                            h='100',
                            w='100')
        
        
        //- img.logo-thumbnail(src='~images/OCB_logo.jpg', alt='')
        //- img.logo-thumbnail(src='~images/OCB_logo.jpg', alt='')

        //- img.logo-thumbnail(src='~images/OCB_logo.jpg', alt='')
        //- img.logo-thumbnail(src='~images/OCB_logo.jpg', alt='')
        //- img.logo-thumbnail(src='~images/OCB_logo.jpg', alt='')
            .card-footer.text-center
      
        .card-footer.text-center
          div.footer-button
            a.btn.btn-primary.btn-simple.btn-round(@click='onFormSubmit', v-if='!isDenied && !visableDepth') LÀM THỦ TỤC NHANH
            a.btn.btn-primary.btn-simple.btn-round(@click='onSubmitSentData',  v-if='isRescored') GỬI HỒ SƠ
            a.btn.btn-primary.btn-simple.btn-round(@click='onFormBackToBeign', v-if='visableDepth') QUAY LẠI

</template>

<script>
import VueSelectImage from 'vue-select-image';
// add stylesheet
require('vue-select-image/dist/vue-select-image.css');

export default {
  components: {
    VueSelectImage,
  },

  props: {
    isRescored: Boolean,
    isDenied: Boolean,
    visableDepth: Boolean,
    visableResult: Boolean,
    showDepthPoint: Boolean,
    dataResult: {
      score: String,
      loan: String,
      interest_rate: String,
      duration: String,
      agree_company: Array,
    },
  },
  data() {
    return {
    };
  },

    computed: {
      isShowAgreeCompany() {
        if(this.dataResult.agree_company && this.dataResult.agree_company.length > 0)
          return true;
        return false
      },
  },

  methods: {
    onSelectMultipleImage: function(data) {
      this.$emit('onSelectMultipleImage', data);
      //this.lstDeclareDefault = data;
      //this.imageSelected = Object.assign({}, this.imageSelected, data)
    },

    onFormSubmit() {
      this.$emit('submit');
    },

    onSubmitSentData() {
      this.$emit('submitSend');
    },

    onFormBackToBeign() {
      this.$emit('onFormBackToBeign');
    },

    metOk() {
      this.visableDepth = true;
    },
  },
};
</script>

<style  lang="scss" scoped>
.logo-thumbnail {
  margin-top: 10px;
  text-align: center;
  max-width: 100px;
  max-height: 100px;
  border-radius: 50% !important;
  -webkit-box-shadow: 0px 10px 25px 0px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 10px 25px 0px rgba(0, 0, 0, 0.3);
}

.cus-body {
  padding: 15px 20px !important;
}

.cus-title {
  margin-top: 15px !important;
}

.list-result {
  max-width: 100% !important;
}

// .agree-company-area {

// }
.card-pricing /deep/ .agree-company-area {
  /deep/ ul {
    max-width: 100%;
    /deep/ li {
      border-bottom: none;
      margin-left: 0px !important;
      padding: 0px !important;
    }
  }
}

.vue-select-image {
  /deep/ .vue-select-image__item {
    float: none !important;
    display: inline-block !important;
  }
}
.vue-select-image__wrapper {
  max-width: 100% !important;
}
</style>
