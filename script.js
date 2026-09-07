// ============================================================
//  CONFIGURACIÓN Y CONSTANTES
// ============================================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    const container = document.getElementById('gameContainer');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const W = () => canvas.width;
const H = () => canvas.height;

// Elementos UI
const ui = document.getElementById('ui');
const enemyKillsSpan = document.getElementById('enemyKills');
const allyKillsSpan = document.getElementById('allyKills');
const timerSpan = document.getElementById('timerDisplay');
const timerContainer = document.getElementById('timerContainer');
const unitsSpan = document.getElementById('unitsDisplay');
const fieldUnitsSpan = document.getElementById('fieldUnits');
const levelIntro = document.getElementById('levelIntro');

// Menús
const mainMenu = document.getElementById('mainMenu');
const instructionsScreen = document.getElementById('instructionsScreen');
const scoresScreen = document.getElementById('scoresScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const victoryScreen = document.getElementById('victoryScreen');
const surrenderConfirm = document.getElementById('surrenderConfirm');
const scoreList = document.getElementById('scoreList');
const finalScoreSpan = document.getElementById('finalScore');
const victoryScoreSpan = document.getElementById('victoryScore');

// ============================================================
//  SISTEMA DE TRADUCCIONES
// ============================================================
const translations = {
    title: { es: '🔱 MARISCAL MAGNO 🔱', en: '🔱 GREAT MARSHAL 🔱' },
    subtitle: { es: '¡5 niveles de acción!', en: '5 action levels!' },
    playBtn: { es: '▶ JUGAR', en: '▶ PLAY' },
    instructionsBtn: { es: '📖 INSTRUCCIONES', en: '📖 INSTRUCTIONS' },
    scoresBtn: { es: '🏆 HISTORIAL', en: '🏆 SCORES' },
    controls: {
        es: 'Flechas mover | J ataque | K escudo | L disparo | 1-4 unidades (grupos) | 5 rendirse | P pausa',
        en: 'Arrows move | J attack | K shield | L shoot | 1-4 units (groups) | 5 surrender | P pause'
    },
    instructionsTitle: { es: '📖 INSTRUCCIONES', en: '📖 INSTRUCTIONS' },
    instructionsText: {
        es: `<p><strong>Mariscal:</strong> Flechas mover, J ataque (espada), K escudo, L disparo (proyectil).</p>
             <p><strong>Reclutar grupos:</strong> 1 → 10 Guerreros, 2 → 5 Arqueros, 3 → 5 Magas, 4 → 5 Jinetes.</p>
             <p><strong>Niveles:</strong> N1: Aniquilar enemigos. N2: Más bajas en 2 min (oleadas rápidas). N3: Defender base 2 min (máx 40 aliados, 80 enemigos). N4: Infiltrar soldado en base enemiga (máx 80 aliados, 40 enemigos, oleadas rápidas, muro infranqueable, defensores no pasan de la mitad). N5: Derrotar al JEFE (100.000 PS, dispara bolas de fuego, máx 20 aliados).</p>
             <p><strong>Puntuación:</strong> bajas_enemigas - bajas_propias. ¡Historial guardado!</p>
             <p><strong>Teclas:</strong> 5 rendirse (confirmar), P pausar.</p>`,
        en: `<p><strong>Marshal:</strong> Arrows move, J attack (sword), K shield, L shoot (projectile).</p>
             <p><strong>Recruit groups:</strong> 1 → 10 Warriors, 2 → 5 Archers, 3 → 5 Mages, 4 → 5 Riders.</p>
             <p><strong>Levels:</strong> L1: Annihilate enemies. L2: More kills in 2 min (fast waves). L3: Defend base 2 min (max 40 allies, 80 enemies). L4: Infiltrate soldier into enemy base (max 80 allies, 40 enemies, fast waves, impassable wall, defenders stay on their half). L5: Defeat the BOSS (100,000 HP, fires fireballs, max 20 allies).</p>
             <p><strong>Score:</strong> enemy_kills - ally_kills. History saved!</p>
             <p><strong>Keys:</strong> 5 surrender (confirm), P pause.</p>`
    },
    backFromInstructions: { es: '⬅ VOLVER', en: '⬅ BACK' },
    scoresTitle: { es: '🏆 HISTORIAL', en: '🏆 SCORES' },
    noScores: { es: 'No hay puntuaciones', en: 'No scores' },
    clearScoresBtn: { es: '🗑️ BORRAR HISTORIAL', en: '🗑️ CLEAR SCORES' },
    backFromScoresBtn: { es: '⬅ VOLVER', en: '⬅ BACK' },
    gameOverTitle: { es: '💀 DERROTA', en: '💀 DEFEAT' },
    finalScoreLabel: { es: 'Puntuación final:', en: 'Final score:' },
    restartBtn: { es: '🔄 REINICIAR', en: '🔄 RESTART' },
    menuBtn: { es: '🏠 MENÚ', en: '🏠 MENU' },
    victoryTitle: { es: '🏆 ¡VICTORIA!', en: '🏆 VICTORY!' },
    victoryScoreLabel: { es: 'Puntuación final:', en: 'Final score:' },
    winRestartBtn: { es: '🔄 JUGAR DE NUEVO', en: '🔄 PLAY AGAIN' },
    winMenuBtn: { es: '🏠 MENÚ', en: '🏠 MENU' },
    surrenderTitle: { es: '⚠️ ¿RENDIRSE?', en: '⚠️ SURRENDER?' },
    surrenderText: { es: 'Perderás la partida actual. ¿Estás seguro?', en: 'You will lose the current game. Are you sure?' },
    surrenderYes: { es: '✅ SÍ', en: '✅ YES' },
    surrenderNo: { es: '❌ NO', en: '❌ NO' },
    pauseMsg: { es: '⏸️ PAUSA', en: '⏸️ PAUSE' },
    levelMessages: {
        1: { es: '🗡️ Destruye al enemigo', en: '🗡️ Destroy the enemy' },
        2: { es: '🛡️ Evita las bajas', en: '🛡️ Avoid casualties' },
        3: { es: '🏰 Defiende tus posiciones', en: '🏰 Defend your positions' },
        4: { es: '⚔️ ¡Al ataque!', en: '⚔️ Attack!' },
        5: { es: '👹 Batalla de jefe', en: '👹 Boss battle' }
    }
};

let currentLang = 'es';

// ============================================================
//  SISTEMA DE SONIDOS
// ============================================================
class SoundManager {
    constructor() {
        this.sounds = {};
        this.music = null;
        this.musicPlaying = false;
        this.enabled = true;
        this.activeSounds = [];
    }
    loadSound(name, url) {
        return new Promise((resolve) => {
            try {
                const audio = new Audio(url);
                audio.preload = 'auto';
                audio.oncanplaythrough = () => { this.sounds[name] = audio; resolve(); };
                audio.onerror = () => { this.sounds[name] = new Audio(); resolve(); };
                audio.load();
                setTimeout(() => {
                    if (!this.sounds[name]) { this.sounds[name] = new Audio(); resolve(); }
                }, 2000);
            } catch (e) { this.sounds[name] = new Audio(); resolve(); }
        });
    }
    loadMusic(url) {
        return new Promise((resolve) => {
            try {
                this.music = new Audio(url);
                this.music.loop = true;
                this.music.volume = 0.3;
                this.music.oncanplaythrough = () => resolve();
                this.music.onerror = () => { this.music = null; resolve(); };
                this.music.load();
                setTimeout(() => resolve(), 2000);
            } catch (e) { this.music = null; resolve(); }
        });
    }
    play(name) {
        if (!this.enabled) return;
        if (this.sounds[name]) {
            try {
                const clone = this.sounds[name].cloneNode();
                clone.volume = 0.5;
                this.activeSounds.push(clone);
                clone.play().catch(() => {});
                clone.addEventListener('ended', () => {
                    const idx = this.activeSounds.indexOf(clone);
                    if (idx !== -1) this.activeSounds.splice(idx, 1);
                });
                clone.addEventListener('pause', () => {
                    const idx = this.activeSounds.indexOf(clone);
                    if (idx !== -1) this.activeSounds.splice(idx, 1);
                });
            } catch (e) {}
        }
    }
    stopAllSounds() {
        for (let s of this.activeSounds) {
            try { s.pause(); s.currentTime = 0; } catch (e) {}
        }
        this.activeSounds = [];
    }
    playMusic() {
        if (!this.enabled || !this.music) return;
        if (!this.musicPlaying) {
            this.music.play().catch(() => {});
            this.musicPlaying = true;
        }
    }
    stopMusic() {
        if (this.music) {
            this.music.pause();
            this.music.currentTime = 0;
            this.musicPlaying = false;
        }
    }
    stopAll() {
        this.stopAllSounds();
        this.stopMusic();
    }
    async loadAll() {
        const files = {
            'button': 'audio/button.m4a',
            'attack': 'audio/attack.m4a',
            'health': 'audio/health.m4a',
            'arrow': 'audio/fired.m4a',
            'fire': 'audio/fire.m4a',
            'canon': 'audio/canon.m4a',
            'teleport': 'audio/teleport.m4a',
            'victory': 'audio/victory.m4a',
            'defeat': 'audio/defeat.m4a'
        };
        for (const [name, url] of Object.entries(files)) {
            await this.loadSound(name, url);
        }
        await this.loadMusic('audio/music.m4a');
        console.log('✅ Sonidos cargados');
    }
}
const sound = new SoundManager();

// ============================================================
//  SISTEMA DE IMÁGENES
// ============================================================
const images = {};
function loadImages() {
    const list = {
        'mariscal': 'images/mariscal.png',
        'mariscal_attack': 'images/mariscal.png',
        'mariscal_shield': 'images/mariscal.png',
        'mariscal_shot': 'images/mariscal.png',
        'guerrero': 'images/guerrero.png',
        'guerrero_attack': 'images/guerrero.png',
        'guerrero_shield': 'images/guerrero.png',
        'arquero': 'images/arquero.png',
        'arquero_arrow': 'images/arquero.png',
        'arquero_attack': 'images/arquero.png',
        'arquero_shield': 'images/arquero.png',
        'maga': 'images/maga.png',
        'maga_attack': 'images/maga.png',
        'maga_launch': 'images/maga.png',
        'maga_health': 'images/maga.png',
        'maga_teleporter': 'images/maga.png',
        'jinete': 'images/jinete.png',
        'jinete_attack': 'images/jinete.png',
        'jinete_shield': 'images/jinete.png',
        'cañon': 'images/canon.png',
        'esqueleto': 'images/esqueleto.png',
        'esqueleto_attack': 'images/esqueleto.png',
        'esqueleto_shield': 'images/esqueleto.png',
        'esqueleto_arquero': 'images/esqueleto.png',
        'esqueleto_arquero_attack': 'images/esqueleto_arquero.png',
        'esqueleto_arquero_shield': 'images/esqueleto_arquero.png',
        'esqueleto_arquero_arrow': 'images/esqueleto_arquero.png',
        'guerrero_oscuridad': 'images/guerrero_oscuridad.png',
        'guerrero_oscuridad_attack': 'images/guerrero_oscuridad.png',
        'guerrero_oscuridad_shield': 'images/guerrero_oscuridad.png',
        'hechicera': 'images/hechicera.png',
        'hechicera_attack': 'images/hechicera.png',
        'hechicera_launch': 'images/hechicera.png',
        'hechicera_health': 'images/hechicera.png',
        'hechicera_teleporter': 'images/hechicera.png',
        'jefe': 'images/jefe.png',
        'jefe_attack': 'images/jefe.png',
        'jefe_shield': 'images/jefe.png'
    };
    return new Promise((resolve) => {
        let loaded = 0;
        const total = Object.keys(list).length;
        for (const [key, src] of Object.entries(list)) {
            const img = new Image();
            img.onload = () => { loaded++; images[key] = img; if (loaded === total) resolve(); };
            img.onerror = () => { loaded++; images[key] = null; if (loaded === total) resolve(); };
            img.src = src;
        }
        setTimeout(resolve, 3000);
    });
}

// ============================================================
//  FUNCIONES DE TRADUCCIÓN
// ============================================================
function setLanguage(lang) {
    if (lang !== 'es' && lang !== 'en') lang = 'es';
    currentLang = lang;
    localStorage.setItem('gameLang', lang);
    document.querySelectorAll('.lang-flag').forEach(el => {
        el.classList.toggle('active', el.dataset.lang === lang);
    });
    updateUIStrings();
}
function updateUIStrings() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (translations[key] && translations[key][currentLang] !== undefined) {
            if (el.tagName === 'DIV' && key === 'instructionsText') {
                el.innerHTML = translations[key][currentLang];
            } else {
                el.textContent = translations[key][currentLang];
            }
        }
    });
    if (levelIntroActive && currentLevel) {
        const msg = translations.levelMessages[currentLevel];
        if (msg) levelIntro.textContent = msg[currentLang];
    }
    if (!scoresScreen.classList.contains('hidden')) {
        loadScores();
    }
}

// ============================================================
//  UTILIDADES
// ============================================================
function distancia(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function random(min, max) { return Math.random() * (max - min) + min; }

// ============================================================
//  CLASE PROYECTIL
// ============================================================
class Projectile {
    constructor(x, y, target, tipo, damage, owner, speed = 5, color = null) {
        this.x = x; this.y = y; this.target = target; this.tipo = tipo;
        this.damage = damage; this.owner = owner; this.speed = speed;
        this.active = true;
        this.radius = tipo === 'fire' ? 16 : 8;
        const dx = target.x + target.w/2 - x;
        const dy = target.y + target.h/2 - y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0) { this.vx = (dx / dist) * speed; this.vy = (dy / dist) * speed; }
        else { this.vx = 0; this.vy = -speed; }
        this.angle = Math.atan2(this.vy, this.vx);
        this.trail = [];
        this.customColor = color || null;
    }
    update(entities) {
        if (!this.active) return;
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > 15) this.trail.shift();
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -50 || this.x > W() + 50 || this.y < -50 || this.y > H() + 50) {
            this.active = false; return;
        }
        if (currentLevel === 4) {
            for (let wall of walls) {
                if (this.x > wall.x && this.x < wall.x + wall.w && this.y > wall.y && this.y < wall.y + wall.h) {
                    this.active = false; return;
                }
            }
        }
        for (let e of entities) {
            if (!e.isAlive()) continue;
            const isTarget = (this.owner === 'ally' && (e.type === 'esqueleto' || e.type === 'esqueleto_arquero' || e.type === 'guerrero_oscuridad' || e.type === 'hechicera' || e.type === 'jefe' || e.type === 'cañon_enemigo')) ||
                             (this.owner === 'enemy' && (e.type === 'marshal' || e.type === 'guerrero' || e.type === 'arquero' || e.type === 'maga' || e.type === 'jinete' || e.type === 'cañon_amigo'));
            if (!isTarget) continue;
            if (distancia(this, {x: e.x + e.w/2, y: e.y + e.h/2}) < this.radius + Math.max(e.w, e.h)/2) {
                e.takeDamage(this.damage);
                this.active = false;
                break;
            }
        }
    }
    draw(ctx) {
        if (!this.active) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        if (this.tipo === 'arrow') {
            const len = 24, headLen = 8, headWidth = 6;
            ctx.fillStyle = '#8B4513';
            ctx.strokeStyle = '#4a2c0a';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-len/2, 0);
            ctx.lineTo(len/2 - headLen, 0);
            ctx.stroke();
            ctx.fillStyle = '#D2B48C';
            ctx.beginPath();
            ctx.moveTo(len/2, 0);
            ctx.lineTo(len/2 - headLen, -headWidth/2);
            ctx.lineTo(len/2 - headLen, headWidth/2);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#F5DEB3';
            ctx.beginPath();
            ctx.moveTo(-len/2, 0);
            ctx.lineTo(-len/2 + 6, -5);
            ctx.lineTo(-len/2 + 12, 0);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(-len/2, 0);
            ctx.lineTo(-len/2 + 6, 5);
            ctx.lineTo(-len/2 + 12, 0);
            ctx.closePath();
            ctx.fill();
        } else if (this.tipo === 'fire') {
            const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
            if (this.customColor) {
                grad.addColorStop(0, '#FFFFFF');
                grad.addColorStop(0.1, '#FF6666');
                grad.addColorStop(0.4, '#FF2200');
                grad.addColorStop(0.8, '#CC0000');
                grad.addColorStop(1, '#660000');
            } else {
                grad.addColorStop(0, '#FFFFFF');
                grad.addColorStop(0.2, '#FFFF00');
                grad.addColorStop(0.5, '#FFA500');
                grad.addColorStop(0.8, '#FF4500');
                grad.addColorStop(1, '#8B0000');
            }
            ctx.shadowBlur = 30;
            ctx.shadowColor = this.customColor ? '#FF2200' : '#FF4500';
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            for (let i = 0; i < 7; i++) {
                const angle = this.angle + i * 0.9 + Math.sin(Date.now() * 0.01 + i) * 0.3;
                const r = this.radius + 4 + Math.sin(Date.now() * 0.02 + i * 2) * 3;
                const x = Math.cos(angle) * r;
                const y = Math.sin(angle) * r;
                const size = 6 + Math.sin(Date.now() * 0.03 + i) * 2;
                ctx.fillStyle = this.customColor ?
                    `rgba(255, 50, 0, ${0.5 + 0.3 * Math.sin(Date.now() * 0.02 + i)})` :
                    `rgba(255, 69, 0, ${0.6 + 0.4 * Math.sin(Date.now() * 0.02 + i)})`;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x - size/2, y - size);
                ctx.lineTo(x + size/2, y - size);
                ctx.closePath();
                ctx.fill();
            }
            ctx.shadowBlur = 0;
        }
        ctx.restore();
    }
}

// ============================================================
//  CLASE PROYECTIL DE CAÑÓN
// ============================================================
class CanonBall {
    constructor(x, y, direction, isEnemy = false) {
        this.x = x; this.y = y; this.radius = 10;
        this.speed = 6 * direction; this.direction = direction;
        this.active = true; this.damage = 50;
        this.trail = []; this.isEnemy = isEnemy;
    }
    update(entities) {
        if (!this.active) return;
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > 10) this.trail.shift();
        this.x += this.speed;
        if (this.x < -50 || this.x > W() + 50) { this.active = false; return; }
        if (currentLevel === 4) {
            for (let wall of walls) {
                if (this.x > wall.x && this.x < wall.x + wall.w && this.y > wall.y && this.y < wall.y + wall.h) {
                    this.active = false; return;
                }
            }
        }
        for (let e of entities) {
            if (!e.isAlive()) continue;
            const isTarget = (this.isEnemy && (e.type === 'marshal' || e.type === 'guerrero' || e.type === 'arquero' || e.type === 'maga' || e.type === 'jinete')) ||
                             (!this.isEnemy && (e.type === 'esqueleto' || e.type === 'esqueleto_arquero' || e.type === 'guerrero_oscuridad' || e.type === 'hechicera' || e.type === 'jefe'));
            if (!isTarget) continue;
            const dist = distancia(this, {x: e.x + e.w/2, y: e.y + e.h/2});
            if (dist < this.radius + Math.max(e.w, e.h)/2) {
                e.takeDamage(this.damage);
                this.active = false;
                break;
            }
        }
    }
    draw(ctx) {
        if (!this.active) return;
        for (let i = 0; i < this.trail.length; i++) {
            const alpha = i / this.trail.length * 0.6;
            ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
            const r = this.radius * (0.3 + 0.7 * (i / this.trail.length));
            ctx.beginPath();
            ctx.arc(this.trail[i].x, this.trail[i].y, r, 0, Math.PI*2);
            ctx.fill();
        }
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#000';
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.beginPath();
        ctx.arc(this.x - 3, this.y - 4, 4, 0, Math.PI*2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// ============================================================
//  CLASE BASE ENTIDAD
// ============================================================
class Entity {
    constructor(x, y, type, maxHP, speed) {
        this.x = x; this.y = y; this.type = type;
        this.maxHP = maxHP; this.hp = maxHP;
        this.speed = speed;
        this.vx = 0; this.vy = 0;
        this.direction = 1;
        this.active = true;
        this.attackCooldown = 0;
        this.shieldActive = false;
        this.state = 'idle';
        this.attackDamage = 0;
        this.shieldTimer = 0;
        this.range = 40;
        this.attackInterval = 30;
        this.attackAnim = 0;
        this.shootAnim = 0;
        this.w = 30; this.h = 40;
        this.target = null;
        this.rangeMin = 0; this.rangeMax = 0;
        this.projectileSpeed = 5;
        this.projectileDamage = 0;
        this.projectileType = 'arrow';
        this.rushMode = false;
        this.goalX = null;
        this.isEnemy = false;
    }
    takeDamage(dmg) {
        if (this.shieldActive) dmg = Math.floor(dmg * 0.3);
        this.hp -= dmg;
        if (this.hp <= 0) { this.hp = 0; this.active = false; }
    }
    isAlive() { return this.active && this.hp > 0; }
    checkWallCollision() {
        if (currentLevel !== 4) return;
        for (let wall of walls) {
            if (this.x < wall.x + wall.w && this.x + this.w > wall.x &&
                this.y < wall.y + wall.h && this.y + this.h > wall.y) {
                const overlapX = Math.min(this.x + this.w - wall.x, wall.x + wall.w - this.x);
                const overlapY = Math.min(this.y + this.h - wall.y, wall.y + wall.h - this.y);
                if (overlapX < overlapY) {
                    if (this.x < wall.x) this.x = wall.x - this.w;
                    else this.x = wall.x + wall.w;
                } else {
                    if (this.y < wall.y) this.y = wall.y - this.h;
                    else this.y = wall.y + wall.h;
                }
            }
        }
    }
    move() {
        this.x += this.vx; this.y += this.vy;
        const groundY = H() * 0.3;
        this.y = clamp(this.y, groundY, H() - 20);
        this.x = clamp(this.x, 0, W());
        if (this.vx > 0) this.direction = 1;
        else if (this.vx < 0) this.direction = -1;
        this.checkWallCollision();
    }
    update() {
        if (this.attackCooldown > 0) this.attackCooldown--;
        if (this.shieldTimer > 0) { this.shieldTimer--; this.shieldActive = true; } else { this.shieldActive = false; }
        if (this.attackAnim > 0) this.attackAnim--;
        if (this.shootAnim > 0) this.shootAnim--;
        this.move();
    }
    draw(ctx, images) {}
}

// ============================================================
//  UNIDADES ALIADAS
// ============================================================
class Guerrero extends Entity {
    constructor(x, y, goalX = null) {
        super(x, y, 'guerrero', 150, 1);
        this.attackDamage = 20;
        this.range = 35;
        this.attackInterval = 25;
        this.w = 30; this.h = 40;
        this.goalX = goalX;
    }
    draw(ctx, images) {
        if (!this.isAlive()) return;
        let img = this.shieldActive ? images.guerrero_shield : (this.attackAnim > 0 ? images.guerrero_attack : images.guerrero);
        if (img && img.complete && img.naturalWidth > 0) {
            ctx.save();
            if (this.direction === -1) { ctx.translate(this.x + this.w, this.y); ctx.scale(-1,1); } else ctx.translate(this.x, this.y);
            ctx.drawImage(img, 0, 0, this.w, this.h);
            ctx.restore();
        } else {
            ctx.fillStyle = '#4CAF50'; ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = '#fff'; ctx.font = '10px Arial'; ctx.fillText('G', this.x+8, this.y+20);
        }
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(this.x, this.y-8, this.w, 5);
        ctx.fillStyle = '#2ecc71'; ctx.fillRect(this.x+2, this.y-6, (this.w-4)*(this.hp/this.maxHP), 3);
    }
    update(aliados, enemigos, cañones) {
        super.update();
        if (this.goalX !== null) {
            let blockingCanon = null;
            let minDist = Infinity;
            for (let c of cañones) {
                if (!c.active || !c.isEnemy) continue;
                if (Math.abs(c.y - this.y) < 20 && c.x > this.x && c.x < this.goalX) {
                    const d = c.x - this.x;
                    if (d < minDist) { minDist = d; blockingCanon = c; }
                }
            }
            if (blockingCanon) {
                const dx = blockingCanon.x - this.x;
                const dy = blockingCanon.y - this.y;
                const dist = Math.hypot(dx, dy);
                if (dist > this.range) {
                    this.vx = (dx/dist)*this.speed;
                    this.vy = (dy/dist)*this.speed;
                } else {
                    this.vx = 0; this.vy = 0;
                    if (this.attackCooldown <= 0) {
                        blockingCanon.hp -= this.attackDamage;
                        if (blockingCanon.hp <= 0) blockingCanon.active = false;
                        this.attackCooldown = this.attackInterval;
                        this.attackAnim = 10;
                        sound.play('attack');
                    }
                }
                return;
            }
            let target = null;
            let minEnemyDist = Infinity;
            for (let e of enemigos) {
                if (!e.isAlive()) continue;
                if (Math.abs(e.y - this.y) < 30 && e.x > this.x && e.x < this.goalX) {
                    const d = distancia(this, e);
                    if (d < minEnemyDist && d < 200) {
                        minEnemyDist = d;
                        target = e;
                    }
                }
            }
            if (target) {
                const dx = target.x - this.x;
                const dy = target.y - this.y;
                const dist = Math.hypot(dx, dy);
                if (dist > this.range) {
                    this.vx = (dx/dist)*this.speed;
                    this.vy = (dy/dist)*this.speed;
                } else {
                    this.vx = 0; this.vy = 0;
                    if (this.attackCooldown <= 0) {
                        target.takeDamage(this.attackDamage);
                        this.attackCooldown = this.attackInterval;
                        this.attackAnim = 10;
                        sound.play('attack');
                    }
                }
            } else {
                const dx = this.goalX - this.x;
                const dist = Math.abs(dx);
                if (dist > 5) {
                    this.vx = (dx/dist) * this.speed;
                    this.vy = 0;
                } else {
                    this.vx *= 0.9;
                    this.vy = 0;
                }
                this.direction = 1;
            }
        } else {
            let closest = null, minDist = Infinity;
            for (let e of enemigos) { if (!e.isAlive()) continue; const d = distancia(this, e); if (d < minDist) { minDist = d; closest = e; } }
            if (closest) {
                const dx = closest.x - this.x, dy = closest.y - this.y, dist = Math.hypot(dx, dy);
                if (dist > this.range) { this.vx = (dx/dist)*this.speed; this.vy = (dy/dist)*this.speed; }
                else { this.vx = 0; this.vy = 0; if (this.attackCooldown <= 0) { closest.takeDamage(this.attackDamage); this.attackCooldown = this.attackInterval; this.attackAnim = 10; sound.play('attack'); } }
            } else { this.vx *= 0.9; this.vy *= 0.9; }
        }
    }
}

class Arquero extends Entity {
    constructor(x, y, goalX = null) {
        super(x, y, 'arquero', 100, 1.5);
        this.attackDamage = 20;
        this.rangeMin = 100;
        this.rangeMax = 250;
        this.attackInterval = 40;
        this.w = 30; this.h = 40;
        this.projectileSpeed = 6;
        this.projectileDamage = 20;
        this.projectileType = 'arrow';
        this.shooting = false;
        this.goalX = goalX;
    }
    draw(ctx, images) {
        if (!this.isAlive()) return;
        let img = images.arquero;
        if (this.shieldActive) img = images.arquero_shield;
        else if (this.shooting) img = images.arquero_arrow;
        else if (this.attackAnim > 0) img = images.arquero_attack;
        if (img && img.complete && img.naturalWidth > 0) {
            ctx.save();
            if (this.direction === -1) { ctx.translate(this.x + this.w, this.y); ctx.scale(-1,1); } else ctx.translate(this.x, this.y);
            ctx.drawImage(img, 0, 0, this.w, this.h);
            ctx.restore();
        } else {
            ctx.fillStyle = '#2196F3'; ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = '#fff'; ctx.font = '10px Arial'; ctx.fillText('A', this.x+8, this.y+20);
        }
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(this.x, this.y-8, this.w, 5);
        ctx.fillStyle = '#2ecc71'; ctx.fillRect(this.x+2, this.y-6, (this.w-4)*(this.hp/this.maxHP), 3);
        this.shooting = false;
    }
    update(aliados, enemigos, proyectiles, cañones) {
        super.update();
        if (this.goalX !== null) {
            let blockingCanon = null;
            let minDist = Infinity;
            for (let c of cañones) {
                if (!c.active || !c.isEnemy) continue;
                if (Math.abs(c.y - this.y) < 20 && c.x > this.x && c.x < this.goalX) {
                    const d = c.x - this.x;
                    if (d < minDist) { minDist = d; blockingCanon = c; }
                }
            }
            if (blockingCanon && minDist < this.rangeMax) {
                if (this.attackCooldown <= 0) {
                    const p = new Projectile(this.x + this.w/2, this.y + this.h/2, blockingCanon, this.projectileType, this.projectileDamage, 'ally', this.projectileSpeed);
                    proyectiles.push(p);
                    this.attackCooldown = this.attackInterval;
                    this.shooting = true;
                    sound.play('arrow');
                }
                this.vx = 0; this.vy = 0;
                return;
            }
            let target = null;
            let minEnemyDist = Infinity;
            for (let e of enemigos) {
                if (!e.isAlive()) continue;
                if (Math.abs(e.y - this.y) < 30 && e.x > this.x && e.x < this.goalX) {
                    const d = distancia(this, e);
                    if (d < minEnemyDist && d < this.rangeMax) {
                        minEnemyDist = d;
                        target = e;
                    }
                }
            }
            if (target) {
                const dx = target.x - this.x;
                const dy = target.y - this.y;
                const dist = Math.hypot(dx, dy);
                if (dist > this.rangeMax) {
                    this.vx = (dx/dist)*this.speed;
                    this.vy = (dy/dist)*this.speed;
                } else if (dist < this.rangeMin) {
                    this.vx = -(dx/dist)*this.speed;
                    this.vy = -(dy/dist)*this.speed;
                } else {
                    this.vx = 0; this.vy = 0;
                    if (this.attackCooldown <= 0) {
                        const p = new Projectile(this.x + this.w/2, this.y + this.h/2, target, this.projectileType, this.projectileDamage, 'ally', this.projectileSpeed);
                        proyectiles.push(p);
                        this.attackCooldown = this.attackInterval;
                        this.shooting = true;
                        sound.play('arrow');
                    }
                }
            } else {
                const dx = this.goalX - this.x;
                const dist = Math.abs(dx);
                if (dist > 5) {
                    this.vx = (dx/dist) * this.speed;
                    this.vy = 0;
                } else {
                    this.vx *= 0.9;
                    this.vy = 0;
                }
                this.direction = 1;
            }
        } else {
            let closest = null, minDist = Infinity;
            for (let e of enemigos) { if (!e.isAlive()) continue; const d = distancia(this, e); if (d < minDist) { minDist = d; closest = e; } }
            if (closest) {
                const dx = closest.x - this.x, dy = closest.y - this.y, dist = Math.hypot(dx, dy);
                if (dist > this.rangeMax) {
                    this.vx = (dx/dist)*this.speed;
                    this.vy = (dy/dist)*this.speed;
                } else if (dist < this.rangeMin) {
                    this.vx = -(dx/dist)*this.speed;
                    this.vy = -(dy/dist)*this.speed;
                } else {
                    this.vx = 0; this.vy = 0;
                    if (this.attackCooldown <= 0) {
                        const p = new Projectile(this.x + this.w/2, this.y + this.h/2, closest, this.projectileType, this.projectileDamage, 'ally', this.projectileSpeed);
                        proyectiles.push(p);
                        this.attackCooldown = this.attackInterval;
                        this.shooting = true;
                        sound.play('arrow');
                    }
                }
            } else { this.vx *= 0.9; this.vy *= 0.9; }
        }
    }
}

class Maga extends Entity {
    constructor(x, y, goalX = null) {
        super(x, y, 'maga', 100, 1.5);
        this.attackDamage = 35;
        this.rangeMin = 80;
        this.rangeMax = 200;
        this.attackInterval = 50;
        this.w = 30; this.h = 40;
        this.projectileSpeed = 5;
        this.projectileDamage = 35;
        this.projectileType = 'fire';
        this.launchAnim = 0;
        this.teleportCooldown = 0;
        this.goalX = goalX;
    }
    draw(ctx, images) {
        if (!this.isAlive()) return;
        let img = images.maga;
        if (this.launchAnim > 0) img = images.maga_launch;
        else if (this.attackAnim > 0) img = images.maga_attack;
        else if (this.teleportCooldown > 0) img = images.maga_teleporter;
        if (img && img.complete && img.naturalWidth > 0) {
            ctx.save();
            if (this.direction === -1) { ctx.translate(this.x + this.w, this.y); ctx.scale(-1,1); } else ctx.translate(this.x, this.y);
            ctx.drawImage(img, 0, 0, this.w, this.h);
            ctx.restore();
        } else {
            ctx.fillStyle = '#9C27B0'; ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = '#fff'; ctx.font = '10px Arial'; ctx.fillText('M', this.x+8, this.y+20);
        }
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(this.x, this.y-8, this.w, 5);
        ctx.fillStyle = '#2ecc71'; ctx.fillRect(this.x+2, this.y-6, (this.w-4)*(this.hp/this.maxHP), 3);
        if (this.launchAnim > 0) this.launchAnim--;
        if (this.teleportCooldown > 0) this.teleportCooldown--;
    }
    update(aliados, enemigos, proyectiles, cañones) {
        super.update();
        if (this.teleportCooldown <= 0 && Math.random() < 0.001) {
            this.x += random(-100,100); this.y += random(-50,50);
            this.x = clamp(this.x, 0, W()); this.y = clamp(this.y, H()*0.3, H()-20);
            this.teleportCooldown = 120;
            sound.play('teleport');
        }
        if (this.goalX !== null) {
            let blockingCanon = null;
            let minDist = Infinity;
            for (let c of cañones) {
                if (!c.active || !c.isEnemy) continue;
                if (Math.abs(c.y - this.y) < 20 && c.x > this.x && c.x < this.goalX) {
                    const d = c.x - this.x;
                    if (d < minDist) { minDist = d; blockingCanon = c; }
                }
            }
            if (blockingCanon && minDist < this.rangeMax) {
                if (this.attackCooldown <= 0) {
                    const p = new Projectile(this.x + this.w/2, this.y + this.h/2, blockingCanon, this.projectileType, this.projectileDamage, 'ally', this.projectileSpeed);
                    proyectiles.push(p);
                    this.attackCooldown = this.attackInterval;
                    this.launchAnim = 10;
                    sound.play('fire');
                }
                this.vx = 0; this.vy = 0;
                return;
            }
            let target = null;
            let minEnemyDist = Infinity;
            for (let e of enemigos) {
                if (!e.isAlive()) continue;
                if (Math.abs(e.y - this.y) < 30 && e.x > this.x && e.x < this.goalX) {
                    const d = distancia(this, e);
                    if (d < minEnemyDist && d < this.rangeMax) {
                        minEnemyDist = d;
                        target = e;
                    }
                }
            }
            if (target) {
                const dx = target.x - this.x;
                const dy = target.y - this.y;
                const dist = Math.hypot(dx, dy);
                if (dist > this.rangeMax) {
                    this.vx = (dx/dist)*this.speed;
                    this.vy = (dy/dist)*this.speed;
                } else if (dist < this.rangeMin) {
                    this.vx = -(dx/dist)*this.speed;
                    this.vy = -(dy/dist)*this.speed;
                } else {
                    this.vx = 0; this.vy = 0;
                    if (this.attackCooldown <= 0) {
                        const p = new Projectile(this.x + this.w/2, this.y + this.h/2, target, this.projectileType, this.projectileDamage, 'ally', this.projectileSpeed);
                        proyectiles.push(p);
                        this.attackCooldown = this.attackInterval;
                        this.launchAnim = 10;
                        sound.play('fire');
                    }
                }
            } else {
                const dx = this.goalX - this.x;
                const dist = Math.abs(dx);
                if (dist > 5) {
                    this.vx = (dx/dist) * this.speed;
                    this.vy = 0;
                } else {
                    this.vx *= 0.9;
                    this.vy = 0;
                }
                this.direction = 1;
            }
        } else {
            let closest = null, minDist = Infinity;
            for (let e of enemigos) { if (!e.isAlive()) continue; const d = distancia(this, e); if (d < minDist) { minDist = d; closest = e; } }
            if (closest) {
                const dx = closest.x - this.x, dy = closest.y - this.y, dist = Math.hypot(dx, dy);
                if (dist > this.rangeMax) {
                    this.vx = (dx/dist)*this.speed;
                    this.vy = (dy/dist)*this.speed;
                } else if (dist < this.rangeMin) {
                    this.vx = -(dx/dist)*this.speed;
                    this.vy = -(dy/dist)*this.speed;
                } else {
                    this.vx = 0; this.vy = 0;
                    if (this.attackCooldown <= 0) {
                        const p = new Projectile(this.x + this.w/2, this.y + this.h/2, closest, this.projectileType, this.projectileDamage, 'ally', this.projectileSpeed);
                        proyectiles.push(p);
                        this.attackCooldown = this.attackInterval;
                        this.launchAnim = 10;
                        sound.play('fire');
                    }
                }
            } else { this.vx *= 0.9; this.vy *= 0.9; }
        }
    }
}

class Jinete extends Entity {
    constructor(x, y, goalX = null) {
        super(x, y, 'jinete', 300, 1.2);
        this.attackDamage = 35;
        this.range = 40;
        this.attackInterval = 20;
        this.w = 35; this.h = 45;
        this.goalX = goalX;
    }
    draw(ctx, images) {
        if (!this.isAlive()) return;
        let img = this.shieldActive ? images.jinete_shield : (this.attackAnim > 0 ? images.jinete_attack : images.jinete);
        if (img && img.complete && img.naturalWidth > 0) {
            ctx.save();
            if (this.direction === -1) { ctx.translate(this.x + this.w, this.y); ctx.scale(-1,1); } else ctx.translate(this.x, this.y);
            ctx.drawImage(img, 0, 0, this.w, this.h);
            ctx.restore();
        } else {
            ctx.fillStyle = '#FF9800'; ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = '#fff'; ctx.font = '10px Arial'; ctx.fillText('J', this.x+8, this.y+20);
        }
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(this.x, this.y-8, this.w, 5);
        ctx.fillStyle = '#2ecc71'; ctx.fillRect(this.x+2, this.y-6, (this.w-4)*(this.hp/this.maxHP), 3);
    }
    update(aliados, enemigos, cañones) {
        super.update();
        if (this.goalX !== null) {
            let blockingCanon = null;
            let minDist = Infinity;
            for (let c of cañones) {
                if (!c.active || !c.isEnemy) continue;
                if (Math.abs(c.y - this.y) < 20 && c.x > this.x && c.x < this.goalX) {
                    const d = c.x - this.x;
                    if (d < minDist) { minDist = d; blockingCanon = c; }
                }
            }
            if (blockingCanon) {
                const dx = blockingCanon.x - this.x;
                const dy = blockingCanon.y - this.y;
                const dist = Math.hypot(dx, dy);
                if (dist > this.range) {
                    this.vx = (dx/dist)*this.speed;
                    this.vy = (dy/dist)*this.speed;
                } else {
                    this.vx = 0; this.vy = 0;
                    if (this.attackCooldown <= 0) {
                        blockingCanon.hp -= this.attackDamage;
                        if (blockingCanon.hp <= 0) blockingCanon.active = false;
                        this.attackCooldown = this.attackInterval;
                        this.attackAnim = 10;
                        sound.play('attack');
                    }
                }
                return;
            }
            let target = null;
            let minEnemyDist = Infinity;
            for (let e of enemigos) {
                if (!e.isAlive()) continue;
                if (Math.abs(e.y - this.y) < 30 && e.x > this.x && e.x < this.goalX) {
                    const d = distancia(this, e);
                    if (d < minEnemyDist && d < 200) {
                        minEnemyDist = d;
                        target = e;
                    }
                }
            }
            if (target) {
                const dx = target.x - this.x;
                const dy = target.y - this.y;
                const dist = Math.hypot(dx, dy);
                if (dist > this.range) {
                    this.vx = (dx/dist)*this.speed;
                    this.vy = (dy/dist)*this.speed;
                } else {
                    this.vx = 0; this.vy = 0;
                    if (this.attackCooldown <= 0) {
                        target.takeDamage(this.attackDamage);
                        this.attackCooldown = this.attackInterval;
                        this.attackAnim = 10;
                        sound.play('attack');
                    }
                }
            } else {
                const dx = this.goalX - this.x;
                const dist = Math.abs(dx);
                if (dist > 5) {
                    this.vx = (dx/dist) * this.speed;
                    this.vy = 0;
                } else {
                    this.vx *= 0.9;
                    this.vy = 0;
                }
                this.direction = 1;
            }
        } else {
            let closest = null, minDist = Infinity;
            for (let e of enemigos) { if (!e.isAlive()) continue; const d = distancia(this, e); if (d < minDist) { minDist = d; closest = e; } }
            if (closest) {
                const dx = closest.x - this.x, dy = closest.y - this.y, dist = Math.hypot(dx, dy);
                if (dist > this.range) { this.vx = (dx/dist)*this.speed; this.vy = (dy/dist)*this.speed; }
                else { this.vx = 0; this.vy = 0; if (this.attackCooldown <= 0) { closest.takeDamage(this.attackDamage); this.attackCooldown = this.attackInterval; this.attackAnim = 10; sound.play('attack'); } }
            } else { this.vx *= 0.9; this.vy *= 0.9; }
        }
    }
}

// ============================================================
//  MARISCAL
// ============================================================
class Marshal extends Entity {
    constructor(x, y) {
        super(x, y, 'marshal', 2000, 3);
        this.w = 35; this.h = 45;
        this.attackDamage = 30;
        this.shotDamage = 30;
        this.shootCooldown = 0;
        this.shootAnim = 0;
    }
    update(keys) {
        let dx = 0, dy = 0;
        if (keys['ArrowLeft']) dx = -1;
        if (keys['ArrowRight']) dx = 1;
        if (keys['ArrowUp']) dy = -1;
        if (keys['ArrowDown']) dy = 1;
        if (dx !== 0 || dy !== 0) {
            const len = Math.hypot(dx, dy);
            this.vx = (dx / len) * this.speed;
            this.vy = (dy / len) * this.speed;
            this.state = 'moving';
            if (dx > 0) this.direction = 1;
            else if (dx < 0) this.direction = -1;
        } else {
            this.vx *= 0.9;
            this.vy *= 0.9;
            if (Math.abs(this.vx) < 0.1) this.vx = 0;
            if (Math.abs(this.vy) < 0.1) this.vy = 0;
            this.state = 'idle';
        }
        if (currentLevel === 2) {
            this.x = clamp(this.x, 0, W() * 0.5 - this.w);
        } else if (currentLevel === 3 || currentLevel === 4) {
            this.x = clamp(this.x, 0, W() * 0.25 - this.w);
        }
        this.x += this.vx;
        this.y += this.vy;
        const groundY = H() * 0.3;
        this.y = clamp(this.y, groundY, H() - 20);
        this.x = clamp(this.x, 0, W());
        if (this.vx > 0) this.direction = 1;
        else if (this.vx < 0) this.direction = -1;
        this.checkWallCollision();
        if (this.attackCooldown > 0) this.attackCooldown--;
        if (this.shootCooldown > 0) this.shootCooldown--;
        if (this.shieldTimer > 0) { this.shieldTimer--; this.shieldActive = true; } else { this.shieldActive = false; }
        if (this.attackAnim > 0) this.attackAnim--;
        if (this.shootAnim > 0) this.shootAnim--;
        if (keys['j'] || keys['J']) {
            if (this.attackCooldown <= 0) {
                this.attackCooldown = 20;
                this.attackAnim = 10;
                for (let e of enemigos) {
                    if (!e.isAlive()) continue;
                    if (distancia(this, e) < 60) {
                        e.takeDamage(this.attackDamage);
                        sound.play('attack');
                    }
                }
                for (let c of cañones) {
                    if (!c.active || !c.isEnemy) continue;
                    if (distancia(this, c) < 60) {
                        c.hp -= this.attackDamage;
                        if (c.hp <= 0) { c.active = false; }
                        sound.play('attack');
                    }
                }
            }
        }
        if (keys['k'] || keys['K']) {
            this.shieldActive = true;
            this.shieldTimer = 10;
        }
        if (keys['l'] || keys['L']) {
            if (this.shootCooldown <= 0) {
                this.shootCooldown = 30;
                this.shootAnim = 10;
                let target = null, minDist = Infinity;
                for (let e of enemigos) {
                    if (!e.isAlive()) continue;
                    const d = distancia(this, e);
                    if (d < minDist) { minDist = d; target = e; }
                }
                for (let c of cañones) {
                    if (!c.active || !c.isEnemy) continue;
                    const d = distancia(this, c);
                    if (d < minDist) { minDist = d; target = c; }
                }
                if (target && minDist < 400) {
                    const p = new Projectile(this.x + (this.direction === 1 ? this.w : 0), this.y + this.h/2, target, 'fire', this.shotDamage, 'ally', 6);
                    proyectiles.push(p);
                    sound.play('fire');
                }
            }
        }
    }
    draw(ctx, images) {
        if (!this.isAlive()) return;
        let img = images.mariscal;
        if (this.shieldActive) img = images.mariscal_shield;
        else if (this.shootAnim > 0) img = images.mariscal_shot;
        else if (this.attackAnim > 0) img = images.mariscal_attack;
        if (img && img.complete && img.naturalWidth > 0) {
            ctx.save();
            if (this.direction === -1) { ctx.translate(this.x + this.w, this.y); ctx.scale(-1,1); } else ctx.translate(this.x, this.y);
            ctx.drawImage(img, 0, 0, this.w, this.h);
            ctx.restore();
        } else {
            ctx.fillStyle = '#FFD700'; ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = '#000'; ctx.font = '10px Arial'; ctx.fillText('M', this.x+8, this.y+20);
        }
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(this.x, this.y-8, this.w, 5);
        ctx.fillStyle = '#2ecc71'; ctx.fillRect(this.x+2, this.y-6, (this.w-4)*(this.hp/this.maxHP), 3);
    }
}

// ============================================================
//  ENEMIGOS
// ============================================================
class Esqueleto extends Entity {
    constructor(x, y, rushMode = false, goalX = null) {
        super(x, y, 'esqueleto', 150, 1);
        this.attackDamage = 12;
        this.range = 35;
        this.attackInterval = 25;
        this.w = 30; this.h = 40;
        this.rushMode = rushMode;
        this.canonTarget = null;
        if (rushMode) this.speed *= 1.3;
        this.goalX = goalX;
        this.isEnemy = true;
    }
    draw(ctx, images) {
        if (!this.isAlive()) return;
        let img = this.shieldActive ? images.esqueleto_shield : (this.attackAnim > 0 ? images.esqueleto_attack : images.esqueleto);
        if (img && img.complete && img.naturalWidth > 0) {
            ctx.save();
            if (this.direction === -1) { ctx.translate(this.x + this.w, this.y); ctx.scale(-1,1); } else ctx.translate(this.x, this.y);
            ctx.drawImage(img, 0, 0, this.w, this.h);
            ctx.restore();
        } else {
            ctx.fillStyle = '#8D6E63'; ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = '#fff'; ctx.font = '10px Arial'; ctx.fillText('E', this.x+8, this.y+20);
        }
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(this.x, this.y-8, this.w, 5);
        ctx.fillStyle = '#e74c3c'; ctx.fillRect(this.x+2, this.y-6, (this.w-4)*(this.hp/this.maxHP), 3);
    }
    update(aliados, enemigos, cañones) {
        super.update();
        const allTargets = aliados.concat([marshal]);
        if (currentLevel === 4) {
            this.x = Math.max(this.x, W() * 0.5);
        }
        if (this.rushMode) {
            let targetCanon = null;
            let minCanonDist = Infinity;
            for (let c of cañones) {
                if (!c.active || c.isEnemy) continue;
                if (Math.abs(c.y - this.y) < 20 && c.x > this.x && c.x < this.x + 150) {
                    const d = c.x - this.x;
                    if (d < minCanonDist) { minCanonDist = d; targetCanon = c; }
                }
            }
            if (targetCanon) {
                const dx = targetCanon.x - this.x, dy = targetCanon.y - this.y, dist = Math.hypot(dx, dy);
                if (dist <= this.range + 20) {
                    this.vx = 0; this.vy = 0;
                    if (this.attackCooldown <= 0) {
                        targetCanon.hp -= this.attackDamage;
                        if (targetCanon.hp <= 0) targetCanon.active = false;
                        this.attackCooldown = this.attackInterval;
                        this.attackAnim = 10;
                        sound.play('attack');
                    }
                } else {
                    this.vx = (dx/dist) * this.speed;
                    this.vy = (dy/dist) * this.speed;
                }
                return;
            }
            let target = null;
            let minDist = Infinity;
            for (let a of allTargets) {
                if (!a.isAlive()) continue;
                const d = distancia(this, a);
                if (d < minDist && d < 100) {
                    minDist = d;
                    target = a;
                }
            }
            if (target) {
                const dx = target.x - this.x, dy = target.y - this.y, dist = Math.hypot(dx, dy);
                if (dist <= this.range) {
                    this.vx = 0; this.vy = 0;
                    if (this.attackCooldown <= 0) {
                        target.takeDamage(this.attackDamage);
                        this.attackCooldown = this.attackInterval;
                        this.attackAnim = 10;
                        sound.play('attack');
                    }
                } else {
                    this.vx = -this.speed;
                    this.vy = 0;
                    if (Math.random() < 0.01) this.vy = (Math.random() - 0.5) * 0.5;
                }
            } else {
                this.vx = -this.speed;
                this.vy = 0;
                if (Math.random() < 0.01) this.vy = (Math.random() - 0.5) * 0.5;
            }
            this.vy = clamp(this.vy, -0.5, 0.5);
        } else {
            let target = null;
            let minDist = Infinity;
            if (this.goalX !== null) {
                for (let a of allTargets) {
                    if (!a.isAlive()) continue;
                    const d = distancia(this, a);
                    if (d < minDist && d < 300) {
                        minDist = d;
                        target = a;
                    }
                }
                if (target) {
                    const dx = target.x - this.x;
                    const dy = target.y - this.y;
                    const dist = Math.hypot(dx, dy);
                    if (dist > this.range) {
                        this.vx = (dx/dist) * this.speed;
                        this.vy = (dy/dist) * this.speed;
                    } else {
                        this.vx = 0; this.vy = 0;
                        if (this.attackCooldown <= 0) {
                            target.takeDamage(this.attackDamage);
                            this.attackCooldown = this.attackInterval;
                            this.attackAnim = 10;
                            sound.play('attack');
                        }
                    }
                } else {
                    this.vx *= 0.9;
                    this.vy *= 0.9;
                }
            } else {
                for (let a of allTargets) {
                    if (!a.isAlive()) continue;
                    const d = distancia(this, a);
                    if (d < minDist) { minDist = d; target = a; }
                }
                if (target) {
                    const dx = target.x - this.x, dy = target.y - this.y, dist = Math.hypot(dx, dy);
                    if (dist > this.range) {
                        this.vx = (dx/dist)*this.speed;
                        this.vy = (dy/dist)*this.speed;
                    } else {
                        this.vx = 0; this.vy = 0;
                        if (this.attackCooldown <= 0) {
                            target.takeDamage(this.attackDamage);
                            this.attackCooldown = this.attackInterval;
                            this.attackAnim = 10;
                            sound.play('attack');
                        }
                    }
                } else {
                    this.vx *= 0.9;
                    this.vy *= 0.9;
                }
            }
        }
    }
}

class EsqueletoArquero extends Entity {
    constructor(x, y, rushMode = false, goalX = null) {
        super(x, y, 'esqueleto_arquero', 100, 1.5);
        this.attackDamage = 12;
        this.rangeMin = 100;
        this.rangeMax = 250;
        this.attackInterval = 40;
        this.w = 30; this.h = 40;
        this.projectileSpeed = 6;
        this.projectileDamage = 12;
        this.projectileType = 'arrow';
        this.shooting = false;
        this.rushMode = rushMode;
        if (rushMode) this.speed *= 1.3;
        this.goalX = goalX;
        this.isEnemy = true;
    }
    draw(ctx, images) {
        if (!this.isAlive()) return;
        let img = images.esqueleto_arquero;
        if (this.shieldActive) img = images.esqueleto_arquero_shield;
        else if (this.shooting) img = images.esqueleto_arquero_arrow;
        else if (this.attackAnim > 0) img = images.esqueleto_arquero_attack;
        if (img && img.complete && img.naturalWidth > 0) {
            ctx.save();
            if (this.direction === -1) { ctx.translate(this.x + this.w, this.y); ctx.scale(-1,1); } else ctx.translate(this.x, this.y);
            ctx.drawImage(img, 0, 0, this.w, this.h);
            ctx.restore();
        } else {
            ctx.fillStyle = '#A1887F'; ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = '#fff'; ctx.font = '10px Arial'; ctx.fillText('EA', this.x+4, this.y+20);
        }
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(this.x, this.y-8, this.w, 5);
        ctx.fillStyle = '#e74c3c'; ctx.fillRect(this.x+2, this.y-6, (this.w-4)*(this.hp/this.maxHP), 3);
        this.shooting = false;
    }
    update(aliados, enemigos, proyectiles, cañones) {
        super.update();
        const allTargets = aliados.concat([marshal]);
        if (currentLevel === 4) {
            this.x = Math.max(this.x, W() * 0.5);
        }
        if (this.rushMode) {
            let target = null;
            let minDist = Infinity;
            for (let a of allTargets) {
                if (!a.isAlive()) continue;
                const d = distancia(this, a);
                if (d < minDist && d < this.rangeMax) {
                    minDist = d;
                    target = a;
                }
            }
            if (target) {
                const dx = target.x - this.x, dy = target.y - this.y, dist = Math.hypot(dx, dy);
                if (dist <= this.rangeMax && dist >= this.rangeMin) {
                    this.vx = 0; this.vy = 0;
                    if (this.attackCooldown <= 0) {
                        const p = new Projectile(this.x + this.w/2, this.y + this.h/2, target, this.projectileType, this.projectileDamage, 'enemy', this.projectileSpeed);
                        proyectiles.push(p);
                        this.attackCooldown = this.attackInterval;
                        this.shooting = true;
                        sound.play('arrow');
                    }
                } else {
                    this.vx = -this.speed;
                    this.vy = 0;
                    if (Math.random() < 0.01) this.vy = (Math.random() - 0.5) * 0.5;
                }
            } else {
                this.vx = -this.speed;
                this.vy = 0;
                if (Math.random() < 0.01) this.vy = (Math.random() - 0.5) * 0.5;
            }
            this.vy = clamp(this.vy, -0.5, 0.5);
        } else {
            let target = null;
            let minDist = Infinity;
            if (this.goalX !== null) {
                for (let a of allTargets) {
                    if (!a.isAlive()) continue;
                    const d = distancia(this, a);
                    if (d < minDist && d < this.rangeMax) {
                        minDist = d;
                        target = a;
                    }
                }
                if (target) {
                    const dx = target.x - this.x, dy = target.y - this.y, dist = Math.hypot(dx, dy);
                    if (dist > this.rangeMax) {
                        this.vx = (dx/dist)*this.speed;
                        this.vy = (dy/dist)*this.speed;
                    } else if (dist < this.rangeMin) {
                        this.vx = -(dx/dist)*this.speed;
                        this.vy = -(dy/dist)*this.speed;
                    } else {
                        this.vx = 0; this.vy = 0;
                        if (this.attackCooldown <= 0) {
                            const p = new Projectile(this.x + this.w/2, this.y + this.h/2, target, this.projectileType, this.projectileDamage, 'enemy', this.projectileSpeed);
                            proyectiles.push(p);
                            this.attackCooldown = this.attackInterval;
                            this.shooting = true;
                            sound.play('arrow');
                        }
                    }
                } else {
                    this.vx *= 0.9;
                    this.vy *= 0.9;
                }
            } else {
                for (let a of allTargets) {
                    if (!a.isAlive()) continue;
                    const d = distancia(this, a);
                    if (d < minDist) { minDist = d; target = a; }
                }
                if (target) {
                    const dx = target.x - this.x, dy = target.y - this.y, dist = Math.hypot(dx, dy);
                    if (dist > this.rangeMax) {
                        this.vx = (dx/dist)*this.speed;
                        this.vy = (dy/dist)*this.speed;
                    } else if (dist < this.rangeMin) {
                        this.vx = -(dx/dist)*this.speed;
                        this.vy = -(dy/dist)*this.speed;
                    } else {
                        this.vx = 0; this.vy = 0;
                        if (this.attackCooldown <= 0) {
                            const p = new Projectile(this.x + this.w/2, this.y + this.h/2, target, this.projectileType, this.projectileDamage, 'enemy', this.projectileSpeed);
                            proyectiles.push(p);
                            this.attackCooldown = this.attackInterval;
                            this.shooting = true;
                            sound.play('arrow');
                        }
                    }
                } else {
                    this.vx *= 0.9;
                    this.vy *= 0.9;
                }
            }
        }
    }
}

class GuerreroOscuridad extends Entity {
    constructor(x, y, rushMode = false, goalX = null) {
        super(x, y, 'guerrero_oscuridad', 250, 0.8);
        this.attackDamage = 20;
        this.range = 35;
        this.attackInterval = 30;
        this.w = 32; this.h = 42;
        this.rushMode = rushMode;
        if (rushMode) this.speed *= 1.3;
        this.goalX = goalX;
        this.isEnemy = true;
    }
    draw(ctx, images) {
        if (!this.isAlive()) return;
        let img = this.shieldActive ? images.guerrero_oscuridad_shield : (this.attackAnim > 0 ? images.guerrero_oscuridad_attack : images.guerrero_oscuridad);
        if (img && img.complete && img.naturalWidth > 0) {
            ctx.save();
            if (this.direction === -1) { ctx.translate(this.x + this.w, this.y); ctx.scale(-1,1); } else ctx.translate(this.x, this.y);
            ctx.drawImage(img, 0, 0, this.w, this.h);
            ctx.restore();
        } else {
            ctx.fillStyle = '#4A148C'; ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = '#fff'; ctx.font = '10px Arial'; ctx.fillText('GO', this.x+4, this.y+20);
        }
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(this.x, this.y-8, this.w, 5);
        ctx.fillStyle = '#e74c3c'; ctx.fillRect(this.x+2, this.y-6, (this.w-4)*(this.hp/this.maxHP), 3);
    }
    update(aliados, enemigos, cañones) {
        super.update();
        const allTargets = aliados.concat([marshal]);
        if (currentLevel === 4) {
            this.x = Math.max(this.x, W() * 0.5);
        }
        if (this.rushMode) {
            let targetCanon = null;
            let minCanonDist = Infinity;
            for (let c of cañones) {
                if (!c.active || c.isEnemy) continue;
                if (Math.abs(c.y - this.y) < 20 && c.x > this.x && c.x < this.x + 150) {
                    const d = c.x - this.x;
                    if (d < minCanonDist) { minCanonDist = d; targetCanon = c; }
                }
            }
            if (targetCanon) {
                const dx = targetCanon.x - this.x, dy = targetCanon.y - this.y, dist = Math.hypot(dx, dy);
                if (dist <= this.range + 20) {
                    this.vx = 0; this.vy = 0;
                    if (this.attackCooldown <= 0) {
                        targetCanon.hp -= this.attackDamage;
                        if (targetCanon.hp <= 0) targetCanon.active = false;
                        this.attackCooldown = this.attackInterval;
                        this.attackAnim = 10;
                        sound.play('attack');
                    }
                } else {
                    this.vx = (dx/dist) * this.speed;
                    this.vy = (dy/dist) * this.speed;
                }
                return;
            }
            let target = null;
            let minDist = Infinity;
            for (let a of allTargets) {
                if (!a.isAlive()) continue;
                const d = distancia(this, a);
                if (d < minDist && d < 100) {
                    minDist = d;
                    target = a;
                }
            }
            if (target) {
                const dx = target.x - this.x, dy = target.y - this.y, dist = Math.hypot(dx, dy);
                if (dist <= this.range) {
                    this.vx = 0; this.vy = 0;
                    if (this.attackCooldown <= 0) {
                        target.takeDamage(this.attackDamage);
                        this.attackCooldown = this.attackInterval;
                        this.attackAnim = 10;
                        sound.play('attack');
                    }
                } else {
                    this.vx = -this.speed;
                    this.vy = 0;
                    if (Math.random() < 0.01) this.vy = (Math.random() - 0.5) * 0.5;
                }
            } else {
                this.vx = -this.speed;
                this.vy = 0;
                if (Math.random() < 0.01) this.vy = (Math.random() - 0.5) * 0.5;
            }
            this.vy = clamp(this.vy, -0.5, 0.5);
        } else {
            let target = null;
            let minDist = Infinity;
            if (this.goalX !== null) {
                for (let a of allTargets) {
                    if (!a.isAlive()) continue;
                    const d = distancia(this, a);
                    if (d < minDist && d < 300) {
                        minDist = d;
                        target = a;
                    }
                }
                if (target) {
                    const dx = target.x - this.x, dy = target.y - this.y, dist = Math.hypot(dx, dy);
                    if (dist > this.range) {
                        this.vx = (dx/dist)*this.speed;
                        this.vy = (dy/dist)*this.speed;
                    } else {
                        this.vx = 0; this.vy = 0;
                        if (this.attackCooldown <= 0) {
                            target.takeDamage(this.attackDamage);
                            this.attackCooldown = this.attackInterval;
                            this.attackAnim = 10;
                            sound.play('attack');
                        }
                    }
                } else {
                    this.vx *= 0.9;
                    this.vy *= 0.9;
                }
            } else {
                for (let a of allTargets) {
                    if (!a.isAlive()) continue;
                    const d = distancia(this, a);
                    if (d < minDist) { minDist = d; target = a; }
                }
                if (target) {
                    const dx = target.x - this.x, dy = target.y - this.y, dist = Math.hypot(dx, dy);
                    if (dist > this.range) {
                        this.vx = (dx/dist)*this.speed;
                        this.vy = (dy/dist)*this.speed;
                    } else {
                        this.vx = 0; this.vy = 0;
                        if (this.attackCooldown <= 0) {
                            target.takeDamage(this.attackDamage);
                            this.attackCooldown = this.attackInterval;
                            this.attackAnim = 10;
                            sound.play('attack');
                        }
                    }
                } else {
                    this.vx *= 0.9;
                    this.vy *= 0.9;
                }
            }
        }
    }
}

class Hechicera extends Entity {
    constructor(x, y, rushMode = false, goalX = null) {
        super(x, y, 'hechicera', 100, 1.5);
        this.attackDamage = 25;
        this.rangeMin = 80;
        this.rangeMax = 200;
        this.attackInterval = 50;
        this.w = 30; this.h = 40;
        this.projectileSpeed = 5;
        this.projectileDamage = 25;
        this.projectileType = 'fire';
        this.launchAnim = 0;
        this.teleportCooldown = 0;
        this.rushMode = rushMode;
        if (rushMode) this.speed *= 1.3;
        this.goalX = goalX;
        this.isEnemy = true;
    }
    draw(ctx, images) {
        if (!this.isAlive()) return;
        let img = images.hechicera;
        if (this.launchAnim > 0) img = images.hechicera_launch;
        else if (this.attackAnim > 0) img = images.hechicera_attack;
        else if (this.teleportCooldown > 0) img = images.hechicera_teleporter;
        if (img && img.complete && img.naturalWidth > 0) {
            ctx.save();
            if (this.direction === -1) { ctx.translate(this.x + this.w, this.y); ctx.scale(-1,1); } else ctx.translate(this.x, this.y);
            ctx.drawImage(img, 0, 0, this.w, this.h);
            ctx.restore();
        } else {
            ctx.fillStyle = '#6A1B9A'; ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = '#fff'; ctx.font = '10px Arial'; ctx.fillText('H', this.x+8, this.y+20);
        }
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(this.x, this.y-8, this.w, 5);
        ctx.fillStyle = '#e74c3c'; ctx.fillRect(this.x+2, this.y-6, (this.w-4)*(this.hp/this.maxHP), 3);
        if (this.launchAnim > 0) this.launchAnim--;
        if (this.teleportCooldown > 0) this.teleportCooldown--;
    }
    update(aliados, enemigos, proyectiles, cañones) {
        super.update();
        if (this.teleportCooldown <= 0 && Math.random() < 0.001) {
            this.x += random(-100,100); this.y += random(-50,50);
            this.x = clamp(this.x, 0, W()); this.y = clamp(this.y, H()*0.3, H()-20);
            this.teleportCooldown = 120;
            sound.play('teleport');
        }
        const allTargets = aliados.concat([marshal]);
        if (currentLevel === 4) {
            this.x = Math.max(this.x, W() * 0.5);
        }
        if (this.rushMode) {
            let target = null;
            let minDist = Infinity;
            for (let a of allTargets) {
                if (!a.isAlive()) continue;
                const d = distancia(this, a);
                if (d < minDist && d < this.rangeMax) {
                    minDist = d;
                    target = a;
                }
            }
            if (target) {
                const dx = target.x - this.x, dy = target.y - this.y, dist = Math.hypot(dx, dy);
                if (dist <= this.rangeMax && dist >= this.rangeMin) {
                    this.vx = 0; this.vy = 0;
                    if (this.attackCooldown <= 0) {
                        const p = new Projectile(this.x + this.w/2, this.y + this.h/2, target, this.projectileType, this.projectileDamage, 'enemy', this.projectileSpeed);
                        proyectiles.push(p);
                        this.attackCooldown = this.attackInterval;
                        this.launchAnim = 10;
                        sound.play('fire');
                    }
                } else {
                    this.vx = -this.speed;
                    this.vy = 0;
                    if (Math.random() < 0.01) this.vy = (Math.random() - 0.5) * 0.5;
                }
            } else {
                this.vx = -this.speed;
                this.vy = 0;
                if (Math.random() < 0.01) this.vy = (Math.random() - 0.5) * 0.5;
            }
            this.vy = clamp(this.vy, -0.5, 0.5);
        } else {
            let target = null;
            let minDist = Infinity;
            if (this.goalX !== null) {
                for (let a of allTargets) {
                    if (!a.isAlive()) continue;
                    const d = distancia(this, a);
                    if (d < minDist && d < this.rangeMax) {
                        minDist = d;
                        target = a;
                    }
                }
                if (target) {
                    const dx = target.x - this.x, dy = target.y - this.y, dist = Math.hypot(dx, dy);
                    if (dist > this.rangeMax) {
                        this.vx = (dx/dist)*this.speed;
                        this.vy = (dy/dist)*this.speed;
                    } else if (dist < this.rangeMin) {
                        this.vx = -(dx/dist)*this.speed;
                        this.vy = -(dy/dist)*this.speed;
                    } else {
                        this.vx = 0; this.vy = 0;
                        if (this.attackCooldown <= 0) {
                            const p = new Projectile(this.x + this.w/2, this.y + this.h/2, target, this.projectileType, this.projectileDamage, 'enemy', this.projectileSpeed);
                            proyectiles.push(p);
                            this.attackCooldown = this.attackInterval;
                            this.launchAnim = 10;
                            sound.play('fire');
                        }
                    }
                } else {
                    this.vx *= 0.9;
                    this.vy *= 0.9;
                }
            } else {
                for (let a of allTargets) {
                    if (!a.isAlive()) continue;
                    const d = distancia(this, a);
                    if (d < minDist) { minDist = d; target = a; }
                }
                if (target) {
                    const dx = target.x - this.x, dy = target.y - this.y, dist = Math.hypot(dx, dy);
                    if (dist > this.rangeMax) {
                        this.vx = (dx/dist)*this.speed;
                        this.vy = (dy/dist)*this.speed;
                    } else if (dist < this.rangeMin) {
                        this.vx = -(dx/dist)*this.speed;
                        this.vy = -(dy/dist)*this.speed;
                    } else {
                        this.vx = 0; this.vy = 0;
                        if (this.attackCooldown <= 0) {
                            const p = new Projectile(this.x + this.w/2, this.y + this.h/2, target, this.projectileType, this.projectileDamage, 'enemy', this.projectileSpeed);
                            proyectiles.push(p);
                            this.attackCooldown = this.attackInterval;
                            this.launchAnim = 10;
                            sound.play('fire');
                        }
                    }
                } else {
                    this.vx *= 0.9;
                    this.vy *= 0.9;
                }
            }
        }
    }
}

// ============================================================
//  JEFE FINAL
// ============================================================
class JefeFinal extends Entity {
    constructor(x, y) {
        super(x, y, 'jefe', 100000, 1.5);
        this.attackDamage = 120;
        this.range = 50;
        this.attackInterval = 25;
        this.w = 60; this.h = 80;
        this.rushMode = false;
        this.fireballCooldown = 0;
        this.fireballInterval = 40;
        this.fireballDamage = 80;
        this.shootTimer = 0;
        this.isEnemy = true;
    }
    draw(ctx, images) {
        if (!this.isAlive()) return;
        let img = this.shieldActive ? images.jefe_shield : (this.attackAnim > 0 ? images.jefe_attack : images.jefe);
        if (img && img.complete && img.naturalWidth > 0) {
            ctx.save();
            if (this.direction === -1) { ctx.translate(this.x + this.w, this.y); ctx.scale(-1,1); } else ctx.translate(this.x, this.y);
            ctx.drawImage(img, 0, 0, this.w, this.h);
            ctx.restore();
        } else {
            ctx.fillStyle = '#1A1A2E'; ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = '#fff'; ctx.font = '14px Arial'; ctx.fillText('JEFE', this.x+8, this.y+40);
        }
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(this.x, this.y-12, this.w, 8);
        ctx.fillStyle = '#e74c3c'; ctx.fillRect(this.x+2, this.y-10, (this.w-4)*(this.hp/this.maxHP), 4);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.strokeRect(this.x, this.y-12, this.w, 8);
    }
    update(aliados, enemigos, proyectiles) {
        super.update();
        const allTargets = aliados.concat([marshal]);
        if (this.isAlive()) {
            this.shootTimer++;
            if (this.shootTimer >= this.fireballInterval) {
                this.shootTimer = 0;
                let target = null;
                let minDist = Infinity;
                for (let a of allTargets) {
                    if (!a.isAlive()) continue;
                    const d = distancia(this, a);
                    if (d < minDist) {
                        minDist = d;
                        target = a;
                    }
                }
                if (target && minDist < 500) {
                    const p = new Projectile(this.x + (this.direction === 1 ? this.w : 0), this.y + this.h/2, target, 'fire', this.fireballDamage, 'enemy', 4, true);
                    proyectiles.push(p);
                    sound.play('fire');
                }
            }
        }
        let target = null;
        let minDist = Infinity;
        for (let a of allTargets) {
            if (!a.isAlive()) continue;
            const d = distancia(this, a);
            if (d < minDist) { minDist = d; target = a; }
        }
        if (target) {
            const dx = target.x - this.x;
            const dy = target.y - this.y;
            const dist = Math.hypot(dx, dy);
            if (dist > this.range) {
                this.vx = (dx / dist) * this.speed;
                this.vy = (dy / dist) * this.speed;
            } else {
                this.vx = 0;
                this.vy = 0;
                if (this.attackCooldown <= 0) {
                    target.takeDamage(this.attackDamage);
                    this.attackCooldown = this.attackInterval;
                    this.attackAnim = 10;
                    sound.play('attack');
                }
            }
        } else {
            this.vx *= 0.9;
            this.vy *= 0.9;
        }
    }
}

// ============================================================
//  CAÑÓN
// ============================================================
class Canon {
    constructor(x, y, isEnemy = false) {
        this.x = x; this.y = y; this.w = 30; this.h = 30;
        this.hp = isEnemy ? 200 : 150;
        this.maxHP = this.hp;
        this.active = true;
        this.shootTimer = 0;
        this.shootInterval = 180;
        this.damage = 50;
        this.direction = isEnemy ? -1 : 1;
        this.bullets = [];
        this.isEnemy = isEnemy;
        this.type = isEnemy ? 'cañon_enemigo' : 'cañon_amigo';
    }
    draw(ctx, images) {
        if (!this.active) return;
        const img = images.cañon;
        if (img && img.complete && img.naturalWidth > 0) {
            ctx.save();
            ctx.translate(this.x + this.w/2, this.y + this.h/2);
            if (this.direction === -1) ctx.scale(-1, 1);
            ctx.drawImage(img, -this.w/2, -this.h/2, this.w, this.h);
            ctx.restore();
            ctx.fillStyle = this.isEnemy ? 'rgba(255,0,0,0.3)' : 'rgba(0,255,0,0.3)';
            ctx.fillRect(this.x, this.y, this.w, 4);
        } else {
            ctx.fillStyle = this.isEnemy ? '#880000' : '#795548';
            ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = '#fff';
            ctx.font = '10px Arial';
            ctx.fillText(this.isEnemy ? 'C!' : 'C', this.x+10, this.y+20);
        }
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(this.x, this.y-8, this.w, 5);
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(this.x+2, this.y-6, (this.w-4)*(this.hp/this.maxHP), 3);
    }
    update(targets) {
        if (!this.active) return;
        this.shootTimer++;
        let hasTarget = false;
        if (this.isEnemy) {
            for (let t of targets) {
                if (!t.isAlive()) continue;
                if (t.type === 'marshal' || t.type === 'guerrero' || t.type === 'arquero' || t.type === 'maga' || t.type === 'jinete') {
                    if (Math.abs(t.y - this.y) < 30 && t.x < this.x) {
                        hasTarget = true;
                        break;
                    }
                }
            }
        } else {
            for (let t of targets) {
                if (!t.isAlive()) continue;
                if (t.type === 'esqueleto' || t.type === 'esqueleto_arquero' || t.type === 'guerrero_oscuridad' || t.type === 'hechicera' || t.type === 'jefe') {
                    if (Math.abs(t.y - this.y) < 30 && t.x > this.x) {
                        hasTarget = true;
                        break;
                    }
                }
            }
        }
        if (hasTarget && this.shootTimer >= this.shootInterval) {
            this.shootTimer = 0;
            const ball = new CanonBall(this.x + (this.isEnemy ? 0 : this.w), this.y + this.h/2, this.direction, this.isEnemy);
            this.bullets.push(ball);
            sound.play('canon');
        }
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const b = this.bullets[i];
            const targetList = this.isEnemy ? [marshal, ...aliados] : enemigos;
            b.update(targetList);
            if (!b.active) {
                this.bullets.splice(i, 1);
            }
        }
    }
    drawBullets(ctx) {
        for (let b of this.bullets) {
            b.draw(ctx);
        }
    }
    takeDamage(dmg) {
        this.hp -= dmg;
        if (this.hp <= 0) { this.hp = 0; this.active = false; }
    }
    isAlive() { return this.active; }
}

// ============================================================
//  MURO
// ============================================================
class Wall {
    constructor(x, y, w, h) {
        this.x = x; this.y = y; this.w = w; this.h = h;
        this.active = true;
    }
    draw(ctx) {
        if (!this.active) return;
        const brickW = 20, brickH = 10;
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.strokeStyle = '#5D3A1A';
        ctx.lineWidth = 1;
        for (let y = this.y; y < this.y + this.h; y += brickH) {
            ctx.beginPath();
            ctx.moveTo(this.x, y);
            ctx.lineTo(this.x + this.w, y);
            ctx.stroke();
        }
        let offset = 0;
        for (let y = this.y; y < this.y + this.h; y += brickH) {
            for (let x = this.x + offset; x < this.x + this.w; x += brickW) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, y + brickH);
                ctx.stroke();
            }
            offset = (offset === 0) ? brickW/2 : 0;
        }
        ctx.strokeStyle = '#3E2723';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
}

// ============================================================
//  GESTOR DE PARTIDA
// ============================================================
let gameRunning = false;
let paused = false;
let currentLevel = 0;
let marshal = null;
let aliados = [];
let enemigos = [];
let cañones = [];
let keys = {};
let proyectiles = [];
let walls = [];

let totalEnemyKills = 0;
let totalAllyKills = 0;
let levelEnemyKills = 0;
let levelAllyKills = 0;

let availableUnits = {
    guerrero: 10000,
    arquero: 800,
    maga: 500,
    jinete: 500
};

let MAX_FIELD_UNITS = 200;
let MAX_ENEMIES_LEVEL = 200;

let levelTimer = 0;
let levelMaxTime = 0;
let levelObjective = 'killAll';
let baseDefended = true;
let enemySpawnTimer = 0;
let spawnWave = 0;
let gameOverFlag = false;
let infiltrationSuccess = false;
let introTimer = 0;
let levelIntroActive = false;

// ============================================================
//  FUNCIONES DE INTRO DE NIVEL
// ============================================================
function showLevelIntro(level) {
    const msg = translations.levelMessages[level];
    if (msg) {
        levelIntro.textContent = msg[currentLang] || msg.es;
    } else {
        levelIntro.textContent = `Nivel ${level}`;
    }
    levelIntro.classList.add('show');
    levelIntroActive = true;
    introTimer = 120;
}
function updateLevelIntro() {
    if (levelIntroActive) {
        introTimer--;
        if (introTimer <= 0) {
            levelIntro.classList.remove('show');
            levelIntroActive = false;
        }
    }
}

// ============================================================
//  FUNCIONES DE GESTIÓN DE UNIDADES
// ============================================================
function returnSurvivingUnits() {
    for (let a of aliados) {
        if (a.isAlive()) {
            const type = a.type;
            if (type === 'guerrero') availableUnits.guerrero++;
            else if (type === 'arquero') availableUnits.arquero++;
            else if (type === 'maga') availableUnits.maga++;
            else if (type === 'jinete') availableUnits.jinete++;
        }
    }
    aliados = [];
    updateUI();
}

function fullReset() {
    totalEnemyKills = 0;
    totalAllyKills = 0;
    levelEnemyKills = 0;
    levelAllyKills = 0;
    availableUnits = {
        guerrero: 10000,
        arquero: 800,
        maga: 500,
        jinete: 500
    };
    aliados = [];
    enemigos = [];
    cañones = [];
    proyectiles = [];
    walls = [];
    if (marshal) {
        marshal.hp = 2000;
        marshal.x = W() * 0.4;
        marshal.y = H() * 0.6;
    }
    updateUI();
    sound.stopAll();
}

// ============================================================
//  FUNCIONES DE NIVEL
// ============================================================
function loadLevel(level) {
    sound.stopAll();

    currentLevel = level;
    levelEnemyKills = 0;
    levelAllyKills = 0;
    levelTimer = 0;
    enemigos = [];
    cañones = [];
    proyectiles = [];
    walls = [];
    baseDefended = true;
    spawnWave = 0;
    enemySpawnTimer = 0;
    gameOverFlag = false;
    infiltrationSuccess = false;

    // Configurar límites según nivel
    if (level === 4) {
        MAX_FIELD_UNITS = 80;
        MAX_ENEMIES_LEVEL = 40;
        const w = W();
        const h = H();
        const groundY = h * 0.3;
        const maxY = h - 20;
        const wallX = w * 0.12;
        const wallW = 20;
        const wallH = (maxY - groundY) * 0.6;
        const wallY = groundY + (maxY - groundY - wallH) / 2;
        walls.push(new Wall(wallX, wallY, wallW, wallH));
    } else if (level === 3) {
        MAX_FIELD_UNITS = 40;
        MAX_ENEMIES_LEVEL = 80;
    } else if (level === 2) {
        MAX_FIELD_UNITS = 200;
        MAX_ENEMIES_LEVEL = 200;
    } else if (level === 5) {
        MAX_FIELD_UNITS = 20;
        MAX_ENEMIES_LEVEL = 1;
    } else {
        MAX_FIELD_UNITS = 200;
        MAX_ENEMIES_LEVEL = 200;
    }

    if (level > 1) {
        returnSurvivingUnits();
    }

    if (!marshal) {
        marshal = new Marshal(W() * 0.4, H() * 0.6);
    } else {
        marshal.x = W() * 0.4;
        marshal.y = H() * 0.6;
    }

    switch (level) {
        case 1:
            levelObjective = 'killAll';
            levelMaxTime = 0;
            enemigos.push(new Esqueleto(W()*0.70, H()*0.55, false));
            enemigos.push(new Esqueleto(W()*0.80, H()*0.65, false));
            enemigos.push(new Esqueleto(W()*0.85, H()*0.50, false));
            enemigos.push(new EsqueletoArquero(W()*0.90, H()*0.60, false));
            break;
        case 2:
            levelObjective = 'timeKills';
            levelMaxTime = 120;
            break;
        case 3:
            levelObjective = 'defendBase';
            levelMaxTime = 120;
            const canonX = W() * 0.12;
            const groundY = H() * 0.3;
            const maxY = H() - 20;
            for (let y = groundY + 10; y < maxY - 10; y += 35) {
                cañones.push(new Canon(canonX, y, false));
            }
            break;
        case 4:
            levelObjective = 'infiltrate';
            levelMaxTime = 120;
            const enemyCanonX = W() * 0.85;
            const groundY4 = H() * 0.3;
            const maxY4 = H() - 20;
            for (let y = groundY4 + 10; y < maxY4 - 10; y += 35) {
                cañones.push(new Canon(enemyCanonX, y, true));
            }
            break;
        case 5:
            levelObjective = 'boss';
            levelMaxTime = 0;
            enemigos.push(new JefeFinal(W() * 0.75, H() * 0.5));
            break;
        default:
            levelObjective = 'killAll';
    }

    // Mostrar/ocultar el reloj según nivel
    if (levelMaxTime > 0 && (level === 2 || level === 3 || level === 4)) {
        timerContainer.style.display = 'flex';
    } else {
        timerContainer.style.display = 'none';
    }

    gameRunning = true;
    paused = false;
    document.getElementById('pauseMsg').style.display = 'none';
    document.getElementById('gameOverScreen').classList.add('hidden');
    document.getElementById('victoryScreen').classList.add('hidden');
    document.getElementById('surrenderConfirm').classList.add('hidden');
    mainMenu.classList.add('hidden');
    instructionsScreen.classList.add('hidden');
    scoresScreen.classList.add('hidden');
    updateUI();

    showLevelIntro(level);
}

// ============================================================
//  CONTADOR DE BAJAS
// ============================================================
function registerAllyDeath() {
    totalAllyKills++;
    levelAllyKills++;
    updateUI();
}
function registerEnemyDeath() {
    totalEnemyKills++;
    levelEnemyKills++;
    updateUI();
}

// ============================================================
//  SPAWN DE ENEMIGOS
// ============================================================
function generateGroup(level) {
    let type, count;
    if (level === 4) {
        const rand = Math.random();
        if (rand < 0.20) { type = 'esqueleto'; count = 8 + Math.floor(Math.random() * 5); }
        else if (rand < 0.80) { type = 'esqueleto_arquero'; count = 8 + Math.floor(Math.random() * 5); }
        else if (rand < 0.90) { type = 'guerrero_oscuridad'; count = 8 + Math.floor(Math.random() * 5); }
        else { type = 'hechicera'; count = 5 + Math.floor(Math.random() * 4); }
        if (count > 12) count = 8 + Math.floor(Math.random() * 4);
    } else if (level === 3) {
        const rand = Math.random();
        if (rand < 0.50) { type = 'esqueleto'; count = 8 + Math.floor(Math.random() * 5); }
        else if (rand < 0.70) { type = 'guerrero_oscuridad'; count = 8 + Math.floor(Math.random() * 5); }
        else if (rand < 0.85) { type = 'hechicera'; count = 5 + Math.floor(Math.random() * 4); }
        else { type = 'esqueleto_arquero'; count = 5 + Math.floor(Math.random() * 4); }
    } else if (level === 2) {
        const rand = Math.random();
        if (rand < 0.60) { type = 'esqueleto'; count = 8 + Math.floor(Math.random() * 5); }
        else if (rand < 0.70) { type = 'guerrero_oscuridad'; count = 8 + Math.floor(Math.random() * 5); }
        else if (rand < 0.85) { type = 'hechicera'; count = 5 + Math.floor(Math.random() * 4); }
        else { type = 'esqueleto_arquero'; count = 5 + Math.floor(Math.random() * 4); }
    } else {
        type = 'esqueleto';
        count = 3 + Math.floor(Math.random() * 3);
    }
    if (count > 12) count = 12;
    const maxAllowed = MAX_ENEMIES_LEVEL - enemigos.length;
    if (maxAllowed <= 0) return [];
    count = Math.min(count, maxAllowed);

    const group = [];
    const groundY = H() * 0.3;
    const maxY = H() - 20;
    const rush = (level === 3);
    const spacingX = 30;
    const totalWidth = (count - 1) * spacingX;
    const startX = W() * 0.78 + (W() * 0.22 - totalWidth) / 2;
    const baseY = groundY + 10 + Math.random() * (maxY - groundY - 20);
    for (let i = 0; i < count; i++) {
        const x = startX + i * spacingX;
        const y = baseY + (Math.random() - 0.5) * 20;
        let enemy;
        const goal = null;
        switch (type) {
            case 'esqueleto': enemy = new Esqueleto(x, y, rush, goal); break;
            case 'esqueleto_arquero': enemy = new EsqueletoArquero(x, y, rush, goal); break;
            case 'guerrero_oscuridad': enemy = new GuerreroOscuridad(x, y, rush, goal); break;
            case 'hechicera': enemy = new Hechicera(x, y, rush, goal); break;
            default: enemy = new Esqueleto(x, y, rush, goal);
        }
        group.push(enemy);
    }
    return group;
}

// ============================================================
//  RECLUTAR GRUPOS
// ============================================================
function spawnGroup(type, count) {
    if (!gameRunning || paused || gameOverFlag) return;
    if (availableUnits[type] <= 0) return;
    const fieldCount = aliados.filter(a => a.isAlive()).length;
    let maxCanSpawn = Math.min(availableUnits[type], MAX_FIELD_UNITS - fieldCount);
    if (maxCanSpawn <= 0) return;
    const toSpawn = Math.min(count, maxCanSpawn);
    const baseX = marshal.x + marshal.direction * 30;
    const baseY = marshal.y + 10;
    const cols = 5;
    let spawned = 0;
    for (let i = 0; i < toSpawn; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const offsetX = col * 15 - (cols - 1) * 7.5;
        const offsetY = row * 20;
        const x = baseX + offsetX;
        const y = baseY + offsetY;
        let goalX = (currentLevel === 4) ? W() * 0.92 : null;
        let unit;
        switch (type) {
            case 'guerrero': unit = new Guerrero(x, y, goalX); break;
            case 'arquero': unit = new Arquero(x, y, goalX); break;
            case 'maga': unit = new Maga(x, y, goalX); break;
            case 'jinete': unit = new Jinete(x, y, goalX); break;
            default: return;
        }
        aliados.push(unit);
        availableUnits[type]--;
        spawned++;
    }
    if (spawned > 0) sound.play('button');
    updateUI();
}

// ============================================================
//  ACTUALIZACIÓN DEL JUEGO
// ============================================================
function update() {
    if (!gameRunning || paused || gameOverFlag) return;
    updateLevelIntro();

    if (levelMaxTime > 0) {
        levelTimer += 1/60;
        if (levelTimer >= levelMaxTime) {
            if (levelObjective === 'timeKills') {
                if (levelEnemyKills > levelAllyKills) {
                    loadLevel(3);
                    return;
                } else {
                    gameOver();
                    return;
                }
            } else if (levelObjective === 'defendBase') {
                loadLevel(4);
                return;
            } else if (levelObjective === 'infiltrate') {
                gameOver();
                return;
            }
        }
    }

    if (levelObjective === 'infiltrate' && !infiltrationSuccess) {
        for (let a of aliados) {
            if (a.isAlive() && a.x + a.w > W() * 0.92) {
                infiltrationSuccess = true;
                loadLevel(5);
                return;
            }
        }
    }

    marshal.update(keys);

    for (let a of aliados) {
        if (a.isAlive()) {
            if (a.type === 'arquero' || a.type === 'maga') {
                a.update(aliados, enemigos, proyectiles, cañones);
            } else {
                a.update(aliados, enemigos, cañones);
            }
        }
    }
    for (let i = aliados.length - 1; i >= 0; i--) {
        if (!aliados[i].isAlive()) {
            registerAllyDeath();
            aliados.splice(i, 1);
        }
    }

    for (let e of enemigos) {
        if (e.isAlive()) {
            if (e.type === 'esqueleto_arquero' || e.type === 'hechicera') {
                e.update(aliados.concat([marshal]), enemigos, proyectiles, cañones);
            } else if (e.type === 'jefe') {
                e.update(aliados.concat([marshal]), enemigos, proyectiles);
            } else {
                e.update(aliados.concat([marshal]), enemigos, cañones);
            }
        }
    }
    for (let i = enemigos.length - 1; i >= 0; i--) {
        if (!enemigos[i].isAlive()) {
            registerEnemyDeath();
            enemigos.splice(i, 1);
        }
    }

    const allEntities = aliados.concat(enemigos).concat([marshal]).concat(cañones.filter(c => c.active));
    for (let p of proyectiles) {
        p.update(allEntities);
    }
    proyectiles = proyectiles.filter(p => p.active);

    for (let c of cañones) {
        if (!c.active) continue;
        if (c.isEnemy) {
            const targets = [marshal, ...aliados];
            c.update(targets);
        } else {
            c.update(enemigos);
        }
    }

    if (levelObjective === 'timeKills' || levelObjective === 'defendBase' || levelObjective === 'infiltrate') {
        enemySpawnTimer++;
        let spawnInterval = 150;
        if (levelObjective === 'defendBase') {
            spawnInterval = 100;
        } else if (currentLevel === 2 || currentLevel === 4) {
            spawnInterval = 10;
        }
        if (enemySpawnTimer >= spawnInterval && enemigos.length < MAX_ENEMIES_LEVEL) {
            enemySpawnTimer = 0;
            const group = generateGroup(currentLevel);
            if (group.length > 0) {
                enemigos.push(...group);
                if (enemigos.length > MAX_ENEMIES_LEVEL) {
                    enemigos = enemigos.slice(0, MAX_ENEMIES_LEVEL);
                }
            }
        }
    }

    if (levelObjective === 'killAll' && enemigos.length === 0 && !gameOverFlag) {
        loadLevel(2);
        return;
    }

    if (levelObjective === 'boss' && enemigos.length === 0 && !gameOverFlag) {
        victory();
        return;
    }

    if (levelObjective === 'defendBase') {
        for (let e of enemigos) {
            if (e.isAlive() && e.x < W() * 0.05) {
                baseDefended = false;
                gameOver();
                return;
            }
        }
    }

    if (!marshal.isAlive()) {
        gameOver();
        return;
    }

    updateUI();
}

// ============================================================
//  DIBUJO
// ============================================================
function draw() {
    const w = W(), h = H();
    ctx.clearRect(0, 0, w, h);
    const skyHeight = h * 0.3;
    const groundY = skyHeight;

    let grad = ctx.createLinearGradient(0, 0, 0, skyHeight);
    grad.addColorStop(0, '#4fc3f7');
    grad.addColorStop(0.5, '#81d4fa');
    grad.addColorStop(1, '#b3e5fc');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, skyHeight);
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    for (let i = 0; i < 5; i++) {
        const cx = (i * 150 + Date.now() * 0.01) % w;
        const cy = 30 + i * 20;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 80, 25, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx+40, cy-10, 60, 20, 0, 0, Math.PI*2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx-30, cy+8, 55, 18, 0, 0, Math.PI*2);
        ctx.fill();
    }

    let gradGround = ctx.createLinearGradient(0, groundY, 0, h);
    gradGround.addColorStop(0, '#8BC34A');
    gradGround.addColorStop(0.3, '#689F38');
    gradGround.addColorStop(0.7, '#558B2F');
    gradGround.addColorStop(1, '#33691E');
    ctx.fillStyle = gradGround;
    ctx.fillRect(0, groundY, w, h - groundY);

    ctx.strokeStyle = '#6D4C41';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(w, groundY);
    ctx.stroke();

    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * w;
        const y = groundY + 20 + Math.random() * (h - groundY - 40);
        ctx.fillRect(x, y, 4, 4);
    }

    if (levelObjective === 'infiltrate') {
        ctx.fillStyle = 'rgba(200, 0, 0, 0.15)';
        ctx.fillRect(W() * 0.92, groundY, W() * 0.08, h - groundY);
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.strokeRect(W() * 0.92, groundY, W() * 0.08, h - groundY);
        ctx.setLineDash([]);
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.fillText('🏴 BASE ENEMIGA', W() * 0.92 + 5, groundY + 25);
        ctx.fillStyle = 'rgba(255, 255, 0, 0.15)';
        ctx.fillRect(W() * 0.85, groundY, 10, h - groundY);
        ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
        ctx.font = '10px Arial';
        ctx.fillText('🚫', W() * 0.85, groundY + 30);
    }

    for (let wall of walls) {
        wall.draw(ctx);
    }

    for (let c of cañones) {
        c.draw(ctx, images);
        c.drawBullets(ctx);
    }

    for (let a of aliados) a.draw(ctx, images);
    if (marshal) marshal.draw(ctx, images);
    for (let e of enemigos) e.draw(ctx, images);
    for (let p of proyectiles) p.draw(ctx);

    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.fillText(`Nivel ${currentLevel}`, 10, 20);
    ctx.fillText(`Aliados: ${aliados.filter(a=>a.isAlive()).length}`, 10, 40);
    ctx.fillText(`Enemigos: ${enemigos.filter(e=>e.isAlive()).length}`, 10, 60);
    if (levelObjective === 'timeKills' || levelObjective === 'defendBase' || levelObjective === 'infiltrate') {
        const remaining = Math.max(0, levelMaxTime - levelTimer);
        const mins = Math.floor(remaining / 60);
        const secs = Math.floor(remaining % 60);
        ctx.fillText(`⏱️ ${mins}:${secs.toString().padStart(2,'0')}`, w - 100, 30);
    }
    if (levelObjective === 'infiltrate') {
        ctx.fillStyle = '#FFD700';
        ctx.font = '16px Arial';
        ctx.fillText('🎯 Lleva un soldado a la base enemiga', w/2 - 150, 30);
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
    }
}

// ============================================================
//  UI Y ACTUALIZACIÓN
// ============================================================
function updateUI() {
    enemyKillsSpan.textContent = levelEnemyKills;
    allyKillsSpan.textContent = levelAllyKills;

    if (timerContainer.style.display !== 'none' && levelMaxTime > 0) {
        const remaining = Math.max(0, levelMaxTime - levelTimer);
        const mins = Math.floor(remaining / 60);
        const secs = Math.floor(remaining % 60);
        timerSpan.textContent = `${mins}:${secs.toString().padStart(2,'0')}`;
    }

    unitsSpan.textContent = `G:${availableUnits.guerrero} A:${availableUnits.arquero} M:${availableUnits.maga} J:${availableUnits.jinete}`;
    const fieldCount = aliados.filter(a => a.isAlive()).length;
    fieldUnitsSpan.textContent = `${fieldCount}/${MAX_FIELD_UNITS}`;
}

// ============================================================
//  FUNCIONES DE FIN DE JUEGO
// ============================================================
function victory() {
    if (gameOverFlag) return;
    gameOverFlag = true;
    gameRunning = false;
    sound.stopAll();
    sound.stopMusic();
    sound.play('victory');
    const finalScore = totalEnemyKills - totalAllyKills;
    document.getElementById('victoryScore').textContent = finalScore;
    saveScore(finalScore);
    victoryScreen.classList.remove('hidden');
}
function gameOver() {
    if (gameOverFlag) return;
    gameOverFlag = true;
    gameRunning = false;
    sound.stopAll();
    sound.stopMusic();
    sound.play('defeat');
    const finalScore = totalEnemyKills - totalAllyKills;
    document.getElementById('finalScore').textContent = finalScore;
    saveScore(finalScore);
    gameOverScreen.classList.remove('hidden');
}

function saveScore(score) {
    let scores = JSON.parse(localStorage.getItem('buenosMalosScores') || '[]');
    scores.push(score);
    scores.sort((a,b) => b - a);
    if (scores.length > 20) scores = scores.slice(0,20);
    localStorage.setItem('buenosMalosScores', JSON.stringify(scores));
}
function loadScores() {
    const scores = JSON.parse(localStorage.getItem('buenosMalosScores') || '[]');
    scoreList.innerHTML = '';
    if (scores.length === 0) {
        const noScoresText = translations.noScores[currentLang] || 'No hay puntuaciones';
        scoreList.innerHTML = `<li style="text-align:center;color:#aaa;">${noScoresText}</li>`;
    } else {
        for (let s of scores) {
            const li = document.createElement('li');
            li.textContent = `🏆 ${s}`;
            scoreList.appendChild(li);
        }
    }
}
function clearScores() {
    localStorage.removeItem('buenosMalosScores');
    loadScores();
}

// ============================================================
//  INICIALIZACIÓN
// ============================================================
async function init() {
    await loadImages();
    await sound.loadAll();

    const savedLang = localStorage.getItem('gameLang') || 'es';
    setLanguage(savedLang);

    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        if (e.key === ' ' || e.key === 'Space') e.preventDefault();

        if (e.key === '1') spawnGroup('guerrero', 10);
        if (e.key === '2') spawnGroup('arquero', 5);
        if (e.key === '3') spawnGroup('maga', 5);
        if (e.key === '4') spawnGroup('jinete', 5);

        if (e.key === '5') {
            if (gameRunning && !gameOverFlag && !victoryScreen.classList.contains('hidden') === false) {
                if (!surrenderConfirm.classList.contains('hidden')) return;
                wasPausedBeforeSurrender = paused;
                surrenderConfirm.classList.remove('hidden');
                // Pausar sin mostrar mensaje
                paused = true;
                document.getElementById('pauseMsg').style.display = 'none';
            }
        }
        if (e.key === 'p' || e.key === 'P') {
            if (gameRunning && !gameOverFlag && !victoryScreen.classList.contains('hidden') === false) {
                if (!surrenderConfirm.classList.contains('hidden')) return;
                paused = !paused;
                document.getElementById('pauseMsg').style.display = paused ? 'block' : 'none';
            }
        }
    });
    document.addEventListener('keyup', (e) => { keys[e.key] = false; });

    document.getElementById('langEs').addEventListener('click', () => setLanguage('es'));
    document.getElementById('langEn').addEventListener('click', () => setLanguage('en'));

    document.getElementById('playBtn').addEventListener('click', () => {
        sound.play('button');
        fullReset();
        marshal = new Marshal(W()*0.4, H()*0.6);
        marshal.hp = 2000;
        loadLevel(1);
        sound.playMusic();
        updateUI();
    });

    document.getElementById('instructionsBtn').addEventListener('click', () => {
        sound.play('button');
        mainMenu.classList.add('hidden');
        instructionsScreen.classList.remove('hidden');
    });
    document.getElementById('backFromInstructions').addEventListener('click', () => {
        sound.play('button');
        instructionsScreen.classList.add('hidden');
        mainMenu.classList.remove('hidden');
    });

    document.getElementById('scoresBtn').addEventListener('click', () => {
        sound.play('button');
        mainMenu.classList.add('hidden');
        scoresScreen.classList.remove('hidden');
        loadScores();
    });
    document.getElementById('backFromScores').addEventListener('click', () => {
        sound.play('button');
        scoresScreen.classList.add('hidden');
        mainMenu.classList.remove('hidden');
    });
    document.getElementById('clearScoresBtn').addEventListener('click', () => {
        sound.play('button');
        clearScores();
    });

    document.getElementById('restartBtn').addEventListener('click', () => {
        sound.play('button');
        fullReset();
        marshal = new Marshal(W()*0.4, H()*0.6);
        marshal.hp = 2000;
        loadLevel(1);
        sound.playMusic();
        gameOverScreen.classList.add('hidden');
    });
    document.getElementById('winRestartBtn').addEventListener('click', () => {
        sound.play('button');
        fullReset();
        marshal = new Marshal(W()*0.4, H()*0.6);
        marshal.hp = 2000;
        loadLevel(1);
        sound.playMusic();
        victoryScreen.classList.add('hidden');
    });
    document.getElementById('menuBtn').addEventListener('click', () => {
        sound.play('button');
        gameOverScreen.classList.add('hidden');
        mainMenu.classList.remove('hidden');
        sound.stopMusic();
    });
    document.getElementById('winMenuBtn').addEventListener('click', () => {
        sound.play('button');
        victoryScreen.classList.add('hidden');
        mainMenu.classList.remove('hidden');
        sound.stopMusic();
    });

    let wasPausedBeforeSurrender = false;

    document.getElementById('surrenderYes').addEventListener('click', () => {
        sound.play('button');
        surrenderConfirm.classList.add('hidden');
        if (gameRunning) gameOver();
    });
    document.getElementById('surrenderNo').addEventListener('click', () => {
        sound.play('button');
        surrenderConfirm.classList.add('hidden');
        paused = wasPausedBeforeSurrender;
        document.getElementById('pauseMsg').style.display = paused ? 'block' : 'none';
    });

    window.addEventListener('resize', resizeCanvas);

    function loop() {
        update();
        draw();
        requestAnimationFrame(loop);
    }
    loop();

    console.log('✅ Juego inicializado');
}

init();