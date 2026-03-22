/**
 * Script para formulario de citas por WhatsApp
 * @version 1.1
 * @description Valida un formulario, recolecta los datos y los envía a un número de WhatsApp específico.
 */

// Espera a que el DOM esté completamente cargado para ejecutar el script.
document.addEventListener('DOMContentLoaded', function() {
    initForm();
});

/**
 * Inicializa el formulario de citas.
 * Busca el formulario por su ID y le asigna un evento 'submit'.
 */
function initForm() {
    const form = document.getElementById('appointmentForm');
    
    // Si el formulario no existe en la página, muestra un error en la consola.
    if (!form) {
        console.error('El formulario con el ID "appointmentForm" no fue encontrado.');
        return;
    }
    
    form.addEventListener('submit', handleFormSubmit);
}

/**
 * Maneja el evento de envío del formulario.
 * @param {Event} e - El objeto del evento.
 */
function handleFormSubmit(e) {
    // Previene el comportamiento por defecto del formulario (recargar la página).
    e.preventDefault();
    
    // Si la validación no es exitosa, detiene la ejecución.
    if (!validateForm()) {
        return;
    }
    
    // Recolecta los datos del formulario.
    const formData = getFormData();
    
    // Envía los datos recolectados a WhatsApp.
    sendToWhatsApp(formData);
}

/**
 * Valida los campos requeridos del formulario.
 * @returns {boolean} - Retorna `true` si el formulario es válido, `false` en caso contrario.
 */
function validateForm() {
    // Valida que los campos no estén vacíos
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const date = document.getElementById('date').value;
    const service = document.getElementById('service').value;

    if (!name || !phone || !date || !service) {
        showError('Por favor, completa todos los campos requeridos.');
        return false;
    }

    // Valida que el teléfono tenga al menos 8 dígitos.
    if (phone.length < 8) {
        showError('El número de teléfono parece inválido. Debe tener al menos 8 dígitos.');
        return false;
    }
    
    // Si todas las validaciones pasan, retorna true.
    return true;
}

/**
 * Recolecta y estructura los datos de los campos del formulario.
 * @returns {object} - Un objeto con los datos del formulario.
 */
function getFormData() {
    return {
        name: document.getElementById('name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        date: document.getElementById('date').value,
        service: document.getElementById('service').value,
        message: document.getElementById('message').value.trim() || 'Sin mensaje adicional'
    };
}

/**
 * Construye el mensaje y la URL de WhatsApp y la abre en una nueva pestaña.
 * @param {object} data - Objeto con los datos del formulario.
 */
function sendToWhatsApp(data) {
    const message = formatMessage(data);
    const whatsappUrl = buildWhatsAppUrl(message);
    
    // Abre la URL de WhatsApp en una nueva pestaña del navegador.
    window.open(whatsappUrl, '_blank');
}

/**
 * Formatea los datos del formulario en un mensaje de texto legible.
 * @param {object} data - Objeto con los datos del formulario.
 * @returns {string} - El mensaje formateado.
 */
function formatMessage(data) {
    // Usamos `toLocaleDateString` para un formato de fecha más amigable.
    const formattedDate = new Date(data.date + 'T00:00:00-06:00').toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return `¡Hola! 👋 Quisiera agendar una nueva cita:
    
*Nombre:* ${data.name}
*Teléfono:* ${data.phone}
*Fecha deseada:* ${formattedDate}
*Servicio:* ${data.service}
*Mensaje:* ${data.message}

¡Gracias!`;
}

/**
 * Construye la URL 'wa.me' con el número de teléfono y el mensaje.
 * @param {string} message - El mensaje a enviar.
 * @returns {string} - La URL completa de WhatsApp.
 */
function buildWhatsAppUrl(message) {
    // **IMPORTANTE**: Este es tu número de WhatsApp con el código de país de El Salvador (503).
    const phoneNumber = '50370871611';
    
    // Corrección: Se usan backticks (`) para permitir la interpolación de variables.
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Muestra un mensaje de error al usuario.
 * @param {string} message - El mensaje de error a mostrar.
 */
function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (!errorElement) {
        console.error("Elemento para mostrar errores no encontrado.");
        return;
    }

    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Oculta el mensaje de error después de 5 segundos.
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}