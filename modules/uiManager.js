function mostrarMensaje(texto, tipo) {
  const contenedor       = document.getElementById("mensaje");
  contenedor.textContent = texto;
  contenedor.className   = tipo === "exito" ? "msg-exito" : "msg-error";
  contenedor.style.display = "block";

  setTimeout(() => {
    contenedor.style.display = "none";
    contenedor.textContent   = "";
    contenedor.className     = "";
  }, 5000);
}

function renderizarRecursos(recursosDisponibles) {
  const contenedor     = document.getElementById("lista-recursos");
  contenedor.innerHTML = "";

  if (recursosDisponibles.length === 0) {
    contenedor.innerHTML = `
      <p class="sin-recursos">
        No hay recursos disponibles para este horario.
      </p>`;
    return;
  }

  recursosDisponibles.forEach(recurso => {
    const tarjeta         = document.createElement("div");
    tarjeta.className     = `tarjeta-recurso tarjeta-${recurso.tipo}`;
    tarjeta.dataset.id    = recurso.id;
    tarjeta.innerHTML     = `
      <span class="recurso-nombre">${recurso.nombre}</span>
      <span class="recurso-tipo">${capitalizarTipo(recurso.tipo)}</span>
    `;

    tarjeta.addEventListener("click", () => {
      document.querySelectorAll(".tarjeta-recurso")
        .forEach(t => t.classList.remove("seleccionado"));
      tarjeta.classList.add("seleccionado");
      document.getElementById("recurso-id").value     = recurso.id;
      document.getElementById("recurso-nombre").value = recurso.nombre;
    });

    contenedor.appendChild(tarjeta);
  });
}

function capitalizarTipo(tipo) {
  const mapa = {
    salon:       "Salón",
    laboratorio: "Laboratorio",
    equipo:      "Equipo"
  };
  return mapa[tipo] || tipo;
}
