<template lang='pug'>
.profile
  .row
    .col-md-12
      .card
        .card-header
          h5.title Profile
        .card-body
          .row
            .col-md-6.pr-1
              .form-group
                label Username
                input.form-control(:value='profileData.username', disabled)
            .col-md-6.pl-1
              .form-group
                label Email
                input.form-control(:value='profileData.email', 
                                    @input="__u('email', $event.target.value, updateProfile)")
          .row
            .col-md-6.pr-1
              .form-group
                label Full Name
                input.form-control(:value='profileData.fullName', 
                                    @input="__u('fullName', $event.target.value, updateProfile)")
            .col-md-6.pl-1
              .form-group
                label Phone
                input.form-control(:value='profileData.phone', 
                                    @input="__u('phone', $event.target.value, updateProfile)")
          .row
            .col-md-6.pr-1
              .form-group
                label Reference ID
                input.form-control(:value='profileData.referal_key', 
                                  @input="__u('referal_key', $event.target.value, updateProfile)")

            .col-md-6.pl-1
              .form-group
                label API Key
                input.form-control(:value='profileData.api_key', 
                                  disabled)
          .row
            .col-md-6.pr-1
              .form-group
                label Referal Link
                p(style='padding-left: 20px;') {{`${apiBaseUrl}/?ref=${profileData.referal_key}`}}
          //- .row
          //-   .col-md-12
          //-     .form-group
          //-       label Address
          //-       input.form-control(:value='profileData.profile.location', 
          //-                         @input="__u('profile.location', $event.target.value, updateProfile)")
          .row
            .col-md-6
              .form-group
                button.btn.btn-round.btn-primary(type='primary', @click='onClickUpdateProfile') Update Profile
    //- .col-md-4
    //-   .card.card-user
    //-     .image
    //-       img(src='~images/bg/wg_blurred_backgrounds_8.jpg', :alt='profileData.fullName')
    //-     .card-body
    //-       .author
    //-         a
    //-           img.avatar.border-gray(:src='profileData.avatar', :alt='profileData.fullName')
    //-           h5.title {{profileData.fullName}}
          //p.description.text-center {{profileData.profile.about}}
  .row
    .col-md-12
      .card
        .card-header
          h5.title Change Password
        .card-body
          .row
            .col-md-12
              .form-group
                label Old Password
                input.form-control(type='text', placeholder='Home Address', v-model='formChangePass.oldPass')
          .row
            .col-md-12
              .form-group
                label New Password
                input.form-control(type='text', placeholder='Home Address', v-model='formChangePass.newPass')
          .row
            .col-md-6
              .form-group
                button.btn.btn-round.btn-info(type='info', @click='onClickChangePass') Update
</template>

<script>
import Vue from 'vue';
import { mapState, mapActions, mapMutations } from 'vuex';
import { apiBaseUrl } from '../../config';

export default {
  computed: {
    ...mapState('profile', ['profileData']),
  },

  /**
   * Set page schema as data property
   */
  data() {
    return {
      formChangePass : {
        oldPass : '',
        newPass : ''
      },
      apiBaseUrl : apiBaseUrl
    };
  },

  methods: {
    ...mapActions('profile', [
      'getProfile',
      'updateUser',
      'updatePassword',
      'updateProfile',
    ]),

    onClickUpdateProfile() {
      this.updateUser();
    },

    onClickChangePass() {
      delete this.profileData._id;
      this.updatePassword(this.formChangePass);
    },
  },

  /**
   * Call if the component is created
   */
  created() {
    this.getProfile();
  },
};
</script>

<style lang='scss' scoped>
.container {
  padding-bottom: 1rem;
}

.el-row {
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
