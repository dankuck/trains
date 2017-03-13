<template>
    <div>
        <div class="train-controls">
            <button @click="step">Step</button> 
            <button @click="run">Run</button> 
            <button @click="stop">Stop</button> 
            <button @click="toggle_config">Recreate</button> 
            <div v-if="config_open" class="config">
                <div>
                    <label>Train Count</label>
                    <input v-model="train_count" class="number">
                </div>
                <div v-for="train_config in train_configs">
                    <label>Train</label>
                    <input v-model="train_config.length" class="number">
                    <label>Color</label>
                    <input v-model="train_config.color" class="number">
                </div>
                <button @click="recreate">Recreate</button> 
            </div>
        </div>
        <div class="train-yard">
            <dev-train-track v-for="track in tracks" :track="track" @track-clicked="trackClicked"></dev-train-track>
            <template v-for="train in trains">
                <dev-train-car v-for="car in train" :track="car.track" :color="car.color" :damage="car.damage" :max-damage="maxDamage"></dev-train-car>
            </template>
        </div>
    </div>
</template>

<script>
    import TrainGen from './TrainGen.js';

    export default {
        mounted() {
            console.log('choo choo');
        },
        data() {
            var tracks = TrainGen.generateTracks();
            var trains = [];
            trains.push(TrainGen.generateTrain(trains, tracks, 5, 'red'));
            trains.push(TrainGen.generateTrain(trains, tracks, 3, 'blue'));
            return {
                maxDamage: 5,
                tracks: tracks,
                trains: trains,
                runner: null,
                train_count: trains.length,
                train_configs: [
                    {length: 5, color: '#F00'},
                    {length: 3, color: '#00F'}
                ],
                config_open: false
            };
        },
        watch: {
            train_count(val) {
                if (this.train_configs.length > val) {
                    this.train_configs.length = val;
                } else {
                    var colors = ['Orange', 'Red', 'Blue', 'DeepPink', 'OliveDrab', 'FireBrick', 'BlueViolet', 'DarkGreen', 'Turquoise', 'Gold', 'Chocolate'];
                    while (this.train_configs.length < val) {
                        this.train_configs.push({
                            length: parseInt(3 + Math.random() * 20), 
                            color: colors[parseInt(Math.random() * colors.length)]
                        });
                    }
                }
            }
        },
        methods: {
            toggle_config() {
                this.config_open = !this.config_open;
            },
            recreate() {
                this.tracks = TrainGen.generateTracks();
                var trains = [];
                for (var i = 0; i < this.train_configs.length; i++) {
                    trains.push(TrainGen.generateTrain(trains, this.tracks, parseInt(this.train_configs[i].length), this.train_configs[i].color));
                }
                this.trains = trains;
            },
            step() {
                for (var i = 0; i < this.trains.length; i++) {
                    if (!this.isBrokenTrain(this.trains[i])) {
                        this.stepTrain(this.trains[i]);
                    }
                }
            },
            stepTrain(train) {
                var track = train[0].track;
                // Don't go backwards => don't go in the direction of the second train car
                if (train[1]) {
                    var forwards = track.touches.filter((connection) => TrainGen.carAt(this.trains, connection.track) !== train[1]);
                } else {
                    var forwards = track.touches;
                }
                var new_tracks = forwards.filter((connection) => !TrainGen.carAt(this.trains, connection.track));
                if (new_tracks.length === 0) {
                    if (forwards[0]) {
                        this.checkCrash(train[0], forwards[0].track);
                    }
                    train.reverse();
                    return;
                }
                var old_track = track;
                train[0].track = new_tracks[0].track;
                for (var i = 1; i < train.length; i++) {
                    var t = train[i].track;
                    train[i].track = old_track;
                    old_track = t;
                }
            },
            checkCrash(car, track) {
                var crashInto = TrainGen.carAt(this.trains, track);
                if (crashInto) {
                    car.damage++;
                    crashInto.damage++;
                }
            },
            run() {
                if (this.runner) {
                    return;
                }
                this.runner = setInterval(()=>this.step(), 100);
            },
            stop() {
                if (this.runner) {
                    clearInterval(this.runner);
                    this.runner = null;
                }
            },
            trackClicked(track) {
                track.touches.push(track.touches.shift());
            },
            isBrokenTrain(train) {
                for (var i = 0; i < train.length; i++) {
                    if (train[i].damage >= this.maxDamage) {
                        return true;
                    }
                }
                return false;
            }
        }
    }

</script>

<style>
.train-yard {
    border: 1px solid black;
    display: block;
    width: 500px;
    height: 500px;
    margin: 25px;
    position: relative;
}
.train-controls {
    float: right;
    border: 1px solid grey;
    margin: 1em;
    padding: 1em;
    min-width: 15em;
}
.config label {
    display: block;
}
input.number {
    width: 3em;
}
</style>
