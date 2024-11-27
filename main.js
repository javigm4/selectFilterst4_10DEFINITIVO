import { Car } from "./Car.js";
import * as datosCoche from "./mockData.js";

/*-------------------MAPEO-----------------*/
export const mapeoArray = () => { 
  return new Promise((resolve, reject) => {
    const cochesArray = datosCoche.cars.map((cochesData) => {
      const coche = new Car(cochesData.id, cochesData.make);
      coche.setModel(cochesData.model);
      coche.setYear(cochesData.year);
      coche.setType(cochesData.type);
      return coche;
    });

    if (cochesArray.length > 0) {
      resolve(cochesArray);
    } else {
      reject("No se ha leído bien el mockData");
    }
  });
};

/*--------CREAR EL SELECT---------*/
document.addEventListener('DOMContentLoaded', () => { 
  // Crear select de año
  const divFilters = document.createElement("div");
  const spanYear = document.createElement("span");
  const strongYear = document.createElement("strong");
  strongYear.textContent = "Year: ";
  const selectYear = document.createElement("select");
  selectYear.id = "selectYear";

  const years = datosCoche.cars.map((coche) => coche.year);
  const sortedYears = [...new Set(years.map((year) => Number(year)))] 
    .sort((a, b) => a - b);

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

  // Añadir el eventListener para filtrar coches cuando cambie la selección
  selectYear.addEventListener('change', async () => {
    await crearDivContenido(); // Vuelve a crear el contenido cuando cambia la selección
  });

  // Crear el contenido inicial
  crearDivContenido();
});

/*---- FILTRAR COCHES POR AÑO ----*/
export const filtrarCochesPorAño = () => {
  return new Promise((resolve, reject) => {
    mapeoArray().then((cochesArray) => {
      const añoSeleccionado = document.getElementById('selectYear').value;
      
      cochesArray = cochesArray.filter(coche => coche.getYear() == Number(añoSeleccionado)); 

      if(cochesArray.length > 0){
        resolve(cochesArray);
      } else {
        reject("No se han encontrado coches con ese año");
      }
    }).catch((error) => {
      reject(error); 
    });
  });
};

/*---- CREAR DIVS DE CONTENIDO ----*/
async function crearDivContenido() {
  const cochesFiltrados = await filtrarCochesPorAño(); 

  const h1 = document.createElement("h1");
  h1.textContent = "Coches según su año";
  const divContainer = document.createElement("div");
  divContainer.classList.add("container");

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
