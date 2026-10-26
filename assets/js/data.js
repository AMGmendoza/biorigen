/* ============================================================
   BIORIGEN · Datos del sitio
   Edita este archivo para actualizar productos, proyectos y textos.
   ============================================================ */
(function (global) {
  'use strict';

  const SITE = {
    name: 'Biorigen',
    legal: 'Biorigen · Biotecnología con origen',
    tagline: 'Ciencia viva, origen local.',
    description: 'Biorigen desarrolla fermentados y soluciones biotecnológicas desde Coatzacoalcos: yogurt de nopal, kéfir de leche y proyectos de salud y agroindustria.',
    email: 'biorigen.itesco@gmail.com',
    phone: '961 702 1594',
    phoneHref: '+529617021594',
    address: 'Nardo 7, Iquisa, 96540 Coatzacoalcos, Veracruz',
    school: 'Instituto Tecnológico Superior de Coatzacoalcos',
    schoolShort: 'ITESCO',
    city: 'Coatzacoalcos, Veracruz',
    year: '2026',
    fair: 'Feria de Alimentos 2026'
  };

  const LINES = [
    {
      id: 'gluco-control',
      name: 'Gluco-Control',
      kind: 'Yogurt funcional',
      slug: 'gluco-control',
      color: '#5C7F45',
      tint: '#E9F0D8',
      tint2: '#F6FAEC',
      accent: '#CFE39A',
      tagline: 'Yogurt de nopal, fermentación viva.',
      short: 'Yogurt funcional con mucílago de nopal, fibra soluble y cultivos vivos. Sin azúcar añadida, en tres perfiles de sabor.',
      description: 'La línea con la que empezó todo. Gluco-Control nació en el aula como un yogurt funcional de nopal y hoy es una familia de tres variantes: Original, Endulzado y Afrutado.',
      art: 'jar',
      status: 'Disponible en demo'
    },
    {
      id: 'kefir',
      name: 'Kéfir',
      kind: 'Fermentado de leche',
      slug: 'kefir',
      color: '#B85C4A',
      tint: '#F7E3E1',
      tint2: '#FCF1F0',
      accent: '#F0C9A8',
      tagline: 'Cultivos vivos, textura cremosa.',
      short: 'Kéfir de leche fermentado con gránulos vivos. Natural, fresa y coco. Sin conservadores, con el carácter de una fermentación artesanal.',
      description: 'Nuestra línea más joven. El kéfir de leche se fermenta con gránulos vivos y se ofrece en tres sabores pensados para acompañar el desayuno, la colación o el entrenamiento.',
      art: 'bottle',
      status: 'Disponible en demo'
    },
    {
      id: 'sano-derma',
      name: 'SANO-DERMA',
      kind: 'Proyecto de salud',
      slug: 'sano-derma',
      color: '#5B7C8D',
      tint: '#E3EDF0',
      tint2: '#F2F7F8',
      accent: '#A9C6D0',
      tagline: 'Ganoderma lucidum para la piel.',
      short: 'Crema cicatrizante a base de Ganoderma lucidum, formulada para personas con diabetes y heridas de difícil cicatrización.',
      description: 'Un proyecto de investigación en salud humana que integra extractos de Ganoderma lucidum en una base dermatológica. Actualmente se encuentra en etapa de validación y registro.',
      art: 'cream',
      status: 'En validación'
    },
    {
      id: 'biorigen-labs',
      name: 'Biorigen Labs',
      kind: 'Proyectos en desarrollo',
      slug: 'proyectos',
      color: '#B08A3E',
      tint: '#F7EDD5',
      tint2: '#FCF7EA',
      accent: '#E3C784',
      tagline: 'Ideas que todavía están fermentando.',
      short: 'Barras energéticas, biofertilizantes y las próximas investigaciones que nacen de la carrera y de nuestras propias preguntas.',
      description: 'Una línea de proyectos académicos y personales. Algunos ya tienen formulación; otros apenas empiezan. Todos comparten el mismo método: observar, formular, probar y documentar.',
      art: 'lab',
      status: 'En desarrollo'
    }
  ];

  const PRODUCTS = [
    {
      id: 'gluco-original',
      line: 'gluco-control',
      slug: 'original',
      name: 'Gluco-Control Original',
      shortName: 'Original',
      flavor: 'Original',
      tagline: 'Original · Zero · 150 g',
      kicker: 'Zero · 150 g',
      flag: 'El más puro',
      short: 'El yogurt de nopal en su forma más pura. Sin endulzantes añadidos, con el máximo contenido de fibra y un sabor natural a nopal y canela.',
      desc: 'La versión más honesta del prototipo: leche entera, mucílago de nopal, cultivo vivo y canela. Sin azúcar añadida y con la mayor concentración de fibra soluble de las tres variantes.',
      sizes: [
        { id: '150g', label: '150 g', price: 45, compare: 55 },
        { id: '400g', label: '400 g', price: 105, compare: 125 }
      ],
      badges: ['Sin azúcar añadida', 'Máx. fibra', 'Probióticos'],
      benefits: [
        'Sin azúcares añadidos',
        'Máximo contenido de fibra',
        'Probióticos activos',
        'Ideal para dietas bajas en azúcar'
      ],
      ingredients: 'Leche entera pasteurizada, mucílago de nopal (Opuntia ficus-indica), cultivos lácticos vivos y canela.',
      nutrition: [
        ['Energía', '95 kcal'],
        ['Proteína', '5.2 g'],
        ['Grasa total', '3.1 g'],
        ['— Grasa saturada', '1.9 g'],
        ['Carbohidratos', '11.4 g'],
        ['— Azúcares', '6.8 g'],
        ['Fibra dietética', '3.5 g'],
        ['Sodio', '62 mg'],
        ['Calcio', '180 mg']
      ],
      conservation: 'Mantener refrigerado entre 2 y 6 °C. Consumir preferentemente antes de 21 días. No congelar.',
      usage: 'Un envase al día, bien frío. Puedes tomarlo solo, con fruta o como base de licuados.',
      faq: [
        ['¿Es apto para personas con diabetes?', 'Está formulado sin azúcares añadidos y con un aporte moderado de carbohidratos, pero es un prototipo académico. Cualquier decisión sobre tu alimentación debe consultarse con tu médico o nutriólogo.'],
        ['¿Contiene lactosa?', 'Sí. Está elaborado con leche entera, por lo que contiene lactosa.'],
        ['¿Por qué el nopal?', 'El mucílago del nopal es una fibra soluble que retiene agua y forma una red viscosa. En el yogurt aporta textura y acompaña la digestión de los carbohidratos.']
      ],
      art: {
        type: 'jar',
        label: 'GLUCO',
        label2: 'CONTROL',
        sub: 'YOGURT DE NOPAL',
        size: '150 g',
        lid: '#1B3325',
        labelColor: '#DCE7C4',
        labelDeep: '#C3D5A4',
        dot: '#5C7F45',
        tint: '#E9F0D8',
        tint2: '#F6FAEC'
      },
      tint: '#E9F0D8',
      tint2: '#F6FAEC',
      featured: true
    },
    {
      id: 'gluco-endulzado',
      line: 'gluco-control',
      slug: 'endulzado',
      name: 'Gluco-Control Endulzado',
      shortName: 'Endulzado',
      flavor: 'Endulzado',
      tagline: 'Endulzado · Estevia o miel · 150 g',
      kicker: 'Estevia o miel · 150 g',
      flag: 'Nuevo',
      short: 'La misma fórmula funcional con un toque de estevia o miel natural. Para cuidarte sin renunciar al sabor.',
      desc: 'Pensado para quienes quieren un perfil más dulce sin salir del marco funcional. Se endulza con estevia —o miel natural, a elección— y conserva la fibra del nopal.',
      sizes: [
        { id: '150g', label: '150 g', price: 48, compare: 58 },
        { id: '400g', label: '400 g', price: 112, compare: 135 }
      ],
      badges: ['Endulzante natural', 'Bajo índice glucémico', 'Fibra'],
      benefits: [
        'Endulzado con estevia o miel',
        'Bajo índice glucémico',
        'Textura cremosa',
        'Fibra soluble'
      ],
      ingredients: 'Leche entera pasteurizada, mucílago de nopal (Opuntia ficus-indica), estevia (o miel), cultivos lácticos vivos y canela.',
      nutrition: [
        ['Energía', '102 kcal'],
        ['Proteína', '5.1 g'],
        ['Grasa total', '3.0 g'],
        ['— Grasa saturada', '1.8 g'],
        ['Carbohidratos', '13.2 g'],
        ['— Azúcares', '8.1 g'],
        ['Fibra dietética', '3.3 g'],
        ['Sodio', '60 mg'],
        ['Calcio', '176 mg']
      ],
      conservation: 'Mantener refrigerado entre 2 y 6 °C. Consumir preferentemente antes de 21 días. No congelar.',
      usage: 'Un envase al día, bien frío. Ideal como postre o colación.',
      faq: [
        ['¿Lleva azúcar?', 'No lleva azúcar añadida. Se endulza con estevia o con miel; si eliges miel, contiene azúcares naturales.'],
        ['¿Sabe mucho a nopal?', 'El nopal aporta una nota vegetal suave. La canela y el endulzante equilibran el sabor.'],
        ['¿Puedo elegir entre estevia y miel?', 'En el prototipo se contemplan ambas opciones. En la demo se muestra la versión con estevia.']
      ],
      art: {
        type: 'jar',
        label: 'GLUCO',
        label2: 'CONTROL',
        sub: 'YOGURT DE NOPAL',
        size: '150 g',
        lid: '#6B4E2E',
        labelColor: '#F0DDB2',
        labelDeep: '#E3C784',
        dot: '#C49A3F',
        tint: '#F7EDD5',
        tint2: '#FCF6E8'
      },
      tint: '#F7EDD5',
      tint2: '#FCF6E8',
      featured: true
    },
    {
      id: 'gluco-afrutado',
      line: 'gluco-control',
      slug: 'afrutado',
      name: 'Gluco-Control Afrutado',
      shortName: 'Afrutado',
      flavor: 'Afrutado',
      tagline: 'Afrutado · Fruta de temporada · 150 g',
      kicker: 'Fruta de temporada · 150 g',
      flag: 'Favorito',
      short: 'Combinado con fruta natural de temporada. Una explosión de sabor con todos los beneficios del nopal y vitaminas extra.',
      desc: 'La variante más fresca. Se mezcla con fruta de temporada —fresa, mango o guayaba— y conserva la base funcional de nopal y cultivos vivos.',
      sizes: [
        { id: '150g', label: '150 g', price: 48, compare: 58 },
        { id: '400g', label: '400 g', price: 112, compare: 135 }
      ],
      badges: ['Fruta natural', 'Temporada', 'Probióticos'],
      benefits: [
        'Fruta natural de temporada',
        'Sin colorantes ni conservadores',
        'Probióticos activos',
        'Textura cremosa'
      ],
      ingredients: 'Leche entera pasteurizada, mucílago de nopal (Opuntia ficus-indica), fruta de temporada, cultivos lácticos vivos y canela.',
      nutrition: [
        ['Energía', '108 kcal'],
        ['Proteína', '5.0 g'],
        ['Grasa total', '2.9 g'],
        ['— Grasa saturada', '1.7 g'],
        ['Carbohidratos', '15.0 g'],
        ['— Azúcares', '9.8 g'],
        ['Fibra dietética', '3.4 g'],
        ['Sodio', '58 mg'],
        ['Calcio', '172 mg']
      ],
      conservation: 'Mantener refrigerado entre 2 y 6 °C. Consumir preferentemente antes de 21 días. No congelar.',
      usage: 'Un envase al día, bien frío. Perfecto para el desayuno o como postre.',
      faq: [
        ['¿Qué fruta lleva?', 'Depende de la temporada. En el prototipo se contemplan fresa, mango y guayaba.'],
        ['¿Lleva azúcar añadida?', 'No. El dulzor proviene de la fruta.'],
        ['¿Tiene colorantes?', 'No se añaden colorantes ni conservadores.']
      ],
      art: {
        type: 'jar',
        label: 'GLUCO',
        label2: 'CONTROL',
        sub: 'YOGURT DE NOPAL',
        size: '150 g',
        lid: '#7A3A2E',
        labelColor: '#EBC7BE',
        labelDeep: '#D9A79C',
        dot: '#B85C4A',
        tint: '#F6E3DE',
        tint2: '#FBF1EE'
      },
      tint: '#F6E3DE',
      tint2: '#FBF1EE',
      featured: true
    },
    {
      id: 'kefir-natural',
      line: 'kefir',
      slug: 'natural',
      name: 'Kéfir Natural',
      shortName: 'Natural',
      flavor: 'Natural',
      tagline: 'Natural · Fermentado de leche · 500 ml',
      kicker: 'Natural · 500 ml',
      flag: 'El clásico',
      short: 'Kéfir de leche fermentado con gránulos vivos. Sabor ácido, textura cremosa y una comunidad de bacterias y levaduras.',
      desc: 'Nuestro kéfir base. Se fermenta con gránulos vivos y leche entera pasteurizada, sin conservadores ni azúcares añadidos. El resultado es una bebida cremosa, ligeramente ácida y viva.',
      sizes: [
        { id: '250ml', label: '250 ml', price: 32, compare: 38 },
        { id: '500ml', label: '500 ml', price: 55, compare: 65 },
        { id: '1l', label: '1 L', price: 95, compare: 110 }
      ],
      badges: ['Probióticos vivos', 'Sin conservadores', 'Fermentación artesanal'],
      benefits: [
        'Cultivos vivos de bacterias y levaduras',
        'Sin conservadores ni azúcares añadidos',
        'Fermentación artesanal de 24 a 48 h',
        'Textura cremosa y sabor equilibrado'
      ],
      ingredients: 'Leche entera pasteurizada y gránulos de kéfir vivos (bacterias lácticas y levaduras).',
      nutrition: [
        ['Energía', '110 kcal'],
        ['Proteína', '6.1 g'],
        ['Grasa total', '4.2 g'],
        ['— Grasa saturada', '2.6 g'],
        ['Carbohidratos', '12.8 g'],
        ['— Azúcares', '9.5 g'],
        ['Fibra dietética', '0 g'],
        ['Sodio', '85 mg'],
        ['Calcio', '210 mg']
      ],
      conservation: 'Mantener refrigerado entre 2 y 6 °C. Consumir preferentemente antes de 14 días. No congelar. Agitar antes de servir.',
      usage: 'Un vaso de 200 ml al día, preferentemente con alimentos. Si es tu primera vez, empieza con una porción pequeña.',
      faq: [
        ['¿Es apto para personas con intolerancia a la lactosa?', 'El kéfir contiene lactosa. Algunas personas la toleran mejor por la fermentación, pero no es apto para intolerancia severa.'],
        ['¿Contiene alcohol?', 'La fermentación puede producir trazas de alcohol, por debajo del 0.5 %. No es una bebida alcohólica.'],
        ['¿Cómo sé que está vivo?', 'Es normal que el suero se separe y que el olor sea ácido. Agita antes de servir.'],
        ['¿Pueden tomarlo niños o personas inmunocomprometidas?', 'Consulta con un profesional de la salud. No es un sustituto de la leche materna ni de un tratamiento médico.']
      ],
      art: {
        type: 'bottle',
        label: 'KÉFIR',
        sub: 'FERMENTADO DE LECHE',
        size: '500 ml',
        lid: '#3E3A32',
        labelColor: '#EADCC2',
        labelDeep: '#D8C39E',
        dot: '#A8875C',
        tint: '#F3EAD9',
        tint2: '#FBF6EC'
      },
      tint: '#F3EAD9',
      tint2: '#FBF6EC',
      featured: true
    },
    {
      id: 'kefir-fresa',
      line: 'kefir',
      slug: 'fresa',
      name: 'Kéfir de Fresa',
      shortName: 'Fresa',
      flavor: 'Fresa',
      tagline: 'Fresa · Fermentado de leche · 500 ml',
      kicker: 'Fresa · 500 ml',
      flag: 'Favorito',
      short: 'Kéfir de leche con fresa natural. El equilibrio entre la acidez del fermentado y el dulzor de la fruta.',
      desc: 'La versión frutal de nuestro kéfir. Se fermenta la base de leche y gránulos vivos y se integra fresa natural, sin colorantes ni conservadores. Un perfil fresco, rosado y cremoso.',
      sizes: [
        { id: '250ml', label: '250 ml', price: 36, compare: 43 },
        { id: '500ml', label: '500 ml', price: 60, compare: 71 },
        { id: '1l', label: '1 L', price: 103, compare: 119 }
      ],
      badges: ['Fresa natural', 'Probióticos vivos', 'Sin colorantes'],
      benefits: [
        'Fresa natural, sin colorantes',
        'Cultivos vivos de bacterias y levaduras',
        'Sin conservadores',
        'Sabor fresco y cremoso'
      ],
      ingredients: 'Leche entera pasteurizada, gránulos de kéfir vivos (bacterias lácticas y levaduras) y fresa natural.',
      nutrition: [
        ['Energía', '118 kcal'],
        ['Proteína', '5.9 g'],
        ['Grasa total', '4.0 g'],
        ['— Grasa saturada', '2.5 g'],
        ['Carbohidratos', '14.6 g'],
        ['— Azúcares', '11.2 g'],
        ['Fibra dietética', '0.4 g'],
        ['Sodio', '82 mg'],
        ['Calcio', '204 mg']
      ],
      conservation: 'Mantener refrigerado entre 2 y 6 °C. Consumir preferentemente antes de 14 días. No congelar. Agitar antes de servir.',
      usage: 'Un vaso de 200 ml al día. Ideal para el desayuno o después del ejercicio.',
      faq: [
        ['¿Lleva azúcar añadida?', 'No. El dulzor proviene de la fresa natural.'],
        ['¿Lleva colorantes?', 'No se añaden colorantes ni conservadores.'],
        ['¿Puedo mezclarlo con otras frutas?', 'Sí, pero el producto ya está formulado con fresa. Si lo mezclas, hazlo al momento de consumir.']
      ],
      art: {
        type: 'bottle',
        label: 'KÉFIR',
        sub: 'FERMENTADO DE LECHE',
        size: '500 ml',
        lid: '#7A2E2A',
        labelColor: '#EFC9C5',
        labelDeep: '#DCA7A2',
        dot: '#C0554D',
        tint: '#F7E3E1',
        tint2: '#FCF1F0'
      },
      tint: '#F7E3E1',
      tint2: '#FCF1F0',
      featured: true
    },
    {
      id: 'kefir-coco',
      line: 'kefir',
      slug: 'coco',
      name: 'Kéfir de Coco',
      shortName: 'Coco',
      flavor: 'Coco',
      tagline: 'Coco · Fermentado de leche · 500 ml',
      kicker: 'Coco · 500 ml',
      flag: 'Tropical',
      short: 'Kéfir de leche con coco natural. Una combinación tropical, cremosa y ligeramente dulce.',
      desc: 'La variante más tropical. Sobre la base de kéfir de leche se integra coco rallado natural, que aporta textura y un aroma cálido. Sin conservadores ni colorantes.',
      sizes: [
        { id: '250ml', label: '250 ml', price: 36, compare: 43 },
        { id: '500ml', label: '500 ml', price: 60, compare: 71 },
        { id: '1l', label: '1 L', price: 103, compare: 119 }
      ],
      badges: ['Coco natural', 'Probióticos vivos', 'Sin conservadores'],
      benefits: [
        'Coco rallado natural',
        'Cultivos vivos de bacterias y levaduras',
        'Sin conservadores ni colorantes',
        'Textura tropical y cremosa'
      ],
      ingredients: 'Leche entera pasteurizada, gránulos de kéfir vivos (bacterias lácticas y levaduras) y coco rallado natural.',
      nutrition: [
        ['Energía', '124 kcal'],
        ['Proteína', '5.7 g'],
        ['Grasa total', '5.4 g'],
        ['— Grasa saturada', '3.4 g'],
        ['Carbohidratos', '13.9 g'],
        ['— Azúcares', '10.4 g'],
        ['Fibra dietética', '0.9 g'],
        ['Sodio', '80 mg'],
        ['Calcio', '198 mg']
      ],
      conservation: 'Mantener refrigerado entre 2 y 6 °C. Consumir preferentemente antes de 14 días. No congelar. Agitar antes de servir.',
      usage: 'Un vaso de 200 ml al día. Prueba con fruta o granola.',
      faq: [
        ['¿Lleva azúcar añadida?', 'No. El dulzor proviene del coco natural.'],
        ['¿Tiene textura de coco?', 'Sí, el coco rallado aporta una textura suave y cremosa.'],
        ['¿Es apto para personas alérgicas al coco?', 'No. Contiene coco.']
      ],
      art: {
        type: 'bottle',
        label: 'KÉFIR',
        sub: 'FERMENTADO DE LECHE',
        size: '500 ml',
        lid: '#5A4B38',
        labelColor: '#E8E0D0',
        labelDeep: '#D5C9B2',
        dot: '#A08B6A',
        tint: '#F4EFE4',
        tint2: '#FBF8F1'
      },
      tint: '#F4EFE4',
      tint2: '#FBF8F1',
      featured: true
    }
  ];

  const PROJECTS = [
    {
      id: 'sano-derma',
      slug: 'sano-derma',
      name: 'SANO-DERMA',
      subtitle: 'Crema cicatrizante de Ganoderma lucidum',
      category: 'Salud humana',
      status: 'Validación y registro',
      statusTone: 'active',
      year: '2025',
      color: '#5B7C8D',
      tint: '#E3EDF0',
      accent: '#A9C6D0',
      art: 'cream',
      summary: 'Crema tópica para heridas de difícil cicatrización en personas con diabetes, formulada con extractos de Ganoderma lucidum.',
      description: 'SANO-DERMA propone una crema cicatrizante de aplicación tópica, formulada a base de extractos concentrados del hongo Ganoderma lucidum. La especie contiene compuestos bioactivos como triterpenoides, polisacáridos y germanio orgánico, reconocidos por su capacidad para estimular la regeneración celular, reducir la inflamación y combatir infecciones.',
      long: 'El proceso contempla el cultivo, la recolección y el secado del hongo, seguido de una extracción etanólica de sus principios activos. Los extractos se filtran, concentran y estandarizan para asegurar una composición uniforme. Después se integran en una base dermatológica estable que favorece la absorción cutánea y la hidratación. El proyecto nace en Coatzacoalcos, una ciudad con alta incidencia de enfermedades crónicas, y busca una alternativa accesible para una necesidad médica real.',
      highlights: [
        ['Extracto de Ganoderma lucidum', 'Triterpenoides y polisacáridos con actividad antiinflamatoria y antioxidante.'],
        ['Enfoque en diabetes', 'Pensada para heridas de difícil cicatrización y piel sensible.'],
        ['Base dermatológica', 'Excipientes naturales que favorecen la absorción y el ambiente húmedo.'],
        ['Biotecnología sostenible', 'Cultivo de hongo y procesos de bajo impacto ambiental.']
      ],
      process: [
        ['Cultivo', 'Micelio germinado, colonización y sustrato de sorgo de maíz tratado y esterilizado.'],
        ['Extracción', 'Maceración y extracción continua de los principios bioactivos.'],
        ['Formulación', 'Estandarización del extracto e integración en una base dermatológica.'],
        ['Validación', 'Pruebas microbiológicas, de compatibilidad cutánea y de eficacia.']
      ],
      next: [
        'Completar pruebas microbiológicas y de estabilidad.',
        'Validar compatibilidad cutánea y eficacia in vitro.',
        'Documentar el proceso para el registro sanitario.',
        'Buscar alianzas con clínicas y farmacias locales.'
      ],
      team: [
        'Alejandro Mendoza Gutiérrez',
        'Alexis Pérez Hernández',
        'Jade Yazmín Vega Hernández',
        'Lizeth del Carmen Domínguez Carrasco',
        'Víctor Hugo Jerónimo González'
      ],
      advisors: ['Ángel David Sánchez Jadra'],
      tags: ['Ganoderma lucidum', 'Cicatrización', 'Diabetes', 'Biotecnología'],
      disclaimer: 'Proyecto de investigación. No es un medicamento ni un producto a la venta. No sustituye la atención médica profesional.',
      cta: 'Conocer el proyecto',
      ctaHref: 'contacto'
    },
    {
      id: 'barras-energeticas',
      slug: 'barras-energeticas',
      name: 'Barras Biorigen',
      subtitle: 'Barras energéticas en formulación',
      category: 'Alimentación funcional',
      status: 'En formulación',
      statusTone: 'soon',
      year: '2026',
      color: '#B08A3E',
      tint: '#F7EDD5',
      accent: '#E3C784',
      art: 'bar',
      summary: 'Línea de barras energéticas con ingredientes naturales, pensada para el consumo antes y después del ejercicio.',
      description: 'Una idea que estamos explorando: barras prácticas, con ingredientes naturales y una composición pensada para acompañar la actividad física. Todavía no hay una receta final ni un producto disponible.',
      long: 'El boom de la vida fitness abrió una pregunta: ¿cómo hacer una barra que no dependa de azúcares refinados y que tenga sentido para nuestro enfoque de alimentos vivos? Estamos investigando ingredientes, texturas y perfiles de sabor. Cuando tengamos una formulación estable, la presentaremos con su ficha completa.',
      highlights: [
        ['Enfoque fitness', 'Pensada para antes o después del entrenamiento.'],
        ['Ingredientes naturales', 'Exploración de frutos secos, semillas y cereales.'],
        ['Sin receta final', 'Etapa de formulación y pruebas de textura.'],
        ['Próximamente', 'Se presentará cuando exista un prototipo validado.']
      ],
      process: [
        ['Investigación', 'Revisión de ingredientes y tendencias de consumo.'],
        ['Formulación', 'Pruebas de textura, humedad y sabor.'],
        ['Validación', 'Análisis sensorial y nutrimental.'],
        ['Lanzamiento', 'Producción piloto y presentación.'] 
      ],
      next: [
        'Definir el perfil nutricional objetivo.',
        'Probar tres formulaciones piloto.',
        'Realizar análisis sensorial con el equipo.',
        'Documentar la receta final.'
      ],
      team: ['Equipo Biorigen'],
      advisors: [],
      tags: ['Barras', 'Fitness', 'Alimentación funcional'],
      disclaimer: 'Concepto en desarrollo. No hay producto formulado ni disponible para compra.',
      cta: 'Seguir el avance',
      ctaHref: 'contacto'
    },
    {
      id: 'fertilizante-hongos',
      slug: 'fertilizante-hongos',
      name: 'Biofertilizante fúngico',
      subtitle: 'Fertilizante para plantas a base de hongos',
      category: 'Agroindustria',
      status: 'En investigación',
      statusTone: 'research',
      year: '2026',
      color: '#6E8B5A',
      tint: '#E9F0D8',
      accent: '#CFE39A',
      art: 'fertilizer',
      summary: 'Investigación personal sobre un biofertilizante obtenido a partir de hongos, para mejorar la salud del suelo y el crecimiento de las plantas.',
      description: 'Un proyecto personal que explora el potencial de los hongos como aliados del suelo. La idea es aprovechar su capacidad para descomponer materia orgánica y generar nutrientes disponibles para las plantas.',
      long: 'Todavía está en una etapa temprana. No hay un producto formulado ni resultados concluyentes. Lo que sí hay es una hipótesis y un método: cultivar, observar, medir y documentar. Cuando el proyecto avance, esta página crecerá con sus resultados.',
      highlights: [
        ['Hongos y suelo', 'Exploración de la relación entre micelio y materia orgánica.'],
        ['Enfoque agroecológico', 'Alternativas a los fertilizantes de síntesis.'],
        ['Etapa temprana', 'Investigación sin producto formulado.'],
        ['Documentación abierta', 'El avance se irá publicando en esta página.']
      ],
      process: [
        ['Investigación', 'Revisión de cepas y sustratos.'],
        ['Cultivo', 'Pruebas de crecimiento del micelio.'],
        ['Formulación', 'Exploración de mezclas y dosis.'],
        ['Evaluación', 'Medición de crecimiento en plantas.'] 
      ],
      next: [
        'Seleccionar las cepas de interés.',
        'Diseñar un ensayo piloto con plantas.',
        'Registrar variables de crecimiento.',
        'Compartir los primeros resultados.'
      ],
      team: ['Alejandro Mendoza Gutiérrez'],
      advisors: [],
      tags: ['Hongos', 'Biofertilizante', 'Suelo', 'Agroecología'],
      disclaimer: 'Investigación en etapa temprana. No hay producto formulado ni resultados concluyentes.',
      cta: 'Contactar',
      ctaHref: 'contacto'
    }
  ];

  const TEAM = [
    { name: 'Alejandro Mendoza Gutiérrez', initials: 'AM', area: 'Ingeniería Bioquímica', role: 'Formulación y coordinación' },
    { name: 'Alexis Pérez Hernández', initials: 'AP', area: 'Ingeniería Bioquímica', role: 'Procesos y análisis' },
    { name: 'Azul Alondra Lara Rosario', initials: 'AL', area: 'Ingeniería Bioquímica', role: 'Desarrollo de producto' },
    { name: 'María Fernanda Fajardo Barbis', initials: 'MF', area: 'Ingeniería Bioquímica', role: 'Calidad e inocuidad' },
    { name: 'Pedro de Jesús Toto Vences', initials: 'PT', area: 'Ingeniería Bioquímica', role: 'Producción y logística' }
  ];

  const ADVISOR = {
    name: 'Ángel David Sánchez Jadra',
    area: 'Docente · Departamento de Ciencias Básicas',
    role: 'Asesor académico'
  };

  const VALUES = [
    { icon: 'leaf', title: 'Origen local', text: 'Ingredientes de la región y procesos que reconocen el territorio donde nacemos.' },
    { icon: 'flask', title: 'Ciencia aplicada', text: 'Formulamos, medimos y documentamos. Lo que no está probado, se dice.' },
    { icon: 'drop', title: 'Fermentación viva', text: 'Trabajamos con cultivos activos, no con atajos industriales.' },
    { icon: 'heart', title: 'Impacto real', text: 'Productos y proyectos pensados para problemas concretos de nuestra comunidad.' }
  ];

  const PROCESS = [
    { n: '01', title: 'Seleccionamos', text: 'Elegimos materias primas locales y definimos el perfil de cada producto.' },
    { n: '02', title: 'Fermentamos', text: 'Activamos cultivos vivos y controlamos tiempo, temperatura y acidez.' },
    { n: '03', title: 'Formulamos', text: 'Integramos sabor, textura y función sin perder de vista la inocuidad.' },
    { n: '04', title: 'Validamos', text: 'Probamos, documentamos y presentamos. Cada lote deja aprendizaje.' }
  ];

  const SCIENCE = [
    {
      icon: 'drop',
      title: 'Fermentación láctica',
      text: 'Las bacterias lácticas transforman azúcares en ácido láctico. Eso baja el pH, conserva el alimento y crea texturas y sabores nuevos.'
    },
    {
      icon: 'gut',
      title: 'Probióticos vivos',
      text: 'El yogurt y el kéfir aportan microorganismos vivos. Su presencia no sustituye un tratamiento, pero forma parte de una alimentación diversa.'
    },
    {
      icon: 'leaf',
      title: 'Fibra y mucílago',
      text: 'El mucílago del nopal es una fibra soluble que retiene agua. En el yogurt aporta cuerpo y acompaña la digestión de los carbohidratos.'
    },
    {
      icon: 'flask',
      title: 'Biocompuestos',
      text: 'En SANO-DERMA exploramos triterpenoides y polisacáridos de Ganoderma lucidum. La evidencia se documenta y se valida antes de afirmar.'
    }
  ];

  const FAQ = [
    ['¿Qué es Biorigen?', 'Es una marca de biotecnología alimentaria nacida en el ITESCO. Desarrolla fermentados y proyectos de salud y agroindustria desde Coatzacoalcos.'],
    ['¿Los productos se pueden comprar?', 'La tienda es una demostración académica. Puedes simular un pedido, pero no se procesan pagos ni se realizan envíos reales.'],
    ['¿Los datos nutrimentales son oficiales?', 'No. Son estimaciones del prototipo y están marcadas como tal. Se actualizarán cuando se realicen los análisis de laboratorio.'],
    ['¿Puedo solicitar una degustación?', 'Sí. Usa el formulario de contacto o el botón “Solicitar degustación” de cada producto. La solicitud se registra en esta demo.'],
    ['¿Qué es el kéfir?', 'Es una bebida fermentada de leche con gránulos vivos de bacterias y levaduras. Tiene textura cremosa, sabor ácido y microorganismos vivos.'],
    ['¿SANO-DERMA se vende?', 'No. Es un proyecto de investigación en validación. No es un medicamento ni un producto a la venta y no sustituye la atención médica.']
  ];

  const DATA = { SITE, LINES, PRODUCTS, PROJECTS, TEAM, ADVISOR, VALUES, PROCESS, SCIENCE, FAQ };
  global.BIORIGEN = DATA;
  if (typeof module !== 'undefined' && module.exports) module.exports = DATA;
})(typeof window !== 'undefined' ? window : globalThis);
