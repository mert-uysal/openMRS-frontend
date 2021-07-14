<template>
  <div class="container">
    <div class="row align-items-center justify-content-center mb-3">
      <div class="col-auto">
        <label for="questionInput">Hasta Kimlik Numarası:</label>
      </div>
      <div class="col-4">
        <input class="form-control"
               id="questionInput" type="text" v-model="searchedPatientId"/>
      </div>
      <div class="col-auto">
        <button class="btn btn-success"
                @click="searchPatient()">Hasta Ara
        </button>
      </div>
    </div>
    <sui-table celled>
      <sui-table-header>
        <sui-table-row>
          <sui-table-header-cell>Kimlik Numarası</sui-table-header-cell>
          <sui-table-header-cell>İsim</sui-table-header-cell>
          <sui-table-header-cell>Cinsiyet</sui-table-header-cell>
          <sui-table-header-cell>Yaş</sui-table-header-cell>
          <sui-table-header-cell>Doğum Tarihi</sui-table-header-cell>
        </sui-table-row>
      </sui-table-header>

      <sui-table-body>
        <sui-table-row v-for="(patient) in allPatientsList" :key="patient.patientIdentityNum">
            <sui-table-cell>
              <sui-label ribbon type="button" class="id-button" @click="displayPatient(patient.patientIdentityNum)">
                {{ patient.patientIdentityNum }}</sui-label>
            </sui-table-cell>
            <sui-table-cell>{{ patient.patientFirstName }} {{ patient.patientLastName }}</sui-table-cell>
            <sui-table-cell>{{ patient.patientGender }}</sui-table-cell>
            <sui-table-cell>{{ patient.patientAge }}</sui-table-cell>
            <sui-table-cell>{{ patient.patientDateOfBirt }}</sui-table-cell>
        </sui-table-row>
      </sui-table-body>

      <sui-table-footer>
        <sui-table-row>
          <sui-table-header-cell colspan="5">
            <sui-menu v-sui-floated:right pagination>
              <a is="sui-menu-item" icon>
                <sui-icon name="left chevron"/>
              </a>
              <a is="sui-menu-item">1</a>
              <a is="sui-menu-item">2</a>
              <a is="sui-menu-item">3</a>
              <a is="sui-menu-item">4</a>
              <a is="sui-menu-item" icon>
                <sui-icon name="right chevron"/>
              </a>
            </sui-menu>
          </sui-table-header-cell>
        </sui-table-row>
      </sui-table-footer>
    </sui-table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "findPatient",
  data() {
    return {
      patientId: "",
      allPatientsList: null,
      searchedPatientId: "",
    }
  },
  created() {
    this.getAllPatients();
  },
  methods: {
    getAllPatients() {
      const curYear = new Date().getFullYear();
      axios.get("http://localhost:8081/api/patients/getAllPatients").then((response) => {
        console.log("getting all patient list success");
        console.log(response);
        this.allPatientsList = response.data.data;
        this.allPatientsList.forEach((patient, index) => {
          const patientDateYear = patient.patientDateOfBirt.split('-')
          const tempYear = parseInt(patientDateYear[0]);
          this.allPatientsList[index]['patientAge'] = curYear - tempYear;
        });
      });
    },
    searchPatient() {
      console.log(this.allPatientsList);
    },
    displayPatient(patientId) {
      this.$router.push({
        name: 'displaySelectedPatient',
        params: {id: patientId},
      });
    }
  }
}
</script>

<style scoped>
.id-button:hover {
  background-color: #7f8ca4;
}
</style>