let ancho_canvas = 800;
let largo_canvas = 800;
let listaObstaculos = [];
let nivel = 1;
let juego_terminado = false;
let nivel_terminado = true;
let juego_iniciado = false;

let transicion_bandera = true;
let contador_transicion = 0 

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

function setup() {
  createCanvas(ancho_canvas, largo_canvas);
}

function draw() {
  background("black");
  
  if(!juego_iniciado){
    pelota.x = jugador.x + 50
    pelota.y = jugador.y - 15 
  }
  if(nivel_terminado){
    llenar_bloques_nivel();
  }
  
  textSize(15);
  textAlign(LEFT, BASELINE);
  text('Puntuación: ' + jugador.puntuacion, 50, 50);
  text('Vidas restantes: ' + jugador.vidas, 50, 70);
  
  for (let i = listaObstaculos.length - 1; i >= 0; i--){ 
    fill(listaObstaculos[i].colorFondo);
    rect(listaObstaculos[i].x, listaObstaculos[i].y, listaObstaculos[i].largo,   listaObstaculos[i].ancho);
    
    //VALIDAR DETECCIÓN DE PELOTA CON OBSTÁCULOS
    if(pelota.x - pelota.radio <= listaObstaculos[i].x + listaObstaculos[i].largo && 
      pelota.x > listaObstaculos[i].x &&
      pelota.y >= listaObstaculos[i].y &&
      pelota.y <= listaObstaculos[i].y + listaObstaculos[i].ancho){
      pelota.direccionY = -pelota.direccionY; //Si colisiona, rebota en la direcciom opuesta
      if(listaObstaculos[i].vida != 10){
         listaObstaculos[i].vida--
      }
      if(listaObstaculos[i].nivel === 2){
         switch(listaObstaculos[i].vida){
           case 1:
             listaObstaculos[i].colorFondo = "#FFB4AE";
           break;
           case 2:
             listaObstaculos[i].colorFondo = "#F87167";
           break;
         }
      }
      
      if(listaObstaculos[i].vida == 0){
        jugador.puntuacion += listaObstaculos[i].valorPuntos;
        listaObstaculos.splice(i, 1);
        //VALIDA SI SE DESTRUYERON TODOS LOS OBSTACULOS PARA PASAR DE NIVEL
        switch(nivel){
          case 1:
          case 2:
            if(listaObstaculos.length === 0){
               nivel_terminado = true;
               nivel++;
            }
          break;
          case 3:
            if(listaObstaculos.length === 1){
               nivel_terminado = true;
               nivel++;
               console.log("juego terminado")
            }
          break;
        }
      }
    }
  }
  transicion()
  
  fill("white"); 
  rect(jugador.x,jugador.y,jugador.largo,jugador.ancho);
  circle(pelota.x+=pelota.velocidadX*pelota.direccionX, pelota.y+=pelota.velocidadY*pelota.direccionY, pelota.tamano);
  
  //CONTROLA MOVIMIENTO DEL JUGADOR 
  if(keyIsDown(LEFT_ARROW)  && jugador.x > 0) {
    jugador.x -= 5;
  }
  if(keyIsDown(RIGHT_ARROW)  && (jugador.x + jugador.largo) < 800) {
    jugador.x += 5;
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
    pelota.y + pelota.radio >= jugador.y &&
    pelota.y + pelota.radio <= jugador.y){
    pelota.direccionY = -pelota.direccionY;
  }
  
  //VALIDA SI EL USUARIO PIERDE UNA VIDA
  if(pelota.y > jugador.y + jugador.ancho){
    //SE REINICIA LA POSICION Y LOS VALORES
    pelota.x = jugador.x + 50,
    pelota.y = jugador.y - 15,
    pelota.direccionX = 0;
    pelota.direccionY = 0;
    juego_iniciado = false;
    jugador.vidas--;
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
    juego_iniciado = true;
    pelota.direccionX = 1;
    pelota.direccionY = -1;
  }
  if (keyCode === 13 && juego_terminado) {
    reiniciar_juego();
  }

}

function llenar_bloques_nivel() {
  switch(nivel){
    case 1:
      for (let i = -80; i <= -20; i+=20){ 
        for (let k = 150; k < 650; k+=50){
          let obstaculoNivelUno = {
            largo: 50,
            ancho: 20,
            valorPuntos: 10,
            colorFondo: "green",
            vida: 1,
            x: k,
            y: i,
            nivel: 1
          };
        listaObstaculos.push(obstaculoNivelUno);
        }
      }
    pelota.velocidadX = 5;
    pelota.velocidadY = 5; 
    nivel_terminado = false;
    break;
    case 2:
      transicion_bandera = true;
      contador_transicion = 0 
      for (let i = -80; i <= -20; i += 20){ 
        for (let k = 150; k < 650; k+=50){
          //IF PARA DIBUJAR SOLO UN OBSTACULO NIVEL 2
          if(i === -60& k === 350){
            let obstaculoNivelDos = {
              largo: 50,
              ancho: 20,
              valorPuntos: 20,
              colorFondo: "red",
              vida: 3,
              x: k,
              y: i,
              nivel: 2
            };
            listaObstaculos.push(obstaculoNivelDos);
          }else{
            let obstaculoNivelUno = {
              largo: 50,
              ancho: 20,
              valorPuntos: 10,
              colorFondo: "green",
              vida: 1,
              x: k,
              y: i,
              nivel: 1
            };
            listaObstaculos.push(obstaculoNivelUno);
          }
        }
      }
      pelota.velocidadX = 7;
      pelota.velocidadY = 7; 
      nivel_terminado = false;
      break;
      case 3:
      for (let i = -80; i <= -20; i += 20){ 
        for (let k = 150; k < 650; k+=50){
          //IF PARA DIBUJAR SOLO DOS OBSTACULO NIVEL 3
          if((i === -60 && k === 350) || (i === -20 && k === 550) ){
            let obstaculoNivelDos = {
              largo: 50,
              ancho: 20,
              valorPuntos: 20,
              colorFondo: "red",
              vida: 3,
              x: k,
              y: i,
              nivel: 2
            };
            listaObstaculos.push(obstaculoNivelDos);
          }else if(i === -40 && k === 400){
            //IF PARA DIBUJAR SOLO UN OBSTACULO NIVEL 3
            let obstaculoNivelTres = {
              largo: 50,
              ancho: 20,
              valorPuntos: 100,
              colorFondo: "#FFD350",
              vida: 10,
              x: k,
              y: i,
              nivel: 3
            };
            listaObstaculos.push(obstaculoNivelTres);
          }else{
            let obstaculoNivelUno = {
              largo: 50,
              ancho: 20,
              valorPuntos: 10,
              colorFondo: "green",
              vida: 1,
              x: k,
              y: i,
              nivel: 1
            };
            listaObstaculos.push(obstaculoNivelUno);
          }
        }
      }
      pelota.velocidadX = 9;
      pelota.velocidadY = 9; 
      nivel_terminado = false;
      break;
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
  
  //Reiniciar variables de animación de transición
  transicion_bandera = true;
  contador_transicion = 0;
  
  //Reiniciar los niveles
  nivel = 1;
  listaObstaculos = [];
  nivel_terminado = true;
  
    
  //Volver a iniciar el ciclo
  loop();
  juego_terminado = false;
}


function transicion() {
  if (transicion_bandera) {
    for (let i = listaObstaculos.length - 1; i >= 0; i--) { 
      listaObstaculos[i].y += 3;
    }

    contador_transicion +=1;

    if (contador_transicion >= 60) {
      transicion_bandera = false;
    }
  }
   
}