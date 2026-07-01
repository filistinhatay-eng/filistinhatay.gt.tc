import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Fingerprint, FileText, UserCheck, Globe, ExternalLink, 
  Download, Building2, HelpCircle, Info, AlertCircle, 
  CheckCircle2, ClipboardList, ShieldAlert, ChevronDown, ChevronUp, Clock, ArrowRight,
  MapPin, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ResidencySection: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'degrees' | 'renewal' | 'documents' | 'process' | 'local' | 'checklist' | 'faq'>('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // State for interactive document checklist
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({
    applicationForm: false,
    passportCopy: false,
    studentCert: false,
    photos: false,
    insurance: false,
    addressProof: false,
    uets: false,
    paymentReceipt: false
  });

  const handleToggleDoc = (key: string) => {
    setCheckedDocs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const totalDocs = Object.keys(checkedDocs).length;
  const completedDocs = Object.values(checkedDocs).filter(Boolean).length;
  const progressPercent = Math.round((completedDocs / totalDocs) * 100);

  const toggleFaq = (index: number) => {
    setExpandedFaq(prev => (prev === index ? null : index));
  };

  // Highly customized translation dictionary for İSTE, Turkey
  const content = {
    ar: {
      pageTitle: "إدارة الإقامات الطلابية - جامعة إسكندرون التقنية",
      pageSubTitle: "شروط ومتطلبات الحصول على إقامة الطالب وتجديدها (Öğrenci İkamet İzni) لمختلف الدرجات الأكاديمية (الدبلوم، البكالوريوس، الدراسات العليا) في جامعة İSTE بهاتاي، تركيا.",
      universityCard: "حول متطلبات إقامة الطلبة الأجانب في تركيا (İSTE)",
      
      // Tabs
      tabOverview: "نظرة عامة وشروط",
      tabDegrees: "البكالوريوس والدبلوم",
      tabRenewal: "تجديد الإقامة الطلابية",
      tabDocuments: "الوثائق المطلوبة بالتفصيل",
      tabProcess: "آلية التقديم والمسؤولية",
      tabLocal: "دليل مكاتب إسكندرون وهاتاي",
      tabChecklist: "مُخطط التحضير التفاعلي",
      tabFaq: "الأسئلة الشائعة",

      // Bachelor's and Associate's Degrees Content
      degreesHeader: "إقامة الطالب لدرجتي البكالوريوس والدبلوم",
      degreesSub: "التفاصيل والشروط القانونية الخاصة بطلاب الدبلوم (الدرجة المتوسطة) والبكالوريوس في جامعة İSTE:",
      degreesDurationTitle: "مدة الإقامة وفترات الدراسة",
      degreesDurationDesc: "تمنح إقامة الطالب لطلاب الدبلوم (Önlisans) لمدة تصل إلى سنتين كحد أقصى، ولطلاب البكالوريوس (Lisans) لمدة تصل إلى 4 سنوات (أو 5 سنوات للبرامج الهندسية ذات السنة التحضيرية). وتُجدد الإقامة سنوياً بناءً على استمرار القيد الدراسي الفعال.",
      degreesPrepTitle: "السنة التحضيرية للغة (Hazırlık Sınıfı)",
      degreesPrepDesc: "الطلاب الذين يتعين عليهم دراسة السنة التحضيرية (اللغة التركية أو الإنجليزية) يحصلون على إقامة طالب لمدة سنة واحدة مخصصة للتحضيري. بعد اجتياز اللغة والبدء في القسم الفعلي، يتعين عليهم تحديث معلومات الإقامة وتقديم وثيقة الطالب الجديدة لاستكمال سنوات التخصص.",
      degreesAttendanceTitle: "شرط الحضور والتسجيل الفصلي",
      degreesAttendanceDesc: "يجب على طالب البكالوريوس والدبلوم الحفاظ على نسبة حضور لا تقل عن 70% للمحاضرات النظرية و80% للمحاضرات العملية. عدم الالتزام بالحضور أو الانقطاع عن الدراسة يؤدي لإلغاء القيد الجامعي، ومعه تُلغى الإقامة الطلابية فوراً وتعتبر غير قانونية.",
      degreesTransTitle: "التحويل بين الكليات والجامعات",
      degreesTransDesc: "في حال انتقال الطالب من كلية إلى أخرى داخل جامعة İSTE أو التحويل إلى جامعة أخرى، يجب إبلاغ إدارة الهجرة في هاتاي خلال 20 يوم عمل لتحديث بيانات الإقامة. إذا كان النقل لنفس المدينة (هاتاي)، تظل الإقامة سارية بشرط تحديث الأوراق، أما إذا كان الانتقال لولاية أخرى، فيجب التقديم على إقامة جديدة في الولاية الجديدة.",

      // Residence Renewal Content
      renewalHeader: "دليل تجديد الإقامة الطلابية (İkamet Uzatma)",
      renewalSub: "خطوات تجديد الإقامة قبل انتهائها لضمان الحفاظ على الوضع القانوني ومنع الوقوع في المخالفات:",
      renewalTimeTitle: "المدد الزمنية والموعد المحدد للتقديم",
      renewalTimeDesc: "يجب تقديم طلب التجديد (Uzatma) خلال الـ 60 يوماً الأخيرة قبل تاريخ انتهاء بطاقة الإقامة الحالية. يُمنع تماماً الانتظار حتى انتهاء صلاحية الكرت الحالي، حيث يعرضك ذلك لغرامات مالية كبيرة أو قرار مغادرة وتجميد قيدك الجامعي.",
      renewalStepsTitle: "خطوات التقديم الإلكتروني للتجديد",
      renewalStepsDesc: "يتم الدخول إلى بوابة e-İkamet واختيار 'طلب تمديد الإقامة' (Uzatma Başvurusu). يتم تعبئة البيانات وتحديث العنوان والتأمين الصحي، ثم طباعة استمارة التجديد الموقعة. لا داعي لحجز موعد مقابلة شخصية، بل يتم تسليم الملف مباشرة للجامعة.",
      renewalDocsTitle: "المستندات المطلوبة للتجديد",
      renewalDocsDesc: "تشمل الأوراق المطلوبة للتجديد: استمارة التمديد الموقعة، نسخة من بطاقة الإقامة الحالية (الوجهين)، نسخة جواز السفر ساري المفعول، وثيقة طالب حديثة بباركود، تأمين صحي جديد يغطي فترة التمديد، سند إقامة حديث (Yerleşim Yeri) من e-Devlet، ووصل دفع الرسوم.",
      renewalUniTitle: "تسليم الملف عبر مكتب الطلاب الدوليين بالجامعة",
      renewalUniDesc: "بعد إتمام الطلب الإلكتروني ودفع الرسوم وتجهيز الأوراق، يلتزم الطالب بتسليم الملف الورقي كاملاً إلى مكتب الطلاب الدوليين بجامعة إسكندرون التقنية (İSTE) خلال 10 أيام من التقديم الإلكتروني، لتقوم الجامعة برفعه رسمياً لإدارة الهجرة.",

      // Overview Section
      overviewHeader: "الإقامة الطلابية في تركيا (İSTE)",
      overviewText1: "وفقاً لقانون الأجانب والحماية الدولية رقم 6458 في الجمهورية التركية، يجب على جميع الطلاب الدوليين المقبولين في برامج الدراسات العليا (الماجستير والدكتوراه) والذين يدخلون تركيا بتأشيرة دراسية أو إعفاء فيزا، التقدم بطلب للحصول على إقامة طالب خلال فترة أقصاها 30 يوماً من تاريخ دخولهم البلاد.",
      overviewText2: "تمنح إقامة الطالب الحق في البقاء والدراسة بشكل قانوني في تركيا طالما أن الطالب يواصل تعليمه بشكل فعال في جامعة إسكندرون التقنية (İSTE). تعتبر الإقامة شرطاً أساسياً لضمان عدم التعرض لأي غرامات مالية أو ترحيل قانوني ولإتمام المعاملات الأكاديمية.",
      
      keyRulesTitle: "القواعد الأساسية للحفاظ على قانونية الإقامة:",
      rule1: "مواصلة التعليم الفعال: يجب ألا ينقطع الطالب عن التسجيل الفصلي في جامعة إسكندرون التقنية. تجميد القيد (Kayıt Dondurma) أو إلغاء القيد يؤدي تلقائياً إلى إلغاء الإقامة.",
      rule2: "مدة الإقامة: تُمنح الإقامة عادةً لمدة سنة واحدة قابلة للتجديد سنوياً، أو طوال الفترة الرسمية المحددة للبرنامج الدراسي (سنتان للماجستير، و4 سنوات للدكتوراه) بشرط بقاء القيد الدراسي فعالاً.",
      rule3: "تحديث البيانات الشخصية: يجب إخطار إدارة الهجرة التركية (Göç İdaresi) وجامعة İSTE بأي تغيير يطرأ على عنوان السكن، أو رقم الهاتف، أو تجديد جواز السفر خلال 20 يوم عمل كحد أقصى.",
      rule4: "سريان جواز السفر: يجب أن تزيد مدة صلاحية جواز سفر الطالب عن مدة الإقامة المطلوبة بـ 60 يوماً على الأقل.",

      // Responsible Party Section
      responsibilityHeader: "الجهة المسؤولة عن تقديم واستلام ملف الإقامة",
      responsibleTitle: "من هو الشخص أو القسم المسؤول عن استلام طلب الإقامة؟",
      responsibleParty: "شعبة شؤون الطلاب الدوليين - رئاسة دائرة شؤون الطلاب (İSTE Öğrenci İşleri Daire Başkanlığı)",
      responsiblePartyDesc: "بموجب البروتوكول الرسمي المشترك الموقع حديثاً بين رئاسة إدارة الهجرة التركية ومجلس التعليم العالي التركي (YÖK)، لم يعد الطالب يسلم أوراقه يدوياً لمديرية الهجرة بنفسه. وبدلاً من ذلك، يتعين على الطالب تقديم ملف الإقامة الورقي كاملاً إلى موظف شؤون الطلاب الدوليين بجامعة إسكندرون التقنية.",
      coordinatorTitle: "مسؤول الطلاب الدوليين في جامعة İSTE:",
      coordinatorDesc: "يقوم الموظف المسؤول في شعبة شؤون الطلاب الدوليين بالجامعة بمراجعة الملف وتدقيقه قانونياً، ومن ثم رفعه وتسليمه بشكل جماعي إلى مديرية إدارة الهجرة بمحافظة هاتاي (Hatay İl Göç İdaresi).",
      
      studentResponsibilityTitle: "مسؤولية الطالب الفردية:",
      studentRespDesc: "يتحمل الطالب المسؤولية الكاملة والوحيدة عن حجز الموعد عبر نظام الإقامة الإلكتروني (e-İkamet)، وطباعة الاستمارة، وتوفير وتصديق كافة المستندات المطلوبة (مثل التأمين الصحي، وتصديق السكن من كاتب العدل، ودفع الرسوم). أي تأخير في تسليم الملف للجامعة قبل انتهاء مدة التأشيرة يقع على عاتق الطالب.",

      // Detailed Documents Section
      docsHeader: "تفاصيل الوثائق المطلوبة وشروطها القانونية",
      docsSub: "يجب تحضير كافة الأوراق وترتيبها داخل ملف كرتوني أحمر مخصص لتسليمه لشؤون الطلاب بجامعة İSTE:",
      
      doc1Title: "1. استمارة طلب الإقامة المطبوعة (İkamet Başvuru Formu)",
      doc1Desc: "يتم تعبئة الاستمارة إلكترونياً عبر الموقع الرسمي المخصص، ومن ثم طباعتها وتوقيع الصفحة الأخيرة منها باللون الأزرق من قبل الطالب شخصياً.",
      doc1Source: "مصدر الوثيقة: موقع e-İkamet الإلكتروني التابع لإدارة الهجرة التركية.",

      doc2Title: "2. نسخة من جواز السفر وبيانات الدخول",
      doc2Desc: "نسخة ملونة واضحة من جواز السفر (صفحة المعلومات الشخصية، صفحة ختم الدخول الأخير إلى تركيا، وصفحة الفيزا الدراسية إن وجدت). يجب إحضار جواز السفر الأصلي للمطابقة.",
      doc2Source: "مصدر الوثيقة: جواز السفر الصادر من بلدك وختم شرطة الحدود بمطار أو معبر الدخول.",

      doc3Title: "3. وثيقة الطالب الرسمية (Öğrenci Belgesi)",
      doc3Desc: "وثيقة حديثة تثبت أن الطالب مسجل في جامعة إسكندرون التقنية، وتحتوي على رقم الطالب وتفاصيل برنامجه الدراسي وموقعة إلكترونياً برمز باركود (E-imzalı / Barkodlu).",
      doc3Source: "مصدر الوثيقة: دائرة شؤون الطلاب بجامعة İSTE أو عبر تطبيق e-Devlet.",

      doc4Title: "4. صور بيومترية حديثة (Biometrik Fotoğraf)",
      doc4Desc: "عدد 4 صور شخصية ملونة بخلفية بيضاء نقية، بيومترية (حجم 5×6 سم) تم التقاطها خلال آخر 6 أشهر كحد أقصى تظهر ملامح الوجه بوضوح.",
      doc4Source: "مصدر الوثيقة: أي استوديو تصوير محلي في مدينة إسكندرون.",

      doc5Title: "5. تأمين صحي ساري المفعول (Sağlık Sigortası)",
      doc5Desc: "تأمين صحي يغطي فترة الإقامة المطلوبة بالكامل. يمكن استخدام التأمين الصحي الخاص (Özel Sağlık Sigortası) بشرط احتوائه على عبارة التوافق مع شروط الإقامة، أو الاشتراك في الضمان الصحي الحكومي (GSS) من مؤسسة الضمان الاجتماعي التركية (SGK).",
      doc5Source: "مصدر الوثيقة: شركات التأمين المرخصة في تركيا أو مكاتب SGK في إسكندرون.",

      doc6Title: "6. إثبات السكن الفعلي الموثق (Adres Belgesi)",
      doc6Desc: "إثبات مكان الإقامة الفعلي في هاتاي/إسكندرون. إذا كنت مستأجراً: يجب تقديم عقد إيجار مصدق من كاتب العدل (Noter) ومرفقاً معه قيد النفوس وطابو المنزل. إذا كنت مقيماً في سكن الجامعة: وثيقة رسمية مختومة من إدارة سكن جامعة İSTE.",
      doc6Source: "مصدر الوثيقة: كاتب العدل (Noter) في إسكندرون، إدارة السكن الجامعي لـ İSTE، أو قيد النفوس من e-Devlet.",

      doc7Title: "7. وثيقة الرمز الإلكتروني الوطني (UETS Belgesi)",
      doc7Desc: "وثيقة العنوان الإلكتروني الوطني الموحد (Ulusal Elektronik Tebligat Sistemi) وهي إجبارية لجميع طلبات الإقامة منذ أبريل 2024 لاستقبال الإشعارات الحكومية الرسمية.",
      doc7Source: "مصدر الوثيقة: أي فرع لمؤسسة البريد التركية (PTT) في إسكندرون باستخدام جواز السفر ورقم هاتف تركي فعال.",

      doc8Title: "8. وصل دفع رسوم كرت الإقامة (Kart Ücreti Makbuzu)",
      doc8Desc: "وصل الدفع الأصلي لرسوم إصدار بطاقة الإقامة المحددة سنوياً من قبل وزارة المالية التركية. يجب أن يحتوي الوصل على الرقم الضريبي للطالب واسمه بالكامل وتوقيع البنك أو مصلحة الضرائب.",
      doc8Source: "مصدر الوثيقة: موقع إدارة الضرائب الإلكتروني (ivd.gib.gov.tr)، أو مديرية ضرائب إسكندرون، أو البنوك الحكومية (Ziraat / Vakıf).",

      // Process Timeline
      processHeader: "مراحل وخطوات التقديم على إقامة الطالب بالتفصيل",
      step1Title: "الخطوة 1: التسجيل الجامعي والرمز الضريبي",
      step1Desc: "إتمام تسجيلك الدراسي في جامعة إسكندرون التقنية والحصول على وثيقة الطالب (Öğrenci Belgesi)، واستخراج الرقم الضريبي (Vergi Numarası) مجاناً عبر الإنترنت.",
      step2Title: "الخطوة 2: حجز موعد e-İkamet إلكترونياً",
      step2Desc: "الدخول لموقع إدارة الهجرة e-İkamet، اختيار 'طلب أول مرة' وتعبئة البيانات بدقة وتحديد موعد المقابلة ثم طباعة الاستمارة.",
      step3Title: "الخطوة 3: تجهيز السكن والرمز الإلكتروني (UETS)",
      step3Desc: "تصديق عقد الإيجار لدى النوتر أو أخذ وثيقة السكن الجامعي، والتوجه لمركز PTT في إسكندرون لاستخراج رمز UETS الضروري.",
      step4Title: "الخطوة 4: دفع الرسوم وشراء التأمين الصحي",
      step4Desc: "شراء تأمين صحي تركي يغطي سنة على الأقل، ودفع رسوم كرت الإقامة عبر الإنترنت أو في مصلحة الضرائب والاحتفاظ بالوصل الورقي المطبوع.",
      step5Title: "الخطوة 5: تسليم الملف إلى جامعة İSTE",
      step5Desc: "جمع كافة الوثائق ووضعها في ملف أحمر، وتسليمها يدوياً إلى شعبة الطلاب الدوليين في مبنى رئاسة جامعة İSTE خلال المدة القانونية.",
      step6Title: "الخطوة 6: صدور بطاقة الإقامة عبر البريد (PTT)",
      step6Desc: "تقوم الجامعة بتسليم ملفك لإدارة الهجرة في هاتاي. بعد المراجعة والقبول، يتم طباعة بطاقة الإقامة وإرسالها مباشرة إلى عنوان سكنك المسجل عبر بريد PTT.",

      // Local Guide
      localGuideHeader: "دليل المواقع الحكومية والخدمية في إسكندرون وهاتاي",
      localGuideSub: "عناوين وتفاصيل الأماكن الرسمية التي ستحتاجها لاستخراج مستندات الإقامة من داخل مدينة إسكندرون ومحافظة هاتاي:",
      
      loc1Title: "مديرية نفوس إسكندرون (İskenderun İlçe Nüfus Müdürlüğü)",
      loc1Desc: "لتسجيل عنوان السكن الفعلي في النظام المركزي أو استخراج وثائق النفوس وعناوين الإقامة الرسمية.",
      loc1Address: "العنوان: داخل مبنى القائم مقامية (İskenderun Kaymakamlığı)، وسط المدينة، إسكندرون.",

      loc2Title: "مكتب كاتب العدل / النوتر (İskenderun Noterleri)",
      loc2Desc: "لتصديق وتوثيق عقود الإيجار السكنية وترجمة جواز السفر ترجمة محلفة وتصديقها رسمياً.",
      loc2Address: "العنوان: تتوزع عدة مكاتب (Noter 1, 2, 3...) في الشوارع التجارية الرئيسية لوسط إسكندرون.",

      loc3Title: "مديرية ضرائب إسكندرون (İskenderun Vergi Dairesi)",
      loc3Desc: "للحصول على الرقم الضريبي الفعلي ودفع رسوم الإقامة يدوياً في حال تعذر الدفع عبر البوابة الإلكترونية.",
      loc3Address: "العنوان: حي يني شهير (Yenişehir Mahallesi)، إسكندرون، هاتاي.",

      loc4Title: "مكتب البريد التركي المركزي (PTT İskenderun Merkez Şubesi)",
      loc4Desc: "مخصص لاستخراج العنوان الإلكتروني الوطني (UETS) واستلام بطاقة الإقامة المطبوعة وتتبع كود الشحنة.",
      loc4Address: "العنوان: الشارع الرئيسي المقابل لساحة أتاتورك، وسط إسكندرون.",

      loc5Title: "مديرية إدارة الهجرة بمحافظة هاتاي (Hatay İl Göç İdaresi Müdürlüğü)",
      loc5Desc: "المقر الرئيسي الإقليمي المسؤول عن مراجعة ومعالجة وإصدار قرارات الإقامات لجميع الأجانب في محافظة هاتاي.",
      loc5Address: "العنوان: مدينة أنطاكيا (المركز الإداري لهاتاي)، تركيا. (يتم تسليم الملفات لها عبر بريد الجامعة بشكل مباشر).",

      loc6Title: "مستشفى إسكندرون الحكومي (İskenderun Devlet Hastanesi)",
      loc6Desc: "لإجراء أي فحوصات طبية أو الحصول على تقرير طبي رسمي في الحالات الاستثنائية التي تطلبها رئاسة الهجرة.",
      loc6Address: "العنوان: حي مصطفى كمال (Mustafa Kemal Mahallesi)، إسكندرون.",

      // Links Panel
      resourcesHeader: "العناوين الإلكترونية الرسمية وروابط التقديم المباشر",
      resource1Label: "بوابة حجز مواعيد الإقامة الإلكترونية (e-İkamet)",
      resource1Desc: "الموقع الرسمي الحكومي والوحيد التابع لإدارة الهجرة التركية لبدء طلب الإقامة وتعبئة الاستمارة وحجز الموعد.",
      resource2Label: "بوابة مصلحة الضرائب التركية (İnteraktif Vergi Dairesi)",
      resource2Desc: "الرابط الرسمي لدفع رسوم كرت الإقامة عبر الإنترنت باستخدام بطاقتك الائتمانية والرقم الضريبي.",
      resource3Label: "موقع جامعة إسكندرون التقنية الرسمي (İSTE)",
      resource3Desc: "الصفحة الأكاديمية الرئيسية لمتابعة أخبار الطلاب الأجانب، ووثائق التسجيل والتقويم الدراسي.",
      resource4Label: "بوابة الحكومة الإلكترونية التركية (e-Devlet)",
      resource4Desc: "لاستخراج قيد السكن، وثيقة الطالب الرسمية المصدقة، ومعلومات الضمان الاجتماعي والنفوس.",

      // Checklist Tool
      checklistHeader: "مُخطط تتبع وثائق إقامة الطالب الشخصية",
      checklistSub: "قم بتحديد الأوراق الجاهزة لديك لمعرفة نسبة اكتمال ملف الإقامة الخاص بك قبل التوجه لتسليمه لشؤون الطلاب بجامعة İSTE.",
      checklistProgress: "نسبة جاهزية ملف الإقامة الخاص بك",
      checkReady: "مكتمل وجاهز",
      checkNotReady: "غير جاهز / قيد التحضير",

      // FAQs
      faqQ1: "هل يحق لطالب الدراسات العليا الأجنبي العمل بشكل قانوني في تركيا أثناء دراسته؟",
      faqA1: "وفقاً لقانون العمل التركي الحالي، يُسمح لطلاب الدراسات العليا (الماجستير والدكتوراه) الحاصلين على إقامة طالب سارية بالعمل بشكل قانوني في تركيا، بشرط الحصول على إذن عمل (Çalışma İzni) رسمي من وزارة العمل والضمان الاجتماعي التركية، دون اشتراط قيود ساعات صارمة كما هو الحال لطلاب البكالوريوس.",
      faqQ2: "كم من الوقت تستغرق عملية إصدار بطاقة الإقامة واستلامها في إسكندرون؟",
      faqA2: "بعد تسليم ملفك الورقي لشؤون الطلاب بجامعة İSTE، يستغرق تقييم الطلب وطباعة البطاقة في أنقرة وإرسالها عبر بريد PTT ما بين 30 إلى 60 يوماً في المتوسط. يمكنك استخدام وثيقة 'طلب الإقامة المقبول' للتنقل بحرية داخل تركيا حتى صدور البطاقة.",
      faqQ3: "هل يمكنني السفر خارج تركيا أثناء مرحلة مراجعة طلب الإقامة؟",
      faqA3: "بعد تسليم أوراقك وحجز الموعد بنجاح، يمكنك الحصول على وثيقة 'إثبات تقديم الطلب' (Müracaat Belgesi) موقعة ومختومة من إدارة الهجرة بالجامعة. تتيح لك هذه الوثيقة الخروج من تركيا والعودة إليها خلال مدة أقصاها 15 يوماً دون الحاجة للحصول على تأشيرة جديدة.",
      faqQ4: "ماذا أفعل إذا تم رفض طلب الإقامة الخاص بي؟",
      faqA4: "في حال الرفض (وهو أمر نادر إذا كانت أوراقك مستوفية ومسجلاً بالجامعة)، تمنحك إدارة الهجرة خطاب تبليغ رسمي بالرفض. يتوجب عليك مغادرة الأراضي التركية في غضون 10 أيام من تاريخ التبليغ لتفادي مخالفات الإقامة، ويمكنك إعادة المحاولة لاحقاً بتوفير الوثائق الصحيحة."
    },
    tr: {
      pageTitle: "Öğrenci İkamet İzni Yönetimi - İSTE",
      pageSubTitle: "İskenderun Teknik Üniversitesi'ndeki (İSTE) tüm akademik dereceler (Önlisans, Lisans, Lisansüstü) için Öğrenci İkamet İzni ve Yenileme şartları, süreçleri ve gerekli belgeler rehberi.",
      universityCard: "Türkiye'de Yabancı Öğrenci İkamet Koşulları (İSTE)",

      // Tabs
      tabOverview: "Genel Bakış & Kurallar",
      tabDegrees: "Önlisans & Lisans",
      tabRenewal: "İkamet İzni Yenileme",
      tabDocuments: "Gerekli Belgeler Detayı",
      tabProcess: "Başvuru ve Teslim Süreci",
      tabLocal: "İskenderun & Hatay Ofisleri",
      tabChecklist: "Etkileşimli Hazırlık Planlayıcı",
      tabFaq: "Sıkça Sorulan Sorular",

      // Bachelor's and Associate's Degrees Content
      degreesHeader: "Önlisans ve Lisans Dereceleri İçin İkamet İzni",
      degreesSub: "İSTE bünyesindeki Önlisans (Meslek Yüksekokulu) ve Lisans (Fakülte) öğrencileri için özel yasal şartlar ve detaylar:",
      degreesDurationTitle: "İkamet Süreleri ve Öğrenim Süresi",
      degreesDurationDesc: "Öğrenci ikamet izni, Önlisans öğrencileri için en fazla 2 yıl, Lisans öğrencileri için ise en fazla 4 yıl (hazırlık sınıfı olan mühendislik programlarında 5 yıl) olarak düzenlenir. Öğrencinin aktif kayıt durumu kontrol edilerek yıllık olarak uzatılır.",
      degreesPrepTitle: "Dil Hazırlık Sınıfı (Hazırlık Sınıfı)",
      degreesPrepDesc: "Zorunlu dil hazırlık eğitimi (Türkçe veya İngilizce) alması gereken öğrencilere ilk etapta 1 yıllık hazırlık ikameti verilir. Hazırlık sınıfını başarıyla tamamlayıp bölüme geçen öğrencilerin aktif öğrenci belgeleri ile ikamet sürelerini uzatmaları gerekir.",
      degreesAttendanceTitle: "Devam Zorunluluğu ve Aktif Kayıt",
      degreesAttendanceDesc: "Önlisans ve Lisans öğrencilerinin derslere en az %70 (teorik) ve %80 (uygulamalı) oranında devam etmesi zorunludur. Devamsızlık veya kaydın dondurulması/silinmesi durumunda öğrenci ikameti Göç İdaresi tarafından derhal iptal edilir.",
      degreesTransTitle: "Yatay Geçiş ve Bölüm Değişikliği",
      degreesTransDesc: "İSTE içinde bölüm değiştiren veya başka bir üniversiteye yatay geçiş yapan öğrencilerin, durumlarını 20 iş günü içinde İl Göç İdaresi'ne bildirmeleri şarttır. Hatay içinde geçişlerde mevcut kart güncellenir, farklı bir ile geçişte ise yeni ilde baştan başvuru yapılmalıdır.",

      // Residence Renewal Content
      renewalHeader: "Öğrenci İkamet İzni Yenileme (Uzatma) Rehberi",
      renewalSub: "Yasal kalış sürenizin kesintiye uğramaması ve cezai duruma düşmemeniz için ikamet izni yenileme sürecine dair bilinmesi gerekenler:",
      renewalTimeTitle: "Başvuru Dönemi ve Zamanlama",
      renewalTimeDesc: "İkamet uzatma başvurusu, mevcut ikamet izni kartınızın geçerlilik süresinin dolmasına en az 60 gün kala ve her halükarda kart süresi dolmadan önce yapılmalıdır. Kart süresi bittikten sonra yapılan başvurular geçersiz sayılır ve cezai işlem uygulanır.",
      renewalStepsTitle: "Online Uzatma Başvuru Süreci",
      renewalStepsDesc: "e-İkamet portalı üzerinden 'İkamet İzni Uzatma Başvurusu' sekmesi seçilerek form online doldurulur. Güncel adres, pasaport ve yeni sigorta bilgileri girilerek formun çıktısı alınır ve imzalanır. Uzatma başvurusunda randevu gününü beklemeye gerek yoktur.",
      renewalDocsTitle: "Yenileme İçin Gerekli Evraklar",
      renewalDocsDesc: "Yenileme dosyası için: İmzalı uzatma başvuru formu, mevcut ikamet kartının önlü arkalı fotokopisi, pasaport fotokopisi, yeni tarihli barkodlu öğrenci belgesi, uzatılan süreyi kapsayan yeni sağlık sigortası, e-Devlet'ten alınmış yerleşim yeri belgesi ve kart bedeli ödeme makbuzu gereklidir.",
      renewalUniTitle: "Dosyanın İSTE Uluslararası Ofisine Teslimi",
      renewalUniDesc: "Online başvuruyu tamamlayıp evrakları hazırlayan öğrenci, en geç 10 gün içinde dosyayı İSTE Rektörlüğü bünyesindeki Uluslararası Öğrenci Ofisi'ne teslim etmelidir. Dosya, üniversite kanalıyla İl Göç İdaresi'ne toplu olarak ulaştırılır.",

      // Overview Section
      overviewHeader: "Türkiye'de Öğrenci İkamet İzni (İSTE)",
      overviewText1: "Türkiye Cumhuriyeti 6458 sayılı Yabancılar ve Uluslararası Koruma Kanunu uyarınca, İskenderun Teknik Üniversitesi (İSTE) bünyesindeki lisansüstü programlara (Yüksek Lisans ve Doktora) kabul edilen ve Türkiye'ye öğrenci vizesi ya da vize muafiyeti ile giriş yapan tüm uluslararası öğrencilerin, ülkeye giriş yaptıkları tarihten itibaren en geç 30 gün içinde öğrenci ikamet iznine başvurmaları zorunludur.",
      overviewText2: "Öğrenci ikamet izni, öğrencinin İskenderun Teknik Üniversitesi'ndeki (İSTE) eğitimi aktif olarak devam ettiği sürece Türkiye'de yasal olarak kalma ve okuma hakkı tanır. İkamet iznine sahip olmak, akademik işlemlerin tamamlanması ve idari cezalarla karşılaşmamak için zorunludur.",

      keyRulesTitle: "İkamet İznini Korumak İçin Temel Kurallar:",
      rule1: "Aktif Eğitimin Devamı: Öğrencinin İSTE bünyesindeki dönem kayıtlarını aksatmaması şarttır. Kayıt dondurma (Kayıt Dondurma) veya kayıt sildirme durumlarında ikamet izni otomatik olarak iptal edilir.",
      rule2: "İkamet İzni Süresi: İkamet izni genellikle yıllık olarak uzatılır veya öğrencinin normal öğrenim süresi boyunca (Yüksek Lisans için 2 yıl, Doktora için 4 yıl) aktif öğrenci belgesi sunulması şartıyla geçerli kalır.",
      rule3: "Kişisel Bilgi Güncellemeleri: Adres değişikliği, telefon numarası değişikliği veya pasaport yenileme gibi durumlarda, en geç 20 iş günü içerisinde İl Göç İdaresi'ne ve İSTE Öğrenci İşleri'ne bilgi verilmelidir.",
      rule4: "Pasaport Geçerlilik Süresi: Talep edilen ikamet süresinden en az 60 gün daha uzun geçerlilik süresine sahip bir pasaporta sahip olunması şarttır.",

      // Responsible Party Section
      responsibilityHeader: "İkamet Dosyasının Kabulü ve Tesliminde Sorumlu Birim",
      responsibleTitle: "Dosyayı Almaktan ve Göç İdaresine İletmekten Kim Sorumludur?",
      responsibleParty: "Uluslararası Öğrenci Ofisi - Öğrenci İşleri Daire Başkanlığı (İSTE Öğrenci İşleri Daire Başkanlığı)",
      responsiblePartyDesc: "Göç İdaresi Başkanlığı ile Yükseköğretim Kurulu (YÖK) arasında imzalanan güncel iş birliği protokolü uyarınca, yabancı öğrencilerin ikamet başvuru dosyalarını bizzat İl Göç İdaresi'ne götürme zorunluluğu kaldırılmıştır. Öğrenciler tüm evraklarını eksiksiz hazırlayıp İskenderun Teknik Üniversitesi Öğrenci İşleri Daire Başkanlığı bünyesindeki Uluslararası Öğrenci Ofisi yetkilisine teslim etmekle yükümlüdür.",
      coordinatorTitle: "İSTE Uluslararası Öğrenci Ofisi Memuru:",
      coordinatorDesc: "Üniversitenin yetkili uluslararası öğrenci memuru, teslim edilen ikamet başvuru dosyalarını yasal uygunluk açısından inceler, onaylar ve toplu olarak Hatay İl Göç İdaresi Müdürlüğü'ne teslim eder.",

      studentResponsibilityTitle: "Öğrencinin Bireysel Sorumluluğu:",
      studentRespDesc: "Online e-İkamet randevu sistemi üzerinden başvuru formunu doldurmak, çıktısını almak, gerekli harçları yatırmak ve tüm evrakları (sigorta, noter onaylı kira sözleşmesi, PTT'den UETS vb.) eksiksiz hazırlamak tamamen öğrencinin kendi sorumluluğundadır. Geç evrak tesliminden kaynaklanan yasal yükümlülükler öğrenciye aittir.",

      // Detailed Documents Section
      docsHeader: "Gerekli Evrakların Detayları ve Yasal Şartları",
      docsSub: "Tüm belgelerin eksiksiz hazırlanarak İSTE Öğrenci İşleri'ne teslim edilmek üzere kırmızı şeffaf bir dosya içinde toplanması gerekmektedir:",

      doc1Title: "1. İkamet İzni Başvuru Formu (İkamet Başvuru Formu)",
      doc1Desc: "Göç İdaresi'nin resmi sistemi üzerinden doldurulup çıktısı alınan ve son sayfası öğrenci tarafından mavi tükenmez kalemle imzalanmış başvuru formu.",
      doc1Source: "Belge Kaynağı: Göç İdaresi Başkanlığı resmi e-İkamet portalı (e-ikamet.goc.gov.tr).",

      doc2Title: "2. Pasaport Fotokopisi ve Giriş Damgası",
      doc2Desc: "Pasaportun kimlik bilgilerini gösteren sayfasının, varsa vize sayfasının ve Türkiye'ye son giriş damgasının bulunduğu sayfaların net renkli fotokopileri. Pasaport aslı teslim sırasında gösterilmelidir.",
      doc2Source: "Belge Kaynağı: Öğrencinin kendi pasaportu ve sınır kapısı polisi.",

      doc3Title: "3. Öğrenci Belgesi (Active Student Certificate)",
      doc3Desc: "İSTE öğrencisi olunduğunu gösteren, yeni tarihli, e-imzalı veya barkodlu resmi öğrenci belgesi.",
      doc3Source: "Belge Kaynağı: İSTE Öğrenci İşleri Daire Başkanlığı veya e-Devlet kapısı.",

      doc4Title: "4. Biyometrik Fotoğraf",
      doc4Desc: "Son 6 ay içinde çekilmiş, arka fonu tamamen beyaz, biyometrik özelliklere sahip, 5x6 cm boyutlarında 4 adet vesikalık fotoğraf.",
      doc4Source: "Belge Kaynağı: İskenderun'daki herhangi bir yerel fotoğraf stüdyosu.",

      doc5Title: "5. Geçerli Sağlık Sigortası (Health Insurance)",
      doc5Desc: "İkamet talep süresini kapsayan geçerli Genel Sağlık Sigortası (GSS - SGK kanalıyla) veya özel sağlık sigortası (Özel Sağlık Sigortası). Sigorta poliçesinde 'İkamet izin taleplerine uygundur' ibaresi yer almalıdır.",
      doc5Source: "Belge Kaynağı: Türkiye'deki lisanslı sigorta acenteleri veya İskenderun SGK merkezi.",

      doc6Title: "6. Adres Kanıt Belgesi (Proof of Address)",
      doc6Desc: "Öğrencinin İskenderun veya Hatay'da fiilen ikamet ettiği adresi gösteren belge. Kiralık evde kalınıyorsa: Noter onaylı kira sözleşmesi, ev sahibinin tapu fotokopisi. İSTE öğrenci yurdunda kalınıyorsa: Yurt müdürlüğünden alınmış ıslak imzalı ve mühürlü yurt belgesi.",
      doc6Source: "Belge Kaynağı: İskenderun Noterleri, İSTE Yurt Müdürlüğü veya e-Devlet Nüfus Müdürlüğü kayıtları.",

      doc7Title: "7. Ulusal Elektronik Tebligat Sistemi (UETS) Belgesi",
      doc7Desc: "Nisan 2024 itibarıyla zorunlu hale gelen, Göç İdaresi'nden gelecek resmi elektronik tebligatları almak için oluşturulan yasal elektronik posta adresi belgesi.",
      doc7Source: "Belge Kaynağı: İskenderun PTT Merkez Şubesi (Pasaport ve aktif TR telefon numarası ile şahsen müracaat edilir).",

      doc8Title: "8. İkamet İzni Kart Bedeli Ödeme Makbuzu",
      doc8Desc: "Maliye Bakanlığı tarafından her yıl belirlenen ikamet kartı bedelinin ödendiğini gösteren, öğrencinin vergi numarası ve adını içeren ıslak imzalı/kaşeli veya dijital onaylı banka ödeme makbuzu.",
      doc8Source: "Belge Kaynağı: İnteraktif Vergi Dairesi (ivd.gib.gov.tr), İskenderun Vergi Dairesi veya Ziraat/VakıfBank şubeleri.",

      // Process Timeline
      processHeader: "Adım Adım Öğrenci İkamet İzni Başvuru Aşamaları",
      step1Title: "1. Adım: Üniversite Kaydı & Vergi Numarası",
      step1Desc: "İSTE'deki ders kaydınızı tamamlayarak barkodlu öğrenci belgenizi alın. Ardından online olarak veya Vergi Dairesi'nden yabancı vergi kimlik numarası (Vergi Numarası) çıkartın.",
      step2Title: "2. Adım: e-İkamet Başvurusu",
      step2Desc: "e-İkamet portalına girerek ilk kez başvuru seçeneğini seçin. Tüm bilgileri pasaportunuza birebir uygun olacak şekilde girin, randevu gününü belirleyip başvuru formunun çıktısını alın.",
      step3Title: "3. Adım: Adres Kaydı & UETS Alımı",
      step3Desc: "Kira sözleşmenizi notere onaylatın veya yurt belgenizi alın. İskenderun PTT şubesine giderek adınıza UETS (Elektronik Tebligat) adresinizi tanımlatıp belgesini alın.",
      step4Title: "4. Adım: Sigorta & Harç Ödemesi",
      step4Desc: "İkamet süresini kapsayan sağlık sigortanızı yaptırın. Kart harç bedelini İnteraktif Vergi Dairesi üzerinden ödeyip makbuzunun çıktısını alın.",
      step5Title: "5. Adım: Evrakları İSTE Öğrenci İşlerine Teslim Etme",
      step5Desc: "Tüm belgeleri kırmızı bir telli dosya içinde düzenleyerek, yasal süreniz dolmadan İSTE Rektörlük Kampüsü'ndeki Öğrenci İşleri Daire Başkanlığı Uluslararası Öğrenci Ofisi'ne teslim edin.",
      step6Title: "6. Adım: İkamet Kartının Teslim Alınması",
      step6Desc: "Üniversite dosyanızı Hatay İl Göç İdaresi'ne gönderir. Başvurunuz onaylandığında basılan ikamet kartınız, PTT kargo aracılığıyla beyan ettiğiniz ev/yurt adresine teslim edilir.",

      // Local Guide
      localGuideHeader: "İskenderun ve Hatay Genelindeki Resmi Kurumlar",
      localGuideSub: "İskenderun ve Hatay'da ikamet belgesi işlemleriniz için gitmeniz gereken resmi kurumlar ve adresleri:",
      
      loc1Title: "İskenderun İlçe Nüfus Müdürlüğü",
      loc1Desc: "Türkiye'deki adresinizi resmi nüfus sistemine kaydettirmek veya e-Devlet şifresi ile yerleşim yeri belgesi almak için başvurabileceğiniz birim.",
      loc1Address: "Adres: İskenderun Kaymakamlığı Binası İçi, Merkez, İskenderun.",

      loc2Title: "İskenderun Nöbetçi ve Resmi Noterleri",
      loc2Desc: "Kira sözleşmenizin yasal olarak onaylanması ve yabancı dildeki pasaport veya kimlik belgelerinizin Türkçe yeminli tercüme tasdiki için başvurulur.",
      loc2Address: "Adres: İskenderun Şehir Merkezi ve Şehit Pamir Caddesi çevresinde yoğunlaşmıştır.",

      loc3Title: "İskenderun Vergi Dairesi",
      loc3Desc: "Yabancı vergi kimlik numarası edinmek, ikamet kart bedelini nakit olarak vezneden ödemek ve vergi borcu sorgulamak için kullanılır.",
      loc3Address: "Adres: Yenişehir Mahallesi, İskenderun, Hatay.",

      loc4Title: "PTT İskenderun Merkez Şubesi",
      loc4Desc: "İkamet başvurusunun yeni şartı olan UETS (Ulusal Elektronik Tebligat Sistemi) adresinizi pasaportunuzla tanımlatmak ve kart kargonuzu takip etmek için kullanılır.",
      loc4Address: "Adres: Atatürk Anıtı karşısı, Merkez, İskenderun.",

      loc5Title: "Hatay İl Göç İdaresi Müdürlüğü",
      loc5Desc: "İSTE tarafından gönderilen öğrenci dosyalarını değerlendiren, onaylayan ve ikamet kartlarının basım emrini veren ana göç merkezidir.",
      loc5Address: "Adres: Antakya (Hatay İl Merkezi), Türkiye. (Dosyalarınız buraya üniversite kuryesi ile doğrudan iletilir).",

      loc6Title: "İskenderun Devlet Hastanesi",
      loc6Desc: "İl Göç İdaresi tarafından nadiren talep edilebilecek heyet raporları veya genel sağlık kurulu tetkikleri için başvurulacak tam teşekküllü devlet hastanesidir.",
      loc6Address: "Adres: Mustafa Kemal Mahallesi, İskenderun.",

      // Links Panel
      resourcesHeader: "Resmi İnternet Adresleri ve Hızlı Bağlantılar",
      resource1Label: "e-İkamet Randevu Sistemi",
      resource1Desc: "Türkiye Cumhuriyeti İçişleri Bakanlığı Göç İdaresi Başkanlığı resmi ikamet izni başvuru ve randevu sistemi.",
      resource2Label: "İnteraktif Vergi Dairesi (GİB)",
      resource2Desc: "İkametgah değerli kağıt bedelini (kart ücreti) kredi kartı ile 7/24 online ve güvenli ödeyebileceğiniz devlet portalı.",
      resource3Label: "İskenderun Teknik Üniversitesi (İSTE) Resmi Web Sitesi",
      resource3Desc: "Uluslararası öğrenci duyuruları, akademik takvim ve Öğrenci İşleri duyurularını takip edebileceğiniz ana sayfa.",
      resource4Label: "e-Devlet Kapısı",
      resource4Desc: "Barkodlu öğrenci belgesi, yerleşim yeri belgesi, SGK dökümleri ve UETS durumunuzu sorgulayabileceğiniz e-devlet portalı.",

      // Checklist Tool
      checklistHeader: "Öğrenci İkametgah Belgesi Takip Aracı",
      checklistSub: "Evraklarınızın hazır olma durumunu buradan takip edin. İSTE Öğrenci İşlerine teslim etmeden önce eksik evrak kalmadığından emin olun.",
      checklistProgress: "İkamet Dosyası Hazırlık Oranı",
      checkReady: "Hazır ve Eksiksiz",
      checkNotReady: "Hazırlanıyor / Eksik",

      // FAQs
      faqQ1: "Uluslararası lisansüstü öğrencilerin Türkiye'de çalışma hakkı var mıdır?",
      faqA1: "Evet, Türkiye'deki mevcut yasal düzenlemelere göre, yüksek lisans ve doktora programlarında okuyan uluslararası öğrenciler, Çalışma ve Sosyal Güvenlik Bakanlığı'ndan resmi çalışma izni (Çalışma İzni) almak koşuluyla yasal olarak çalışabilirler. Lisans öğrencilerinden farklı olarak lisansüstü öğrencilerde haftalık çalışma saati sınırı uygulanmamaktadır.",
      faqQ2: "Evrakları teslim ettikten sonra ikamet kartının gelmesi ne kadar sürer?",
      faqA2: "İSTE Öğrenci İşleri dosyayı kontrol edip Hatay İl Göç İdaresi'ne gönderdikten sonra süreç genellikle 30-60 gün içinde tamamlanır. Onaylanan kartınız Ankara'da basılarak PTT kargo ile doğrudan sisteme kaydettiğiniz ev veya yurt adresinize gönderilir.",
      faqQ3: "İkamet izni değerlendirme aşamasındayken Türkiye dışına seyahat edebilir miyim?",
      faqA3: "Evraklarınızı teslim edip sistem onayı aldıktan sonra üniversitenizden veya Göç İdaresi'nden 'Müracaat Belgesi' (Başvuru Kanıt Belgesi) talep edebilirsiniz. Bu resmi belge ile Türkiye dışına çıkıp en fazla 15 gün içerisinde vizesiz olarak geri dönme hakkınız bulunmaktadır.",
      faqQ4: "İkamet başvurum reddedilirse ne yapmam gerekir?",
      faqA4: "Eğitim durumunuz aktif olduğu sürece başvuru reddi son derece nadir bir durumdur. Ancak evrak eksikliği veya yanlış beyan nedeniyle ret alırsanız, size tebliğ edilen tarihten itibaren 10 gün içinde Türkiye sınırlarından çıkış yapmanız gerekir. Daha sonra yasal evraklarınızı tamamlayarak yeni bir vize ile giriş yapıp yeniden başvurabilirsiniz."
    }
  };

  const getT = (key: string) => {
    const activeLang = language === 'ar' ? 'ar' : 'tr';
    // @ts-ignore
    return content[activeLang][key] || key;
  };

  const docsList = [
    { key: 'applicationForm', title: getT('doc1Title'), desc: getT('doc1Desc'), source: getT('doc1Source') },
    { key: 'passportCopy', title: getT('doc2Title'), desc: getT('doc2Desc'), source: getT('doc2Source') },
    { key: 'studentCert', title: getT('doc3Title'), desc: getT('doc3Desc'), source: getT('doc3Source') },
    { key: 'photos', title: getT('doc4Title'), desc: getT('doc4Desc'), source: getT('doc4Source') },
    { key: 'insurance', title: getT('doc5Title'), desc: getT('doc5Desc'), source: getT('doc5Source') },
    { key: 'addressProof', title: getT('doc6Title'), desc: getT('doc6Desc'), source: getT('doc6Source') },
    { key: 'uets', title: getT('doc7Title'), desc: getT('doc7Desc'), source: getT('doc7Source') },
    { key: 'paymentReceipt', title: getT('doc8Title'), desc: getT('doc8Desc'), source: getT('doc8Source') },
  ];

  const timelineSteps = [
    { num: '01', title: getT('step1Title'), desc: getT('step1Desc') },
    { num: '02', title: getT('step2Title'), desc: getT('step2Desc') },
    { num: '03', title: getT('step3Title'), desc: getT('step3Desc') },
    { num: '04', title: getT('step4Title'), desc: getT('step4Desc') },
    { num: '05', title: getT('step5Title'), desc: getT('step5Desc') },
    { num: '06', title: getT('step6Title'), desc: getT('step6Desc') },
  ];

  const localOffices = [
    { key: 'nufus', title: getT('loc1Title'), desc: getT('loc1Desc'), address: getT('loc1Address') },
    { key: 'notary', title: getT('loc2Title'), desc: getT('loc2Desc'), address: getT('loc2Address') },
    { key: 'tax', title: getT('loc3Title'), desc: getT('loc3Desc'), address: getT('loc3Address') },
    { key: 'ptt', title: getT('loc4Title'), desc: getT('loc4Desc'), address: getT('loc4Address') },
    { key: 'goc', title: getT('loc5Title'), desc: getT('loc5Desc'), address: getT('loc5Address') },
    { key: 'hospital', title: getT('loc6Title'), desc: getT('loc6Desc'), address: getT('loc6Address') },
  ];

  const faqList = [
    { q: getT('faqQ1'), a: getT('faqA1') },
    { q: getT('faqQ2'), a: getT('faqA2') },
    { q: getT('faqQ3'), a: getT('faqA3') },
    { q: getT('faqQ4'), a: getT('faqA4') },
  ];

  const resourceLinks = [
    {
      label: getT('resource1Label'),
      desc: getT('resource1Desc'),
      url: 'https://e-ikamet.goc.gov.tr',
      badge: 'Göç İdaresi'
    },
    {
      label: getT('resource2Label'),
      desc: getT('resource2Desc'),
      url: 'https://ivd.gib.gov.tr',
      badge: 'GİB Vergi'
    },
    {
      label: getT('resource3Label'),
      desc: getT('resource3Desc'),
      url: 'https://www.iste.edu.tr',
      badge: 'İSTE Resmi'
    },
    {
      label: getT('resource4Label'),
      desc: getT('resource4Desc'),
      url: 'https://www.turkiye.gov.tr',
      badge: 'e-Devlet'
    }
  ];

  return (
    <div id="residency-requirements-section" className="space-y-10 animate-fade-in">
      
      {/* Premium Hero Title Card for İSTE */}
      <div className="bg-gradient-to-br from-burgundy-900 to-burgundy-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden border-2 border-amber-500/20">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-burgundy-700/20 rounded-full blur-3xl pointer-events-none" />
        
        {/* Decorative ribbons in İSTE / Turkish Academic Colors */}
        <div className="absolute top-0 left-10 w-4 h-16 bg-gradient-to-b from-amber-400 to-amber-500 rounded-b-md shadow-xs" />
        <div className="absolute top-0 left-16 w-3 h-12 bg-gradient-to-b from-amber-500/50 to-amber-600 rounded-b-md" />

        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="space-y-4 text-center md:text-start">
            <div className="inline-flex items-center gap-1.5 py-1 px-3 bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-extrabold rounded-full">
              <Fingerprint className="w-4.5 h-4.5 text-amber-400" />
              <span>{getT('universityCard')}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              {getT('pageTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-amber-100/80 font-bold max-w-2xl leading-relaxed">
              {getT('pageSubTitle')}
            </p>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl border border-white/10 shrink-0 text-center select-none w-full md:w-auto">
            <Building2 className="w-12 h-12 text-amber-400 mb-1" />
            <span className="text-[10px] font-bold text-slate-300">İskenderun Teknik Üniversitesi</span>
            <span className="text-[12px] font-extrabold text-white uppercase tracking-wider">İSTE (Hatay)</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-none select-none border-b border-slate-200">
        <button
          id="residency-tab-overview"
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-burgundy-700 text-white border-b-2 border-amber-500'
              : 'text-slate-600 hover:text-burgundy-700 hover:bg-slate-50'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>{getT('tabOverview')}</span>
        </button>
        <button
          id="residency-tab-degrees"
          onClick={() => setActiveTab('degrees')}
          className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
            activeTab === 'degrees'
              ? 'bg-burgundy-700 text-white border-b-2 border-amber-500'
              : 'text-slate-600 hover:text-burgundy-700 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>{getT('tabDegrees')}</span>
        </button>
        <button
          id="residency-tab-renewal"
          onClick={() => setActiveTab('renewal')}
          className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
            activeTab === 'renewal'
              ? 'bg-burgundy-700 text-white border-b-2 border-amber-500'
              : 'text-slate-600 hover:text-burgundy-700 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-4 h-4 text-emerald-500" />
          <span>{getT('tabRenewal')}</span>
        </button>
        <button
          id="residency-tab-documents"
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
            activeTab === 'documents'
              ? 'bg-burgundy-700 text-white border-b-2 border-amber-500'
              : 'text-slate-600 hover:text-burgundy-700 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{getT('tabDocuments')}</span>
        </button>
        <button
          id="residency-tab-process"
          onClick={() => setActiveTab('process')}
          className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
            activeTab === 'process'
              ? 'bg-burgundy-700 text-white border-b-2 border-amber-500'
              : 'text-slate-600 hover:text-burgundy-700 hover:bg-slate-50'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>{getT('tabProcess')}</span>
        </button>
        <button
          id="residency-tab-local"
          onClick={() => setActiveTab('local')}
          className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
            activeTab === 'local'
              ? 'bg-burgundy-700 text-white border-b-2 border-amber-500'
              : 'text-slate-600 hover:text-burgundy-700 hover:bg-slate-50'
          }`}
        >
          <MapPin className="w-4 h-4 text-amber-500" />
          <span>{getT('tabLocal')}</span>
        </button>
        <button
          id="residency-tab-checklist"
          onClick={() => setActiveTab('checklist')}
          className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
            activeTab === 'checklist'
              ? 'bg-burgundy-700 text-white border-b-2 border-amber-500'
              : 'text-slate-600 hover:text-burgundy-700 hover:bg-slate-50'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>{getT('tabChecklist')}</span>
        </button>
        <button
          id="residency-tab-faq"
          onClick={() => setActiveTab('faq')}
          className={`flex items-center gap-2 px-4 py-3 rounded-t-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
            activeTab === 'faq'
              ? 'bg-burgundy-700 text-white border-b-2 border-amber-500'
              : 'text-slate-600 hover:text-burgundy-700 hover:bg-slate-50'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>{getT('tabFaq')}</span>
        </button>
      </div>

      {/* Main Tab Content Panel */}
      <div id="residency-tab-content-panel" className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 shadow-xs">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-8"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-burgundy-50 rounded-2xl border border-burgundy-100 text-burgundy-700 shrink-0">
                  <Fingerprint className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    {getT('overviewHeader')}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-bold">
                    {getT('overviewText1')}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {getT('overviewText2')}
                  </p>
                </div>
              </div>

              {/* Key Rules card */}
              <div className="bg-amber-500/5 border-2 border-amber-500/20 rounded-2xl p-5 sm:p-6 space-y-4">
                <h4 className="text-xs sm:text-sm font-extrabold text-burgundy-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{getT('keyRulesTitle')}</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-slate-100 flex items-start gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-burgundy-700 shrink-0 mt-1.5" />
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {getT('rule1')}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-slate-100 flex items-start gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {getT('rule2')}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-slate-100 flex items-start gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {getT('rule3')}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-slate-100 flex items-start gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-1.5" />
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {getT('rule4')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'degrees' && (
            <motion.div
              key="degrees-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  {getT('degreesHeader')}
                </h3>
                <p className="text-xs text-slate-500 font-bold">
                  {getT('degreesSub')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div className="p-5 bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-amber-500/30 transition duration-200 space-y-3">
                  <h4 className="text-xs sm:text-sm font-extrabold text-burgundy-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    {getT('degreesDurationTitle')}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {getT('degreesDurationDesc')}
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-amber-500/30 transition duration-200 space-y-3">
                  <h4 className="text-xs sm:text-sm font-extrabold text-burgundy-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    {getT('degreesPrepTitle')}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {getT('degreesPrepDesc')}
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-amber-500/30 transition duration-200 space-y-3">
                  <h4 className="text-xs sm:text-sm font-extrabold text-burgundy-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-600" />
                    {getT('degreesAttendanceTitle')}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {getT('degreesAttendanceDesc')}
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-amber-500/30 transition duration-200 space-y-3">
                  <h4 className="text-xs sm:text-sm font-extrabold text-burgundy-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    {getT('degreesTransTitle')}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {getT('degreesTransDesc')}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'renewal' && (
            <motion.div
              key="renewal-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  {getT('renewalHeader')}
                </h3>
                <p className="text-xs text-slate-500 font-bold">
                  {getT('renewalSub')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                <div className="p-5 bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-emerald-500/30 transition duration-200 space-y-3">
                  <h4 className="text-xs sm:text-sm font-extrabold text-burgundy-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    {getT('renewalTimeTitle')}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {getT('renewalTimeDesc')}
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-emerald-500/30 transition duration-200 space-y-3">
                  <h4 className="text-xs sm:text-sm font-extrabold text-burgundy-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    {getT('renewalStepsTitle')}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {getT('renewalStepsDesc')}
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-emerald-500/30 transition duration-200 space-y-3">
                  <h4 className="text-xs sm:text-sm font-extrabold text-burgundy-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    {getT('renewalDocsTitle')}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {getT('renewalDocsDesc')}
                  </p>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-emerald-500/30 transition duration-200 space-y-3">
                  <h4 className="text-xs sm:text-sm font-extrabold text-burgundy-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                    {getT('renewalUniTitle')}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {getT('renewalUniDesc')}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'documents' && (
            <motion.div
              key="documents-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  {getT('docsHeader')}
                </h3>
                <p className="text-xs text-slate-500 font-bold">
                  {getT('docsSub')}
                </p>
              </div>

              {/* Grid of documents */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                {docsList.map((doc, idx) => (
                  <div 
                    key={doc.key}
                    className="p-5 bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-amber-500/30 hover:bg-amber-500/[0.01] transition duration-200 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-burgundy-100 text-burgundy-800 font-extrabold px-2 py-0.5 rounded">
                          Doc {idx + 1}
                        </span>
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                          {doc.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {doc.desc}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-200/60 text-[10px] text-slate-400 font-extrabold flex items-center gap-1 select-none">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{doc.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'process' && (
            <motion.div
              key="process-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-8"
            >
              {/* Responsibility block under YÖK-Göç İdaresi Protocol */}
              <div className="p-5 sm:p-6 bg-burgundy-950/5 border-2 border-burgundy-700/15 rounded-2xl space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-burgundy-700 text-white rounded-xl shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-extrabold text-burgundy-900">
                      {getT('responsibleTitle')}
                    </h4>
                    <p className="text-xs sm:text-sm font-extrabold text-amber-600">
                      {getT('responsibleParty')}
                    </p>
                  </div>
                </div>
                
                <p className="text-xs text-slate-600 leading-relaxed font-bold">
                  {getT('responsiblePartyDesc')}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
                    <h5 className="text-xs font-extrabold text-slate-950 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-burgundy-700" />
                      <span>{getT('coordinatorTitle')}</span>
                    </h5>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {getT('coordinatorDesc')}
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
                    <h5 className="text-xs font-extrabold text-slate-950 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-amber-500" />
                      <span>{getT('studentResponsibilityTitle')}</span>
                    </h5>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {getT('studentRespDesc')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline layout */}
              <div className="space-y-4">
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  {getT('processHeader')}
                </h4>
                
                <div className="relative border-l-2 border-burgundy-200/60 ml-4 pl-6 space-y-6">
                  {timelineSteps.map((step) => (
                    <div key={step.num} className="relative">
                      {/* Timeline Dot */}
                      <span className="absolute -left-10 top-0.5 flex items-center justify-center w-8 h-8 rounded-full bg-burgundy-50 border-2 border-burgundy-700 text-burgundy-800 text-xs font-extrabold select-none">
                        {step.num}
                      </span>
                      <div className="space-y-1">
                        <h5 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                          {step.title}
                        </h5>
                        <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'local' && (
            <motion.div
              key="local-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-6"
            >
              <div className="bg-amber-500/10 border-2 border-amber-500/20 rounded-2xl p-5 flex items-start gap-3">
                <MapPin className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    {getT('localGuideHeader')}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-bold">
                    {getT('localGuideSub')}
                  </p>
                </div>
              </div>

              {/* Grid of Local Offices */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                {localOffices.map((office) => (
                  <div 
                    key={office.key}
                    className="p-5 bg-slate-50 rounded-2xl border-2 border-slate-200 hover:border-burgundy-700/30 hover:bg-burgundy-700/[0.01] transition duration-200 flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-burgundy-700" />
                        {office.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {office.desc}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-200/60 text-[10px] text-burgundy-850 font-extrabold flex items-start gap-1 select-none">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{office.address}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'checklist' && (
            <motion.div
              key="checklist-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  {getT('checklistHeader')}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {getT('checklistSub')}
                </p>
              </div>

              {/* Interactive Checklist Box */}
              <div className="p-5 sm:p-6 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-6">
                
                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-extrabold text-slate-800">
                    <span>{getT('checklistProgress')}</span>
                    <span className="text-burgundy-700">{progressPercent}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Items checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 select-none">
                  {docsList.map((doc) => {
                    const isChecked = checkedDocs[doc.key];
                    return (
                      <button
                        key={doc.key}
                        type="button"
                        onClick={() => handleToggleDoc(doc.key)}
                        className={`p-4 rounded-xl border-2 text-start flex items-start gap-3 cursor-pointer transition duration-150 ${
                          isChecked 
                            ? 'bg-emerald-50/50 border-emerald-400 text-emerald-950' 
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {isChecked ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white" />
                          )}
                        </div>
                        <div className="space-y-1 min-w-0">
                          <p className="text-xs sm:text-sm font-extrabold truncate">
                            {doc.title.includes('.') ? doc.title.split('.')[1]?.trim() : doc.title}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold truncate">
                            {isChecked ? getT('checkReady') : getT('checkNotReady')}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

              </div>
            </motion.div>
          )}

          {activeTab === 'faq' && (
            <motion.div
              key="faq-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-4"
            >
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 pb-2">
                {getT('tabFaq')}
              </h3>

              <div className="space-y-3.5">
                {faqList.map((faq, idx) => {
                  const isExpanded = expandedFaq === idx;
                  return (
                    <div 
                      key={idx}
                      className="border-2 border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        className="w-full flex items-center justify-between p-4 text-start font-extrabold text-xs sm:text-sm text-slate-900 hover:bg-slate-50 transition cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4.5 h-4.5 text-burgundy-700 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4.5 h-4.5 text-slate-400 shrink-0" />
                        )}
                      </button>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="border-t border-slate-200 bg-white"
                          >
                            <div className="p-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Official Web Addresses and Resources Section */}
      <div id="residency-resources-panel" className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
            {getT('resourcesHeader')}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resourceLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-white rounded-xl border border-slate-200 hover:border-burgundy-700/40 hover:shadow-xs transition duration-150 flex items-start justify-between gap-4 group"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-extrabold shrink-0">
                    {link.badge}
                  </span>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-burgundy-700 transition truncate">
                    {link.label}
                  </h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {link.desc}
                </p>
                <p className="text-[10px] text-slate-400 font-mono truncate pt-1">
                  {link.url}
                </p>
              </div>
              <div className="p-1.5 bg-slate-50 rounded-lg text-slate-400 group-hover:text-burgundy-700 group-hover:bg-burgundy-50 transition shrink-0 mt-1">
                <ExternalLink className="w-4 h-4" />
              </div>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
};
