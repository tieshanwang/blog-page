<template>
    <div class="tag">
        <header-bar title="全部标签"></header-bar>
        <br>
        <b-container>
            <b-link v-for="(item, index) in tagList" :key="index" :to="`/?tag=${item.id}`">&nbsp;{{ `${item.name}(${item.article_num})` }}&nbsp;</b-link>
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
    name: 'Tag',
    components: {
        HeaderBar,
        FooterBar
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
        }
    },
    data() {
        return {
            // 标签列表
            tagList: []
        }
    },
    created() {
        // 获取标签列表
        axios.get(`${API_HOST}/tag_list`).then(res => {
            if (res.code === 0) {
                this.tagList = res.data
            } else {
                this.errorTip(res.msg)
            }
        }).catch(err => {
            console.log(err)
        })
    }
}
</script>
