document.addEventListener("DOMContentLoaded", () => {
    // Buttons (placeholder)
    const demoBtn = document.querySelector("button.demo");
    const tryBtn = document.getElementById("tryDemo");
    const onDemo = () => console.log("demo clicked");
    if (demoBtn) demoBtn.addEventListener("click", onDemo);
    if (tryBtn) tryBtn.addEventListener("click", onDemo);

    // ===== Canvas constellation =====
    const canvas = document.getElementById("bgCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    // ---- knobs ----
    const CFG = {
        // Stars (these are your nodes / constellation points)
        starDensityDiv: 15000, // was ~23000 earlier -> MORE stars, spread out
        starMin: 85,
        starMax: 165,

        starLifeMin: 18000,
        starLifeMax: 42000,
        starFadeInMin: 1400,
        starFadeInMax: 3200,
        starFadeOutMin: 2200,
        starFadeOutMax: 5200,

        // Snaking lines
        snakeLenMin: 7,
        snakeLenMax: 12,
        snakeSpeedMin: 0.60, // segments per second-ish
        snakeSpeedMax: 1.10,
        snakeRewireMin: 7000, // rebuild the snake path
        snakeRewireMax: 16000,

        // Line look
        lineAlpha: 0.070,
        lineWidth: 1
    };

    const S = {
        w: 0, h: 0,
        t: 0,
        stars: [],

        // snake path across star indices
        snake: {
            path: [],
            head: 0,        // float index (0..path.length-1)
            speed: 0.85,    // set per path
            len: 9,         // segments to show
            nextRewireAt: 0
        }
    };

    const now = () => performance.now();
    const rand = (a,b) => a + Math.random()*(b-a);
    const clamp = (v,a,b) => Math.max(a, Math.min(b,v));

    function resize(){
        S.w = Math.floor(window.innerWidth);
        S.h = Math.floor(window.innerHeight);

        canvas.width  = Math.floor(S.w * DPR);
        canvas.height = Math.floor(S.h * DPR);
        canvas.style.width = S.w + "px";
        canvas.style.height = S.h + "px";
        ctx.setTransform(DPR,0,0,DPR,0,0);

        // don’t wipe stars, just ensure enough exist
        S.snake.nextRewireAt = now() + rand(CFG.snakeRewireMin, CFG.snakeRewireMax);
        buildSnake();
    }

    // ---------- Stars ----------
    function spawnStar(){
        const born = now();
        S.stars.push({
            x: Math.random() * S.w,
            y: Math.random() * S.h,
            r: rand(0.55, 1.55),
            baseA: rand(0.045, 0.14),
            tw: rand(0.45, 1.4),
            ph: rand(0, Math.PI*2),

            born,
            life: rand(CFG.starLifeMin, CFG.starLifeMax),
            fadeIn: rand(CFG.starFadeInMin, CFG.starFadeInMax),
            fadeOut: rand(CFG.starFadeOutMin, CFG.starFadeOutMax),

            driftX: rand(-0.010, 0.010),
            driftY: rand(-0.008, 0.008)
        });
    }

    function starAlpha(s, t){
        const age = t - s.born;
        if (age < 0) return 0;

        const end = s.life;
        let a = 1;

        if (age < s.fadeIn) a = age / s.fadeIn;
        else if (age > end - s.fadeOut) a = clamp((end - age) / s.fadeOut, 0, 1);

        const tw = 0.5 + 0.5 * Math.sin(S.t * 0.001 * s.tw + s.ph);
        return s.baseA * a * (0.82 + 0.35 * tw);
    }

    function starTarget(){
        const t = Math.floor((S.w * S.h) / CFG.starDensityDiv);
        return clamp(t, CFG.starMin, CFG.starMax);
    }

    // ---------- Snake path builder ----------
    function buildSnake(){
        const t = now();

        // If not enough stars, bail
        if (S.stars.length < 10){
            S.snake.path = [];
            return;
        }

        // choose a subset = “alive” (all are alive but we’ll rebuild often)
        const n = S.stars.length;

        // start from a random star
        const start = Math.floor(Math.random() * n);

        // build a “nearest walk” (snakey chain) without revisiting
        const used = new Set([start]);
        const path = [start];

        const targetLen = Math.floor(rand(CFG.snakeLenMin, CFG.snakeLenMax));
        let cur = start;

        for (let step = 0; step < targetLen; step++){
            let best = -1;
            let bestD = Infinity;

            // find nearest not-used neighbor (cheap O(n), fine for this)
            for (let j = 0; j < n; j++){
                if (used.has(j)) continue;
                const a = S.stars[cur];
                const b = S.stars[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const d2 = dx*dx + dy*dy;
                if (d2 < bestD){
                    bestD = d2;
                    best = j;
                }
            }

            if (best === -1) break;
            used.add(best);
            path.push(best);
            cur = best;
        }

        // set snake
        S.snake.path = path;
        S.snake.head = 0;
        S.snake.speed = rand(CFG.snakeSpeedMin, CFG.snakeSpeedMax);
        S.snake.len = Math.min(path.length - 1, Math.floor(rand(CFG.snakeLenMin, CFG.snakeLenMax)));
        S.snake.nextRewireAt = t + rand(CFG.snakeRewireMin, CFG.snakeRewireMax);
    }

    // draw snake as a moving chain along the path
    function drawSnake(t){
        const path = S.snake.path;
        if (!path || path.length < 2) return;

        const maxSeg = path.length - 1;

        // head progresses continuously; loops within this path
        S.snake.head += (S.snake.speed * (1/60)); // approx segments per frame at 60fps
        if (S.snake.head > maxSeg) S.snake.head = 0;

        const headSeg = S.snake.head;
        const headI = Math.floor(headSeg);
        const headF = headSeg - headI;

        // tail is len segments behind head
        const tailSeg = Math.max(0, headSeg - S.snake.len);

        // draw full segments between tail..headI
        const drawFrom = Math.floor(tailSeg);
        const drawTo = headI;

        // gradient-ish alpha: tail faint -> head stronger
        for (let i = drawFrom; i <= drawTo; i++){
            const aIdx = path[i];
            const bIdx = path[i + 1];
            if (bIdx === undefined) continue;

            const a = S.stars[aIdx];
            const b = S.stars[bIdx];
            if (!a || !b) continue;

            // only draw if both stars currently visible-ish
            const aa = starAlpha(a, t);
            const ab = starAlpha(b, t);
            const vis = Math.min(aa, ab);
            if (vis <= 0.002) continue;

            const prog = (i - tailSeg) / Math.max(1e-6, (headSeg - tailSeg));
            const alpha = CFG.lineAlpha * vis * clamp(prog, 0.0, 1.0);

            ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
            ctx.lineWidth = CFG.lineWidth;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
        }

        // draw partial segment at the head (smooth movement)
        if (headI < maxSeg){
            const a = S.stars[path[headI]];
            const b = S.stars[path[headI + 1]];
            if (a && b){
                const aa = starAlpha(a, t);
                const ab = starAlpha(b, t);
                const vis = Math.min(aa, ab);

                const x = a.x + (b.x - a.x) * headF;
                const y = a.y + (b.y - a.y) * headF;

                const alpha = CFG.lineAlpha * 1.1 * vis;
                ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
                ctx.lineWidth = CFG.lineWidth;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(x, y);
                ctx.stroke();
            }
        }
    }

    // ---------- LOOP ----------
    let last = now();
    function step(){
        const t = now();
        const dt = t - last;
        last = t;
        S.t += dt;

        // keep enough stars
        const target = starTarget();
        while (S.stars.length < target) spawnStar();

        // cull dead stars
        S.stars = S.stars.filter(s => (t - s.born) < s.life);

        // drift + wrap
        for (const s of S.stars){
            s.x += s.driftX * dt * 0.05;
            s.y += s.driftY * dt * 0.05;

            if (s.x < -10) s.x = S.w + 10;
            if (s.x > S.w + 10) s.x = -10;
            if (s.y < -10) s.y = S.h + 10;
            if (s.y > S.h + 10) s.y = -10;
        }

        // rebuild snake path sometimes (gives “new connections” priority)
        if (t >= S.snake.nextRewireAt || S.snake.path.length < 2){
            buildSnake();
        }
    }

    function draw(){
        const t = now();
        ctx.clearRect(0, 0, S.w, S.h);

        // draw snake lines first (so stars sit on top)
        drawSnake(t);

        // draw stars
        for (const s of S.stars){
            const a = starAlpha(s, t);
            if (a <= 0) continue;

            // soft glow
            ctx.globalAlpha = a * 0.95;
            const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 18);
            g.addColorStop(0, "rgba(255,255,255,0.16)");
            g.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(s.x, s.y, 18, 0, Math.PI * 2);
            ctx.fill();

            // core
            ctx.globalAlpha = a;
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalAlpha = 1;
    }

    function loop(){
        step();
        draw();
        requestAnimationFrame(loop);
    }

    window.addEventListener("resize", resize);
    resize();
    loop();
});
