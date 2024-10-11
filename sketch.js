let x;
let y;
let speed = 2;
let r;
let img, img1, img2, img3, treasureImg;
let obstacleImgs = [];
let enemyImgs = []; // Array para armazenar as imagens dos inimigos
let numObstacles = 18;
let obstacles = [];
let enemies = []; // Array para armazenar os inimigos
let showDialog = false;
let canInteract = false;
let showInventory = false;
let inventory = { "Picareta": 0, "Machado": 0, "Espada": 0, "Pedras": 0, "Madeira": 0, "Frutas": 0 };
let selectedItem = 0;
let obstacleW = 100;
let obstacleH = 100;
let treasure;
let interactingWithObstacle = null;

let buttonInteract;
let buttonInventory;
let buttonPicareta, buttonMachado, buttonEspada, buttonSair;

let moveLeft = true;
let moveRight = true;
let moveUp = true;
let moveDown = true;

function preload() {
  img = loadImage('assets/images (1).png');
  img1 = loadImage('assets/images3.png');
  img2 = loadImage('assets/images2.png');
  img3 = loadImage('assets/images.png');
  treasureImg = loadImage('assets/treasure.png');

  obstacleImgs.push(loadImage('assets/obstacle1.png'));
  obstacleImgs.push(loadImage('assets/obstacle2.png'));
  obstacleImgs.push(loadImage('assets/obstacle3.png'));
  
  // Adicionando imagens para os inimigos
  enemyImgs.push(loadImage('assets/enemy1.png'));
  enemyImgs.push(loadImage('assets/enemy2.png'));
}

function setup() {
  createCanvas(1340, 748);
  x = width / 2;
  y = height / 2;

  r = img;

  for (let i = 0; i < numObstacles; i++) {
    let obstacleX;
    let obstacleY;
    let validPosition = false;

    while (!validPosition) {
      obstacleX = random(0, width - obstacleW);
      obstacleY = random(0, height - obstacleH);

      if (!checkCollisionRect(x, y, 50, 50, obstacleX, obstacleY, obstacleW, obstacleH)) {
        validPosition = true;
      }
    }

    let randomObstacleImg = random(obstacleImgs);
    let obstacle = {
      x: obstacleX,
      y: obstacleY,
      img: randomObstacleImg,
      size: { width: obstacleW, height: obstacleH },
      interacted: false,
      hitboxType: 'rect',
    };

    if (randomObstacleImg === obstacleImgs[2]) {
      obstacle.size = { width: obstacleW / 2, height: obstacleH / 2 };
      obstacle.hitboxType = 'circle';
    } else if (randomObstacleImg === obstacleImgs[1]) {
      obstacle.hitboxType = 'circle';
    } else if (randomObstacleImg === obstacleImgs[0]) {
      obstacle.size = { width: obstacleW / 2, height: obstacleH / 2 };
      obstacle.hitboxType = 'rect';
    }

    obstacles.push(obstacle);
  }

  // Criando o tesouro
  let treasureX;
  let treasureY;
  let validTreasurePosition = false;

  while (!validTreasurePosition) {
    treasureX = random(0, width - 50);
    treasureY = random(0, height - 50);

    if (!checkCollisionRect(treasureX, treasureY, 50, 50, x, y, 50, 50)) {
      validTreasurePosition = true;
    }
  }

  treasure = {
    x: treasureX,
    y: treasureY,
    img: treasureImg,
    interacted: false
  };

  // Criando inimigos
  for (let i = 0; i < 5; i++) {
    let enemyX = random(0, width - 50);
    let enemyY = random(0, height - 50);
    let randomEnemyImg = random(enemyImgs);
    let enemy = {
      x: enemyX,
      y: enemyY,
      img: randomEnemyImg,
      speed: 1 // Velocidade do inimigo
    };
    enemies.push(enemy);
  }

  buttonInteract = createButton('Interagir');
  buttonInteract.position(10, 10);
  buttonInteract.mousePressed(interactWithObject);

  buttonInventory = createButton('Inventário');
  buttonInventory.position(100, 10);
  buttonInventory.mousePressed(toggleInventory);

  buttonSair = createButton('Sair');
  buttonSair.position(width / 2 + 50, height / 2 - 10);
  buttonSair.hide();
}


function draw() {
  background('green');
  x = constrain(x, 0, width - 50);  // Limita o movimento horizontal
  y = constrain(y, 0, height - 50); // Limita o movimento vertical

  if (!showInventory) {
    image(r, x, y, 45, 50);

    for (let i = 0; i < obstacles.length; i++) {
      let obs = obstacles[i];
      image(obs.img, obs.x, obs.y, obs.size.width, obs.size.height);
    }

    image(treasure.img, treasure.x, treasure.y, 50, 50);

    // Lógica para os inimigos perseguirem o jogador
    for (let i = 0; i < enemies.length; i++) {
      let enemy = enemies[i];
      let dirX = x - enemy.x;
      let dirY = y - enemy.y;
      let distance = dist(x, y, enemy.x, enemy.y);

      // Se o inimigo estiver perto do jogador, ele se move na direção do jogador
      if (distance < 200) {
        enemy.x += (dirX / distance) * enemy.speed;
        enemy.y += (dirY / distance) * enemy.speed;
      }

      // Verificação de colisão entre o jogador e o inimigo
      if (checkCollisionRect(x, y, 50, 50, enemy.x, enemy.y, 50, 50)) {
        // Aqui você pode adicionar a lógica do que acontece quando o jogador colide com o inimigo
        console.log("Colidiu com o inimigo!");
        gameOver();
      }
      function gameOver() {
        // Exibir tela de game over
        background(0);
        fill(255);
        textSize(48);
        textAlign(CENTER);
        text("GAME OVER", width / 2, height / 2);
        textSize(24);
        text(" Reinicie a pagina ", width / 2, height / 2 + 50);
        }
    

    

      image(enemy.img, enemy.x, enemy.y, 50, 50); // Desenha o inimigo
    }

    if (checkCollisionRect(x, y, 50, 50, treasure.x, treasure.y, 50, 50) && !treasure.interacted) {
      canInteract = true;
      interactingWithObstacle = treasure;
    } else {
      canInteract = false;
      interactingWithObstacle = null;
    }
  }
  moveLeft = moveRight = moveUp = moveDown = true;

  for (let i = 0; i < obstacles.length; i++) {
    let obs = obstacles[i];

    if (obs.hitboxType === 'rect') {
      if (checkCollisionRect(x - speed, y, 50, 50, obs.x, obs.y, obs.size.width, obs.size.height)) {
        moveLeft = false;
        canInteract = true;
        interactingWithObstacle = obs;
      }
      if (checkCollisionRect(x + speed, y, 50, 50, obs.x, obs.y, obs.size.width, obs.size.height)) {
        moveRight = false;
        canInteract = true;
        interactingWithObstacle = obs;
      }
      if (checkCollisionRect(x, y - speed, 50, 50, obs.x, obs.y, obs.size.width, obs.size.height)) {
        moveUp = false;
        canInteract = true;
        interactingWithObstacle = obs;
      }
      if (checkCollisionRect(x, y + speed, 50, 50, obs.x, obs.y, obs.size.width, obs.size.height)) {
        moveDown = false;
        canInteract = true;
        interactingWithObstacle = obs;
      }
    } else if (obs.hitboxType === 'circle') {
      if (checkCollisionCircle(x - speed, y, 25, obs.x + obs.size.width / 2, obs.y + obs.size.height / 2, obs.size.width / 2)) {
        moveLeft = false;
        canInteract = true;
        interactingWithObstacle = obs;
      }
      if (checkCollisionCircle(x + speed, y, 25, obs.x + obs.size.width / 2, obs.y + obs.size.height / 2, obs.size.width / 2)) {
        moveRight = false;
        canInteract = true;
        interactingWithObstacle = obs;
      }
      if (checkCollisionCircle(x, y - speed, 25, obs.x + obs.size.width / 2, obs.y + obs.size.height / 2, obs.size.width / 2)) {
        moveUp = false;
        canInteract = true;
        interactingWithObstacle = obs;
      }
      if (checkCollisionCircle(x, y + speed, 25, obs.x + obs.size.width / 2, obs.y + obs.size.height / 2, obs.size.width / 2)) {
        moveDown = false;
        canInteract = true;
        interactingWithObstacle = obs;
      }
    }
  }

  // Movimentação do jogador
  if (keyIsDown(LEFT_ARROW) && moveLeft) {
    x -= speed;
    r = img2;
  } else if (keyIsDown(RIGHT_ARROW) && moveRight) {
    x += speed;
    r = img1;
  } else if (keyIsDown(UP_ARROW) && moveUp) {
    y -= speed;
    r = img3;
  } else if (keyIsDown(DOWN_ARROW) && moveDown) {
    y += speed;
    r = img;
  } else {
    r = img;
  }

  if (canInteract) {
    showDialog = true;
  } else {
    showDialog = false;
  }

  if (showDialog) {
    buttonInteract.show();
  } else {
    buttonInteract.hide();
  }

  // Desenhar o inventário
  if (showInventory) {
    fill(225);
    rect(width / 2 - 90, height / 2 - 160, 180, 300);
    textSize(20);
    fill('black');
    text('Inventário:', width / 2 - 80, height / 2 - 135);
    text('Picareta: ' + inventory["Picareta"], width / 2 - 80, height / 2 - 70);
    text('Machado: ' + inventory["Machado"], width / 2 - 80, height / 2 - 40);
    text('Espada: ' + inventory["Espada"], width / 2 - 80, height / 2 - 10);
    text('Pedras: ' + inventory["Pedras"], width / 2 - 80, height / 2 + 30);
    text('Madeira: ' + inventory["Madeira"], width / 2 - 80, height / 2 + 60);
    text('Frutas: ' + inventory["Frutas"], width / 2 - 80, height / 2 + 90);
  }
}

function checkCollisionRect(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

function checkCollisionCircle(x1, y1, r1, x2, y2, r2) {
  let distance = dist(x1, y1, x2, y2);
  return distance < r1 + r2;
}

function toggleInventory() {
  showInventory = !showInventory;
}

function useItem(item) {
  alert(`Você usou: ${item}`);
}

function interactWithObject() {
  if (canInteract) {
    if (interactingWithObstacle === treasure) {
      alert('Você ganhou 1 machado, 1 picareta, 1 espada com 300 de duração cada!');
      inventory["Machado"] += 300;
      inventory["Espada"] += 300;
      inventory["Picareta"] += 300;
      treasure.interacted = true;
      canInteract = false;
    } else {
      for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        if (interactingWithObstacle === obs && obs.img === obstacleImgs[1]) {
          if (inventory["Machado"] > 0) {
            inventory["Madeira"] += 50;
            inventory["Machado"] -= 1;
            obs.interacted = true;
            alert('Você cortou a árvore e coletou 50 madeiras!');
          } else {
            alert('Você precisa de um machado para cortar a árvore!');
          }
          canInteract = false;
          toggleInventory(); // Abre o inventário para usar o machado
          break;
        }
      }
    } 
    // Lógica para coletar pedras
    for (let i = 0; i < obstacles.length; i++) {
      let obs = obstacles[i];
      if (interactingWithObstacle === obs && obs.img === obstacleImgs[0]) {
        if (inventory["Picareta"] > 0) {
          inventory["Pedras"] += 50; // Corrigido para "Pedras"
          inventory["Picareta"] -= 1;
          obs.interacted = true;
          alert('Você cortou a árvore e coletou 50 pedras!');
        } else {
          alert('Você precisa de uma picareta para isso!');
        }
        canInteract = false;
        toggleInventory(); // Abre o inventário para usar a picareta
        break;
      }
    } 
    // Lógica para coletar frutas
    for (let i = 0; i < obstacles.length; i++) {
      let obs = obstacles[i];
      if (interactingWithObstacle === obs && obs.img === obstacleImgs[2]) {
        inventory["Frutas"] += 50;
        obs.interacted = true;
        alert('Você cortou o arbusto e coletou 50 frutas!');
        canInteract = false;
        toggleInventory(); // Abre o inventário para usar o machado
        break;
      }
    }
  }
}

