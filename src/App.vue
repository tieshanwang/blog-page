<template>
    <div id="app">
        <transition name="rotate">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'App'
}
</script>

<style scoped>
.rotate-enter {
    transform: rotateZ(360deg);
    opacity: 0;
}

.rotate-enter-active {
    transition: all 1s ease;
}
</style>
