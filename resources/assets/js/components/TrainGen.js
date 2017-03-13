module.exports = {
    generateTracks() {
        var x = 25;
        var y = 25;
        var d = 'R';
        var dontChangeDirection = false;
        var pOfChangeDirection = 0.25;
        var turns = {
            'R': ['U', 'D'],
            'L': ['U', 'D'],
            'U': ['R', 'L'],
            'D': ['R', 'L']
        };
        var tracks = [];
        var exists = {};

        function nextTrack(x, y)
        {
            if (dontChangeDirection) {
                dontChangeDirection = false;
            } else if (Math.random() < pOfChangeDirection) {
                changeDirection();
                dontChangeDirection = true;
            }
            if (d === 'R') {
                x += 1;
            } else if (d === 'L') {
                x -= 1;
            } else if (d === 'U') {
                y += 1;
            } else if (d === 'D') {
                y -= 1;
            }

            return {
                x: x, 
                y: y,
                touches: []
            };
        }

        function changeDirection()
        {
            var directions = turns[d];
            d = directions[parseInt(Math.random() * directions.length)];
        }

        function trackAt(x, y)
        {
            if (exists[x + ',' + y]) {
                return exists[x + ',' + y];
            }
            return null;
        }

        function outOfBounds(x, y)
        {
            return x < 0 || y < 0 || x > 49 || y > 49;
        }

        function tryToAddTrack(track)
        {
            var alreadyGotOne = trackAt(track.x, track.y);
            if (alreadyGotOne) {
                x = alreadyGotOne.x;
                y = alreadyGotOne.y;
                dontChangeDirection = true;
                return;
            }
            if (outOfBounds(track.x, track.y)) {
                return; // try again
            }
            x = track.x;
            y = track.y;
            tracks.push(track);
            exists[track.x + ',' + track.y] = track;
        }

        for (var i = 0; i < 100; i++) {
            var track = nextTrack(x, y);
            tryToAddTrack(track);
        }

        for (var i = 0; i < tracks.length; i++) {
            tracks[i].touches = [
                {direction: 'U', track: trackAt(tracks[i].x, tracks[i].y - 1)}, // up
                {direction: 'R', track: trackAt(tracks[i].x + 1, tracks[i].y)},  // right
                {direction: 'D', track: trackAt(tracks[i].x, tracks[i].y + 1)}, // down
                {direction: 'L', track: trackAt(tracks[i].x - 1, tracks[i].y)} // left
            ].filter((connection) => !!connection.track);
        }

        return tracks;
    },

    generateTrain(trains, tracks, length, color, auto_fit) {
        console.log('generating a train of length ' + length);
        var freeSections = [];
        var section = [];
        for (var i = 0; i <= tracks.length; i++) {
            if (this.carAt(trains, tracks[i]) || i === tracks.length) {
                if (section.length > 0) {
                    freeSections.push(section);
                }
                section = [];
            } else {
                section.push(tracks[i]);
            }
        }
        var longFreeSections = freeSections.filter((section)  => section.length >= length);
        var chosen;
        if (longFreeSections.length > 0) {
            chosen = longFreeSections[parseInt(Math.random() * longFreeSections.length)];
        } else if (auto_fit) {
            chosen = freeSections.reduce(function (best, section) {
                return best.length > section.length ? best : section;
            });
            length = chosen.length;
        } else {
            throw new Error('Track has no empty space to support train of ' + length + ' cars.');
        }
        var train = [];
        var start = parseInt(Math.random() * (chosen.length - length));
        for (var i = start; i < start + length; i++) {
            train.push({
                track: chosen[i],
                color: color,
                damage: 0
            });
        }
        return train;
    },

    carAt(trains, track) {
        for (var i = 0; i < trains.length; i++) {
            var train = trains[i];
            for (var j = 0; j < train.length; j++) {
                if (train[j].track === track) {
                    return train[j];
                }
            }
        }
        return null;
    }
}
