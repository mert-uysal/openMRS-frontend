<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item" v-for="routes in links" :key="routes.id">
            <router-link
                :class="{ active: $route.path === routes.page }"
                class="nav-link"
                :to="routes.page">{{ routes.text }}
            </router-link>
          </li>
        </ul>
        <div class="d-flex">
          <ul class="navbar-nav">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle"
                 href="#" id="navbarDropdown" role="button"
                 data-bs-toggle="dropdown" aria-expanded="false">
                <span style="color: white"> {{ userData.doctorFirstName }} {{userData.doctorLastName}} </span>
                <i class="fas fa-user-md ms-2 me-1" style="font-size: 22px"></i>
              </a>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="#"
                       @click.prevent="$router.push('/profile')">My Profile</a></li>
                <li><a
                    class="dropdown-item dropdown-logout"
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop"
                    href="#">Çıkış</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div>
      <div
          class="modal fade"
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabindex="-1"
          aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-body mt-3">
              Oturumu kapatmak istediğinizden emin misiniz??
            </div>
            <div class="modal-footer justify-content-center">
              <button type="button" class="btn btn-success" data-bs-dismiss="modal"
                      data-bs-toggle="modal"
                      data-bs-target="#message" @click="logOut()">
                Evet
              </button>
              <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
                Hayır
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal fade"
           id="message"
           tabindex="-1"
           aria-labelledby="messageLabel"
           aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-body">
              Başarıyla çıkış yapıldı, İyi Günler :)
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      currentUser: {},
      showLogOutMessage: false,
      userData: {},
      links: [
        {
          id: 1,
          text: 'Anasayfa',
          page: '/',
        },
        {
          id: 2,
          text: 'Hasta Kayıt',
          page: '/patientRegister',
        },
        {
          id: 3,
          text: 'Hasta Arama',
          page: '/findPatient',
        },
        {
          id: 4,
          text: 'Doktor Kayıt',
          page: '/docRegistration',
        },
      ],
    };
  },
  mounted() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.userData = JSON.parse(localStorage.getItem('userData'));
  },
  computed: {
    currentRoute() {
      return this.$router.currentRoute.path;
    },
  },
  watch: {
    $route() {
      if (localStorage.getItem('currentUser')) {
        try {
          this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        } catch (e) {
          localStorage.removeItem('currentUser');
        }
      }
    },
  },
  methods: {
    logOut() {
      this.showLogOutMessage = true;
      this.currentUser = null;
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userData');
      window.setTimeout(this.pushRouter, 2000);
    },
    pushRouter() {
      window.location.reload();
      this.showLogOutMessage = false;
    },
  },
}
</script>

<style scoped>
.navbar {
  padding-right: 0;
}
</style>
