import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "HelloWorld",
        component: () => import('./components/HelloWorld.vue'),
    },
];

export const router = new VueRouter({
    mode: "history",
    routes,
});
