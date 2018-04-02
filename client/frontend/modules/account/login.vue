<template lang="pug">
.page-header(filter-color="orange")
  .page-header-image
  .content
    .container
      .col-md-5.ml-auto.mr-auto
        .card.card-login.card-plain
          form(action='/auth/local', method='POST')
            .card-header.text-center
              .logo-container
                img(src='~images/logo_small.png', alt='')
            .card-body
              .input-group.form-group-no-border.input-lg
                .input-group-prepend
                  span.input-group-text
                    i.now-ui-icons.users_circle-08
                input.form-control(name='username', type='text', :placeholder='_("YourUsernameOrEmailAddress")')
              .input-group.form-group-no-border.input-lg
                .input-group-prepend
                  span.input-group-text
                    i.now-ui-icons.objects_key-25
                input.form-control(name='password', type='password', :placeholder='_("Password")')
            .card-footer.text-center
              button.btn.btn-primary.btn-round.btn-lg.btn-block(type='submit') {{_("Login")}}
            .pull-left
              h6
                a.link.footer-link(href='/fogot') {{_("ForgotYourPassword")}}
</template>

<script>
export default {
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
  },
};
</script>

<style lang="scss" scoped>
.page-header {
  &:after,
  &:before {
    position: relative;
    z-index: 0;
    width: 100%;
    height: 100%;
    display: block;
    left: 0;
    top: 0;
    content: '';
  }
}
.page-header-image {
  background-image: url('~images/bg/login.jpg');
}
</style>
