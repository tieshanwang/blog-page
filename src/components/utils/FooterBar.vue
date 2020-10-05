<template>
    <div class="footer-bar">
        <p><i>Copyright &copy; {{ year }} 铁山之家 All Rights Reserved</i></p>
    </div>
</template>

<script>
export default {
    name: 'FooterBar',
    data() {
        return {
            // 当前年份
            year: (new Date()).getFullYear()
        }
    }
}
</script>

<style scoped>
p {
    text-align: center;
}
</style>
