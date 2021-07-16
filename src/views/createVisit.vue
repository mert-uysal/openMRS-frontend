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
          v-if="isProcessSuccessful"
          :variant="variant"
          :max="dismissSecs"
          :value="dismissCountDown"
          height="4px"></b-progress>
    </b-alert>
    <div class="card">
      <div class="card-header">
        <span>Visit Bilgileri</span>
      </div>
      <div class="card-body">
        <sui-form>
          <sui-form-fields fields="two">
            <sui-form-field>
              <label>Hasta Seçin</label>
              <sui-dropdown
                  :options="allPatients"
                  placeholder="hasta"
                  search
                  selection
                  v-model="visitObj.patientId"
              />
            </sui-form-field>
            <sui-form-field>
              <label>Doktor Seçin</label>
              <sui-dropdown
                  :options="allDoctors"
                  placeholder="doktor"
                  search
                  selection
                  v-model="visitObj.doctorId"
              />
            </sui-form-field>
          </sui-form-fields>
          <sui-form-fields fields="two">
            <sui-form-field>
              <label>Visit Tarih ve Saat:</label>
              <form action="">
                <input type="datetime-local" id="visitdate" name="visitdate" v-model="visitObj.visitDate">
              </form>
            </sui-form-field>
            <sui-form-field>
              <label>Visit Detayı:</label>
              <textarea id="visitDesc" name="visitDesc" rows="4" v-model="visitObj.visitDescription"></textarea>
            </sui-form-field>
          </sui-form-fields>
        </sui-form>
      </div>
      <div class="card-footer">
        <button class="btn btn-secondary mt-2" @click="createPastVisit(); showAlert()">Geçmiş Visit Ekle</button>
        <button class="btn btn-success mt-2" @click="createVisit(); showAlert()">Visit Oluştur</button>
      </div>
    </div>
    <!--    <div class="card-footer">-->
    <!--      <div class="form-group">-->
    <!--        <label for="exampleSelectBorder">Hasta Selector</label>-->
    <!--        <select class="custom-select form-control-border" id="exampleSelectBorder" placeholder="hasta seç">-->
    <!--          <option v-for="patient in allPatients" :key="patient.id">-->
    <!--            {{patient.patientIdentityNum}} - {{ patient.patientFirstName }} {{patient.patientLastName}}-->
    <!--          </option>-->
    <!--        </select>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "createVisit",
  data() {
    return {
      allDoctors: [],
      allPatients: [],
      visitObj: {
        patientId: "",
        doctorId: "",
        visitDate: "",
        visitDescription: "",
        visitStatus: true,
      },
      message: "",
      isProcessSuccessful: true,
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
    this.getAllPatients();
    this.getAllDoctors();
  },
  methods: {
    getAllPatients() {
      axios.get("http://localhost:8081/api/patients/getAllPatients")
          .then((response) => {
            console.log(response.data.message);
            this.allPatients = response.data.data;
            this.allPatients.forEach((patient, index) => {
              this.allPatients[index]['text'] = patient.patientFirstName + " " + patient.patientLastName;
              this.allPatients[index]['value'] = patient.patientIdentityNum;
            })
          })
          .catch(error => {
            console.log("getting all patients failed.")
            console.log(error);
          });
    },
    getAllDoctors() {
      axios.get("http://localhost:8081/api/doctors/getAllDoctors")
          .then((response) => {
            console.log(response.data.message);
            this.allDoctors = response.data.data;
            this.allDoctors.forEach((doctor, index) => {
              this.allDoctors[index]['text'] = doctor.doctorFirstName + " " + doctor.doctorLastName;
              this.allDoctors[index]['value'] = doctor.doctorIdentityNum;
            })
          })
          .catch(error => {
            console.log("getting all doctors failed.")
            console.log(error);
          });
    },
    createVisit() {
      axios.post("http://localhost:8081/api/visits/add", this.visitObj)
          .then((response) => {
            if (response.data.success) {
              this.showNotify = true;
              this.variant = this.success;
              this.message = response.data.message;
            }
          })
          .catch(error => {
            this.showNotify = true;
            this.variant = this.danger;
            this.message = error;
          })
      this.visitObj.patientId = "";
      this.visitObj.doctorId = "";
      this.visitObj.visitDate = "";
      this.visitObj.visitDescription = "";
      this.visitObj.visitStatus = true;
    },
    createPastVisit() {
      const today = new Date();
      const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      const dateTime = date + ' ' + time;
      if (this.visitObj.visitDate < dateTime) {
        this.visitObj.visitStatus = false;
        axios.post("http://localhost:8081/api/visits/add", this.visitObj)
            .then((response) => {
              if (response.data.success) {
                this.showNotify = true;
                this.variant = this.success;
                this.message = "Geçmiş Visit Ekleme Başarılı.";
              }
            })
            .catch(error => {
              this.showNotify = true;
              this.variant = this.danger;
              this.message = error;
            })
      } else {
        this.showNotify = true;
        this.message = "Geçmiş visit için ileri bir tarih seçemezsiniz!!!"
        this.variant = this.warning;
      }
      this.visitObj.patientId = "";
      this.visitObj.doctorId = "";
      this.visitObj.visitDate = "";
      this.visitObj.visitDescription = "";
      this.visitObj.visitStatus = true;
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    temp() {
      console.log(this.visitObj);
      // let selectElement = document.querySelector('#exampleSelectBorder');
      // let output = selectElement.options[selectElement.selectedIndex].value;
      // console.log(output);
    }
  }
}
</script>

<style scoped>
.card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60rem;
  height: 23rem;
}

.btn {
  margin-left: 10px;
  margin-right: 10px;
}
</style>
