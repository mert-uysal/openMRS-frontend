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
    <!-- tüm hastalar -->
    <div class="container">
      <div class="row align-items-center justify-content-center">
        <div class="col-auto">
          <label class="mt-2">Hasta Ara:</label>
        </div>
        <div class="col-4">
          <input class="form-control" type="text" v-model="filter"/>
        </div>
      </div>
      <sui-table striped>
        <sui-table-header>
          <sui-table-row>
            <sui-table-header-cell>Kimlik Numarası</sui-table-header-cell>
            <sui-table-header-cell>İsim</sui-table-header-cell>
            <sui-table-header-cell>Cinsiyet</sui-table-header-cell>
            <sui-table-header-cell>Yaş</sui-table-header-cell>
            <sui-table-header-cell>Hasta Durumu</sui-table-header-cell>
            <sui-table-header-cell>Doğum Tarihi</sui-table-header-cell>
            <sui-table-header-cell>İşlemler</sui-table-header-cell>
          </sui-table-row>
        </sui-table-header>

        <sui-table-body>
          <sui-table-row v-for="(patient) in filteredRows" :key="patient.id">
            <sui-table-cell>
              <sui-label ribbon type="button" class="id-button" @click="displayPatient(patient.patientIdentityNum)">
                {{ patient.patientIdentityNum }}
              </sui-label>
            </sui-table-cell>
            <sui-table-cell>{{ patient.patientFirstName }} {{ patient.patientLastName }}</sui-table-cell>
            <sui-table-cell>{{ patient.patientGender }}</sui-table-cell>
            <sui-table-cell>{{ patient.patientAge }}</sui-table-cell>
            <sui-table-cell>{{ patient.patientStatus }}</sui-table-cell>
            <sui-table-cell>{{ patient.patientDateOfBirt }}</sui-table-cell>
            <sui-table-cell>
              <a href="#" class="action-button text-danger"
                 data-bs-toggle="modal" data-bs-target="#deleteModal">
                <span class="material-icons">delete</span>
              </a>
            </sui-table-cell>
          </sui-table-row>
        </sui-table-body>

        <sui-table-footer>
          <sui-table-row>
            <sui-table-header-cell colspan="7">
              <sui-button floated="right"
                          labeled
                          @click="showAllPatients()">
                Tüm Hastaları Göster
              </sui-button>
              <sui-button v-if="!isShowInPatient"
                          floated="right"
                          labeled
                          @click="showPatientsByStatus()">
                Sadece Yatan Hastaları Göster
              </sui-button>
              <sui-button v-else
                          floated="right"
                          labeled
                          @click="showPatientsByStatus()">
                Sadece Ayakta Tedavi Hastalarını Göster
              </sui-button>
            </sui-table-header-cell>
          </sui-table-row>
        </sui-table-footer>
      </sui-table>
    </div>
    <!-- silme modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="changesModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel"></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body mt-3">
            Hastayı Silmek İstediğinizden Emin Misiniz?
          </div>
          <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
            <button type="button" class="btn btn-danger" @click="deletePatient(); showAlert()">Sil</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "findPatient",
  data() {
    return {
      patientId: "",
      allPatientsList: [],
      filter: "",
      isShowAll: true,
      isShowInPatient: true,
      message: "",
      isProcessSuccessful: true,
      showNotify: false,
      showNotifyModal: false,
      dismissSecs: 3,
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
    this.showAlert();
  },
  computed: {
    filteredRows() {
      return this.allPatientsList.filter(row => {
        const idNo = row.patientIdentityNum.toString().toLowerCase();
        const name = row.patientFirstName.toString().toLowerCase() + " " + row.patientLastName.toString().toLowerCase();
        const searchTerm = this.filter.toLowerCase();

        return idNo.includes(searchTerm) ||
            name.includes(searchTerm);
      });
    },
    rows() {
      return this.allPatientsList.length
    }
  },
  methods: {
    getAllPatients() {
      const curYear = new Date().getFullYear();
      axios.get("http://localhost:8081/api/patients/getAllPatients")
          .then((response) => {
            console.log("getting all patient list success");
            console.log(response);
            this.showNotify = true;
            this.message = response.data.message;
            this.allPatientsList = response.data.data;
            this.allPatientsList.forEach((patient, index) => {
              const patientDateYear = patient.patientDateOfBirt.split('-')
              const tempYear = parseInt(patientDateYear[0]);
              this.allPatientsList[index]['patientAge'] = curYear - tempYear;
            });
            if (response.data.success) {
              this.variant = this.success;
            } else {
              this.variant = this.warning;
            }
          })
          .catch(error => {
            this.showNotify = true;
            this.message = error;
            this.variant = this.warning;
          });
    },
    getInPatients() {
      const curYear = new Date().getFullYear();
      axios.get("http://localhost:8081/api/patients/getAllinPatients")
          .then((response) => {
            console.log("getting inpatient list success");
            console.log(response);
            this.showNotify = true;
            this.message = response.data.message;
            this.allPatientsList = response.data.data;
            this.allPatientsList.forEach((patient, index) => {
              const patientDateYear = patient.patientDateOfBirt.split('-')
              const tempYear = parseInt(patientDateYear[0]);
              this.allPatientsList[index]['patientAge'] = curYear - tempYear;
            });
            if (response.data.success) {
              this.variant = this.success;
            } else {
              this.variant = this.warning;
            }
          })
          .catch(error => {
            this.showNotify = true;
            this.message = error;
            this.variant = this.warning;
          });
    },
    getOutPatients() {
      const curYear = new Date().getFullYear();
      axios.get("http://localhost:8081/api/patients/getAlloutPatients")
          .then((response) => {
            console.log("getting outpatient list success");
            console.log(response);
            this.showNotify = true;
            this.message = response.data.message;
            this.allPatientsList = response.data.data;
            this.allPatientsList.forEach((patient, index) => {
              const patientDateYear = patient.patientDateOfBirt.split('-')
              const tempYear = parseInt(patientDateYear[0]);
              this.allPatientsList[index]['patientAge'] = curYear - tempYear;
            });
            if (response.data.success) {
              this.variant = this.success;
            } else {
              this.variant = this.warning;
            }
          })
          .catch(error => {
            this.showNotify = true;
            this.message = error;
            this.variant = this.warning;
          });
    },
    showAllPatients() {
      this.isShowAll = !this.isShowAll;
      if (this.isShowAll) {
        this.getAllPatients();
      }
      this.showAlert();
    },
    showPatientsByStatus() {
      this.isShowInPatient = !this.isShowInPatient;
      if(this.isShowInPatient) {
        this.getInPatients();
      }
      else {
        this.getOutPatients();
      }
      this.showAlert();
    },
    displayPatient(patientId) {
      this.$router.push({
        name: 'displaySelectedPatient',
        params: {id: patientId},
      });
    },
    deletePatient() {
      axios.post("http://localhost:8081/api/patients/delete", this.patientInfo)
          .then((response) => {
            console.log(response);
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
          })
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
.id-button:hover {
  background-color: #7f8ca4;
}
</style>
