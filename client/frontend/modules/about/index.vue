<template lang="pug">
//- .wrapper
//- 	.page-header.page-header-small
//- 		.page-header-image(data-parallax='true')
//- 		.content-center
//- 			.row
//- 				.col-md-8.ml-auto.mr-auto
//- 					h1.title Về Chúng Tôi
//- 					h4 	Sử dụng công nghệ Chấm Điểm Tín Dụng của Fibo. Website này giúp mỗi người "tự biết điểm Tín Dụng Cá Nhân hiện tại" và tìm được Đơn Vị Cho Vay Tín Dụng (vay không cần thế chấp). 
//- 	.section.padding-top-custom
//- 		.about-description.text-center
//- 			.features-3
//- 				.container
//- 					.row
//- 						.col-md-8.mr-auto.ml-auto
//- 							h2.title Simpler. Smarter. Faster.
//- 							h4.description
//- 								| The CloudCheckr Cloud Management Platform (CMP) provides full visibility and control to reduce costs, improve cybersecurity posture, and automate critical tasks.
.wrapper
  .page-header.page-header-small
    .page-header-image(data-parallax='true')
    .content-center
      .row
        .col-md-8.ml-auto.mr-auto
          h1.title Về Chúng Tôi
          h4 Sử dụng công nghệ Chấm Điểm Tín Dụng của Fibo. Website này giúp mỗi người "tự biết điểm Tín Dụng Cá Nhân hiện tại" và tìm được Đơn Vị Cho Vay Tín Dụng (vay không cần thế chấp). 
  .section
    .about-description.text-center
      .features-3
        .container
          .row
            .col-md-8.mr-auto.ml-auto
              h2.title Simpler. Smarter. Faster.
              h4.description
                | Các đơn vị Chấp Nhận Cho Vay trên hệ thống là các đơn vị đã được xác thực bởi Ngân Hàng Nhà Nước Việt Nam. Chỉ cần 60s, biết ngay Điểm Tín Dụng Cá Nhân (và Đơn Vị Cho Vay Tín Chấp) Xem thêm 
                a(href="http://creditscore.vn/") tại đây

          .row.padding-top
            .col-md-10.mr-auto.ml-auto
              .card.card-background.card-background-product.card-raised.img1
                .card-body
                  h2.card-title @CreditScore.vn
                  p.card-description
                    | CreditScore.vn là 01 sản phẩm công nghệ của Fibo, chuyên sử dụng để Tính Điểm Tín Dụng của 01 người bất kỳ. Hệ thống Credit Score là một hệ thống tính toán suy luận dựa trên tổ hợp của nhiều công nghệ gộp lại (DataWarehouse, BigData, AI, Neuron Network, Deep Learning). 
                  //label.badge.badge-neutral Analytics
            //- .col-md-6.ml-auto
            //-   .card.card-background.card-background-product.card-raised.img2
            //-     .card-body
            //-       h2.card-title Social Analytics
            //-       p.card-description
            //-         | Insight to help you create, connect, and convert. Understand Your Audience's Interests, Influence, Interactions, and Intent. Discover emerging topics and influencers to reach new audiences.
            //-       //label.badge.badge-neutral Analytics
  app-footer
</template>

<script>
import { Footer as AppFooter } from 'fecore/components';
import toastr from 'fecore/toastr';


export default {
  components: {
    AppFooter
  },

  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },

  methods: {
    
  },
};
</script>

<style lang="scss" scoped>
.padding-top-custom {
  padding-top: 50px !important; 
}
.signup-page /deep/ {
  .section {
    padding-top : 0px;
  }
}
.padding-top {
  padding-top: 150px !important;  
}
.page-header-image {
  background-image: url('~images/bg/bg32.jpg');
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.img1 {
  background-image: url('~images/bg/project8.jpg');
}

.img2 {
  background-image: url('~images/bg/project9.jpg');
}
</style>
