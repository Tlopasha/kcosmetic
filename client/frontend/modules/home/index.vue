<template lang="pug">
div(v-loading.fullscreen.lock='fullloading') 
  el-row(v-if='fullloading', :gutter="20", class='el-counttime')
    el-col(:span="6")    
      div(class="block")
        p(class="digit") {{time.second}}     
  el-row
    .page-header.section-image
      .page-header-image
      .content
        .container
            transition(name='fade')
              .row(v-if='!visableFinal')
                //- transition(name='fade')
                depth-form(@tinhlaidiem='onSubmitRecalculate', 
                            @commitData='onChangeCurrency',
                            :isRescored = 'isRescored',
                            :lstDeclare = 'lstDeclare',
                            :formData = 'lstDeclareDefault',
                            :progressNo='progressNo',
                            v-if='visableDepth'
                )
                            
                home-form(@submit="onSubmitHomeForm", 
                          :time='time',
                          :formCic='formCic',
                          :progressNo='progressNo',
                          :visableResult='visableResult',
                          v-if='!visableDepth'
                )


                guide-form(
                  v-if='!visableResult'
                )

                //- transition(name='fade')
                result(@submit='onSubmitResult',
                      @submitSend='onSubmitSend',
                      @onSelectMultipleImage='onSelectMultipleImage',
                      @onFormBackToBeign='onFormBackToBeign',
                      :dataResult='dataResult',
                      :visableDepth='visableDepth' ,
                      :visableResult='visableResult',
                      :showDepthPoint='showDepthPoint',
                      :isRescored = 'isRescored',
                      :isDenied = 'isDenied',
                      v-if='visableResult'
                )
            transition(name='fade')
              .row
                final-form(
                  v-if='visableFinal',
                  :lstDeclare='lstDeclare',
                  :lstDeclareDefault='lstDeclareDefault',
                  :dataResult='dataResult',
                  :selectedCompany='selectedCompany',
                  @onFinalBack='onFinalBack',
                  @onFinalSend='onFinalSend',
                )
                
                
  app-footer
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Footer as AppFooter } from 'fecore/components';
import toastr from 'fecore/toastr';
import HomeForm from './components/form';
import DepthForm from './components/depth';
import GuideForm from './components/guide';
import FinalForm from './components/final';
import Result from './components/result';
import { randomIntFromInterval } from '../../../common';
import { ENETUNREACH } from 'constants';

export default {
  components: {
    AppFooter,
    HomeForm,
    DepthForm,
    Result,
    GuideForm,
    FinalForm,
  },

  data() {
    return {
      formCic: {
        id: '',
        verifyCode: '',
        ref: '',
      },

      visableFinal: false,
    };
  },

  computed: {
    ...mapGetters('home', [
      'lstDeclare',
      'lstDeclareDefault',
      'fullloading',
      'time',
      'progressNo',
      'visableResult',
      'visableDepth',
      'dataResult',
      'isRescored',
      'showDepthPoint',
      'selectedCompany',
      'isDenied'
    ]),
    currentYear() {
      return new Date().getFullYear();
    },
  },

  methods: {
    ...mapActions('home', [
      'getData',
      'checkCic',
      'changeTime',
      'turnFullLoading',
      'turnVisableDepth',
      'turnVisableResult',
      'turnIsRescored',
      'depthRescore',
      'sendFinalResult',
      'turnshowDepthPoint',
      'updateData',
      'updateSelectedCompany',
      'setDefaultValue',
      'turnIsDenied'
    ]),

    onSelectMultipleImage(data) {
      this.updateSelectedCompany(data);
    },

    onFinalBack() {
      this.visableFinal = false;
    },

    onFormBackToBeign() {
      this.getData();
      this.visableFinal = false;
      this.setDefaultValue();
    },

    onFinalSend() {
      this.$alert(
        'Đơn vị đồng ý cho vay sẽ liên lạc với bạn trong vòng 60 phút</br>Chúc bạn may mắn',
        'Thông Báo',
        {
          confirmButtonText: 'OK',
          dangerouslyUseHTMLString: true,
          callback: action => {
            this.sendFinalResult({
              cicResult: this.dataResult,
              selectedCompany: this.selectedCompany
            });

            this.getData();
            this.visableFinal = false;
            this.setDefaultValue();
            
            this.formCic = {
              id: '',
              verifyCode: '',
              ref: '',
            };
          },
        },
      );
    },

    onSubmitSend() {
      if (this.selectedCompany.length > 0) {
        this.visableFinal = true;
        console.log(
          'selectedCompany',
          this.selectedCompany,
          'dataResult',
          this.dataResult,
        );
      } else {
        if(this.dataResult.agree_company.length == 0){
          toastr.info('Hiên tất cả đối tác ngân hàng đã nhận đủ hồ sơ, Vui liên hệ với nhân viên !');

        }else{
          toastr.warning('Vui lòng chọn đơn vị đồng ý !');
        }
      }
    },

    onSubmitResult() {
      this.turnVisableDepth(true);
    },

    onSubmitHomeForm() {
      this.checkCic(this.formCic);
    },

    onChangeCurrency(data) {
      this.updateData(data);
    },

    onSubmitRecalculate(requiredForm) {
      this.depthRescore({
        requiredForm: requiredForm,
        dynamicForm: this.lstDeclare,
        cicForm: this.formCic,
        cicResult: this.dataResult,
      });
    },
  },

  created() {
    this.getData();
    const { ref } = this.$route.query;
    this.formCic.ref = ref;
    //this.turnVisableDepth(true);
    //this.turnVisableResult(true);
  },
};
</script>

<style lang="scss">
.page-header {
  min-height: 100vh;
  max-height: 999px;
  padding: 0;
  color: #2c2c2c !important;
  position: relative;
  overflow: hidden;
  /deep/ .content {
    text-align: left;
  }
  /deep/ .container {
    color: #2c2c2c !important;
  }
}
.page-header-image {
  background-image: url('~images/bg/pricing1.jpg');
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 100%;
  z-index: -1;
}

// .removeBorder > input {
//   border: none !important;
// }

// .el-form-item {
//     margin-bottom: 10px !important;
// }

.fade-main-enter-active,
.fade-main-leave-active {
  transition: opacity 0.5s;
}
.fade-main-enter,
.fade-main-leave-to {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.3s ease;
}

.fade-enter {
  transform: translateX(10px);
  opacity: 0;
}

/*** fullloading ****/
.el-loading-mask.is-fullscreen {
  background-color: rgba(44, 62, 80, 0.9) !important;
}

.el-loading-spinner {
  display: none;
}
.el-counttime {
  position: fixed;
  z-index: 11000;
  // height: 100%;
  width: 700px;
  left: 30%;
  top: 40%;
  right: 0;
  margin-left: auto !important;
  margin-right: auto !important;
  margin: 0 auto;
}
.block {
  display: flex;
  flex-direction: column;
}

.text {
  color: #1abc9c;
  font-size: 40px;
  font-family: 'Roboto Condensed', serif;
  font-weight: 400;
  margin-top: -30px;
  margin-bottom: 10px;
  text-align: center;
}

.digit {
  color: #ecf0f1;
  font-size: 100px;
  font-weight: 100;
  font-family: unset;
  // margin: 10px;
  text-align: center;
}
</style>
