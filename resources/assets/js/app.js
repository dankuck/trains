
Vue.component('trains', require('./components/Trains.vue'));
Vue.component('train-track', require('./components/TrainTrack.vue'));
Vue.component('train-car', require('./components/TrainCar.vue'));

var app = new Vue({
    el: '#trains'
});
