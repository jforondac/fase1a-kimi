function announceStatus(mensaje: string) {
  const announcer = document.getElementById("status-announce");
  if (announcer) announcer.textContent = mensaje;
}

function getElementByIdOrThrow<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Elemento #${id} no encontrado en el DOM. Verifica que el ID exista en el HTML.`);
  }
  return element as T;
}

const loadingDiv = getElementByIdOrThrow<HTMLDivElement>("loading");
const errorDiv = getElementByIdOrThrow<HTMLDivElement>("error");
const listaDiv = getElementByIdOrThrow<HTMLDivElement>("lista");



interface Usuario {
  id: number;
  name: string;
  username: string;      
  email: string;
  address?: {            
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company?: {           
    name: string;
    catchPhrase: string;
    bs: string;
  };
}


function esUsuario(obj: unknown): obj is Usuario {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj && typeof (obj as Record<string, unknown>).id === "number" &&
    "name" in obj && typeof (obj as Record<string, unknown>).name === "string" &&
    "username" in obj && typeof (obj as Record<string, unknown>).username === "string" &&
    "email" in obj && typeof (obj as Record<string, unknown>).email === "string" &&
    "phone" in obj && typeof (obj as Record<string, unknown>).phone === "string" &&
    "website" in obj && typeof (obj as Record<string, unknown>).website === "string"
  );
}




type FetchResult = 
  | { ok: true; data: Usuario[] }
  | { ok: false; error: string };



async function obtenerUsuarios(): Promise<FetchResult> {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');

    if (!response.ok) {
      return { ok: false, error: `HTTP ${response.status}` };
    }

    const datos: unknown = await response.json();

    if (!Array.isArray(datos)) {
      return { ok: false, error: "La API no devolvió un array" };
    }

    const usuariosValidados = datos.filter(esUsuario);

    if (usuariosValidados.length === 0 && datos.length > 0) {
      return { ok: false, error: "Todos los datos de la API fueron inválidos" };
    }

    return { ok: true, data: usuariosValidados };

  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
}

function crearIcono(tipo: "email" | "phone" | "link"): SVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");

  if (tipo === "email") {
    svg.classList.add("w-4", "h-4", "text-cyan-500/70");
    use.setAttribute("href", "#icon-email");
  } else if (tipo === "phone") {
    svg.classList.add("w-4", "h-4", "text-purple-500/70");
    use.setAttribute("href", "#icon-phone");
  } else {
    svg.classList.add("w-3", "h-3", "text-cyan-500/70");
    use.setAttribute("href", "#icon-link");
  }

  svg.appendChild(use);
  return svg;
}

// Función segura: crea una tarjeta de usuario usando DOM API (no innerHTML)
function crearTarjeta(usuario: Usuario): HTMLElement {
  // 1. El contenedor de la card
  const card = document.createElement("div");
  card.className = "bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 group";

  // 2. Header: avatar + nombre
  const header = document.createElement("div");
  header.className = "flex items-center gap-4 mb-4";

  // Avatar (círculo con inicial)
  const avatar = document.createElement("div");
  avatar.className = "w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/20";
  avatar.setAttribute("role", "img");
  avatar.setAttribute("aria-label", `Avatar de ${usuario.name}`);
  avatar.textContent = usuario.name.charAt(0); // textContent = SEGURO (escapa HTML)

  // Info del nombre
  const info = document.createElement("div");

  const nombre = document.createElement("h2");
  nombre.className = "text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors leading-tight";
  nombre.textContent = usuario.name; 
  const idSpan = document.createElement("span");
  idSpan.className = "text-xs text-slate-500";
  idSpan.textContent = `ID: ${usuario.id}`;

  info.appendChild(nombre);
  info.appendChild(idSpan);

  header.appendChild(avatar);
  header.appendChild(info);

  // 3. Info de contacto (email, teléfono)
  const contacto = document.createElement("div");
  contacto.className = "space-y-2";

  const emailP = document.createElement("p");
  emailP.className = "text-slate-400 text-sm flex items-center gap-2";
  emailP.appendChild(crearIcono("email"));

  // Email
  const emailLink = document.createElement("a");
  emailLink.href = `mailto:${usuario.email}`;
  emailLink.textContent = usuario.email;
  emailLink.className = "hover:text-cyan-400 transition-colors";
  emailP.appendChild(emailLink);

  const phoneP = document.createElement("p");
  phoneP.className = "text-slate-500 text-sm flex items-center gap-2";
  phoneP.appendChild(crearIcono("phone"));

  // Teléfono
    const phoneLink = document.createElement("a");
  phoneLink.href = `tel:${usuario.phone.replace(/\s+/g, '')}`;
  phoneLink.textContent = usuario.phone;
  phoneLink.className = "hover:text-purple-400 transition-colors";
  phoneP.appendChild(phoneLink);

  contacto.appendChild(emailP);
  contacto.appendChild(phoneP);

  // 4. Website link
  const footer = document.createElement("div");
  footer.className = "mt-4 pt-4 border-t border-slate-800";

  const link = document.createElement("a");
  const rawUrl = usuario.website ?? ""; // si no hay website, string vacío
  const websiteUrl = /^https?:\/\//i.test(rawUrl)
    ? rawUrl // ya tiene http:// o https://
    : `https://${rawUrl}`; // le falta, se lo ponemos
  link.href = websiteUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.className = "text-xs text-cyan-500/70 hover:text-cyan-400 flex items-center gap-1 transition-colors";
  link.appendChild(crearIcono("link"));
  const linkText = document.createElement("span");
  linkText.textContent = usuario.website;
  link.appendChild(linkText);
  footer.appendChild(link);
  card.appendChild(header);
  card.appendChild(contacto);
  card.appendChild(footer);

  return card;
}

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


async function iniciar() {
  mostrarEstado("loading");
  announceStatus("Cargando usuarios..."); // ← NUEVO
  const resultado = await obtenerUsuarios();

  if (!resultado.ok) {
    // Hubo un error real (red, servidor, etc.)
    mostrarEstado("error");
    announceStatus("Error al cargar usuarios"); // ← NUEVO
    // Opcional: mostrar el error específico en consola
    console.error("Error:", resultado.error);
  } else if (resultado.data.length === 0) {
    // Conexión OK, pero no hay usuarios
    mostrarEstado("lista"); // mostramos lista vacía
    announceStatus("No hay usuarios registrados"); // ← NUEVO

    listaDiv.innerHTML = "<p class='text-slate-400 text-center'>No hay usuarios registrados.</p>";
  } else {
    // Todo bien, hay usuarios
    mostrarEstado("lista");
    announceStatus("Usuarios cargados correctamente"); // ← NUEVO
    listaDiv.innerHTML = "";
    resultado.data.forEach(usuario => {
      const card = crearTarjeta(usuario);
      listaDiv.appendChild(card);
    });
  }
}



// Botón de reintentar
const btnRetry = document.getElementById("btn-retry");
if (btnRetry) {
  btnRetry.addEventListener("click", () => {
    iniciar();
  });
}





iniciar();





