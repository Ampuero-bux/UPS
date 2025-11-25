
/* ---------- Textos TEST FROZEN (combo2) ---------- */
const casos = {
  "TEST FROZEN F7 - REPORTADA": `
Buen día
Hoy nos reportan Prueba Congelada de PPL.
Interrumpimos la prueba(F7) y el registro queda en la estadística
• KNR: 
• Client: PPL
• VCI: 
• Test start: 
• VCI offline: 
• Trazas de SIDIS y trazas  de la VCI  quedan almacenadas en el siguiente ruta:
Estadistica:
Evidencias:

`,
  "TEST FROZEN F7-SIDIS - REPORTADA": `
Buen día
Hoy nos reportan Prueba Congelada del PPL.
Interrumpimos la prueba (F7) sin embargo Sidis no responde, por lo que se reinicia y el registro no queda en la estadística.
• KNR:
• Client: PPL
• VCI: 
• Trazas de SIDIS y trazas  de la VCI  quedan almacenadas en el siguiente ruta:
Evidencias:
`,
  "TEST FROZEN F7 - MONTOREO": `
Buen día
Les comparto que realizando el monitoreo de los PPL´s se encontró el PPL detenido
Interrumpimos la prueba(F7) y el registro queda en la estadística
• KNR:
• Client: PPL
• VCI:
• Test start: 
• VCI offline:
• Trazas de SIDIS y trazas  de la VCI  quedan almacenadas en el siguiente ruta:
Estadistica:
Evidencias:
`,
  "TEST FROZEN F7-SISDIS - MONITOREO": `
Buen día
Les comparto que realizando el monitoreo de los PPL´s se encontró el PPL detenido
Interrumpimos la prueba(F7) sin embargo sidis no responde, por lo que se reinicia y el registro no queda en la estadística
• KNR:
• Client: PPL
• VCI:
• Trazas de SIDIS y trazas  de la VCI  quedan almacenadas en el siguiente ruta:
Evidencias:

`
};

/* ---------- Textos combo3 (respuestas rapidas) ---------- */
const validaciones = {
  "LA ALERTA YA NO ESTA PRESENTE": "We proceed with the closure because the alert is no longer present. We attach an image of the monitoring.",
  "ALERTA VALIDACION CCIT": "The monitoring alarm is not present, we attach email with validation information of CCIT team",
  "F7 Y REINICIA SIDIS": "We save traces and temporary files. We interrupted the test (F7). SIDIS application shuts down, runs again. We ask the user to perform another test. We observe that the Sidis application runs without failures",
  "F7 CONGELDA RESPONDE": "We save traces and temporary files. Screen frozen. Test interrupted. We ask the user to perform another test.",
  "F7 CONGELDA REINICIA SIDIS": "We interrupted the test (F7). SIDIS app did not respond; we proceeded to restart it.",
  "IDG TERATRON": "We save traces and temporary files. Applications were restarted (SIDIS and Teratron). Port 9999 is validated",
  "PPL RESTABLECIDOS": "At the user's request, the PPL is restarted, the virtual machine is also restarted.",
  "APLICACION SIDIS CERRADA": "We access the PPL and observe the sidis application is closed, we proceeded to open application SIDIS",
  "LOGIN DE INICIO UPS_PROMO": "We connect to the PPL and see the home screen with the user UPS_PROMO; login validated.",
  "VCI LOGS": "We share information from the VCI Logs you provide",
  "F7 CONGELADA REINICIA SIDIS CAMBIO PPL": "We keep traces and temporary files. Test interrupted, SIDIS restarted, user asked to test on another PPL."
};

/* ---------- Textos combo4 (SHC) ---------- */
const shc = {
  "PASARLO SHC": "SHC Team Please validate the following device.",
  "PASARLO SHC 2": "SHC Team please support you to review the following ticket"
};

/* ---------- Helpers ---------- */
function safeClipboardWrite(text){
  if (navigator.clipboard && navigator.clipboard.writeText){
    return navigator.clipboard.writeText(text);
  } else {
    // fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    return Promise.resolve();
  }
}

function padRight(s, len){
  s = String(s);
  if (s.length >= len) return s;
  return s + ' '.repeat(len - s.length);
}

/* ---------- DOM ---------- */
const combo2 = document.getElementById('combo2');
const combo1 = document.getElementById('combo1');
const combo3 = document.getElementById('combo3');
const combo4 = document.getElementById('combo4');
const text1 = document.getElementById('text1');
const text2 = document.getElementById('text2');
const chk1 = document.getElementById('chk1');
const btnCopiar = document.getElementById('btnCopiar');
const btnLimpiar = document.getElementById('btnLimpiar');
const destino = document.getElementById('destino');

/* ---------- Eventos ---------- */

// combo2: al seleccionar, copia texto predefinido al portapapeles (igual que en C#)
combo2.addEventListener('change', () => {
  const val = combo2.value;
  if (val && casos[val]){
    safeClipboardWrite(casos[val]).then(()=> {
      alert('Texto test frozen copiado al portapapeles');
    }).catch(()=> {
      alert('No se pudo copiar al portapapeles');
    });
  }
});

// combo3: respuestas rapidas -> llenar text2 (Solution)
combo3.addEventListener('change', () => {
  const v = combo3.value;
  text2.value = validaciones[v] || '';
});

// combo4: shc/opciones -> llenar text2 (Solution)
combo4.addEventListener('change', () => {
  const v = combo4.value;
  text2.value = shc[v] || '';
});

// checkbox: deshabilita combo1
chk1.addEventListener('change', () => {
  combo1.disabled = chk1.checked;
});

// LIMPIAR: limpia campos (button3 behavior)
btnLimpiar.addEventListener('click', () => {
  combo1.selectedIndex = 0;
  combo2.selectedIndex = 0;
  combo3.selectedIndex = 0;
  combo4.selectedIndex = 0;
  text1.value = '';
  text2.value = '';
  destino.value = '';
  chk1.checked = false;
  combo1.disabled = false;
});

// COPIAR: genera texto formateado y lo copia al portapapeles (button2 behavior)
btnCopiar.addEventListener("click", () => {

  const label12 = "Specialist / Area:";
  const label1  = "Origin/Source:";
  const label3  = "Affectation:";
  const label4  = "Solution:";

  // valores
  const valOrigen = combo1.value || "";
  const valAff    = text1.value.trim();
  const valSol    = text2.value.trim();

  // función para alinear a la derecha (columnas)
  function pad(label) {
    return label.padEnd(18, " ");
  }

  let finalText = "";

  // Siempre Specialist / Area
  finalText += `${pad(label12)} BACK DESK UPS\n`;

  // Si NO está activado checkbox, incluir Origin/Source
  if (!chk1.checked) {
    finalText += `${pad(label1)} ${valOrigen}\n`;
  }

  // Siempre estos
  finalText += `${pad(label3)} ${valAff}\n`;
  finalText += `${pad(label4)} ${valSol}`;

  // copiar
  safeClipboardWrite(finalText).then(() => {
    btnCopiar.textContent = "✔ COPIADO";
    btnCopiar.classList.add("copiado");

    setTimeout(() => {
      btnCopiar.textContent = "COPIAR";
      btnCopiar.classList.remove("copiado");
    }, 1200);

  }).catch(() => {
    alert("No se pudo copiar al portapapeles");
  });

});

document.getElementById('btnGrupos').addEventListener('click', () => {
    // Redirige a otra página, por ejemplo grupos.html
    window.location.href = 'CONTAINER/Grups.html';
});

document.getElementById('btnVci').addEventListener('click', () => {
    // Redirige a otra página, por ejemplo grupos.html
    window.location.href = 'CONTAINER/VCI.html';
});

document.getElementById('btnContactos').addEventListener('click', () => {
    // Redirige a otra página, por ejemplo grupos.html
    window.location.href = 'CONTAINER/CONTAC.html';
});

document.getElementById('btnAnalisisLogs').addEventListener('click', () => {
    // Redirige a otra página, por ejemplo grupos.html
    window.location.href = 'CONTAINER/ANALISIS.html';
});

/* ---------- navegación/placeholder ---------- */
document.getElementById('btnAnalisis').addEventListener('click', ()=> alert('Abrir Analisis (placeholder)'));
document.getElementById('btnAnalisisLogs').addEventListener('click', ()=> alert('Abrir Analisis - Logs (placeholder)'));
document.getElementById('btnGrupos').addEventListener('click', ()=> alert('Abrir Grupos & Tags (placeholder)'));
document.getElementById('btnVci').addEventListener('click', ()=> alert('Abrir VCI (placeholder)'));
document.getElementById('btnContactos').addEventListener('click', ()=> alert('Abrir Contactos (placeholder)'));

