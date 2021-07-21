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
                      v-model="patientInfo.patientIdentityNum"
                      disabled
                  />
                </sui-form-field>
                <sui-form-field>
                  <label>Ad Soyad</label>
                  <input
                      type="text"
                      :value="patientInfo.patientFirstName + ' ' + patientInfo.patientLastName"
                      :disabled="isEditable === false"
                  />
                </sui-form-field>
              </sui-form-fields>
            </sui-form-field>
            <sui-form-field>
              <sui-form-fields fields="two" class="ms-2 me-2">
                <sui-form-field>
                  <label>Cinsiyet</label>
                  <input
                      :disabled="isEditable === false"
                      type="text"
                      v-model="patientInfo.patientGender"
                  />
                </sui-form-field>
                <sui-form-field>
                  <label>Doğum Tarihi</label>
                  <input
                      :disabled="isEditable === false"
                      type="text"
                      v-model="patientInfo.patientDateOfBirt"
                  />
                </sui-form-field>
              </sui-form-fields>
            </sui-form-field>
            <sui-form-field>
              <sui-form-fields fields="two" class="ms-2 me-2">
                <sui-form-field>
                  <label>Telefon</label>
                  <input
                      :disabled="isEditable === false"
                      type="text"
                      v-model="patientInfo.patientPhoneNum"
                  />
                </sui-form-field>
                <sui-form-field>
                  <label>Email</label>
                  <input
                      :disabled="isEditable === false"
                      type="text"
                      v-model="patientInfo.patientEmail"
                  />
                </sui-form-field>
              </sui-form-fields>
            </sui-form-field>
            <sui-form-field>
              <sui-form-fields fields="two" class="ms-2 me-2">
                <sui-form-field>
                  <label>Aile Bilgisi</label>
                  <textarea
                      style="height: auto"
                      rows="3"
                      :disabled="isEditable === false"
                      type="text"
                      v-model="patientInfo.patientFamilyMember"
                  />
                </sui-form-field>
                <sui-form-field>
                  <label>Adres Bilgisi</label>
                  <textarea
                      style="height: auto"
                      rows="3"
                      :disabled="isEditable === false"
                      type="text"
                      v-model="patientInfo.patientAddress"
                  />
                </sui-form-field>
              </sui-form-fields>
            </sui-form-field>
          </sui-form>
        </div>
        <div class="card-footer d-flex flex-row-reverse bd-highlight">
          <div class="bd-highlight mt-1">
            <i class='bx bx-chevron-right-circle bx-fade-right bx-md'></i>
          </div>
          <span style="cursor: pointer; border-radius: 15px;" class="btn-outline-primary p-2 bd-highlight me-2"
                @click="deletePatient()">
            <i class="material-icons">delete</i>
          </span>
          <span style="cursor: pointer; border-radius: 15px;" class="btn-outline-primary p-2 bd-highlight me-2"
                @click="savePatient()">
            <i class="material-icons">save</i>
          </span>
          <span style="cursor: pointer; border-radius: 15px;" class="btn-outline-primary p-2 bd-highlight me-2"
                @click="changeEditable()">
            <span class="material-icons">edit_note</span>
          </span>
          <button class="me-5" @click="temp()">bas</button>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="slideCard">
        <div class="row">
          <div class="d-flex align-items-start flex-column bd-highlight col-7">
            <button class="p-2 bd-highlight btn btn-outline-primary mb-3 mt-3">
              <i class='bx bx-calendar-check bx-lg'></i></button>
            <button class="p-2 bd-highlight btn btn-outline-primary mb-3">
              <i class='bx bxs-calendar bx-lg'></i></button>
          </div>
          <div class="d-flex align-items-center justify-content-center col-5">
            <i class='bx bx-chevron-right-circle bx-fade-right bx-md'></i>
          </div>
        </div>
      </div>
    </div>

    <!-- değişiklik modal -->
    <div class="modal fade" id="changesModal" data-bs-backdrop="static" data-bs-keyboard="false"
         tabindex="-1"
         aria-labelledby="changesModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="changesModalLabel"></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Kaydedilmemiş Değişiklikler Var. İptal Etmek İstiyor Musunuz?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
            <button type="button" class="btn btn-danger" @click="$router.go()">İptal Et</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {Modal} from 'bootstrap'

export default {
  name: "displaySelectedPatient",
  beforeRouteLeave(to, from, next) {
    // const answer = window.confirm('Kaydedilmemiş Değişiklikler Var. İptal Etmek İstiyor Musunuz?')
    // if (answer) {
    //   next()
    // } else {
    //   next(false)
    // }
    this.checkChanges();
    const myModal = new Modal(document.getElementById('changesModal'), {
      keyboard: false
    });
    if (this.anyChange) {
      myModal.show();
      next(false);
    } else {
      next();
    }
  },
  data() {
    return {
      patientInfo: {},
      tempPatientInfo: {},
      identityNum: "",
      isEditable: false,
      anyChange: false,
      nextPage: null,
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
  },
  watch: {
    $route() {
      this.checkChanges();
    },
  },
  methods: {
    changeEditable() {
      this.tempPatientInfo = JSON.parse(JSON.stringify(this.patientInfo));
      this.isEditable = !this.isEditable;
    },
    checkChanges() {
      if (!(Object.keys(this.tempPatientInfo).length === 0 && this.tempPatientInfo.constructor === Object)) { //if not null
        if (JSON.stringify(this.tempPatientInfo) !== JSON.stringify(this.patientInfo)) {
          console.log("değişiklik var");
          this.anyChange = true;
        }
      } else {
        console.log("değişiklik yok");
        this.anyChange = false;
      }
    },
    temp() {
      console.log(this.patientInfo);
      console.log(this.tempPatientInfo);
    }
  }
}
</script>

<style scoped>
.container {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
}

.card {
  position: relative;
}

.slideCard {
  left: 60%;
  /*width: 7.5rem;
  height: 8.7rem;*/
  /*display: flex;
  align-items: center;
  justify-content: center;*/
  /*  z-index: -1;*/
  position: absolute;
}

.slideCard:hover {
  animation: myMove 2s;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
}

.material-icons {
  display: flex;
  align-items: center;
}

@keyframes myMove {
  from {
    left: 0;
  }
  to {
    left: 100px;
  }
}

</style>
