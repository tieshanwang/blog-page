<template>
    <div class="header-bar">
        <b-navbar toggleable="sm" type="dark" variant="dark">
            <b-navbar-brand>{{ title }}</b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item to="/">首页</b-nav-item>
                    <b-nav-item to="/editor">新随笔</b-nav-item>
                    <b-nav-item>联系</b-nav-item>
                    <b-nav-item>订阅</b-nav-item>
                    <b-nav-item to="/password">管理</b-nav-item>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>
</template>

<script>
export default {
    name: 'HeaderBar',
    props: {
        // 标题
        title: {
            type: String,
            default: '我的博客'
        }
    }
}
</script>
