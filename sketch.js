let ancho_canvas = 800;
let largo_canvas = 800;
let listaObstaculos = [];

let juego_terminado = false;

let jugador = {
  puntuacion: 0,
  vidas: 3,
  largo: 100,
  ancho: 15,
  x: 350,
  y: 700
};

let pelota = {
  x: jugador.x + 50,
  y: jugador.y - 15,
  tamano: 30,
  velocidadX: 0,
  velocidadY: 0,
  direccionX: 0,
  direccionY: 0
}
pelota.radio = pelota.tamano / 2;

let obstaculoNivelDos = {
  largo: 50,
  ancho: 20,
  colorFondo: "red",
  vida: 3,
  x: 0,
  y: 0
};

let obstaculoNivelTres = {
  largo: 50,
  ancho: 20,
  colorFondo: "#FFD350",
  vida: 10,
  x: 0,
  y: 0
};

function setup() {
  createCanvas(ancho_canvas, largo_canvas);
  
  llenar_bloques_nivel_1()
  
}

function draw() {
  background("black");
  textSize(20);
  textAlign(LEFT, BASELINE);
  text('Puntuación: ' + jugador.puntuacion, 50, 50);
  
  for (let i = listaObstaculos.length - 1; i >= 0; i--){ 
    fill(listaObstaculos[i].colorFondo);
    rect(listaObstaculos[i].x, listaObstaculos[i].y, listaObstaculos[i].largo,   listaObstaculos[i].ancho);
  }
  
  fill("white"); 
  rect(jugador.x,jugador.y,jugador.largo,jugador.ancho);
  circle(pelota.x+=pelota.velocidadX*pelota.direccionX, pelota.y+=pelota.velocidadY*pelota.direccionY, pelota.tamano);
  
  //CONTROLA MOVIMIENTO DEL JUGADOR 
  if(keyIsDown(LEFT_ARROW)  && jugador.x > 0) {
    jugador.x -= 3;
  }
  if(keyIsDown(RIGHT_ARROW)  && (jugador.x + jugador.largo) < 800) {
    jugador.x += 3;
  }
  
  //VALIDA COLISION CON EL CANVAS
  
  if(pelota.y + pelota.radio >= largo_canvas){
    pelota.direccionY = -pelota.direccionY;
  }
  if(pelota.y <= 0){
    pelota.direccionY = -pelota.direccionY;
  }
  if(pelota.x + pelota.radio >= ancho_canvas){
    pelota.direccionX = -pelota.direccionX;
  }
  if(pelota.x <= 0 ){
    pelota.direccionX = -pelota.direccionX;
  }
  
  //VALIDA COLISION CON EL JUGADOR
  if(pelota.x - pelota.radio <= jugador.x + jugador.largo && 
    pelota.x > jugador.x &&
    pelota.y >= jugador.y &&
    pelota.y <= jugador.y + jugador.ancho){
    pelota.direccionY = -pelota.direccionY;
  }
  
  //VALIDA SI EL USUARIO PIERDE UNA VIDA
  if(pelota.y > jugador.y + jugador.ancho){
    
    //SE REINICIA LA POSICION Y LOS VALORES
    pelota.x = jugador.x + 50,
    pelota.y = jugador.y - 15,
    pelota.velocidadX = 0;
    pelota.velocidadY = 0; 
    pelota.direccionX = 0;
    pelota.direccionY = 0;
    jugador.vidas--;
    console.log(jugador.vidas)
  }
  
  //VALIDAR DETECCIÓN DE PELOTA CON OBSTÁCULOS
  for(let i = 0; i < listaObstaculos.length; i++) {
    if(pelota.x - pelota.radio <= listaObstaculos[i].x + listaObstaculos[i].largo && 
      pelota.x > listaObstaculos[i].x &&
      pelota.y >= listaObstaculos[i].y &&
      pelota.y <= listaObstaculos[i].y + listaObstaculos[i].ancho){
      pelota.direccionY = -pelota.direccionY; //Si colisiona, rebota en la direcciom opuesta
      listaObstaculos[i].vida--
      if(listaObstaculos[i].vida == 0){
        jugador.puntuacion += listaObstaculos[i].valorPuntos;
        listaObstaculos.splice(i, 1);
      }
    }
  }
  
  //VALIDAR SI EL JUEGO TERMINA EN CASO DE QUE YA NO QUEDEN VIDAS
  
  if(jugador.vidas == 0){
    textSize(32);
    fill("white");
    background("black"); 
    textAlign(CENTER, CENTER);
    text("¡TE HAS QUEDADO SIN VIDAS!", ancho_canvas / 2, largo_canvas / 2 - 30);
    textSize(22);
    text("Presiona Enter para volver a jugar", ancho_canvas / 2, largo_canvas / 2 + 20);
    noLoop(); 
    juego_terminado = true;
    
  }
}


//ACTIVAR MOVIMIENTO DE LA PELOTA CON LA TECLA ESPACIO
function keyPressed() {
  if (keyCode === 32) {
    pelota.velocidadX = 3;
    pelota.velocidadY = 3; 
    pelota.direccionX = 1;
    pelota.direccionY = -1;
  }
  if (keyCode === 13 && juego_terminado) {
    reiniciar_juego();
  }
}

function llenar_bloques_nivel_1() {
  /*ESTE FOR SIRVE PARA LLENAR LA LISTA DE OBSTACULOS EN UN INICIO,
  SE IRA MODIFICANDO (CON UN SWITCH PROBABLEMENTE) DE ACUERDO AL NIVEL EN EL QUE ESTE EL USUARIO*/
  for (let i = 100; i <= 140; i+=20){ 
    for (let k = 150; k < 650; k+=50){
      let obstaculoNivelUno = {
        largo: 50,
        ancho: 20,
        valorPuntos: 10,
        colorFondo: "green",
        vida: 1,
        x: k,
        y: i
      };
      listaObstaculos.push(obstaculoNivelUno);
    }
  }
}

function reiniciar_juego() {
  //Reiniciar variables y posicion del jugador
  jugador.puntuacion = 0;
  jugador.vidas = 3;
  jugador.x = 350;
  jugador.y = 700;
  
  //Reiniciar variables y posicion de la pelota
  pelota.x = jugador.x + 50;
  pelota.y = jugador.y - 15;
  pelota.velocidadX = 0;
  pelota.velocidadY = 0;
  pelota.direccionX = 0;
  pelota.direccionY = 0;
  
  llenar_bloques_nivel_1();
    
  //Volver a iniciar el ciclo
  loop();
  juego_terminado = false;
}