<template>
    <div class="editor">
        <header-bar title="编辑文章"></header-bar>
        <br>
        <b-container>
            <b-form @submit="onSubmit" @reset="onReset" v-if="show">
                <b-form-group label="标题：" description="文章标题不能为空">
                    <b-form-input v-model.trim="title" required placeholder="请输入标题" spellcheck="false"></b-form-input>
                </b-form-group>
                <b-form-group label="内容：" description="在此处粘贴所复制的markdown文本">
                    <b-form-textarea v-model.trim="content" required placeholder="请输入内容" rows="5" spellcheck="false"></b-form-textarea>
                </b-form-group>
                <b-form-group label="标签：" description="选择与文章类型相关的标签">
                    <b-form-tags v-model="tagsName" size="lg" add-on-change no-outer-focus>
                        <template v-slot="{ tags, inputAttrs, inputHandlers, disabled, removeTag }">
                            <ul v-if="tags.length > 0" class="list-inline d-inline-block">
                                <li v-for="tag in tags" :key="tag" class="list-inline-item">
                                    <b-form-tag @remove="removeTag(tag)" :title="tag" :disabled="disabled" variant="info">{{ tag }}</b-form-tag>
                                </li>
                            </ul>
                            <b-form-select v-bind="inputAttrs" v-on="inputHandlers" :disabled="disabled || availableOptions.length === 0" :options="availableOptions">
                                <template v-slot:first>
                                    <option disabled value="">选择标签</option>
                                </template>
                            </b-form-select>
                        </template>
                    </b-form-tags>
                </b-form-group>
                <div>
                    <b-button variant="outline-primary" size="sm" pill v-b-modal.create-tag>创建新标签</b-button>
                </div>
                <br>
                <b-form-group label="附件：" description="请上传images文件夹下的图片">
                    <b-form-file v-model="images" @input="uploadImage" multiple accept="image/*" placeholder="选择图片" browse-text="浏览" drop-placeholder="拖拽文件到此处"></b-form-file>
                </b-form-group>
                <div v-if="showProgress">
                    <b-progress :value="progressValue" :max="progressMax" animated></b-progress>
                    <br>
                </div>
                <b-button type="submit" variant="primary">提交</b-button>&nbsp;
                <b-button type="reset" variant="danger">重置</b-button>&nbsp;
                <b-button v-if="$route.query.id" variant="outline-danger" pill @click="deleteConfirm">删除</b-button>
            </b-form>
        </b-container>
        <b-modal id="create-tag" title="创建新标签" @show="tagName = ''">
            <b-form-input v-model.trim="tagName" placeholder="请输入标签名"></b-form-input>
            <template v-slot:modal-footer="{ cancel }">
                <b-button variant="danger" @click="cancel()">取消</b-button>
                <b-button variant="success" :disabled="tagName.length < 2" @click="createTag">确认</b-button>
            </template>
        </b-modal>
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
    name: 'Editor',
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
        // 提交表单
        onSubmit(evt) {
            evt.preventDefault()
            if (this.tagsName.length == 0) {
                this.errorTip('标签不能为空')
                return
            }
            let params = {
                title: this.title,
                content: this.content,
                tags_name: this.tagsName
            }
            if (this.$route.query.id) {
                params.id = this.$route.query.id
            }
            axios.post(`${API_HOST}/${this.$route.query.id?'article_change':'create_article'}`, params).then(res => {
                if (res.code === 0) {
                    this.$bvModal.msgBoxOk('保存文章成功', {
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
        },
        // 重置表单
        onReset(evt) {
            evt.preventDefault()
            this.title = ''
            this.content = ''
            this.tagsName = []
            this.images = []
            this.show = false
            this.$nextTick(() => {
                this.show = true
            })
        },
        // 获取标签列表
        getTagList() {
            axios.get(`${API_HOST}/tag_list`).then(res => {
                if (res.code === 0) {
                    this.tagOptions = res.data.map(item => item.name)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 创建新标签
        createTag() {
            const params = {
                name: this.tagName
            }
            axios.post(`${API_HOST}/create_tag`, params).then(res => {
                this.$bvModal.hide('create-tag')
                if (res.code === 0) {
                    this.getTagList()
                } else {
                    this.errorTip(res.msg)
                }
            }).catch(err => {
                this.$bvModal.hide('create-tag')
                console.log(err)
            })
        },
        // 上传图片
        uploadImage() {
            const fd = new FormData()
            for (const image of this.images) {
                fd.append('files', image)
            }
            this.progressValue = 0
            this.progressMax = 100
            this.showProgress = true
            axios.post(`${API_HOST}/upload`, fd, {
                onUploadProgress: evt => {
                    this.progressValue = evt.loaded
                    this.progressMax = evt.total
                }
            }).then(res => {
                setTimeout(() => {
                    this.showProgress = false
                }, 1000)
                if (res.code !== 0) {
                    this.errorTip(res.msg)
                }
            }).catch(err => {
                this.showProgress = false
                console.log(err)
            })
        },
        // 删除文章
        deleteConfirm() {
            this.$bvModal.msgBoxConfirm('是否永久删除该文章?', {
                title: '警告',
                size: 'sm',
                buttonSize: 'sm',
                okVariant: 'danger',
                okTitle: '删除',
                cancelTitle: '取消',
                centered: true
            }).then(value => {
                if (value) {
                    this.deleteArticle(this.$route.query.id)
                }
            })
        },
        // 删除确认
        deleteArticle(id) {
            axios.get(`${API_HOST}/article_delete/${id}`).then(res => {
                if (res.code === 0) {
                    this.$bvModal.msgBoxOk('删除成功, 即将返回首页...', {
                        buttonSize: 'sm',
                        okVariant: 'success',
                        okTitle: '确认',
                        footerClass: 'border-top-0',
                        centered: true
                    }).then(() => {
                        this.$router.replace({
                            path: '/'
                        })
                    })
                } else {
                    this.errorTip(res.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        }
    },
    data() {
        return {
            // 用于重置表单
            show: true,
            // 标题
            title: '',
            // 内容
            content: '',
            // 标签
            tagsName: [],
            // 标签选项
            tagOptions: [],
            // 新建标签名
            tagName: '',
            // 图片附件
            images: [],
            // 进度条选项
            showProgress: false,
            progressValue: 0,
            progressMax: 100
        }
    },
    computed: {
        // 过滤标签
        availableOptions() {
            return this.tagOptions.filter(item => this.tagsName.indexOf(item) === -1)
        }
    },
    created() {
        // 初始化
        if (this.$route.query.id) {
            axios.get(`${API_HOST}/article_info/${this.$route.query.id}`).then(res => {
                if (res.code === 0) {
                    this.title = res.data.title
                    this.content = res.data.content
                    this.tagsName = res.data.tags.map(item => item.name)
                } else {
                    this.errorTip(res.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        }
        this.getTagList()
    }
}
</script>
