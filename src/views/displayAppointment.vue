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
    <!-- TÜM randevular -->
    <div class="container">
      <div class="row align-items-center justify-content-center">
        <div class="col-auto">
          <label>Randevu Tarihi:</label>
        </div>
        <div class="col-4">
          <sui-form>
            <sui-form-fields>
              <sui-form-field>
                <form action="">
                  <input type="date" id="selectedDate" name="selectedDate" v-model="selectedDate">
                </form>
              </sui-form-field>
              <button class="btn btn-success mt-1 mb-1 ms-2">Listele</button>
            </sui-form-fields>
          </sui-form>
        </div>
        <div class="col-auto">
          <label class="mt-2">Randevu Ara:</label>
        </div>
        <div class="col-4">
          <input class="form-control" type="text" v-model="filter"/>
        </div>
      </div>
      <sui-table celled>
        <sui-table-header>
          <sui-table-row>
            <sui-table-header-cell>Randevu #</sui-table-header-cell>
            <sui-table-header-cell>Hasta TC</sui-table-header-cell>
            <sui-table-header-cell>Hasta İsmi</sui-table-header-cell>
            <sui-table-header-cell>Doktor İsmi</sui-table-header-cell>
            <sui-table-header-cell>Randevu Tarihi</sui-table-header-cell>
            <sui-table-header-cell>Departman</sui-table-header-cell>
            <sui-table-header-cell>Randevu Durumu</sui-table-header-cell>
            <sui-table-header-cell>Randevu Oluşturulma Tarihi</sui-table-header-cell>
          </sui-table-row>
        </sui-table-header>

        <sui-table-body v-for="(appointment) in filteredRows" :key="appointment.id">
          <sui-table-row v-if="appointment.appointmentStatus" positive>
            <sui-table-cell>
              <sui-label ribbon type="button" class="id-button">
                {{ appointment.id }}
              </sui-label>
            </sui-table-cell>
            <sui-table-cell>{{ appointment.patientId }}</sui-table-cell>
            <sui-table-cell>{{ appointment.patientName }}</sui-table-cell>
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
              <sui-label ribbon type="button" class="id-button">
                {{ appointment.id }}
              </sui-label>
            </sui-table-cell>
            <sui-table-cell>{{ appointment.patientId }}</sui-table-cell>
            <sui-table-cell>{{ appointment.patientName }}</sui-table-cell>
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
            <sui-table-header-cell colspan="8">
              <sui-button v-if="!isShowAll"
                          floated="right"
                          labeled
                          @click="showAll()">
                Tüm Randevuları Göster
              </sui-button>
<!--              <sui-button v-else-->
<!--                          floated="right"-->
<!--                          labeled-->
<!--              >-->
<!--                Sadece Aktif Visitleri Göster-->
<!--              </sui-button>-->
            </sui-table-header-cell>
          </sui-table-row>
        </sui-table-footer>
      </sui-table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "displayAppointment",
  data() {
    return {
      allAppointments: [],
      isShowAll: false,
      todayDateTime: "",
      todayDate: "",
      selectedDate: "",
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
  created() {
    this.getActiveAppointments();
    this.showAlert();
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
    if (hh < 10) {
      hh = '0' + hh;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    const date = yyyy + '-' + MM + '-' + dd;
    const time = hh + ":" + mm;
    this.todayDateTime = date + 'T' + time;
    this.todayDate = date;
    this.selectedDate = this.todayDate;
    console.log("selectedDate: " + this.selectedDate);
    console.log("app date: " + this.allAppointments);
  },
  computed: {
    filteredRows() {
      return this.filteredRowsByDate.filter(row => {
        const hastaBilgileri = row.patientId.toString().toLowerCase() + " " + row.patientName.toString().toLowerCase();
        const doktorBilgisi = row.doctorName.toString().toLowerCase();
        const departman = row.department.toString().toLowerCase();
        const searchTerm = this.filter.toLowerCase();

        return hastaBilgileri.includes(searchTerm) || doktorBilgisi.includes(searchTerm) || departman.includes(searchTerm);
      });
    },
    filteredRowsByDate() {
      return this.allAppointments.filter(row => {
        const appointDate = row.appointmentDate.toString();
        const changeDate = this.selectedDate.toString();
        return appointDate.includes(changeDate);
      })
    },
  },
  watch: {
    selectedDate() {
      if(this.selectedDate !== "") {
        this.isShowAll = false;
      }
    }
  },
  methods: {
    getActiveAppointments() {
      axios.get("http://localhost:8081/api/appointments/getAllActiveAppointments")
          .then((response) => {
            console.log(response);
            if (response.data.success) {
              console.log("getting appoint success");
              this.showAlert();
              this.showNotify = true;
              this.message = response.data.message;
              this.allAppointments = response.data.data;
              this.allAppointments.forEach((appointment, index) => {
                this.allAppointments[index].appointmentDate = appointment.appointmentDate.replace("T", " ");
                this.allAppointments[index].createDate = appointment.createDate.replace("T", " ");
              })
              console.log(this.allAppointments);
              this.variant = this.success;
            }
          })
          .catch(error => {
            this.showNotify = true;
            this.message = error;
            this.variant = this.warning;
          })
    },
    showAll() {
      this.isShowAll = !this.isShowAll;
      this.selectedDate = "";
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
