<template>
  <div>
    <div>
      {{ identityNum }}
    </div>
    <div>
      {{ patientInfo }}
    </div>
    <div>
      {{ $route.params.id }}
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "displaySelectedPatient",
  data() {
    return {
      identityNum: "",
      patientInfo: {},
    }
  },
  mounted() {
    this.identityNum = this.$route.params.id;
    axios.post("http://localhost:8081/api/patients/getById?id=" + this.identityNum)
        .then((response) => {
          console.log("getting patient info success");
          console.log(response);
          this.patientInfo = response.data.data;
        })
        .catch(error => {
          console.log("getting patient info failed");
          console.log(error);
        });
  }
}
</script>

<style scoped>

</style>