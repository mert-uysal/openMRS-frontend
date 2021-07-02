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
        path: "/registration",
        name: "patientRegister",
        component: () => import('./views/patientRegister.vue'),
    },
];

export const router = new VueRouter({
    mode: "history",
    routes,
});
