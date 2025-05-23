// بيانات تلوث الهواء للدول حول العالم
const pollutionData = [
    // الشرق الأوسط وشمال أفريقيا
    { name: "مصر", coords: [30.0444, 31.2357], pm25: 42, desc: "تلوث من المرور وحرق النفايات والصناعات", sources: ["المرور", "حرق النفايات", "الصناعات"], population: 104.3 },
    { name: "السعودية", coords: [24.7136, 46.6753], pm25: 108, desc: "تلوث من الصناعات النفطية والغبار الصحراوي", sources: ["الصناعات النفطية", "الغبار الصحراوي"], population: 35.3 },
    { name: "الإمارات", coords: [25.2048, 55.2708], pm25: 45.8, desc: "انبعاثات صناعية وغبار صحراوي", sources: ["صناعة", "غبار", "مرور"], population: 9.9 },
    { name: "قطر", coords: [25.2854, 51.5310], pm25: 40.2, desc: "انبعاثات صناعية وبناء", sources: ["صناعة", "بناء", "مرور"], population: 2.9 },
    { name: "المغرب", coords: [33.5731, -7.5898], pm25: 35.6, desc: "تلوث حضري وانبعاثات صناعية", sources: ["حضري", "صناعة", "مرور"], population: 37.1 },
    
    // آسيا
    { name: "الهند", coords: [28.6139, 77.2090], pm25: 98.6, desc: "انبعاثات صناعية وعوادم السيارات وحرق المحاصيل", sources: ["صناعة", "سيارات", "زراعة"], population: 1380.0 },
    { name: "الصين", coords: [39.9042, 116.4074], pm25: 82.6, desc: "تلوث صناعي ومحطات الطاقة بالفحم", sources: ["صناعة", "محطات طاقة", "سيارات"], population: 1402.0 },
    { name: "بنجلاديش", coords: [23.8103, 90.4125], pm25: 76.9, desc: "أفران الطوب وعوادم السيارات", sources: ["أفران طوب", "سيارات", "صناعة"], population: 164.7 },
    { name: "فيتنام", coords: [21.0285, 105.8542], pm25: 50.5, desc: "انبعاثات مرورية وصناعية", sources: ["مرور", "صناعة", "بناء"], population: 97.3 },
    { name: "إندونيسيا", coords: [-6.2088, 106.8456], pm25: 45.3, desc: "حرائق الغابات وتلوث حضري", sources: ["حرائق غابات", "تلوث حضري", "صناعة"], population: 273.5 },
    { name: "اليابان", coords: [35.6762, 139.6503], pm25: 12.3, desc: "انبعاثات مرورية وصناعية", sources: ["مرور", "صناعة", "طاقة"], population: 125.7 },
    { name: "كوريا الجنوبية", coords: [37.5665, 126.9780], pm25: 24.8, desc: "انبعاثات صناعية ومرورية", sources: ["صناعة", "سيارات", "طاقة"], population: 51.7 },
    { name: "تايلاند", coords: [13.7563, 100.5018], pm25: 32.6, desc: "مرور حضري وحرق زراعي", sources: ["مرور", "زراعة", "صناعة"], population: 69.8 },
    { name: "ماليزيا", coords: [3.1390, 101.6869], pm25: 28.3, desc: "حرائق الغابات وتلوث حضري", sources: ["حرائق غابات", "حضري", "صناعة"], population: 32.7 },
    { name: "الفلبين", coords: [14.5995, 120.9842], pm25: 31.2, desc: "عوادم السيارات وتلوث صناعي", sources: ["سيارات", "صناعة", "حضري"], population: 111.0 },
    
    // أوروبا
    { name: "ألمانيا", coords: [52.5200, 13.4050], pm25: 15.4, desc: "انبعاثات سيارات ونشاط صناعي", sources: ["سيارات", "صناعة", "طاقة"], population: 83.2 },
    { name: "فرنسا", coords: [48.8566, 2.3522], pm25: 14.8, desc: "مرور وتدفئة منزلية", sources: ["مرور", "تدفئة", "صناعة"], population: 67.4 },
    { name: "المملكة المتحدة", coords: [51.5074, -0.1278], pm25: 13.2, desc: "مرور حضري وانبعاثات صناعية", sources: ["مرور", "صناعة", "بناء"], population: 67.2 },
    { name: "السويد", coords: [59.3293, 18.0686], pm25: 7.4, desc: "تلوث منخفض بسبب الطاقة النظيفة", sources: ["مرور", "صناعة", "طبيعي"], population: 10.4 },
    { name: "إيطاليا", coords: [41.9028, 12.4964], pm25: 19.2, desc: "مرور حضري وانبعاثات صناعية", sources: ["مرور", "صناعة", "تدفئة"], population: 60.3 },
    { name: "إسبانيا", coords: [40.4168, -3.7038], pm25: 11.8, desc: "مرور حضري ونشاط صناعي", sources: ["مرور", "صناعة", "طبيعي"], population: 47.4 },
    { name: "هولندا", coords: [52.3676, 4.9041], pm25: 12.6, desc: "انبعاثات زراعية وصناعية", sources: ["زراعة", "صناعة", "مرور"], population: 17.5 },
    { name: "بولندا", coords: [52.2297, 21.0122], pm25: 20.8, desc: "محطات طاقة فحمية وانبعاثات صناعية", sources: ["محطات فحم", "صناعة", "مرور"], population: 37.8 },
    
    // الأمريكتان
    { name: "الولايات المتحدة", coords: [38.8977, -77.0365], pm25: 12.4, desc: "عوادم السيارات ومصادر صناعية", sources: ["سيارات", "صناعة", "محطات طاقة"], population: 331.0 },
    { name: "كندا", coords: [45.4215, -75.6972], pm25: 8.6, desc: "هواء نظيف مع بعض التلوث الحضري", sources: ["حضري", "صناعة", "طبيعي"], population: 38.0 },
    { name: "البرازيل", coords: [-15.7975, -47.8919], pm25: 16.8, desc: "تلوث حضري وإزالة الغابات", sources: ["حضري", "إزالة غابات", "صناعة"], population: 212.6 },
    { name: "المكسيك", coords: [19.4326, -99.1332], pm25: 32.6, desc: "مرور حضري وانبعاثات صناعية", sources: ["مرور", "صناعة", "طبيعي"], population: 128.9 },
    { name: "الأرجنتين", coords: [-34.6037, -58.3816], pm25: 15.2, desc: "مرور حضري وانبعاثات صناعية", sources: ["مرور", "صناعة", "زراعة"], population: 45.4 },
    { name: "تشيلي", coords: [-33.4489, -70.6693], pm25: 22.4, desc: "مرور حضري وانبعاثات صناعية", sources: ["مرور", "صناعة", "طبيعي"], population: 19.1 },
    { name: "كولومبيا", coords: [4.7110, -74.0721], pm25: 18.6, desc: "مرور حضري وانبعاثات صناعية", sources: ["مرور", "صناعة", "طبيعي"], population: 51.5 },
    
    // أفريقيا
    { name: "نيجيريا", coords: [9.0820, 8.6753], pm25: 70.4, desc: "استخدام المولدات وعوادم السيارات", sources: ["مولدات", "سيارات", "صناعة"], population: 206.1 },
    { name: "جنوب أفريقيا", coords: [-25.7461, 28.1881], pm25: 41.5, desc: "محطات طاقة فحمية وتعدين", sources: ["محطات فحم", "تعدين", "سيارات"], population: 59.3 },
    { name: "كينيا", coords: [-1.2921, 36.8219], pm25: 33.8, desc: "عوادم السيارات ونشاط صناعي", sources: ["سيارات", "صناعة", "طبيعي"], population: 53.8 },
    { name: "إثيوبيا", coords: [9.0320, 38.7488], pm25: 46.2, desc: "حرق الكتلة الحيوية وتلوث حضري", sources: ["كتلة حيوية", "حضري", "صناعة"], population: 117.9 },
    { name: "غانا", coords: [5.6037, -0.1870], pm25: 31.4, desc: "مرور حضري وانبعاثات صناعية", sources: ["مرور", "صناعة", "طبيعي"], population: 31.7 },
    { name: "تنزانيا", coords: [-6.7924, 39.2083], pm25: 35.6, desc: "حرق الكتلة الحيوية وتلوث حضري", sources: ["كتلة حيوية", "حضري", "صناعة"], population: 61.5 },
    
    // أوقيانوسيا
    { name: "أستراليا", coords: [-35.2809, 149.1300], pm25: 8.2, desc: "هواء نظيف بشكل عام مع عواصف ترابية عرضية", sources: ["طبيعي", "حضري", "صناعة"], population: 25.7 },
    { name: "نيوزيلندا", coords: [-41.2865, 174.7762], pm25: 6.8, desc: "جودة هواء نظيفة جداً", sources: ["حضري", "طبيعي", "صناعة"], population: 5.1 },
    { name: "فيجي", coords: [-18.1416, 178.4419], pm25: 5.2, desc: "هواء نظيف مع تلوث ضئيل", sources: ["طبيعي", "حضري", "صناعة"], population: 0.9 }
];

// التأثيرات الصحية بناءً على مستويات PM2.5
const healthEffects = {
    low: [
        "تأثير محدود على الأفراد الأصحاء",
        "قد يؤثر على الأفراد الحساسين",
        "زيادة طفيفة في أعراض الجهاز التنفسي"
    ],
    medium: [
        "زيادة أعراض الربو",
        "تهيج العين والحلق",
        "تأثيرات على الجهاز التنفسي",
        "زيادة مخاطر أمراض القلب",
        "تأثير أكبر على الأطفال وكبار السن"
    ],
    high: [
        "زيادة كبيرة في مخاطر أمراض القلب",
        "مشاكل تنفسية شديدة",
        "تفاقم الربو وأمراض الرئة",
        "زيادة معدلات الوفيات",
        "تأثير سلبي على نمو الأطفال",
        "زيادة مخاطر السكتة الدماغية"
    ]
};

// بيانات الخريطة الذهنية
const mindMapData = {
    name: "تلوث الهواء",
    children: [
        {
            name: "الأسباب",
            children: [
                { name: "النقل", value: 30 },
                { name: "الصناعة", value: 25 },
                { name: "حرق النفايات", value: 15 },
                { name: "محطات الطاقة", value: 20 },
                { name: "مصادر طبيعية", value: 10 }
            ]
        },
        {
            name: "التأثيرات الصحية",
            children: [
                { name: "أمراض القلب", value: 25 },
                { name: "مشاكل تنفسية", value: 30 },
                { name: "الربو", value: 20 },
                { name: "مخاطر السرطان", value: 15 },
                { name: "مشاكل النمو", value: 10 }
            ]
        },
        {
            name: "الحلول",
            children: [
                { name: "النقل العام", value: 20 },
                { name: "تقنيات نظيفة", value: 25 },
                { name: "مساحات خضراء", value: 15 },
                { name: "طاقة متجددة", value: 25 },
                { name: "تغييرات سياسية", value: 15 }
            ]
        }
    ]
};

// بيانات الخريطة الذهنية الإقليمية
const regionalMindMapData = {
    name: "تحليل إقليمي",
    children: [
        {
            name: "الشرق الأوسط وشمال أفريقيا",
            children: [
                { name: "متوسط PM2.5", value: 45.8 },
                { name: "مصادر رئيسية", value: 30 },
                { name: "تأثيرات صحية", value: 25 },
                { name: "حلول مقترحة", value: 20 }
            ]
        },
        {
            name: "آسيا",
            children: [
                { name: "متوسط PM2.5", value: 65.4 },
                { name: "مصادر رئيسية", value: 35 },
                { name: "تأثيرات صحية", value: 30 },
                { name: "حلول مقترحة", value: 25 }
            ]
        },
        {
            name: "أوروبا",
            children: [
                { name: "متوسط PM2.5", value: 15.2 },
                { name: "مصادر رئيسية", value: 20 },
                { name: "تأثيرات صحية", value: 15 },
                { name: "حلول مقترحة", value: 30 }
            ]
        },
        {
            name: "الأمريكتان",
            children: [
                { name: "متوسط PM2.5", value: 18.4 },
                { name: "مصادر رئيسية", value: 25 },
                { name: "تأثيرات صحية", value: 20 },
                { name: "حلول مقترحة", value: 28 }
            ]
        },
        {
            name: "أفريقيا",
            children: [
                { name: "متوسط PM2.5", value: 43.5 },
                { name: "مصادر رئيسية", value: 28 },
                { name: "تأثيرات صحية", value: 32 },
                { name: "حلول مقترحة", value: 22 }
            ]
        },
        {
            name: "أوقيانوسيا",
            children: [
                { name: "متوسط PM2.5", value: 6.7 },
                { name: "مصادر رئيسية", value: 15 },
                { name: "تأثيرات صحية", value: 10 },
                { name: "حلول مقترحة", value: 35 }
            ]
        }
    ]
};

// الحصول على مستوى المخاطر بناءً على قيم PM2.5
function getRiskLevel(pm25) {
    if (pm25 < 10) return { level: "منخفض", class: "success" };
    if (pm25 < 35) return { level: "متوسط", class: "warning" };
    return { level: "مرتفع", class: "danger" };
}

// الحصول على مستوى التصفية
function getFilterLevel(pm25) {
    if (pm25 < 30) return "منخفض";
    if (pm25 <= 50) return "متوسط";
    return "مرتفع";
}

// حساب متوسط التلوث
function calculateAvgPollution() {
    return pollutionData.reduce((sum, country) => sum + country.pm25, 0) / pollutionData.length;
}

// الحصول على أكثر الدول تلوثاً
function getTopPollutedCountries(count = 5) {
    return [...pollutionData].sort((a, b) => b.pm25 - a.pm25).slice(0, count);
}

// الحصول على الدول حسب مستوى التلوث
function getCountriesByLevel() {
    return {
        low: pollutionData.filter(c => c.pm25 < 30).length,
        medium: pollutionData.filter(c => c.pm25 >= 30 && c.pm25 <= 50).length,
        high: pollutionData.filter(c => c.pm25 > 50).length
    };
}

// تحديث الخريطة الذهنية مع أكثر الدول تلوثاً
function updateMindMapWithTopCountries() {
    const topCountries = getTopPollutedCountries();
    mindMapData.children.push({
        name: "أكثر الدول تلوثاً",
        children: topCountries.map(country => ({ name: country.name, value: country.pm25 }))
    });
    return mindMapData;
}