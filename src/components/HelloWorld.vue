<template>
  <div class="hello">
    <img alt="Vue logo" src="../assets/logo.png">
    <h1>{{ hello }}</h1>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'HelloWorld',
  data() {
    return {
      hello: {}
    }
  },
  created() {
    axios.get("http://localhost:8081/api/hello").then((response) => {
      this.hello = response.data;
      console.log(response)
    });
  }
}
</script>

<style>
</style>
