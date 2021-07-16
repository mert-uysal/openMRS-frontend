<template lang="html">
  <div class="container">
    <div class="row row-cols-2 row-cols-lg-3">
      <div class="col">
        <sui-button class="main-button" @click.prevent="$router.push('/findPatient')">
          <i class="fas fa-search fa-3x position-absolute top-0 start-50 translate-middle-x icon-m"></i>
          <p class="button-description description-m">Hasta Ara</p>
        </sui-button>
      </div>
      <div class="col">
        <sui-button class="main-button" @click.prevent="$router.push('/patientRegister')">
          <i class="material-icons position-absolute top-0 start-50 translate-middle-x icon-m"
             style="font-size:48px;">how_to_reg</i>
          <p class="button-description description-m">Hasta Kayıt</p>
        </sui-button>
      </div>
      <div class="col">
        <sui-button class="main-button" @click.prevent="$router.push('/displayVisits')">
          <i class="far fa-calendar-check fa-3x position-absolute top-0 start-50 translate-middle-x icon-m"></i>
          <p class="button-description description-m">Visitler</p>
        </sui-button>
      </div>
      <div class="col">
        <sui-button class="main-button" @click.prevent="$router.push('/createVisit')">
          <i class="far fa-calendar-plus fa-3x position-absolute top-0 start-50 translate-middle-x icon-m"></i>
          <p class="button-description description-m">Visit Oluştur</p>
        </sui-button>
      </div>
      <div class="col">
        <sui-button class="main-button">
          <i class="material-icons position-absolute top-0 start-50 translate-middle-x icon-m"
             style="font-size:48px;">disabled_by_default</i>
          <p class="button-description description-m">default</p>
        </sui-button>
      </div>
      <div class="col">
        <sui-button class="main-button">
          <i class="material-icons position-absolute top-0 start-50 translate-middle-x icon-m"
             style="font-size:48px;">disabled_by_default</i>
          <p class="button-description description-m">default</p>
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
  width: 11.375rem;
  height: 8.125rem;
}
</style>
