<template lang="html">
  <div class="container">
    <div class="row row-cols-2 row-cols-lg-3">
      <div class="col">
        <sui-button class="main-button" @click.prevent="$router.push('/findPatient')">
          <i class="fas fa-search position-absolute top-0 start-50 translate-middle-x icon-m"></i>
          <p class="button-description description-m">Hasta Ara</p>
        </sui-button>
      </div>
      <div class="col">
        <sui-button class="main-button" @click.prevent="$router.push('/patientRegister')">
          <i class="material-icons position-absolute top-0 start-50 translate-middle-x icon-m">how_to_reg</i>
          <p class="button-description description-m">Hasta Kayıt</p>
        </sui-button>
      </div>
      <div class="col">
        <sui-button class="main-button" @click.prevent="$router.push('/displayVisits')">
          <i class="far fa-calendar-check position-absolute top-0 start-50 translate-middle-x icon-m"></i>
          <p class="button-description description-m">Visitler</p>
        </sui-button>
      </div>
      <div class="col">
        <sui-button class="main-button" @click.prevent="$router.push('/createVisit')">
          <i class="far fa-calendar-plus position-absolute top-0 start-50 translate-middle-x icon-m"></i>
          <p class="button-description description-m">Visit Oluştur</p>
        </sui-button>
      </div>
      <div class="col">
        <sui-button class="main-button" @click.prevent="$router.push('/createAppointment')">
          <i class="far fa-calendar-alt position-absolute top-0 start-50 translate-middle-x icon-m"></i>
          <p class="button-description description-m">Randevu Oluştur</p>
        </sui-button>
      </div>
      <div class="col">
        <sui-button class="main-button" @click.prevent="$router.push('/displayAppointments')">
          <i class="fas fa-calendar-day position-absolute top-0 start-50 translate-middle-x icon-m"></i>
          <p class="button-description description-m">Randevular</p>
        </sui-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "homepage",
  data() {
    return {

    }
  }
}
</script>

<style scoped>
.col {
  margin-bottom: 10px;
}
.icon-m {
  margin-top: 13px;
  font-size: 48px;
}

.description-m {
  margin-top: 45px;
}

.button-description {
  font-weight: bold;
  font-size: 20px;
}

.main-button {
  cursor: pointer;
  color: black;
  width: 15.375rem;
  height: 9.125rem;
}
</style>
