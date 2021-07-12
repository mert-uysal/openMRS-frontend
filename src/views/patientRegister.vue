<template>
  <div class="d-flex flex-column w-auto p-3 h-auto d-inline-block justify-content-center align-items-center">
    <div class="card">
      <sui-form>
        <sui-header dividing class="mt-1">Hasta Bilgileri</sui-header>
        <sui-form-field>
          <label>Kimlik Bilgileri</label>
          <sui-form-fields fields="three" class="ms-2 me-2">
            <sui-form-field>
              <label>Kimlik Numarası</label>
              <input
                  type="text"
                  placeholder="Kimlik numarası"
                  v-model="patient.patientIdentityNum"
              />
            </sui-form-field>
            <sui-form-field>
              <label>İsim</label>
              <input
                  type="text"
                  placeholder="İsim"
                  v-model="patient.patientFirstName"
              />
            </sui-form-field>
            <sui-form-field>
              <label>Soyisim</label>
              <input
                  type="text"
                  placeholder="Soyisim"
                  v-model="patient.patientLastName"
              />
            </sui-form-field>
          </sui-form-fields>
          <sui-form-fields fields="three" class="ms-1 me-3">
            <sui-form-field>
              <label>E-mail</label>
              <input
                  type="text"
                  placeholder="E-mail"
                  v-model="patient.patientEmail"
              />
            </sui-form-field>
            <sui-form-field>
              <label>Telefon Numarası</label>
              <input
                  type="text"
                  placeholder="Telefon Numarası"
                  v-model="patient.patientPhoneNum"
              />
            </sui-form-field>
            <sui-form-field>
              <label>Cinsiyet</label>
              <sui-dropdown
                  placeholder="Gender"
                  selection
                  :options="gender"
                  v-model="patient.patientGender"
              />
            </sui-form-field>
          </sui-form-fields>
          <sui-form-fields fields="two" class="ms-3 me-2">
            <sui-form-field width="nine">
              <label>Adres</label>
              <input
                  type="text"
                  placeholder="Adres"
                  v-model="patient.patientAddress"
              />
            </sui-form-field>
            <sui-form-field>
              <label>Doğum Tarihi</label>
              <date-dropdown min="1900" v-model="patient.patientDateOfBirt"/>
            </sui-form-field>
          </sui-form-fields>
        </sui-form-field>

        <sui-form-field>
        </sui-form-field>

        <sui-header dividing>Hasta Yakını Bilgileri
          <a href="#" class="action button position-absolute end-0 me-2" @click="addRelative()">
            <i class="fas fa-plus"></i>
          </a>
        </sui-header>
        <sui-form-field v-for="(relative, index) in familyMembers" :key="relative">
          <a href="#" class="action button position-absolute end-0 me-2" @click="deleteRelative(index)">
            <i class="fas fa-minus"></i>
          </a>
          <sui-form-fields fields="two" class="ms-2 me-2">
            <sui-form-field>
              <label>Akrabalık Derecesi</label>
              <sui-dropdown
                  placeholder="Akrabalık Derecesi"
                  selection
                  :options="relativeType"
                  v-model="familyMembers[index].relativeType"
              />
            </sui-form-field>
            <sui-form-field>
              <label>Kimlik Numarası</label>
              <input
                  type="text"
                  placeholder="Kimlik numarası"
                  v-model="familyMembers[index].identityNum"
              />
            </sui-form-field>
          </sui-form-fields>
          <sui-form-fields fields="two" class="ms-2 me-2">
            <sui-form-field>
              <label>İsim</label>
              <input
                  type="text"
                  placeholder="İsim"
                  v-model="familyMembers[index].firstName"
              />
            </sui-form-field>
            <sui-form-field>
              <label>Soyisim</label>
              <input
                  type="text"
                  placeholder="Soyisim"
                  v-model="familyMembers[index].lastName"
              />
            </sui-form-field>
          </sui-form-fields>
        </sui-form-field>
      </sui-form>
      <div>
        <button class="btn btn-primary mb-2" @click="registerPatient()">Hastayı Kaydet</button>
      </div>
    </div>
  </div>
</template>

<script>
import DateDropdown from 'vue-date-dropdown'
import axios from 'axios'
import moment from 'moment'

export default {
  name: "patientRegister",
  components: {
    DateDropdown
  },
  data() {
    return {
      tcNoAlert: false,
      patient: {
        patientIdentityNum: "",
        patientFirstName: "",
        patientLastName: "",
        patientGender: '',
        patientPhoneNum: "",
        patientEmail: "",
        patientDateOfBirt: "",
        patientAddress: "",
        patientFamilyMember: "",
      },
      familyMembers: [],
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

      relativeType: [
        {
          text: 'Birinci Derece Akraba',
          value: 'first degree relative'
        },
        {
          text: 'İkinci Derece Akraba',
          value: 'second degree relative'
        },
        {
          text: 'Üçüncü Derece Akraba',
          value: 'third degree relative'
        },
      ],
    };
  },
  methods: {
    addRelative() {
      this.familyMembers.push({
        identityNum: "",
        relativeType: "",
        firstName: "",
        lastName: "",
      })
    },
    deleteRelative(index) {
      this.familyMembers.splice(this.familyMembers.indexOf(index), 1)
    },
    format_date(value) {
      return moment(value, 'DD.MM.YYYY').format('YYYY-MM-DD');
    },
    registerPatient() {
      this.familyMembers.forEach((relative) => {
        this.patient.patientFamilyMember += relative.identityNum + " - " + relative.firstName + " - " +
            relative.lastName + " - " + relative.relativeType + "\n";
      });
      this.patient.patientDateOfBirt = this.format_date(this.patient.patientDateOfBirt);
      axios.post('http://localhost:8081/api/patients/add', this.patient)
          .then((response) => {
            console.log("Submit success")
            console.log(response)
          })
          .catch(error => {
            console.log('Submit Fail')
            console.log(error)
          });
      console.log(this.patient);
      /*axios.post("http://localhost:8081/api/patients/add", {tempPatient})
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          }).finally(() => {
        //Perform action in always
      });*/
    }
  },
}
</script>

<style scoped>
/*.card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}*/
</style>
