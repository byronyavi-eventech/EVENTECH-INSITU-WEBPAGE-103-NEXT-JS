export interface EnsayoItem {
  nombre: string;
  norma: string;
}

export interface SubAreaItem {
  nombre: string;
  ensayos: EnsayoItem[];
}

export interface AreaItem {
  nombre: string;
  subareas: SubAreaItem[];
}

export const ensayosData: AreaItem[] = [
  {
    nombre: "CONSTRUCCION - MECANICA DE SUELOS",
    subareas: [
      {
        nombre: "OBRAS DE PAVIMENTACIÓN, SEGÚN CONVENIO INN-MINVU",
        ensayos: [
          { nombre: "Análisis granulométrico", norma: "Método 8.102.1, Diciembre 2023, manual de Carreteras Vol. 8." },
          { nombre: "Compactación, método proctor modificado", norma: "NCh1534/2Of.79" },
          { nombre: "Densidad de partículas sólidas", norma: "NCh1532.Of80" },
          { nombre: "Densidad en el terreno, método cono de arena", norma: "NCh1516.Of79" },
          { nombre: "Densidad Máxima", norma: "ASTM D4253-16" },
          { nombre: "Densidad Mínima", norma: "ASTM D4254-16" },
          { nombre: "Humedad", norma: "NCh1515.Of79" },
          { nombre: "Limite Líquido", norma: "NCh1517/1.Of79" },
          { nombre: "Limite Plástico", norma: "NCh1517/2.Of79" },
          { nombre: "Razón de soporte (CBR)", norma: "NCh1852.Of81" }
        ]
      },
      {
        nombre: "ARIDOS PARA SUELOS, SEGÚN CONVENIO INN-MINVU",
        ensayos: [
          { nombre: "Densidad en terreno, método nuclear", norma: "Método 8.502.1, Diciembre 2003, manual de Carreteras Vol. 8." },
          { nombre: "Humedad en terreno, método nuclear", norma: "Método 8.502.6, Diciembre 2003, manual de Carreteras Vol. 8." },
          { nombre: "Muestreo de Suelos", norma: "UNE 7371:1975" }
        ]
      }
    ]
  },
  {
    nombre: "CONSTRUCCION - HORMIGON",
    subareas: [
      {
        nombre: "OBRAS DE EDIFICACION Y PAVIMENTACION, SEGUN CONVENIO INN-MINVU",
        ensayos: [
          { nombre: "Compresión", norma: "NCh1037-2009" },
          { nombre: "Confección y curado en obra de probetas para ensayos de compresión", norma: "NCh1017:2009" },
          { nombre: "Confección y curado en obra de probetas para ensayos de tracción por flexión y hendimiento", norma: "NCh1017:2009" },
          { nombre: "Densidad aparente", norma: "NCh1564.Of2009" },
          { nombre: "Docilidad, método de asentamiento del cono de Abrams", norma: "NCh1019.Of2009" },
          { nombre: "Extracción de muestras", norma: "NCh171-2008" },
          { nombre: "Extracción y ensayo de testigos de Hormigón endurecido", norma: "NCh1171/1:2012" },
          { nombre: "Tracción por flexión", norma: "NCh1038-2009" },
          { nombre: "Tracción por hendimiento", norma: "NCh1170:2012" },
          { nombre: "Refrentado de probetas", norma: "NCh1172.Of2010, Cláusula 7, Procedimiento C" },
          { nombre: "Absorción de agua de las arenas", norma: "NCh1239-2009" },
          { nombre: "Absorción de agua de las gravas", norma: "NCh1117.Of2010" },
          { nombre: "Análisis granulométrico", norma: "NCh165.Of2009" },
          { nombre: "Cubicidad de partículas", norma: "Método 8.202.6, Junio 2022, manual de Carreteras Vol. 8." },
          { nombre: "Determinación de huecos", norma: "NCh1326Of.1977" },
          { nombre: "Densidad aparente (Áridos)", norma: "NCh1116:2008" },
          { nombre: "Densidad neta de las arenas", norma: "NCh1239-2009" },
          { nombre: "Densidad neta de las gravas", norma: "NCh1117.Of2010" },
          { nombre: "Densidad real de las arenas", norma: "NCh1239-2009" },
          { nombre: "Densidad real de las gravas", norma: "NCh1117.Of2010" }
        ]
      }
    ]
  },
  {
    nombre: "CONSTRUCCION - ASFALTOS Y MEZCLAS ASFALTICAS",
    subareas: [
      {
        nombre: "CONTROL DE MEZCLAS EN TERRENO, SEGUN CONVENIO INN-MINVU",
        ensayos: [
          { nombre: "Análisis granulométrico", norma: "Método 8.302.28, diciembre 2003, Manual de carreteras, V8" },
          { nombre: "Contenido de Bitumen", norma: "Método 8.302.36, diciembre 2003, Manual de carreteras, V8" },
          { nombre: "Densidad Real", norma: "Método 8.302.38, diciembre 2022, Manual de carreteras, V8" },
          { nombre: "Espesor", norma: "ASTM D3549/D3549M-18" },
          { nombre: "Extracción de testigos de pavimentos asfálticos", norma: "NCh1171/1,Of2012" },
          { nombre: "Muestreo", norma: "Método 8.302.27, diciembre 2003, Manual de carreteras, V8" }
        ]
      },
      {
        nombre: "MEZCLAS EN TERRENO",
        ensayos: [
          { nombre: "Espesor", norma: "8.302.41, diciembre 2003, Manual de carreteras, V8" },
          { nombre: "Contenido de asfalto (Ignición)", norma: "Método 8.302.56, Manual de carreteras, V8" },
          { nombre: "Contenido de asfalto (Extracción)", norma: "Método 8.302.36, Manual de carreteras, V8" },
          { nombre: "Diseño MARSHALL", norma: "Método 8.302.40, Manual de carreteras, V8" },
          { nombre: "Indice de huecos", norma: "Método 8.302.40, Manual de carreteras, V8" },
          { nombre: "D. M. Mezcla", norma: "Método 8.302.40, Manual de carreteras, V8" },
          { nombre: "Fluidez", norma: "Método 8.302.40, Manual de carreteras, V8" },
          { nombre: "Estabilidad", norma: "Método 8.302.40, Manual de carreteras, V8" }
        ]
      }
    ]
  },
  {
    nombre: "CALIBRACIÓN DE PLANTA DE ASFALTO",
    subareas: [
      {
        nombre: "General",
        ensayos: [
          { nombre: "HI-LO", norma: "L.N.V" },
          { nombre: "IRI", norma: "L.N.V" },
          { nombre: "Método merlín", norma: "L.N.V" },
          { nombre: "Macro textura", norma: "Método 8.302.61, Manual de carreteras, V8" }
        ]
      }
    ]
  },
  {
    nombre: "CONSTRUCCION - ELEMENTOS Y COMPONENTES",
    subareas: [
      {
        nombre: "PREFABRICADOS DE HORMIGON, SEGÚN CONVENIO INN-MINVU",
        ensayos: [
          { nombre: "Absorción de agua", norma: "NCh182:2008" },
          { nombre: "Compresión", norma: "Código MINVU N°332, 2008, 6.2.5" },
          { nombre: "Compresión (NCh182)", norma: "NCh182:2008" },
          { nombre: "Contenido de humedad", norma: "NCh182:2008" },
          { nombre: "Extracción de muestras", norma: "ASTM C140/C140M" },
          { nombre: "Flexión (6.5.4.1)", norma: "Código MINVU N°332, 2008, 6.5.4.1" },
          { nombre: "Flexión (6.6.4)", norma: "Código MINVU N°332, 2008, 6.6.4" },
          { nombre: "Impacto", norma: "Código MINVU N°332, 2008, 6.5.4.2" },
          { nombre: "Compresión (6.7.3.2)", norma: "Código MINVU N°332, 2008, 6.7.3.2" },
          { nombre: "Flexión (NCh187)", norma: "NCh187:2010" },
          { nombre: "Resistencia al impacto", norma: "NCh187:2010" }
        ]
      }
    ]
  },
  {
    nombre: "ENSAYOS NO DESTRUCTIVOS (END)",
    subareas: [
      {
        nombre: "General",
        ensayos: [
          { nombre: "Medición de vibraciones inducidas", norma: "DIN 4150-3/ISO 2631/ISO 4866/BS 7385/2" },
          { nombre: "Adherencia de pinturas", norma: "ASTM D4541" },
          { nombre: "Medición de espesor de pintura", norma: "ASTM D4541" },
          { nombre: "Toque con toquimetro", norma: "ASTM" },
          { nombre: "Tracción de PVC", norma: "ASTM" },
          { nombre: "Tracción de pernos de anclaje", norma: "ASTM" },
          { nombre: "Tracción de pernos", norma: "ASTM" },
          { nombre: "Radiografía (Método ultrasonido)", norma: "ASTM" },
          { nombre: "Tintas penetrantes", norma: "ASTM" }
        ]
      }
    ]
  },
  {
    nombre: "ÁREA INGENIERIA",
    subareas: [
      {
        nombre: "General",
        ensayos: [
          { nombre: "Calicatas", norma: "Manual de carreteras/NCH/ASTM" },
          { nombre: "D.P.H Super pesada", norma: "ASTM" },
          { nombre: "D.P.H Estándar", norma: "ASTM" },
          { nombre: "Placa de carga", norma: "ASTM" },
          { nombre: "Permeabilidad de carga variable", norma: "Manual de carreteras Vol.8" },
          { nombre: "Permeabilidad carga constante", norma: "Manual de carreteras Vol.8" },
          { nombre: "Porchett", norma: "ASTM" },
          { nombre: "Estratigrafía", norma: "ASTM" },
          { nombre: "Sondaje (30mts.)", norma: "ASTM" },
          { nombre: "R.Q.D", norma: "ASTM" },
          { nombre: "Granulometría bajo 200", norma: "ASTM" },
          { nombre: "Resistividad eléctrica", norma: "ASTM" },
          { nombre: "Resistencia térmica", norma: "ASTM" }
        ]
      }
    ]
  }
];