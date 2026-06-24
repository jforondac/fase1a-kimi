

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




    
        // Creamos las cards futuristas
    const html = usuarios.map(usuario => {
      const inicial = usuario.name.charAt(0);
      return `
        <div class="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 group">
          
          <!-- Avatar con inicial -->
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20">
              ${inicial}
            </div>
            <div>
              <h3 class="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors leading-tight">
                ${usuario.name}
              </h3>
              <span class="text-xs text-slate-500">ID: ${usuario.id}</span>
            </div>
          </div>

          <!-- Info -->
          <div class="space-y-2">
            <p class="text-slate-400 text-sm flex items-center gap-2">
              <svg class="w-4 h-4 text-cyan-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              ${usuario.email}
            </p>
            <p class="text-slate-500 text-sm flex items-center gap-2">
              <svg class="w-4 h-4 text-purple-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              ${usuario.phone}
            </p>
          </div>

          <!-- Website link -->
          <div class="mt-4 pt-4 border-t border-slate-800">
            <a href="https://${usuario.website}" target="_blank" class="text-xs text-cyan-500/70 hover:text-cyan-400 flex items-center gap-1 transition-colors">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
              ${usuario.website}
            </a>
          </div>
          
        </div>
      `;
    }).join("");







    listaDiv.innerHTML = html;
  }
}

iniciar();


function mostrarEstado(estado: "loading" | "error" | "lista") {
  loadingDiv.classList.add("hidden");
  errorDiv.classList.add("hidden");
  listaDiv.classList.add("hidden");
  if (estado === "loading") {
    loadingDiv.classList.remove("hidden");
  } else if (estado === "error") {
    errorDiv.classList.remove("hidden");
  } else {
    listaDiv.classList.remove("hidden");
  }
}