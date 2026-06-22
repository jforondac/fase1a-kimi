

// Referencias a los elementos de la página
const loadingDiv = document.getElementById("loading") as HTMLDivElement;
const errorDiv = document.getElementById("error") as HTMLDivElement;
const listaDiv = document.getElementById("lista") as HTMLDivElement;



interface Usuario {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
}

// 2. Función que consume la API
async function obtenerUsuarios(): Promise<Usuario[]> {
  try {

    const response = await fetch('https://jsonplaceholder.typicode.com/users');

    const datos =  await response.json();  

    return datos as Usuario[];

  } catch (error) {

    console.error('Error al obtener los usuarios:', error);
    return [];
  }
}

async function iniciar() {
  mostrarEstado("loading");

  const usuarios = await obtenerUsuarios();

  if (usuarios.length === 0) {
    mostrarEstado("error");
  } else {
    mostrarEstado("lista");
    
    // Creamos el HTML de cada usuario
    const html = usuarios.map(usuario => `
      <div class="usuario">
        <h3>${usuario.name}</h3>
        <p>📧 ${usuario.email}</p>
      </div>
    `).join("");

    // Lo ponemos en la página
    listaDiv.innerHTML = html;
  }
}

iniciar();

function mostrarEstado(estado: "loading" | "error" | "lista") {
  // Paso 1: ocultar TODOS los divs (add "oculto" a los 3)
  loadingDiv.classList.add("oculto");
  errorDiv.classList.add("oculto");
  listaDiv.classList.add("oculto");
  // Paso 2: mostrar solo el que corresponde
  if (estado === "loading") {
  loadingDiv.classList.remove("oculto");
  } else if (estado === "error") {
    errorDiv.classList.remove("oculto");

  } else {
    listaDiv.classList.remove("oculto");
  }
}