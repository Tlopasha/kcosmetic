<template lang="pug">
  .wrapper
    .page-header.page-header-small
      .page-header-image(data-parallax='true')
      .content-center
        .row
          .col-md-8.ml-auto.mr-auto
            h1.title Câu Hỏi Thường Gặp
    .main
      .section.section-frequently
        .container
          //- .text-center
          //-   h3.title Câu Hỏi Thường Gặp
          .row
            .col-md-6.ml-auto
              .info.info-horizontal
                .icon.icon-success
                  i.now-ui-icons.shopping_credit-card
                .description
                  h4.info-title 1. Làm sao để biết Điểm Tín Dụng của bản thân?
                  p
                    | Để kiểm tra Điểm Tín Dụng và nhận kết quả về khoản vay phù hợp, bạn vui lòng truy cập website http://me.creditscore.vn/ , điền thông tin và làm theo hướng dẫn nhắn tín với cú pháp "Credit _CMND/CCCD" gửi đến 8077
            .col-md-6.mr-auto
              .info.info-horizontal
                .icon.icon-success
                  i.now-ui-icons.shopping_box
                .description
                  h4.info-title 2. Việc có khoản vay phù hợp có phải là điều kiện bắt buộc tôi phải vay không?
                  p Việc kiểm tra Điểm Tín Dụng chỉ mang tính chất tham khảo thông tin về khoản vay phù hợp. Bạn có thể chọn lựa Gửi hồ sơ hoặc không và cũng hoàn toàn có thể thay đổi quyết định vay khi có nhân viên ngân hàng gọi điện tư vấn.
            
          .row
            .col-md-6.mr-auto
              .info.info-horizontal
                .icon.icon-success
                  i.now-ui-icons.files_single-copy-04
                .description
                  h4.info-title 3. Tôi đã gửi hồ sơ, cần làm gì tiếp theo?
                  p
                    | Nếu bạn nhận được khoản vay phù hợp và đã gửi hồ sơ trong quá trình kiểm tra điểm tín dụng, trong vòng 24h – 48h (trừ ngày nghỉ), sẽ có nhân viên tư vấn gọi điện để hỗ trợ bạn hoàn thiện hợp đồng vay. 
            .col-md-6.ml-auto
              .info.info-horizontal
                .icon.icon-success
                  i.now-ui-icons.business_briefcase-24
                .description
                  h4.info-title 4. Tại sao tôi chưa có khoản vay phù hợp khi kiểm tra điểm tín dụng?
                  p
                    | Nếu nhận được thông báo chưa có khoản vay phù hợp, có nghĩa là điểm tín dụng của bạn khá thấp và chưa đủ điều kiện được vay.
          .row
            .col-md-6.mr-auto
              .info.info-horizontal
                .icon.icon-success
                  i.now-ui-icons.files_box
                .description
                  h4.info-title 5. Việc kiểm tra điểm và gửi hồ sơ vay trên CreditScore có mất phí không?
                  p Việc này hoàn toàn miễn phí, CreditScore không thu bất kỳ khoản phí nào của khách hàng. 
            .col-md-6.mr-auto
              .info.info-horizontal
                .icon.icon-success
                  i.now-ui-icons.business_bulb-63
                .description
                  h4.info-title 6.  Điều kiện để vay?
                  p CreditScore xét duyệt điểm tín dụng dựa vào thông tin cá nhân bạn cung cấp và đưa ra khoản vay phù hợp. Để kiểm tra điều kiện vay hiện tại, bạn vui lòng hoàn tất điền thông tin CMND và làm theo hướng dẫn. Kết quả chấm điểm và khoản vay sẽ có trong vòng 60s khi bạn hoàn tất việc đăng ký.
          .row
            .col-md-6.ml-auto
              .info.info-horizontal
                .icon.icon-success
                  i.now-ui-icons.business_money-coins
                .description
                  h4.info-title 7. Tôi đang có khoản vay tại ngân hàng khác thì có thể vay tiếp được không?
                  p Bạn vẫn có cơ hội vay trong trường hợp đang có khoản vay tại ngân hàng khác. Để biết chính xác mình có đủ điều kiện hay không, bạn vui lòng hoàn tất quy trình chấm điểm tín dụng của CreditScore 
                    a(href="http://me.creditscore.vn/") tại đây
            .col-md-6.mr-auto
              .info.info-horizontal
                .icon.icon-success
                  i.now-ui-icons.education_hat
                .description
                  h4.info-title 8. Tôi phải đạt các điều kiện gì để có khoản vay phù hợp?
                  p Các tiêu chí đánh giá thông tin của khách hàng trước khi đưa ra khoản vay phù hợp được Credit Score tính toán tự động, vì thế, bạn chỉ có thể biết được mình đủ điều kiện vay hay không chứ không biết được lý do cụ thể là do tiêu chí nào.
    app-footer
</template>

<script>
import { Footer as AppFooter } from 'fecore/components';
import toastr from 'fecore/toastr';

export default {
  components: {
    AppFooter,
  },

  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
.section-frequently {
  padding-top: 50px !important;
}
.page-header-image {
  background-image: url('~images/bg/bg37.jpg');
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
