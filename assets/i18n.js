/* =========================================================
   VIKING Pulse — i18n engine + dictionary
   Languages: en (default), da, es, zh, ar (RTL)
   Usage:
     - static HTML: data-i18n / data-i18n-html / data-i18n-ph / data-i18n-aria
     - dynamic JS:  window.I18N.t(key, params)   ({param} interpolation)
   ========================================================= */
window.I18N = (function () {
  "use strict";
  const KEY = "viking-pulse-lang";
  const LANGS = ["en", "da", "es", "zh", "ar"];

  // dictionary: key -> { en, da, es, zh, ar }
  const D = {
    /* ---------- language names ---------- */
    "lang.en": { en: "English", da: "English", es: "English", zh: "English", ar: "English" },

    /* ---------- nav ---------- */
    "nav.why": { en: "Why now", da: "Hvorfor nu", es: "Por qué ahora", zh: "为何现在", ar: "لماذا الآن" },
    "nav.how": { en: "How it works", da: "Sådan virker det", es: "Cómo funciona", zh: "工作原理", ar: "آلية العمل" },
    "nav.platform": { en: "Platform", da: "Platform", es: "Plataforma", zh: "平台", ar: "المنصة" },
    "nav.team": { en: "For your team", da: "Til dit team", es: "Para tu equipo", zh: "为您的团队", ar: "لفريقك" },
    "nav.impact": { en: "Impact", da: "Effekt", es: "Impacto", zh: "影响", ar: "الأثر" },
    "nav.demo": { en: "Live demo", da: "Live-demo", es: "Demo en vivo", zh: "在线演示", ar: "عرض حي" },
    "nav.pilot": { en: "Request a pilot", da: "Anmod om pilot", es: "Solicitar un piloto", zh: "申请试点", ar: "اطلب تجربة" },

    /* ---------- hero ---------- */
    "hero.badge": { en: "Live across the global VIKING network", da: "Live i hele det globale VIKING-netværk", es: "En vivo en toda la red global de VIKING", zh: "覆盖 VIKING 全球网络的实时数据", ar: "مباشر عبر شبكة VIKING العالمية" },
    "hero.h1": {
      en: 'The future of <span class="grad">maintenance planning</span> at VIKING.',
      da: 'Fremtiden for <span class="grad">vedligeholdelsesplanlægning</span> hos VIKING.',
      es: 'El futuro de la <span class="grad">planificación de mantenimiento</span> en VIKING.',
      zh: 'VIKING <span class="grad">维护规划</span>的未来。',
      ar: 'مستقبل <span class="grad">تخطيط الصيانة</span> في VIKING.',
    },
    "hero.lead": {
      en: 'VIKING Pulse connects fleet position, expiring certificates and service-station capacity into one platform — then <strong style="color:#fff">auto-books</strong> life-raft servicing at the right harbour, at the right time. Less manual coordination. Zero missed deadlines.',
      da: 'VIKING Pulse samler flådeposition, udløbende certifikater og servicestationers kapacitet i én platform — og <strong style="color:#fff">booker automatisk</strong> redningsflåde-service i den rette havn på det rette tidspunkt. Mindre manuel koordinering. Ingen overskredne frister.',
      es: 'VIKING Pulse conecta la posición de la flota, los certificados por vencer y la capacidad de las estaciones en una sola plataforma y <strong style="color:#fff">reserva automáticamente</strong> el servicio de balsas en el puerto y momento adecuados. Menos coordinación manual. Cero plazos incumplidos.',
      zh: 'VIKING Pulse 将船队位置、即将到期的证书与服务站产能整合到一个平台，并在合适的港口和时间<strong style="color:#fff">自动预约</strong>救生筏维护。减少人工协调，杜绝错过期限。',
      ar: 'يربط VIKING Pulse موقع الأسطول والشهادات المنتهية وسعة محطات الخدمة في منصة واحدة، ثم <strong style="color:#fff">يحجز تلقائياً</strong> صيانة طوافات النجاة في الميناء والوقت المناسبين. تنسيق يدوي أقل وصفر مواعيد فائتة.',
    },
    "hero.explore": { en: "Explore the live dashboard", da: "Udforsk live-dashboardet", es: "Explorar el panel en vivo", zh: "体验实时仪表盘", ar: "استكشف لوحة التحكم الحية" },
    "hero.seehow": { en: "See how it works", da: "Se hvordan det virker", es: "Ver cómo funciona", zh: "了解工作原理", ar: "شاهد آلية العمل" },
    "hero.stat1": { en: "Service stations", da: "Servicestationer", es: "Estaciones de servicio", zh: "服务站", ar: "محطات الخدمة" },
    "hero.stat2": { en: "Technicians", da: "Teknikere", es: "Técnicos", zh: "技术人员", ar: "فنيون" },
    "hero.stat3": { en: "Life rafts / year", da: "Redningsflåder / år", es: "Balsas / año", zh: "救生筏 / 年", ar: "طوافات نجاة / سنة" },
    "hero.stat4": { en: "Always-on matching", da: "Altid-tændt matchning", es: "Emparejamiento continuo", zh: "全天候匹配", ar: "مطابقة دائمة" },

    /* ---------- stats stripe ---------- */
    "stripe.1": { en: "Manual booking admin", da: "Manuel booking-administration", es: "Gestión manual de reservas", zh: "人工预约管理", ar: "إدارة الحجز اليدوي" },
    "stripe.2": { en: "Avg. vessel downtime", da: "Gns. skibsnedetid", es: "Tiempo medio de inactividad", zh: "平均船舶停运", ar: "متوسط توقف السفن" },
    "stripe.3": { en: "Missed SOLAS deadlines", da: "Overskredne SOLAS-frister", es: "Plazos SOLAS incumplidos", zh: "错过的 SOLAS 期限", ar: "مواعيد SOLAS الفائتة" },
    "stripe.4": { en: "Station utilisation", da: "Stationsudnyttelse", es: "Utilización de estaciones", zh: "服务站利用率", ar: "استخدام المحطات" },

    /* ---------- problem ---------- */
    "prob.eyebrow": { en: "Why now", da: "Hvorfor nu", es: "Por qué ahora", zh: "为何现在", ar: "لماذا الآن" },
    "prob.h2": { en: "Maintenance planning today is stuck in silos.", da: "Vedligeholdelsesplanlægning sidder i dag fast i siloer.", es: "Hoy la planificación de mantenimiento está atrapada en silos.", zh: "如今的维护规划困在各自为政的孤岛中。", ar: "تخطيط الصيانة اليوم عالق في صوامع منعزلة." },
    "prob.sub": { en: "Every VIKING department built its own digital tool, and scheduling is still steered by hand. The result is slow, error-prone and invisible to the customer.", da: "Hver VIKING-afdeling har bygget sit eget digitale værktøj, og planlægningen styres stadig manuelt. Resultatet er langsomt, fejlbehæftet og usynligt for kunden.", es: "Cada departamento de VIKING creó su propia herramienta digital y la planificación aún se hace a mano. El resultado es lento, propenso a errores e invisible para el cliente.", zh: "VIKING 各部门各自开发了数字工具，排程仍靠人工，导致流程缓慢、易出错且客户看不到进展。", ar: "بنى كل قسم في VIKING أداته الرقمية الخاصة، ولا يزال الجدول يُدار يدوياً. والنتيجة بطيئة وعرضة للأخطاء وغير مرئية للعميل." },
    "prob.c1.t": { en: "Siloed systems", da: "Siloopdelte systemer", es: "Sistemas aislados", zh: "孤立的系统", ar: "أنظمة منعزلة" },
    "prob.c1.d": { en: "Each department runs a separate platform. Data doesn't flow, so no one sees the full picture of a vessel's service status.", da: "Hver afdeling kører en separat platform. Data flyder ikke, så ingen ser det fulde billede af et skibs servicestatus.", es: "Cada departamento usa una plataforma distinta. Los datos no fluyen, así que nadie ve el panorama completo del estado de servicio de un buque.", zh: "每个部门各用一套平台，数据无法流通，没人能看到船舶服务状态的全貌。", ar: "يدير كل قسم منصة منفصلة. لا تتدفق البيانات، فلا أحد يرى الصورة الكاملة لحالة خدمة السفينة." },
    "prob.c2.t": { en: "Manual planning hubs", da: "Manuelle planlægningscentre", es: "Centros de planificación manual", zh: "人工规划中心", ar: "مراكز تخطيط يدوية" },
    "prob.c2.d": { en: "Servicing is coordinated by hand through central hubs. Bookings wait on staff availability, adding delays at every step.", da: "Service koordineres manuelt via centrale hubs. Bookinger venter på personalets tilgængelighed og giver forsinkelser i hvert trin.", es: "El servicio se coordina a mano en centros centrales. Las reservas dependen de la disponibilidad del personal, sumando retrasos en cada paso.", zh: "维护通过中心枢纽人工协调，预约受制于人员排班，每一步都增加延误。", ar: "تُنسّق الخدمة يدوياً عبر مراكز مركزية. تنتظر الحجوزات توفر الموظفين، مما يضيف تأخيراً في كل خطوة." },
    "prob.c3.t": { en: "Missed deadlines", da: "Overskredne frister", es: "Plazos incumplidos", zh: "错过期限", ar: "مواعيد فائتة" },
    "prob.c3.d": { en: "Certificates expire on fixed cycles. A single missed date means fines, detained vessels and costly emergency servicing.", da: "Certifikater udløber i faste cyklusser. En enkelt overskredet dato betyder bøder, tilbageholdte skibe og dyr akut service.", es: "Los certificados vencen en ciclos fijos. Una sola fecha incumplida implica multas, buques retenidos y servicios de emergencia costosos.", zh: "证书按固定周期到期。一旦错过日期，就意味着罚款、船舶滞留和高昂的紧急维护。", ar: "تنتهي الشهادات في دورات ثابتة. تاريخ واحد فائت يعني غرامات واحتجاز السفن وصيانة طارئة مكلفة." },
    "prob.c4.t": { en: "Unpredictable load", da: "Uforudsigelig belastning", es: "Carga impredecible", zh: "难以预测的负荷", ar: "حِمل غير متوقع" },
    "prob.c4.d": { en: "Stations face feast-or-famine demand and last-minute requests, making it impossible to plan technicians and spare parts.", da: "Stationer møder svingende efterspørgsel og sidste-øjebliks-forespørgsler, hvilket gør det umuligt at planlægge teknikere og reservedele.", es: "Las estaciones enfrentan demanda irregular y solicitudes de última hora, lo que impide planificar técnicos y repuestos.", zh: "服务站时而过载时而闲置，加上临时请求，导致无法规划技师与备件。", ar: "تواجه المحطات طلباً متذبذباً وطلبات اللحظة الأخيرة، مما يجعل تخطيط الفنيين وقطع الغيار مستحيلاً." },

    /* ---------- how it works ---------- */
    "how.eyebrow": { en: "How it works", da: "Sådan virker det", es: "Cómo funciona", zh: "工作原理", ar: "آلية العمل" },
    "how.h2": { en: "Sense → Predict → Book → Service.", da: "Mål → Forudsig → Book → Servicér.", es: "Detectar → Predecir → Reservar → Servir.", zh: "感知 → 预测 → 预约 → 维护。", ar: "استشعار ← تنبؤ ← حجز ← صيانة." },
    "how.sub": { en: "One connected loop that runs 24/7/365 in the background, turning live data into a confirmed appointment before anyone has to ask.", da: "Ét sammenhængende kredsløb, der kører 24/7/365 i baggrunden og forvandler live-data til en bekræftet aftale, før nogen behøver at spørge.", es: "Un único ciclo conectado que funciona 24/7/365 en segundo plano y convierte los datos en vivo en una cita confirmada antes de que nadie tenga que pedirla.", zh: "一个全天候 24/7/365 后台运行的闭环，在任何人开口之前就把实时数据变成已确认的预约。", ar: "حلقة واحدة متصلة تعمل على مدار الساعة في الخلفية، وتحوّل البيانات الحية إلى موعد مؤكد قبل أن يطلبه أحد." },
    "how.step1": { en: "STEP 01", da: "TRIN 01", es: "PASO 01", zh: "步骤 01", ar: "الخطوة 01" },
    "how.step2": { en: "STEP 02", da: "TRIN 02", es: "PASO 02", zh: "步骤 02", ar: "الخطوة 02" },
    "how.step3": { en: "STEP 03", da: "TRIN 03", es: "PASO 03", zh: "步骤 03", ar: "الخطوة 03" },
    "how.step4": { en: "STEP 04", da: "TRIN 04", es: "PASO 04", zh: "步骤 04", ar: "الخطوة 04" },
    "how.s1.t": { en: "Sense", da: "Mål", es: "Detectar", zh: "感知", ar: "استشعار" },
    "how.s1.d": { en: "Onboard sensors stream raft health — CO₂, temperature, humidity and GPS — while it sits on the rack, no manual inspection needed.", da: "Sensorer ombord streamer flådens tilstand — CO₂, temperatur, fugt og GPS — mens den står på stativet, uden manuel inspektion.", es: "Sensores a bordo transmiten el estado de la balsa — CO₂, temperatura, humedad y GPS — mientras está en el soporte, sin inspección manual.", zh: "船上传感器在救生筏置于支架时实时传输其状态——CO₂、温度、湿度和 GPS，无需人工检查。", ar: "تبثّ المستشعرات على متن السفينة حالة الطوافة — ثاني أكسيد الكربون والحرارة والرطوبة وGPS — وهي على الحامل، دون فحص يدوي." },
    "how.s2.t": { en: "Predict", da: "Forudsig", es: "Predecir", zh: "预测", ar: "تنبؤ" },
    "how.s2.d": { en: "Pulse matches each vessel's live position and expiring certificate against global port availability to find the optimal service window.", da: "Pulse matcher hvert skibs live-position og udløbende certifikat mod global havnetilgængelighed for at finde det optimale servicevindue.", es: "Pulse cruza la posición en vivo de cada buque y su certificado por vencer con la disponibilidad portuaria global para hallar la ventana de servicio óptima.", zh: "Pulse 将每艘船的实时位置和即将到期的证书与全球港口可用性匹配，找出最佳维护时间窗。", ar: "يطابق Pulse الموقع الحي لكل سفينة وشهادتها المنتهية مع توفر الموانئ عالمياً لإيجاد أفضل نافذة خدمة." },
    "how.s3.t": { en: "Book", da: "Book", es: "Reservar", zh: "预约", ar: "حجز" },
    "how.s3.d": { en: "The platform reaches out to the customer with a ready-made appointment at the predicted harbour — confirmed in a tap, not a phone chain.", da: "Platformen kontakter kunden med en færdig aftale i den forudsagte havn — bekræftet med ét tryk, ikke en telefonkæde.", es: "La plataforma contacta al cliente con una cita lista en el puerto previsto, confirmada con un toque, no con una cadena de llamadas.", zh: "平台主动向客户发送在预测港口的现成预约——一键确认，无需层层电话。", ar: "تتواصل المنصة مع العميل بموعد جاهز في الميناء المتوقع — يُؤكَّد بنقرة واحدة بدلاً من سلسلة مكالمات." },
    "how.s4.t": { en: "Service", da: "Servicér", es: "Servir", zh: "维护", ar: "صيانة" },
    "how.s4.d": { en: "Stations receive balanced, forecasted workloads with parts pre-staged, so technicians spend time servicing — not chasing schedules.", da: "Stationer modtager balancerede, prognosticerede arbejdsbyrder med dele klargjort, så teknikere bruger tiden på service — ikke på at jagte planer.", es: "Las estaciones reciben cargas equilibradas y previstas con repuestos preparados, para que los técnicos dediquen el tiempo a reparar y no a perseguir agendas.", zh: "服务站获得均衡且可预测的工作量，备件提前备妥，技师把时间用在维护上而非追排程。", ar: "تتلقى المحطات أعباء عمل متوازنة ومتوقعة مع تجهيز القطع مسبقاً، فيقضي الفنيون وقتهم في الصيانة لا في ملاحقة الجداول." },

    /* ---------- features ---------- */
    "feat.eyebrow": { en: "The platform", da: "Platformen", es: "La plataforma", zh: "平台", ar: "المنصة" },
    "feat.h2": { en: "One platform across every department.", da: "Én platform på tværs af alle afdelinger.", es: "Una plataforma para todos los departamentos.", zh: "一个平台，贯通所有部门。", ar: "منصة واحدة عبر كل الأقسام." },
    "feat.sub": { en: "Pulse replaces the patchwork of disconnected tools with a single source of truth — from the sensor on the raft to the invoice on the desk.", da: "Pulse erstatter lappetæppet af usammenhængende værktøjer med én kilde til sandhed — fra sensoren på flåden til fakturaen på skrivebordet.", es: "Pulse sustituye el mosaico de herramientas inconexas por una única fuente de verdad, desde el sensor en la balsa hasta la factura en el escritorio.", zh: "Pulse 以单一可信数据源取代零散脱节的工具——从筏上的传感器到桌上的发票。", ar: "يستبدل Pulse خليط الأدوات المنفصلة بمصدر حقيقة واحد — من المستشعر على الطوافة إلى الفاتورة على المكتب." },
    "feat.f1.t": { en: "Predictive maintenance", da: "Forudsigende vedligehold", es: "Mantenimiento predictivo", zh: "预测性维护", ar: "صيانة تنبؤية" },
    "feat.f1.d": { en: "Live sensor data flags drift before failure, so servicing happens at the most opportune moment — not on a rigid calendar.", da: "Live-sensordata varsler afvigelser før fejl, så service sker på det mest belejlige tidspunkt — ikke efter en stiv kalender.", es: "Los datos de sensores detectan desviaciones antes del fallo, para reparar en el momento más oportuno y no según un calendario rígido.", zh: "实时传感器数据在故障前发现异常，让维护发生在最合适的时机，而非僵化的日程。", ar: "تكشف بيانات المستشعرات الانحراف قبل العطل، فتتم الصيانة في أنسب وقت لا وفق جدول جامد." },
    "feat.f2.t": { en: "Automated booking engine", da: "Automatisk booking-motor", es: "Motor de reservas automático", zh: "自动预约引擎", ar: "محرك حجز آلي" },
    "feat.f2.d": { en: "Vessels are matched to ports and slots automatically; customers confirm a proposed appointment instead of starting from scratch.", da: "Skibe matches automatisk til havne og tider; kunder bekræfter en foreslået aftale i stedet for at starte forfra.", es: "Los buques se asignan a puertos y horarios automáticamente; los clientes confirman una cita propuesta en vez de empezar de cero.", zh: "系统自动为船舶匹配港口与时段，客户只需确认建议的预约，无需从头开始。", ar: "تُطابَق السفن مع الموانئ والمواعيد تلقائياً؛ ويؤكّد العملاء موعداً مقترحاً بدل البدء من الصفر." },
    "feat.f3.t": { en: "Live fleet monitoring", da: "Live flådeovervågning", es: "Monitoreo de flota en vivo", zh: "实时船队监控", ar: "مراقبة حية للأسطول" },
    "feat.f3.d": { en: "A real-time global map of every tracked vessel, its position, certificate status and the nearest capable station.", da: "Et globalt realtidskort over hvert sporet skib, dets position, certifikatstatus og nærmeste kompetente station.", es: "Un mapa global en tiempo real de cada buque rastreado, su posición, el estado del certificado y la estación capaz más cercana.", zh: "实时全球地图展示每艘受监控船舶的位置、证书状态与最近的可承接服务站。", ar: "خريطة عالمية فورية لكل سفينة متتبَّعة وموقعها وحالة شهادتها وأقرب محطة قادرة." },
    "feat.f4.t": { en: "Compliance records", da: "Compliance-registre", es: "Registros de cumplimiento", zh: "合规记录", ar: "سجلات الامتثال" },
    "feat.f4.d": { en: "Every service is logged into an auditable trail authorities and class societies can trace — no more scattered paperwork.", da: "Hver service logges i et sporbart revisionsspor, som myndigheder og klasseselskaber kan følge — ikke mere spredt papirarbejde.", es: "Cada servicio queda en un registro auditable que autoridades y sociedades de clasificación pueden rastrear; se acabó el papeleo disperso.", zh: "每次维护都记录在可审计的轨迹中，供主管机关与船级社追溯——告别零散纸面工作。", ar: "تُسجَّل كل خدمة في سجل قابل للتدقيق يمكن للسلطات وهيئات التصنيف تتبّعه — لا مزيد من الأوراق المبعثرة." },
    "feat.f5.t": { en: "Spare-parts integration", da: "Reservedels-integration", es: "Integración de repuestos", zh: "备件集成", ar: "تكامل قطع الغيار" },
    "feat.f5.d": { en: "Booking ties straight into inventory, so the right components are reserved and pre-staged before the raft arrives.", da: "Booking kobles direkte til lageret, så de rette komponenter reserveres og klargøres, før flåden ankommer.", es: "La reserva se conecta directamente al inventario, así los componentes correctos se reservan y preparan antes de que llegue la balsa.", zh: "预约直接对接库存，在救生筏到达前预留并备妥所需部件。", ar: "يرتبط الحجز مباشرة بالمخزون، فتُحجز القطع الصحيحة وتُجهَّز قبل وصول الطوافة." },
    "feat.f6.t": { en: "Emergency SOS & GPS", da: "Nød-SOS & GPS", es: "SOS de emergencia y GPS", zh: "紧急 SOS 与 GPS", ar: "نداء استغاثة وGPS" },
    "feat.f6.d": { en: "If a raft is ever deployed, the same sensors broadcast an SOS with GPS coordinates to speed up rescue response.", da: "Hvis en flåde nogensinde udløses, sender de samme sensorer et SOS med GPS-koordinater for at fremskynde redningen.", es: "Si una balsa se despliega, los mismos sensores emiten un SOS con coordenadas GPS para acelerar el rescate.", zh: "一旦救生筏被启用,同样的传感器会发出带 GPS 坐标的 SOS,加快救援响应。", ar: "إذا نُشرت الطوافة، تبثّ المستشعرات نفسها نداء استغاثة بإحداثيات GPS لتسريع الإنقاذ." },

    /* ---------- showcase ---------- */
    "show.eyebrow": { en: "The control center", da: "Kontrolcentret", es: "El centro de control", zh: "控制中心", ar: "مركز التحكم" },
    "show.h2": { en: "See the whole fleet breathe.", da: "Se hele flåden ånde.", es: "Ve respirar a toda la flota.", zh: "纵观整个船队的脉动。", ar: "شاهد الأسطول بأكمله ينبض." },
    "show.sub": { en: "The Pulse dashboard gives planners one screen for everything: which certificates are about to expire, which vessels are nearby, and the slot the system already proposed.", da: "Pulse-dashboardet giver planlæggere én skærm til alt: hvilke certifikater der snart udløber, hvilke skibe der er i nærheden, og den tid systemet allerede har foreslået.", es: "El panel de Pulse da a los planificadores una sola pantalla para todo: qué certificados están por vencer, qué buques están cerca y el horario que el sistema ya propuso.", zh: "Pulse 仪表盘让规划者在一块屏幕上掌握全部:哪些证书即将到期、哪些船舶在附近,以及系统已建议的时段。", ar: "تمنح لوحة Pulse المخططين شاشة واحدة لكل شيء: أي الشهادات على وشك الانتهاء، وأي السفن قريبة، والموعد الذي اقترحه النظام بالفعل." },
    "show.li1": { en: "Certificates ranked by urgency, color-coded by risk", da: "Certifikater rangeret efter hastegrad, farvekodet efter risiko", es: "Certificados ordenados por urgencia, codificados por color según el riesgo", zh: "证书按紧急程度排序,按风险用颜色标注", ar: "شهادات مرتّبة حسب الأولوية وملوّنة حسب الخطورة" },
    "show.li2": { en: "One-click auto-booking at the predicted harbour", da: "Ét-kliks automatisk booking i den forudsagte havn", es: "Reserva automática con un clic en el puerto previsto", zh: "一键在预测港口自动预约", ar: "حجز تلقائي بنقرة واحدة في الميناء المتوقع" },
    "show.li3": { en: "Station capacity and technician load at a glance", da: "Stationskapacitet og teknikerbelastning på ét blik", es: "Capacidad de estación y carga de técnicos de un vistazo", zh: "一眼掌握服务站产能与技师负荷", ar: "سعة المحطة وحِمل الفنيين في لمحة" },
    "show.cta": { en: "Open the interactive demo →", da: "Åbn den interaktive demo →", es: "Abrir la demo interactiva →", zh: "打开交互式演示 →", ar: "افتح العرض التفاعلي ←" },

    /* ---------- stakeholders ---------- */
    "stake.eyebrow": { en: "For your team", da: "Til dit team", es: "Para tu equipo", zh: "为您的团队", ar: "لفريقك" },
    "stake.h2": { en: "Value for everyone in the loop.", da: "Værdi for alle i kæden.", es: "Valor para todos los implicados.", zh: "为流程中的每个人创造价值。", ar: "قيمة لكل من في المنظومة." },
    "stake.sub": { en: "From the fleet manager tracking expiry dates to the authority auditing records — Pulse is built around real stakeholder needs.", da: "Fra flådechefen, der følger udløbsdatoer, til myndigheden, der reviderer registre — Pulse er bygget om reelle interessenters behov.", es: "Desde el gestor de flota que sigue vencimientos hasta la autoridad que audita registros, Pulse se construye en torno a necesidades reales.", zh: "从追踪到期日的船队经理到审计记录的主管机关——Pulse 围绕真实的利益相关者需求构建。", ar: "من مدير الأسطول الذي يتابع تواريخ الانتهاء إلى الجهة التي تدقّق السجلات — بُني Pulse حول احتياجات أصحاب المصلحة الحقيقية." },
    "stake.tab1": { en: "Ship owners & fleet managers", da: "Rederier & flådechefer", es: "Armadores y gestores de flota", zh: "船东与船队经理", ar: "ملاك السفن ومديرو الأساطيل" },
    "stake.tab2": { en: "VIKING planners & technicians", da: "VIKING-planlæggere & teknikere", es: "Planificadores y técnicos de VIKING", zh: "VIKING 规划员与技师", ar: "مخططو وفنيو VIKING" },
    "stake.tab3": { en: "Authorities & class societies", da: "Myndigheder & klasseselskaber", es: "Autoridades y sociedades de clasificación", zh: "主管机关与船级社", ar: "السلطات وهيئات التصنيف" },
    "stake.tab4": { en: "VIKING administration", da: "VIKING-administration", es: "Administración de VIKING", zh: "VIKING 行政管理", ar: "إدارة VIKING" },
    "stake.needs": { en: "Needs", da: "Behov", es: "Necesidades", zh: "需求", ar: "الاحتياجات" },
    "stake.frustrations": { en: "Frustrations", da: "Frustrationer", es: "Frustraciones", zh: "痛点", ar: "الإحباطات" },
    "stake.delivers": { en: "What Pulse delivers", da: "Hvad Pulse leverer", es: "Lo que ofrece Pulse", zh: "Pulse 带来什么", ar: "ما يقدّمه Pulse" },
    "stake.p1.title": { en: "Ship owners & safety managers", da: "Rederier & sikkerhedschefer", es: "Armadores y gestores de seguridad", zh: "船东与安全经理", ar: "ملاك السفن ومديرو السلامة" },
    "stake.p1.role": { en: "Keep every vessel compliant and ready to sail", da: "Hold hvert skib compliant og sejlklart", es: "Mantener cada buque conforme y listo para zarpar", zh: "让每艘船持续合规、随时可航", ar: "إبقاء كل سفينة ممتثلة وجاهزة للإبحار" },
    "stake.p1.needs": { en: "A simple way to stay on top of certifications, expiry dates and service schedules across an entire fleet — without spreadsheets.", da: "En enkel måde at holde styr på certificeringer, udløbsdatoer og serviceplaner på tværs af en hel flåde — uden regneark.", es: "Una forma sencilla de controlar certificaciones, vencimientos y calendarios de servicio en toda la flota, sin hojas de cálculo.", zh: "无需电子表格,就能轻松掌控整支船队的认证、到期日与维护计划。", ar: "طريقة بسيطة لمتابعة الشهادات وتواريخ الانتهاء وجداول الخدمة عبر أسطول كامل — دون جداول بيانات." },
    "stake.p1.pain1": { en: "Manual tracking", da: "Manuel sporing", es: "Seguimiento manual", zh: "人工追踪", ar: "تتبّع يدوي" },
    "stake.p1.pain2": { en: "Scattered info", da: "Spredt information", es: "Información dispersa", zh: "信息分散", ar: "معلومات مبعثرة" },
    "stake.p1.pain3": { en: "Missed deadlines", da: "Overskredne frister", es: "Plazos incumplidos", zh: "错过期限", ar: "مواعيد فائتة" },
    "stake.p1.pain4": { en: "Fines & downtime", da: "Bøder & nedetid", es: "Multas e inactividad", zh: "罚款与停运", ar: "غرامات وتوقف" },
    "stake.p1.v1": { en: "A single dashboard of every vessel's compliance status", da: "Ét dashboard over hvert skibs compliance-status", es: "Un único panel del estado de cumplimiento de cada buque", zh: "单一仪表盘掌握每艘船的合规状态", ar: "لوحة واحدة لحالة امتثال كل سفينة" },
    "stake.p1.v2": { en: "Proactive alerts long before a certificate expires", da: "Proaktive advarsler længe før et certifikat udløber", es: "Alertas proactivas mucho antes de que venza un certificado", zh: "证书到期前及早主动提醒", ar: "تنبيهات استباقية قبل انتهاء الشهادة بوقت طويل" },
    "stake.p1.v3": { en: "Appointments proposed automatically — just confirm", da: "Aftaler foreslås automatisk — bekræft blot", es: "Citas propuestas automáticamente: solo confirmar", zh: "系统自动建议预约,只需确认", ar: "مواعيد تُقترح تلقائياً — ما عليك سوى التأكيد" },
    "stake.p2.title": { en: "Station planners & technicians", da: "Stationsplanlæggere & teknikere", es: "Planificadores y técnicos de estación", zh: "服务站规划员与技师", ar: "مخططو وفنيو المحطات" },
    "stake.p2.role": { en: "Plan and perform life-raft servicing", da: "Planlæg og udfør redningsflåde-service", es: "Planificar y realizar el servicio de balsas", zh: "规划并执行救生筏维护", ar: "تخطيط وتنفيذ صيانة الطوافات" },
    "stake.p2.needs": { en: "Accurate forecasts of workload and incoming demand so technicians and spare parts can be allocated efficiently.", da: "Præcise prognoser for arbejdsbyrde og indkommende efterspørgsel, så teknikere og reservedele kan fordeles effektivt.", es: "Pronósticos precisos de carga y demanda entrante para asignar técnicos y repuestos con eficiencia.", zh: "对工作量与来单的准确预测,以便高效调配技师与备件。", ar: "تنبؤات دقيقة بحجم العمل والطلب القادم لتوزيع الفنيين وقطع الغيار بكفاءة." },
    "stake.p2.pain1": { en: "Unpredictable bookings", da: "Uforudsigelige bookinger", es: "Reservas impredecibles", zh: "预约难以预测", ar: "حجوزات غير متوقعة" },
    "stake.p2.pain2": { en: "Last-minute requests", da: "Sidste-øjebliks-forespørgsler", es: "Solicitudes de último minuto", zh: "临时请求", ar: "طلبات اللحظة الأخيرة" },
    "stake.p2.pain3": { en: "No-shows", da: "Udeblivelser", es: "Ausencias", zh: "爽约", ar: "تغيّب" },
    "stake.p2.pain4": { en: "Idle capacity", da: "Uudnyttet kapacitet", es: "Capacidad ociosa", zh: "闲置产能", ar: "سعة عاطلة" },
    "stake.p2.v1": { en: "Demand forecasts that smooth out feast-or-famine weeks", da: "Efterspørgselsprognoser, der udjævner svingende uger", es: "Pronósticos de demanda que suavizan las semanas irregulares", zh: "需求预测,平滑忙闲不均的周次", ar: "تنبؤات بالطلب تُلطّف أسابيع التذبذب" },
    "stake.p2.v2": { en: "Balanced technician workloads, planned days ahead", da: "Balancerede teknikerbyrder, planlagt dage i forvejen", es: "Cargas de técnicos equilibradas, planificadas con días de antelación", zh: "技师工作量均衡,提前数日排定", ar: "أعباء عمل متوازنة للفنيين، مخطّطة قبل أيام" },
    "stake.p2.v3": { en: "Parts auto-reserved the moment a booking lands", da: "Dele reserveres automatisk, i samme øjeblik en booking lander", es: "Repuestos reservados automáticamente en cuanto llega una reserva", zh: "预约一到,备件即自动预留", ar: "قطع تُحجز تلقائياً لحظة وصول الحجز" },
    "stake.p3.title": { en: "Authorities & class societies", da: "Myndigheder & klasseselskaber", es: "Autoridades y sociedades de clasificación", zh: "主管机关与船级社", ar: "السلطات وهيئات التصنيف" },
    "stake.p3.role": { en: "Verify SOLAS and maritime safety compliance", da: "Verificér SOLAS og maritim sikkerheds-compliance", es: "Verificar el cumplimiento de SOLAS y la seguridad marítima", zh: "核验 SOLAS 与海事安全合规", ar: "التحقق من الامتثال لـ SOLAS وسلامة الملاحة" },
    "stake.p3.needs": { en: "Transparent, accurate and auditable servicing records that can be traced for any vessel at any time.", da: "Gennemsigtige, præcise og reviderbare serviceregistre, der kan spores for ethvert skib når som helst.", es: "Registros de servicio transparentes, precisos y auditables, rastreables para cualquier buque en cualquier momento.", zh: "透明、准确、可审计的维护记录,可随时追溯任何船舶。", ar: "سجلات خدمة شفافة ودقيقة وقابلة للتدقيق يمكن تتبّعها لأي سفينة في أي وقت." },
    "stake.p3.pain1": { en: "Incomplete docs", da: "Ufuldstændige dokumenter", es: "Documentos incompletos", zh: "文件不全", ar: "مستندات ناقصة" },
    "stake.p3.pain2": { en: "Hard to trace history", da: "Svært at spore historik", es: "Difícil rastrear el historial", zh: "历史难以追溯", ar: "صعوبة تتبّع السجل" },
    "stake.p3.pain3": { en: "Paper trails", da: "Papirspor", es: "Rastros en papel", zh: "纸面流程", ar: "أوراق متناثرة" },
    "stake.p3.v1": { en: "A complete, tamper-evident service history per raft", da: "En komplet, manipulationssikret servicehistorik pr. flåde", es: "Un historial de servicio completo e inviolable por balsa", zh: "每只救生筏完整且防篡改的维护历史", ar: "سجل خدمة كامل ومقاوم للعبث لكل طوافة" },
    "stake.p3.v2": { en: "Instant, exportable compliance reports", da: "Øjeblikkelige, eksporterbare compliance-rapporter", es: "Informes de cumplimiento instantáneos y exportables", zh: "即时、可导出的合规报告", ar: "تقارير امتثال فورية وقابلة للتصدير" },
    "stake.p3.v3": { en: "Full traceability from sensor reading to certificate", da: "Fuld sporbarhed fra sensoraflæsning til certifikat", es: "Trazabilidad total desde la lectura del sensor hasta el certificado", zh: "从传感器读数到证书的完整可追溯", ar: "تتبّع كامل من قراءة المستشعر إلى الشهادة" },
    "stake.p4.title": { en: "VIKING administration", da: "VIKING-administration", es: "Administración de VIKING", zh: "VIKING 行政管理", ar: "إدارة VIKING" },
    "stake.p4.role": { en: "Run the servicing business efficiently", da: "Drift serviceforretningen effektivt", es: "Gestionar el negocio de servicio con eficiencia", zh: "高效运营维护业务", ar: "إدارة أعمال الخدمة بكفاءة" },
    "stake.p4.needs": { en: "Better forecasting, higher resource utilisation, stronger customer retention and stable, predictable revenue.", da: "Bedre prognoser, højere ressourceudnyttelse, stærkere kundefastholdelse og stabil, forudsigelig omsætning.", es: "Mejores pronósticos, mayor uso de recursos, más retención de clientes e ingresos estables y predecibles.", zh: "更好的预测、更高的资源利用、更强的客户留存,以及稳定可预期的收入。", ar: "تنبؤ أفضل واستخدام أعلى للموارد واحتفاظ أقوى بالعملاء وإيرادات ثابتة ومتوقعة." },
    "stake.p4.pain1": { en: "Inefficient scheduling", da: "Ineffektiv planlægning", es: "Programación ineficiente", zh: "排程低效", ar: "جدولة غير فعّالة" },
    "stake.p4.pain2": { en: "Underused capacity", da: "Underudnyttet kapacitet", es: "Capacidad infrautilizada", zh: "产能未充分利用", ar: "سعة غير مستغلة" },
    "stake.p4.pain3": { en: "Missed opportunities", da: "Mistede muligheder", es: "Oportunidades perdidas", zh: "错失机会", ar: "فرص ضائعة" },
    "stake.p4.v1": { en: "One connected platform replacing siloed tools", da: "Én sammenhængende platform, der erstatter siloværktøjer", es: "Una plataforma conectada que reemplaza herramientas aisladas", zh: "一个互联平台取代孤立工具", ar: "منصة واحدة متصلة تحل محل الأدوات المنعزلة" },
    "stake.p4.v2": { en: "Higher utilisation and fewer empty service bays", da: "Højere udnyttelse og færre tomme serviceporte", es: "Mayor utilización y menos bahías de servicio vacías", zh: "更高利用率,更少空置工位", ar: "استخدام أعلى وحجرات خدمة فارغة أقل" },
    "stake.p4.v3": { en: "Data-driven decisions across the whole network", da: "Datadrevne beslutninger på tværs af hele netværket", es: "Decisiones basadas en datos en toda la red", zh: "在整个网络中做出数据驱动的决策", ar: "قرارات قائمة على البيانات عبر الشبكة بأكملها" },

    /* ---------- impact ---------- */
    "impact.eyebrow": { en: "The opportunity", da: "Muligheden", es: "La oportunidad", zh: "机遇", ar: "الفرصة" },
    "impact.h2": { en: "Small savings per booking. Massive at fleet scale.", da: "Små besparelser pr. booking. Enorme på flådeskala.", es: "Pequeños ahorros por reserva. Enormes a escala de flota.", zh: "每单省一点,船队规模见大效。", ar: "وفورات صغيرة لكل حجز. هائلة على مستوى الأسطول." },
    "impact.sub": { en: "VIKING services over 100,000 life rafts a year. Trim minutes and downtime from each one, and the impact compounds across the entire global network.", da: "VIKING servicerer over 100.000 redningsflåder om året. Spar minutter og nedetid på hver, og effekten forstærkes på tværs af hele det globale netværk.", es: "VIKING da servicio a más de 100.000 balsas al año. Recorta minutos e inactividad en cada una y el efecto se multiplica en toda la red global.", zh: "VIKING 每年维护超过 10 万只救生筏。每只节省几分钟与停运时间,效益便在全球网络中累积放大。", ar: "تخدم VIKING أكثر من 100,000 طوافة سنوياً. وفّر دقائق ووقت توقف من كل واحدة، فيتضاعف الأثر عبر الشبكة العالمية بأكملها." },
    "impact.c1.t": { en: "Life rafts serviced / year", da: "Redningsflåder serviceret / år", es: "Balsas atendidas / año", zh: "每年维护的救生筏", ar: "طوافات تمت خدمتها / سنة" },
    "impact.c1.d": { en: "Across 280+ stations and 800+ technicians. Every efficiency multiplies across enormous volume.", da: "På tværs af 280+ stationer og 800+ teknikere. Hver effektivitet ganges op over enorme mængder.", es: "En 280+ estaciones y 800+ técnicos. Cada eficiencia se multiplica en un volumen enorme.", zh: "覆盖 280+ 服务站与 800+ 技师。每一点效率都在庞大体量上倍增。", ar: "عبر أكثر من 280 محطة و800 فني. كل كفاءة تتضاعف عبر حجم هائل." },
    "impact.c2.t": { en: "Always-on matching", da: "Altid-tændt matchning", es: "Emparejamiento continuo", zh: "全天候匹配", ar: "مطابقة دائمة" },
    "impact.c2.d": { en: "The engine never sleeps — continuously pairing live ship positions with expiring certificates and open capacity.", da: "Motoren sover aldrig — den parrer løbende live-skibspositioner med udløbende certifikater og ledig kapacitet.", es: "El motor nunca duerme: empareja sin cesar posiciones de buques con certificados por vencer y capacidad disponible.", zh: "引擎从不休眠——持续将船舶实时位置与即将到期的证书及空闲产能配对。", ar: "المحرك لا ينام — يطابق باستمرار مواقع السفن الحية مع الشهادات المنتهية والسعة المتاحة." },
    "impact.c3.t": { en: "A lighter footprint", da: "Et lettere fodaftryk", es: "Una huella más ligera", zh: "更轻的足迹", ar: "بصمة أخف" },
    "impact.c3.d": { en: "Fewer unnecessary trips, no travel just to handle bookings, and servicing timed to the raft's real condition — not a rigid calendar.", da: "Færre unødvendige ture, ingen rejser blot for at håndtere bookinger, og service tilpasset flådens reelle tilstand — ikke en stiv kalender.", es: "Menos viajes innecesarios, sin desplazamientos solo para gestionar reservas y servicio según el estado real de la balsa, no un calendario rígido.", zh: "减少不必要的出行,无需仅为处理预约而奔波,维护时机贴合救生筏的真实状态,而非僵化日程。", ar: "رحلات أقل بلا داعٍ، ولا تنقّل لمجرد إدارة الحجوزات، وصيانة موقوتة وفق الحالة الفعلية للطوافة لا وفق جدول جامد." },

    /* ---------- cta ---------- */
    "cta.h2": { en: "Pilot it where VIKING is strongest.", da: "Pilotér det, hvor VIKING er stærkest.", es: "Pruébalo donde VIKING es más fuerte.", zh: "在 VIKING 最强的地方先行试点。", ar: "جرّبه حيث VIKING الأقوى." },
    "cta.sub": { en: "Start with VIKING-owned stations in Denmark and the Nordics, prove the model, then scale across the global network.", da: "Start med VIKING-ejede stationer i Danmark og Norden, bevis modellen, og skalér så på tværs af det globale netværk.", es: "Empieza con estaciones propias de VIKING en Dinamarca y los países nórdicos, valida el modelo y luego escala a la red global.", zh: "先从 VIKING 在丹麦及北欧的自有站点起步,验证模式,再推广至全球网络。", ar: "ابدأ بمحطات VIKING المملوكة في الدنمارك ودول الشمال، أثبت النموذج، ثم وسّعه عبر الشبكة العالمية." },
    "cta.launch": { en: "Launch the live dashboard", da: "Start live-dashboardet", es: "Abrir el panel en vivo", zh: "启动实时仪表盘", ar: "افتح لوحة التحكم الحية" },
    "cta.pilot": { en: "Request a pilot", da: "Anmod om pilot", es: "Solicitar un piloto", zh: "申请试点", ar: "اطلب تجربة" },
    "cta.note": { en: "A concept platform for the future of life-raft maintenance planning · VIKING Life-Saving Equipment, Esbjerg", da: "En konceptplatform for fremtidens vedligeholdelsesplanlægning af redningsflåder · VIKING Life-Saving Equipment, Esbjerg", es: "Una plataforma conceptual para el futuro de la planificación de mantenimiento de balsas · VIKING Life-Saving Equipment, Esbjerg", zh: "面向救生筏维护规划未来的概念平台 · VIKING Life-Saving Equipment,埃斯比约", ar: "منصة مفاهيمية لمستقبل تخطيط صيانة طوافات النجاة · VIKING Life-Saving Equipment، إسبيرغ" },

    /* ---------- footer ---------- */
    "footer.tagline": { en: "Connected, automated booking and predictive maintenance for the world's life rafts.", da: "Forbundet, automatisk booking og forudsigende vedligehold for verdens redningsflåder.", es: "Reservas conectadas y automáticas y mantenimiento predictivo para las balsas del mundo.", zh: "为全球救生筏提供互联、自动化的预约与预测性维护。", ar: "حجز متصل وآلي وصيانة تنبؤية لطوافات النجاة في العالم." },
    "footer.platform": { en: "Platform", da: "Platform", es: "Plataforma", zh: "平台", ar: "المنصة" },
    "footer.how": { en: "How it works", da: "Sådan virker det", es: "Cómo funciona", zh: "工作原理", ar: "آلية العمل" },
    "footer.features": { en: "Features", da: "Funktioner", es: "Funciones", zh: "功能", ar: "الميزات" },
    "footer.dashboard": { en: "Live dashboard", da: "Live-dashboard", es: "Panel en vivo", zh: "实时仪表盘", ar: "لوحة التحكم الحية" },
    "footer.impact": { en: "Impact", da: "Effekt", es: "Impacto", zh: "影响", ar: "الأثر" },
    "footer.stakeholders": { en: "Stakeholders", da: "Interessenter", es: "Implicados", zh: "利益相关者", ar: "أصحاب المصلحة" },
    "footer.owners": { en: "Ship owners", da: "Rederier", es: "Armadores", zh: "船东", ar: "ملاك السفن" },
    "footer.stations": { en: "Stations", da: "Stationer", es: "Estaciones", zh: "服务站", ar: "المحطات" },
    "footer.authorities": { en: "Authorities", da: "Myndigheder", es: "Autoridades", zh: "主管机关", ar: "السلطات" },
    "footer.admin": { en: "Administration", da: "Administration", es: "Administración", zh: "行政管理", ar: "الإدارة" },
    "footer.project": { en: "Project", da: "Projekt", es: "Proyecto", zh: "项目", ar: "المشروع" },
    "footer.opportunity": { en: "The opportunity", da: "Muligheden", es: "La oportunidad", zh: "机遇", ar: "الفرصة" },
    "footer.pilotprog": { en: "Pilot programme", da: "Pilotprogram", es: "Programa piloto", zh: "试点计划", ar: "برنامج تجريبي" },
    "footer.esbjerg": { en: "Esbjerg, Denmark", da: "Esbjerg, Danmark", es: "Esbjerg, Dinamarca", zh: "丹麦埃斯比约", ar: "إسبيرغ، الدنمارك" },
    "footer.solas": { en: "SOLAS compliant", da: "SOLAS-kompatibel", es: "Conforme a SOLAS", zh: "符合 SOLAS", ar: "متوافق مع SOLAS" },
    "footer.copy": { en: "© 2026 VIKING Pulse — concept prototype. Not affiliated with or endorsed by VIKING Life-Saving Equipment.", da: "© 2026 VIKING Pulse — konceptprototype. Ikke tilknyttet eller godkendt af VIKING Life-Saving Equipment.", es: "© 2026 VIKING Pulse — prototipo conceptual. No afiliado ni respaldado por VIKING Life-Saving Equipment.", zh: "© 2026 VIKING Pulse — 概念原型。与 VIKING Life-Saving Equipment 无关联,亦未获其认可。", ar: "© 2026 VIKING Pulse — نموذج مفاهيمي. غير تابع لـ VIKING Life-Saving Equipment أو معتمد منها." },
    "footer.demoonly": { en: "For demonstration purposes only", da: "Kun til demonstrationsformål", es: "Solo con fines de demostración", zh: "仅用于演示", ar: "لأغراض العرض فقط" },

    /* ---------- pilot form ---------- */
    "pilot.eyebrow": { en: "Pilot programme", da: "Pilotprogram", es: "Programa piloto", zh: "试点计划", ar: "برنامج تجريبي" },
    "pilot.title": { en: "Bring Pulse to your fleet.", da: "Bring Pulse til din flåde.", es: "Lleva Pulse a tu flota.", zh: "把 Pulse 带到您的船队。", ar: "اجلب Pulse إلى أسطولك." },
    "pilot.sub": { en: "Tell us about your operation and we'll scope a pilot — starting with VIKING-owned stations in Denmark & the Nordics.", da: "Fortæl os om din drift, så afgrænser vi en pilot — med start i VIKING-ejede stationer i Danmark og Norden.", es: "Cuéntanos sobre tu operación y definiremos un piloto, empezando por estaciones propias de VIKING en Dinamarca y los nórdicos.", zh: "告诉我们您的运营情况,我们将规划一个试点——先从 VIKING 在丹麦及北欧的自有站点开始。", ar: "أخبرنا عن عمليتك وسنحدّد نطاق تجربة — بدءاً بمحطات VIKING المملوكة في الدنمارك ودول الشمال." },
    "pilot.name": { en: "Full name", da: "Fulde navn", es: "Nombre completo", zh: "姓名", ar: "الاسم الكامل" },
    "pilot.email": { en: "Work email", da: "Arbejds-e-mail", es: "Correo de trabajo", zh: "工作邮箱", ar: "البريد المهني" },
    "pilot.company": { en: "Company", da: "Virksomhed", es: "Empresa", zh: "公司", ar: "الشركة" },
    "pilot.fleetsize": { en: "Vessels in fleet", da: "Skibe i flåden", es: "Buques en la flota", zh: "船队船舶数", ar: "عدد السفن في الأسطول" },
    "pilot.interest": { en: "Primary interest", da: "Primær interesse", es: "Interés principal", zh: "主要关注", ar: "الاهتمام الأساسي" },
    "pilot.int1": { en: "Automated booking", da: "Automatisk booking", es: "Reservas automáticas", zh: "自动预约", ar: "الحجز الآلي" },
    "pilot.int2": { en: "Predictive maintenance", da: "Forudsigende vedligehold", es: "Mantenimiento predictivo", zh: "预测性维护", ar: "الصيانة التنبؤية" },
    "pilot.int3": { en: "SOLAS compliance & records", da: "SOLAS-compliance & registre", es: "Cumplimiento y registros SOLAS", zh: "SOLAS 合规与记录", ar: "امتثال وسجلات SOLAS" },
    "pilot.int4": { en: "Fleet-wide certificate tracking", da: "Certifikatsporing for hele flåden", es: "Seguimiento de certificados de toda la flota", zh: "全船队证书追踪", ar: "تتبّع الشهادات لكامل الأسطول" },
    "pilot.int5": { en: "Everything — full platform", da: "Det hele — fuld platform", es: "Todo — plataforma completa", zh: "全部——完整平台", ar: "كل شيء — المنصة الكاملة" },
    "pilot.notes": { en: "Anything else? (optional)", da: "Andet? (valgfrit)", es: "¿Algo más? (opcional)", zh: "其他?(可选)", ar: "أي شيء آخر؟ (اختياري)" },
    "pilot.notesph": { en: "Tell us about your current process…", da: "Fortæl om jeres nuværende proces…", es: "Cuéntanos tu proceso actual…", zh: "请描述您当前的流程……", ar: "أخبرنا عن عمليتك الحالية…" },
    "pilot.submit": { en: "Request pilot scoping", da: "Anmod om pilot-afgrænsning", es: "Solicitar alcance del piloto", zh: "申请试点评估", ar: "اطلب تحديد نطاق التجربة" },
    "pilot.disclaimer": { en: "Demo form · submissions are saved locally in your browser, nothing is sent.", da: "Demo-formular · indsendelser gemmes lokalt i din browser, intet sendes.", es: "Formulario demo · los envíos se guardan localmente en tu navegador, no se envía nada.", zh: "演示表单 · 提交内容仅保存在您的浏览器本地,不会发送。", ar: "نموذج تجريبي · تُحفظ المدخلات محلياً في متصفحك ولا يُرسل شيء." },
    "pilot.done": { en: "Request received 🎉", da: "Anmodning modtaget 🎉", es: "Solicitud recibida 🎉", zh: "已收到申请 🎉", ar: "تم استلام الطلب 🎉" },
    "pilot.donemsg": { en: "Thanks! A VIKING Pulse specialist will be in touch to scope your pilot.", da: "Tak! En VIKING Pulse-specialist kontakter dig for at afgrænse din pilot.", es: "¡Gracias! Un especialista de VIKING Pulse te contactará para definir tu piloto.", zh: "感谢!VIKING Pulse 专员将与您联系以规划试点。", ar: "شكراً! سيتواصل معك أخصائي VIKING Pulse لتحديد نطاق تجربتك." },
    "pilot.donemsgp": { en: "Thanks, {name}! A VIKING Pulse specialist will reach out to {email} to scope your {fleet}-vessel pilot.", da: "Tak, {name}! En VIKING Pulse-specialist kontakter {email} for at afgrænse din pilot på {fleet} skibe.", es: "¡Gracias, {name}! Un especialista de VIKING Pulse contactará a {email} para definir tu piloto de {fleet} buques.", zh: "谢谢,{name}!VIKING Pulse 专员将通过 {email} 与您联系,规划您 {fleet} 艘船的试点。", ar: "شكراً، {name}! سيتواصل أخصائي VIKING Pulse عبر {email} لتحديد نطاق تجربتك لـ {fleet} سفينة." },
    "pilot.explore": { en: "Explore the dashboard", da: "Udforsk dashboardet", es: "Explorar el panel", zh: "体验仪表盘", ar: "استكشف لوحة التحكم" },
    "pilot.close": { en: "Close", da: "Luk", es: "Cerrar", zh: "关闭", ar: "إغلاق" },
    "pilot.errname": { en: "Please enter your name.", da: "Indtast venligst dit navn.", es: "Introduce tu nombre.", zh: "请输入您的姓名。", ar: "يرجى إدخال اسمك." },
    "pilot.erremail": { en: "Please enter a valid work email.", da: "Indtast venligst en gyldig arbejds-e-mail.", es: "Introduce un correo de trabajo válido.", zh: "请输入有效的工作邮箱。", ar: "يرجى إدخال بريد مهني صالح." },
    "pilot.errcompany": { en: "Please enter your company.", da: "Indtast venligst din virksomhed.", es: "Introduce tu empresa.", zh: "请输入您的公司。", ar: "يرجى إدخال شركتك." },

    /* ========================= DASHBOARD ========================= */
    "side.overview": { en: "Overview", da: "Overblik", es: "Resumen", zh: "总览", ar: "نظرة عامة" },
    "side.fleet": { en: "Live fleet", da: "Live-flåde", es: "Flota en vivo", zh: "实时船队", ar: "الأسطول الحي" },
    "side.bookings": { en: "Bookings", da: "Bookinger", es: "Reservas", zh: "预约", ar: "الحجوزات" },
    "side.compliance": { en: "Compliance", da: "Compliance", es: "Cumplimiento", zh: "合规", ar: "الامتثال" },
    "side.parts": { en: "Spare parts", da: "Reservedele", es: "Repuestos", zh: "备件", ar: "قطع الغيار" },
    "side.forecast": { en: "Forecast", da: "Prognose", es: "Pronóstico", zh: "预测", ar: "التنبؤ" },
    "side.foot": { en: "Prototype · data simulated & saved locally.", da: "Prototype · data er simuleret & gemt lokalt.", es: "Prototipo · datos simulados y guardados localmente.", zh: "原型 · 数据为模拟并保存在本地。", ar: "نموذج أولي · بيانات محاكاة ومحفوظة محلياً." },
    "side.reset": { en: "↺ Reset demo data", da: "↺ Nulstil demodata", es: "↺ Restablecer datos demo", zh: "↺ 重置演示数据", ar: "↺ إعادة ضبط بيانات العرض" },
    "side.back": { en: "← Back to overview site", da: "← Tilbage til oversigtssiden", es: "← Volver al sitio principal", zh: "← 返回介绍网站", ar: "← العودة إلى الموقع الرئيسي" },
    "top.live": { en: "Live matching active", da: "Live-matchning aktiv", es: "Emparejamiento en vivo activo", zh: "实时匹配进行中", ar: "المطابقة الحية نشطة" },

    "title.overview": { en: "Planner Overview", da: "Planlægger-overblik", es: "Resumen del planificador", zh: "规划总览", ar: "نظرة عامة للمخطّط" },
    "title.fleet": { en: "Live Fleet", da: "Live-flåde", es: "Flota en vivo", zh: "实时船队", ar: "الأسطول الحي" },
    "title.bookings": { en: "Bookings", da: "Bookinger", es: "Reservas", zh: "预约", ar: "الحجوزات" },
    "title.compliance": { en: "Compliance & SOLAS", da: "Compliance & SOLAS", es: "Cumplimiento y SOLAS", zh: "合规与 SOLAS", ar: "الامتثال وSOLAS" },
    "title.parts": { en: "Spare Parts", da: "Reservedele", es: "Repuestos", zh: "备件", ar: "قطع الغيار" },
    "title.forecast": { en: "Demand Forecast", da: "Efterspørgselsprognose", es: "Pronóstico de demanda", zh: "需求预测", ar: "توقّع الطلب" },
    "sub.overview": { en: "Esbjerg HQ · global network · ", da: "Esbjerg HK · globalt netværk · ", es: "Sede Esbjerg · red global · ", zh: "埃斯比约总部 · 全球网络 · ", ar: "مقر إسبيرغ · شبكة عالمية · " },
    "sub.fleet": { en: "Real-time vessel & certificate tracking · ", da: "Realtids skibs- & certifikatsporing · ", es: "Seguimiento de buques y certificados en tiempo real · ", zh: "实时船舶与证书追踪 · ", ar: "تتبّع فوري للسفن والشهادات · " },
    "sub.bookings": { en: "Auto-matched service appointments · ", da: "Auto-matchede serviceaftaler · ", es: "Citas de servicio emparejadas automáticamente · ", zh: "自动匹配的维护预约 · ", ar: "مواعيد خدمة مطابَقة تلقائياً · " },
    "sub.compliance": { en: "Auditable service records · ", da: "Reviderbare serviceregistre · ", es: "Registros de servicio auditables · ", zh: "可审计的维护记录 · ", ar: "سجلات خدمة قابلة للتدقيق · " },
    "sub.parts": { en: "Inventory linked to bookings · ", da: "Lager koblet til bookinger · ", es: "Inventario vinculado a reservas · ", zh: "与预约联动的库存 · ", ar: "مخزون مرتبط بالحجوزات · " },
    "sub.forecast": { en: "Capacity planning across the network · ", da: "Kapacitetsplanlægning på tværs af netværket · ", es: "Planificación de capacidad en la red · ", zh: "全网络产能规划 · ", ar: "تخطيط السعة عبر الشبكة · " },

    "kpi.tracked": { en: "Tracked vessels", da: "Sporede skibe", es: "Buques rastreados", zh: "受监控船舶", ar: "السفن المتتبَّعة" },
    "kpi.expiring": { en: "Certificates ≤ 30 days", da: "Certifikater ≤ 30 dage", es: "Certificados ≤ 30 días", zh: "证书 ≤ 30 天", ar: "شهادات ≤ 30 يوماً" },
    "kpi.active": { en: "Active bookings", da: "Aktive bookinger", es: "Reservas activas", zh: "有效预约", ar: "حجوزات نشطة" },
    "kpi.util": { en: "Avg station utilisation", da: "Gns. stationsudnyttelse", es: "Utilización media de estaciones", zh: "平均服务站利用率", ar: "متوسط استخدام المحطات" },
    "kpi.d.live": { en: "▲ live feed", da: "▲ live-feed", es: "▲ en vivo", zh: "▲ 实时", ar: "▲ بث حي" },
    "kpi.d.needs": { en: "needs action", da: "kræver handling", es: "requiere acción", zh: "需要处理", ar: "يتطلب إجراءً" },
    "kpi.d.handled": { en: "all handled", da: "alt håndteret", es: "todo gestionado", zh: "已全部处理", ar: "تمت المعالجة" },
    "kpi.d.matched": { en: "▲ auto-matched", da: "▲ auto-matchet", es: "▲ auto-emparejado", zh: "▲ 自动匹配", ar: "▲ مطابقة تلقائية" },
    "kpi.d.util": { en: "▲ +14% vs manual", da: "▲ +14% vs manuelt", es: "▲ +14% vs manual", zh: "▲ 较人工 +14%", ar: "▲ +14٪ مقارنة باليدوي" },

    "card.map": { en: "Live fleet map", da: "Live-flådekort", es: "Mapa de flota en vivo", zh: "实时船队地图", ar: "خريطة الأسطول الحية" },
    "card.mapHint": { en: "hover a vessel · ● compliant ● expiring ● critical", da: "hold over et skib · ● compliant ● udløber ● kritisk", es: "pasa el cursor por un buque · ● conforme ● por vencer ● crítico", zh: "悬停查看船舶 · ● 合规 ● 临期 ● 紧急", ar: "مرّر فوق سفينة · ● ممتثل ● ينتهي قريباً ● حرج" },
    "card.forecast": { en: "Demand forecast — next 7 days", da: "Efterspørgselsprognose — næste 7 dage", es: "Pronóstico de demanda — próximos 7 días", zh: "需求预测 — 未来 7 天", ar: "توقّع الطلب — الأيام السبعة القادمة" },
    "card.forecastHint": { en: "Esbjerg station · rafts/day", da: "Esbjerg-station · flåder/dag", es: "Estación Esbjerg · balsas/día", zh: "埃斯比约站 · 筏/天", ar: "محطة إسبيرغ · طوافات/يوم" },
    "card.queue": { en: "Expiring certificates", da: "Udløbende certifikater", es: "Certificados por vencer", zh: "临期证书", ar: "الشهادات المنتهية قريباً" },
    "card.queueHint": { en: "sorted by urgency", da: "sorteret efter hastegrad", es: "ordenados por urgencia", zh: "按紧急程度排序", ar: "مرتّبة حسب الأولوية" },
    "card.cap": { en: "Station capacity", da: "Stationskapacitet", es: "Capacidad de estación", zh: "服务站产能", ar: "سعة المحطة" },
    "card.capHint": { en: "this week", da: "denne uge", es: "esta semana", zh: "本周", ar: "هذا الأسبوع" },
    "card.feed": { en: "Live activity", da: "Live-aktivitet", es: "Actividad en vivo", zh: "实时动态", ar: "النشاط الحي" },
    "card.feedHint": { en: "auto-matching engine", da: "auto-matchning-motor", es: "motor de emparejamiento", zh: "自动匹配引擎", ar: "محرك المطابقة التلقائية" },
    "legend.compliant": { en: "Compliant", da: "Compliant", es: "Conforme", zh: "合规", ar: "ممتثل" },
    "legend.expiring": { en: "Expiring ≤ 30d", da: "Udløber ≤ 30d", es: "Por vencer ≤ 30d", zh: "≤ 30 天到期", ar: "ينتهي ≤ 30 يوماً" },
    "legend.critical": { en: "Critical ≤ 10d", da: "Kritisk ≤ 10d", es: "Crítico ≤ 10d", zh: "≤ 10 天紧急", ar: "حرج ≤ 10 أيام" },
    "map.meta": { en: "{n} vessels in view · 280+ stations network", da: "{n} skibe i visning · 280+ stationer", es: "{n} buques a la vista · red de 280+ estaciones", zh: "视图内 {n} 艘船 · 280+ 站点网络", ar: "{n} سفينة في العرض · شبكة 280+ محطة" },

    "queue.allclear": { en: "All clear ✓", da: "Alt i orden ✓", es: "Todo en orden ✓", zh: "一切就绪 ✓", ar: "كل شيء على ما يرام ✓" },
    "queue.none": { en: "No certificates need action right now.", da: "Ingen certifikater kræver handling lige nu.", es: "Ningún certificado requiere acción ahora.", zh: "目前没有证书需要处理。", ar: "لا توجد شهادات تتطلب إجراءً الآن." },

    /* toolbars */
    "search.ph": { en: "Search vessel, type or flag…", da: "Søg skib, type eller flag…", es: "Buscar buque, tipo o bandera…", zh: "搜索船舶、类型或船旗……", ar: "ابحث عن سفينة أو نوع أو علم…" },
    "chip.all": { en: "All", da: "Alle", es: "Todos", zh: "全部", ar: "الكل" },
    "chip.crit": { en: "Critical", da: "Kritisk", es: "Críticos", zh: "紧急", ar: "حرج" },
    "chip.warn": { en: "Expiring", da: "Udløber", es: "Por vencer", zh: "临期", ar: "ينتهي قريباً" },
    "chip.ok": { en: "Compliant", da: "Compliant", es: "Conformes", zh: "合规", ar: "ممتثل" },
    "chip.booked": { en: "Booked", da: "Booket", es: "Reservados", zh: "已预约", ar: "محجوز" },
    "chip.upcoming": { en: "Upcoming", da: "Kommende", es: "Próximas", zh: "即将到来", ar: "القادمة" },
    "chip.completed": { en: "Completed", da: "Afsluttet", es: "Completadas", zh: "已完成", ar: "مكتملة" },
    "chip.cancelled": { en: "Cancelled", da: "Annulleret", es: "Canceladas", zh: "已取消", ar: "ملغاة" },
    "chip.allv": { en: "All vessels", da: "Alle skibe", es: "Todos los buques", zh: "所有船舶", ar: "كل السفن" },
    "chip.atrisk": { en: "At risk", da: "I risiko", es: "En riesgo", zh: "有风险", ar: "معرّضة للخطر" },
    "chip.serviced": { en: "Recently serviced", da: "Nyligt serviceret", es: "Atendidos recientemente", zh: "近期已维护", ar: "تمت خدمتها مؤخراً" },

    /* buttons */
    "btn.autobook": { en: "Auto-book", da: "Auto-book", es: "Auto-reservar", zh: "自动预约", ar: "حجز تلقائي" },
    "btn.view": { en: "View", da: "Vis", es: "Ver", zh: "查看", ar: "عرض" },
    "btn.complete": { en: "Mark complete", da: "Markér færdig", es: "Marcar completada", zh: "标记完成", ar: "وضع كمكتمل" },
    "btn.reschedule": { en: "Reschedule", da: "Ombook", es: "Reprogramar", zh: "改期", ar: "إعادة جدولة" },
    "btn.cancel": { en: "Cancel", da: "Annullér", es: "Cancelar", zh: "取消", ar: "إلغاء" },
    "btn.newbooking": { en: "+ New booking", da: "+ Ny booking", es: "+ Nueva reserva", zh: "+ 新建预约", ar: "+ حجز جديد" },
    "btn.export": { en: "⤓ Export audit (CSV)", da: "⤓ Eksportér revision (CSV)", es: "⤓ Exportar auditoría (CSV)", zh: "⤓ 导出审计 (CSV)", ar: "⤓ تصدير التدقيق (CSV)" },
    "btn.reorder": { en: "Reorder", da: "Genbestil", es: "Reordenar", zh: "补订", ar: "إعادة طلب" },
    "btn.bulkcrit": { en: "Auto-book all critical", da: "Auto-book alle kritiske", es: "Auto-reservar todos los críticos", zh: "自动预约全部紧急", ar: "حجز تلقائي لكل الحرجة" },
    "btn.bulkexp": { en: "Auto-book all expiring", da: "Auto-book alle udløbende", es: "Auto-reservar todos los por vencer", zh: "自动预约全部临期", ar: "حجز تلقائي لكل المنتهية قريباً" },
    "btn.confirm": { en: "Confirm & notify customer", da: "Bekræft & notificér kunde", es: "Confirmar y notificar al cliente", zh: "确认并通知客户", ar: "تأكيد وإشعار العميل" },
    "btn.done": { en: "Done", da: "Færdig", es: "Listo", zh: "完成", ar: "تم" },
    "btn.close": { en: "Close", da: "Luk", es: "Cerrar", zh: "关闭", ar: "إغلاق" },
    "btn.save": { en: "Save", da: "Gem", es: "Guardar", zh: "保存", ar: "حفظ" },
    "btn.autobookService": { en: "Auto-book service", da: "Auto-book service", es: "Auto-reservar servicio", zh: "自动预约维护", ar: "حجز خدمة تلقائي" },
    "btn.alreadyBooked": { en: "Already booked", da: "Allerede booket", es: "Ya reservado", zh: "已预约", ar: "محجوز بالفعل" },

    /* table headers */
    "th.vessel": { en: "Vessel", da: "Skib", es: "Buque", zh: "船舶", ar: "السفينة" },
    "th.type": { en: "Type", da: "Type", es: "Tipo", zh: "类型", ar: "النوع" },
    "th.flag": { en: "Flag", da: "Flag", es: "Bandera", zh: "船旗", ar: "العلم" },
    "th.region": { en: "Region", da: "Region", es: "Región", zh: "区域", ar: "المنطقة" },
    "th.rafts": { en: "Rafts", da: "Flåder", es: "Balsas", zh: "筏数", ar: "الطوافات" },
    "th.expiry": { en: "Cert expiry", da: "Cert. udløb", es: "Vto. certificado", zh: "证书到期", ar: "انتهاء الشهادة" },
    "th.status": { en: "Status", da: "Status", es: "Estado", zh: "状态", ar: "الحالة" },
    "th.imo": { en: "IMO", da: "IMO", es: "IMO", zh: "IMO", ar: "IMO" },
    "th.lastservice": { en: "Last service", da: "Sidste service", es: "Último servicio", zh: "上次维护", ar: "آخر خدمة" },
    "th.certvalid": { en: "Cert valid for", da: "Cert. gyldig i", es: "Certificado válido por", zh: "证书有效期", ar: "صلاحية الشهادة" },
    "th.solas": { en: "SOLAS status", da: "SOLAS-status", es: "Estado SOLAS", zh: "SOLAS 状态", ar: "حالة SOLAS" },
    "th.cert": { en: "Certificate", da: "Certifikat", es: "Certificado", zh: "证书", ar: "الشهادة" },

    /* statuses */
    "status.crit": { en: "Critical", da: "Kritisk", es: "Crítico", zh: "紧急", ar: "حرج" },
    "status.warn": { en: "Expiring", da: "Udløber", es: "Por vencer", zh: "临期", ar: "ينتهي قريباً" },
    "status.ok": { en: "Compliant", da: "Compliant", es: "Conforme", zh: "合规", ar: "ممتثل" },
    "status.booked": { en: "Booked", da: "Booket", es: "Reservado", zh: "已预约", ar: "محجوز" },
    "bstatus.upcoming": { en: "upcoming", da: "kommende", es: "próxima", zh: "即将", ar: "قادمة" },
    "bstatus.completed": { en: "completed", da: "afsluttet", es: "completada", zh: "已完成", ar: "مكتملة" },
    "bstatus.cancelled": { en: "cancelled", da: "annulleret", es: "cancelada", zh: "已取消", ar: "ملغاة" },
    "fleet.scheduled": { en: "scheduled", da: "planlagt", es: "programado", zh: "已排定", ar: "مجدول" },
    "fleet.none": { en: "No vessels match", da: "Ingen skibe matcher", es: "No hay buques que coincidan", zh: "无匹配船舶", ar: "لا توجد سفن مطابقة" },
    "fleet.noneSub": { en: "Try a different search or filter.", da: "Prøv en anden søgning eller filter.", es: "Prueba otra búsqueda o filtro.", zh: "请尝试其他搜索或筛选。", ar: "جرّب بحثاً أو مرشّحاً آخر." },

    /* bookings */
    "book.none": { en: "No {f} bookings yet", da: "Ingen {f} bookinger endnu", es: "Aún no hay reservas {f}", zh: "暂无{f}预约", ar: "لا توجد حجوزات {f} بعد" },
    "book.noneAll": { en: "No bookings yet", da: "Ingen bookinger endnu", es: "Aún no hay reservas", zh: "暂无预约", ar: "لا توجد حجوزات بعد" },
    "book.noneSub": { en: "Auto-book a vessel from the fleet or the overview queue to see it here.", da: "Auto-book et skib fra flåden eller oversigtskøen for at se det her.", es: "Auto-reserva un buque desde la flota o la cola del resumen para verlo aquí.", zh: "从船队或总览队列自动预约一艘船,即可在此看到。", ar: "احجز سفينة تلقائياً من الأسطول أو قائمة النظرة العامة لتظهر هنا." },
    "book.partsReserved": { en: "Parts reserved: ", da: "Reserverede dele: ", es: "Repuestos reservados: ", zh: "已预留备件:", ar: "القطع المحجوزة: " },

    /* compliance */
    "comp.tile.ok": { en: "Compliant vessels", da: "Compliante skibe", es: "Buques conformes", zh: "合规船舶", ar: "سفن ممتثلة" },
    "comp.tile.warn": { en: "Expiring ≤ 30 days", da: "Udløber ≤ 30 dage", es: "Por vencer ≤ 30 días", zh: "≤ 30 天到期", ar: "ينتهي ≤ 30 يوماً" },
    "comp.tile.crit": { en: "Critical / at risk", da: "Kritisk / i risiko", es: "Crítico / en riesgo", zh: "紧急 / 有风险", ar: "حرج / معرّض للخطر" },
    "comp.tile.serviced": { en: "Serviced this cycle", da: "Serviceret i denne cyklus", es: "Atendidos este ciclo", zh: "本周期已维护", ar: "تمت خدمته هذه الدورة" },
    "comp.serviceBooked": { en: "Service booked", da: "Service booket", es: "Servicio reservado", zh: "已预约维护", ar: "تم حجز الخدمة" },
    "comp.issued": { en: "issued after service", da: "udstedes efter service", es: "emitido tras el servicio", zh: "维护后签发", ar: "يُصدر بعد الخدمة" },
    "comp.current": { en: "current", da: "aktuel", es: "vigente", zh: "有效", ar: "حالية" },

    /* parts */
    "parts.low1": { en: "{n} part at or below reorder level — reorder to keep bookings flowing.", da: "{n} del på eller under genbestillingsniveau — genbestil for at holde bookingerne i gang.", es: "{n} repuesto en o por debajo del nivel de reorden — reordena para mantener las reservas.", zh: "{n} 种备件已达到或低于补订水平——请补订以保障预约。", ar: "{n} قطعة عند مستوى إعادة الطلب أو دونه — أعد الطلب لإبقاء الحجوزات مستمرة." },
    "parts.low": { en: "{n} parts at or below reorder level — reorder to keep bookings flowing.", da: "{n} dele på eller under genbestillingsniveau — genbestil for at holde bookingerne i gang.", es: "{n} repuestos en o por debajo del nivel de reorden — reordena para mantener las reservas.", zh: "{n} 种备件已达到或低于补订水平——请补订以保障预约。", ar: "{n} قطعة عند مستوى إعادة الطلب أو دونه — أعد الطلب لإبقاء الحجوزات مستمرة." },
    "parts.legendAvail": { en: "Available", da: "Tilgængelig", es: "Disponible", zh: "可用", ar: "متاح" },
    "parts.legendReserved": { en: "Reserved (committed to bookings)", da: "Reserveret (bundet til bookinger)", es: "Reservado (comprometido en reservas)", zh: "已预留(用于预约)", ar: "محجوز (مخصّص للحجوزات)" },
    "parts.available": { en: "Available", da: "Tilgængelig", es: "Disponible", zh: "可用", ar: "متاح" },
    "parts.reserved": { en: "Reserved", da: "Reserveret", es: "Reservado", zh: "已预留", ar: "محجوز" },
    "parts.instock": { en: "In stock {stock} · reorder @ {reorder}", da: "På lager {stock} · genbestil @ {reorder}", es: "En stock {stock} · reordenar @ {reorder}", zh: "库存 {stock} · 补订线 {reorder}", ar: "في المخزون {stock} · إعادة الطلب عند {reorder}" },
    "badge.low": { en: "Low", da: "Lav", es: "Bajo", zh: "偏低", ar: "منخفض" },
    "badge.ok": { en: "OK", da: "OK", es: "OK", zh: "正常", ar: "جيد" },
    "parts.explainTitle": { en: "How parts link to bookings", da: "Sådan kobles dele til bookinger", es: "Cómo se vinculan los repuestos a las reservas", zh: "备件如何与预约联动", ar: "كيف ترتبط القطع بالحجوزات" },
    "parts.explainHint": { en: "auto-reserved on booking", da: "auto-reserveret ved booking", es: "reservado automáticamente al reservar", zh: "预约时自动预留", ar: "تُحجز تلقائياً عند الحجز" },
    "parts.explain": { en: "When a service is auto-booked, Pulse instantly reserves the right components per raft (CO₂ cylinders, hydrostatic release units, flare sets, ration packs) plus per-booking consumables. Reserved stock is committed; completing a service consumes it; cancelling releases it back.", da: "Når en service auto-bookes, reserverer Pulse straks de rette komponenter pr. flåde (CO₂-flasker, hydrostatiske udløsere, nødblussæt, nødrationer) plus forbrugsstoffer pr. booking. Reserveret lager er bundet; en afsluttet service forbruger det; annullering frigiver det.", es: "Cuando se auto-reserva un servicio, Pulse reserva al instante los componentes correctos por balsa (cilindros de CO₂, unidades de liberación hidrostática, bengalas, raciones) más consumibles por reserva. El stock reservado queda comprometido; completar un servicio lo consume; cancelar lo libera.", zh: "当自动预约维护时,Pulse 会立即按每只筏预留所需部件(CO₂ 气瓶、静水压力释放器、信号弹组、口粮包)以及每单耗材。预留库存即被占用;完成维护即消耗;取消则释放。", ar: "عند الحجز التلقائي لخدمة، يحجز Pulse فوراً القطع المناسبة لكل طوافة (أسطوانات CO₂، وحدات تحرّر هيدروستاتي، أطقم شعلات، حصص إعاشة) إضافة إلى مستهلكات لكل حجز. المخزون المحجوز ملتزَم؛ وإتمام الخدمة يستهلكه؛ والإلغاء يعيده." },

    /* forecast */
    "fc.title": { en: "Network demand vs. capacity", da: "Netværkets efterspørgsel vs. kapacitet", es: "Demanda de la red vs. capacidad", zh: "网络需求与产能对比", ar: "طلب الشبكة مقابل السعة" },
    "fc.hint": { en: "next 14 days · rafts", da: "næste 14 dage · flåder", es: "próximos 14 días · balsas", zh: "未来 14 天 · 筏", ar: "الأيام الـ14 القادمة · طوافات" },
    "fc.legendDemand": { en: "Forecast demand", da: "Prognosticeret efterspørgsel", es: "Demanda prevista", zh: "预测需求", ar: "الطلب المتوقع" },
    "fc.legendOver": { en: "Over capacity", da: "Over kapacitet", es: "Sobre capacidad", zh: "超出产能", ar: "تجاوز السعة" },
    "fc.capacity": { en: "Network capacity ≈ {n}/day", da: "Netværkskapacitet ≈ {n}/dag", es: "Capacidad de red ≈ {n}/día", zh: "网络产能 ≈ {n}/天", ar: "سعة الشبكة ≈ {n}/يوم" },
    "fc.weekly": { en: "Weekly capacity", da: "Ugentlig kapacitet", es: "Capacidad semanal", zh: "周产能", ar: "السعة الأسبوعية" },
    "fc.booked": { en: "Booked via Pulse", da: "Booket via Pulse", es: "Reservado vía Pulse", zh: "经 Pulse 预约", ar: "محجوز عبر Pulse" },
    "fc.bays": { en: "{country} · {n} bays", da: "{country} · {n} porte", es: "{country} · {n} bahías", zh: "{country} · {n} 个工位", ar: "{country} · {n} حجرات" },
    "fc.rafts": { en: "{n} rafts", da: "{n} flåder", es: "{n} balsas", zh: "{n} 筏", ar: "{n} طوافة" },
    "fc.hot": { en: "⚠ Near capacity — Pulse suggests routing new bookings to a neighbouring station.", da: "⚠ Nær kapacitet — Pulse foreslår at sende nye bookinger til en nabostation.", es: "⚠ Cerca del límite — Pulse sugiere derivar nuevas reservas a una estación vecina.", zh: "⚠ 接近满载——Pulse 建议将新预约分流至邻近站点。", ar: "⚠ قرب السعة القصوى — يقترح Pulse توجيه الحجوزات الجديدة إلى محطة مجاورة." },
    "fc.ok": { en: "✓ Healthy headroom for {n} more rafts this week.", da: "✓ Sund kapacitet til {n} flere flåder denne uge.", es: "✓ Margen sano para {n} balsas más esta semana.", zh: "✓ 本周尚有余量可再接 {n} 只筏。", ar: "✓ هامش صحي لـ {n} طوافة إضافية هذا الأسبوع." },

    /* modal: booking */
    "modal.newbooking": { en: "New booking", da: "Ny booking", es: "Nueva reserva", zh: "新建预约", ar: "حجز جديد" },
    "modal.chooseVessel": { en: "Select a vessel awaiting service", da: "Vælg et skib, der afventer service", es: "Selecciona un buque pendiente de servicio", zh: "选择一艘待维护的船舶", ar: "اختر سفينة بانتظار الخدمة" },
    "modal.choose": { en: "— choose vessel —", da: "— vælg skib —", es: "— elegir buque —", zh: "— 选择船舶 —", ar: "— اختر سفينة —" },
    "modal.toExpiry": { en: "{d}d to expiry", da: "{d}d til udløb", es: "{d}d para vencer", zh: "{d} 天后到期", ar: "{d}ي حتى الانتهاء" },
    "modal.autoHint": { en: "Pulse will propose the predicted harbour and open service slots automatically.", da: "Pulse foreslår automatisk den forudsagte havn og ledige servicetider.", es: "Pulse propondrá automáticamente el puerto previsto y los horarios disponibles.", zh: "Pulse 将自动建议预测港口与可用维护时段。", ar: "سيقترح Pulse تلقائياً الميناء المتوقع والمواعيد المتاحة." },
    "modal.autobook": { en: "Auto-book service", da: "Auto-book service", es: "Auto-reservar servicio", zh: "自动预约维护", ar: "حجز خدمة تلقائي" },
    "modal.matchFound": { en: "Match found", da: "Match fundet", es: "Coincidencia encontrada", zh: "已找到匹配", ar: "تم العثور على تطابق" },
    "modal.matchSub": { en: "Pulse paired live position + certificate + open capacity", da: "Pulse parrede live-position + certifikat + ledig kapacitet", es: "Pulse emparejó posición + certificado + capacidad disponible", zh: "Pulse 已匹配实时位置 + 证书 + 空闲产能", ar: "طابَق Pulse الموقع الحي + الشهادة + السعة المتاحة" },
    "modal.vessel": { en: "Vessel", da: "Skib", es: "Buque", zh: "船舶", ar: "السفينة" },
    "modal.raftsToService": { en: "Life rafts to service", da: "Redningsflåder til service", es: "Balsas a reparar", zh: "需维护的救生筏", ar: "طوافات للخدمة" },
    "modal.certExpiresIn": { en: "Certificate expires in", da: "Certifikat udløber om", es: "El certificado vence en", zh: "证书将在以下时间到期", ar: "تنتهي الشهادة خلال" },
    "modal.days": { en: "{d} days", da: "{d} dage", es: "{d} días", zh: "{d} 天", ar: "{d} يوماً" },
    "modal.harbour": { en: "Predicted harbour", da: "Forudsagt havn", es: "Puerto previsto", zh: "预测港口", ar: "الميناء المتوقع" },
    "modal.proposedSlots": { en: "Proposed service slots", da: "Foreslåede servicetider", es: "Horarios de servicio propuestos", zh: "建议的维护时段", ar: "مواعيد الخدمة المقترحة" },
    "modal.partsReserved": { en: "Parts auto-reserved", da: "Dele auto-reserveret", es: "Repuestos auto-reservados", zh: "自动预留备件", ar: "قطع محجوزة تلقائياً" },
    "modal.confirmed": { en: "Booking confirmed", da: "Booking bekræftet", es: "Reserva confirmada", zh: "预约已确认", ar: "تم تأكيد الحجز" },
    "modal.scheduledTitle": { en: "{vessel} is scheduled", da: "{vessel} er planlagt", es: "{vessel} está programado", zh: "{vessel} 已排定", ar: "تمت جدولة {vessel}" },
    "modal.scheduledBody": { en: "{rafts} rafts · {port} · {date} {time} ({bay})", da: "{rafts} flåder · {port} · {date} {time} ({bay})", es: "{rafts} balsas · {port} · {date} {time} ({bay})", zh: "{rafts} 筏 · {port} · {date} {time}({bay})", ar: "{rafts} طوافة · {port} · {date} {time} ({bay})" },
    "modal.notified": { en: "The customer has been notified automatically and parts are reserved.", da: "Kunden er notificeret automatisk, og dele er reserveret.", es: "El cliente fue notificado automáticamente y los repuestos están reservados.", zh: "已自动通知客户,备件已预留。", ar: "تم إشعار العميل تلقائياً وحُجزت القطع." },
    "modal.type": { en: "Type", da: "Type", es: "Tipo", zh: "类型", ar: "النوع" },
    "modal.flagimo": { en: "Flag · IMO", da: "Flag · IMO", es: "Bandera · IMO", zh: "船旗 · IMO", ar: "العلم · IMO" },
    "modal.region": { en: "Region", da: "Region", es: "Región", zh: "区域", ar: "المنطقة" },
    "modal.rafts": { en: "Life rafts", da: "Redningsflåder", es: "Balsas", zh: "救生筏", ar: "طوافات النجاة" },
    "modal.certificate": { en: "Certificate", da: "Certifikat", es: "Certificado", zh: "证书", ar: "الشهادة" },
    "modal.lastService": { en: "Last service", da: "Sidste service", es: "Último servicio", zh: "上次维护", ar: "آخر خدمة" },
    "modal.sensors": { en: "Live sensor readings (on rack)", da: "Live-sensoraflæsninger (på stativ)", es: "Lecturas de sensores en vivo (en soporte)", zh: "实时传感器读数(在架)", ar: "قراءات المستشعرات الحية (على الحامل)" },
    "modal.co2": { en: "CO₂ cylinder", da: "CO₂-flaske", es: "Cilindro de CO₂", zh: "CO₂ 气瓶", ar: "أسطوانة CO₂" },
    "modal.temp": { en: "Temperature", da: "Temperatur", es: "Temperatura", zh: "温度", ar: "الحرارة" },
    "modal.hum": { en: "Humidity", da: "Fugtighed", es: "Humedad", zh: "湿度", ar: "الرطوبة" },
    "modal.history": { en: "Service bookings", da: "Servicebookinger", es: "Reservas de servicio", zh: "维护预约", ar: "حجوزات الخدمة" },

    /* reschedule */
    "resched.title": { en: "Reschedule {vessel}", da: "Ombook {vessel}", es: "Reprogramar {vessel}", zh: "改期 {vessel}", ar: "إعادة جدولة {vessel}" },
    "resched.current": { en: "Current", da: "Nuværende", es: "Actual", zh: "当前", ar: "الحالي" },
    "resched.newPort": { en: "New port", da: "Ny havn", es: "Nuevo puerto", zh: "新港口", ar: "ميناء جديد" },
    "resched.moveHint": { en: "Move to a less crowded station to relieve overcrowding.", da: "Flyt til en mindre travl station for at lette overbelastning.", es: "Mueve a una estación menos saturada para aliviar la congestión.", zh: "改派至较空闲的站点以缓解拥挤。", ar: "انقل إلى محطة أقل ازدحاماً لتخفيف الاكتظاظ." },
    "resched.newDate": { en: "New date", da: "Ny dato", es: "Nueva fecha", zh: "新日期", ar: "تاريخ جديد" },
    "resched.newTime": { en: "New time", da: "Nyt tidspunkt", es: "Nueva hora", zh: "新时间", ar: "وقت جديد" },
    "resched.loadAt": { en: "load", da: "belastning", es: "carga", zh: "负载", ar: "الحِمل" },

    /* toasts */
    "toast.scheduledAt": { en: "{vessel} scheduled at {port}", da: "{vessel} planlagt i {port}", es: "{vessel} programado en {port}", zh: "{vessel} 已排定于 {port}", ar: "تمت جدولة {vessel} في {port}" },
    "toast.cancelled": { en: "Booking cancelled · parts released", da: "Booking annulleret · dele frigivet", es: "Reserva cancelada · repuestos liberados", zh: "预约已取消 · 备件已释放", ar: "أُلغي الحجز · حُرّرت القطع" },
    "toast.completed": { en: "Service completed · certificate issued", da: "Service afsluttet · certifikat udstedt", es: "Servicio completado · certificado emitido", zh: "维护已完成 · 证书已签发", ar: "اكتملت الخدمة · صدرت الشهادة" },
    "toast.rescheduled": { en: "Booking rescheduled", da: "Booking ombooket", es: "Reserva reprogramada", zh: "预约已改期", ar: "أُعيدت جدولة الحجز" },
    "toast.moved": { en: "Moved to {port}", da: "Flyttet til {port}", es: "Movido a {port}", zh: "已改派至 {port}", ar: "نُقل إلى {port}" },
    "toast.reset": { en: "Demo data reset", da: "Demodata nulstillet", es: "Datos demo restablecidos", zh: "演示数据已重置", ar: "أُعيد ضبط بيانات العرض" },
    "toast.certDl": { en: "Certificate downloaded", da: "Certifikat downloadet", es: "Certificado descargado", zh: "证书已下载", ar: "تم تنزيل الشهادة" },
    "toast.audit": { en: "Audit report exported (CSV)", da: "Revisionsrapport eksporteret (CSV)", es: "Informe de auditoría exportado (CSV)", zh: "审计报告已导出 (CSV)", ar: "تم تصدير تقرير التدقيق (CSV)" },
    "toast.reorder": { en: "Reorder placed", da: "Genbestilling afgivet", es: "Reorden realizado", zh: "已下补订单", ar: "تم تقديم طلب إعادة" },
    "toast.bulk": { en: "{n} vessels auto-booked", da: "{n} skibe auto-booket", es: "{n} buques auto-reservados", zh: "已自动预约 {n} 艘船", ar: "تم حجز {n} سفينة تلقائياً" },
    "toast.bulkNone": { en: "No vessels to auto-book", da: "Ingen skibe at auto-booke", es: "No hay buques para auto-reservar", zh: "无可自动预约的船舶", ar: "لا توجد سفن للحجز التلقائي" },
    "confirm.reset": { en: "Reset all demo data (bookings, parts, certificates)?", da: "Nulstil alle demodata (bookinger, dele, certifikater)?", es: "¿Restablecer todos los datos demo (reservas, repuestos, certificados)?", zh: "重置全部演示数据(预约、备件、证书)?", ar: "إعادة ضبط كل بيانات العرض (الحجوزات، القطع، الشهادات)؟" },

    "word.critical": { en: "critical", da: "kritiske", es: "críticos", zh: "紧急", ar: "الحرجة" },
    "word.expiring": { en: "expiring", da: "udløbende", es: "por vencer", zh: "临期", ar: "المنتهية قريباً" },

    /* activity feed */
    "act.autobook": { en: "<b>{vessel}</b> auto-booked at {port} · {date} {time}", da: "<b>{vessel}</b> auto-booket i {port} · {date} {time}", es: "<b>{vessel}</b> auto-reservado en {port} · {date} {time}", zh: "<b>{vessel}</b> 已自动预约于 {port} · {date} {time}", ar: "تم حجز <b>{vessel}</b> تلقائياً في {port} · {date} {time}" },
    "act.cancel": { en: "Booking for <b>{vessel}</b> cancelled · parts released", da: "Booking for <b>{vessel}</b> annulleret · dele frigivet", es: "Reserva de <b>{vessel}</b> cancelada · repuestos liberados", zh: "<b>{vessel}</b> 的预约已取消 · 备件已释放", ar: "أُلغي حجز <b>{vessel}</b> · حُرّرت القطع" },
    "act.reschedule": { en: "<b>{vessel}</b> rescheduled to {date} {time}", da: "<b>{vessel}</b> ombooket til {date} {time}", es: "<b>{vessel}</b> reprogramado a {date} {time}", zh: "<b>{vessel}</b> 已改期至 {date} {time}", ar: "أُعيدت جدولة <b>{vessel}</b> إلى {date} {time}" },
    "act.move": { en: "<b>{vessel}</b> moved to {port} · {date} {time}", da: "<b>{vessel}</b> flyttet til {port} · {date} {time}", es: "<b>{vessel}</b> movido a {port} · {date} {time}", zh: "<b>{vessel}</b> 已改派至 {port} · {date} {time}", ar: "نُقل <b>{vessel}</b> إلى {port} · {date} {time}" },
    "act.complete": { en: "<b>{vessel}</b> service completed · new SOLAS certificate issued", da: "<b>{vessel}</b> service afsluttet · nyt SOLAS-certifikat udstedt", es: "<b>{vessel}</b> servicio completado · nuevo certificado SOLAS emitido", zh: "<b>{vessel}</b> 维护完成 · 已签发新的 SOLAS 证书", ar: "اكتملت خدمة <b>{vessel}</b> · صدرت شهادة SOLAS جديدة" },
    "act.reorder": { en: "Reorder received: <b>{part}</b> (+{qty})", da: "Genbestilling modtaget: <b>{part}</b> (+{qty})", es: "Reorden recibido: <b>{part}</b> (+{qty})", zh: "已收到补订:<b>{part}</b>(+{qty})", ar: "تم استلام إعادة الطلب: <b>{part}</b> (+{qty})" },
    "act.bulk": { en: "Bulk auto-book: <b>{n}</b> {scope} vessels scheduled", da: "Masse-autobooking: <b>{n}</b> {scope} skibe planlagt", es: "Auto-reserva masiva: <b>{n}</b> buques {scope} programados", zh: "批量自动预约:已排定 <b>{n}</b> 艘{scope}船舶", ar: "حجز تلقائي جماعي: تمت جدولة <b>{n}</b> سفينة {scope}" },
    "act.seedSync": { en: "Sensor sync complete · 1,284 rafts reporting", da: "Sensorsynk fuldført · 1.284 flåder rapporterer", es: "Sincronización de sensores completa · 1.284 balsas reportando", zh: "传感器同步完成 · 1,284 只筏在上报", ar: "اكتملت مزامنة المستشعرات · 1,284 طوافة ترسل البيانات" },
    "act.seedCertWindow": { en: "<b>{vessel}</b> certificate entered 14-day window", da: "<b>{vessel}</b>-certifikat trådte ind i 14-dages vindue", es: "El certificado de <b>{vessel}</b> entró en la ventana de 14 días", zh: "<b>{vessel}</b> 的证书进入 14 天窗口期", ar: "دخلت شهادة <b>{vessel}</b> نافذة الـ14 يوماً" },
    "act.seedCapacity": { en: "{port} capacity updated → {pct}%", da: "{port}-kapacitet opdateret → {pct}%", es: "Capacidad de {port} actualizada → {pct}%", zh: "{port} 产能已更新 → {pct}%", ar: "تم تحديث سعة {port} ← {pct}٪" },
    "act.ambDrift": { en: "Sensor drift cleared on Sea Falcon", da: "Sensordrift udlignet på Sea Falcon", es: "Deriva de sensor corregida en Sea Falcon", zh: "Sea Falcon 的传感器漂移已校正", ar: "تم تصحيح انحراف المستشعر على Sea Falcon" },
    "act.ambCapacity": { en: "Gothenburg capacity recalculated", da: "Göteborg-kapacitet genberegnet", es: "Capacidad de Gotemburgo recalculada", zh: "哥德堡产能已重新计算", ar: "أُعيد حساب سعة غوتنبرغ" },
    "act.ambOnboard": { en: "New vessel onboarded: MV Helios", da: "Nyt skib tilføjet: MV Helios", es: "Nuevo buque incorporado: MV Helios", zh: "新接入船舶:MV Helios", ar: "تمت إضافة سفينة جديدة: MV Helios" },
    "act.ambParts": { en: "Hamburg parts inventory synced", da: "Hamborg-reservedelslager synkroniseret", es: "Inventario de repuestos de Hamburgo sincronizado", zh: "汉堡备件库存已同步", ar: "تمت مزامنة مخزون قطع هامبورغ" },

    /* relative time */
    "rel.now": { en: "just now", da: "lige nu", es: "ahora mismo", zh: "刚刚", ar: "الآن" },
    "rel.min": { en: "{n} min ago", da: "for {n} min siden", es: "hace {n} min", zh: "{n} 分钟前", ar: "قبل {n} دقيقة" },
    "rel.hour": { en: "{n} h ago", da: "for {n} t siden", es: "hace {n} h", zh: "{n} 小时前", ar: "قبل {n} ساعة" },
    "rel.day": { en: "{n} d ago", da: "for {n} d siden", es: "hace {n} d", zh: "{n} 天前", ar: "قبل {n} يوم" },
  };

  let current = "en";
  try { const s = localStorage.getItem(KEY); if (s && LANGS.includes(s)) current = s; } catch (e) {}

  function interp(str, params) {
    if (!params) return str;
    return str.replace(/\{(\w+)\}/g, (m, k) => (params[k] != null ? params[k] : m));
  }

  function t(key, params) {
    const row = D[key];
    const str = row ? (row[current] != null ? row[current] : row.en) : key;
    return interp(str, params);
  }

  function applyStatic(root) {
    root = root || document;
    root.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.getAttribute("data-i18n")); });
    root.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.getAttribute("data-i18n-html")); });
    root.querySelectorAll("[data-i18n-ph]").forEach((el) => { el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph"))); });
    root.querySelectorAll("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"))); });
  }

  function setLang(lang) {
    if (!LANGS.includes(lang)) lang = "en";
    current = lang;
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    const html = document.documentElement;
    html.setAttribute("lang", lang);
    html.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    applyStatic(document);
    document.querySelectorAll(".lang-select").forEach((s) => { if (s.value !== lang) s.value = lang; });
    window.dispatchEvent(new CustomEvent("pulse:lang", { detail: { lang } }));
  }

  function init() {
    applyStatic(document);
    document.querySelectorAll(".lang-select").forEach((s) => {
      s.value = current;
      s.addEventListener("change", (e) => setLang(e.target.value));
    });
    // apply dir/lang on first paint
    document.documentElement.setAttribute("lang", current);
    document.documentElement.setAttribute("dir", current === "ar" ? "rtl" : "ltr");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  return { t, setLang, applyStatic, get lang() { return current; }, LANGS };
})();
