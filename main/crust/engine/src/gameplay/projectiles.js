import { getPlayerCenter, getPlayerHitbox, getPlayerHalfSize } from "../tools.js";

const PROJECTILE_SPEED = 600;
const PROJECTILE_LIFETIME = 1500;
const PROJECTILE_DAMAGE = 25;

let nextProjectileId = 1;

export function spawnProjectile(gameState, attacker, dirX, dirY, now) {
    const mapData = gameState.mapData;
    if (!attacker || !mapData) return;

    const center = getPlayerCenter(attacker, mapData);

    const len = Math.hypot(dirX, dirY) || 1;
    const nx = dirX / len;
    const ny = dirY / len;

    gameState.projectiles.push({
        id: nextProjectileId++,
        ownerId: attacker.userId,
        x: center.x,
        y: center.y,
        vx: nx * PROJECTILE_SPEED,
        vy: ny * PROJECTILE_SPEED,
        createdAt: now
    });
}

export function updateProjectiles(gameState, dtSeconds, now) {
    const projectiles = gameState.projectiles;
    const players = gameState.players;
    const mapData = gameState.mapData;
    if (!projectiles || !mapData) return;

    const toRemove = new Set();

    for (const proj of projectiles) {
        proj.x += proj.vx * dtSeconds;
        proj.y += proj.vy * dtSeconds;

        if (now - proj.createdAt > PROJECTILE_LIFETIME) {
            toRemove.add(proj.id);
            continue;
        }

        for (const uid in players) {
            const p = players[uid];
            if (!p || p.userId === proj.ownerId) continue;

            const hb = getPlayerHitbox(p, mapData);

            if (
                proj.x >= hb.x &&
                proj.x <= hb.x + hb.w &&
                proj.y >= hb.y &&
                proj.y <= hb.y + hb.h
            ) {
                p.hp -= PROJECTILE_DAMAGE;

                if (p.hp <= 0) {
                    p.hp = p.maxHp ?? 100;
                    const half = getPlayerHalfSize(mapData);
                    p.x = 0 - half;
                    p.y = 0 - half;
                }

                toRemove.add(proj.id);
                break;
            }
        }
    }

    if (toRemove.size > 0) {
        gameState.projectiles = projectiles.filter(p => !toRemove.has(p.id));
    }
}