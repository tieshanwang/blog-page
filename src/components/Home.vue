<template>
    <div class="home">
        <b-jumbotron header="铁山之家" lead="算法之路无巅峰，勿忘初心，码得始终。" fluid container-fluid style="margin-bottom:0" class="d-none d-md-block"></b-jumbotron>
        <header-bar></header-bar>
        <br>
        <b-container>
            <b-row>
                <b-col>
                    <b-alert :show="Boolean(currentTag)" dismissible @dismissed="clearTag">{{ `当前标签：${currentTag && currentTag.name}` }}</b-alert>
                    <b-list-group>
                        <b-list-group-item v-for="(item, index) in articleList" :key="index">
                            <b-link :to="`/article?id=${item.id}`">
                                <big>{{ item.title }}</big>
                            </b-link>
                            <div>
                                <small>阅读:{{ item.click }} 推荐:{{ item.support }} posted by 王铁山 @ {{ dateFormat(item.update_time) }}</small>
                            </div>
                            <b-link :to="`/editor?id=${item.id}`">编辑</b-link>
                        </b-list-group-item>
                    </b-list-group>
                    <br>
                    <b-pagination v-model="pageNum" @input="pageChange" :total-rows="total" :per-page="pageSize" align="center"></b-pagination>
                </b-col>
                <b-col cols="4" class="d-none d-lg-block">
                    <b-card header="公告">
                        <span>站长：王铁山</span><br>
                        <span>粉丝：65536</span><br>
                        <span>关注：0</span><br>
                        <b-link>+加关注</b-link>
                    </b-card>
                    <br>
                    <b-calendar block locale="zh"></b-calendar>
                    <br>
                    <b-card header="我的标签">
                        <b-list-group>
                            <b-list-group-item button class="d-flex justify-content-between align-items-center" v-for="(item, index) in tagList.slice(0, 10)" :key="index" @click="setCurrentTag(item)">
                                <span>{{ item.name }}</span>
                                <b-badge variant="primary" pill>{{ item.article_num }}</b-badge>
                            </b-list-group-item>
                            <b-list-group-item v-if="tagList.length > 10" to="/tag">更多</b-list-group-item>
                        </b-list-group>
                    </b-card>
                </b-col>
            </b-row>
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
import { dateFormat } from '../scripts/utils'

export default {
    name: 'Home',
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
        },
        // 获取文章列表
        getArticleList() {
            axios.get(`${API_HOST}/article_list/${this.pageNum}/${this.pageSize}`).then(res => {
                if (res.code === 0) {
                    this.articleList = res.data.list
                    this.total = res.data.total
                } else {
                    this.errorTip(res.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 按标签查询文章
        findArticleByTag(id) {
            axios.get(`${API_HOST}/tag_of_article/${id}/${this.pageNum}/${this.pageSize}`).then(res => {
                if (res.code === 0) {
                    this.articleList = res.data.list
                    this.total = res.data.total
                } else {
                    this.errorTip(res.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 设置当前标签
        setCurrentTag(tag) {
            this.currentTag = tag
            this.pageNum = 1
            this.findArticleByTag(tag.id)
        },
        // 清除标签
        clearTag() {
            this.currentTag = null
            this.pageNum = 1
            this.getArticleList()
        },
        // 分页改变
        pageChange() {
            if (this.currentTag) {
                this.findArticleByTag(this.currentTag.id)
            } else {
                this.getArticleList()
            }
        }
    },
    data() {
        return {
            // 文章列表
            articleList: [],
            // 分页信息
            pageNum: 1,
            pageSize: 20,
            total: 1,
            // 时间格式函数
            dateFormat,
            // 标签列表
            tagList: [],
            // 当前标签
            currentTag: null
        }
    },
    created() {
        // 初始化标签和文章列表
        axios.get(`${API_HOST}/tag_list`).then(res => {
            if (res.code === 0) {
                const tagId = this.$route.query.tag
                if (tagId) {
                    this.currentTag = res.data.find(item => item.id === Number(tagId))
                }
                if (this.currentTag) {
                    this.findArticleByTag(this.currentTag.id)
                } else {
                    this.getArticleList()
                }
                this.tagList = res.data.sort((a, b) => (b.article_num - a.article_num))
            } else {
                this.errorTip(res.msg)
            }
        }).catch(err => {
            console.log(err)
        })
    }
}
</script>
