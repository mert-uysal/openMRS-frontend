import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "HelloWorld",
        component: () => import('./components/HelloWorld.vue'),
    },
    {
        path: "/home",
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
        path: "/registration",
        name: "patientRegister",
        component: () => import('./views/patientRegister.vue'),
    },
];

export const router = new VueRouter({
    mode: "history",
    routes,
});
