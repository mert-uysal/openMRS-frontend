<template>
  <div>
    <b-alert v-if="showNotify" class="mt-3 position-absolute top-0 end-0"
             :show="dismissCountDown"
             dismissible
             :variant="variant"
             @dismissed="dismissCountDown=0"
             @dismiss-count-down="countDownChanged">
      <p>{{ message }}</p>
      <b-progress
          v-if="isLoggedinSuccessfully"
          :variant="variant"
          :max="dismissSecs"
          :value="dismissCountDown"
          height="4px"></b-progress>
    </b-alert>
    <div class="ui middle aligned center aligned grid mt-5">
      <div class="column">
        <h2 class="ui image header">
          <div class="content">
            Hesabınıza Giriş Yapın
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
                <input v-on:keyup.enter="login(); showAlert()" type="password" name="password" placeholder="Parola"
                       v-model="userInfo.userPassword">
              </div>
            </div>
            <div>
              <b-button variant="info" class="btn btn login-button mb-4 ui fluid large teal submit button"
                        @click="login(); showAlert()">
                Giriş Yap
              </b-button>
            </div>
          </div>
          <div class="ui error message"></div>
        </form>
        <div class="ui message">
          Hesabınız Yok Mu? <a class="sign-up" @click="$router.push('/docRegistration')">Kaydol</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "doctorLogin",
  data() {
    return {
      userInfo: {
        userIdentityNum: "1",
        username: "",
        userPassword: "",
      },
      message: "",
      isLoggedinSuccessfully: true,
      showNotify: false,
      dismissSecs: 5,
      dismissCountDown: 0,
      variant: "",
      success: "success",
      warning: "warning",
      danger: "danger",
      info: "info",
    }
  },
  created() {
    // if (localStorage.getItem('currentUser')) {
    //   try {
    //     this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    //   } catch (e) {
    //     localStorage.removeItem('currentUser');
    //   }
    // }
    // if (this.currentUser) {
    //   this.$router.back();
    // }
  },
  methods: {
    login() {
      this.showNotify = true;
      axios.post('http://localhost:8081/api/login/', this.userInfo)
          .then((response) => {
            console.log("Submit success");
            console.log(response);
            this.message = response.data.message;
            this.isLoggedinSuccessfully = response.data.success;
            if (this.isLoggedinSuccessfully) {
              this.variant = this.success;
            } else {
              this.variant = this.danger;
              if (this.userInfo.username === "" || this.userInfo.userPassword === "") {
                this.message = "Kullanıcı adı veya şifre boş bırakılamaz."
              }
            }
            if (this.message === "Kullanıcı Girişi Başarılı.") {
              this.userInfo.userIdentityNum = response.data.data.userIdentityNum;
              localStorage.setItem('currentUser', JSON.stringify(this.userInfo));
              window.setTimeout(this.pushRouter, 3000);
            }
          })
          .catch(error => {
            console.log('Submit Fail')
            console.log(error)
          });
    },
    pushRouter() {
      this.$router.push('/home');
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
  }
}
</script>

<style>
body > .grid {
  height: 100%;
}

.image {
  margin-top: -100px;
}

.column {
  max-width: 450px;
}

.sign-up {
  cursor: pointer;
  color: black;
  font-weight: bold;
}

.login-button {
  background-color: #012a47;
  color: #FFF7F8;
  border-radius: 25px;
  width: 10rem;
}

</style>
