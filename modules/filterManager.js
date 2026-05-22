function filtrarDisponibles(fecha, horaInicio, horaFin) {
  if (!fecha || !horaInicio || !horaFin) return [];

  const reservas = leerReservas();

  return RECURSOS.filter(recurso => {
    const tieneConflicto = reservas.some(reserva => {
      if (reserva.recursoId !== recurso.id) return false;
      if (reserva.fecha     !== fecha)      return false;
      return horaInicio < reserva.horaFin && horaFin > reserva.horaInicio;
    });
    return !tieneConflicto;
  });
}

function actualizarListaRecursos() {
  const fecha      = document.getElementById("fecha").value;
  const horaInicio = document.getElementById("hora-inicio").value;
  const horaFin    = document.getElementById("hora-fin").value;

  if (!fecha || !horaInicio || !horaFin) return;

  const valHorario = validarHorario(horaInicio, horaFin);
  if (!valHorario.valido) {
    mostrarMensaje(valHorario.mensaje, "error");
    renderizarRecursos([]);
    return;
  }

  const disponibles = filtrarDisponibles(fecha, horaInicio, horaFin);
  renderizarRecursos(disponibles);
}