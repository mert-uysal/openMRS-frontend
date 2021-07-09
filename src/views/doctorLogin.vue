<template>
  <div class="ui middle aligned center aligned grid">
    <div class="column">
      <h2 class="ui image header">
        <div class="content">
          Log-in to your account
        </div>
      </h2>
      <form action="#" method="get" class="ui large form">
        <div class="ui stacked secondary  segment">
          <div class="field">
            <div class="ui left icon input">
              <i class="user icon"></i>
              <input type="text" name="username" placeholder="Kullanıcı Adı" v-model="userInfo.username">
            </div>
          </div>
          <div class="field">
            <div class="ui left icon input">
              <i class="lock icon"></i>
              <input type="password" name="password" placeholder="Parola" v-model="userInfo.password">
            </div>
          </div>
          <div class="ui fluid large teal submit button" @click="login()" v-on:keyup.enter="login()">Giriş</div>
        </div>

        <div class="ui error message"></div>

      </form>

      <div class="ui message">
        New to us? <a href="https://s.codepen.io/voltron2112/debug/PqrEPM?">Register</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "doctorLogin",
  data() {
    return {
      userInfo: {
        username: "",
        password: "",
      }
    }
  },

  methods: {
    login() {

    }
  }
}
</script>

<style scoped>
body > .grid {
  height: 100%;
}

.image {
  margin-top: -100px;
}

.column {
  max-width: 450px;
}
</style>