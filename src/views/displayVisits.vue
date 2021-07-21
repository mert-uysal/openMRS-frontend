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
    <!-- TÜM VİSİTLER -->
    <div class="container">
      <div class="row align-items-center justify-content-center">
        <div class="col-auto">
          <label class="mt-2">Visit Ara:</label>
        </div>
        <div class="col-4">
          <input class="form-control" type="text" v-model="filter"/>
        </div>
      </div>
      <sui-table celled>
        <sui-table-header>
          <sui-table-row>
            <sui-table-header-cell>Visit #</sui-table-header-cell>
            <sui-table-header-cell>Hasta Bilgisi</sui-table-header-cell>
            <sui-table-header-cell>Doktor İsmi</sui-table-header-cell>
            <sui-table-header-cell>Visit Son Değiştirme Tarihi</sui-table-header-cell>
            <sui-table-header-cell>Visit Açıklaması</sui-table-header-cell>
            <sui-table-header-cell>Visit Durumu</sui-table-header-cell>
            <sui-table-header-cell>Visit Oluşturulma Tarihi</sui-table-header-cell>
          </sui-table-row>
        </sui-table-header>

        <sui-table-body>
          <sui-table-row v-for="(visit,index) in filteredRows" :key="visit.id">
            <sui-table-cell>
              <sui-label ribbon type="button" class="id-button"
                         data-bs-toggle="modal" data-bs-target="#visitModal"
                         @click="displayVisit(index)">
                {{ visit.id }}
              </sui-label>
            </sui-table-cell>
            <sui-table-cell>{{ visit.patientId }} - {{ visit.patientFirstName }} {{
                visit.patientLastName
              }}
            </sui-table-cell>
            <sui-table-cell>{{ visit.doctorFirstName }} {{ visit.doctorLastName }}</sui-table-cell>
            <sui-table-cell>{{ visit.visitDate }}</sui-table-cell>
            <sui-table-cell>{{ visit.visitDescription }}</sui-table-cell>
            <sui-table-cell v-if="visit.visitStatus">Aktif</sui-table-cell>
            <sui-table-cell v-else>Kapalı</sui-table-cell>
            <sui-table-cell>{{ visit.visitCreateDate }}</sui-table-cell>
          </sui-table-row>
        </sui-table-body>

        <sui-table-footer>
          <sui-table-row>
            <sui-table-header-cell colspan="7" class="position-relative">
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
              <sui-button v-if="!isShowAll" class="position-absolute end-0 me-2" @click="showAllVisits()">
                Tüm Visitleri Göster
              </sui-button>
              <sui-button v-else class="position-absolute end-0 me-2" @click="showAllVisits()">
                Sadece Aktif Visitleri Göster
              </sui-button>
            </sui-table-header-cell>
          </sui-table-row>
        </sui-table-footer>
      </sui-table>
    </div>
    <!-- SEÇİLEN VİSİT BİLGİLERİ MODAL -->
    <div class="modal fade" id="visitModal" tabindex="-1" aria-labelledby="visitModalLabel" aria-hidden="true">
      <b-alert v-if="showNotifyModal" class="mt-3 position-absolute top-0 end-0"
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
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="visitModalLabel">Visit Bilgileri</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <sui-form>
              <sui-header dividing class="mt-1">Hasta Bilgisi</sui-header>
              <sui-form-field>
                <sui-form-fields fields="two" class="ms-2 me-2">
                  <sui-form-field>
                    <label>Kimlik Numarası</label>
                    <input
                        type="text"
                        :value="editedVisitObj.patientId"
                        disabled
                    />
                  </sui-form-field>
                  <sui-form-field>
                    <label>Ad Soyad</label>
                    <input
                        type="text"
                        :value="editedVisitObj.patientFirstName + ' ' + editedVisitObj.patientLastName"
                        disabled
                    />
                  </sui-form-field>
                </sui-form-fields>
              </sui-form-field>
              <sui-header dividing class="mt-1">Doktor Bilgisi</sui-header>
              <sui-form-field>
                <sui-form-fields fields="two" class="ms-2 me-2">
                  <sui-form-field>
                    <label>Ad</label>
                    <input
                        type="text"
                        :value="editedVisitObj.doctorFirstName"
                        disabled
                    />
                  </sui-form-field>
                  <sui-form-field>
                    <label>Soyad</label>
                    <input
                        type="text"
                        :value="editedVisitObj.doctorLastName"
                        disabled
                    />
                  </sui-form-field>
                </sui-form-fields>
              </sui-form-field>
              <sui-header dividing class="mt-1">Visit Bilgileri</sui-header>
              <sui-form-field>
                <sui-form-fields fields="two" class="ms-2 me-2">
                  <sui-form-field>
                    <label>Visit Durumu</label>
                    <button v-if="editedVisitObj.visitStatus"
                            type="button"
                            class="btn btn-success"
                            @click="changeVisitStatus()">
                      Açık
                    </button>
                    <button v-if="!editedVisitObj.visitStatus"
                            type="button"
                            class="btn btn-secondary"
                            @click="changeVisitStatus()">
                      Kapalı
                    </button>
                  </sui-form-field>
                  <sui-form-field>
                    <label>Visit Açıklaması</label>
                    <textarea
                        type="text"
                        v-model="editedVisitObj.visitDescription"
                    />
                  </sui-form-field>
                </sui-form-fields>
              </sui-form-field>
            </sui-form>
          </div>
          <div class="modal-footer">
            <button @click="temp()">bas</button>
            <div is="sui-button-group">
              <sui-button type="button" data-bs-dismiss="modal">Cancel</sui-button>
              <sui-button-or/>
              <sui-button type="submit" @click="updateVisit(); showAlert()" positive>Save</sui-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "displayVisits",
  data() {
    return {
      allVisits: [],
      selectedVisitIndex: null,
      editedVisitObj: {},
      isShowAll: false,
      showChangesWarning: false,
      dismissModal: "",
      openModal: "",
      modalId: "",

      filter: "",

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
  mounted() {
    this.getActiveVisits();
    this.showAlert();
  },
  computed: {
    filteredRows() {
      return this.allVisits.filter(row => {
        const hastaBilgileri = row.patientId.toString().toLowerCase() + " " +
            row.patientFirstName.toString().toLowerCase()+ " " + row.patientLastName.toString().toLowerCase();
        const doktorBilgisi = row.doctorFirstName.toString().toLowerCase() + row.doctorLastName.toString().toLowerCase();
        const visitAciklamasi = row.visitDescription.toString().toLowerCase();
        const searchTerm = this.filter.toLowerCase();

        return hastaBilgileri.includes(searchTerm) ||
            doktorBilgisi.includes(searchTerm) ||
            visitAciklamasi.includes(searchTerm);
      });
    }
  },
  methods: {
    getAllVisits() {
      axios.get("http://localhost:8081/api/visits/getAllVisits")
          .then((response) => {
            if (response.data.success) {
              this.showNotify = true;
              this.message = response.data.message;
              this.allVisits = response.data.data;
              this.allVisits.forEach((visit, index) => {
                this.allVisits[index].visitDate = visit.visitDate.replace("T", " ");
                this.allVisits[index].visitCreateDate = visit.visitCreateDate.replace("T", " ");
              })
              this.variant = this.success;
            }
          })
          .catch(error => {
            this.showNotify = true;
            this.message = error;
            this.variant = this.warning;
          })
    },
    getActiveVisits() {
      axios.get("http://localhost:8081/api/visits/getAllActiveVisits")
          .then((response) => {
            if (response.data.success) {
              this.showNotify = true;
              this.message = response.data.message;
              this.allVisits = response.data.data;
              this.allVisits.forEach((visit, index) => {
                this.allVisits[index].visitDate = visit.visitDate.replace("T", " ");
                this.allVisits[index].visitCreateDate = visit.visitCreateDate.replace("T", " ");
              })
              this.variant = this.success;
            }
          })
          .catch(error => {
            this.showNotify = true;
            this.message = error;
            this.variant = this.warning;
          })
    },
    showAllVisits() {
      this.isShowAll = !this.isShowAll;
      if (!this.isShowAll) {
        this.getActiveVisits();
      } else {
        this.getAllVisits();
      }
      this.showAlert();
    },
    displayVisit(index) {
      this.editedVisitObj = JSON.parse(JSON.stringify(this.allVisits[index]));
      this.selectedVisitIndex = index;
    },
    changeVisitStatus() {
      this.editedVisitObj.visitStatus = !this.editedVisitObj.visitStatus;
    },
    updateVisit() {
      this.editedVisitObj.visitDate = this.editedVisitObj.visitDate.replace(" ", "T");
      this.editedVisitObj.visitCreateDate = this.editedVisitObj.visitCreateDate.replace(" ", "T");
      axios.put("http://localhost:8081/api/visits/updateVisit", this.editedVisitObj)
          .then((response) => {
            if (response.data.success) {
              this.showNotifyModal = true;
              this.message = response.data.message;
              this.variant = this.success;
            }
          })
          .catch(error => {
            this.showNotifyModal = true;
            this.message = error;
            this.variant = this.warning;
          })
      window.setTimeout(this.reloadPage, 1500);
    },
    reloadPage() {
      this.showNotify = false;
      this.showNotify = false;
      window.location.reload();
    },
    showAlert() {
      this.dismissCountDown = this.dismissSecs;
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    temp() {
      console.log(this.allVisits[0]);
      console.log(this.editedVisitObj);
    }
  }
}
</script>

<style scoped>
.container {

}

.id-button:hover {
  background-color: #7f8ca4;
}
</style>
