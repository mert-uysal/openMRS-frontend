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
    <div class="container center">
      <div class="card">
        <div class="card-header">
          <h5>Hasta Bilgileri</h5>
        </div>
        <div class="card-body position-relative">
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
                  <label>Telefon</label>
                  <input
                      :disabled="isEditable === false"
                      type="text"
                      v-model="patientInfo.patientPhoneNum"
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
                      v-model="patientInfo.patientFirstName"
                      :disabled="isEditable === false"
                  />
                </sui-form-field>
                <sui-form-field>
                  <label>Soyad</label>
                  <input
                      type="text"
                      v-model="patientInfo.patientLastName"
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
                      placeholder="Hasta Cinsiyeti"
                      selection
                      :options="gender"
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
                  <label>Hasta Durumu</label>
                  <sui-dropdown
                      :disabled="isEditable === false"
                      placeholder="Hasta Durumu"
                      selection
                      :options="patientStatus"
                      v-model="patientInfo.patientStatus"
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
          <div class="container vertical-center z-index_-1 slideCard">
            <div class="row">
              <div class="d-inline-flex align-self-center align-items-start flex-column bd-highlight noPadding col-8">
                <button v-if="patientInfo.patientStatus === 'Yatan Hasta' "
                        class="btn btn-outline-primary p-2 bd-highlight mb-3 mt-3"
                        data-bs-toggle="modal" data-bs-target="#visitsModal" @click="showVisits()">
                  Visitler
                  <i class='bx bx-calendar-check bx-lg'></i>
                </button>
                <button class="btn btn-outline-primary p-2 bd-highlight mb-3"
                        data-bs-toggle="modal" data-bs-target="#appointmentsModal" @click="showAppointments()">
                  Randevular
                  <i class='bx bxs-calendar bx-lg'></i>
                </button>
                <button v-if="patientInfo.patientStatus === 'Yatan Hasta' "
                        class="btn btn-outline-primary p-2 bd-highlight mb-3"
                        data-bs-toggle="modal" data-bs-target="#addVisitModal" @click="getAllDoctors()">
                  Visit Ekle
                  <i class='bx bx-calendar-plus bx-lg'></i>
                </button>
              </div>
              <div class="col-4 align-self-center">
                <i class='bx bx-chevron-right-circle bx-fade-right bx-md'></i>
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer d-flex flex-row-reverse bd-highlight">
          <span style="cursor: pointer; border-radius: 15px;" class="btn-outline-primary p-2 bd-highlight me-2"
                data-bs-toggle="modal" data-bs-target="#deleteModal">
            <i class="material-icons">delete</i>
          </span>
          <span style="cursor: pointer; border-radius: 15px;" class="btn-outline-primary p-2 bd-highlight me-2"
                @click="updatePatient(); showAlert()">
            <i class="material-icons">save</i>
          </span>
          <span style="cursor: pointer; border-radius: 15px;" class="btn-outline-primary p-2 bd-highlight me-2"
                @click="changeEditable()">
            <span class="material-icons">edit_note</span>
          </span>
        </div>
      </div>
    </div>

    <!--    <div class="slideCard vertical-center z-index-0">-->
    <!--      <div class="d-inline-flex align-items-start flex-column justify-content-center noPadding">-->
    <!--        <button class="btn btn-outline-primary mb-3 mt-3">-->
    <!--          <i class='bx bx-calendar-check bx-lg'></i></button>-->
    <!--        <button class="btn btn-outline-primary mb-3">-->
    <!--          <i class='bx bxs-calendar bx-lg'></i></button>-->
    <!--        <button class="btn btn-outline-primary mb-3">-->
    <!--          <i class='bx bxs-calendar bx-lg'></i></button>-->
    <!--      </div>-->
    <!--      <div class="d-inline-flex vertical-center noPadding" style="height: 10rem">-->
    <!--        <div class="d-flex align-items-center">-->
    <!--          <i class='bx bx-chevron-right-circle bx-fade-right bx-md'></i>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->

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
            <button type="button" class="btn btn-danger" @click="goNextPage()">İptal Et</button>
          </div>
        </div>
      </div>
    </div>
    <!-- silme uyarı modal -->
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
    <!-- Visit modal -->
    <div class="modal fade" id="visitsModal" tabindex="-1" aria-labelledby="changesModalLabel" aria-hidden="true">
      <b-alert v-if="showNotifyVisits" class="mt-3 position-absolute top-0 end-0"
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
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <p><b>{{ patientInfo.patientIdentityNum }} - {{ patientInfo.patientFirstName }}
              {{ patientInfo.patientLastName }}</b></p>
            <h5 class="modal-title" id="visitsModalLabel"></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body mt-3">
            <sui-table v-if="patientVisits.length > 0" celled>
              <sui-table-header>
                <sui-table-row>
                  <sui-table-header-cell>Visit #</sui-table-header-cell>
                  <sui-table-header-cell>Doktor İsmi</sui-table-header-cell>
                  <sui-table-header-cell>Visit Son Değiştirme Tarihi</sui-table-header-cell>
                  <sui-table-header-cell>Visit Açıklaması</sui-table-header-cell>
                  <sui-table-header-cell>Visit Durumu</sui-table-header-cell>
                  <sui-table-header-cell>Visit Oluşturulma Tarihi</sui-table-header-cell>
                </sui-table-row>
              </sui-table-header>

              <sui-table-body v-for="(visit) in patientVisits" :key="visit.id">
                <sui-table-row v-if="visit.visitStatus" positive>
                  <sui-table-cell>
                    <sui-label ribbon>
                      {{ visit.id }}
                    </sui-label>
                  </sui-table-cell>
                  <sui-table-cell>{{ visit.doctorFirstName }} {{ visit.doctorLastName }}</sui-table-cell>
                  <sui-table-cell>{{ visit.visitDate }}</sui-table-cell>
                  <sui-table-cell>{{ visit.visitDescription }}</sui-table-cell>
                  <sui-table-cell v-if="visit.visitStatus">
                    <sui-icon name="check"/>
                    Aktif
                  </sui-table-cell>
                  <sui-table-cell v-else>
                    <sui-icon name="attention"/>
                    Kapalı
                  </sui-table-cell>
                  <sui-table-cell>{{ visit.visitCreateDate }}</sui-table-cell>
                </sui-table-row>
                <sui-table-row v-else warning>
                  <sui-table-cell>
                    <sui-label ribbon>
                      {{ visit.id }}
                    </sui-label>
                  </sui-table-cell>
                  <sui-table-cell>{{ visit.doctorFirstName }} {{ visit.doctorLastName }}</sui-table-cell>
                  <sui-table-cell>{{ visit.visitDate }}</sui-table-cell>
                  <sui-table-cell>{{ visit.visitDescription }}</sui-table-cell>
                  <sui-table-cell v-if="visit.visitStatus">
                    <sui-icon name="check"/>
                    Aktif
                  </sui-table-cell>
                  <sui-table-cell v-else>
                    <sui-icon name="attention"/>
                    Kapalı
                  </sui-table-cell>
                  <sui-table-cell>{{ visit.visitCreateDate }}</sui-table-cell>
                </sui-table-row>
              </sui-table-body>

              <sui-table-footer>
                <sui-table-row>
                  <sui-table-header-cell colspan="6">

                  </sui-table-header-cell>
                </sui-table-row>
              </sui-table-footer>
            </sui-table>
            <div v-else>Hastanın Visiti Bulunmamaktadır</div>
          </div>
          <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
          </div>
        </div>
      </div>
    </div>
    <!-- visit ekle modal-->
    <div class="modal fade" id="addVisitModal" tabindex="-1" aria-labelledby="changesModalLabel" aria-hidden="true">
      <b-alert v-if="showNotifyaddVisit" class="mt-3 position-absolute top-0 end-0"
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
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <p><b>{{ patientInfo.patientIdentityNum }} - {{ patientInfo.patientFirstName }}
              {{ patientInfo.patientLastName }}</b></p>
            <h5 class="modal-title" id="addVisitModalLabel"></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body mt-3">
            <div class="card">
              <div class="card-header">
                <span>Visit Bilgileri</span>
              </div>
              <div class="card-body">
                <sui-form>
                  <sui-form-fields fields="two">
                    <sui-form-field>
                      <label>Hasta:</label>
                      <input
                          disabled
                          :value="patientInfo.patientIdentityNum + ' - ' + patientInfo.patientFirstName + ' ' +
                           patientInfo.patientLastName "
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
                        <input type="datetime-local" id="visitDate" name="visitDate" v-model="visitObj.visitDate">
                      </form>
                    </sui-form-field>
                    <sui-form-field>
                      <label>Visit Detayı:</label>
                      <textarea id="visitDesc" name="visitDesc" rows="4" v-model="visitObj.visitDescription"></textarea>
                    </sui-form-field>
                  </sui-form-fields>
                </sui-form>
              </div>
              <div class="card-footer justify-content-center">
                <button class="btn btn-success mt-2" @click="addVisit(); showAlert()">Visit Ekle</button>
              </div>
            </div>
          </div>
          <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
          </div>
        </div>
      </div>
    </div>
    <!-- randevu modal -->
    <div class="modal fade" id="appointmentsModal" tabindex="-1" aria-labelledby="changesModalLabel" aria-hidden="true">
      <b-alert v-if="showNotifyAppointment" class="mt-3 position-absolute top-0 end-0"
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
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <p><b>{{ patientInfo.patientIdentityNum }} - {{ patientInfo.patientFirstName }}
              {{ patientInfo.patientLastName }}</b></p>
            <h5 class="modal-title" id="appointmentsModalLabel"></h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body mt-3">
            <sui-table v-if="patientAppointments.length > 0" celled>
              <sui-table-header>
                <sui-table-row>
                  <sui-table-header-cell>Randevu #</sui-table-header-cell>
                  <sui-table-header-cell>Doktor İsmi</sui-table-header-cell>
                  <sui-table-header-cell>Randevu Tarihi</sui-table-header-cell>
                  <sui-table-header-cell>Departman</sui-table-header-cell>
                  <sui-table-header-cell>Randevu Durumu</sui-table-header-cell>
                  <sui-table-header-cell>Randevu Oluşturulma Tarihi</sui-table-header-cell>
                </sui-table-row>
              </sui-table-header>

              <sui-table-body v-for="(appointment) in patientAppointments" :key="appointment.id">
                <sui-table-row v-if="appointment.appointmentStatus" positive>
                  <sui-table-cell>
                    <sui-label ribbon>
                      {{ appointment.id }}
                    </sui-label>
                  </sui-table-cell>
                  <sui-table-cell>{{ appointment.doctorName }}</sui-table-cell>
                  <sui-table-cell>{{ appointment.appointmentDate }}</sui-table-cell>
                  <sui-table-cell>{{ appointment.department }}</sui-table-cell>
                  <sui-table-cell v-if="appointment.appointmentStatus">
                    <sui-icon name="check"/>
                    Aktif
                  </sui-table-cell>
                  <sui-table-cell v-else>
                    <sui-icon name="attention"/>
                    Kapalı
                  </sui-table-cell>
                  <sui-table-cell>{{ appointment.createDate }}</sui-table-cell>
                </sui-table-row>
                <sui-table-row v-else warning>
                  <sui-table-cell>
                    <sui-label ribbon>
                      {{ appointment.id }}
                    </sui-label>
                  </sui-table-cell>
                  <sui-table-cell>{{ appointment.doctorName }}</sui-table-cell>
                  <sui-table-cell>{{ appointment.appointmentDate }}</sui-table-cell>
                  <sui-table-cell>{{ appointment.department }}</sui-table-cell>
                  <sui-table-cell v-if="appointment.appointmentStatus">
                    <sui-icon name="check"/>
                    Aktif
                  </sui-table-cell>
                  <sui-table-cell v-else>
                    <sui-icon name="attention"/>
                    Kapalı
                  </sui-table-cell>
                  <sui-table-cell>{{ appointment.createDate }}</sui-table-cell>
                </sui-table-row>
              </sui-table-body>

              <sui-table-footer>
                <sui-table-row>
                  <sui-table-header-cell colspan="6">

                  </sui-table-header-cell>
                </sui-table-row>
              </sui-table-footer>
            </sui-table>
            <div v-else>Hastanın Randevusu Bulunmamaktadır</div>
          </div>
          <div class="modal-footer justify-content-center">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
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
    if (!this.dismissChanges) {
      if (this.anyChange) {
        this.myModal.show();
        this.nextPagePath = to.path;
        next(false);
      } else {
        next();
      }
    } else {
      next();
    }
  },
  data() {
    return {
      patientInfo: {},
      tempPatientInfo: {},
      patientVisits: {},
      patientAppointments: {},
      identityNum: "",
      isEditable: false,
      anyChange: false,
      myModal: null,
      nextPagePath: "",
      dismissChanges: false,
      patientStatus: [
        {
          text: "Yatan Hasta",
          value: "Yatan Hasta",
        },
        {
          text: "Ayakta Tedavi",
          value: "Ayakta Tedavi",
        },
      ],
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

      visitObj: {
        patientId: "",
        doctorId: "",
        visitDate: "",
        visitDescription: "",
        visitStatus: true,
      },
      allDoctors: [],

      message: "",
      isProcessSuccessful: true,
      showNotify: false,
      showNotifyVisits: false,
      showNotifyaddVisit: false,
      showNotifyAppointment: false,
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
    this.myModal = new Modal(document.getElementById('changesModal'), {
      keyboard: false
    });
    this.identityNum = this.$route.params.id;
    axios.post("http://localhost:8081/api/patients/getById?id=" + this.identityNum)
        .then((response) => {
          console.log("getting patient info success");
          this.patientInfo = response.data.data;
        })
        .catch(error => {
          console.log("getting patient info failed");
          console.log(error);
        });
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
    goNextPage() {
      this.dismissChanges = true;
      this.$router.push(this.nextPagePath);
      this.myModal.hide();
      this.myModal.dispose();
    },
    updatePatient() {
      axios.put("http://localhost:8081/api/patients/updatePatient", this.patientInfo)
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
    deletePatient() {
      axios.post("http://localhost:8081/api/patients/delete", this.patientInfo)
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
          })
    },
    showVisits() {
      axios.post("http://localhost:8081/api/visits/getPatientVisitById?id=" + this.patientInfo.patientIdentityNum)
          .then((response) => {
            this.showNotifyVisits = true;
            this.showAlert();
            this.patientVisits = response.data.data;
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
    getAllDoctors() {
      axios.get("http://localhost:8081/api/doctors/getAllDoctors")
          .then((response) => {
            console.log(response.data.message);
            this.allDoctors = response.data.data;
            this.allDoctors.forEach((doctor, index) => {
              this.allDoctors[index]['text'] = doctor.doctorIdentityNum + " - " + doctor.doctorFirstName + " " + doctor.doctorLastName;
              this.allDoctors[index]['value'] = doctor.doctorIdentityNum;
            })
          })
          .catch(error => {
            console.log("getting all doctors failed.")
            console.log(error);
          });
    },
    addVisit() {
      const today = new Date();
      const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      const dateTime = date + ' ' + time;
      if (this.visitObj.visitDate < dateTime) {
        this.visitObj.visitStatus = false;
      }
      this.visitObj.patientId = this.patientInfo.patientIdentityNum;
      axios.post("http://localhost:8081/api/visits/add", this.visitObj)
          .then((response) => {
            if (response.data.success) {
              this.showNotifyaddVisit = true;
              this.variant = this.success;
              this.message = response.data.message;
            }
          })
          .catch(error => {
            this.showNotify = true;
            this.variant = this.danger;
            this.message = error;
          })
    },
    showAppointments() {
      axios.post("http://localhost:8081/api/appointments/getPatientAppointmentById?id=" + this.patientInfo.patientIdentityNum)
          .then((response) => {
            this.showNotifyAppointment = true;
            this.showAlert();
            this.patientAppointments = response.data.data;
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
    temp() {
      console.log(this.patientInfo);
      console.log(this.tempPatientInfo);
    }
  }
}
</script>

<style scoped>
.material-icons {
  display: flex;
  align-items: center;
}

.slideCard {
  left: 91%;
  width: 10rem;
  transition: all 1s ease-in-out;
}

.slideCard:hover {
  left: 101%;
}

.vertical-center {
  position: absolute;
  top: 50%;
  transform: translate(0%, -50%);
}

.center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
}

.noPadding {
  padding: 0 !important;
  margin: 0 !important;
}

.z-index_-1 {
  z-index: -1;
}

/*!*animation: myMove 2s;*!*/
/*-webkit-animation-fill-mode: forwards;*/
/*animation-fill-mode: forwards;*/
/*@keyframes myMove {*/
/*  from {*/
/*    left: 75.54%;*/
/*  }*/
/*  to {*/
/*    left: 79.5%;*/
/*  }*/
/*}*/
</style>
