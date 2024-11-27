import { Car } from "./Car.js";
import * as datosCoche from "./mockData.js";

/*-------------------MAPEO-----------------*/
export const mapeoArray = () => { //LO QUE HACE ESTE METODO ES METER datosCoche EN UN ARRAY DE OBJETOS CAR
  return new Promise((resolve, reject) => {

    const cochesArray = datosCoche.cars.map((cochesData) => {
      const coche = new Car(cochesData.id, cochesData.make);
      coche.setModel(cochesData.model); // Asigna el modelo usando el setter
      coche.setYear(cochesData.year); // Asigna el año usando el setter
      coche.setType(cochesData.type);
      return coche;
    });

    if (cochesArray.length > 0) {
      //compruebo si cochesArray se ha rellenado correctamente
      resolve(cochesArray);
    } else {
      reject("No se ha leído bien el mockData");
    }
  });
};


/*--------CREAR EL SELECT---------*/
const divFilters = document.createElement("div");
const spanYear = document.createElement("span");
const strongYear = document.createElement("strong");
strongYear.textContent = "Year: ";
const selectYear = document.createElement("select");
//esto lo busque por internet, para poder añadir a "selectyEAR" un id y cogerlo asi directamente
selectYear.id = "selectYear";

const years = datosCoche.cars.map((coche) => coche.year); //mete los elementos  "year" de cars en el array "years"
const sortedYears = [...new Set(years.map((year) => Number(year)))] // Convierte los años a números, elimina duplicados y ordena
  .sort((a, b) => a - b); // Ordena de menor a mayor ------------- ESTO LO HE BUSCADO EN INTERNET

sortedYears.forEach((opcion) => {
  const option = document.createElement("option");
  option.value = opcion;
  option.textContent = opcion;
  selectYear.appendChild(option);
});

spanYear.appendChild(strongYear);
divFilters.appendChild(spanYear);
divFilters.appendChild(selectYear);


document.body.appendChild(divFilters);
/*----YA HEMOS CREADO EL FILTRO, ASI QUE AHORA TOCA CREAR EL CONTENIDO-------*/
//VAMOS A CREAR UNA PROMESA QUE CREE FILTRE (COMO LOS DEL EJERCICO ANTERIOR) SEGUN EL AÑO DEL COCHE 
export const filtrarCochesPorAño = () =>{
    return new Promise((resolve,reject)=>{
      //como es una operacion asincrona, hacemos una promesa
      mapeoArray().then((cochesArray)=>{

        const añoSeleccionado = document.getElementById('selectYear').value;
        
        cochesArray = cochesArray.filter(coche => coche.getYear() == Number(añoSeleccionado)); //este filtra por año.  

        if(cochesArray.length > 0){
          resolve(cochesArray);
        }else{
          reject("No se han encontrado coches con ese año");
        }
      }).catch((error)=>{
        reject(error); 
      })
    });
}

async function crearDivContenido() {
  const cochesFiltrados = await filtrarCochesPorAño(); //aqui lo filtramos y creamos el array de los coches filtrados

  // Crear h1 y contenedor principal
  const h1 = document.createElement("h1");
  h1.textContent = "Coches según su año";
  const divContainer = document.createElement("div");
  divContainer.classList.add("container");

  // creo el div de coches
  const divBlock = document.createElement("div");
  divBlock.classList.add("block");

  cochesFiltrados.forEach((car) => {
      const div = document.createElement("div");

      const pModeloMake = document.createElement("p");
      const pTypeYear = document.createElement("p");
      pModeloMake.textContent = `${car.getModel()} / ${car.getMake()}`;
      pTypeYear.textContent = `${car.getType()} / ${car.getYear()}`;

      div.appendChild(pModeloMake);
      div.appendChild(pTypeYear);
      divBlock.appendChild(div);

    
  });

  divContainer.appendChild(h1);
  divContainer.appendChild(divBlock);
  document.body.appendChild(divContainer);
}
  //ya tenemos las funciones y las promesas creadas asi que vamos a ejecutar la de crear los div

  //esto hace que al seleccionar una opcion (change) se ejecute de numevo crearDivContenido
  
  crearDivContenido();
 
  setTimeout(() => {
    document.getElementById('selectYear').addEventListener('change', async () => {
      await crearDivContenido(); // Vuelve a crear el contenido cuando cambia la selección
    });
  
    crearDivContenido(); // Crear contenido inicial
  }, 0);
/*---------------------------------------*/

