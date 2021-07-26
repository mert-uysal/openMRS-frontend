<template>
  <div class="container center">
    <div class="card">
      <div class="card-header">
        <h5>Kullanıcı Bilgileri</h5>
      </div>
      <div class="card-body position-relative">
        <sui-form>
          <sui-form-field>
            <sui-form-fields fields="two" class="ms-2 me-2">
              <sui-form-field>
                <label>Kimlik Numarası</label>
                <input
                    type="text"
                    v-model="userData.doctorIdentityNum"
                    disabled
                />
              </sui-form-field>
              <sui-form-field>
                <label>Telefon</label>
                <input
                    :disabled="isEditable === false"
                    type="text"
                    v-model="userData.doctorPhone"
                />
              </sui-form-field>
            </sui-form-fields>
          </sui-form-field>
          <sui-form-field>
            <sui-form-fields fields="two" class="ms-2 me-2">
              <sui-form-field>
                <label>Ad</label>
                <input
                    type="text"
                    :value="userData.doctorFirstName"
                    :disabled="isEditable === false"
                />
              </sui-form-field>
              <sui-form-field>
                <label>Soyad</label>
                <input
                    type="text"
                    :value="userData.doctorLastName"
                    :disabled="isEditable === false"
                />
              </sui-form-field>
            </sui-form-fields>
          </sui-form-field>
          <sui-form-field>
            <sui-form-fields fields="two" class="ms-2 me-2">
              <sui-form-field>
                <label>Cinsiyet</label>
                <sui-dropdown
                    :disabled="isEditable === false"
                    placeholder="Cinsiyet"
                    selection
                    :options="gender"
                    v-model="userData.doctorGender"
                />
              </sui-form-field>
              <sui-form-field>
                <label>Doğum Tarihi</label>
                <input
                    :disabled="isEditable === false"
                    type="text"
                    v-model="userData.doctorDateOfBirth"
                />
              </sui-form-field>
            </sui-form-fields>
          </sui-form-field>
          <sui-form-field>
            <sui-form-fields fields="two" class="ms-2 me-2">
              <sui-form-field>
                <label>Adres Bilgisi</label>
                <textarea
                    style="height: auto"
                    rows="3"
                    :disabled="isEditable === false"
                    type="text"
                    v-model="userData.doctorAddress"
                />
              </sui-form-field>
              <sui-form-field>
                <label>Email</label>
                <input
                    :disabled="isEditable === false"
                    type="text"
                    v-model="userData.doctorEmail"
                />
              </sui-form-field>
            </sui-form-fields>
          </sui-form-field>
          <sui-header dividing>Oturum Bilgileri</sui-header>
          <sui-form-field>
            <sui-form-fields fields="two" class="ms-2 me-2">
              <sui-form-field>
                <label>Kullanıcı Adı</label>
                <input
                    :disabled="isEditable === false"
                    type="text"
                    v-model="userData.username"
                />
              </sui-form-field>
              <sui-form-field>
                <label>Şifre</label>
                <input
                    :disabled="isEditable === false"
                    type="password"
                    v-model="userData.userPassword"
                />
              </sui-form-field>
            </sui-form-fields>
          </sui-form-field>
        </sui-form>
      </div>
      <div class="card-footer d-flex flex-row-reverse bd-highlight">
        <span style="cursor: pointer; border-radius: 15px;" class="btn-outline-primary p-2 bd-highlight me-2"
              @click="updateUser(); showAlert()">
            <i class="material-icons">save</i>
        </span>
        <span style="cursor: pointer; border-radius: 15px;" class="btn-outline-primary p-2 bd-highlight me-2"
              @click="changeEditable()">
            <span class="material-icons">edit_note</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "profile",
  data() {
    return {
      userData: {},
      tempUserData: {},
      isEditable: false,
      gender: [
        {
          text: 'Erkek',
          value: 'E',
        },
        {
          text: 'Kadın',
          value: 'K',
        },
      ],

      message: "",
      isProcessSuccessful: true,
      showNotify: false,
      dismissSecs: 3,
      dismissCountDown: 0,
      variant: "",
      success: "success",
      warning: "warning",
      danger: "danger",
      info: "info",
    }
  },
  mounted() {
    this.userData = JSON.parse(localStorage.getItem('userData'));
  },
  methods: {
    changeEditable() {
      this.tempUserData = JSON.parse(JSON.stringify(this.userData));
      this.isEditable = !this.isEditable;
      console.log(this.isEditable);
    },
    updateUser() {
      axios.put("http://localhost:8081/api/doctors/updateUser", this.patientInfo)
          .then((response) => {
            this.message = response.data.message;
            if (response.data.success) {
              this.variant = this.success;
            } else {
              this.variant = this.warning;
            }
          })
          .catch(error => {
            this.variant = this.danger;
            this.message = error;
          });
      this.changeEditable();
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