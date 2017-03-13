<template>
    <div class="train-track" :class="primaryDirection" :style="{ left: (track.x * 10) + 'px', top: (track.y * 10) + 'px' }" @click="$emit('track-clicked', track)"></div>
</template>

<script>
    export default {
        props: ['track'],
        computed: {
            primaryDirection() {
                // 2 directions is normal and not worth showing.
                // 3 or 4 directions is something the user should
                // know about.
                if (this.track.touches.length <= 2) {
                    return '';
                }
                return this.track.touches[0].direction;
            }
        }
    }
</script>

<style>
.train-track {
    border: 1px solid #CCC;
    width: 10px;
    height: 10px;
    position: absolute;
}
.train-track.U {
    border-top: 1px solid green;
}
.train-track.D {
    border-bottom: 1px solid green;
}
.train-track.L {
    border-left: 1px solid green;
}
.train-track.R {
    border-right: 1px solid green;
}
</style>
