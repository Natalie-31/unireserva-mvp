// app.js
// Núcleo del sistema UniReserva
// Importa módulos y controla el flujo principal

// ── Filtrado de disponibilidad ─────────────────────────────────
function filtrarDisponibles(fecha, horaInicio, horaFin) {
  if (!fecha || !horaInicio || !horaFin) return [];

  const reservas = leerReservas(); // desde storage.js

  return RECURSOS.filter(recurso => { // RECURSOS desde recursos.js
    const tieneConflicto = reservas.some(reserva => {
      if (reserva.recursoId !== recurso.id) return false;
      if (reserva.fecha     !== fecha)      return false;
      return horaInicio < reserva.horaFin && horaFin > reserva.horaInicio;
    });
    return !tieneConflicto;
  });
}

// ── Listener: cambios en fecha/hora actualizan la lista ────────
function configurarFiltradoDinamico() {
  const campos = ["fecha", "hora-inicio", "hora-fin"];
  campos.forEach(id => {
    document.getElementById(id)
      .addEventListener("change", actualizarListaRecursos);
  });
}

function actualizarListaRecursos() {
  const fecha      = document.getElementById("fecha").value;
  const horaInicio = document.getElementById("hora-inicio").value;
  const horaFin    = document.getElementById("hora-fin").value;

  if (!fecha || !horaInicio || !horaFin) return;

  const valHorario = validarHorario(horaInicio, horaFin); // validaciones.js
  if (!valHorario.valido) {
    mostrarMensaje(valHorario.mensaje, "error");           // ui.js
    renderizarRecursos([]);                                // ui.js
    return;
  }

  const disponibles = filtrarDisponibles(fecha, horaInicio, horaFin);
  renderizarRecursos(disponibles);
}

// Listener: submit del formulario 
function configurarFormulario() {
  document.getElementById("form-reserva")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const fecha         = document.getElementById("fecha").value;
      const horaInicio    = document.getElementById("hora-inicio").value;
      const horaFin       = document.getElementById("hora-fin").value;
      const nombre        = document.getElementById("nombre").value.trim();
      const rol           = document.getElementById("rol").value;
      const recursoId     = document.getElementById("recurso-id").value;
      const recursoNombre = document.getElementById("recurso-nombre").value;

      // Validación de campos obligatorios 
      // Se verifica cada campo individualmente para dar
      // un mensaje específico de cuál falta
      if (!fecha) {
        mostrarMensaje("El campo Fecha es obligatorio.", "error");
        document.getElementById("fecha").focus();
        return;
      }

      if (!horaInicio) {
        mostrarMensaje("El campo Hora de inicio es obligatorio.", "error");
        document.getElementById("hora-inicio").focus();
        return;
      }

      if (!horaFin) {
        mostrarMensaje("El campo Hora de fin es obligatorio.", "error");
        document.getElementById("hora-fin").focus();
        return;
      }

      if (!recursoId) {
        mostrarMensaje(
          "Debes seleccionar un recurso de la lista antes de reservar.",
          "error"
        );
        return;
      }

      if (!nombre) {
        mostrarMensaje("El campo Nombre completo es obligatorio.", "error");
        document.getElementById("nombre").focus();
        return;
      }

      if (!rol) {
        mostrarMensaje("Debes seleccionar tu Rol (Estudiante / Docente).", "error");
        document.getElementById("rol").focus();
        return;
      }

      // ── Validaciones lógicas ───────────────────────────────
      const valFecha = validarFecha(fecha);
      if (!valFecha.valido) {
        mostrarMensaje(valFecha.mensaje, "error");
        return;
      }

      const valHorario = validarHorario(horaInicio, horaFin);
      if (!valHorario.valido) {
        mostrarMensaje(valHorario.mensaje, "error");
        return;
      }

      // ── Construir objeto reserva ───────────────────────────
      const nuevaReserva = {
        id:            crypto.randomUUID(),
        recursoId,
        recursoNombre,
        fecha,
        horaInicio,
        horaFin,
        nombreUsuario: nombre,
        rolUsuario:    rol,
        fechaCreacion: new Date().toISOString()
      };

      // ── Validar conflicto de horario ───────────────────────
      const reservasActuales = leerReservas();
      const conflicto = validarConflicto(nuevaReserva, reservasActuales);

      if (conflicto) {
        mostrarMensaje(
          `✗ Error: El recurso "${recursoNombre}" ya está reservado de ` +
          `${conflicto.horaInicio} a ${conflicto.horaFin}.`,
          "error"
        );
        return;
      }

      // ── Guardar reserva ────────────────────────────────────
      const guardado = guardarReserva(nuevaReserva);
      if (!guardado) {
        mostrarMensaje("Error al guardar la reserva. Intenta de nuevo.", "error");
        return;
      }

      // ── Éxito ──────────────────────────────────────────────
      mostrarMensaje(
        `✓ Reserva confirmada: ${recursoNombre} — ${fecha} ` +
        `de ${horaInicio} a ${horaFin} para ${nombre}.`,
        "exito"
      );

      // Limpiar formulario y actualizar lista
      document.getElementById("form-reserva").reset();
      document.getElementById("recurso-id").value     = "";
      document.getElementById("recurso-nombre").value = "";
      document.querySelectorAll(".tarjeta-recurso")
        .forEach(t => t.classList.remove("seleccionado"));
      actualizarListaRecursos();
    });
}

// ── Inicialización ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Establecer fecha mínima en el input como hoy
  const hoy = new Date().toISOString().split("T")[0];
  document.getElementById("fecha").min = hoy;

  configurarFiltradoDinamico();
  configurarFormulario();
});