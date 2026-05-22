function validarConflicto(nueva, existentes) {
  return existentes.find(existente => {
    if (existente.recursoId !== nueva.recursoId) return false;
    if (existente.fecha     !== nueva.fecha)     return false;
    return nueva.horaInicio < existente.horaFin &&
           nueva.horaFin    > existente.horaInicio;
  }) || null;
}

function validarHorario(horaInicio, horaFin) {
  const [hIni, mIni] = horaInicio.split(":").map(Number);
  const [hFin, mFin] = horaFin.split(":").map(Number);
  const minInicio    = hIni * 60 + mIni;
  const minFin       = hFin * 60 + mFin;

  if ((minFin - minInicio) < 15) {
    return {
      valido: false,
      mensaje: "La hora de fin debe ser al menos 15 minutos después de la hora de inicio."
    };
  }
  return { valido: true };
}

function validarFecha(fecha) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fechaSelec = new Date(fecha + "T00:00:00");

  if (fechaSelec < hoy) {
    return {
      valido: false,
      mensaje: "La fecha no puede ser anterior al día actual."
    };
  }
  return { valido: true };
}