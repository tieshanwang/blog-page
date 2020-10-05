<template>
    <div class="login">
        <br>
        <b-container>
            <b-row>
                <b-col md="6" offset-md="3">
                    <b-alert show variant="warning" dismissible>需要验证身份</b-alert>
                    <b-input-group prepend="密码">
                        <b-form-input type="password" v-model="password" autofocus @keyup.enter="enterLogin"></b-form-input>
                        <b-input-group-append>
                            <b-button variant="success" :disabled="password.length < 6" @click="login">登录</b-button>
                        </b-input-group-append>
                    </b-input-group>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import axios from '../scripts/ajax'
import { API_HOST } from '../scripts/config'

export default {
    name: 'Login',
    data() {
        return {
            // 密码
            password: '',
            // 重定向
            redirect: this.$route.query.redirect || '/'
        }
    },
    created() {
        // 初始化
        axios.get(`${API_HOST}/has_admin`).then(res => {
            if (res.code === 0) {
                if (res.data === true) {
                    return
                }
                sessionStorage.setItem('token', res.data)
                this.$router.push({
                    path: '/password'
                })
            } else {
                this.errorTip(res.msg)
            }
        }).catch(err => {
            console.log(err)
        })
    },
    methods: {
        // 错误提示
        errorTip(msg) {
            this.$bvModal.msgBoxOk(msg, {
                title: '提示',
                size: 'sm',
                buttonSize: 'sm',
                okVariant: 'danger',
                okTitle: '确认',
                headerClass: 'border-bottom-0',
                footerClass: 'border-top-0',
                centered: true
            })
        },
        // 登录
        login() {
            const params = {
                password: this.password
            }
            axios.post(`${API_HOST}/admin_login`, params).then(res => {
                if (res.code === 0) {
                    sessionStorage.setItem('token', res.data)
                    this.$router.push({
                        path: this.redirect
                    })
                } else {
                    this.errorTip(res.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 回车登录
        enterLogin() {
            if (this.password.length < 6) {
                this.errorTip('密码格式错误')
                return
            }
            this.login()
        }
    }
}
</script>
