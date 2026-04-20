# Asistente Virtual de Correos Express 📦🤖

Este proyecto consiste en un chatbot inteligente diseñado para la gestión y consulta del estado de envíos de **Correos Express**. El sistema está optimizado para ofrecer una experiencia de usuario fluida, empática y eficiente, minimizando la fricción en la obtención de información crítica.

**🔗 [Demo en Vivo](https://chatbot-correos-express-kh5p3n1xu-nicolas-cabellos-projects.vercel.app/)**

## 🎯 Objetivo del Proyecto

El objetivo principal es permitir a los usuarios conocer la ubicación y el estado de sus paquetes de forma rápida. El flujo conversacional está diseñado para validar la identidad del usuario con datos mínimos y asegurar la veracidad de la información consultada.

## ✨ Características Principales

* **Flujo Conversacional Optimizado**: Captura de datos estructurada (Slots) para obtener el localizador y el código postal de forma natural.
* **Gestión de Errores en 3 Niveles**:
    * **Nivel 1 (Reparación):** Mensajes de error amigables para corregir formatos.
    * **Nivel 2 (Ayuda Visual):** Guía sobre dónde encontrar el número de seguimiento.
    * **Nivel 3 (Escalado):** Derivación proactiva a un agente humano en caso de frustración o fallos consecutivos.
* **Validación de Datos**: Verificación de formatos de localizadores (10-12 caracteres) y códigos postales (5 dígitos).
* **Diseño Empático**: Uso de *microcopy* diseñado para reducir la ansiedad del usuario durante la espera.

## 🛠️ Tecnologías Utilizadas

* **Frontend**: Desplegado en **Vercel**.
* **Diseño de Conversación**: Lógica basada en el diseño de flujos para UX Conversacional.
* **Validación**: Lógica de extracción de entidades y rellenado de slots.

## 📋 Diseño de Diálogo (Ejemplo)

> **Usuario:** ¿Dónde está mi envío?
> **Bot:** ¡Hola! Soy tu asistente de Correos Express. Puedo ayudarte con eso. ¿Me das el número de localizador?
> **Usuario:** Es el ABC123456789.
> **Bot:** Perfecto. Ahora, indícame el Código Postal de destino para confirmar...

## 🚀 Criterios de Calidad Aplicados

1.  **Eficiencia**: Solo se solicita la información imprescindible para la consulta.
2.  **Resiliencia**: El bot es capaz de recuperar errores puntuales sin forzar al usuario a reiniciar la conversación.
3.  **Veracidad**: Sistema diseñado para consultar estados reales sin alucinaciones de datos.
4.  **Empatía**: Detección de señales de enfado para ofrecer asistencia humana.

## ✒️ Autor

**Nicolás Cabello Alonso**
*Especialista en Diseño de Interfaces Conversacionales*
