<template>
  <div id="app">
    <Navbar v-if="currentUser" class="mb-5"></Navbar>
    <router-view/>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
import axios from "axios";

export default {
  name: 'App',
  components: {Navbar},
  data() {
    return {
      currentUser: {},
      userData: {},
    }
  },
  created() {
    this.checkLoginStatus();
    //this.checkUserdata();
    console.log("current user: " + this.currentUser);
  },
  watch: {
    $route() {
      this.checkLoginStatus();
    },
  },
  methods: {
    checkLoginStatus() {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!this.currentUser) {
        if (this.$route.name !== 'doctorRegister' && this.$route.name !== 'doctorLogin') {
          this.$router.push('/login');
        }
      } else {
        this.getUserData();
        if (this.$route.name === 'doctorLogin') {
          this.$router.push('/');
        }
      }
    },
    checkUserdata() {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (this.currentUser === null) {
        this.getUserData();
      }
    },
    getUserData() {
      axios.post('http://localhost:8081/api/login/', this.currentUser)
          .then((response) => {
            console.log("getting user data success")
            this.userData = response.data.data;
            localStorage.setItem('userData', JSON.stringify(this.userData));
          })
          .catch(error => {
            console.log("getting user data failed");
            console.log(error);
          })
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
