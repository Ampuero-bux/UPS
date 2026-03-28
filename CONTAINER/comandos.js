/* ================= ESCENARIOS ================= */

const base = [

{
  categoria:"cpu",
  problema:"Servidor lento",
  keywords:["lento","cpu"],
  comandos:[
    {cmd:"top",desc:"Uso CPU"},
    {cmd:"htop",desc:"Monitor avanzado"},
    {cmd:"ps aux --sort=-%cpu | head",desc:"Top CPU"}
  ]
},

{
  categoria:"disco",
  problema:"Disco lleno",
  keywords:["disco","lleno"],
  comandos:[
    {cmd:"df -h",desc:"Espacio"},
    {cmd:"du -sh *",desc:"Carpetas"},
    {cmd:"du -ah / | sort -rh | head",desc:"Archivos grandes"}
  ]
},

{
  categoria:"logs",
  problema:"Errores en logs",
  keywords:["logs","error"],
  comandos:[
    {cmd:"tail -f log",desc:"Logs en vivo"},
    {cmd:"grep error log",desc:"Buscar errores"},
    {cmd:"journalctl -xe",desc:"Sistema"}
  ]
},

{
  categoria:"red",
  problema:"Sin red",
  keywords:["red","conexion"],
  comandos:[
    {cmd:"ping 8.8.8.8",desc:"Ping"},
    {cmd:"ip a",desc:"IP"},
    {cmd:"ip route",desc:"Rutas"}
  ]
}

];

/* ================= COMANDOS BASE ================= */

const comandosBase = [


{ comando:"ls", descripcion:"Listar archivos", ejemplo:"ls", keywords:["listar"] },
{ comando:"ls -l", descripcion:"Listado detallado", ejemplo:"ls -l", keywords:["listar"] },
{ comando:"ls -la", descripcion:"Incluye ocultos", ejemplo:"ls -la", keywords:["ocultos"] },
{ comando:"ls -lrt", descripcion:"Orden por fecha", ejemplo:"ls -lrt", keywords:["fecha"] },

{ comando:"cd ..", descripcion:"Subir carpeta", ejemplo:"cd ..", keywords:["carpeta"] },
{ comando:"pwd", descripcion:"Ruta actual", ejemplo:"pwd", keywords:["ruta"] },

{ comando:"cp archivo destino", descripcion:"Copiar archivo", ejemplo:"cp a.txt b.txt", keywords:["copiar"] },
{ comando:"mv archivo destino", descripcion:"Mover archivo", ejemplo:"mv a.txt b.txt", keywords:["mover"] },
{ comando:"rm archivo", descripcion:"Eliminar archivo", ejemplo:"rm file.txt", keywords:["borrar"] },

{ comando:"cat archivo", descripcion:"Ver archivo", ejemplo:"cat file.txt", keywords:["ver"] },
{ comando:"less archivo", descripcion:"Ver archivo grande", ejemplo:"less file.txt", keywords:["ver"] },

{ comando:"grep texto archivo", descripcion:"Buscar texto", ejemplo:"grep error log", keywords:["grep"] },
{ comando:"grep -i texto archivo", descripcion:"Ignora mayúsculas", ejemplo:"grep -i error log", keywords:["grep"] },
{ comando:"grep -r texto /ruta", descripcion:"Búsqueda recursiva", ejemplo:"grep -r error /var/log", keywords:["grep"] },

{ comando:"find . -name archivo", descripcion:"Buscar archivo", ejemplo:"find . -name test.txt", keywords:["buscar"] },

{ comando:"ps aux", descripcion:"Procesos", ejemplo:"ps aux", keywords:["procesos"] },
{ comando:"kill PID", descripcion:"Matar proceso", ejemplo:"kill 1234", keywords:["matar"] },

{ comando:"df -h", descripcion:"Espacio disco", ejemplo:"df -h", keywords:["disco"] },
{ comando:"du -sh *", descripcion:"Peso carpetas", ejemplo:"du -sh *", keywords:["disco"] },

{ comando:"free -h", descripcion:"Memoria RAM", ejemplo:"free -h", keywords:["memoria"] },

{ comando:"netstat -tulnp", descripcion:"Puertos abiertos", ejemplo:"netstat -tulnp", keywords:["puertos"] },
{ comando:"ss -tulwn", descripcion:"Puertos moderno", ejemplo:"ss -tulwn", keywords:["puertos"] }


];

/* ================= GENERADOR 500+ ================= */

function generar(){

  const lista=[];
  const cmds=["grep","awk","sed","cut","sort","uniq","wc","tr","xargs","head","tail"];
  const flags=["-i","-r","-n","-v","-l","-c","-o","-w"];
  const pipes=["| sort","| uniq","| wc -l","| grep error","| head","| tail"];

  cmds.forEach(c=>{
    flags.forEach(f=>{

      lista.push({
        comando:`${c} ${f}`,
        descripcion:`Uso ${c} con ${f}`,
        ejemplo:`${c} ${f} archivo.txt`,
        keywords:[c]
      });

      pipes.forEach(p=>{
        lista.push({
          comando:`${c} ${f} ${p}`,
          descripcion:`Pipeline avanzado ${c}`,
          ejemplo:`${c} ${f} archivo.txt ${p}`,
          keywords:[c,"pipeline"]
        });
      });

    });
  });

  return lista;
}

const comandosFull=[...comandosBase,...generar()];

/* ================= DOM ================= */

const buscador=document.getElementById("buscador");
const resultados=document.getElementById("resultados");

/* ================= BUSCAR ================= */

buscador.addEventListener("input",()=>{

  const t=buscador.value.toLowerCase();

  const esc=base.filter(e=>e.keywords.some(k=>t.includes(k)));

  const cmds=comandosFull.filter(c=>
    (c.comando+c.descripcion).toLowerCase().includes(t)
  );

  render(esc,cmds);
});

/* ================= FILTRO ================= */

function filtrar(cat){
  if(cat==="todo") return render(base,comandosFull);
  render(base.filter(b=>b.categoria===cat),[]);
}

/* ================= RENDER ================= */

function render(esc,cmds){

  let html="";

  esc.forEach(e=>{
    html+=`
      <div class="card">
        <div class="title">🔎 ${e.problema}</div>
        ${e.comandos.map(c=>`
          <div>
            <div class="cmd" onclick="copiar('${c.cmd}')">${c.cmd}</div>
            <div class="desc">${c.desc}</div>
          </div>
        `).join("")}
      </div>
    `;
  });

  cmds.slice(0,40).forEach(c=>{
    html+=`
      <div class="card">
        <div class="title">${c.comando}</div>
        <div>${c.descripcion}</div>
        <div class="cmd" onclick="copiar('${c.ejemplo}')">${c.ejemplo}</div>
      </div>
    `;
  });

  resultados.innerHTML=html||"❌ Sin resultados";
}

/* ================= COPIAR ================= */

function copiar(txt){
  navigator.clipboard.writeText(txt);

  const t=document.createElement("div");
  t.className="toast";
  t.textContent="Copiado ✅";
  document.body.appendChild(t);

  setTimeout(()=>t.remove(),1000);
}

function irInicio(){
window.location.href = "../index.html";
}
/* INIT */
render(base,comandosFull);