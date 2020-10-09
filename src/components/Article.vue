<template>
    <div class="article">
        <header-bar title="文章详情"></header-bar>
        <br>
        <b-container>
            <div v-html="markedContent"></div>
            <hr>
            <div>
                <span>标签：</span>
                <span v-for="(item, index) in tags" :key="index">
                    <span v-if="index > 0">, </span>
                    <b-link :to="`/?tag=${item.id}`">{{ item.name }}</b-link>
                </span>
            </div>
            <br>
            <div>
                <b-button variant="outline-primary" size="sm" pill @click="handleSupport">好文要顶</b-button>&nbsp;
                <b-button variant="outline-danger" size="sm" pill>关注我</b-button>&nbsp;
                <b-button variant="outline-success" size="sm" pill>收藏该文</b-button>
            </div>
            <div>
                <small>阅读:{{ click }} 推荐:{{ support }} posted by 王铁山 @ {{ dateFormat(updateTime) }}</small>
            </div>
        </b-container>
        <br>
        <footer-bar></footer-bar>
    </div>
</template>

<script>
import HeaderBar from './utils/HeaderBar'
import FooterBar from './utils/FooterBar'

import marked from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/default.css'

import axios from '../scripts/ajax'
import { API_HOST } from '../scripts/config'
import { dateFormat } from '../scripts/utils'

export default {
    name: 'Article',
    components: {
        HeaderBar,
        FooterBar
    },
    data() {
        return {
            // 文章id
            id: this.$route.query.id,
            // 文章内容
            content: '',
            // 标签
            tags: [],
            // 阅读数
            click: 0,
            // 推荐数
            support: 0,
            // 更新时间
            updateTime: 0,
            dateFormat
        }
    },
    computed: {
        markedContent() {
            return marked(this.content)
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
        // 好文要顶
        handleSupport() {
            if (!this.id) {
                this.errorTip('文章信息不存在')
                return
            }
            const supported = sessionStorage.getItem('supported')
            if (supported === this.id) {
                this.errorTip('您已经推荐过了')
                return
            }
            axios.get(`${API_HOST}/article_support/${this.id}`).then(res => {
                if (res.code === 0) {
                    sessionStorage.setItem('supported', this.id)
                    this.support += 1
                    this.$bvModal.msgBoxOk('操作成功', {
                        buttonSize: 'sm',
                        okVariant: 'success',
                        okTitle: '确认',
                        footerClass: 'border-top-0',
                        centered: true
                    })
                } else {
                    this.errorTip(res.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        }
    },
    created() {
        // 初始化语法高亮
        marked.setOptions({
            highlight: (code, lang) => hljs.highlight(lang || 'plaintext', code).value
        })

        // 获取文章信息
        if (this.id) {
            axios.get(`${API_HOST}/article_info/${this.id}`).then(res => {
                if (res.code === 0) {
                    this.content = res.data.content
                    this.tags = res.data.tags
                    this.click = res.data.click
                    this.support = res.data.support
                    this.updateTime = res.data.update_time
                } else {
                    this.errorTip(res.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        }
    }
}
</script>

<style>
.article pre {
    background-color: whitesmoke;
    padding: 5px;
    border: solid 1px gray;
}

.article img {
    max-width: 100%;
    height: auto;
}
</style>
