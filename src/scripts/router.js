import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

/* webpackChunkName: "components" */
const Home = () => import('../components/Home.vue')
const Login = () => import('../components/Login.vue')
const Password = () => import('../components/Password.vue')
const Editor = () => import('../components/Editor.vue')
const Article = () => import('../components/Article.vue')
const Tag = () => import('../components/Tag.vue')
const NotFound = () => import('../components/NotFound.vue')

const router = new VueRouter({
    routes: [
        {
            path: '/',
            component: Home
        },
        {
            path: '/login',
            component: Login
        },
        {
            path: '/password',
            component: Password,
            meta: { requiresAuth: true }
        },
        {
            path: '/editor',
            component: Editor,
            meta: { requiresAuth: true }
        },
        {
            path: '/article',
            component: Article
        },
        {
            path: '/tag',
            component: Tag
        },
        {
            path: '/error',
            component: NotFound
        },
        {
            path: '*',
            redirect: '/error'
        }
    ],
    scrollBehavior: () => ({ x: 0, y: 0 })
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        const token = sessionStorage.getItem('token')
        if (!token) {
            next({
                path: '/login',
                query: {
                    redirect: to.fullPath
                },
                replace: true
            })
        } else {
            next()
        }
    } else {
        next()
    }
})

export default router
