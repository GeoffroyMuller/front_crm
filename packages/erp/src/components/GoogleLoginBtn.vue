<template>
  <Button class="google-login-btn" variant="outlined" component="a" :href="url">
    <div class="google-login-btn-content">
      <svg
        fill="white"
        height="20px"
        width="20px"
        version="1.1"
        viewBox="0 0 210 210"
        xml:space="preserve"
      >
        <path
          d="M0,105C0,47.103,47.103,0,105,0c23.383,0,45.515,7.523,64.004,21.756l-24.4,31.696C133.172,44.652,119.477,40,105,40  c-35.841,0-65,29.159-65,65s29.159,65,65,65c28.867,0,53.398-18.913,61.852-45H105V85h105v20c0,57.897-47.103,105-105,105  S0,162.897,0,105z"
        />
      </svg>
      {{ $t("login-with-google") }}
    </div>
  </Button>
</template>

<script setup lang="ts">
import Button from "core/src/components/Button.vue";

const url =
  "https://accounts.google.com/o/oauth2/v2/auth" +
  "?client_id=468572197466-l2n79f5imnsb1738b3jem3cbivf7n9qq.apps.googleusercontent.com" +
  "&redirect_uri=http://localhost:3005/google/auth/callback" +
  "&scope=https://www.googleapis.com/auth/userinfo.email" +
  "%20" +
  "https://www.googleapis.com/auth/userinfo.profile" +
  "&response_type=code&access_type=offline&prompt=consent";
</script>

<style lang="scss">
.google-login-btn {
  border-color: #b33c31 !important;
  color: #b33c31 !important;
  svg {
    fill: #b33c31 !important;
  }
  &:hover {
    background-color: darken(#b33c31, 2%) !important;
    color: white !important;
    svg {
      fill: white !important;
    }
  }

  .google-login-btn-content {
    display: flex;
    align-items: center;
    gap: spacing(1);
  }
}
</style>
