const canvas_earth = document.getElementById('gifCanvas_earth');
const ctx = canvas_earth.getContext('2d');
const frames1 = [];
const frames2 = [];
const totalFrames1 = 87; // 第一帧序列的总帧数
const startFrame2 = 45; // 第二帧序列开始的帧号
const endFrame2 = 73; // 第二帧序列结束的帧号
const totalFrames2 = endFrame2 - startFrame2 + 1; // 第二帧序列的总帧数

// 加载第一帧序列
for (let i = 0; i < totalFrames1; i++) {
    const img = new Image();
    img.src = `frames/2/2/${i}.png`; 
    frames1.push(img);
}

// 加载第二帧序列
for (let i = startFrame2; i <= endFrame2; i++) {
    const img = new Image();
    img.src = `frames/5/5/${i}.png`; 
    frames2.push(img);
}

let currentFrame = 0;
let positionX = 0;
let positionY = 0;
let canChangeAnime = false;
let stopstatus = false;
let currentFrame2 = 0; // 用于第二帧序列的动画

function drawFrame(frameIndex) {
    ctx.clearRect(0, 0, canvas_earth.width, canvas_earth.height);

    // 绘制第一帧序列
    ctx.drawImage(frames1[frameIndex], 0, 0, canvas_earth.width, canvas_earth.height);

    // 绘制第二帧序列，使用 currentFrame2
    ctx.drawImage(frames2[currentFrame2], 0, 0, canvas_earth.width, canvas_earth.height);
}

function updateCanvasPosition(scrollPositionY) {
    let transformValue = 'translate(0%, 0%)';
    if(scrollPositionY>=300){
        transformValue='translate(-28%,43%) scale(0.4)'
    }
    if(scrollPositionY >= 800){
        canChangeAnime=true;
    }
    if (scrollPositionY >= 1000) {
        transformValue = 'translate(18%,73%)  scale(0.6)';
    }
    if (scrollPositionY >= 1500) {
        transformValue = 'translate(-28%, 103%)  scale(0.4)';
    }
    
    canvas_earth.style.transform = transformValue;
}

function isElementInCenter(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error('Element not found');
        return false;
    }

    const rect = element.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const elementCenterY = rect.top + rect.height / 2;
    const tolerance = 200;

    return Math.abs(elementCenterY - windowHeight / 2) < tolerance;
}


let frameDelay = 8; // 控制动画速度，值越大动画越慢
let frameCounter = 0;

function loopSecondAnimation() {
    // 控制帧数更新的速度
    frameCounter++;
    if (frameCounter >= frameDelay) {
        currentFrame2 = (currentFrame2 + 1) % totalFrames2;
        frameCounter = 0; // 重置计数器
    }

    drawFrame(currentFrame);
    requestAnimationFrame(loopSecondAnimation);
}
// 启动第二帧序列的循环动画
loopSecondAnimation();

window.addEventListener('scroll', function() {
    let scrollPositionY = window.scrollY || window.pageYOffset;
    updateCanvasPosition(scrollPositionY);
});

window.addEventListener('wheel', (event) => {
    event.preventDefault();

    if (isElementInCenter('gifCanvas_earth') && !stopstatus) {
        canChangeAnime = true;
    }

    if (canChangeAnime) {
        let speedLevel = 5;
        let moveSpeedX = 30;

        if (event.deltaY < 0) {
            currentFrame = (currentFrame - speedLevel >= 0) ? Math.floor(currentFrame - speedLevel) : 0;
        }
        if (event.deltaY > 0) {
            currentFrame = (currentFrame + speedLevel < totalFrames1) ? Math.floor(currentFrame + speedLevel) : totalFrames1 - 1;
        }

        // Apply changes
        drawFrame(currentFrame);

        // Update canvas position based on new scroll position
        let scrollPositionY = window.scrollY || window.pageYOffset;
        updateCanvasPosition(scrollPositionY);

        // Update the canvas position based on animation
        canvas_earth.style.transform = `translate(${positionX}px, ${positionY}px)`;
    }
});
