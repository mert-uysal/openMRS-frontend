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
    <div class="d-flex flex-column w-auto p-3 h-auto d-inline-block justify-content-center align-items-center">
      <div class="card">
        <sui-form>
          <sui-header dividing class="mt-1">Doktor Bilgileri</sui-header>
          <sui-form-field>
            <label>Kimlik Bilgileri</label>
            <sui-form-fields fields="three" class="ms-2 me-2">
              <sui-form-field>
                <label>Kimlik Numarası</label>
                <input
                    type="text"
                    placeholder="Kimlik numarası"
                    v-model="doctor.doctorIdentityNum"
                />
              </sui-form-field>
              <sui-form-field>
                <label>İsim</label>
                <input
                    type="text"
                    placeholder="İsim"
                    v-model="doctor.doctorFirstName"
                />
              </sui-form-field>
              <sui-form-field>
                <label>Soyisim</label>
                <input
                    type="text"
                    placeholder="Soyisim"
                    v-model="doctor.doctorLastName"
                />
              </sui-form-field>
            </sui-form-fields>
            <sui-form-fields fields="three" class="ms-1 me-3">
              <sui-form-field>
                <label>E-mail</label>
                <input
                    type="text"
                    placeholder="E-mail"
                    v-model="doctor.doctorEmail"
                />
              </sui-form-field>
              <sui-form-field>
                <label>Telefon Numarası</label>
                <input
                    type="text"
                    placeholder="Telefon Numarası"
                    v-model="doctor.doctorPhone"
                />
              </sui-form-field>
              <sui-form-field>
                <label>Cinsiyet</label>
                <sui-dropdown
                    placeholder="Gender"
                    selection
                    :options="gender"
                    v-model="doctor.doctorGender"
                />
              </sui-form-field>
            </sui-form-fields>
            <sui-form-fields fields="two" class="ms-3 me-2">
              <sui-form-field width="nine">
                <label>Adres</label>
                <input
                    type="text"
                    placeholder="Adres"
                    v-model="doctor.doctorAddress"
                />
              </sui-form-field>
              <sui-form-field>
                <label>Doğum Tarihi</label>
                <date-dropdown min="1900" v-model="doctor.doctorDateOfBirth"/>
              </sui-form-field>
            </sui-form-fields>
          </sui-form-field>

          <sui-form-field>
          </sui-form-field>

          <sui-header dividing>Giriş Bilgileri</sui-header>
          <sui-form-field>
            <sui-form-fields fields="two" class="ms-2 me-2">
              <sui-form-field>
                <label>Kullanıcı Adı</label>
                <input
                    type="text"
                    placeholder="Kullanıcı Adı"
                    v-model="doctor.username"
                />
              </sui-form-field>
              <sui-form-field>
                <label>Parola</label>
                <input
                    type="password"
                    placeholder="Parola"
                    v-model="doctor.userPassword"
                />
              </sui-form-field>
            </sui-form-fields>
          </sui-form-field>
        </sui-form>
        <div>
          <button class="btn btn-primary mb-2" @click="registerDoctor(); showAlert()">Kaydet</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DateDropdown from 'vue-date-dropdown'
import axios from 'axios'
import moment from 'moment'

export default {
  name: "doctorRegister",
  components: {
    DateDropdown
  },
  data() {
    return {
      doctor: {
        doctorIdentityNum: "",
        doctorFirstName: "",
        doctorLastName: "",
        doctorGender: "",
        doctorPhone: "",
        doctorEmail: "",
        doctorDateOfBirth: "",
        doctorAddress: "",
        doctorIsRetired: false,
        userIdentityNum: "",
        username: "",
        userPassword: "",
      },
      gender: [
        {
          text: 'Erkek',
          value: 'M',
        },
        {
          text: 'Kadın',
          value: 'F',
        },
      ],
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
  methods: {
    formatDate(value) {
      return moment(value, 'DD.MM.YYYY').format('YYYY-MM-DD');
    },
    registerDoctor() {
      this.doctor.doctorDateOfBirth = this.formatDate(this.doctor.doctorDateOfBirth);
      this.doctor.userIdentityNum = this.doctor.doctorIdentityNum;
      axios.post('http://localhost:8081/api/doctors/addDoctor', this.doctor)
          .then((response) => {
            console.log("Submit success")
            console.log(response)
            this.message = response.data.message;
            if(response.data.success){
              this.variant = this.success;
              this.showNotify = true;
              window.setTimeout(this.pushRouter, 3000);
            }
            else {
              this.variant = this.danger;
            }
          })
          .catch(error => {
            console.log('Submit Fail')
            console.log(error)
          });
    },
    pushRouter() {
      this.$router.push('/');
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

<style scoped>

</style>
