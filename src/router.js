import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "homepage",
        component: () => import('./views/homepage.vue'),
    },
    {
        path: "/docRegistration",
        name: "doctorRegister",
        component: () => import('./views/doctorRegister.vue'),
    },
    {
        path: "/login",
        name: "doctorLogin",
        component: () => import('./views/doctorLogin.vue'),
    },
    {
        path: "/patientRegister",
        name: "patientRegister",
        component: () => import('./views/patientRegister.vue'),
    },
    {
        path: "/findPatient",
        name: "findPatient",
        component: () => import('./views/findPatient.vue'),
    },
    {
        path: "/displayPatient/:id",
        name: "displaySelectedPatient",
        component: () => import('./views/displaySelectedPatient.vue'),
        props: true,
    },
    {
        path: "/createVisit",
        name: "createVisit",
        component: () => import('./views/createVisit.vue'),
    },
    {
        path: "/displayVisits",
        name: "displayVisits",
        component: () => import('./views/displayVisits.vue'),
    },
    {
        path: "/createAppointment",
        name: "createAppointment",
        component: () => import('./views/createAppointment.vue'),
    },
    {
        path: "/displayAppointments",
        name: "displayAppointment",
        component: () => import('./views/displayAppointment.vue'),
        props: true,
    },
    {
        path: "/profile",
        name: "profile",
        component: () => import('./views/profile.vue'),
        props: true,
    },

];

export const router = new VueRouter({
    mode: "history",
    routes,
});
