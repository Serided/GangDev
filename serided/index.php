<?php require_once '/var/www/gangdev/shared/php/init.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GangDev</title>
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <style>
        :root {
            color-scheme: dark;
            --bg-1: #09090f;
            --bg-2: #120f1d;
            --glow: rgba(124, 58, 237, 0.35);
            --glow-2: rgba(167, 139, 250, 0.22);
            --card: rgba(18, 18, 28, 0.7);
            --border: rgba(167, 139, 250, 0.22);
        }

        * { box-sizing: border-box; }

        body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            overflow: hidden;
            background:
                radial-gradient(circle at 50% 42%, var(--glow) 0%, transparent 28%),
                radial-gradient(circle at 50% 58%, var(--glow-2) 0%, transparent 36%),
                linear-gradient(180deg, var(--bg-2) 0%, var(--bg-1) 100%);
            font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .shell {
            width: min(92vw, 920px);
            min-height: min(72vh, 720px);
            display: grid;
            place-items: center;
            border: 1px solid var(--border);
            border-radius: 32px;
            background: linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015));
            box-shadow: 0 24px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
            padding: 48px 24px;
        }

        .mark {
            width: min(44vw, 340px);
            max-width: 340px;
            min-width: 180px;
            aspect-ratio: 1 / 1;
            object-fit: contain;
            filter: drop-shadow(0 0 42px rgba(124, 58, 237, 0.28));
            user-select: none;
            -webkit-user-drag: none;
        }

        @media (max-width: 640px) {
            .shell {
                width: min(94vw, 920px);
                min-height: min(62vh, 720px);
                border-radius: 24px;
                padding: 32px 18px;
            }

            .mark {
                width: min(58vw, 260px);
            }
        }
    </style>
</head>
<body>
    <main class="shell" aria-label="GangDev landing page">
        <img class="mark" src="/serided_icon.png" alt="GangDev icon">
    </main>
</body>
</html>
