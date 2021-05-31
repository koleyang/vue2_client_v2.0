<template>
    <div>
        <iframe :src="url" frameborder="0" class="mod-config" width="100%" height="920px" style="border-width: 0"></iframe>
    </div>
</template>

<script>
export default {
    data() {
        return {
            url: 'http://www.myjscode.com/threejs/editor/'
            // url: 'http://www.webgl3d.cn/threejs/editor/'
        }
    },
    created() {

    },
    mounted() {

    },
    methods: {

    }
}
</script>

<style scoped lang="less">

</style>
