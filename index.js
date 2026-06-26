"use strict";
const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const listaDiv = document.getElementById("lista");
async function obtenerUsuarios() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
            return { ok: false, error: `HTTP ${response.status}` };
        }
        const datos = await response.json();
        return { ok: true, data: datos };
    }
    catch (error) {
        return { ok: false, error: error.message };
    }
}
// Helper: crea un SVG icono seguro (sin innerHTML)
function crearIcono(tipo) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("viewBox", "0 0 24 24");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("stroke-width", "2");
    if (tipo === "email") {
        svg.classList.add("w-4", "h-4", "text-cyan-500/70");
        path.setAttribute("d", "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z");
    }
    else if (tipo === "phone") {
        svg.classList.add("w-4", "h-4", "text-purple-500/70");
        path.setAttribute("d", "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z");
    }
    else {
        svg.classList.add("w-3", "h-3", "text-cyan-500/70");
        path.setAttribute("d", "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14");
    }
    svg.appendChild(path);
    return svg;
}
// Función segura: crea una tarjeta de usuario usando DOM API (no innerHTML)
function crearTarjeta(usuario) {
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
    const nombre = document.createElement("h3");
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
    // Email
    const emailP = document.createElement("p");
    emailP.className = "text-slate-400 text-sm flex items-center gap-2";
    emailP.appendChild(crearIcono("email"));
    const emailSpan = document.createElement("span");
    emailSpan.textContent = usuario.email;
    emailP.appendChild(emailSpan);
    // Teléfono
    const phoneP = document.createElement("p");
    phoneP.className = "text-slate-500 text-sm flex items-center gap-2";
    phoneP.appendChild(crearIcono("phone"));
    const phoneSpan = document.createElement("span");
    phoneSpan.textContent = usuario.phone;
    phoneP.appendChild(phoneSpan);
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
async function iniciar() {
    mostrarEstado("loading");
    const resultado = await obtenerUsuarios();
    if (!resultado.ok) {
        // Hubo un error real (red, servidor, etc.)
        mostrarEstado("error");
        // Opcional: mostrar el error específico en consola
        console.error("Error:", resultado.error);
    }
    else if (resultado.data.length === 0) {
        // Conexión OK, pero no hay usuarios
        mostrarEstado("lista"); // mostramos lista vacía
        listaDiv.innerHTML = "<p class='text-slate-400 text-center'>No hay usuarios registrados.</p>";
    }
    else {
        // Todo bien, hay usuarios
        mostrarEstado("lista");
        listaDiv.innerHTML = "";
        resultado.data.forEach(usuario => {
            const card = crearTarjeta(usuario);
            listaDiv.appendChild(card);
        });
    }
}
iniciar();
function mostrarEstado(estado) {
    loadingDiv.classList.add("hidden");
    errorDiv.classList.add("hidden");
    listaDiv.classList.add("hidden");
    if (estado === "loading") {
        loadingDiv.classList.remove("hidden");
    }
    else if (estado === "error") {
        errorDiv.classList.remove("hidden");
    }
    else {
        listaDiv.classList.remove("hidden");
    }
}
