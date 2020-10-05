<template>
    <div class="password">
        <header-bar title="设置密码"></header-bar>
        <br>
        <b-container>
            <b-form @submit="onSubmit" @reset="onReset" v-if="show">
                <b-form-group label="新密码：" description="密码长度应不少于6位">
                    <b-form-input type="password" v-model.trim="new_password" required placeholder="请输入新密码"></b-form-input>
                </b-form-group>
                <b-form-group label="确认密码：" description="请与新密码保持一致">
                    <b-form-input type="password" v-model.trim="confirm_password" required placeholder="请输入确认密码"></b-form-input>
                </b-form-group>
                <b-button type="submit" variant="primary">提交</b-button>&nbsp;
                <b-button type="reset" variant="danger">重置</b-button>
            </b-form>
        </b-container>
        <br>
        <footer-bar></footer-bar>
    </div>
</template>

<script>
import HeaderBar from './utils/HeaderBar'
import FooterBar from './utils/FooterBar'

import axios from '../scripts/ajax'
import { API_HOST } from '../scripts/config'

export default {
    name: 'Password',
    components: {
        HeaderBar,
        FooterBar
    },
    data() {
        return {
            // 用于重置表单
            show: true,
            // 新密码
            new_password: '',
            // 确认密码
            confirm_password: ''
        }
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
        // 提交表单
        onSubmit(evt) {
            evt.preventDefault()
            if (this.new_password.length < 6) {
                this.errorTip('密码格式错误')
                return
            }
            if (this.confirm_password !== this.new_password) {
                this.errorTip('两次密码输入不一致')
                return
            }
            const params = {
                password: this.confirm_password
            }
            axios.post(`${API_HOST}/set_password`, params).then(res => {
                if (res.code === 0) {
                    this.$bvModal.msgBoxOk('操作成功，即将返回首页...', {
                        buttonSize: 'sm',
                        okVariant: 'success',
                        okTitle: '确认',
                        footerClass: 'border-top-0',
                        centered: true
                    }).then(() => {
                        this.$router.push({
                            path: '/'
                        })
                    })
                } else {
                    this.errorTip(res.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 重置表单
        onReset(evt) {
            evt.preventDefault()
            this.new_password = ''
            this.confirm_password = ''
            this.show = false
            this.$nextTick(() => {
                this.show = true
            })
        }
    }
}
</script>
