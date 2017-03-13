<template>
	<span>
	    <div class="train-car" :style="{ left: (track.x * 10) + 'px', top: (track.y * 10) + 'px', 'background-color': 'black' }"></div>
	    <div class="train-car" :style="{ left: (track.x * 10) + 'px', top: (track.y * 10) + 'px', 'background-color': color, 'opacity': (maxDamage - damage) / maxDamage }"></div>
   	</span>
</template>

<script>
    export default {
        props: ['track', 'color', 'damage', 'maxDamage']
    }
</script>

<style>
.train-car {
    border: 1px solid white;
    background-color: black;
    width: 10px;
    height: 10px;
    position: absolute;
}
</style>
