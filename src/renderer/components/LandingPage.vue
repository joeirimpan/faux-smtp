<template>
  <div id="wrapper">
    <mail></mail>
  </div>
</template>

<script>
  import Mail from './LandingPage/Mail';

  export default {
    name: 'landing-page',
    components: { Mail },
    methods: {
      open(link) {
        this.$electron.shell.openExternal(link);
      },
    },
  };
</script>

<style>
</style>