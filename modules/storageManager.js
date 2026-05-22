const CLAVE_STORAGE = "reservas";

function leerReservas() {
  try {
    const datos = localStorage.getItem(CLAVE_STORAGE);
    return datos ? JSON.parse(datos) : [];
  } catch (error) {
    console.error("Error al leer reservas:", error);
    return [];
  }
}

function guardarReserva(nuevaReserva) {
  try {
    const reservas = leerReservas();
    reservas.push(nuevaReserva);
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(reservas));
    return true;
  } catch (error) {
    console.error("Error al guardar reserva:", error);
    return false;
  }
}

