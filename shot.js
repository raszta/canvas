document.addEventListener('DOMContentLoaded', function () {

    const canvas = document.getElementById('game');
    const c = canvas.getContext('2d');
    //zmienne do canvasu wielkosc
    const innerWidth = window.innerWidth - 20;
    const  innerHeight = window.innerHeight - 20;
        
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    //klawisze z wartoscia numeryczna
    const map = {
        37: false, //left move
        38: false, //top move
        39: false, //right move
        40: false, //down move
        32: false
    }
    ////////////////////////////////////////////////////TLO////////////////////////////
     const canv= document.getElementById('myCanvas');
     const context = canv.getContext('2d');
    const twoPi = Math.PI * 2;
    const radius = 1;
    let  starsIndex = 0;
    let  stars = [];
    let    centerX = innerWidth / 2,
        centerY = innerHeight / 2,
        focalLength = 150,
        starRadius = null,
        starX = null,
        starY = null,
        numStars = 2000,
        mouse = {},
        starX_dir = 0,
        starY_dir = 0;
//wymiary płótna tla
    canv.width = innerWidth;
    canv.height = innerHeight;
    //zmiana kierunku gwiazd
    window.addEventListener('mousemove', function(e){
        mouse.x = e.x;
        mouse.y = e.y;

        if(mouse.x<centerX){
            starX_dir +=2;
        }else{
            starX_dir += -2;
        }

        if(mouse.y<centerY){
            starY_dir +=2;
        }else{
            starY_dir += -2;
        }
    });
//konstruktor star
    function Star(x,y,z){
        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = radius;
        this.color = "#fff";
        starsIndex++;
        stars[starsIndex] = this;
        this.id = starsIndex;
//funkcja rysujaca gwiazdy
        this.draw = function () {
            context.beginPath();
            context.arc(starX, starY, starRadius, twoPi, false);
            context.fillStyle = this.color;
            context.fill();
            context.closePath();
        }
//update statusu gwiazd
        this.update = function(){
            starX = (this.x - centerX) * (focalLength / this.z);
            starX +=centerX;

            starY = (this.y - centerY) * (focalLength / this.z);
            starY += centerY;

            starRadius = radius * (focalLength/this.z);

            starX += starX_dir;
            starY += starY_dir;

            this.z += -10;

            if(this.z <=0){
                this.z = parseInt(innerWidth);
            }
            this.draw();
        }       
        }
 //tworzenie gwiazd w zadanej ilosci      
        for(let i =0;i<numStars;i++)
       { 
        let x = Math.random() * innerWidth;
        let y = Math.random() * innerHeight;
        let z = Math.random() * innerWidth;
        new Star(x, y, z);
    }

    //event na wcisniecie klawisza
    addEventListener("keydown", function (event) {
        if (event.keyCode in map) {
            map[event.keyCode] = true;

            if (map[37]) {
                player.x += -50;
            } else if (map[38]) {
                player.y += -50;
            } else if (map[39]) {
                player.x += 50;
            } else if (map[40]) {
                player.y += 50;
            }else if(map[32]){
                fire();
            }
        }
    });
    //wyzerowanie wcisnietego klawisza
    addEventListener("keyup", function (event) {
        if (event.keyCode in map) {
            map[event.keyCode] = false;
        }
    });
    //zmienna do czasu autofire
    let lastTime = 0;

    //pociski
    let bulletsArray = [],
        bulletIndex = 0,
        bulletWidth = 10,
        bulletHeight = 20,
        speed = 16,
        bulletLastTime = 0,
        bulletTimer = 300;

    function Bullet(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;

        bulletIndex++;
        bulletsArray[bulletIndex] = this;
        this.id = bulletIndex;

        this.update = function () {//update rysownia kuli
            this.y += -this.speed;
            if (this.y < -this.height) {
                delete this.delete();
            }
            this.draw();
        }

        this.delete = function () {//kasowanie kul
            delete bulletsArray[this.id];
        }

        this.draw = function () {//rysowanie kul
            c.beginPath();
            c.rect(this.x, this.y, this.width, this.height);
            c.fillStyle = "red";
            c.fill();
            c.stroke();
        }
    }
    //funckcja odp za strzelanie
    function fire() {
        let x = (player.x + player.width / 2) - bulletWidth / 2;
        let y = player.y;
        new Bullet(x, y, bulletWidth, bulletHeight, speed);
    }

    //losowanie wizerunku podczas nowej gry
    const images = ["foe.png", "foe1.jpg", "furry.png"];
    function randomImage(arr) {
        let image = arr[Math.floor(Math.random() * arr.length)];
        return image;
    }
    //zmienne do przeciwników
    let enemyArray = [],
        enemyIndex = 0,
        enemyHeight = 100,
        enemyWidth = 100,
        enemyTimer = 1000,
        enemyImg = new Image();
    enemyImg.src = randomImage(images);

    function Enemy(x, y, dx, dy, enemyImg, enemyWidth, enemyHeight, rotation) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.img = enemyImg;
        this.width = enemyWidth;
        this.height = enemyHeight;
        this.rotation = rotation;
        enemyIndex++;
        enemyArray[enemyIndex] = this;
        this.id = enemyIndex;

        if (this.rotation < 0.2) {
            this.dx = -this.dx;
        } else if (this.rotation > 0.7) {
            this.dx = -this.dx;
        } else {
            this.dx = 0;
        }

        this.update = function () {
            this.x += this.dx;
            this.y += this.dy;

            if (this.x + this.width >= innerWidth) {
                this.dx = -this.dx;
            } else if (this.x <= 0) {
                this.dx = Math.abs(this.dx);
            }

            if (this.y > innerHeight + this.height) {
                this.delete();
            }

            this.draw();
        }

        this.delete = function () {
            delete enemyArray[this.id];
        }

        this.draw = function () {
            c.drawImage(this.img, this.x, this.y, this.width, this.height)
        }
    }

    function createEnemy() {
        let x = Math.random() * (innerWidth - enemyWidth);
        let y = -enemyHeight;
        let dx = Math.random() * 5 + 1;
        let dy = Math.random() * 5 + 1;
        let rotation = Math.random();
        new Enemy(x, y, dx, dy, enemyImg, enemyWidth, enemyHeight, rotation);
    }
      
    //zmienne do 2 canvasu, player,score,power
    let player = {};
    const  playerWidth = 150;
    const  playerHeight = 200;
    const   playerImg = new Image();
    let  score = 0;
    playerImg.src = "hero.png"; //zrodlo avatara postaci
    //obiekt player
    player = {
        width: playerWidth,
        height: playerHeight,
        x: innerWidth / 2 - playerWidth / 2,
        y: innerHeight - (playerHeight + 10),
        life: 10,
        draw: function () { //rysowanie avatara hero
            if (this.x <= 0) {
                this.x = 0;
            } else if (this.x >= (innerWidth - this.width)) {
                this.x = innerWidth - this.width;
            }

            if (this.y <= 0) {
                this.y = 0;
            } else if (this.y >= (innerHeight - this.height)) {
                this.y = innerHeight - this.height;
            }

            c.drawImage(playerImg, this.x, this.y, this.width, this.height);
        }
    }    

    function collides(a, b) {
        return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
    }

    function handleCollision() {
        bulletsArray.forEach(function (Bullet) {
            enemyArray.forEach(function (Enemy) {
                if (collides(Bullet, Enemy)) {
                    Bullet.delete();
                    Enemy.delete();
                    score += 10;
                }
            });
        });

        enemyArray.forEach(function (Enemy) {
            if (collides(player, Enemy)) {
                player.life += -5;
                Enemy.delete();
            }
        });
    }

    function animate(currentTime) {
        const animation = requestAnimationFrame(animate);
        c.clearRect(0, 0, innerWidth, innerHeight);

        c.font = '25px roboto';
        c.fillStyle = '#fff';
        c.fillText('SCORE: ' + score, 25, 30);
       
        player.draw();

        if (currentTime >= lastTime + enemyTimer) {
            lastTime = currentTime;
            createEnemy();
        }

        enemyArray.forEach(function (Enemy) {
            Enemy.update();
        });
//autofire
        // if (currentTime >= bulletLastTime + bulletTimer) {
        //     bulletLastTime = currentTime;
        //     fire();
        // }

        bulletsArray.forEach(function (Bullet) {
            Bullet.update();
        });

        handleCollision();

        if (player.life <= 0) {
            player.life ==0;
            cancelAnimationFrame(animation);
            const div = document.createElement('div');
            const body = document.querySelector('body');
            // const btn = document.createElement('button');
            // btn.innerText = "Zagraj jeszcze raz!"
            div.classList.add('added');            
            div.innerText = "You lost!!! \nYour score: " +score;
            body.appendChild(div);
            // div.appendChild(btn);
        }
        c.font = '25px roboto';
        c.fillStyle = '#fff';
        c.fillText('LIFE: ' + player.life, innerWidth - 150, 30);
    }
    //animacja backgroundu
    function animate1(){
        requestAnimationFrame(animate1);
        context.fillStyle = "#000";
        context.fillRect(0, 0, innerWidth, innerHeight);
        for(let i in stars){
            stars[i].update();
        }              
    }
    animate();
    animate1();    
});