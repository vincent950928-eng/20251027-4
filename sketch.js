/*
By Okazz
*/
let colors = ['#e6302b', '#fbd400', '#36ad63', '#2B50AA', '#232323', '#f654a9'];
let ctx;
let centerX, centerY;
let bubbles = [];
let menuVisible = false; // 新增選單狀態變數

// 新增 iframe 相關變數
let iframeEl = null;
let closeBtn = null;

function setup() {
    createCanvas(900, 900);
    rectMode(CENTER);
    colorMode(HSB, 360, 100, 100, 100);
    ctx = drawingContext;
    centerX = width / 2;
    centerY = height / 2;
    let area = width * 0.85;
    let cellCount = 8;
    let cellSize = area / cellCount;
    for (let i = 0; i < cellCount; i++) {
        for (let j = 0; j < cellCount; j++) {
            let x = cellSize * i + (cellSize / 2) + (width - area) / 2;
            let y = cellSize * j + (cellSize / 2) + (height - area) / 2;
            bubbles.push(new Bubble(x, y + cellSize * 0.2, cellSize * 0.4));
        }
    }

    // 建立隱藏的 iframe（寬70% 高85%，置中顯示）
    iframeEl = document.createElement('iframe');
    iframeEl.id = 'contentIframe';
    iframeEl.style.position = 'fixed';
    iframeEl.style.width = '70vw';
    iframeEl.style.height = '85vh';
    iframeEl.style.left = '15vw';      // 置中（左右各留 15vw）
    iframeEl.style.top = '7.5vh';     // 垂直置中（上下各留 7.5vh）
    iframeEl.style.border = '1px solid rgba(0,0,0,0.1)';
    iframeEl.style.borderRadius = '6px';
    iframeEl.style.display = 'none';
    iframeEl.style.zIndex = '1000';
    iframeEl.style.background = '#fff';
    document.body.appendChild(iframeEl);

    // 建立關閉按鈕（顯示於 iframe 右上角）
    closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.position = 'fixed';
    closeBtn.style.top = 'calc(7.5vh + 8px)';               // 與 iframe top 對齊
    closeBtn.style.right = 'calc(15vw + 8px)';              // 與 iframe 右邊緣距離 8px
    closeBtn.style.zIndex = '1001';
    closeBtn.style.display = 'none';
    closeBtn.style.padding = '6px 10px';
    closeBtn.style.fontSize = '16px';
    closeBtn.style.borderRadius = '4px';
    closeBtn.style.border = 'none';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.background = 'rgba(0,0,0,0.6)';
    closeBtn.style.color = '#fff';
    document.body.appendChild(closeBtn);
    closeBtn.addEventListener('click', hideIframe);
}

function draw() {
    background(255);
    for (let b of bubbles) {
        b.run();
    }
    drawMenu(); // 繪製選單
}

// 新增選單相關函數
function drawMenu() {
    if (menuVisible) {
        // 選單背景
        fill(0, 0, 0, 80);
        noStroke();
        rect(100, height/2, 200, height);
        
        // 選單選項
        textAlign(CENTER);
        textSize(20);
        fill(255);
        
        let menuItems = ['第一單元作品', '第一單元講義', '測驗系統', '回到首頁'];
        let spacing = 60;
        
        for(let i = 0; i < menuItems.length; i++) {
            let y = height/3 + (i * spacing);
            text(menuItems[i], 100, y);
            
            // 滑鼠懸停效果
            if (mouseX < 200 && mouseY > y-20 && mouseY < y+20) {
                fill(200);
                text(menuItems[i], 100, y);
                fill(255);
            }
        }
    }
    
    // 選單按鈕
    fill(0);
    rect(30, 30, 40, 40);
}

// 滑鼠點擊事件
function mousePressed() {
    // 檢查是否點擊選單按鈕
    if (mouseX < 50 && mouseY < 50) {
        menuVisible = !menuVisible;
        return;
    }
    
    // 檢查選單項目點擊
    if (menuVisible && mouseX < 200) {
        let y = mouseY;
        let spacing = 60;
        let startY = height/3;
        
        if (y > startY-20 && y < startY+20) {
            // 第一單元作品：顯示 iframe 並載入指定網址
            showIframe('https://vincent950928-eng.github.io/20251020/');
        } else if (y > startY+spacing-20 && y < startY+spacing+20) {
            // 第一單元講義：以 iframe 顯示 HackMD
            showIframe('https://hackmd.io/@oFfjbdXYRC-RDOnVZOnbpw/S1NgwmCsee');
        } else if (y > startY+spacing*2-20 && y < startY+spacing*2+20) {
            window.location.href = "測驗系統URL";
        } else if (y > startY+spacing*3-20 && y < startY+spacing*3+20) {
            window.location.href = "首頁URL";
        }
    }
}

// 新增：顯示 / 隱藏 iframe 的函式
function showIframe(url) {
    if (iframeEl) {
        iframeEl.src = url;
        iframeEl.style.display = 'block';
    }
    if (closeBtn) {
        closeBtn.style.display = 'block';
    }
    // 隱藏選單
    menuVisible = false;
}

function hideIframe() {
    if (iframeEl) {
        iframeEl.style.display = 'none';
        iframeEl.src = 'about:blank';
    }
    if (closeBtn) {
        closeBtn.style.display = 'none';
    }
}

function aetherLink(x1, y1, d1, x2, y2, d2, dst) {
    let r = dst / 2;

    let r1 = d1 / 2;
    let r2 = d2 / 2;
    let R1 = r1 + r;
    let R2 = r2 + r;

    let dx = x2 - x1;
    let dy = y2 - y1;
    let d = sqrt(dx * dx + dy * dy);

    if (d > R1 + R2) {
        return;
    }

    let dirX = dx / d;
    let dirY = dy / d;

    let a = (R1 * R1 - R2 * R2 + d * d) / (2 * d);
    let underRoot = R1 * R1 - a * a;
    if (underRoot < 0) return;
    let h = sqrt(underRoot);


    let midX = x1 + dirX * a;
    let midY = y1 + dirY * a;

    let perpX = -dirY * h;
    let perpY = dirX * h;

    let cx1 = midX + perpX;
    let cy1 = midY + perpY;

    let cx2 = midX - perpX;
    let cy2 = midY - perpY;

    if (dist(cx1, cy1, cx2, cy2) < r * 2) {
        return;
    }

    let ang1 = atan2(y1 - cy1, x1 - cx1);
    let ang2 = atan2(y2 - cy1, x2 - cx1);
    let ang3 = atan2(y2 - cy2, x2 - cx2);
    let ang4 = atan2(y1 - cy2, x1 - cx2);

    if (ang2 < ang1) {
        ang2 += TAU;
    }
    beginShape();
    for (let i = ang1; i < ang2; i += TAU / 180) {
        vertex(cx1 + r * cos(i), cy1 + r * sin(i));
    }

    if (ang4 < ang3) {
        ang4 += TAU;
    }
    for (let i = ang3; i < ang4; i += TAU / 180) {
        vertex(cx2 + r * cos(i), cy2 + r * sin(i));
    }
    endShape();
}

function easeOutQuint(x) {
    return 1 - Math.pow(1 - x, 5);
}

class Bubble {
    constructor(x, y, d) {
        this.x = x;
        this.y = y;
        this.d = d;
        this.cage = [];
        this.dst = this.d / 2;
        this.clr = random(colors);
    }

    show() {
        push();
        translate(this.x, this.y);
        noStroke();
        fill(this.clr);
        circle(0, 0, this.d);


        for (let c of this.cage) {
            c.run();

        }

        for (let c of this.cage) {
            aetherLink(c.x, c.y, c.d, 0, 0, this.d, this.dst);
        }

        for (let i = 0; i < this.cage.length; i++) {
            if (this.cage[i].isDead) {
                this.cage.splice(i, 1);
            }
        }

        if (random() < 0.02) {
            this.addWisp();
        }
        pop();

    }

    addWisp() {
        this.cage.push(new Wisp(0, 0, this.d * random(0.25, 0.75), this.d * random(0.75, 1.25)));
    }

    run() {
        this.show();
    }
}

class Wisp {
    constructor(x, y, d, r) {
        this.x = x;
        this.y = y;
        this.d = d;
        this.timer = 0;
        this.endTime = int(random(60, 200));
        this.ang = random(TAU);
        this.r = r;
        this.originX = this.x;
        this.originY = this.y;
        this.targetX = this.x + this.r * cos(this.ang);
        this.targetY = this.y + this.r * sin(this.ang);
        this.originD = d;
        this.isDead = false;
    }

    show() {
        if (this.isDead == false) {
            circle(this.x, this.y, this.d);
        }
    }

    move() {
        this.timer++;
        if (0 < this.timer && this.timer < this.endTime) {
            let n = norm(this.timer, 0, this.endTime);
            this.x = lerp(this.originX, this.targetX, easeOutQuint(n));
            this.y = lerp(this.originY, this.targetY, easeOutQuint(n));
            this.d = lerp(this.originD, 0, n);
        }
        if (this.timer > this.endTime) {
            this.isDead = true;
        }
    }

    run() {
        this.show();
        this.move();
    }
}