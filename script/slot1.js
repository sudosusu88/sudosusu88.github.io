/*
    requestAnimationFrame polyfill
*/
(function(w){
    var lastTime = 0,
        vendors = ['webkit', /*'moz',*/ 'o', 'ms'];
    for (var i = 0; i < vendors.length && !w.requestAnimationFrame; ++i){
        w.requestAnimationFrame = w[vendors[i] + 'RequestAnimationFrame'];
        w.cancelAnimationFrame = w[vendors[i] + 'CancelAnimationFrame']
            || w[vendors[i] + 'CancelRequestAnimationFrame'];
    }

    if (!w.requestAnimationFrame)
        w.requestAnimationFrame = function(callback, element){
            var currTime = +new Date(),
                timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                id = w.setTimeout(function(){ callback(currTime + timeToCall) }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!w.cancelAnimationFrame)
        w.cancelAnimationFrame = function(id){
        clearTimeout(id);
    };
})(this);

/*
    Slot Machine
*/
var sm = (function(undefined){

    var tMax = 3000, // animation time, ms
        height = 700,
        speeds = [],
        r = [],
        reels = [
            ['1','2','3','4','5','6','7','8','9','0'],
            ['1','2','3','4','5','6','7','8','9','0'],
            ['1','2','3','4','5','6','7','8','9','0'],
            ['1','2','3','4','5','6','7','8','9','0']
        ],
        $reels, $msg,
        start;

    function init(){
        $reels = $('.reel1').each(function(i, el){
            el.innerHTML = '<div><p>' + reels[i].join('</p><p>') + '</p></div><div><p>' + reels[i].join('</p><p>') + '</p></div>'
        });

        $msg = $('.msg');

        $('button').click(action);
    }

    function action(){
        if (start !== undefined) return;

        for (var i = 0; i < 10; ++i) {
            speeds[i] = Math.random() + .5; 
            r[i] = (Math.random() * 10 | 0) * height / 10;
        }

        $msg.html('Spinning...');
        animate();
    }

    function animate(now){
        if (!start) start = now;
        var t = now - start || 0;

        for (var i = 0; i < 4; ++i)
            $reels[i].scrollTop = (speeds[i] / tMax / 3 * (tMax - t) * (tMax - t) + r[i]) % height | 0;

        if (t < tMax)
            requestAnimationFrame(animate);
        else {
            start = undefined;
            check();
        }
    }

    function check(){
        $msg.html(
            r[0] === r[1] && r[1] === r[2] ?
                'You won! Enjoy your ' + reels[1][ (r[0] / 70 + 1) % 3 | 0 ].split(' ')[0]
            :
                'Try again'
        );
    }

    return {init: init}

})();

$(sm.init);
