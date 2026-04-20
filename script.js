// Chatbot Correos Express - Flujo "¿Dónde está mi envío?"
class ChatbotCorreosExpress {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.quickActions = document.getElementById('quickActions');
        
        // Estados del flujo conversacional
        this.conversationState = {
            currentStep: 'welcome',
            localizador: null,
            codigoPostal: null,
            telefonoDestinatario: null,
            intentosLocalizador: 0,
            intentosCodigoPostal: 0,
            maxIntentos: 3
        };
        
        // Mensajes del sistema
        this.messages = {
            welcome: "¡Hola! Soy tu asistente de Correos Express. Puedo ayudarte a saber dónde está tu paquete en un momento.",
            pedirLocalizador: "Para localizar tu envío, necesito que me indiques el número de seguimiento (localizador).",
            pedirCodigoPostal: "Ahora necesito que me confirmes el código postal de destino para verificar los datos.",
            confirmacion: "Perfecto. Voy a consultar el estado del envío con localizador {localizador} destinado al código postal {codigoPostal}. ¿Es correcto?",
            consultando: "¡Entendido! Estoy consultando los sistemas... Un segundo, por favor.",
            errorLocalizador: "Ese código no parece correcto. Por favor, revísalo; suele tener entre 10 y 12 caracteres y estar en tu email de confirmación.",
            errorCodigoPostal: "El código postal debe tener 5 dígitos numéricos. Por favor, verifícalo.",
            errorGeneral: "Lo siento, no he podido procesar tu solicitud. Por favor, inténtalo de nuevo.",
            escaladoHumano: "Voy a derivarte con un agente especializado que podrá ayudarte mejor. Un momento, por favor.",
            ayuda: "Puedo ayudarte a consultar el estado de tu envío. Solo necesito tu número de localizador y código postal de destino."
        };
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        // Envío de mensajes
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Acciones rápidas
        this.quickActions.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-action-btn')) {
                this.handleQuickAction(e.target.dataset.action);
            }
        });
        
        // Auto-ajuste del textarea
        this.messageInput.addEventListener('input', () => {
            this.sendButton.disabled = !this.messageInput.value.trim();
        });
    }
    
    handleQuickAction(action) {
        switch (action) {
            case 'consultar_envio':
                this.addUserMessage("¿Dónde está mi envío?");
                this.processUserMessage("¿Dónde está mi envío?");
                break;
            case 'ayuda':
                this.addUserMessage("Ayuda");
                this.addBotMessage(this.messages.ayuda);
                break;
        }
    }
    
    sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        this.addUserMessage(message);
        this.messageInput.value = '';
        this.sendButton.disabled = true;
        
        this.processUserMessage(message);
    }
    
    addUserMessage(text) {
        const messageDiv = this.createMessageElement('user', text);
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    addBotMessage(text, isError = false) {
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.hideTypingIndicator();
            const messageDiv = this.createMessageElement('bot', text, isError);
            this.chatMessages.appendChild(messageDiv);
            this.scrollToBottom();
        }, 1000 + Math.random() * 1000);
    }
    
    createMessageElement(type, text, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message new`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        if (isError) {
            contentDiv.innerHTML = `<div class="error-message">${text}</div>`;
        } else {
            contentDiv.innerHTML = `<p>${text}</p>`;
        }
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = this.getCurrentTime();
        
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeDiv);
        
        return messageDiv;
    }
    
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator active';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    processUserMessage(message) {
        const normalizedMessage = message.toLowerCase().trim();
        
        switch (this.conversationState.currentStep) {
            case 'welcome':
                this.handleWelcomeStep(normalizedMessage);
                break;
            case 'asking_localizador':
                this.handleLocalizadorStep(message);
                break;
            case 'asking_codigo_postal':
                this.handleCodigoPostalStep(message);
                break;
            case 'confirmacion':
                this.handleConfirmacionStep(normalizedMessage);
                break;
            case 'consultando':
                // No procesar mensajes durante la consulta
                break;
        }
    }
    
    handleWelcomeStep(message) {
        if (this.isConsultaIntent(message)) {
            if (this.extractLocalizador(message)) {
                const localizador = this.extractLocalizador(message);
                this.conversationState.localizador = localizador;
                this.conversationState.currentStep = 'asking_codigo_postal';
                this.addBotMessage(this.messages.pedirCodigoPostal);
            } else {
                this.conversationState.currentStep = 'asking_localizador';
                this.addBotMessage(this.messages.pedirLocalizador);
            }
        } else {
            this.addBotMessage(this.messages.ayuda);
        }
    }
    
    handleLocalizadorStep(message) {
        const localizador = this.extractLocalizador(message);
        
        if (this.validateLocalizador(localizador)) {
            this.conversationState.localizador = localizador;
            this.conversationState.currentStep = 'asking_codigo_postal';
            this.conversationState.intentosLocalizador = 0;
            this.addBotMessage(this.messages.pedirCodigoPostal);
        } else {
            this.conversationState.intentosLocalizador++;
            
            if (this.conversationState.intentosLocalizador >= this.conversationState.maxIntentos) {
                this.addBotMessage(this.messages.escaladoHumano);
                this.conversationState.currentStep = 'escalado';
            } else {
                this.addBotMessage(this.messages.errorLocalizador, true);
            }
        }
    }
    
    handleCodigoPostalStep(message) {
        const codigoPostal = this.extractCodigoPostal(message);
        
        if (this.validateCodigoPostal(codigoPostal)) {
            this.conversationState.codigoPostal = codigoPostal;
            this.conversationState.currentStep = 'confirmacion';
            this.conversationState.intentosCodigoPostal = 0;
            
            const confirmacionMsg = this.messages.confirmacion
                .replace('{localizador}', this.conversationState.localizador)
                .replace('{codigoPostal}', this.conversationState.codigoPostal);
            
            this.addBotMessage(confirmacionMsg);
        } else {
            this.conversationState.intentosCodigoPostal++;
            
            if (this.conversationState.intentosCodigoPostal >= this.conversationState.maxIntentos) {
                this.addBotMessage(this.messages.escaladoHumano);
                this.conversationState.currentStep = 'escalado';
            } else {
                this.addBotMessage(this.messages.errorCodigoPostal, true);
            }
        }
    }
    
    handleConfirmacionStep(message) {
        if (this.isAffirmative(message)) {
            this.conversationState.currentStep = 'consultando';
            this.addBotMessage(this.messages.consultando);
            
            // Simular consulta al sistema
            setTimeout(() => {
                this.simularConsultaEnvio();
            }, 2000);
        } else if (this.isNegative(message)) {
            this.corregirDatos();
        } else {
            this.addBotMessage("Por favor, responde 'sí' para confirmar o 'no' para corregir los datos.", true);
        }
    }
    
    corregirDatos() {
        this.addBotMessage("¿Qué dato necesitas corregir? ¿El localizador o el código postal?");
        this.conversationState.currentStep = 'correccion';
    }
    
    simularConsultaEnvio() {
        // Simulación de respuesta del sistema
        const estados = [
            "Tu envío está en tránsito. Se entregará hoy antes de las 20:00h.",
            "Tu paquete ha sido entregado correctamente a las 14:30h.",
            "Tu envío está en el centro de clasificación de Madrid. Saldrá hacia destino mañana.",
            "Tu paquete está pendiente de recogida en la oficina postal."
        ];
        
        const estadoAleatorio = estados[Math.floor(Math.random() * estados.length)];
        
        this.addBotMessage(`✅ ${estadoAleatorio}

📦 Localizador: ${this.conversationState.localizador}
📍 Destino: C.P. ${this.conversationState.codigoPostal}

¿Necesitas algo más?`);
        
        this.resetConversation();
    }
    
    resetConversation() {
        this.conversationState = {
            currentStep: 'welcome',
            localizador: null,
            codigoPostal: null,
            telefonoDestinatario: null,
            intentosLocalizador: 0,
            intentosCodigoPostal: 0,
            maxIntentos: 3
        };
    }
    
    // Funciones de validación
    validateLocalizador(localizador) {
        if (!localizador) return false;
        
        // Formato alfanumérico de 10-12 caracteres
        const regex = /^[A-Za-z0-9]{10,12}$/;
        return regex.test(localizador);
    }
    
    validateCodigoPostal(codigoPostal) {
        if (!codigoPostal) return false;
        
        // 5 dígitos numéricos
        const regex = /^[0-9]{5}$/;
        return regex.test(codigoPostal);
    }
    
    // Funciones de extracción de datos
    extractLocalizador(message) {
        // Buscar patrones de localizador (10-12 caracteres alfanuméricos)
        const regex = /\b[A-Za-z0-9]{10,12}\b/g;
        const matches = message.match(regex);
        return matches ? matches[0] : null;
    }
    
    extractCodigoPostal(message) {
        // Buscar patrones de código postal (5 dígitos)
        const regex = /\b[0-9]{5}\b/g;
        const matches = message.match(regex);
        return matches ? matches[0] : null;
    }
    
    // Funciones de detección de intención
    isConsultaIntent(message) {
        const consultas = [
            'dónde está mi envío',
            'estado de mi paquete',
            'seguimiento',
            'localizar',
            'consultar envío',
            'mi pedido',
            'mi paquete'
        ];
        
        return consultas.some(consulta => message.includes(consulta));
    }
    
    isAffirmative(message) {
        const afirmaciones = ['sí', 'si', 'correcto', 'ok', 'vale', 'confirmar'];
        return afirmaciones.some(afirmacion => message.includes(afirmacion));
    }
    
    isNegative(message) {
        const negaciones = ['no', 'incorrecto', 'errar', 'mal', 'cambiar'];
        return negaciones.some(negacion => message.includes(negacion));
    }
    
    // Utilidades
    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Inicializar el chatbot cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new ChatbotCorreosExpress();
});