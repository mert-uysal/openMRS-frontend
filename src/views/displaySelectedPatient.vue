<template>
  <div>
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h5>Hasta Bilgileri</h5>
        </div>
        <div class="card-body">
          <sui-form>
            <sui-form-field>
              <sui-form-fields fields="two" class="ms-2 me-2">
                <sui-form-field>
                  <label>Kimlik Numarası</label>
                  <input
                      type="text"
                      :value="patientInfo.patientIdentityNum"
                      disabled
                  />
                </sui-form-field>
                <sui-form-field>
                  <label>Ad Soyad</label>
                  <input
                      type="text"
                      :value="patientInfo.patientFirstName + ' ' + patientInfo.patientLastName"
                      disabled
                  />
                </sui-form-field>
              </sui-form-fields>
            </sui-form-field>
            <sui-form-field>
              <sui-form-fields fields="two" class="ms-2 me-2">
                <sui-form-field>
                  <label>Cinsiyet</label>
                  <input
                      type="text"
                      :value="patientInfo.patientGender"
                      disabled
                  />
                </sui-form-field>
                <sui-form-field>
                  <label>Doğum Tarihi</label>
                  <input
                      type="text"
                      :value="patientInfo.patientDateOfBirt"
                      disabled
                  />
                </sui-form-field>
              </sui-form-fields>
            </sui-form-field>
            <sui-form-field>
              <sui-form-fields fields="two" class="ms-2 me-2">
                <sui-form-field>
                  <label>Telefon</label>
                  <input
                      type="text"
                      :value="patientInfo.patientPhoneNum"
                      disabled
                  />
                </sui-form-field>
                <sui-form-field>
                  <label>Email</label>
                  <input
                      type="text"
                      :value="patientInfo.patientEmail"
                      disabled
                  />
                </sui-form-field>
              </sui-form-fields>
            </sui-form-field>
            <sui-form-field>
              <sui-form-fields fields="two" class="ms-2 me-2">
                <sui-form-field>
                  <label>Aile Bilgisi</label>
                  <input
                      type="text"
                      :value="patientInfo.patientFamilyMember"
                      disabled
                  />
                </sui-form-field>
                <sui-form-field>
                  <label>Adres Bilgisi</label>
                  <input
                      type="text"
                      :value="patientInfo.patientAddress"
                      disabled
                  />
                </sui-form-field>
              </sui-form-fields>
            </sui-form-field>
          </sui-form>
        </div>
        <div class="card-footer d-flex flex-row-reverse bd-highlight">
          <a href="#" class="p-2 bd-highlight">
            <i class="material-icons">delete</i>
          </a>
          <a href="#" class="p-2 bd-highlight">
            <i class="material-icons">save</i>
          </a>
          <a href="#" class="p-2 bd-highlight">
            <i class="material-icons">edit_note</i>
          </a>
        </div>
      </div>
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
