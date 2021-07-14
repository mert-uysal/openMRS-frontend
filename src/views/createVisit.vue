<template>
  <div class="card">
    <div class="card-header">
      <span>Visit Bilgileri</span>
    </div>
    <div class="card-body">
      <sue-form>
        <sui-form-fields fields="two">
          <sui-form-field>
            <label>Hasta</label>
            <sui-dropdown
                :options="allPatients"
                placeholder="Hasta seç"
                search
                selection
                v-model="selected.patient"
            />
          </sui-form-field>
          <sui-form-field>
            <label>Doktor</label>
            <sui-dropdown
                :options="allDoctors"
                placeholder="Doktor seç"
                search
                selection
                v-model="selected.doctor"
            />
          </sui-form-field>
        </sui-form-fields>
      </sue-form>
    </div>
    <button @click="temp()">bas</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "createVisit",
  data() {
    return {
      allDoctors: {},
      allPatients: {},
      selected: {
        patient: {},
        doctor: {},
      },
      visitObj: {
        patientId: "",
        doctorId: "",
        visitDate: "",
        visitDescription: "",
      }
    }
  },
  mounted() {
    axios.get("http://localhost:8081/api/doctors/getAllDoctors")
        .then((response) => {
          console.log(response.data.message);
          this.allDoctors = response.data.data;
        })
        .catch(error => {
          console.log("getting all doctors failed.")
          console.log(error);
        });
    axios.get("http://localhost:8081/api/doctors/getAllPatients")
        .then((response) => {
          console.log(response.data.message);
          this.allPatients = response.data.data;
        })
        .catch(error => {
          console.log("getting all doctors failed.")
          console.log(error);
        });
  },
  methods: {
    temp() {
      console.log(this.allDoctors);
      console.log(this.allPatients);
    }
  }
}
</script>

<style scoped>

</style>