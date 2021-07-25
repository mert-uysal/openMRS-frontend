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
        <span>Randevu Oluştur</span>
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
                  v-model="patient"
              />
            </sui-form-field>
            <sui-form-field>
              <label>Doktor Seçin</label>
              <sui-dropdown
                  :options="allDoctors"
                  placeholder="doktor"
                  search
                  selection
                  v-model="doctor"
              />
            </sui-form-field>
          </sui-form-fields>
          <sui-form-fields fields="two">
            <sui-form-field>
              <label>Randevu Tarih ve Saat:</label>
              <form action="">
                <input type="datetime-local" id="appointDate" name="appointDate" :min="dateTime"
                       v-model="appointmentObj.appointmentDate">
              </form>
            </sui-form-field>
            <sui-form-field>
              <label>Departman</label>
              <sui-dropdown
                  :options="departments"
                  placeholder="departmanlar"
                  search
                  selection
                  v-model="appointmentObj.department"
              />
            </sui-form-field>
          </sui-form-fields>
        </sui-form>
      </div>
      <div class="card-footer justify-content-center">
        <button class="btn btn-success mt-2" @click="createAppointment(); showAlert()">Randevu Oluştur</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "createAppointment",
  data() {
    return {
      allDoctors: [],
      allPatients: [],
      departments: [],
      patient: "",
      doctor: "",
      appointmentObj: {
        patientId: "",
        patientName: "",
        doctorId: "",
        doctorName: "",
        appointmentDate: "",
        department: "",
        appointmentStatus: true,
      },

      dateTime: "",

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
    this.getDepartments();
  },
  mounted() {
    let today = new Date();
    let dd = today.getDate();
    let MM = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    let hh = today.getHours();
    let mm = today.getMinutes();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (MM < 10) {
      MM = '0' + MM;
    }
    if(hh < 10) {
      hh = '0' + hh;
    }
    if(mm < 10) {
      mm = '0' + mm;
    }
    const date = yyyy + '-' + MM + '-' + dd;
    const time = hh + ":" + mm;
    this.dateTime = date + 'T' + time;
  },
  methods: {
    getAllPatients() {
      axios.get("http://localhost:8081/api/patients/getAllPatients")
          .then((response) => {
            console.log(response.data.message);
            this.allPatients = response.data.data;
            this.allPatients.forEach((patient, index) => {
              this.allPatients[index]['text'] = patient.patientIdentityNum + " - " + patient.patientFirstName + " " + patient.patientLastName;
              this.allPatients[index]['value'] = patient.patientIdentityNum + " - " + patient.patientFirstName + " " + patient.patientLastName;
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
              this.allDoctors[index]['text'] = doctor.doctorIdentityNum + " - " + doctor.doctorFirstName + " " + doctor.doctorLastName;
              this.allDoctors[index]['value'] = doctor.doctorIdentityNum + " - " + doctor.doctorFirstName + " " + doctor.doctorLastName;
            })
          })
          .catch(error => {
            console.log("getting all doctors failed.")
            console.log(error);
          });
    },
    getDepartments() {
      axios.get("http://localhost:8081/api/appointments/getDepartments")
          .then((response) => {
            this.departments = response.data;
            this.departments.forEach((department, index) => {
              this.departments[index]['text'] = department.departmentName;
              this.departments[index]['value'] = department.departmentName;
            })
          })
          .catch(error => {
            console.log("getting deps failed.")
            console.log(error);
          });
    },
    createAppointment() {
      const tempPatient = this.patient.split(" - ");
      this.appointmentObj.patientId = tempPatient[0];
      this.appointmentObj.patientName = tempPatient[1];
      const tempDoctor = this.doctor.split(" - ");
      this.appointmentObj.doctorId = tempDoctor[0];
      this.appointmentObj.doctorName = tempDoctor[1];
      axios.post("http://localhost:8081/api/appointments/add", this.appointmentObj)
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
          });
    },
    showAlert() {
      this.showNotify = true;
      this.dismissCountDown = this.dismissSecs;
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
  },
}
</script>

<style scoped>
.card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 55rem;
  height: 25rem;
}

.btn {
  margin-left: 10px;
  margin-right: 10px;
}
</style>
