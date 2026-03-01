export interface YDTVocab {
    id: string;
    word: string;
    meaning: string;
    synonyms: string[];
    antonyms: string[];
    mnemonic: string;
    context: string;
}

export const YDT_VOCAB_DB: YDTVocab[] = [
    {
        id: "1",
        word: "ABANDON",
        meaning: "Terk etmek, bırakmak",
        synonyms: ["leave", "desert", "quit", "forsake"],
        antonyms: ["keep", "maintain", "stay"],
        mnemonic: "A-ban-don: A band don (bir bando lideri) grubunu terk etti.",
        context: "The villagers had to abandon their homes due to the flood."
    },
    {
        id: "2",
        word: "ABOLISH",
        meaning: "Yürürlükten kaldırmak, son vermek",
        synonyms: ["eliminate", "destroy", "annul", "terminate"],
        antonyms: ["establish", "create", "promote"],
        mnemonic: "A-boliş: Bulaşıkları kaldırmak (son vermek) gibi hatırlayabilirsin.",
        context: "Slavery was abolished in the United States in 1865."
    },
    {
        id: "3",
        word: "ABSORB",
        meaning: "İçine çekmek, emmek",
        synonyms: ["soak up", "take in", "consume"],
        antonyms: ["emit", "exude", "release"],
        mnemonic: "Ab-sorb: Sorbeyi hüpleterek içine çekmek.",
        context: "Plants absorb carbon dioxide from the air."
    },
    {
        id: "4",
        word: "ABUNDANT",
        meaning: "Bol, bereketli",
        synonyms: ["plentiful", "copious", "ample", "rich"],
        antonyms: ["scarce", "rare", "lacking"],
        mnemonic: "A-bun-dant: Bu dükkanda danteller çok bol (abundant).",
        context: "The country has abundant natural resources."
    },
    {
        id: "5",
        word: "ACCELERATE",
        meaning: "Hızlandırmak, ivmelendirmek",
        synonyms: ["speed up", "quicken", "hasten"],
        antonyms: ["slow down", "decelerate", "delay"],
        mnemonic: "Accelera (Gaz pedalı) kelimesinden gelir.",
        context: "The unexpected wind helped to accelerate the boat's speed."
    },
    {
        id: "6",
        word: "ACCESSIBLE",
        meaning: "Ulaşılabilir, erişilebilir",
        synonyms: ["reachable", "available", "approachable"],
        antonyms: ["inaccessible", "unavailable", "hidden"],
        mnemonic: "Access (Erişim) kelime kökü.",
        context: "The new library is accessible to people using wheelchairs."
    },
    {
        id: "7",
        word: "ACCOMMODATE",
        meaning: "Ağırlamak, yer sağlamak",
        synonyms: ["house", "lodge", "shelter", "fit"],
        antonyms: ["turn away", "reject"],
        mnemonic: "A-com-mo-date: Bir komutanlıkta tarihe(date) uygun olarak askerleri ağırlamak.",
        context: "The hotel can accommodate up to 500 guests."
    },
    {
        id: "8",
        word: "ACCUMULATE",
        meaning: "Birikmek, toplanmak",
        synonyms: ["gather", "collect", "amass", "pile up"],
        antonyms: ["scatter", "disperse", "spend"],
        mnemonic: "Akü-müle-ate: Aküler (enerjiyi) biriktirir.",
        context: "Over the years, he has accumulated a vast collection of stamps."
    },
    {
        id: "9",
        word: "ACCURATE",
        meaning: "Doğru, kesin",
        synonyms: ["correct", "exact", "precise", "true"],
        antonyms: ["inaccurate", "wrong", "false"],
        mnemonic: "A-cure-ate: Tedavi (cure) yediği için doğru (accurate) teşhis kondu.",
        context: "The thermometer provides an accurate reading of the room's temperature."
    },
    {
        id: "10",
        word: "ACHIEVE",
        meaning: "Başarmak, elde etmek",
        synonyms: ["accomplish", "attain", "reach", "fulfill"],
        antonyms: ["fail", "miss", "give up"],
        mnemonic: "Archi-eve: Arşivleri yılbaşında (eve) tamamlamayı başardı.",
        context: "She worked very hard to achieve her dreams."
    },
    {
        id: "11",
        word: "ACKNOWLEDGE",
        meaning: "Kabul etmek, onaylamak",
        synonyms: ["admit", "recognize", "accept", "grant"],
        antonyms: ["deny", "reject", "ignore"],
        mnemonic: "Ac-knowledge: Bilgiyi (knowledge) kabul etmek.",
        context: "He refused to acknowledge his mistake."
    },
    {
        id: "12",
        word: "ACQUIRE",
        meaning: "Elde etmek, kazanmak",
        synonyms: ["obtain", "get", "gain", "earn"],
        antonyms: ["lose", "forfeit", "surrender"],
        mnemonic: "A-quire: Koro (choir) yeni bir ses elde etti.",
        context: "She acquired a large fortune after her uncle passed away."
    },
    {
        id: "13",
        word: "ADAPT",
        meaning: "Uyum sağlamak",
        synonyms: ["adjust", "accommodate", "conform", "modify"],
        antonyms: ["refuse", "reject", "disarrange"],
        mnemonic: "Adaptör (uyarlayıcı) cihazından aklına gelsin.",
        context: "Animals must adapt to changing environmental conditions."
    },
    {
        id: "14",
        word: "ADEQUATE",
        meaning: "Yeterli, kafi",
        synonyms: ["sufficient", "enough", "satisfactory"],
        antonyms: ["inadequate", "insufficient", "lacking"],
        mnemonic: "A-de-quate: A dequate (Ah de kotan) yeterli mi?",
        context: "The training provided was not adequate for the job."
    },
    {
        id: "15",
        word: "ADHERE",
        meaning: "Yapışmak, bağlı kalmak",
        synonyms: ["stick", "cling", "attach", "abide by"],
        antonyms: ["detach", "separate", "release"],
        mnemonic: "Ad-here: Adını buraya (here) yapıştır.",
        context: "Visitors must strictly adhere to the museum's rules."
    },
    {
        id: "16",
        word: "ADJUST",
        meaning: "Ayarlamak, uydurmak",
        synonyms: ["modify", "alter", "regulate", "tune"],
        antonyms: ["derange", "disorganize"],
        mnemonic: "Just: Sadece ayarladım (Adjust).",
        context: "You need to adjust your mirror before driving."
    },
    {
        id: "17",
        word: "ADMINISTER",
        meaning: "Yönetmek, idare etmek",
        synonyms: ["manage", "direct", "govern", "conduct"],
        antonyms: ["mismanage", "neglect"],
        mnemonic: "Administrator (Yönetici) kelimesi.",
        context: "The principal is responsible for administering the school."
    },
    {
        id: "18",
        word: "ADMIRE",
        meaning: "Hayran olmak",
        synonyms: ["respect", "appreciate", "look up to"],
        antonyms: ["despise", "dislike", "hate"],
        mnemonic: "Ad-mire: Adını aynaya (mirror) yazıp hayran kaldım.",
        context: "I really admire her dedication to the project."
    },
    {
        id: "19",
        word: "ADOPT",
        meaning: "Evlat edinmek, benimsemek",
        synonyms: ["take in", "embrace", "accept", "choose"],
        antonyms: ["reject", "abandon", "discard"],
        mnemonic: "Opt (seçmek) kökünden, kendine ait olarak seçmek.",
        context: "The couple decided to adopt a beautiful little girl."
    },
    {
        id: "20",
        word: "ADVANCE",
        meaning: "İlerlemek, gelişmek",
        synonyms: ["progress", "proceed", "move forward", "improve"],
        antonyms: ["retreat", "regress", "withdraw"],
        mnemonic: "Advantage (Avataj) sağlayan şey ilerler (Advance).",
        context: "Medical science has advanced significantly over the last decade."
    },
    {
        id: "21",
        word: "AFFECT",
        meaning: "Etkilemek",
        synonyms: ["influence", "impact", "alter", "change"],
        antonyms: ["remain", "stay"],
        mnemonic: "Effect (İsim: Etki) -> Affect (Fiil: Etkilemek).",
        context: "The stormy weather will affect our travel plans."
    },
    {
        id: "22",
        word: "AGGRAVATE",
        meaning: "Kötüleştirmek, ağırlaştırmak",
        synonyms: ["worsen", "exacerbate", "annoy", "irritate"],
        antonyms: ["alleviate", "soothe", "calm"],
        mnemonic: "Agresifleşmek durumu kötüleştirir.",
        context: "Scratching the mosquito bite will only aggravate the itch."
    },
    {
        id: "23",
        word: "ALLEVIATE",
        meaning: "Hafifletmek, dindirmek",
        synonyms: ["relieve", "ease", "lessen", "reduce"],
        antonyms: ["aggravate", "worsen", "intensify"],
        mnemonic: "A-levi-ate: Ali evi yedi, açlığı hafifledi.",
        context: "The doctor prescribed medicine to alleviate her pain."
    },
    {
        id: "24",
        word: "ALLOCATE",
        meaning: "Ayırmak, tahsis etmek",
        synonyms: ["distribute", "assign", "allot", "apportion"],
        antonyms: ["withhold", "keep", "retain"],
        mnemonic: "Al-locate: Al bu lokasyonu, sana tahsis ettim.",
        context: "The government will allocate funds for education."
    },
    {
        id: "25",
        word: "ALTER",
        meaning: "Değiştirmek",
        synonyms: ["change", "modify", "amend", "adjust"],
        antonyms: ["maintain", "preserve", "keep"],
        mnemonic: "Alternative (Alternatif) arayan değiştirir (Alter).",
        context: "You should not alter the document without permission."
    },
    {
        id: "26",
        word: "AMBIGUOUS",
        meaning: "Belirsiz, iki anlamlı",
        synonyms: ["vague", "unclear", "equivocal", "obscure"],
        antonyms: ["clear", "obvious", "explicit", "certain"],
        mnemonic: "Ambi (iki) kökü. İki anlamı olduğu için belirsiz.",
        context: "The politician gave an ambiguous answer to the reporter's question."
    },
    {
        id: "27",
        word: "AMEND",
        meaning: "Değiştirmek, düzeltmek",
        synonyms: ["alter", "change", "modify", "improve"],
        antonyms: ["worsen", "corrupt", "stay"],
        mnemonic: "A-mend: Tamir etmek (mend) düzeltmek demektir.",
        context: "The constitution of the club was amended last year."
    },
    {
        id: "28",
        word: "AMPLIFY",
        meaning: "Yükseltmek, artırmak",
        synonyms: ["magnify", "increase", "boost", "expand"],
        antonyms: ["reduce", "decrease", "lessen"],
        mnemonic: "Amfi (Amplifier) sesi yükseltir.",
        context: "He used a microphone to amplify his voice."
    },
    {
        id: "29",
        word: "ANTICIPATE",
        meaning: "Beklemek, ummak (önceden görmek)",
        synonyms: ["expect", "predict", "foresee", "await"],
        antonyms: ["doubt", "be surprised", "ignore"],
        mnemonic: "Anti-cipate: Anti patiler gelmeden önce saldırmalarını bekliyordu.",
        context: "We did not anticipate such a huge crowd at the event."
    },
    {
        id: "30",
        word: "APPROACH",
        meaning: "Yaklaşmak, yaklaşım",
        synonyms: ["come near", "move towards", "method", "perspective"],
        antonyms: ["leave", "depart", "withdraw"],
        mnemonic: "App-roach: Uygulamaya(App) bir hamamböceği(roach) yaklaşıyor.",
        context: "As winter approaches, birds start to migrate."
    },
    {
        id: "31",
        word: "APPROVE",
        meaning: "Onaylamak",
        synonyms: ["accept", "agree", "endorse", "authorize"],
        antonyms: ["reject", "disapprove", "deny"],
        mnemonic: "Proof (Kanıt) gelince olay onaylandı (Approve).",
        context: "The manager will approve the new budget tomorrow."
    },
    {
        id: "32",
        word: "ARROGANT",
        meaning: "Kibirli, küstah",
        synonyms: ["conceited", "haughty", "proud", "boastful"],
        antonyms: ["humble", "modest", "meek"],
        mnemonic: "Arro-gant: Ara ara gelen büyüklenme hali.",
        context: "His arrogant attitude made him unpopular among his colleagues."
    },
    {
        id: "33",
        word: "ARTIFICIAL",
        meaning: "Yapay, suni",
        synonyms: ["synthetic", "fake", "unnatural", "man-made"],
        antonyms: ["natural", "real", "genuine"],
        mnemonic: "Art (Sanat) ürünleri genellikle insan yapımıdır (Artificial).",
        context: "Many soft drinks contain artificial flavors and colors."
    },
    {
        id: "34",
        word: "ASCERTAIN",
        meaning: "Anlamak, belirlemek",
        synonyms: ["determine", "find out", "discover", "verify"],
        antonyms: ["guess", "ignore", "overlook"],
        mnemonic: "As-certain: Kesin(certain) olarak anlamak.",
        context: "The police are trying to ascertain the cause of the fire."
    },
    {
        id: "35",
        word: "ASSESS",
        meaning: "Değerlendirmek, değer biçmek",
        synonyms: ["evaluate", "judge", "estimate", "appraise"],
        antonyms: ["ignore", "neglect", "guess"],
        mnemonic: "As-sess: Asistanın sesini performansından değerlendir.",
        context: "The insurance company sent someone to assess the damage."
    },
    {
        id: "36",
        word: "ASSIGN",
        meaning: "Atamak, görevlendirmek",
        synonyms: ["allocate", "designate", "appoint", "give"],
        antonyms: ["keep", "reject", "dismiss"],
        mnemonic: "As-sign: İmzalayarak(sign) birini bir yere atamak.",
        context: "The teacher will assign a new project next week."
    },
    {
        id: "37",
        word: "ASSOCIATE",
        meaning: "İlişkilendirmek",
        synonyms: ["connect", "link", "relate", "correlate"],
        antonyms: ["separate", "disconnect", "divide"],
        mnemonic: "Association (Dernek) insanları ilişkilendirir.",
        context: "Fast food is often associated with obesity."
    },
    {
        id: "38",
        word: "ASSUME",
        meaning: "Varsaymak, üstlenmek",
        synonyms: ["presume", "suppose", "guess", "undertake"],
        antonyms: ["know", "prove", "leave"],
        mnemonic: "As-sume: Sümmeyi as (sümeyye'yi varsay).",
        context: "I assume you have already read the instructions."
    },
    {
        id: "39",
        word: "ATTEMPT",
        meaning: "Çabalamak, girişimde bulunmak",
        synonyms: ["try", "endeavor", "strive", "effort"],
        antonyms: ["give up", "success (noun)"],
        mnemonic: "At-tempt: Atı çadırda (tent) tutmaya çalıştı (çabaladı).",
        context: "He made a brave attempt to rescue the drowning cat."
    },
    {
        id: "40",
        word: "ATTEND",
        meaning: "Katılmak, eşlik etmek",
        synonyms: ["be present", "go to", "participate", "show up"],
        antonyms: ["miss", "skip", "be absent"],
        mnemonic: "At-tend: Atın(horse) çadırda(tent) yapılan törene katılması.",
        context: "All employees are required to attend the meeting."
    },
    {
        id: "41",
        word: "AVAILABLE",
        meaning: "Müsait, ulaşılabilir, mevcut",
        synonyms: ["accessible", "obtainable", "ready", "free"],
        antonyms: ["unavailable", "busy", "taken"],
        mnemonic: "Avail (fayda) getiren şey el altında mevuttur.",
        context: "Are there any tickets available for tonight's show?"
    },
    {
        id: "42",
        word: "AVOID",
        meaning: "Kaçınmak, uzak durmak",
        synonyms: ["stay away", "evade", "dodge", "shirk"],
        antonyms: ["face", "seek", "confront"],
        mnemonic: "A-void: Void (boşluk) olan şeyden kaçınırsın.",
        context: "He tried to avoid answering the difficult question."
    },
    {
        id: "43",
        word: "AWARE",
        meaning: "Farkında, haberdar",
        synonyms: ["conscious", "mindful", "knowledgeable", "informed"],
        antonyms: ["unaware", "ignorant", "unconscious"],
        mnemonic: "A-ware: Uyarıyla (warning) farkında oldum.",
        context: "Are you aware of the new rules implemented by the company?"
    },
    {
        id: "44",
        word: "AWKWARD",
        meaning: "Tuhaf, beceriksiz",
        synonyms: ["clumsy", "weird", "uncomfortable", "inelegant"],
        antonyms: ["graceful", "skillful", "comfortable"],
        mnemonic: "Awk-ward: Korkak bir ödül (award) gecesindeki tuhaflık.",
        context: "There was an awkward silence after he made that joke."
    },
    {
        id: "45",
        word: "BAN",
        meaning: "Yasaklamak",
        synonyms: ["prohibit", "forbid", "veto", "outlaw"],
        antonyms: ["allow", "permit", "authorize"],
        mnemonic: "Ban yemek.",
        context: "Smoking has been banned in all indoor public spaces."
    },
    {
        id: "46",
        word: "BARRIER",
        meaning: "Engel, bariyer",
        synonyms: ["obstacle", "hurdle", "blockade"],
        antonyms: ["opening", "help", "clearance"],
        mnemonic: "Bariyer.",
        context: "Language can sometimes be a barrier to communication."
    },
    {
        id: "47",
        word: "BENEFICIAL",
        meaning: "Faydalı, yararlı",
        synonyms: ["helpful", "useful", "advantageous", "profitable"],
        antonyms: ["harmful", "detrimental", "useless"],
        mnemonic: "Benefit (Fayda) kökünden gelir.",
        context: "Eating fresh vegetables is highly beneficial for your health."
    },
    {
        id: "48",
        word: "BETRAY",
        meaning: "İhanet etmek, ele vermek",
        synonyms: ["deceive", "cheat", "double-cross", "reveal"],
        antonyms: ["protect", "defend", "be loyal"],
        mnemonic: "Be-tray: Tepsiyle (tray) çay getirip arkadan bıçakladı.",
        context: "He felt anger because his best friend had betrayed him."
    },
    {
        id: "49",
        word: "BIAS",
        meaning: "Önyargı, eğilim",
        synonyms: ["prejudice", "partiality", "favoritism"],
        antonyms: ["fairness", "objectivity", "impartiality"],
        mnemonic: "Bay-es: Bay Esra'ya karşı önyargılı (Bias).",
        context: "The manager's bias against young workers was obvious."
    },
    {
        id: "50",
        word: "BLAME",
        meaning: "Suçlamak",
        synonyms: ["accuse", "hold responsible", "fault"],
        antonyms: ["praise", "forgive", "acquit"],
        mnemonic: "B-lame: Boşuna (lame) adamı suçlama.",
        context: "You shouldn't blame yourself for the accident."
    },
{
    "id": "1",
    "word": "phenomenon",
    "meaning": "Olgu, olay",
    "synonyms": [
        "event",
        "occurrence",
        "happening"
    ],
    "antonyms": [
        "normality",
        "routine"
    ],
    "mnemonic": "Fenomen olan şey, akıl almaz",
    "context": "The scientist studied the phenomenon of climate change and its effects on the environment."
},
{
    "id": "2",
    "word": "hypothesis",
    "meaning": "Hipotez, varsayım",
    "synonyms": [
        "theory",
        "assumption",
        "conjecture"
    ],
    "antonyms": [
        "fact",
        "reality"
    ],
    "mnemonic": "Hipotez, hükme varmak için kullanılır",
    "context": "The researcher formulated a hypothesis to explain the results of the experiment."
},
{
    "id": "3",
    "word": "analysis",
    "meaning": "Çözümleme, analiz",
    "synonyms": [
        "examination",
        "investigation",
        "evaluation"
    ],
    "antonyms": [
        "synthesis",
        "combination"
    ],
    "mnemonic": "Analiz, ayrıntılara bakmak demektir",
    "context": "The company conducted a thorough analysis of the market trends before launching the new product."
},
{
    "id": "4",
    "word": "methodology",
    "meaning": "Yöntem bilimi, metodoloji",
    "synonyms": [
        "approach",
        "technique",
        "procedure"
    ],
    "antonyms": [
        "randomness",
        "chaos"
    ],
    "mnemonic": "Metodoloji, bir işi yapmanın yolu",
    "context": "The researcher's methodology was criticized for being too narrow and limited."
},
{
    "id": "5",
    "word": "paradigm",
    "meaning": "Örnek, model, paradigm",
    "synonyms": [
        "example",
        "pattern",
        "framework"
    ],
    "antonyms": [
        "exception",
        "anomaly"
    ],
    "mnemonic": "Paradigm, bir şeyin örnek alınması",
    "context": "The new paradigm in education focuses on student-centered learning and interactive approaches."
},
{
    "id": "6",
    "word": "empirical",
    "meaning": "Deneysel, gözlemsel",
    "synonyms": [
        "experimental",
        "observational",
        "factual"
    ],
    "antonyms": [
        "theoretical",
        "hypothetical"
    ],
    "mnemonic": "Empirik, deneyim ve gözlem ile ilgili",
    "context": "The empirical evidence supported the researcher's claims about the effectiveness of the new treatment."
},
{
    "id": "7",
    "word": "inference",
    "meaning": "Varsayım, çıkarım",
    "synonyms": [
        "conclusion",
        "deduction",
        "interpretation"
    ],
    "antonyms": [
        "fact",
        "certainty"
    ],
    "mnemonic": "İnferece, bir şeyin anlamını çıkarmak",
    "context": "The detective made an inference about the suspect's guilt based on the evidence found at the crime scene."
},
{
    "id": "8",
    "word": "criterion",
    "meaning": "Kriter, ölçüt",
    "synonyms": [
        "standard",
        "measure",
        "benchmark"
    ],
    "antonyms": [
        "variable",
        "unpredictable"
    ],
    "mnemonic": "Kriter, bir şeyi değerlendirmek için kullanılan ölçüt",
    "context": "The university used a strict criterion for selecting students for the scholarship program."
},
{
    "id": "9",
    "word": "narrative",
    "meaning": "Anlatı, hikaye",
    "synonyms": [
        "story",
        "account",
        "description"
    ],
    "antonyms": [
        "fact",
        "reality"
    ],
    "mnemonic": "Narrative, bir olayı veya hikayeyi anlatmak",
    "context": "The author's narrative style was engaging and immersive, drawing the reader into the world of the story."
},
{
    "id": "10",
    "word": "rhetoric",
    "meaning": "Hitabet, söylev sanatı",
    "synonyms": [
        "oratory",
        "eloquence",
        "persuasion"
    ],
    "antonyms": [
        "silence",
        "inaction"
    ],
    "mnemonic": "Retorik, insanları ikna etmek için kullanılan sanat",
    "context": "The politician's rhetoric was powerful and convincing, winning over the hearts and minds of the audience."
},
{
    "id": "11",
    "word": "schema",
    "meaning": "Şema, plan",
    "synonyms": [
        "framework",
        "outline",
        "diagram"
    ],
    "antonyms": [
        "chaos",
        "disorder"
    ],
    "mnemonic": "Şema, bir şeyi organize etmek için kullanılan plan",
    "context": "The teacher used a schema to help students understand the structure of the lesson and the relationships between different concepts."
},
{
    "id": "12",
    "word": "taxonomy",
    "meaning": "Sınıflandırma, taksonomi",
    "synonyms": [
        "classification",
        "categorization",
        "organization"
    ],
    "antonyms": [
        "randomness",
        "disorder"
    ],
    "mnemonic": "Taksonomi, canlıları sınıflandırmak için kullanılan bilim",
    "context": "The biologist developed a new taxonomy for classifying species based on their genetic characteristics."
},
{
    "id": "13",
    "word": "validity",
    "meaning": "Geçerlilik, doğruluk",
    "synonyms": [
        "accuracy",
        "reliability",
        "credibility"
    ],
    "antonyms": [
        "invalidity",
        "fallacy"
    ],
    "mnemonic": "Geçerlilik, bir şeyin doğru ve güvenilir olması",
    "context": "The researcher ensured the validity of the data by using a rigorous methodology and controlling for external factors."
},
{
    "id": "14",
    "word": "reliability",
    "meaning": "Güvenilirlik, tutarlılık",
    "synonyms": [
        "consistency",
        "dependability",
        "stability"
    ],
    "antonyms": [
        "unreliability",
        "inconsistency"
    ],
    "mnemonic": "Güvenilirlik, bir şeyin her zaman aynı şekilde davranması",
    "context": "The company tested the reliability of the new product by subjecting it to various stress tests and simulations."
},
{
    "id": "15",
    "word": "generalizability",
    "meaning": "Genelleştirilebilirlik, genişletilebilirlik",
    "synonyms": [
        "applicability",
        "transferability",
        "scalability"
    ],
    "antonyms": [
        "specificity",
        "particularity"
    ],
    "mnemonic": "Genelleştirilebilirlik, bir şeyin geniş bir alana uygulanabilmesi",
    "context": "The researcher aimed to increase the generalizability of the findings by using a diverse sample and controlling for external factors."
},
{
    "id": "16",
    "word": "correlation",
    "meaning": "Bağıntı, korelasyon",
    "synonyms": [
        "relationship",
        "association",
        "connection"
    ],
    "antonyms": [
        "independence",
        "separation"
    ],
    "mnemonic": "Korelasyon, iki şey arasındaki ilişki",
    "context": "The study found a strong correlation between the amount of exercise and the level of happiness."
},
{
    "id": "17",
    "word": "causality",
    "meaning": "Nedensellik, sebep-sonuç ilişkisi",
    "synonyms": [
        "cause-and-effect",
        "influence",
        "determination"
    ],
    "antonyms": [
        "coincidence",
        "chance"
    ],
    "mnemonic": "Nedensellik, bir şeyin başka bir şeyi etkilemesi",
    "context": "The scientist investigated the causality between the new medication and the reduction in symptoms."
},
{
    "id": "18",
    "word": "abstraction",
    "meaning": "Soyutlama, özelleştirme",
    "synonyms": [
        "conceptualization",
        "generalization",
        "representation"
    ],
    "antonyms": [
        "concreteness",
        "specificity"
    ],
    "mnemonic": "Soyutlama, somut şeyleri genel bir kavram olarak ifade etmek",
    "context": "The artist used abstraction to create a painting that represented the emotions and feelings of the viewer."
},
{
    "id": "19",
    "word": "contextualization",
    "meaning": "Bağlamsallaştırma, içeriğe yerleştirme",
    "synonyms": [
        "situation",
        "circumstance",
        "environment"
    ],
    "antonyms": [
        "isolation",
        "separation"
    ],
    "mnemonic": "Bağlamsallaştırma, bir şeyi çevresindeki koşullara göre anlamak",
    "context": "The historian contextualized the event by describing the social, political, and economic conditions of the time."
},
{
    "id": "20",
    "word": "interdisciplinary",
    "meaning": "Disiplinler arası, çok disiplinli",
    "synonyms": [
        "multidisciplinary",
        "transdisciplinary",
        "interconnected"
    ],
    "antonyms": [
        "disciplinary",
        "narrow"
    ],
    "mnemonic": "Disiplinler arası, farklı alanların bir arada çalışması",
    "context": "The university encouraged interdisciplinary research by providing funding for projects that combined multiple fields of study."
},
{
    "id": "21",
    "word": "authoritarian",
    "meaning": "Otoriter, baskıcı",
    "synonyms": [
        "dictatorial",
        "totalitarian",
        "despotic"
    ],
    "antonyms": [
        "democratic",
        "liberal"
    ],
    "mnemonic": "Otorite bana karşıdır",
    "context": "The authoritarian government imposed strict controls on freedom of speech."
},
{
    "id": "22",
    "word": "bureaucracy",
    "meaning": "Bürokrasi",
    "synonyms": [
        "administration",
        "officialdom",
        "red tape"
    ],
    "antonyms": [
        "efficiency",
        "streamlining"
    ],
    "mnemonic": "Bürokratlar bizi boğar",
    "context": "The bureaucracy in the government agency made it difficult to get anything done quickly."
},
{
    "id": "23",
    "word": "capitalism",
    "meaning": "Kapitalizm",
    "synonyms": [
        "free market",
        "laissez-faire",
        "neoliberalism"
    ],
    "antonyms": [
        "socialism",
        "communism"
    ],
    "mnemonic": "Kapitalizm para sever",
    "context": "The rise of capitalism in the 19th century led to significant economic growth and industrialization."
},
{
    "id": "24",
    "word": "colonialism",
    "meaning": "Sömürgecilik",
    "synonyms": [
        "imperialism",
        "expansionism",
        "domination"
    ],
    "antonyms": [
        "independence",
        "self-governance"
    ],
    "mnemonic": "Sömürgeciler bizi ezdi",
    "context": "The legacy of colonialism continues to impact the economies and cultures of many countries today."
},
{
    "id": "25",
    "word": "democratization",
    "meaning": "Demokratikleşme",
    "synonyms": [
        "liberalization",
        "reform",
        "enfranchisement"
    ],
    "antonyms": [
        "authoritarianism",
        "repression"
    ],
    "mnemonic": "Demokrasi insanları özgürleştirir",
    "context": "The democratization of the country led to an increase in political participation and civic engagement."
},
{
    "id": "26",
    "word": "dialectic",
    "meaning": "Diyalektik",
    "synonyms": [
        "dialogue",
        "debate",
        "discourse"
    ],
    "antonyms": [
        "monologue",
        "soliloquy"
    ],
    "mnemonic": "Diyalektik düşünce özgürdür",
    "context": "The dialectic between the two philosophers led to a deeper understanding of the complex issues."
},
{
    "id": "27",
    "word": "egalitarian",
    "meaning": "Eşitlikçi",
    "synonyms": [
        "equal",
        "fair",
        "just"
    ],
    "antonyms": [
        "hierarchical",
        "elitist"
    ],
    "mnemonic": "Eşitlik herkes için iyidir",
    "context": "The egalitarian society valued the contributions of all members, regardless of their background or status."
},
{
    "id": "28",
    "word": "elitism",
    "meaning": " Seçkincilik",
    "synonyms": [
        "aristocracy",
        "upper class",
        "privilege"
    ],
    "antonyms": [
        "egalitarianism",
        "populism"
    ],
    "mnemonic": "Seçkinler herkesi ezdi",
    "context": "The elitism of the wealthy elite led to a widening gap between the rich and the poor."
},
{
    "id": "29",
    "word": "feminism",
    "meaning": "Feminizm",
    "synonyms": [
        "women's rights",
        "gender equality",
        "liberation"
    ],
    "antonyms": [
        "sexism",
        "misogyny"
    ],
    "mnemonic": "Feminizm kadınları güçlendirir",
    "context": "The feminist movement has made significant progress in promoting women's rights and challenging patriarchal norms."
},
{
    "id": "30",
    "word": "globalization",
    "meaning": "Küreselleşme",
    "synonyms": [
        "internationalization",
        "cosmopolitanism",
        "interconnectedness"
    ],
    "antonyms": [
        "isolationism",
        "protectionism"
    ],
    "mnemonic": "Küreselleşme dünyayı birleştirir",
    "context": "The globalization of trade and commerce has led to increased economic interdependence among nations."
},
{
    "id": "31",
    "word": "hegemony",
    "meaning": "Hegemonya",
    "synonyms": [
        "dominance",
        "supremacy",
        "leadership"
    ],
    "antonyms": [
        "subordination",
        "dependence"
    ],
    "mnemonic": "Hegemonya güç verir",
    "context": "The hegemony of the United States in global politics has been challenged by rising powers in recent years."
},
{
    "id": "32",
    "word": "ideology",
    "meaning": "İdeoloji",
    "synonyms": [
        "doctrine",
        "dogma",
        "worldview"
    ],
    "antonyms": [
        "pragmatism",
        "realism"
    ],
    "mnemonic": "İdeoloji insanları birleştirir",
    "context": "The ideology of the political party shaped its policies and decisions."
},
{
    "id": "33",
    "word": "imperialism",
    "meaning": "Emperyalizm",
    "synonyms": [
        "colonialism",
        "expansionism",
        "domination"
    ],
    "antonyms": [
        "independence",
        "self-governance"
    ],
    "mnemonic": "Emperyalizm ezilmez",
    "context": "The imperialism of European powers led to the exploitation and oppression of many colonized countries."
},
{
    "id": "34",
    "word": "individualism",
    "meaning": "Bireycilik",
    "synonyms": [
        "libertarianism",
        "self-reliance",
        "autonomy"
    ],
    "antonyms": [
        "collectivism",
        "communalism"
    ],
    "mnemonic": "Bireycilik insanları güçlendirir",
    "context": "The individualism of the American culture emphasizes personal freedom and responsibility."
},
{
    "id": "35",
    "word": "institutionalization",
    "meaning": "Kurumsallaşma",
    "synonyms": [
        "formalization",
        "standardization",
        "bureaucratization"
    ],
    "antonyms": [
        "informalization",
        "decentralization"
    ],
    "mnemonic": "Kurumsallaşma düzen getirir",
    "context": "The institutionalization of the social movement led to a more organized and effective approach to advocacy."
},
{
    "id": "36",
    "word": "liberalism",
    "meaning": "Liberalizm",
    "synonyms": [
        "progressivism",
        "reformism",
        "humanism"
    ],
    "antonyms": [
        "conservatism",
        "reactionary"
    ],
    "mnemonic": "Liberalizm insanları özgürleştirir",
    "context": "The liberalism of the 19th century emphasized individual rights and freedoms."
},
{
    "id": "37",
    "word": "nationalism",
    "meaning": "Milliyetçilik",
    "synonyms": [
        "patriotism",
        "xenophobia",
        "chauvinism"
    ],
    "antonyms": [
        "internationalism",
        "cosmopolitanism"
    ],
    "mnemonic": "Milliyetçilik ülkeyi korur",
    "context": "The nationalism of the country led to a surge in patriotic sentiment and anti-immigrant rhetoric."
},
{
    "id": "38",
    "word": "oligarchy",
    "meaning": "Oligarşi",
    "synonyms": [
        "aristocracy",
        "plutocracy",
        "autocracy"
    ],
    "antonyms": [
        "democracy",
        "meritocracy"
    ],
    "mnemonic": "Oligarşi güçlülere hizmet eder",
    "context": "The oligarchy of the wealthy elite controlled the government and economy."
},
{
    "id": "39",
    "word": "pluralism",
    "meaning": "Çoğulculuk",
    "synonyms": [
        "diversity",
        "tolerance",
        "coexistence"
    ],
    "antonyms": [
        "monism",
        "uniformity"
    ],
    "mnemonic": "Çoğulculuk çeşitliliği korur",
    "context": "The pluralism of the society allowed for the coexistence of different cultures and beliefs."
},
{
    "id": "40",
    "word": "radicalism",
    "meaning": "Radikalizm",
    "synonyms": [
        "extremism",
        "militancy",
        "activism"
    ],
    "antonyms": [
        "moderation",
        "pragmatism"
    ],
    "mnemonic": "Radikalizm değişim getirir",
    "context": "The radicalism of the social movement led to a significant shift in public opinion and policy."
},
{
    "id": "41",
    "word": "accommodate",
    "meaning": "Barındırma, konaklama",
    "synonyms": [
        "house",
        "lodge",
        "shelter"
    ],
    "antonyms": [
        "evict",
        "expel"
    ],
    "mnemonic": "Arkadaşımı konuk olarak barındırdım",
    "context": "The new hotel will accommodate hundreds of guests during the conference."
},
{
    "id": "42",
    "word": "fluctuate",
    "meaning": "Dalgalanma, değişme",
    "synonyms": [
        "vary",
        "oscillate",
        "waver"
    ],
    "antonyms": [
        "stabilize",
        "steady"
    ],
    "mnemonic": "Fiyatlar sürekli dalgalanıyordu",
    "context": "The stock market tends to fluctuate rapidly in response to economic news."
},
{
    "id": "43",
    "word": "merger",
    "meaning": "Birleşme, birleşim",
    "synonyms": [
        "amalgamation",
        "consolidation",
        "unification"
    ],
    "antonyms": [
        "acquisition",
        "takeover"
    ],
    "mnemonic": "Şirketler birleşerek daha güçlü oldu",
    "context": "The merger between the two companies created a new industry leader."
},
{
    "id": "44",
    "word": "negotiate",
    "meaning": "Pazarlık, müzakere",
    "synonyms": [
        "bargain",
        "haggle",
        "mediate"
    ],
    "antonyms": [
        "dictate",
        "impose"
    ],
    "mnemonic": "Satıcı ile alıcı arasında pazarlık vardı",
    "context": "The union will negotiate with the management to improve working conditions."
},
{
    "id": "45",
    "word": "outsource",
    "meaning": "Dış kaynak kullanımı",
    "synonyms": [
        "contract out",
        "subcontract",
        "delegate"
    ],
    "antonyms": [
        "insource",
        "keep in-house"
    ],
    "mnemonic": "Şirket üretimini dış kaynaklara verdi",
    "context": "The company decided to outsource its manufacturing to a foreign country."
},
{
    "id": "46",
    "word": "privatize",
    "meaning": "Özelleştirme",
    "synonyms": [
        "denationalize",
        "deregulate",
        "liberalize"
    ],
    "antonyms": [
        "nationalize",
        "socialize"
    ],
    "mnemonic": "Devlet şirketi özelleştirildi",
    "context": "The government plans to privatize the state-owned airline."
},
{
    "id": "47",
    "word": "restructure",
    "meaning": "Yeniden yapılandırma",
    "synonyms": [
        "reorganize",
        "reform",
        "revamp"
    ],
    "antonyms": [
        "maintain",
        "preserve"
    ],
    "mnemonic": "Şirket yeniden yapılandırıldı",
    "context": "The company will restructure its debt to avoid bankruptcy."
},
{
    "id": "48",
    "word": "sanction",
    "meaning": "Yaptırım, ceza",
    "synonyms": [
        "penalty",
        "fine",
        "boycott"
    ],
    "antonyms": [
        "reward",
        "incentive"
    ],
    "mnemonic": "Ülkeye ekonomik yaptırım uygulandı",
    "context": "The international community imposed economic sanctions on the rogue state."
},
{
    "id": "49",
    "word": "subsidy",
    "meaning": "Yardımlaşma, sübvansiyon",
    "synonyms": [
        "grant",
        "allowance",
        "assistance"
    ],
    "antonyms": [
        "tax",
        "levy"
    ],
    "mnemonic": "Hükümet şirketlere sübvansiyon sağlıyor",
    "context": "The government provided a subsidy to the farmers to support their crops."
},
{
    "id": "50",
    "word": "tariff",
    "meaning": "Gümrük vergisi",
    "synonyms": [
        "duty",
        "tax",
        "levy"
    ],
    "antonyms": [
        "subsidy",
        "exemption"
    ],
    "mnemonic": "İthal edilen mallara gümrük vergisi konuldu",
    "context": "The country imposed a tariff on imported goods to protect its domestic industry."
},
{
    "id": "51",
    "word": "tradeoff",
    "meaning": "Takas, değiş-tokuş",
    "synonyms": [
        "compromise",
        "concession",
        "sacrifice"
    ],
    "antonyms": [
        "gain",
        "benefit"
    ],
    "mnemonic": "Şirket karı ile işçilerin hakları arasında takas vardı",
    "context": "The company made a tradeoff between profits and employee benefits."
},
{
    "id": "52",
    "word": "undermine",
    "meaning": "Astı bozmak, zayıflatmak",
    "synonyms": [
        "weaken",
        "subvert",
        "sabotage"
    ],
    "antonyms": [
        "strengthen",
        "support"
    ],
    "mnemonic": "Rakip şirketin astını bozmaya çalıştı",
    "context": "The rival company tried to undermine our business by poaching our employees."
},
{
    "id": "53",
    "word": "venture",
    "meaning": "Girişim, macera",
    "synonyms": [
        "enterprise",
        "undertaking",
        "adventure"
    ],
    "antonyms": [
        "caution",
        "prudence"
    ],
    "mnemonic": "Yeni bir girişim için yatırım yapıldı",
    "context": "The entrepreneur decided to venture into the tech industry with a new startup."
},
{
    "id": "54",
    "word": "volatile",
    "meaning": "Değişken, kararsız",
    "synonyms": [
        "unstable",
        "unpredictable",
        "mercurial"
    ],
    "antonyms": [
        "stable",
        "steady"
    ],
    "mnemonic": "Piyasa çok değişken ve kararsızdı",
    "context": "The stock market is volatile and subject to sudden changes."
},
{
    "id": "55",
    "word": "welfare",
    "meaning": "Refah, sosyal hizmet",
    "synonyms": [
        "wellbeing",
        "benefit",
        "assistance"
    ],
    "antonyms": [
        "poverty",
        "hardship"
    ],
    "mnemonic": "Sosyal refah için devlet desteği sağlandı",
    "context": "The government implemented a welfare program to support low-income families."
},
{
    "id": "56",
    "word": "yield",
    "meaning": "Verim, getiri",
    "synonyms": [
        "return",
        "profit",
        "output"
    ],
    "antonyms": [
        "loss",
        "deficit"
    ],
    "mnemonic": "Şirketin yatırımları yüksek verim getirdi",
    "context": "The company's investments yielded a high return on investment."
},
{
    "id": "57",
    "word": "audit",
    "meaning": "Denetim, inceleme",
    "synonyms": [
        "examination",
        "review",
        "investigation"
    ],
    "antonyms": [
        "ignore",
        "overlook"
    ],
    "mnemonic": "Şirketin mali durumunu denetlemek için inceleme yapıldı",
    "context": "The company hired an external auditor to conduct a thorough audit of its financial records."
},
{
    "id": "58",
    "word": "boycott",
    "meaning": "Boykot, reddetme",
    "synonyms": [
        "ban",
        "protest",
        "reject"
    ],
    "antonyms": [
        "support",
        "endorse"
    ],
    "mnemonic": "Tüketici şirketin ürünlerini boykot etti",
    "context": "The consumers boycotted the company's products due to environmental concerns."
},
{
    "id": "59",
    "word": "cartel",
    "meaning": "Kartel, tekel",
    "synonyms": [
        "monopoly",
        "oligopoly",
        "syndicate"
    ],
    "antonyms": [
        "competition",
        "free market"
    ],
    "mnemonic": "Şirketler kartel oluşturarak piyasayı kontrol etti",
    "context": "The companies formed a cartel to control the market and fix prices."
},
{
    "id": "60",
    "word": "default",
    "meaning": "Varsayılan, öntanımlı",
    "synonyms": [
        "standard",
        "normal",
        "usual"
    ],
    "antonyms": [
        "exception",
        "anomaly"
    ],
    "mnemonic": "Şirket borçlarını ödemekte varsayılan davranış gösterdi",
    "context": "The company defaulted on its loan payments and faced bankruptcy."
},
{
    "id": "61",
    "word": "anxiolytic",
    "meaning": "Kaygı giderici, anksiyeteyi azaltan",
    "synonyms": [
        "calming",
        "soothing",
        "tranquilizing"
    ],
    "antonyms": [
        "anxiogenic",
        "stressful"
    ],
    "mnemonic": "Anksiyete gideren ilaçlar anxiolytic",
    "context": "The doctor prescribed an anxiolytic medication to help her patient relax."
},
{
    "id": "62",
    "word": "cardiovascular",
    "meaning": "Kalp ve damar sistemi ile ilgili",
    "synonyms": [
        "cardiac",
        "circulatory",
        "vascular"
    ],
    "antonyms": [
        "non-cardiovascular",
        "unrelated"
    ],
    "mnemonic": "Kalp ve damar sağlığı için cardiovascular",
    "context": "Regular exercise can help reduce the risk of cardiovascular disease."
},
{
    "id": "63",
    "word": "dysfunctional",
    "meaning": "İşlevsel olmayan, bozuk",
    "synonyms": [
        "malfunctional",
        "impaired",
        "abnormal"
    ],
    "antonyms": [
        "functional",
        "normal"
    ],
    "mnemonic": "Bozuk işleyiş için dysfunctional",
    "context": "The dysfunctional family dynamics led to a lot of conflict and stress."
},
{
    "id": "64",
    "word": "endocrine",
    "meaning": "İç salgı bezleri ile ilgili",
    "synonyms": [
        "hormonal",
        "glandular",
        "secretory"
    ],
    "antonyms": [
        "exocrine",
        "non-endocrine"
    ],
    "mnemonic": "İç salgı bezleri için endocrine",
    "context": "The endocrine system plays a crucial role in regulating the body's metabolism."
},
{
    "id": "65",
    "word": "euphoric",
    "meaning": "Uygun, coşkulu, mutlu",
    "synonyms": [
        "elated",
        "ecstatic",
        "exhilarated"
    ],
    "antonyms": [
        "depressed",
        "melancholic"
    ],
    "mnemonic": "Mutluluk için euphoric",
    "context": "The crowd felt euphoric when their team won the championship."
},
{
    "id": "66",
    "word": "hallucinogenic",
    "meaning": "Sanrı yaratıcı, hayal görme uyarıcı",
    "synonyms": [
        "psychedelic",
        "psychotropic",
        "intoxicating"
    ],
    "antonyms": [
        "non-hallucinogenic",
        "sobering"
    ],
    "mnemonic": "Hayal görme için hallucinogenic",
    "context": "The hallucinogenic properties of the drug can cause users to experience vivid hallucinations."
},
{
    "id": "67",
    "word": "hyperactive",
    "meaning": "Hareketsiz, aşırı aktif",
    "synonyms": [
        "restless",
        "fidgety",
        "overactive"
    ],
    "antonyms": [
        "inactive",
        "sedentary"
    ],
    "mnemonic": "Aşırı hareket için hyperactive",
    "context": "The hyperactive child had trouble sitting still in class."
},
{
    "id": "68",
    "word": "hypnotic",
    "meaning": "Hipnotik, uykulu",
    "synonyms": [
        "sleep-inducing",
        "somnolent",
        "drowsy"
    ],
    "antonyms": [
        "stimulating",
        "invigorating"
    ],
    "mnemonic": "Uyku için hypnotic",
    "context": "The hypnotic sound of the waves helped her fall asleep."
},
{
    "id": "69",
    "word": "immunological",
    "meaning": "Bağışıklık sistemi ile ilgili",
    "synonyms": [
        "immunologic",
        "immunogenetic",
        "allergological"
    ],
    "antonyms": [
        "non-immunological",
        "unrelated"
    ],
    "mnemonic": "Bağışıklık için immunological",
    "context": "The immunological response to the vaccine was strong and effective."
},
{
    "id": "70",
    "word": "manic",
    "meaning": "Manyak, coşkulu",
    "synonyms": [
        "manic-depressive",
        "bipolar",
        "cyclothymic"
    ],
    "antonyms": [
        "depressed",
        "melancholic"
    ],
    "mnemonic": "Manyaklık için manic",
    "context": "The manic episode lasted for several days, during which she barely slept or ate."
},
{
    "id": "71",
    "word": "neurological",
    "meaning": "Sinir sistemi ile ilgili",
    "synonyms": [
        "neurologic",
        "neuropsychological",
        "neurophysiological"
    ],
    "antonyms": [
        "non-neurological",
        "unrelated"
    ],
    "mnemonic": "Sinir sistemi için neurological",
    "context": "The neurological exam revealed some abnormalities in the patient's brain function."
},
{
    "id": "72",
    "word": "neurotransmitter",
    "meaning": "Nörotransmitter, sinir ileticisi",
    "synonyms": [
        "neurohormone",
        "neuromodulator",
        "neuroregulator"
    ],
    "antonyms": [
        "non-neurotransmitter",
        "unrelated"
    ],
    "mnemonic": "Sinir ileticisi için neurotransmitter",
    "context": "The neurotransmitter dopamine plays a key role in regulating mood and motivation."
},
{
    "id": "73",
    "word": "obesity",
    "meaning": "Obezite, şişmanlık",
    "synonyms": [
        "overweight",
        "corpulent",
        "adipose"
    ],
    "antonyms": [
        "underweight",
        "slim"
    ],
    "mnemonic": "Şişmanlık için obesity",
    "context": "The rising rates of obesity in children are a major public health concern."
},
{
    "id": "74",
    "word": "oncological",
    "meaning": "Kanser ile ilgili",
    "synonyms": [
        "cancerous",
        "malignant",
        "neoplastic"
    ],
    "antonyms": [
        "non-oncological",
        "benign"
    ],
    "mnemonic": "Kanser için oncological",
    "context": "The oncological team worked together to develop a treatment plan for the patient."
},
{
    "id": "75",
    "word": "ophthalmological",
    "meaning": "Göz ile ilgili",
    "synonyms": [
        "ophthalmic",
        "eye-related",
        "visual"
    ],
    "antonyms": [
        "non-ophthalmological",
        "unrelated"
    ],
    "mnemonic": "Göz sağlığı için ophthalmological",
    "context": "The ophthalmological exam revealed some abnormalities in the patient's vision."
},
{
    "id": "76",
    "word": "orthopedic",
    "meaning": "Ortopedik, iskelet sistemi ile ilgili",
    "synonyms": [
        "orthopaedic",
        "skeletal",
        "musculoskeletal"
    ],
    "antonyms": [
        "non-orthopedic",
        "unrelated"
    ],
    "mnemonic": "İskelet sistemi için orthopedic",
    "context": "The orthopedic surgeon specialized in treating injuries to the bones and joints."
},
{
    "id": "77",
    "word": "pathological",
    "meaning": "Hastalıklı, patolojik",
    "synonyms": [
        "diseased",
        "morbid",
        "abnormal"
    ],
    "antonyms": [
        "normal",
        "healthy"
    ],
    "mnemonic": "Hastalık için pathological",
    "context": "The pathological examination of the tissue sample revealed the presence of cancer cells."
},
{
    "id": "78",
    "word": "pharmacological",
    "meaning": "İlaç ile ilgili",
    "synonyms": [
        "pharmacologic",
        "therapeutic",
        "medicinal"
    ],
    "antonyms": [
        "non-pharmacological",
        "unrelated"
    ],
    "mnemonic": "İlaç için pharmacological",
    "context": "The pharmacological effects of the new medication were still being studied."
},
{
    "id": "79",
    "word": "psychosomatic",
    "meaning": "Psikosomatik, bedensel ve zihinsel",
    "synonyms": [
        "psychophysical",
        "somatopsychic",
        "mind-body"
    ],
    "antonyms": [
        "non-psychosomatic",
        "unrelated"
    ],
    "mnemonic": "Bedensel ve zihinsel için psychosomatic",
    "context": "The psychosomatic symptoms of anxiety can include headaches and stomach problems."
},
{
    "id": "80",
    "word": "therapeutic",
    "meaning": "Tedavi edici, terapötik",
    "synonyms": [
        "curative",
        "remedial",
        "healing"
    ],
    "antonyms": [
        "non-therapeutic",
        "harmful"
    ],
    "mnemonic": "Tedavi için therapeutic",
    "context": "The therapeutic benefits of meditation have been well-documented."
},
{
    "id": "81",
    "word": "biodiversity",
    "meaning": "Biyoçeşitlilik",
    "synonyms": [
        "variety",
        "multiplicity",
        "range"
    ],
    "antonyms": [
        "uniformity",
        "monotony"
    ],
    "mnemonic": "Biyo çeşidi öğrenmek için çok çalış",
    "context": "The preservation of biodiversity is essential for maintaining healthy ecosystems."
},
{
    "id": "82",
    "word": "ecosystem",
    "meaning": "Ekosistem",
    "synonyms": [
        "environment",
        "habitat",
        "biome"
    ],
    "antonyms": [
        "wasteland",
        "desert"
    ],
    "mnemonic": "Ekosistemi koru, yaşamı koru",
    "context": "The forest ecosystem is home to a wide variety of plant and animal species."
},
{
    "id": "83",
    "word": "symbiosis",
    "meaning": "Symbiyoz",
    "synonyms": [
        "mutualism",
        "cooperation",
        "association"
    ],
    "antonyms": [
        "competition",
        "rivalry"
    ],
    "mnemonic": "Symbiyoz ile birlikte yaşamak",
    "context": "The symbiosis between clownfish and sea anemones is a well-known example of mutualism."
},
{
    "id": "84",
    "word": "photosynthesis",
    "meaning": "Fotosentez",
    "synonyms": [
        "phototropism",
        "photosynthetic",
        "carbon fixation"
    ],
    "antonyms": [
        "respiration",
        "decomposition"
    ],
    "mnemonic": "Fotosentez ile bitkiler büyür",
    "context": "Photosynthesis is the process by which plants convert light energy into chemical energy."
},
{
    "id": "85",
    "word": "bioluminescence",
    "meaning": "Biyolüminesans",
    "synonyms": [
        "glow",
        "luminescence",
        "radiance"
    ],
    "antonyms": [
        "darkness",
        "shadow"
    ],
    "mnemonic": "Biyolüminesans ile ışık saçmak",
    "context": "Bioluminescence is the production and emission of light by living organisms."
},
{
    "id": "86",
    "word": "endangered",
    "meaning": "Tehlike altında",
    "synonyms": [
        "vulnerable",
        "threatened",
        "at risk"
    ],
    "antonyms": [
        "safe",
        "secure"
    ],
    "mnemonic": "Tehlike altında olanları koruma",
    "context": "The endangered species list includes many animals that are at risk of extinction."
},
{
    "id": "87",
    "word": "conservation",
    "meaning": "Korunma",
    "synonyms": [
        "preservation",
        "protection",
        "restoration"
    ],
    "antonyms": [
        "destruction",
        "exploitation"
    ],
    "mnemonic": "Korunma ile doğayı koru",
    "context": "Conservation efforts are necessary to protect the world's natural resources."
},
{
    "id": "88",
    "word": "deforestation",
    "meaning": "Ormanların yok edilmesi",
    "synonyms": [
        "clear-cutting",
        "logging",
        "land degradation"
    ],
    "antonyms": [
        "reforestation",
        "afforestation"
    ],
    "mnemonic": "Ormanları koru, geleceği koru",
    "context": "Deforestation is a major contributor to climate change and biodiversity loss."
},
{
    "id": "89",
    "word": "pollution",
    "meaning": "Kirlilik",
    "synonyms": [
        "contamination",
        "toxicity",
        "waste"
    ],
    "antonyms": [
        "purity",
        "cleanliness"
    ],
    "mnemonic": "Kirliliği önle, sağlığı koru",
    "context": "Pollution is a significant threat to the health of our planet and its inhabitants."
},
{
    "id": "90",
    "word": "sustainability",
    "meaning": "Sürdürülebilirlik",
    "synonyms": [
        "stewardship",
        "conservation",
        "eco-friendliness"
    ],
    "antonyms": [
        "wastefulness",
        "exploitation"
    ],
    "mnemonic": "Sürdürülebilirlik ile geleceği güvence altına al",
    "context": "Sustainability is the practice of using resources in a way that meets the needs of the present without compromising the future."
},
{
    "id": "91",
    "word": "ecology",
    "meaning": "Ekoloji",
    "synonyms": [
        "environmental science",
        "conservation biology",
        "natural history"
    ],
    "antonyms": [
        "destruction",
        "exploitation"
    ],
    "mnemonic": "Ekoloji ile doğayı anla",
    "context": "Ecology is the study of the relationships between living organisms and their environment."
},
{
    "id": "92",
    "word": "habitat",
    "meaning": "Yaşama ortamı",
    "synonyms": [
        "environment",
        "ecosystem",
        "biome"
    ],
    "antonyms": [
        "wasteland",
        "desert"
    ],
    "mnemonic": "Yaşama ortamını koru, yaşamı koru",
    "context": "The destruction of habitats is a major threat to biodiversity."
},
{
    "id": "93",
    "word": "migration",
    "meaning": "Göç",
    "synonyms": [
        "movement",
        "displacement",
        "relocation"
    ],
    "antonyms": [
        "stability",
        "sedentary"
    ],
    "mnemonic": "Göç ile yeni yaşam alanları bul",
    "context": "The migration of animals is an essential part of their life cycle."
},
{
    "id": "94",
    "word": "extinction",
    "meaning": "Soy tükenmesi",
    "synonyms": [
        "disappearance",
        "eradication",
        "annihilation"
    ],
    "antonyms": [
        "survival",
        "persistence"
    ],
    "mnemonic": "Soy tükenmesini önle, yaşamı koru",
    "context": "The extinction of a species is a permanent loss of biodiversity."
},
{
    "id": "95",
    "word": "adaptation",
    "meaning": "Uyum",
    "synonyms": [
        "adjustment",
        "acclimatization",
        "evolution"
    ],
    "antonyms": [
        "maladaptation",
        "decline"
    ],
    "mnemonic": "Uyum ile yaşamı güvence altına al",
    "context": "The adaptation of organisms to their environment is crucial for their survival."
},
{
    "id": "96",
    "word": "evolution",
    "meaning": "Evolüsyon",
    "synonyms": [
        "development",
        "progress",
        "transformation"
    ],
    "antonyms": [
        "devolution",
        "regression"
    ],
    "mnemonic": "Evolüsyon ile yaşam ilerler",
    "context": "The evolution of species is a fundamental concept in biology."
},
{
    "id": "97",
    "word": "genetics",
    "meaning": "Genetik",
    "synonyms": [
        "heredity",
        "inheritance",
        "dna"
    ],
    "antonyms": [
        "environmental factors",
        "acquired traits"
    ],
    "mnemonic": "Genetik ile yaşamın sırlarını açığa çıkar",
    "context": "The study of genetics is essential for understanding the diversity of life on Earth."
},
{
    "id": "98",
    "word": "botany",
    "meaning": "Botanik",
    "synonyms": [
        "plant biology",
        "horticulture",
        "floristics"
    ],
    "antonyms": [
        "zoology",
        "animal science"
    ],
    "mnemonic": "Botanik ile bitkileri anla",
    "context": "The study of botany is crucial for understanding the importance of plants in our ecosystem."
},
{
    "id": "99",
    "word": "zoology",
    "meaning": "Zooloji",
    "synonyms": [
        "animal science",
        "animal biology",
        "wildlife biology"
    ],
    "antonyms": [
        "botany",
        "plant science"
    ],
    "mnemonic": "Zooloji ile hayvanları anla",
    "context": "The study of zoology is essential for understanding the diversity of animal life on Earth."
},
{
    "id": "100",
    "word": "microbiology",
    "meaning": "Mikrobiyoloji",
    "synonyms": [
        "microbial science",
        "microbial biology",
        "microbiology"
    ],
    "antonyms": [
        "macrobiology",
        "large-scale biology"
    ],
    "mnemonic": "Mikrobiyoloji ile mikroorganizmaları anla",
    "context": "The study of microbiology is crucial for understanding the importance of microorganisms in our ecosystem."
},
{
    "id": "101",
    "word": "artificial",
    "meaning": "Yapay, suni",
    "synonyms": [
        "synthetic",
        "man-made",
        "fake"
    ],
    "antonyms": [
        "natural",
        "genuine"
    ],
    "mnemonic": "Artık Yapay Zekaya bağlanıyorum",
    "context": "The company is developing artificial intelligence to improve customer service."
},
{
    "id": "102",
    "word": "circuitry",
    "meaning": "Devreler, elektrik devreleri",
    "synonyms": [
        "wiring",
        "electronics",
        "circuit"
    ],
    "antonyms": [
        "none",
        "simple"
    ],
    "mnemonic": "Circuitleri Yapay Zekaya bağlıyorum",
    "context": "The circuitry in the new smartphone is more complex than its predecessor."
},
{
    "id": "103",
    "word": "digitization",
    "meaning": "Dijitize etme, sayısal hale getirme",
    "synonyms": [
        "digitalization",
        "conversion",
        "transformation"
    ],
    "antonyms": [
        "analog",
        "traditional"
    ],
    "mnemonic": "Dijital Dünyaya geçiş membuat",
    "context": "The company is undergoing digitization to improve its online presence."
},
{
    "id": "104",
    "word": "encryption",
    "meaning": "Şifreleme, gizleme",
    "synonyms": [
        "coding",
        "scrambling",
        "encoding"
    ],
    "antonyms": [
        "decryption",
        "decoding"
    ],
    "mnemonic": "Enemies Never Capture Rival's Passwords",
    "context": "The website uses encryption to protect user data."
},
{
    "id": "105",
    "word": "firewall",
    "meaning": "Güvenlik duvarı, yangın duvarı",
    "synonyms": [
        "security system",
        "protection",
        "barrier"
    ],
    "antonyms": [
        "vulnerability",
        "weakness"
    ],
    "mnemonic": "Fırtınalı Günlerde Wall'a sığınıyorum",
    "context": "The company's firewall prevented the cyber attack."
},
{
    "id": "106",
    "word": "hacking",
    "meaning": "Hacking, siber saldırı",
    "synonyms": [
        "cyber attack",
        "infiltration",
        "breach"
    ],
    "antonyms": [
        "security",
        "protection"
    ],
    "mnemonic": "Hackers Always Know Incredible Codes",
    "context": "The company's system was vulnerable to hacking."
},
{
    "id": "107",
    "word": "interface",
    "meaning": "Arayüz, bağlantı noktası",
    "synonyms": [
        "connection",
        "link",
        "portal"
    ],
    "antonyms": [
        "disconnection",
        "separation"
    ],
    "mnemonic": "İnsanlarınFACElarını gördüğüm yer",
    "context": "The user interface of the new software is very intuitive."
},
{
    "id": "108",
    "word": "malware",
    "meaning": "Kötü amaçlı yazılım, zararı yazılım",
    "synonyms": [
        "virus",
        "trojan",
        "spyware"
    ],
    "antonyms": [
        "antivirus",
        "security software"
    ],
    "mnemonic": "Malicious Animals Love Warfare And Revenge",
    "context": "The computer was infected with malware."
},
{
    "id": "109",
    "word": "nanotechnology",
    "meaning": "Nanoteknoloji, çok küçük ölçekli teknoloji",
    "synonyms": [
        "microtechnology",
        "miniaturization",
        "atomization"
    ],
    "antonyms": [
        "macrotechnology",
        "large-scale"
    ],
    "mnemonic": "Nanoya geçmek için Teknolojiye ihtiyacım var",
    "context": "The company is investing in nanotechnology research."
},
{
    "id": "110",
    "word": "robotics",
    "meaning": "Robotik, robot teknolojisi",
    "synonyms": [
        "mechatronics",
        "automation",
        "machine learning"
    ],
    "antonyms": [
        "human labor",
        "manual work"
    ],
    "mnemonic": "Robots Otomatik olarak Büyüyor ve Teknolojiye uyum sağlıyor",
    "context": "The company is using robotics to improve manufacturing efficiency."
},
{
    "id": "111",
    "word": "simulator",
    "meaning": "Simülatör, taklitçi",
    "synonyms": [
        "emulator",
        "imitator",
        "mimic"
    ],
    "antonyms": [
        "real thing",
        "original"
    ],
    "mnemonic": "Simülasyon yapıyorum, Gerçeği taklit ediyorum",
    "context": "The flight simulator is used to train pilots."
},
{
    "id": "112",
    "word": "telecommunication",
    "meaning": "Telekomünikasyon, uzaktan iletişim",
    "synonyms": [
        "telecom",
        "communication",
        "networking"
    ],
    "antonyms": [
        "isolation",
        "disconnection"
    ],
    "mnemonic": "Telefonla konuşurken Kommünikasyon sağlıyoruz",
    "context": "The company provides telecommunication services to businesses."
},
{
    "id": "113",
    "word": "transistor",
    "meaning": "Transistör, yarı iletken",
    "synonyms": [
        "semiconductor",
        "diode",
        "thyristor"
    ],
    "antonyms": [
        "insulator",
        "conductor"
    ],
    "mnemonic": "Transistörler İletkenliği sağlar",
    "context": "The transistor is a crucial component in electronic devices."
},
{
    "id": "114",
    "word": "virtualization",
    "meaning": "Sanallaştırma, görselleştirme",
    "synonyms": [
        "simulation",
        "emulation",
        "modeling"
    ],
    "antonyms": [
        "reality",
        "physicality"
    ],
    "mnemonic": "Sanal Dünyada yaşadığım için Gerçekliği unuttum",
    "context": "The company is using virtualization to improve server efficiency."
},
{
    "id": "115",
    "word": "wireless",
    "meaning": "Kablosuz, telsiz",
    "synonyms": [
        "mobile",
        "portable",
        "cordless"
    ],
    "antonyms": [
        "wired",
        "cabled"
    ],
    "mnemonic": "Wi-Fi ile bağlandım, kablosuz özgürlüğe kavuştum",
    "context": "The new smartphone has wireless charging capabilities."
},
{
    "id": "116",
    "word": "algorithm",
    "meaning": "Algoritma, işlem yöntemi",
    "synonyms": [
        "procedure",
        "method",
        "technique"
    ],
    "antonyms": [
        "randomness",
        "chaos"
    ],
    "mnemonic": "Algoritma ile Problemleri çözerim",
    "context": "The algorithm used in the software is very efficient."
},
{
    "id": "117",
    "word": "cybernetics",
    "meaning": "Sibernetik, kontrol ve iletişim bilimi",
    "synonyms": [
        "control theory",
        "communication theory",
        "system theory"
    ],
    "antonyms": [
        "chaos theory",
        "randomness"
    ],
    "mnemonic": "Sibernetik ile Kontrolü sağlıyorum",
    "context": "The company is applying cybernetics to improve its manufacturing process."
},
{
    "id": "118",
    "word": "microchip",
    "meaning": "Mikroçip, küçük boyutlu elektronik devre",
    "synonyms": [
        "microprocessor",
        "chip",
        "silicon"
    ],
    "antonyms": [
        "macrochip",
        "large-scale"
    ],
    "mnemonic": "Mikroçipler ile Büyük işler başarmak möglich",
    "context": "The new microchip is very powerful and efficient."
},
{
    "id": "119",
    "word": "networking",
    "meaning": "Ağ oluşturma, bağlantı kurma",
    "synonyms": [
        "connection",
        "linking",
        "communication"
    ],
    "antonyms": [
        "isolation",
        "disconnection"
    ],
    "context": "The company is using networking to improve its online presence.",
    "mnemonic": "Ağları kurmak içinNetworkingDoing"
},
{
    "id": "120",
    "word": "optics",
    "meaning": "Optik, ışık bilimi",
    "synonyms": [
        "photonics",
        "light",
        "vision"
    ],
    "antonyms": [
        "acoustics",
        "sound"
    ],
    "mnemonic": "Optik ile Görme gücüm artıyor",
    "context": "The company is researching optics to improve its camera technology."
},
{
    "id": "121",
    "word": "ABANDON",
    "meaning": "Terketmek, bırakmak",
    "synonyms": [
        "leave",
        "desert",
        "forsake"
    ],
    "antonyms": [
        "keep",
        "retain"
    ],
    "mnemonic": "Ali Babadan Oyuncağı Não",
    "context": "The company will abandon the project if it's not profitable."
},
{
    "id": "122",
    "word": "ABANDONS",
    "meaning": "Terketmeler, bırakmalar",
    "synonyms": [
        "leaves",
        "deserts",
        "forsakes"
    ],
    "antonyms": [
        "keeps",
        "retains"
    ],
    "mnemonic": "Ali Babadan Oyuncağını Não",
    "context": "The company abandons its projects when they are not successful."
},
{
    "id": "123",
    "word": "ABILITY",
    "meaning": "Yetenek, kabiliyet",
    "synonyms": [
        "talent",
        "skill",
        "capacity"
    ],
    "antonyms": [
        "inability",
        "incapacity"
    ],
    "mnemonic": "Ali Becerir Her Şeyi",
    "context": "She has the ability to speak five languages fluently."
},
{
    "id": "124",
    "word": "ABRUPT",
    "meaning": "Birdenbire, ansızın",
    "synonyms": [
        "sudden",
        "unexpected",
        "sharp"
    ],
    "antonyms": [
        "gradual",
        "slow"
    ],
    "mnemonic": "Ali Birdenbire UyanırPt",
    "context": "The abrupt change in the weather caught us off guard."
},
{
    "id": "125",
    "word": "ABSOLUTELY",
    "meaning": "Kesinlikle, tamamen",
    "synonyms": [
        "completely",
        "totally",
        "entirely"
    ],
    "antonyms": [
        "partially",
        "relatively"
    ],
    "mnemonic": "Ali Başarıyla Olumlu Sonuçlar",
    "context": "I absolutely love the new restaurant in town."
},
{
    "id": "126",
    "word": "ABSTAIN",
    "meaning": "Kaçınmak, kendini tutmak",
    "synonyms": [
        "refrain",
        "avoid",
        "withhold"
    ],
    "antonyms": [
        "indulge",
        "participate"
    ],
    "mnemonic": "Ali Başarıya Ulaşmak İçin Tutun",
    "context": "She will abstain from voting if she doesn't agree with the proposal."
},
{
    "id": "127",
    "word": "ABSTENTION",
    "meaning": "Kaçınma, kendini tutma",
    "synonyms": [
        "refusal",
        "avoidance",
        "abstinence"
    ],
    "antonyms": [
        "participation",
        "involvement"
    ],
    "mnemonic": "Ali Başarıya Ulaşmak İçin Tutunur",
    "context": "The abstention of several members affected the outcome of the vote."
},
{
    "id": "128",
    "word": "ABUNDANCE",
    "meaning": "Bolluk, çokluk",
    "synonyms": [
        "plenty",
        "wealth",
        "profusion"
    ],
    "antonyms": [
        "scarcity",
        "shortage"
    ],
    "mnemonic": "Ali Bollukla Uğrar, Nice",
    "context": "The abundance of food in the city is impressive."
},
{
    "id": "129",
    "word": "ABUNDANT",
    "meaning": "Bol, çok",
    "synonyms": [
        "plentiful",
        "rich",
        "luxuriant"
    ],
    "antonyms": [
        "scarce",
        "rare"
    ],
    "mnemonic": "Ali Bollukla Uğrar",
    "context": "The abundant resources of the company allow it to expand quickly."
},
{
    "id": "130",
    "word": "ABUNDANTLY",
    "meaning": "Bollukla, çokça",
    "synonyms": [
        "plentifully",
        "richly",
        "luxuriantly"
    ],
    "antonyms": [
        "scarcely",
        "rarely"
    ],
    "mnemonic": "Ali Bollukla Uğrar, Nice",
    "context": "The city is abundantly supplied with water from the nearby river."
},
{
    "id": "131",
    "word": "ABUSE",
    "meaning": "Kötüye kullanmak, suistimal etmek",
    "synonyms": [
        "misuse",
        "exploit",
        "mistreat"
    ],
    "antonyms": [
        "use",
        "treat"
    ],
    "mnemonic": "Ali Başarıya Ulaşmak İçin Suistimal Etme",
    "context": "The company was accused of abuse of power and corruption."
},
{
    "id": "132",
    "word": "ABUSES",
    "meaning": "Kötüye kullanmalar, suistimaller",
    "synonyms": [
        "misuses",
        "exploitations",
        "mistreatments"
    ],
    "antonyms": [
        "uses",
        "treatments"
    ],
    "mnemonic": "Ali Başarıya Ulaşmak İçin Suistimal Etmez",
    "context": "The government is working to prevent abuses of human rights."
},
{
    "id": "133",
    "word": "ABUSIVELY",
    "meaning": "Kötüye kullanarak, suistimal ederek",
    "synonyms": [
        "misusingly",
        "exploitatively",
        "mistreatingly"
    ],
    "antonyms": [
        "properly",
        "fairly"
    ],
    "mnemonic": "Ali Başarıya Ulaşmak İçin Suistimal Etmeden",
    "context": "The company was accused of abusively treating its employees."
},
{
    "id": "134",
    "word": "ACCELERATE",
    "meaning": "Hızlandırmak, ivmelendirmek",
    "synonyms": [
        "speed up",
        "hasten",
        "expedite"
    ],
    "antonyms": [
        "slow down",
        "decelerate"
    ],
    "mnemonic": "Ali Hızlanıyor, İvme Kazanıyor",
    "context": "The new policy aims to accelerate economic growth."
},
{
    "id": "135",
    "word": "ACCEPT",
    "meaning": "Kabul etmek, onaylamak",
    "synonyms": [
        "agree",
        "approve",
        "acknowledge"
    ],
    "antonyms": [
        "refuse",
        "reject"
    ],
    "mnemonic": "Ali Kabul Ediyor, Onaylıyor",
    "context": "I accept your invitation to the party."
},
{
    "id": "136",
    "word": "ACCEPTABLE",
    "meaning": "Kabul edilebilir",
    "synonyms": [
        "tolerable",
        "adequate",
        "satisfactory"
    ],
    "antonyms": [
        "unacceptable",
        "intolerable"
    ],
    "mnemonic": "Kabul edilebilir olan her şey kabul edilir",
    "context": "The new policy is acceptable to most employees."
},
{
    "id": "137",
    "word": "ACCEPTANCE",
    "meaning": "Kabul, onay",
    "synonyms": [
        "approval",
        "agreement",
        "consent"
    ],
    "antonyms": [
        "rejection",
        "disapproval"
    ],
    "mnemonic": "Onay olmadan kabul olmaz",
    "context": "The company requires your acceptance of the terms and conditions."
},
{
    "id": "138",
    "word": "ACCESS",
    "meaning": "Erişim, ulaşım",
    "synonyms": [
        "entry",
        "admission",
        "approach"
    ],
    "antonyms": [
        "blockage",
        "obstruction"
    ],
    "mnemonic": "Erişim_engel_tanımaz",
    "context": "You need a password to access the database."
},
{
    "id": "139",
    "word": "ACCESSIBLE",
    "meaning": "Erişilebilen, ulaşılabilir",
    "synonyms": [
        "available",
        "attainable",
        "reachable"
    ],
    "antonyms": [
        "inaccessible",
        "unreachable"
    ],
    "mnemonic": "Her yere erişmek mümkün",
    "context": "The new park is accessible by public transportation."
},
{
    "id": "140",
    "word": "ACCIDENTALLY",
    "meaning": "Kazara, istemeden",
    "synonyms": [
        "unintentionally",
        "inadvertently",
        "unwittingly"
    ],
    "antonyms": [
        "intentionally",
        "deliberately"
    ],
    "mnemonic": "Kaza ile her şey olabilir",
    "context": "I accidentally deleted the important file."
},
{
    "id": "141",
    "word": "ACCOMPANIED",
    "meaning": "Eşlik eden, refakat eden",
    "synonyms": [
        "attended",
        "escorted",
        "accompanied"
    ],
    "antonyms": [
        "alone",
        "unaccompanied"
    ],
    "mnemonic": "Her zaman eşlik eden vardır",
    "context": "The tourist was accompanied by a guide during the trip."
},
{
    "id": "142",
    "word": "ACCOMPANY",
    "meaning": "Eşlik etmek, refakat etmek",
    "synonyms": [
        "attend",
        "escort",
        "join"
    ],
    "antonyms": [
        "leave",
        "abandon"
    ],
    "mnemonic": "Eşlik etmek wichtig",
    "context": "Can you accompany me to the party tonight?"
},
{
    "id": "143",
    "word": "ACCOMPLISH",
    "meaning": "Başarmak, gerçekleştirmek",
    "synonyms": [
        "achieve",
        "attain",
        "fulfill"
    ],
    "antonyms": [
        "fail",
        "neglect"
    ],
    "mnemonic": "Her şey başarılabilir",
    "context": "She accomplished her goal of learning a new language."
},
{
    "id": "144",
    "word": "ACCUMULATE",
    "meaning": "Biriktirmek, toplamak",
    "synonyms": [
        "gather",
        "collect",
        "amass"
    ],
    "antonyms": [
        "dissipate",
        "scatter"
    ],
    "mnemonic": "Biriktirilen her şey değerlidir",
    "context": "The company will accumulate wealth over time."
},
{
    "id": "145",
    "word": "ACCUMULATED",
    "meaning": "Biriktirilmiş, topllenmiş",
    "synonyms": [
        "collected",
        "gathered",
        "amassed"
    ],
    "antonyms": [
        "dispersed",
        "scattered"
    ],
    "mnemonic": "Biriktirilen her şey önemlidir",
    "context": "The accumulated knowledge will be useful in the future."
},
{
    "id": "146",
    "word": "ACCUMULATION",
    "meaning": "Biriktirme, toplama",
    "synonyms": [
        "collection",
        "gathering",
        "amassment"
    ],
    "antonyms": [
        "dispersion",
        "scattering"
    ],
    "mnemonic": "Biriktirme önemlidir",
    "context": "The accumulation of wealth is a long-term process."
},
{
    "id": "147",
    "word": "ACCURACY",
    "meaning": "Doğruluk, kesinlik",
    "synonyms": [
        "precision",
        "exactness",
        "correctness"
    ],
    "antonyms": [
        "inaccuracy",
        "error"
    ],
    "mnemonic": "Doğruluk her şeyden önemlidir",
    "context": "The accuracy of the data is crucial for the research."
},
{
    "id": "148",
    "word": "ACCURATELY",
    "meaning": "Doğru bir şekilde, kesin olarak",
    "synonyms": [
        "precisely",
        "exactly",
        "correctly"
    ],
    "antonyms": [
        "inaccurately",
        "incorrectly"
    ],
    "mnemonic": "Her şey doğru yapılmalı",
    "context": "The engineer accurately calculated the measurements."
},
{
    "id": "149",
    "word": "ACCUSATION",
    "meaning": "Suçlama, itham",
    "synonyms": [
        "allegation",
        "charge",
        "complaint"
    ],
    "antonyms": [
        "acquittal",
        "exoneration"
    ],
    "mnemonic": "Suçlama önemlidir",
    "context": "The accusation of cheating was made against the student."
},
{
    "id": "150",
    "word": "ACHIEVABLE",
    "meaning": "Başarılabilir, gerçekleştirilebilir",
    "synonyms": [
        "attainable",
        "feasible",
        "possible"
    ],
    "antonyms": [
        "unattainable",
        "impossible"
    ],
    "mnemonic": "Her şey başarılabilir",
    "context": "The goal is achievable if we work together."
},
{
    "id": "151",
    "word": "ACHIEVE",
    "meaning": "Başarmak, gerçekleştirmek",
    "synonyms": [
        "attain",
        "accomplish",
        "succeed"
    ],
    "antonyms": [
        "fail",
        "miss"
    ],
    "mnemonic": "Ali Başarıya Ulaştı",
    "context": "She worked hard to achieve her goals."
},
{
    "id": "152",
    "word": "ACHIEVED",
    "meaning": "Başarmış, gerçekleştirmiş",
    "synonyms": [
        "attained",
        "accomplished",
        "succeeded"
    ],
    "antonyms": [
        "failed",
        "missed"
    ],
    "mnemonic": "Ali Başarıya Ulaştı Geçmişte",
    "context": "She has achieved great things in her career."
},
{
    "id": "153",
    "word": "ACHIEVEMENT",
    "meaning": "Başarı, gerçekleştiriş",
    "synonyms": [
        "accomplishment",
        "attainment",
        "success"
    ],
    "antonyms": [
        "failure",
        "defeat"
    ],
    "mnemonic": "Ali Başarının Güzel Sonuçlarını Gördü",
    "context": "Her achievement was recognized by the company."
},
{
    "id": "154",
    "word": "ACKNOWLEDGE",
    "meaning": "Kabul etmek, tanımak",
    "synonyms": [
        "recognize",
        "admit",
        "confirm"
    ],
    "antonyms": [
        "deny",
        "refuse"
    ],
    "mnemonic": "Ali Kibarca Kabul Etti",
    "context": "I acknowledge the receipt of your letter."
},
{
    "id": "155",
    "word": "ACKNOWLEDGED",
    "meaning": "Kabul edilmiş, tanınmış",
    "synonyms": [
        "recognized",
        "admitted",
        "confirmed"
    ],
    "antonyms": [
        "denied",
        "refused"
    ],
    "mnemonic": "Ali Kibarca Kabul Edilmişti",
    "context": "The fact has been acknowledged by the experts."
},
{
    "id": "156",
    "word": "ACQUIRE",
    "meaning": "Edinmek, satın almak",
    "synonyms": [
        "obtain",
        "gain",
        "purchase"
    ],
    "antonyms": [
        "sell",
        "lose"
    ],
    "mnemonic": "Ali Çabuk Kazandı",
    "context": "The company will acquire the new technology."
},
{
    "id": "157",
    "word": "ACTIVATION",
    "meaning": "Etkinleştirme, aktivasyon",
    "synonyms": [
        "enablement",
        "initiation",
        "start"
    ],
    "antonyms": [
        "deactivation",
        "disablement"
    ],
    "mnemonic": "Ali Çabuk Etkinleştirdi",
    "context": "The activation of the new system was successful."
},
{
    "id": "158",
    "word": "ACTUALLY",
    "meaning": "Aslında, gerçekte",
    "synonyms": [
        "really",
        "truly",
        "in fact"
    ],
    "antonyms": [
        "apparently",
        "seemingly"
    ],
    "mnemonic": "Ali Aslında Gerçeği Bilir",
    "context": "I'm actually going to the movies tonight."
},
{
    "id": "159",
    "word": "ADAPTABLE",
    "meaning": "Uygun, uyumlu",
    "synonyms": [
        "flexible",
        "adjustable",
        "versatile"
    ],
    "antonyms": [
        "inflexible",
        "rigid"
    ],
    "mnemonic": "Ali Uyum Sağlar",
    "context": "She is an adaptable person who can work in any environment."
},
{
    "id": "160",
    "word": "ADDICTION",
    "meaning": "Bağımlılık",
    "synonyms": [
        "dependence",
        "habit",
        "obsession"
    ],
    "antonyms": [
        "independence",
        "freedom"
    ],
    "mnemonic": "Ali Bağımlılıktan Kurtuldu",
    "context": "He struggled with addiction for many years."
},
{
    "id": "161",
    "word": "ADDITIONAL",
    "meaning": "Ek, ilave",
    "synonyms": [
        "extra",
        "supplementary",
        "further"
    ],
    "antonyms": [
        "main",
        "primary"
    ],
    "mnemonic": "Ali Ekstra İhtiyaçları Karşılar",
    "context": "There will be an additional fee for the service."
},
{
    "id": "162",
    "word": "ADDRESSED",
    "meaning": "Hitap edilmiş, yönlendirilmiş",
    "synonyms": [
        "spoken to",
        "directed",
        "targeted"
    ],
    "antonyms": [
        "ignored",
        "dismissed"
    ],
    "mnemonic": "Ali Hitap Edildi",
    "context": "The issue was addressed by the manager."
},
{
    "id": "163",
    "word": "ADEQUATE",
    "meaning": "Yeterli, uygun",
    "synonyms": [
        "sufficient",
        "enough",
        "suitable"
    ],
    "antonyms": [
        "inadequate",
        "insufficient"
    ],
    "mnemonic": "Ali Yeterli Kaynakları Buldu",
    "context": "The hotel room was adequate for our needs."
},
{
    "id": "164",
    "word": "ADEQUATELY",
    "meaning": "Yeterli derecede, uygun bir şekilde",
    "synonyms": [
        "sufficiently",
        "enough",
        "suitably"
    ],
    "antonyms": [
        "inadequately",
        "insufficiently"
    ],
    "mnemonic": "Ali Yeterli Derecede Kaynakları Buldu",
    "context": "The company is adequately prepared for the crisis."
},
{
    "id": "165",
    "word": "ADHERE",
    "meaning": "Uymak, bağlı kalmak",
    "synonyms": [
        "stick to",
        "comply with",
        "conform to"
    ],
    "antonyms": [
        "disobey",
        "violate"
    ],
    "mnemonic": "Ali Uyum İçinde Çalışır",
    "context": "We must adhere to the rules and regulations."
},
{
    "id": "166",
    "word": "ADHERES",
    "meaning": "Yapışmak, uymak",
    "synonyms": [
        "sticks",
        "clings",
        "attaches"
    ],
    "antonyms": [
        "detaches",
        "separates"
    ],
    "mnemonic": "Arkadaşım Düşmanla Harp Eder, Resmen Düşmanlaşmışlar",
    "context": "The glue adheres well to the paper."
},
{
    "id": "167",
    "word": "ADJUST",
    "meaning": "Ayarlama, düzenleme",
    "synonyms": [
        "regulate",
        "modify",
        "alter"
    ],
    "antonyms": [
        "disrupt",
        "disturb"
    ],
    "mnemonic": "Ayça Düzgünce Jáveonne Unutmaz, Sistem Tight",
    "context": "Can you adjust the thermostat to 22 degrees?"
},
{
    "id": "168",
    "word": "ADJUSTMENT",
    "meaning": "Ayarlama, düzenleme, uyum",
    "synonyms": [
        "regulation",
        "modification",
        "adaptation"
    ],
    "antonyms": [
        "disruption",
        "disturbance"
    ],
    "mnemonic": "Ailem Dün Janti Üzerinde Yeni Sistem Takıldı, Mutlu",
    "context": "The adjustment period after moving to a new city can be challenging."
},
{
    "id": "169",
    "word": "ADJUSTS",
    "meaning": "Ayarlama yapar, düzenler",
    "synonyms": [
        "regulates",
        "modifies",
        "alters"
    ],
    "antonyms": [
        "disrupts",
        "disturbs"
    ],
    "mnemonic": "Aşk Düşmanı Jáveonne Üzerinde Sistem Tight",
    "context": "The company adjusts its prices according to the market demand."
},
{
    "id": "170",
    "word": "ADMINISTER",
    "meaning": "Yönetmek, idare etmek, uygulamak",
    "synonyms": [
        "manage",
        "govern",
        "apply"
    ],
    "antonyms": [
        "neglect",
        "ignore"
    ],
    "mnemonic": "Ali Dayı Minhoca İlaç Verir, İyi Olur, Sağlıklı",
    "context": "The nurse will administer the medication to the patient."
},
{
    "id": "171",
    "word": "ADMINISTERED",
    "meaning": "Yönetildi, idare edildi, uygulandı",
    "synonyms": [
        "managed",
        "governed",
        "applied"
    ],
    "antonyms": [
        "neglected",
        "ignored"
    ],
    "mnemonic": "Ali Dayı Minhoca İlaç Verdi, İyi Oldu, Sağlıklı",
    "context": "The company administered the new policy effectively."
},
{
    "id": "172",
    "word": "ADMIRABLY",
    "meaning": "Takdir edilir şekilde, beğeni uyandıran şekilde",
    "synonyms": [
        "praiseworthily",
        "commendably",
        "laudably"
    ],
    "antonyms": [
        "unworthily",
        "blamably"
    ],
    "mnemonic": "Ali Dayı Minhoca İnsanları Rahatlatır, Büyük Beğeni Toplar",
    "context": "She performed her duties admirably and received a promotion."
},
{
    "id": "173",
    "word": "ADMIRATION",
    "meaning": "Beyaz, hayranlık",
    "synonyms": [
        "awe",
        "wonder",
        "appreciation"
    ],
    "antonyms": [
        "disgust",
        "contempt"
    ],
    "mnemonic": "Ali Dayı Minhoca İnsanları Rahatlatır, Büyük Hayranlık Uyandırır",
    "context": "I have great admiration for her courage and determination."
},
{
    "id": "174",
    "word": "ADMIRED",
    "meaning": "Hayran olduğumuz, takdir ettiğimiz",
    "synonyms": [
        "praised",
        "respected",
        "revered"
    ],
    "antonyms": [
        "despised",
        "disdained"
    ],
    "mnemonic": "Ali Dayı Minhoca İnsanları Rahatlatır, Büyük Hayranlık Uyandırır",
    "context": "She has always admired her parents for their wisdom and kindness."
},
{
    "id": "175",
    "word": "ADMIRING",
    "meaning": "Hayran olan, takdir eden",
    "synonyms": [
        "praising",
        "respecting",
        "revering"
    ],
    "antonyms": [
        "despising",
        "disdaining"
    ],
    "mnemonic": "Ali Dayı Minhoca İnsanları Rahatlatır, Büyük Hayranlık Uyandırır",
    "context": "He was admiring the beautiful view from the top of the mountain."
},
{
    "id": "176",
    "word": "ADMISSION",
    "meaning": "Giriş, kabul, itiraf",
    "synonyms": [
        "entrance",
        "access",
        "confession"
    ],
    "antonyms": [
        "rejection",
        "denial"
    ],
    "mnemonic": "Ali Dayı Minhoca İnsanları Rahatlatır, Giriş Ücreti Alır",
    "context": "The admission fee to the museum is 10 dollars."
},
{
    "id": "177",
    "word": "ADMIT",
    "meaning": "Kabul etmek, itiraf etmek, girmek",
    "synonyms": [
        "acknowledge",
        "confess",
        "enter"
    ],
    "antonyms": [
        "deny",
        "refuse"
    ],
    "mnemonic": "Ali Dayı Minhoca İnsanları Kabule Davet Eder",
    "context": "I admit that I made a mistake, and I apologize for it."
},
{
    "id": "178",
    "word": "ADMITTING",
    "meaning": "Kabul etme, itiraf etme, girişleme",
    "synonyms": [
        "acknowledging",
        "confessing",
        "entering"
    ],
    "antonyms": [
        "denying",
        "refusing"
    ],
    "mnemonic": "Ali Dayı Minhoca İnsanları Kabule Davet Ediyor",
    "context": "The hospital is admitting new patients every day."
},
{
    "id": "179",
    "word": "ADOPT",
    "meaning": "Evlât edinmek, kabul etmek, benimsemek",
    "synonyms": [
        "accept",
        "embrace",
        "take in"
    ],
    "antonyms": [
        "reject",
        "refuse"
    ],
    "mnemonic": "Ali Dayı Minhoca Çocukları Evlat Edinir",
    "context": "We decided to adopt a child from the orphanage."
},
{
    "id": "180",
    "word": "ADOPTING",
    "meaning": "Evlât edinme, kabul etme, benimseme",
    "synonyms": [
        "accepting",
        "embracing",
        "taking in"
    ],
    "antonyms": [
        "rejecting",
        "refusing"
    ],
    "mnemonic": "Ali Dayı Minhoca Çocukları Evlat Ediniyor",
    "context": "The company is adopting new technologies to improve its services."
},
{
    "id": "181",
    "word": "ADOPTION",
    "meaning": "Evlat edinme",
    "synonyms": [
        "acceptance",
        "fostering"
    ],
    "antonyms": [
        "rejection",
        "abandonment"
    ],
    "mnemonic": "Anne Babanın Oğlu Přistir Evde",
    "context": "The couple decided to proceed with the adoption of a child from a foreign country."
},
{
    "id": "182",
    "word": "ADVANCE",
    "meaning": "İlerlemek, ilerleme",
    "synonyms": [
        "progress",
        "improvement"
    ],
    "antonyms": [
        "decline",
        "regress"
    ],
    "mnemonic": "Ali'nin Vizyonu Nice Çalışmalar",
    "context": "The company will advance in the market with its new product line."
},
{
    "id": "183",
    "word": "ADVANCED",
    "meaning": "İleri düzeyde",
    "synonyms": [
        "sophisticated",
        "complex"
    ],
    "antonyms": [
        "basic",
        "simple"
    ],
    "mnemonic": "Ali'nin Vizyonu Nice Çalışmalar Da",
    "context": "The advanced technology used in the new smartphone makes it highly desirable."
},
{
    "id": "184",
    "word": "ADVANCEMENT",
    "meaning": "İlerleme, terfi",
    "synonyms": [
        "progress",
        "promotion"
    ],
    "antonyms": [
        "demotion",
        "setback"
    ],
    "mnemonic": "Ali'nin Vizyonu Nice Çalışmalar Da İlerler",
    "context": "The employee's hard work led to her advancement in the company."
},
{
    "id": "185",
    "word": "ADVANCES",
    "meaning": "İlerlemeler",
    "synonyms": [
        "progress",
        "improvements"
    ],
    "antonyms": [
        "declines",
        "regressions"
    ],
    "mnemonic": "Ali'nin Vizyonu Nice Çalışmalar Da İlerler",
    "context": "The company has made significant advances in the field of renewable energy."
},
{
    "id": "186",
    "word": "ADVANTAGE",
    "meaning": "Avantaj",
    "synonyms": [
        "benefit",
        "upper hand"
    ],
    "antonyms": [
        "disadvantage",
        "drawback"
    ],
    "mnemonic": "Ali'nin Vizyonu Nice Çalışmalar Avantajı",
    "context": "The new policy gives a significant advantage to small businesses."
},
{
    "id": "187",
    "word": "ADVANTAGES",
    "meaning": "Avantajlar",
    "synonyms": [
        "benefits",
        "upper hands"
    ],
    "antonyms": [
        "disadvantages",
        "drawbacks"
    ],
    "mnemonic": "Ali'nin Vizyonu Nice Çalışmalar Avantajları",
    "context": "The company highlights the advantages of using their product in the marketing campaign."
},
{
    "id": "188",
    "word": "ADVENT",
    "meaning": "Geliş, doğuş",
    "synonyms": [
        "arrival",
        "emergence"
    ],
    "antonyms": [
        "departure",
        "decline"
    ],
    "mnemonic": "Ali'nin Vizyonu Nice Çalışmalar Doğum",
    "context": "The advent of the internet has revolutionized the way we communicate."
},
{
    "id": "189",
    "word": "ADVERSE",
    "meaning": "Zararlı, olumsuz",
    "synonyms": [
        "harmful",
        "unfavorable"
    ],
    "antonyms": [
        "beneficial",
        "favorable"
    ],
    "mnemonic": "Ali'nin Vizyonu Nice Çalışmalar Zararlı",
    "context": "The company faced adverse conditions in the market due to the economic downturn."
},
{
    "id": "190",
    "word": "ADVERSELY",
    "meaning": "Zararlı bir şekilde, olumsuz olarak",
    "synonyms": [
        "harmfully",
        "unfavorably"
    ],
    "antonyms": [
        "beneficially",
        "favorably"
    ],
    "mnemonic": "Ali'nin Vizyonu Nice Çalışmalar Zararlı Bir Şekilde",
    "context": "The new policy affected the environment adversely, causing widespread concern."
},
{
    "id": "191",
    "word": "ADVERSITIES",
    "meaning": "Zorluklar, güçlükler",
    "synonyms": [
        "hardships",
        "challenges"
    ],
    "antonyms": [
        "opportunities",
        "blessings"
    ],
    "mnemonic": "Ali'nin Vizyonu Nice Çalışmalar Zorluklar",
    "context": "The team faced many adversities during their journey to the championship."
},
{
    "id": "192",
    "word": "ADVERSITY",
    "meaning": "Zorluk, güçlük",
    "synonyms": [
        "hardship",
        "challenge"
    ],
    "antonyms": [
        "opportunity",
        "blessing"
    ],
    "mnemonic": "Ali'nin Vizyonu Nice Çalışmalar Zorluk",
    "context": "The team learned to overcome adversity and achieve their goals."
},
{
    "id": "193",
    "word": "ADVERTS",
    "meaning": "Reklam verir",
    "synonyms": [
        "advertises",
        "promotes"
    ],
    "antonyms": [
        "hides",
        "conceals"
    ],
    "mnemonic": "Ali'nin Vizyonu Nice Çalışmalar Reklam",
    "context": "The company adverts their products on social media to reach a wider audience."
},
{
    "id": "194",
    "word": "AFFECTING",
    "meaning": "Etkileyen",
    "synonyms": [
        "influencing",
        "impacting"
    ],
    "antonyms": [
        "ignoring",
        "disregarding"
    ],
    "mnemonic": "Ali'nin Vizyonu Nice Çalışmalar Etkileyen",
    "context": "The new policy is affecting the lives of many people in the community."
},
{
    "id": "195",
    "word": "AFFORDABLE",
    "meaning": "Ucuz, uygun fiyatlı",
    "synonyms": [
        "cheap",
        "inexpensive"
    ],
    "antonyms": [
        "expensive",
        "costly"
    ],
    "mnemonic": "Ali'nin Vizyonu Nice Çalışmalar Uygun Fiyatlı",
    "context": "The company aims to provide affordable housing options for low-income families."
},
{
    "id": "196",
    "word": "AGGRESSIVELY",
    "meaning": "Saldırgan bir şekilde",
    "synonyms": [
        "hostilely",
        "belligerently",
        "confrontationally"
    ],
    "antonyms": [
        "passively",
        "peacefully"
    ],
    "mnemonic": "Saldırgan köpeklerin saldırısı",
    "context": "The company is marketing its new product aggressively to attract more customers."
},
{
    "id": "197",
    "word": "ALLEGEDLY",
    "meaning": "İddiaya göre",
    "synonyms": [
        "reportedly",
        "supposedly",
        "purportedly"
    ],
    "antonyms": [
        "admittedly",
        "confessedly"
    ],
    "mnemonic": "İddiaların gerçek olması",
    "context": "The suspect was allegedly involved in the robbery, but there is no concrete evidence."
},
{
    "id": "198",
    "word": "ALLEVATION",
    "meaning": "Hafifletme, rahatlama",
    "synonyms": [
        "relief",
        "easing",
        "mitigation"
    ],
    "antonyms": [
        "aggravation",
        "worsening"
    ],
    "mnemonic": "Hasta olan kişiye yardım",
    "context": "The new medication brought alleviation to the patient's chronic pain."
},
{
    "id": "199",
    "word": "ALLIANCE",
    "meaning": "İttifak",
    "synonyms": [
        "coalition",
        "partnership",
        "association"
    ],
    "antonyms": [
        "rivalry",
        "opposition"
    ],
    "mnemonic": "İki ülke arasında güçlü bağ",
    "context": "The two companies formed an alliance to expand their market share."
},
{
    "id": "200",
    "word": "ALLIANCES",
    "meaning": "İttifaklar",
    "synonyms": [
        "coalitions",
        "partnerships",
        "associations"
    ],
    "antonyms": [
        "rivalries",
        "oppositions"
    ],
    "mnemonic": "Birden fazla ülkenin işbirliği",
    "context": "The company has formed alliances with several other businesses to improve its competitiveness."
},
{
    "id": "201",
    "word": "ALLOCATE",
    "meaning": "Ayırmak, tahsis etmek",
    "synonyms": [
        "assign",
        "allot",
        "apportion"
    ],
    "antonyms": [
        "withhold",
        "retain"
    ],
    "mnemonic": "Para ayırma",
    "context": "The manager will allocate the budget for the new project next week."
},
{
    "id": "202",
    "word": "ALLOCATION",
    "meaning": "Ayırma, tahsis",
    "synonyms": [
        "assignment",
        "allotment",
        "apportionment"
    ],
    "antonyms": [
        "withholding",
        "retention"
    ],
    "mnemonic": "Para ayırma işlemi",
    "context": "The allocation of resources is crucial for the success of the project."
},
{
    "id": "203",
    "word": "ALLOT",
    "meaning": "Ayırmak, tahsis etmek",
    "synonyms": [
        "allocate",
        "assign",
        "apportion"
    ],
    "antonyms": [
        "withhold",
        "retain"
    ],
    "mnemonic": "Paylaşımda adalet",
    "context": "The government will allot a certain amount of land for the new housing project."
},
{
    "id": "204",
    "word": "ALLOTTED",
    "meaning": "Ayırılan, tahsis edilen",
    "synonyms": [
        "allocated",
        "assigned",
        "apportioned"
    ],
    "antonyms": [
        "withheld",
        "retained"
    ],
    "mnemonic": "Paylaşılan şey",
    "context": "The company has allotted a significant amount of money for research and development."
},
{
    "id": "205",
    "word": "ALTER",
    "meaning": "Değiştirmek",
    "synonyms": [
        "change",
        "modify",
        "amend"
    ],
    "antonyms": [
        "retain",
        "preserve"
    ],
    "mnemonic": "Değişim için adımlar",
    "context": "The designer will alter the dress to fit the client's measurements."
},
{
    "id": "206",
    "word": "ALTERATION",
    "meaning": "Değişim, değişiklik",
    "synonyms": [
        "change",
        "modification",
        "amendment"
    ],
    "antonyms": [
        "preservation",
        "conservation"
    ],
    "mnemonic": "Değişim süreci",
    "context": "The alteration of the contract terms was necessary to reflect the new agreement."
},
{
    "id": "207",
    "word": "ALTERED",
    "meaning": "Değiştirilen",
    "synonyms": [
        "changed",
        "modified",
        "amended"
    ],
    "antonyms": [
        "retained",
        "preserved"
    ],
    "mnemonic": "Değişen şey",
    "context": "The altered version of the document was sent to the client for approval."
},
{
    "id": "208",
    "word": "ALTERNATIVELY",
    "meaning": "Başka türlü, alternatif olarak",
    "synonyms": [
        "instead",
        "otherwise",
        "on the other hand"
    ],
    "antonyms": [
        "necessarily",
        "inevitably"
    ],
    "mnemonic": "Farklı seçenekler",
    "context": "Alternatively, we could take the bus to the airport instead of driving."
},
{
    "id": "209",
    "word": "AMBIGUITY",
    "meaning": "Belirsizlik, çok anlamlılık",
    "synonyms": [
        "uncertainty",
        "vagueness",
        "obscurity"
    ],
    "antonyms": [
        "clarity",
        "certainty"
    ],
    "mnemonic": "Anlam karmaşası",
    "context": "The ambiguity of the sentence made it difficult to understand the author's intention."
},
{
    "id": "210",
    "word": "AMBIGUOUS",
    "meaning": "Belirsiz, çok anlamlı",
    "synonyms": [
        "uncertain",
        "vague",
        "obscure"
    ],
    "antonyms": [
        "clear",
        "certain"
    ],
    "mnemonic": "Anlamın karışması",
    "context": "The ambiguous language used in the contract led to a dispute between the parties."
},
{
    "id": "211",
    "word": "AMBIGUOUSLY",
    "meaning": "Kapalı veya belirsiz bir şekilde",
    "synonyms": [
        "vaguely",
        "indistinctly",
        "obscurely"
    ],
    "antonyms": [
        "clearly",
        "obviously"
    ],
    "mnemonic": "Ambi gümbür gümbür konuşur",
    "context": "The professor spoke ambiguously about the new policy, leaving many students confused."
},
{
    "id": "212",
    "word": "AMBITION",
    "meaning": "Hırs, azim",
    "synonyms": [
        "aspiration",
        "desire",
        "goal"
    ],
    "antonyms": [
        "apathy",
        "indifference"
    ],
    "mnemonic": "Ambi hırsızım, ambitionerim",
    "context": "Her ambition to become a doctor drove her to study hard and never give up."
},
{
    "id": "213",
    "word": "ANCESTORS",
    "meaning": "Atalar, soydaşlar",
    "synonyms": [
        "forefathers",
        "predecessors",
        "ancestors"
    ],
    "antonyms": [
        "descendants",
        "offspring"
    ],
    "mnemonic": "Ata beni gönder, ancestorsum",
    "context": "The tribe honored their ancestors with a traditional ceremony and offerings."
},
{
    "id": "214",
    "word": "ANCIENT",
    "meaning": "Eski, antik",
    "synonyms": [
        "old",
        "antiquated",
        "vintage"
    ],
    "antonyms": [
        "modern",
        "new"
    ],
    "mnemonic": "Antik altın, ancient benim",
    "context": "The ancient city was filled with ruins and artifacts from a long-lost civilization."
},
{
    "id": "215",
    "word": "ANNIVERSARY",
    "meaning": "Yıl dönümü, kutlama",
    "synonyms": [
        "birthday",
        "jubilee",
        "commemoration"
    ],
    "antonyms": [
        "separation",
        "divorce"
    ],
    "mnemonic": "Anne versary, anniversary",
    "context": "The couple celebrated their 10-year anniversary with a romantic dinner and a weekend getaway."
},
{
    "id": "216",
    "word": "ANNUALLY",
    "meaning": "Yıllık, her yıl",
    "synonyms": [
        "yearly",
        "every year",
        "once a year"
    ],
    "antonyms": [
        "monthly",
        "daily"
    ],
    "mnemonic": "Annual nehir, her yıl akar",
    "context": "The company hosts an annual conference for its employees and partners."
},
{
    "id": "217",
    "word": "ANTICIPATION",
    "meaning": "Beklenti, umut",
    "synonyms": [
        "expectation",
        "hope",
        "excitement"
    ],
    "antonyms": [
        "disappointment",
        "despair"
    ],
    "mnemonic": "Anti bekliyorum, anticipation",
    "context": "The anticipation of the new movie release was building up, and fans were eagerly waiting for its premiere."
},
{
    "id": "218",
    "word": "ANXIOUS",
    "meaning": "Endişeli, kaygılı",
    "synonyms": [
        "nervous",
        "apprehensive",
        "worried"
    ],
    "antonyms": [
        "calm",
        "relaxed"
    ],
    "mnemonic": "Anksiyete, anxiousum",
    "context": "She felt anxious about the upcoming exam and was studying hard to prepare."
},
{
    "id": "219",
    "word": "APOLOGISE",
    "meaning": "Özür dilerim, affedersiniz",
    "synonyms": [
        "apologize",
        "regret",
        "excuse"
    ],
    "antonyms": [
        "justify",
        "defend"
    ],
    "mnemonic": "Apologi, özür dilerim",
    "context": "He had to apologise to his boss for his mistake and promised to be more careful in the future."
},
{
    "id": "220",
    "word": "APPARENTLY",
    "meaning": "Görünüşe göre, açıkça",
    "synonyms": [
        "seemingly",
        "obviously",
        "evidently"
    ],
    "antonyms": [
        "secretly",
        "covertly"
    ],
    "mnemonic": "Apparent görünüş, apparently",
    "context": "Apparently, the new policy has been well-received by the employees, and morale has improved."
},
{
    "id": "221",
    "word": "APPEAL",
    "meaning": "Başvurmak, başvuruda bulunmak",
    "synonyms": [
        "request",
        "petition",
        "plea"
    ],
    "antonyms": [
        "refuse",
        "deny"
    ],
    "mnemonic": " Appeal, başvurmak",
    "context": "The company will appeal the court's decision and try to overturn the verdict."
},
{
    "id": "222",
    "word": "APPEARANCE",
    "meaning": "Görünüş, dış görünüm",
    "synonyms": [
        "look",
        "aspect",
        "outward appearance"
    ],
    "antonyms": [
        "reality",
        "substance"
    ],
    "mnemonic": "Appear, görünüş",
    "context": "The new employee's appearance and confident demeanor made a good impression on the manager."
},
{
    "id": "223",
    "word": "APPLICATION",
    "meaning": "Başvuru, uygulama",
    "synonyms": [
        "request",
        "petition",
        "form"
    ],
    "antonyms": [
        "rejection",
        "denial"
    ],
    "mnemonic": "Apply, başvuru",
    "context": "The application process for the scholarship was rigorous, but she was determined to succeed."
},
{
    "id": "224",
    "word": "APPOINT",
    "meaning": "Atamak, tayin etmek",
    "synonyms": [
        "assign",
        "designate",
        "nominate"
    ],
    "antonyms": [
        "remove",
        "dismiss"
    ],
    "mnemonic": "Appoint, atama",
    "context": "The company will appoint a new CEO to lead the organization and make key decisions."
},
{
    "id": "225",
    "word": "APPOINTED",
    "meaning": "Atanmış, tayin edilmiş",
    "synonyms": [
        "assigned",
        "designated",
        "nominated"
    ],
    "antonyms": [
        "removed",
        "dismissed"
    ],
    "mnemonic": "Appointed, atanmış",
    "context": "The newly appointed manager was tasked with improving the team's performance and productivity."
},
{
    "id": "226",
    "word": "APPRECIATE",
    "meaning": "Değer vermek, takdir etmek",
    "synonyms": [
        "value",
        "prize",
        "esteem"
    ],
    "antonyms": [
        "disregard",
        "ignore"
    ],
    "mnemonic": "Appreciate Atatürk'ü Preis ile değer verdi",
    "context": "I appreciate your help in this difficult time."
},
{
    "id": "227",
    "word": "APPRECIATION",
    "meaning": "Değer verme, takdir",
    "synonyms": [
        "gratitude",
        "acknowledgement",
        "recognition"
    ],
    "antonyms": [
        "disdain",
        "contempt"
    ],
    "mnemonic": "Appreciation Atatürk'ü Preis ile değer verdiğini gösterir",
    "context": "The company showed its appreciation for her hard work with a bonus."
},
{
    "id": "228",
    "word": "APPROACH",
    "meaning": "Yaklaşım, yaklaşmak",
    "synonyms": [
        "method",
        "technique",
        "strategy"
    ],
    "antonyms": [
        "avoid",
        "shun"
    ],
    "mnemonic": "Approach Atatürk Havalimanı'na Yaklaşmak",
    "context": "The new approach to the problem was more effective."
},
{
    "id": "229",
    "word": "APPROACHED",
    "meaning": "Yaklaştı, yanaştı",
    "synonyms": [
        "came near",
        "drew near",
        "neared"
    ],
    "antonyms": [
        "receded",
        "withdrew"
    ],
    "mnemonic": "Approached Atatürk'ü Havalimanı'na yanaştı",
    "context": "The stranger approached me on the street and asked for directions."
},
{
    "id": "230",
    "word": "APPROPRIATE",
    "meaning": "Uygun, yerinde",
    "synonyms": [
        "suitable",
        "fitting",
        "proper"
    ],
    "antonyms": [
        "inappropriate",
        "unseemly"
    ],
    "mnemonic": "Appropriate Atatürk'ü Uygun zamanda ziyaret etmek",
    "context": "The dress was not appropriate for the formal occasion."
},
{
    "id": "231",
    "word": "APPROPRIATELY",
    "meaning": "Uygun bir şekilde, yerinde",
    "synonyms": [
        "suitably",
        "fitly",
        "properly"
    ],
    "antonyms": [
        "inappropriately",
        "unseemly"
    ],
    "mnemonic": "Appropriately Atatürk'ü Uygun zamanda ziyaret etmek",
    "context": "The teacher spoke appropriately to the student about their behavior."
},
{
    "id": "232",
    "word": "APPROVAL",
    "meaning": "Onay, kabul",
    "synonyms": [
        "agreement",
        "consent",
        "sanction"
    ],
    "antonyms": [
        "disapproval",
        "rejection"
    ],
    "mnemonic": "Approval Atatürk'ü Onayladı",
    "context": "The project received approval from the board of directors."
},
{
    "id": "233",
    "word": "APPROVE",
    "meaning": "Onaylamak, kabul etmek",
    "synonyms": [
        "agree",
        "consent",
        "sanction"
    ],
    "antonyms": [
        "disapprove",
        "reject"
    ],
    "mnemonic": "Approve Atatürk'ü Onayladı",
    "context": "The manager will approve your request for a raise."
},
{
    "id": "234",
    "word": "APPROVES",
    "meaning": "Onaylıyor, kabul ediyor",
    "synonyms": [
        "agrees",
        "consents",
        "sanctions"
    ],
    "antonyms": [
        "disapproves",
        "rejects"
    ],
    "mnemonic": "Approves Atatürk'ü Onaylıyor",
    "context": "The company approves of the new marketing strategy."
},
{
    "id": "235",
    "word": "APPROXIMATELY",
    "meaning": "Yaklaşık olarak, yaklaşık",
    "synonyms": [
        "about",
        "around",
        "nearly"
    ],
    "antonyms": [
        "exactly",
        "precisely"
    ],
    "mnemonic": "Approximately Atatürk'ü Yaklaşık olarak ziyaret etmek",
    "context": "The population of the city is approximately one million."
},
{
    "id": "236",
    "word": "ARBITRARILY",
    "meaning": "Keyfi olarak, rasgele",
    "synonyms": [
        "randomly",
        "capriciously",
        "whimsically"
    ],
    "antonyms": [
        "logically",
        "rationally"
    ],
    "mnemonic": "Arbitrarily Atatürk'ü Keyfi olarak ziyaret etmek",
    "context": "The decision was made arbitrarily, without any clear reason."
},
{
    "id": "237",
    "word": "ARBITRARY",
    "meaning": "Keyfi, rasgele",
    "synonyms": [
        "random",
        "capricious",
        "whimsical"
    ],
    "antonyms": [
        "logical",
        "rational"
    ],
    "mnemonic": "Arbitrary Atatürk'ü Keyfi kararlar alır",
    "context": "The arbitrary nature of the rules was frustrating."
},
{
    "id": "238",
    "word": "ARDENTLY",
    "meaning": "Şiddetle, coşkuyla",
    "synonyms": [
        "passionately",
        "fervently",
        "enthusiastically"
    ],
    "antonyms": [
        "apathetically",
        "indifferently"
    ],
    "mnemonic": "Ardently Atatürk'ü Şiddetle sever",
    "context": "She ardently supported the cause and worked tirelessly for it."
},
{
    "id": "239",
    "word": "ARGUABLY",
    "meaning": "Tartışılabilir bir şekilde, muhtemelen",
    "synonyms": [
        "possibly",
        "probably",
        "presumably"
    ],
    "antonyms": [
        "undoubtedly",
        "certainly"
    ],
    "mnemonic": "Arguably Atatürk'ü Tartışılabilir bir şekilde değerlendirmek",
    "context": "He is arguably the best player on the team."
},
{
    "id": "240",
    "word": "ARGUE",
    "meaning": "Tartışmak, iddia etmek",
    "synonyms": [
        "debate",
        "dispute",
        "contend"
    ],
    "antonyms": [
        "agree",
        "concur"
    ],
    "mnemonic": "Argue Atatürk'ü Tartışır",
    "context": "The couple began to argue about whose turn it was to do the dishes."
},
{
    "id": "241",
    "word": "ARGUING",
    "meaning": "Tartışmak, tartışma",
    "synonyms": [
        "debating",
        "disputing",
        "quarreling"
    ],
    "antonyms": [
        "agreeing",
        "concurring"
    ],
    "mnemonic": "Argümanları güçlendirerek Tartışmaları yen",
    "context": "The couple spent the entire evening arguing about whose turn it was to do the dishes."
},
{
    "id": "242",
    "word": "ARRANGE",
    "meaning": "Düzenlemek, organize etmek",
    "synonyms": [
        "organize",
        "plan",
        "coordinate"
    ],
    "antonyms": [
        "disorganize",
        "mess up"
    ],
    "mnemonic": "Düzeni sağlamak için Araştırmaya başla ve Yeniden düzenle",
    "context": "She will arrange the flowers in a beautiful bouquet for the wedding."
},
{
    "id": "243",
    "word": "ARRANGING",
    "meaning": "Düzenleme, organize etme",
    "synonyms": [
        "organizing",
        "planning",
        "coordinating"
    ],
    "antonyms": [
        "disorganizing",
        "messing up"
    ],
    "mnemonic": "Düzeni sağlamak için Araştırmaya başla ve Yeniden düzenle",
    "context": "The event planner is arranging the seating for the conference."
},
{
    "id": "244",
    "word": "ARTICULATE",
    "meaning": "Açık seçik konuşmak, ifade etmek",
    "synonyms": [
        "express",
        "pronounce",
        "enunciate"
    ],
    "antonyms": [
        "mumble",
        "stammer"
    ],
    "mnemonic": "Açık konuşmak için Ağzını aç ve Kelimelerini seç",
    "context": "The professor is known for being able to articulate complex ideas in a simple way."
},
{
    "id": "245",
    "word": "ARTICULATED",
    "meaning": "Açık seçik konuşulmuş, ifade edilmiş",
    "synonyms": [
        "expressed",
        "pronounced",
        "enunciated"
    ],
    "antonyms": [
        "mumbled",
        "stammered"
    ],
    "mnemonic": "Açık konuşmak için Ağzını aç ve Kelimelerini seç",
    "context": "The actor's articulated speech made it easy to understand the dialogue."
},
{
    "id": "246",
    "word": "ARTIFICIALLY",
    "meaning": "Yapay olarak, suni olarak",
    "synonyms": [
        "synthetically",
        "man-made",
        "fake"
    ],
    "antonyms": [
        "naturally",
        "organically"
    ],
    "mnemonic": "Yapay olarak yapmak için Araştırmaya başla ve Yeni yöntemler geliştir",
    "context": "The company is artificially inflating the prices of their products."
},
{
    "id": "247",
    "word": "ASPIRATION",
    "meaning": "Hedef, amaç, idealler",
    "synonyms": [
        "goal",
        "ambition",
        "dream"
    ],
    "antonyms": [
        "despair",
        "hopelessness"
    ],
    "mnemonic": "Hedefe ulaşmak için Araştırmaya başla ve İdealini belirle",
    "context": "Her aspiration is to become a successful business owner one day."
},
{
    "id": "248",
    "word": "ASSESS",
    "meaning": "Değerlendirmek, ölçmek",
    "synonyms": [
        "evaluate",
        "appraise",
        "measure"
    ],
    "antonyms": [
        "ignore",
        "overlook"
    ],
    "mnemonic": "Değerlendirmek için Araştırmaya başla ve Sonuçları ölç",
    "context": "The teacher will assess the students' progress at the end of the semester."
},
{
    "id": "249",
    "word": "ASSOCIATION",
    "meaning": "Birlik, dernek, bağ",
    "synonyms": [
        "organization",
        "union",
        "connection"
    ],
    "antonyms": [
        "separation",
        "isolation"
    ],
    "mnemonic": "Birlikte olmak için Araştırmaya başla ve Bağları güçlendir",
    "context": "The association of local businesses is working to improve the community."
},
{
    "id": "250",
    "word": "ASSUME",
    "meaning": "Kabul etmek, varsaymak",
    "synonyms": [
        "suppose",
        "presume",
        "guess"
    ],
    "antonyms": [
        "doubt",
        "question"
    ],
    "mnemonic": "Kabul etmek için Araştırmaya başla ve Varsayımı yap",
    "context": "I assume you're going to the party tonight, right?"
},
{
    "id": "251",
    "word": "ASSUMPTION",
    "meaning": "Kabul, varsayım",
    "synonyms": [
        "supposition",
        "presumption",
        "hypothesis"
    ],
    "antonyms": [
        "fact",
        "reality"
    ],
    "mnemonic": "Kabul etmek için Araştırmaya başla ve Varsayımı yap",
    "context": "The assumption that all people are equal is a fundamental principle of democracy."
},
{
    "id": "252",
    "word": "ASSURANCE",
    "meaning": "Güven, teminat",
    "synonyms": [
        "confidence",
        "security",
        "guarantee"
    ],
    "antonyms": [
        "doubt",
        "uncertainty"
    ],
    "mnemonic": "Güvenmek için Araştırmaya başla ve Teminatı sağlay",
    "context": "The company provides assurance that their products are of high quality."
},
{
    "id": "253",
    "word": "ASTONISHED",
    "meaning": "Şaşırmış, hayretler içinde",
    "synonyms": [
        "amazed",
        "stunned",
        "dumbfounded"
    ],
    "antonyms": [
        "unimpressed",
        "unfazed"
    ],
    "mnemonic": "Şaşmak için Araştırmaya başla ve Hayretlere düş",
    "context": "I was astonished by the beauty of the Grand Canyon."
},
{
    "id": "254",
    "word": "ATTACH",
    "meaning": "Bağlamak, eklemek",
    "synonyms": [
        "fasten",
        "connect",
        "join"
    ],
    "antonyms": [
        "detach",
        "separate"
    ],
    "mnemonic": "Bağlamak için Araştırmaya başla ve Bağları güçlendir",
    "context": "Please attach the document to the email before sending it."
},
{
    "id": "255",
    "word": "ATTACHED",
    "meaning": "Bağlı, ekli",
    "synonyms": [
        "fastened",
        "connected",
        "joined"
    ],
    "antonyms": [
        "detached",
        "separated"
    ],
    "mnemonic": "Bağlamak için Araştırmaya başla ve Bağları güçlendir",
    "context": "The file is attached to the email, so you can download it easily."
},
{
    "id": "256",
    "word": "ATTACHMENT",
    "meaning": "Bağlama, ek",
    "synonyms": [
        "appendix",
        "addition",
        "supplement"
    ],
    "antonyms": [
        "detachment",
        "separation"
    ],
    "mnemonic": "Attach gibi Attachments'ı ekleriz",
    "context": "The attachment to the email contained important documents."
},
{
    "id": "257",
    "word": "ATTAIN",
    "meaning": "Ulaşmak, erişmek",
    "synonyms": [
        "reach",
        "achieve",
        "acquire"
    ],
    "antonyms": [
        "lose",
        "fail"
    ],
    "mnemonic": "Attain gibi yüksek dağları tırmanmak",
    "context": "After years of hard work, she was able to attain her goal."
},
{
    "id": "258",
    "word": "ATTAINABLE",
    "meaning": "Ulaşılabilir, erişilebilir",
    "synonyms": [
        "accessible",
        "achievable",
        "feasible"
    ],
    "antonyms": [
        "unattainable",
        "impossible"
    ],
    "mnemonic": "Attainable gibi ulaşılabilir bir hedef",
    "context": "The company set attainable targets for the new project."
},
{
    "id": "259",
    "word": "ATTEMPT",
    "meaning": "Denemek, girişmek",
    "synonyms": [
        "try",
        "effort",
        "venture"
    ],
    "antonyms": [
        "give up",
        "abandon"
    ],
    "mnemonic": "Attempt gibi denemek, girişmek",
    "context": "She made an attempt to learn a new language."
},
{
    "id": "260",
    "word": "ATTENTIVELY",
    "meaning": "Dikkatlice, özenle",
    "synonyms": [
        "carefully",
        "thoughtfully",
        "mindfully"
    ],
    "antonyms": [
        "carelessly",
        "negligently"
    ],
    "mnemonic": "Attentively gibi dikkat dolu bir şekilde",
    "context": "The teacher listened attentively to the student's question."
},
{
    "id": "261",
    "word": "ATTITUDE",
    "meaning": "Tutum, davranış",
    "synonyms": [
        "behavior",
        "demeanor",
        "manner"
    ],
    "antonyms": [
        "indifference",
        "apathy"
    ],
    "mnemonic": "Attitude gibi tutum, davranış",
    "context": "Her positive attitude made her a great team player."
},
{
    "id": "262",
    "word": "ATTRACT",
    "meaning": "Çekmek, çekici olmak",
    "synonyms": [
        "draw",
        "lure",
        "entice"
    ],
    "antonyms": [
        "repel",
        "deter"
    ],
    "mnemonic": "Attract gibi manyetik bir güç",
    "context": "The city's beauty attracted many tourists."
},
{
    "id": "263",
    "word": "ATTRACTED",
    "meaning": "Çekilmiş, etkilenmiş",
    "synonyms": [
        "drawn",
        "interested",
        "fascinated"
    ],
    "antonyms": [
        "unattracted",
        "uninterested"
    ],
    "mnemonic": "Attracted gibi bir mıknatısın çekimi",
    "context": "She was attracted to the idea of traveling abroad."
},
{
    "id": "264",
    "word": "ATTRACTION",
    "meaning": "Çekim, çekicilik",
    "synonyms": [
        "appeal",
        "allure",
        "charm"
    ],
    "antonyms": [
        "repulsion",
        "aversion"
    ],
    "mnemonic": "Attraction gibi bir tema parkı",
    "context": "The city's main attraction was the historic castle."
},
{
    "id": "265",
    "word": "ATTRIBUTE",
    "meaning": "Özelliği, niteliği",
    "synonyms": [
        "quality",
        "characteristic",
        "feature"
    ],
    "antonyms": [
        "defect",
        "flaw"
    ],
    "mnemonic": "Attribute gibi bir şeyin niteliği",
    "context": "Her kindness was an attribute that made her a great friend."
},
{
    "id": "266",
    "word": "ATTRIBUTED",
    "meaning": "Atfedilmiş, yüklenilmiş",
    "synonyms": [
        "ascribed",
        "assigned",
        "imputed"
    ],
    "antonyms": [
        "denied",
        "refuted"
    ],
    "mnemonic": "Attributed gibi bir şeyin kaynağı",
    "context": "The success of the project was attributed to the team's hard work."
},
{
    "id": "267",
    "word": "AUCTION",
    "meaning": "Açık artırma, ihale",
    "synonyms": [
        "bid",
        "tender",
        "sale"
    ],
    "antonyms": [
        "private sale",
        "fixed price"
    ],
    "mnemonic": "Auction gibi bir açık artırma",
    "context": "The painting was sold at an auction for a record price."
},
{
    "id": "268",
    "word": "AVAILABILITY",
    "meaning": "Mevcutluk, erişilebilirlik",
    "synonyms": [
        "accessibility",
        "readiness",
        "usability"
    ],
    "antonyms": [
        "unavailability",
        "inaccessibility"
    ],
    "mnemonic": "Availability gibi bir ürünün mevcut olması",
    "context": "The availability of the product was limited due to high demand."
},
{
    "id": "269",
    "word": "AVAILABLE",
    "meaning": "Mevcut, erişilebilir",
    "synonyms": [
        "accessible",
        "ready",
        "usable"
    ],
    "antonyms": [
        "unavailable",
        "inaccessible"
    ],
    "mnemonic": "Available gibi bir şeyin mevcut olması",
    "context": "The hotel room was available for check-in at 2 PM."
},
{
    "id": "270",
    "word": "AVERAGE",
    "meaning": "Ortalama, vasat",
    "synonyms": [
        "mean",
        "median",
        "normal"
    ],
    "antonyms": [
        "exceptional",
        "outstanding"
    ],
    "mnemonic": "Average gibi bir sınıfın ortalama notu",
    "context": "The average score on the test was 70 out of 100."
},
{
    "id": "271",
    "word": "AVOID",
    "meaning": "Kaçınmak, uzak durmak",
    "synonyms": [
        "escape",
        "evade",
        "shun"
    ],
    "antonyms": [
        "confront",
        "face"
    ],
    "mnemonic": "Kedi Ayağını Yakmak İstemez",
    "context": "I try to avoid driving in heavy traffic."
},
{
    "id": "272",
    "word": "AVOIDABLE",
    "meaning": "Kaçınılabilir, önlenebilir",
    "synonyms": [
        "preventable",
        "evitable",
        "avoidable"
    ],
    "antonyms": [
        "unavoidable",
        "inevitable"
    ],
    "mnemonic": "Açık Yolda Öne Bakmak",
    "context": "The accident was avoidable if the driver had been more careful."
},
{
    "id": "273",
    "word": "AVOIDANCE",
    "meaning": "Kaçınma, uzak durma",
    "synonyms": [
        "evasion",
        "escape",
        "dodging"
    ],
    "antonyms": [
        "confrontation",
        "facing"
    ],
    "mnemonic": "Aşırı Vigoran Öneri Yapmak İstemez",
    "context": "The avoidance of the issue only made it worse in the long run."
},
{
    "id": "274",
    "word": "AVOIDS",
    "meaning": "Kaçınır, uzak durur",
    "synonyms": [
        "evades",
        "shuns",
        "eschews"
    ],
    "antonyms": [
        "confronts",
        "faces"
    ],
    "mnemonic": "Aşırı Vigoran Öneri Yapmak İstemez Diğeri",
    "context": "She avoids talking about her past."
},
{
    "id": "275",
    "word": "AWARENESS",
    "meaning": "Farkındalık, bilinçlilik",
    "synonyms": [
        "consciousness",
        "knowledge",
        "recognition"
    ],
    "antonyms": [
        "ignorance",
        "unawareness"
    ],
    "mnemonic": "Aydın Vigoranın Rencontre'u",
    "context": "The campaign raised awareness about the importance of environmental protection."
},
{
    "id": "276",
    "word": "BALANCE",
    "meaning": "Denge, dengelemek",
    "synonyms": [
        "equilibrium",
        "stability",
        "harmony"
    ],
    "antonyms": [
        "imbalance",
        "instability"
    ],
    "mnemonic": "Bakış Açısı Liderlikte Dengeyi Bulur",
    "context": "It's essential to balance work and personal life."
},
{
    "id": "277",
    "word": "BARRIER",
    "meaning": "Engel, bariyer",
    "synonyms": [
        "obstacle",
        "hurdle",
        "blockage"
    ],
    "antonyms": [
        "opportunity",
        "facilitator"
    ],
    "mnemonic": "Bacakları Açık Řekilde Engel Tanımlar",
    "context": "The language barrier made it difficult for us to communicate."
},
{
    "id": "278",
    "word": "BASIC",
    "meaning": "Temel, basit",
    "synonyms": [
        "fundamental",
        "essential",
        "simple"
    ],
    "antonyms": [
        "advanced",
        "complex"
    ],
    "mnemonic": "Başlangıçta Açıklamalı Bilgiler Sunar",
    "context": "The basic principles of physics are easy to understand."
},
{
    "id": "279",
    "word": "BELONGINGS",
    "meaning": "Eşyalar, malvarlığı",
    "synonyms": [
        "possessions",
        "property",
        "assets"
    ],
    "antonyms": [
        "liabilities",
        "debts"
    ],
    "mnemonic": "Bireylerin Eşyaları ve Lêyi",
    "context": "The family lost all their belongings in the fire."
},
{
    "id": "280",
    "word": "BENEFICIAL",
    "meaning": "Faydalı, yararlı",
    "synonyms": [
        "helpful",
        "advantageous",
        "profitable"
    ],
    "antonyms": [
        "harmful",
        "detrimental"
    ],
    "mnemonic": "Benefit ve Fayda Aynı Anda",
    "context": "Exercise is beneficial for both physical and mental health."
},
{
    "id": "281",
    "word": "BENEFIT",
    "meaning": "Fayda, yarar",
    "synonyms": [
        "advantage",
        "profit",
        "gain"
    ],
    "antonyms": [
        "disadvantage",
        "loss"
    ],
    "mnemonic": "Becerilerinizi Faydaya Dönüştürün",
    "context": "The new policy will benefit many low-income families."
},
{
    "id": "282",
    "word": "BIZARRE",
    "meaning": "Garip, tuhaf",
    "synonyms": [
        "strange",
        "weird",
        "unusual"
    ],
    "antonyms": [
        "normal",
        "ordinary"
    ],
    "mnemonic": "Beyin İradesi Zihinsel Açılıkta Renkli",
    "context": "The bizarre art exhibition was a huge success."
},
{
    "id": "283",
    "word": "BLEND",
    "meaning": "Karıştırmak, birleştirmek",
    "synonyms": [
        "mix",
        "merge",
        "combine"
    ],
    "antonyms": [
        "separate",
        "divide"
    ],
    "mnemonic": "Birleşen Lêyi ve Nesneler",
    "context": "You can blend different ingredients to create a unique flavor."
},
{
    "id": "284",
    "word": "BLINDLY",
    "meaning": "Körlemesine, düşünmeden",
    "synonyms": [
        "recklessly",
        "impulsively",
        "thoughtlessly"
    ],
    "antonyms": [
        "carefully",
        "thoughtfully"
    ],
    "mnemonic": "Bilinçsizce Lêyi ve Hareket",
    "context": "She followed him blindly, without questioning his decisions."
},
{
    "id": "285",
    "word": "BOOST",
    "meaning": "Arttırmak, güçlendirmek",
    "synonyms": [
        "increase",
        "enhance",
        "strengthen"
    ],
    "antonyms": [
        "decrease",
        "weaken"
    ],
    "mnemonic": "Becerilerinizi Öne Çıkarın ve Güçlendirin",
    "context": "The new marketing campaign will boost sales and revenue."
},
{
    "id": "286",
    "word": "BORROW",
    "meaning": "Ödünç almak, borç almak",
    "synonyms": [
        "lend",
        "lend out",
        "loan"
    ],
    "antonyms": [
        "lend",
        "give"
    ],
    "mnemonic": "Ödünç almak borcu ödemek",
    "context": "I need to borrow some money from my friend to pay the rent."
},
{
    "id": "287",
    "word": "BREAKDOWN",
    "meaning": "Bozulma, arıza, çökme",
    "synonyms": [
        "failure",
        "malfunction",
        "collapse"
    ],
    "antonyms": [
        "recovery",
        "repair"
    ],
    "mnemonic": "Bozulma breakdown olacak",
    "context": "The car had a breakdown on the highway, so we had to call a tow truck."
},
{
    "id": "288",
    "word": "BREAKTHROUGH",
    "meaning": "Başarı, atılım, keşif",
    "synonyms": [
        "discovery",
        "innovation",
        "achievement"
    ],
    "antonyms": [
        "failure",
        "setback"
    ],
    "mnemonic": "Başarıya ulaşmak breakdown değil breakthrough",
    "context": "The scientists made a breakthrough in their research and found a cure for the disease."
},
{
    "id": "289",
    "word": "BRIEF",
    "meaning": "Kısa, öz, özeti",
    "synonyms": [
        "short",
        "concise",
        "summary"
    ],
    "antonyms": [
        "long",
        "detailed"
    ],
    "mnemonic": "Kısa olan brief olur",
    "context": "The manager gave a brief summary of the project to the investors."
},
{
    "id": "290",
    "word": "CALCULATION",
    "meaning": "Hesaplama, hesap",
    "synonyms": [
        "computation",
        "estimation",
        "reckoning"
    ],
    "antonyms": [
        "guess",
        "assumption"
    ],
    "mnemonic": "Hesap yapmak calculation yapmak",
    "context": "The engineer made a calculation to determine the stress on the bridge."
},
{
    "id": "291",
    "word": "CAPABILITIES",
    "meaning": "Kabiliyetler, yetenekler",
    "synonyms": [
        "abilities",
        "skills",
        "talents"
    ],
    "antonyms": [
        "weaknesses",
        "limitations"
    ],
    "mnemonic": "Kabiliyetler yeteneklerinCapabilities",
    "context": "The company is looking for employees with strong capabilities in programming and design."
},
{
    "id": "292",
    "word": "CAPABILITY",
    "meaning": "Kabiliyet, yetenek",
    "synonyms": [
        "ability",
        "skill",
        "talent"
    ],
    "antonyms": [
        "weakness",
        "limitation"
    ],
    "mnemonic": "Kabiliyet capability yapar",
    "context": "The new employee has a great capability for learning and adapting to new situations."
},
{
    "id": "293",
    "word": "CAPACITY",
    "meaning": "Kapasite, olanak",
    "synonyms": [
        "ability",
        "power",
        "potential"
    ],
    "antonyms": [
        "limitation",
        "restriction"
    ],
    "mnemonic": "Kapasite capability ile ilgili",
    "context": "The stadium has a capacity of 50,000 spectators for the concert."
},
{
    "id": "294",
    "word": "CAPTURE",
    "meaning": "Yakalamak, ele geçirmek",
    "synonyms": [
        "catch",
        "seize",
        "grasp"
    ],
    "antonyms": [
        "release",
        "free"
    ],
    "mnemonic": "Yakalamak capture yapmak",
    "context": "The police tried to capture the suspect, but he escaped."
},
{
    "id": "295",
    "word": "CAPTURING",
    "meaning": "Yakalama, ele geçirme",
    "synonyms": [
        "catching",
        "seizing",
        "grasping"
    ],
    "antonyms": [
        "releasing",
        "freeing"
    ],
    "mnemonic": "Yakalama capturing yapar",
    "context": "The company is capturing a large share of the market with its new product."
},
{
    "id": "296",
    "word": "CASUAL",
    "meaning": "Rastgele, tesadüfi",
    "synonyms": [
        "random",
        "accidental",
        "incidental"
    ],
    "antonyms": [
        "intentional",
        "deliberate"
    ],
    "mnemonic": "Rastgele olan casual olur",
    "context": "I met my old friend by casual encounter at the park."
},
{
    "id": "297",
    "word": "CASUALLY",
    "meaning": "Rastgele, tesadüfen",
    "synonyms": [
        "randomly",
        "accidentally",
        "incidentally"
    ],
    "antonyms": [
        "intentionally",
        "deliberately"
    ],
    "mnemonic": "Rastgele olan casually yapılır",
    "context": "I ran into my neighbor casually at the grocery store."
},
{
    "id": "298",
    "word": "CAUSE",
    "meaning": "Sebep, neden",
    "synonyms": [
        "reason",
        "origin",
        "source"
    ],
    "antonyms": [
        "effect",
        "result"
    ],
    "mnemonic": "Sebep olan cause yapar",
    "context": "The cause of the accident is still under investigation."
},
{
    "id": "299",
    "word": "CAUSING",
    "meaning": "Sebep olmak, neden olmak",
    "synonyms": [
        "causing",
        "producing",
        "inducing"
    ],
    "antonyms": [
        "preventing",
        "stopping"
    ],
    "mnemonic": "Sebep olan causing yapar",
    "context": "The company is causing pollution in the area with its factory."
},
{
    "id": "300",
    "word": "CAUTIONARY",
    "meaning": "Uyarıcı, ihtiyatlı",
    "synonyms": [
        "warning",
        "admonitory",
        "cautious"
    ],
    "antonyms": [
        "encouraging",
        "reassuring"
    ],
    "mnemonic": "Uyarıcı olan cautionary olur",
    "context": "The cautionary tale about the dangers of smoking is very effective."
},
{
    "id": "301",
    "word": "CAUTIOUSLY",
    "meaning": "Dikkatli bir şekilde",
    "synonyms": [
        "carefully",
        "prudently",
        "warily"
    ],
    "antonyms": [
        "recklessly",
        "impulsively"
    ],
    "mnemonic": "Dikkatli olmak, her zaman kazanmak",
    "context": "She drove cautiously through the foggy night."
},
{
    "id": "302",
    "word": "CEASELESS",
    "meaning": "Sürekli, durmak bilmez",
    "synonyms": [
        "endless",
        "incessant",
        "unrelenting"
    ],
    "antonyms": [
        "intermittent",
        "periodic"
    ],
    "mnemonic": "Sürekli çalışmak, başarılı olmak",
    "context": "The ceaseless efforts of the team paid off in the end."
},
{
    "id": "303",
    "word": "CELEBRATION",
    "meaning": "Kutlama, tören",
    "synonyms": [
        "party",
        "festivity",
        "revelry"
    ],
    "antonyms": [
        "mourning",
        "lamentation"
    ],
    "mnemonic": "Kutlama yapmak, sevinmek",
    "context": "The whole town joined in the celebration of the new year."
},
{
    "id": "304",
    "word": "CHALLENGE",
    "meaning": " meydan okuma, zorluk",
    "synonyms": [
        "obstacle",
        "difficulty",
        "test"
    ],
    "antonyms": [
        "opportunity",
        "advantage"
    ],
    "mnemonic": "Zorluğu kabul etmek, başarıya ulaşmak",
    "context": "The team saw the new project as a challenge to be overcome."
},
{
    "id": "305",
    "word": "CHALLENGING",
    "meaning": "Zor, meydan okuma",
    "synonyms": [
        "demanding",
        "difficult",
        "taxing"
    ],
    "antonyms": [
        "easy",
        "simple"
    ],
    "mnemonic": "Zorluğu severek, başarıya koşmak",
    "context": "The challenging hike was a great way to test our endurance."
},
{
    "id": "306",
    "word": "CHOOSE",
    "meaning": "Seçmek, tercih etmek",
    "synonyms": [
        "select",
        "pick",
        "prefer"
    ],
    "antonyms": [
        "reject",
        "refuse"
    ],
    "mnemonic": "Seçmek, hedefe ulaşmak",
    "context": "You have to choose between the two options."
},
{
    "id": "307",
    "word": "CHRONIC",
    "meaning": "Kronik, uzun süreli",
    "synonyms": [
        "long-term",
        "persistent",
        "recurrent"
    ],
    "antonyms": [
        "acute",
        "temporary"
    ],
    "mnemonic": "Kronik hastalıkları, dikkatli tedavi etmek",
    "context": "The doctor diagnosed the patient with a chronic disease."
},
{
    "id": "308",
    "word": "CIRCULATE",
    "meaning": "Dolaşmak, yayılmak",
    "synonyms": [
        "spread",
        "disseminate",
        "distribute"
    ],
    "antonyms": [
        "confine",
        "restrict"
    ],
    "mnemonic": "Bilgiyi dolaştırmak, paylaşmak",
    "context": "The company will circulate the new policy to all employees."
},
{
    "id": "309",
    "word": "CIRCULATED",
    "meaning": "Dolaştırılmış, yayılmış",
    "synonyms": [
        "spread",
        "disseminated",
        "distributed"
    ],
    "antonyms": [
        "confined",
        "restricted"
    ],
    "mnemonic": "Bilgiyi dolaştırmak, paylaşmak",
    "context": "The rumor had already circulated around the office."
},
{
    "id": "310",
    "word": "CIRCUMSTANCE",
    "meaning": "Durum, koşullar",
    "synonyms": [
        "situation",
        "condition",
        "state"
    ],
    "antonyms": [
        "necessity",
        "inevitability"
    ],
    "mnemonic": "Koşulları değerlendirmek, karar vermek",
    "context": "The circumstance of the accident was still unclear."
},
{
    "id": "311",
    "word": "CIRCUMSTANCES",
    "meaning": "Koşullar, durumlar",
    "synonyms": [
        "situations",
        "conditions",
        "states"
    ],
    "antonyms": [
        "necessities",
        "inevitabilities"
    ],
    "mnemonic": "Koşulları değerlendirmek, karar vermek",
    "context": "The circumstances of the case were very complicated."
},
{
    "id": "312",
    "word": "CLARIFICATION",
    "meaning": "Açıklama, aydınlatma",
    "synonyms": [
        "explanation",
        "elucidation",
        "interpretation"
    ],
    "antonyms": [
        "confusion",
        "obfuscation"
    ],
    "mnemonic": "Açıklamayı yapmak, anlamayı kolaylaştırmak",
    "context": "The teacher provided a clarification of the difficult concept."
},
{
    "id": "313",
    "word": "CLARITY",
    "meaning": "Açıklık, berraklık",
    "synonyms": [
        "clearness",
        "transparency",
        "lucidity"
    ],
    "antonyms": [
        "confusion",
        "ambiguity"
    ],
    "mnemonic": "Açıklık sağlamak, anlaşılmasını kolaylaştırmak",
    "context": "The clarity of the water made it perfect for swimming."
},
{
    "id": "314",
    "word": "CLASSIFICATION",
    "meaning": "Sınıflandırma, kategorilendirme",
    "synonyms": [
        "categorization",
        "taxonomy",
        "typing"
    ],
    "antonyms": [
        "mixing",
        "confusion"
    ],
    "mnemonic": "Sınıflandırmayı yapmak, düzeni sağlamak",
    "context": "The classification of the new species was a major breakthrough."
},
{
    "id": "315",
    "word": "CLOSELY",
    "meaning": "Yakından, dikkatli bir şekilde",
    "synonyms": [
        "closely",
        "tightly",
        "intimately"
    ],
    "antonyms": [
        "loosely",
        "distantly"
    ],
    "mnemonic": "Yakından takip etmek, dikkatli olmak",
    "context": "The detective watched the suspect closely."
},
{
    "id": "316",
    "word": "CLUMSY",
    "meaning": "Usta olmayan, hantal",
    "synonyms": [
        "inept",
        "awkward",
        "ungainly"
    ],
    "antonyms": [
        "skilled",
        "agile"
    ],
    "mnemonic": "Çok Usta Olmayan Larisa Hantal",
    "context": "The clumsy waiter spilled wine all over the table."
},
{
    "id": "317",
    "word": "COHERENTLY",
    "meaning": "Mantıklı bir şekilde, tutarlı olarak",
    "synonyms": [
        "logically",
        "consistently",
        "rationally"
    ],
    "antonyms": [
        "illogically",
        "inconsistently"
    ],
    "mnemonic": "Çok Olumlu Hikaye Eksik Olmadan Tutarlılık Sağlar",
    "context": "She spoke coherently about the new marketing strategy."
},
{
    "id": "318",
    "word": "COINCIDENCE",
    "meaning": "Rastlantı, tesadüf",
    "synonyms": [
        "chance",
        "accident",
        "luck"
    ],
    "antonyms": [
        "intention",
        "plan"
    ],
    "mnemonic": "Çok İlginç Olaylar Nedeni İle Çıkan Dostluk",
    "context": "It was a coincidence that we met at the same hotel."
},
{
    "id": "319",
    "word": "COINCIDENTALLY",
    "meaning": "Rasgele, tesadüfen",
    "synonyms": [
        "accidentally",
        "by chance",
        "fortuitously"
    ],
    "antonyms": [
        "intentionally",
        "on purpose"
    ],
    "mnemonic": "Çok İlginç Olaylar Nedeni İle Tesadüfen",
    "context": "I coincidentally ran into my old friend at the party."
},
{
    "id": "320",
    "word": "COLLABORATE",
    "meaning": "İşbirliği yapmak, birlikte çalışmak",
    "synonyms": [
        "cooperate",
        "partner",
        "team up"
    ],
    "antonyms": [
        "compete",
        "oppose"
    ],
    "mnemonic": "Çok İyi İş Birliği Yapmak Lazım",
    "context": "The companies will collaborate on the new project."
},
{
    "id": "321",
    "word": "COLLABORATION",
    "meaning": "İşbirliği, ortak çalışma",
    "synonyms": [
        "cooperation",
        "partnership",
        "teamwork"
    ],
    "antonyms": [
        "competition",
        "rivalry"
    ],
    "mnemonic": "Çok İyi İş Birliği Ortak Çalışma",
    "context": "The collaboration between the two artists resulted in a beautiful painting."
},
{
    "id": "322",
    "word": "COLLEAGUES",
    "meaning": "İş arkadaşları, mesai arkadaşları",
    "synonyms": [
        "coworkers",
        "colleagues",
        "fellow workers"
    ],
    "antonyms": [
        "enemies",
        "rivals"
    ],
    "mnemonic": "Çok İyi Liên İş Arkadaşları",
    "context": "My colleagues are very supportive and helpful."
},
{
    "id": "323",
    "word": "COLLECT",
    "meaning": "Toplamak, biriktirmek",
    "synonyms": [
        "gather",
        "assemble",
        "amass"
    ],
    "antonyms": [
        "scatter",
        "disperse"
    ],
    "mnemonic": "Çok İyi Toplama Becerisi",
    "context": "She started to collect stamps from different countries."
},
{
    "id": "324",
    "word": "COLLECTED",
    "meaning": "Toplanan, biriktirilen",
    "synonyms": [
        "gathered",
        "assembled",
        "amassed"
    ],
    "antonyms": [
        "scattered",
        "dispersed"
    ],
    "mnemonic": "Çok İyi Toplanan Becerisi",
    "context": "The collected data will be used for further research."
},
{
    "id": "325",
    "word": "COLLECTION",
    "meaning": "Koleksiyon, toplama",
    "synonyms": [
        "assembly",
        "gathering",
        "accumulation"
    ],
    "antonyms": [
        "dispersion",
        "scattering"
    ],
    "mnemonic": "Çok İyi Koleksiyon Toplama",
    "context": "The museum has a vast collection of ancient artifacts."
},
{
    "id": "326",
    "word": "COMBAT",
    "meaning": "Savaş, dövüş",
    "synonyms": [
        "fight",
        "battle",
        "clash"
    ],
    "antonyms": [
        "peace",
        "truce"
    ],
    "mnemonic": "Çok İyi Mücadele Becerisi",
    "context": "The soldiers were trained for combat in the desert."
},
{
    "id": "327",
    "word": "COMMAND",
    "meaning": "Emir, komuta",
    "synonyms": [
        "order",
        "instruction",
        "direction"
    ],
    "antonyms": [
        "request",
        "suggestion"
    ],
    "mnemonic": "Çok İyi Emir Verme Becerisi",
    "context": "The general gave the command to attack the enemy."
},
{
    "id": "328",
    "word": "COMMANDS",
    "meaning": "Emirleri, komutları",
    "synonyms": [
        "orders",
        "instructions",
        "directions"
    ],
    "antonyms": [
        "requests",
        "suggestions"
    ],
    "mnemonic": "Çok İyi Emir Verme Becerileri",
    "context": "The computer program executes the commands quickly."
},
{
    "id": "329",
    "word": "COMMENT",
    "meaning": "Yorum, açıklama",
    "synonyms": [
        "remark",
        "observation",
        "opinion"
    ],
    "antonyms": [
        "silence",
        "ignorance"
    ],
    "mnemonic": "Çok İyi Yorum Becerisi",
    "context": "She made a comment about the new movie on social media."
},
{
    "id": "330",
    "word": "COMMITMENT",
    "meaning": "Taahhüt, söz",
    "synonyms": [
        "promise",
        "pledge",
        "obligation"
    ],
    "antonyms": [
        "refusal",
        "denial"
    ],
    "mnemonic": "Çok İyi Taahhüt Becerisi",
    "context": "The company made a commitment to reduce its carbon footprint."
},
{
    "id": "331",
    "word": "COMMITTED",
    "meaning": "Taahhüt etmiş, bağlanmış",
    "synonyms": [
        "dedicated",
        "devoted",
        "loyal"
    ],
    "antonyms": [
        "uncommitted",
        "detached"
    ],
    "mnemonic": "Komedi gösterisine katılmış",
    "context": "She is fully committed to her job and always meets her deadlines."
},
{
    "id": "332",
    "word": "COMMON",
    "meaning": "Ortak, yaygın",
    "synonyms": [
        "shared",
        "mutual",
        "usual"
    ],
    "antonyms": [
        "uncommon",
        "rare"
    ],
    "mnemonic": "Komşular ortak posta kutusu kullanır",
    "context": "It's common for people to feel nervous before a big exam."
},
{
    "id": "333",
    "word": "COMPARABLE",
    "meaning": "Karşılaştırılabilir",
    "synonyms": [
        "similar",
        "analogous",
        "equivalent"
    ],
    "antonyms": [
        "incomparable",
        "unique"
    ],
    "mnemonic": "Komparatif analiz yapılır",
    "context": "The two companies are comparable in terms of their market share and revenue."
},
{
    "id": "334",
    "word": "COMPARATIVELY",
    "meaning": "Göreceli olarak",
    "synonyms": [
        "relatively",
        "proportionally",
        "respectively"
    ],
    "antonyms": [
        "absolutely",
        "completely"
    ],
    "mnemonic": "Komplo teorileri göreli olarak doğru olabilir",
    "context": "The new policy has been comparatively successful in reducing crime rates."
},
{
    "id": "335",
    "word": "COMPATIBLE",
    "meaning": "Uyumlu, uygun",
    "synonyms": [
        "harmonious",
        "consistent",
        "concordant"
    ],
    "antonyms": [
        "incompatible",
        "conflicting"
    ],
    "mnemonic": "Kompakt diskler uyumlu cihazlarda çalışır",
    "context": "The new software is compatible with both Windows and macOS operating systems."
},
{
    "id": "336",
    "word": "COMPELLING",
    "meaning": "İkna edici, inandırıcı",
    "synonyms": [
        "convincing",
        "persuasive",
        "compelling"
    ],
    "antonyms": [
        "unconvincing",
        "unpersuasive"
    ],
    "mnemonic": "Komik bir hikaye ikna edici olabilir",
    "context": "The documentary presented a compelling argument for climate change awareness."
},
{
    "id": "337",
    "word": "COMPETE",
    "meaning": "Rekabet etmek, yarışmak",
    "synonyms": [
        "contest",
        "vie",
        "rival"
    ],
    "antonyms": [
        "cooperate",
        "collaborate"
    ],
    "mnemonic": "Kompetisyon için yarışmacılar hazırlanır",
    "context": "The two companies will compete for the major contract next month."
},
{
    "id": "338",
    "word": "COMPETENCE",
    "meaning": "Yeterlilik, beceri",
    "synonyms": [
        "ability",
        "skill",
        "proficiency"
    ],
    "antonyms": [
        "incompetence",
        "ineptness"
    ],
    "mnemonic": "Kompetan bir doktor başarılı olur",
    "context": "The new employee's competence in programming languages is impressive."
},
{
    "id": "339",
    "word": "COMPETENCIES",
    "meaning": "Yeterlilikler, beceriler",
    "synonyms": [
        "skills",
        "abilities",
        "expertise"
    ],
    "antonyms": [
        "weaknesses",
        "ineptitudes"
    ],
    "mnemonic": "Kompetanslar geliştirilir",
    "context": "The company is looking for a candidate with strong competencies in marketing and sales."
},
{
    "id": "340",
    "word": "COMPETITION",
    "meaning": "Rekabet, yarışma",
    "synonyms": [
        "contest",
        "rivalry",
        "tournament"
    ],
    "antonyms": [
        "cooperation",
        "collaboration"
    ],
    "mnemonic": "Kompetisyon için hazırlanmak gerekir",
    "context": "The competition for the top job was fierce, with many qualified applicants."
},
{
    "id": "341",
    "word": "COMPETITIVE",
    "meaning": "Rekabetçi, yarışmacı",
    "synonyms": [
        "aggressive",
        "ambitious",
        "driven"
    ],
    "antonyms": [
        "uncompetitive",
        "laid-back"
    ],
    "mnemonic": "Kompetitif bir pazar ortamı",
    "context": "The company has a competitive pricing strategy to attract more customers."
},
{
    "id": "342",
    "word": "COMPILE",
    "meaning": "Derlemek, toplamak",
    "synonyms": [
        "gather",
        "collect",
        "assemble"
    ],
    "antonyms": [
        "disassemble",
        "dismantle"
    ],
    "mnemonic": "Kompile edilen bir liste",
    "context": "The researcher will compile the data from the survey and analyze the results."
},
{
    "id": "343",
    "word": "COMPLAIN",
    "meaning": "Şikayet etmek, dert yanmak",
    "synonyms": [
        "gripe",
        "grumble",
        "protest"
    ],
    "antonyms": [
        "praise",
        "commend"
    ],
    "mnemonic": "Komşu şikayetçi olabilir",
    "context": "The customer will complain to the manager about the poor service."
},
{
    "id": "344",
    "word": "COMPLAINT",
    "meaning": "Şikayet, dert",
    "synonyms": [
        "grievance",
        "objection",
        "protest"
    ],
    "antonyms": [
        "praise",
        "appreciation"
    ],
    "mnemonic": "Komplikasyonlar şikayete neden olabilir",
    "context": "The company received a complaint about the defective product and offered a refund."
},
{
    "id": "345",
    "word": "COMPLEMENTARY",
    "meaning": "Tamamlayıcı, ek",
    "synonyms": [
        "supplementary",
        "additional",
        "complementary"
    ],
    "antonyms": [
        "contradictory",
        "opposite"
    ],
    "mnemonic": "Komplemanter bir set",
    "context": "The company offers complementary services to its customers, including free shipping and returns."
},
{
    "id": "346",
    "word": "COMPLETE",
    "meaning": "Tamamlamak, bitirmek",
    "synonyms": [
        "finish",
        "accomplish",
        "fulfill"
    ],
    "antonyms": [
        "incomplete",
        "unfinished"
    ],
    "mnemonic": "Tamam, ben işi bitiriyorum",
    "context": "She will complete her degree next year."
},
{
    "id": "347",
    "word": "COMPLETELY",
    "meaning": "Tamamen, tamamen öyle",
    "synonyms": [
        "totally",
        "entirely",
        "fully"
    ],
    "antonyms": [
        "partially",
        "incompletely"
    ],
    "mnemonic": "Tamamen, ben işi biliyorum",
    "context": "I completely agree with your opinion."
},
{
    "id": "348",
    "word": "COMPLICATING",
    "meaning": "Karmaşıklaştırmak, zorlaştırmak",
    "synonyms": [
        "confusing",
        "obscuring",
        "entangling"
    ],
    "antonyms": [
        "simplifying",
        "clarifying"
    ],
    "mnemonic": "Karıştırmak, işi zorlaştırmak",
    "context": "The new rules are complicating the process."
},
{
    "id": "349",
    "word": "COMPLIMENT",
    "meaning": "Övgü, iltifat",
    "synonyms": [
        "praise",
        "flattery",
        "admiration"
    ],
    "antonyms": [
        "insult",
        "criticism"
    ],
    "mnemonic": "Övgü, seni çok beğendim",
    "context": "She paid him a compliment on his new suit."
},
{
    "id": "350",
    "word": "COMPONENT",
    "meaning": "Bileşen, parça",
    "synonyms": [
        "part",
        "element",
        "constituent"
    ],
    "antonyms": [
        "whole",
        "entirety"
    ],
    "mnemonic": "Parça, bütünün bir kısmı",
    "context": "The component is essential for the machine to function."
},
{
    "id": "351",
    "word": "COMPONENTS",
    "meaning": "Bileşenler, parçalar",
    "synonyms": [
        "parts",
        "elements",
        "constituents"
    ],
    "antonyms": [
        "whole",
        "entirety"
    ],
    "mnemonic": "Parçalar, bütünün birçok kısmı",
    "context": "The components of the system need to be replaced."
},
{
    "id": "352",
    "word": "COMPOSITION",
    "meaning": "Bestecilik, yapı",
    "synonyms": [
        "structure",
        "arrangement",
        "formation"
    ],
    "antonyms": [
        "decomposition",
        "dissolution"
    ],
    "mnemonic": "Yapı, parçaların birleşmesi",
    "context": "The composition of the team is very important for success."
},
{
    "id": "353",
    "word": "COMPREHENSIVE",
    "meaning": "Kapsamlı, geniş",
    "synonyms": [
        "thorough",
        "extensive",
        "inclusive"
    ],
    "antonyms": [
        "limited",
        "narrow"
    ],
    "mnemonic": "Geniş, her şeyi kapsayan",
    "context": "The comprehensive exam will cover all the material."
},
{
    "id": "354",
    "word": "COMPREHENSIVELY",
    "meaning": "Kapsamlı bir şekilde, geniş olarak",
    "synonyms": [
        "thoroughly",
        "extensively",
        "inclusively"
    ],
    "antonyms": [
        "limitedly",
        "narrowly"
    ],
    "mnemonic": "Geniş bir şekilde, her şeyi kapsayarak",
    "context": "The teacher explained the concept comprehensively."
},
{
    "id": "355",
    "word": "COMPRISED",
    "meaning": "İçermekte, dahil etmek",
    "synonyms": [
        "included",
        "contained",
        "encompassed"
    ],
    "antonyms": [
        "excluded",
        "omitted"
    ],
    "mnemonic": "İçermek, dahil etmek, kapsamak",
    "context": "The team comprised of experts from various fields."
},
{
    "id": "356",
    "word": "COMPRISES",
    "meaning": "İçermek, dahil etmek",
    "synonyms": [
        "includes",
        "contains",
        "encompasses"
    ],
    "antonyms": [
        "excludes",
        "omits"
    ],
    "mnemonic": "İçermek, dahil etmek, kapsamak",
    "context": "The course comprises of both theoretical and practical parts."
},
{
    "id": "357",
    "word": "COMPLUSION",
    "meaning": "Zorlama, mecburiyet",
    "synonyms": [
        "force",
        "coercion",
        "obligation"
    ],
    "antonyms": [
        "freedom",
        "voluntariness"
    ],
    "mnemonic": "Zorlama, mecburi olarak yapmak",
    "context": "The government used compulsion to implement the new policy."
},
{
    "id": "358",
    "word": "COMPULSORILY",
    "meaning": "Mecburi olarak, zorla",
    "synonyms": [
        "forcibly",
        "coercively",
        "obligatorily"
    ],
    "antonyms": [
        "voluntarily",
        "freely"
    ],
    "mnemonic": "Mecburi olarak, zorla yapmak",
    "context": "The students were compelled to attend the lecture compulsorily."
},
{
    "id": "359",
    "word": "COMPULSORY",
    "meaning": "Mecburi, zorunlu",
    "synonyms": [
        "obligatory",
        "required",
        "mandatory"
    ],
    "antonyms": [
        "optional",
        "voluntary"
    ],
    "mnemonic": "Mecburi, yapılması gereken",
    "context": "Attendance is compulsory for all students."
},
{
    "id": "360",
    "word": "CONCEAL",
    "meaning": "Gizlemek, saklamak",
    "synonyms": [
        "hide",
        "cover",
        "conceal"
    ],
    "antonyms": [
        "reveal",
        "expose"
    ],
    "mnemonic": "Gizlemek, saklamak, gözden kaçırmak",
    "context": "She tried to conceal her true feelings."
},
{
    "id": "361",
    "word": "CONCEALED",
    "meaning": "Gizlenmek, saklanmak",
    "synonyms": [
        "hidden",
        "secret",
        "disguised"
    ],
    "antonyms": [
        "visible",
        "apparent"
    ],
    "mnemonic": "Cömertce Örtmek Gizler Her Şeyi Açığa",
    "context": "The detective found a concealed compartment in the old trunk."
},
{
    "id": "362",
    "word": "CONCERN",
    "meaning": "Endişe, kaygı",
    "synonyms": [
        "worry",
        "anxiety",
        "apprehension"
    ],
    "antonyms": [
        "indifference",
        "unconcern"
    ],
    "mnemonic": "Çok Endişe Ruhsuz Kaygılı İnsanları Yönetir",
    "context": "The company's financial situation is a major concern for the investors."
},
{
    "id": "363",
    "word": "CONCERNS",
    "meaning": "Endişeler, kaygılar",
    "synonyms": [
        "worries",
        "anxieties",
        "fears"
    ],
    "antonyms": [
        "reassurances",
        "comforts"
    ],
    "mnemonic": "Çok Endişe Ruhsuz Kaygılı İnsanları Yönetir Sistem",
    "context": "The new policy addresses several concerns raised by the community."
},
{
    "id": "364",
    "word": "CONCLUSION",
    "meaning": "Sonuç, karar",
    "synonyms": [
        "outcome",
        "result",
        "decision"
    ],
    "antonyms": [
        "introduction",
        "beginning"
    ],
    "mnemonic": "Çok Önemli Netice Kararları Verir",
    "context": "After careful consideration, we came to the conclusion that it was the best option."
},
{
    "id": "365",
    "word": "CONCLUSIVELY",
    "meaning": "Kesin olarak, sonuçta",
    "synonyms": [
        "definitively",
        "ultimately",
        "finally"
    ],
    "antonyms": [
        "inconclusively",
        "tentatively"
    ],
    "mnemonic": "Çok Önemli Sonuçta Kesin Kararlar Verir",
    "context": "The study conclusively proved that the new method was more effective."
},
{
    "id": "366",
    "word": "CONDITION",
    "meaning": "Durum, koşul",
    "synonyms": [
        "state",
        "situation",
        "circumstance"
    ],
    "antonyms": [
        "uncondition",
        "absence"
    ],
    "mnemonic": "Çok Önemli Durumlar Koşulları Belirler",
    "context": "The doctor will monitor your condition and adjust the treatment as needed."
},
{
    "id": "367",
    "word": "CONDUCT",
    "meaning": "Davranış, davranış biçimi",
    "synonyms": [
        "behavior",
        "manner",
        "deportment"
    ],
    "antonyms": [
        "misconduct",
        "misbehavior"
    ],
    "mnemonic": "Çok Önemli Davranış Biçimleri",
    "context": "The company expects all employees to conduct themselves in a professional manner."
},
{
    "id": "368",
    "word": "CONFIDENTIAL",
    "meaning": "Gizli, özel",
    "synonyms": [
        "secret",
        "private",
        "classified"
    ],
    "antonyms": [
        "public",
        "open"
    ],
    "mnemonic": "Çok Önemli Gizli Bilgiler Özel Korunur",
    "context": "The confidential documents were stored in a secure location."
},
{
    "id": "369",
    "word": "CONFIDENTIALLY",
    "meaning": "Gizlice, özel olarak",
    "synonyms": [
        "secretly",
        "privately",
        "discreetly"
    ],
    "antonyms": [
        "openly",
        "publicly"
    ],
    "mnemonic": "Çok Önemli Gizli Bilgiler Özel Korunur Sistem",
    "context": "The information was shared confidentially among the team members."
},
{
    "id": "370",
    "word": "CONFIRM",
    "meaning": "Onaylamak, doğrulamak",
    "synonyms": [
        "verify",
        "validate",
        "affirm"
    ],
    "antonyms": [
        "deny",
        "refute"
    ],
    "mnemonic": "Çok Önemli Onaylar Doğrular",
    "context": "Please confirm your attendance at the meeting by Friday."
},
{
    "id": "371",
    "word": "CONFIRMS",
    "meaning": "Onaylar, doğrular",
    "synonyms": [
        "verifies",
        "validates",
        "affirms"
    ],
    "antonyms": [
        "denies",
        "refutes"
    ],
    "mnemonic": "Çok Önemli Onaylar Doğrular Sistem",
    "context": "The new data confirms our previous findings."
},
{
    "id": "372",
    "word": "CONFLICT",
    "meaning": "Çatışma, uyuşmazlık",
    "synonyms": [
        "disagreement",
        "clash",
        "strife"
    ],
    "antonyms": [
        "agreement",
        "harmony"
    ],
    "mnemonic": "Çok Önemli Çatışmalar Uyuşmazlıkları Yaratarak",
    "context": "The conflict between the two countries has been ongoing for years."
},
{
    "id": "373",
    "word": "CONFLICTING",
    "meaning": "Çatışan, uyuşmayan",
    "synonyms": [
        "inconsistent",
        "contradictory",
        "discordant"
    ],
    "antonyms": [
        "consistent",
        "harmonious"
    ],
    "mnemonic": "Çok Önemli Çatışan Bilgiler Uyuşmazlıkları Yaratarak",
    "context": "The conflicting reports from the two sources made it difficult to determine the truth."
},
{
    "id": "374",
    "word": "CONFLICTS",
    "meaning": "Çatışmalar, uyuşmazlıklar",
    "synonyms": [
        "disagreements",
        "clashes",
        "strifes"
    ],
    "antonyms": [
        "agreements",
        "harmonies"
    ],
    "mnemonic": "Çok Önemli Çatışmalar Uyuşmazlıkları Yaratarak Sistem",
    "context": "The company's conflicts with the union have been well-documented."
},
{
    "id": "375",
    "word": "CONFORM",
    "meaning": "Uymak, uygun olmak",
    "synonyms": [
        "comply",
        "obey",
        "adapt"
    ],
    "antonyms": [
        "resist",
        "refuse"
    ],
    "mnemonic": "Çok Önemli Uygun Olmak Sistem",
    "context": "The company must conform to the new regulations to avoid penalties."
},
{
    "id": "376",
    "word": "CONFORMITY",
    "meaning": "Uygunluk, uyum",
    "synonyms": [
        "compliance",
        "obedience",
        "acquiescence"
    ],
    "antonyms": [
        "nonconformity",
        "disobedience"
    ],
    "mnemonic": "Uyum için uğraşmak",
    "context": "The company's conformity to the new regulations was impressive."
},
{
    "id": "377",
    "word": "CONFRONT",
    "meaning": "Karşılamak, yüzleşmek",
    "synonyms": [
        "face",
        "meet",
        "encounter"
    ],
    "antonyms": [
        "avoid",
        "evade",
        "escape"
    ],
    "mnemonic": "Karşımda kim var?",
    "context": "She had to confront her fears in order to overcome them."
},
{
    "id": "378",
    "word": "CONFUSE",
    "meaning": "Şaşırtmak, karıştırmak",
    "synonyms": [
        "perplex",
        "puzzle",
        "bewilder"
    ],
    "antonyms": [
        "clarify",
        "explain",
        "enlighten"
    ],
    "mnemonic": "Şaşkın şekilde karışmak",
    "context": "The complex instructions confuse me, can you simplify them?"
},
{
    "id": "379",
    "word": "CONFUSING",
    "meaning": "Şaşırtıcı, karıştırcı",
    "synonyms": [
        "perplexing",
        "puzzling",
        "bewildering"
    ],
    "antonyms": [
        "clear",
        "obvious",
        "straightforward"
    ],
    "mnemonic": "Şaşırtan şeyleri karıştırmak",
    "context": "The confusing plot of the movie made it hard to follow."
},
{
    "id": "380",
    "word": "CONSECUTIVELY",
    "meaning": "Ardışık olarak, peş peşe",
    "synonyms": [
        "successively",
        "in succession",
        "one after another"
    ],
    "antonyms": [
        "randomly",
        "sporadically",
        "intermittently"
    ],
    "mnemonic": "Ardışık olarak sıralamak",
    "context": "The team won the games consecutively, setting a new record."
},
{
    "id": "381",
    "word": "CONSENTED",
    "meaning": "Kabul etmek, onaylamak",
    "synonyms": [
        "agreed",
        "acquiesced",
        "assented"
    ],
    "antonyms": [
        "refused",
        "denied",
        "disagreed"
    ],
    "mnemonic": "Onay vermek için kabul etmek",
    "context": "She consented to the proposal, and they got married."
},
{
    "id": "382",
    "word": "CONSENTS",
    "meaning": "Onaylar, kabul eder",
    "synonyms": [
        "agreements",
        "approvals",
        "permissions"
    ],
    "antonyms": [
        "refusals",
        "denials",
        "disagreements"
    ],
    "mnemonic": "Onaylar vermek için kabul etmek",
    "context": "The company obtained the necessary consents before proceeding."
},
{
    "id": "383",
    "word": "CONSEQUENCE",
    "meaning": "Sonuç, akıbet",
    "synonyms": [
        "result",
        "effect",
        "outcome"
    ],
    "antonyms": [
        "cause",
        "reason",
        "origin"
    ],
    "mnemonic": "Sonuç olarak ortaya çıkmak",
    "context": "The consequence of his actions was a serious injury."
},
{
    "id": "384",
    "word": "CONSEQUENCES",
    "meaning": "Sonuçlar, akıbetler",
    "synonyms": [
        "results",
        "effects",
        "outcomes"
    ],
    "antonyms": [
        "causes",
        "reasons",
        "origins"
    ],
    "mnemonic": "Sonuçlar olarak ortaya çıkmak",
    "context": "The consequences of climate change are far-reaching and devastating."
},
{
    "id": "385",
    "word": "CONSEQUENT",
    "meaning": "Sonuç olarak, akıbet olarak",
    "synonyms": [
        "resulting",
        "following",
        "ensuing"
    ],
    "antonyms": [
        "prior",
        "preceding",
        "antecedent"
    ],
    "mnemonic": "Sonuç olarak ortaya çıkmak",
    "context": "The consequent actions were a direct result of the decision."
},
{
    "id": "386",
    "word": "CONSEQUENTLY",
    "meaning": "Sonuç olarak, dolayısıyla",
    "synonyms": [
        "therefore",
        "thus",
        "hence"
    ],
    "antonyms": [
        "however",
        "on the other hand",
        "nevertheless"
    ],
    "mnemonic": "Sonuç olarak ortaya çıkmak",
    "context": "The company went bankrupt, and consequently, many people lost their jobs."
},
{
    "id": "387",
    "word": "CONSIDER",
    "meaning": "Düşünmek, dikkate almak",
    "synonyms": [
        "think",
        "reflect",
        "ponder"
    ],
    "antonyms": [
        "ignore",
        "disregard",
        "overlook"
    ],
    "mnemonic": "Düşünerek dikkate almak",
    "context": "I will consider your proposal and get back to you soon."
},
{
    "id": "388",
    "word": "CONSIDERABLE",
    "meaning": "Önemli, büyük",
    "synonyms": [
        "significant",
        "substantial",
        "notable"
    ],
    "antonyms": [
        "insignificant",
        "minor",
        "trivial"
    ],
    "mnemonic": "Önemli şeyleri dikkate almak",
    "context": "The company made a considerable profit last year."
},
{
    "id": "389",
    "word": "CONSIDERABLY",
    "meaning": "Önemli ölçüde, büyük oranda",
    "synonyms": [
        "significantly",
        "substantially",
        "notably"
    ],
    "antonyms": [
        "slightly",
        "marginally",
        "minimally"
    ],
    "mnemonic": "Önemli ölçüde düşünerek",
    "context": "The new policy has improved the situation considerably."
},
{
    "id": "390",
    "word": "CONSIDERATELY",
    "meaning": "Düşünceli bir şekilde, nazikçe",
    "synonyms": [
        "thoughtfully",
        "kindly",
        "considerately"
    ],
    "antonyms": [
        "thoughtlessly",
        "unkindly",
        "inconsiderately"
    ],
    "mnemonic": "Düşünceli şekilde dikkate almak",
    "context": "She spoke considerately to the child, trying not to scare him."
},
{
    "id": "391",
    "word": "CONSISTENT",
    "meaning": "Tutarluluk, tutarlılık",
    "synonyms": [
        "steady",
        "uniform",
        "reliable"
    ],
    "antonyms": [
        "inconsistent",
        "irregular"
    ],
    "mnemonic": "Tutarlılık, her zaman aynı",
    "context": "The company has shown consistent growth over the past five years."
},
{
    "id": "392",
    "word": "CONSISTENTLY",
    "meaning": "Sürekli, tutarlı bir şekilde",
    "synonyms": [
        "always",
        "constantly",
        "reliably"
    ],
    "antonyms": [
        "inconsistently",
        "irregularly"
    ],
    "mnemonic": "Her zaman aynı, tutarlılık önemlidir",
    "context": "She has consistently performed well in her exams."
},
{
    "id": "393",
    "word": "CONSTANT",
    "meaning": "Sürekli, değişmez",
    "synonyms": [
        "steady",
        "stable",
        "unchanging"
    ],
    "antonyms": [
        "variable",
        "changing"
    ],
    "mnemonic": "Değişmez, her zaman aynı",
    "context": "The constant noise from the traffic was disturbing."
},
{
    "id": "394",
    "word": "CONSTRAIN",
    "meaning": "Kısıtlamak, sınırlamak",
    "synonyms": [
        "limit",
        "restrict",
        "restrain"
    ],
    "antonyms": [
        "liberate",
        "free"
    ],
    "mnemonic": "Sınırlamak, kısıtlamak önemlidir",
    "context": "The new policy will constrain the company's ability to expand."
},
{
    "id": "395",
    "word": "CONSTRAINED",
    "meaning": "Kısıtlanmış, sınırlanmış",
    "synonyms": [
        "limited",
        "restricted",
        "restrained"
    ],
    "antonyms": [
        "unlimited",
        "unrestricted"
    ],
    "mnemonic": "Kısıtlı, sınırlı olanaklar",
    "context": "The constrained budget made it difficult to complete the project."
},
{
    "id": "396",
    "word": "CONSTRAINT",
    "meaning": "Kısıtlama, sınırlama",
    "synonyms": [
        "limitation",
        "restriction",
        "obstacle"
    ],
    "antonyms": [
        "opportunity",
        "freedom"
    ],
    "mnemonic": "Sınırlama, kısıtlama önemlidir",
    "context": "The constraint on resources hindered the team's progress."
},
{
    "id": "397",
    "word": "CONSTRAINTS",
    "meaning": "Kısıtlamalar, sınırlamalar",
    "synonyms": [
        "limitations",
        "restrictions",
        "obstacles"
    ],
    "antonyms": [
        "opportunities",
        "freedoms"
    ],
    "mnemonic": "Sınırlamalar, kısıtlamalar önemlidir",
    "context": "The company faced several constraints in the market."
},
{
    "id": "398",
    "word": "CONSTRUCTION",
    "meaning": "İnşaat, yapım",
    "synonyms": [
        "building",
        "creation",
        "development"
    ],
    "antonyms": [
        "destruction",
        "demolition"
    ],
    "mnemonic": "Yapım, inşaat önemlidir",
    "context": "The construction of the new skyscraper took several years."
},
{
    "id": "399",
    "word": "CONSTRUCTIVE",
    "meaning": "Yapıcı, oluşturucu",
    "synonyms": [
        "helpful",
        "positive",
        "creative"
    ],
    "antonyms": [
        "destructive",
        "negative"
    ],
    "mnemonic": "Yapıcı, oluşturucu önemlidir",
    "context": "The constructive feedback helped me improve my work."
},
{
    "id": "400",
    "word": "CONSULT",
    "meaning": "Danışmak, görüşmek",
    "synonyms": [
        "advise",
        "counsel",
        "discuss"
    ],
    "antonyms": [
        "ignore",
        "disregard"
    ],
    "mnemonic": "Danışmak, görüşmek önemlidir",
    "context": "I will consult with my lawyer before making a decision."
},
{
    "id": "401",
    "word": "CONSULTED",
    "meaning": "Danışılan, görüşülen",
    "synonyms": [
        "advised",
        "counseled",
        "discussed"
    ],
    "antonyms": [
        "ignored",
        "disregarded"
    ],
    "mnemonic": "Danışılan, görüşülen önemlidir",
    "context": "The doctor consulted with the patient before prescribing medication."
},
{
    "id": "402",
    "word": "CONSULTS",
    "meaning": "Danışır, görüşür",
    "synonyms": [
        "advises",
        "counsels",
        "discusses"
    ],
    "antonyms": [
        "ignores",
        "disregards"
    ],
    "mnemonic": "Danışır, görüşür önemlidir",
    "context": "The expert consults with companies on marketing strategies."
},
{
    "id": "403",
    "word": "CONSUME",
    "meaning": "Tüketmek, kullanmak",
    "synonyms": [
        "use",
        "expend",
        "devour"
    ],
    "antonyms": [
        "produce",
        "create"
    ],
    "mnemonic": "Tüketmek, kullanmak önemlidir",
    "context": "The company will consume a large amount of resources to complete the project."
},
{
    "id": "404",
    "word": "CONTAIN",
    "meaning": "İçermek, kapsamak",
    "synonyms": [
        "hold",
        "include",
        "enclose"
    ],
    "antonyms": [
        "exclude",
        "omit"
    ],
    "mnemonic": "İçermek, kapsamak önemlidir",
    "context": "The container will contain the hazardous materials."
},
{
    "id": "405",
    "word": "CONTAMINATION",
    "meaning": "Kirlenme, bulaşma",
    "synonyms": [
        "pollution",
        "infection",
        "taint"
    ],
    "antonyms": [
        "purity",
        "cleanliness"
    ],
    "mnemonic": "Kirlenme, bulaşma önemlidir",
    "context": "The contamination of the water supply was a major concern."
},
{
    "id": "406",
    "word": "CONTEND",
    "meaning": "İddia etmek, iddia etmek için çaba göstermek",
    "synonyms": [
        "argue",
        "claim",
        "assert"
    ],
    "antonyms": [
        "agree",
        "concede"
    ],
    "mnemonic": "İddialı olmak contention ile ilgili",
    "context": "The two teams will contend for the championship title."
},
{
    "id": "407",
    "word": "CONTENDS",
    "meaning": "İddia eder, iddia etmek için çaba gösterir",
    "synonyms": [
        "argues",
        "claims",
        "asserts"
    ],
    "antonyms": [
        "agrees",
        "concedes"
    ],
    "mnemonic": "İddialı olmak contention ile ilgili, çoğul",
    "context": "She contends that the new policy is unfair."
},
{
    "id": "408",
    "word": "CONTRADICT",
    "meaning": "Çelişmek, karşı çıkmak",
    "synonyms": [
        "oppose",
        "deny",
        "disagree"
    ],
    "antonyms": [
        "agree",
        "confirm"
    ],
    "mnemonic": "Karşıt olmak, çelişki ile ilgili",
    "context": "The witness's testimony contradicts the suspect's alibi."
},
{
    "id": "409",
    "word": "CONTRADICTED",
    "meaning": "Çeliştiği, karşı çıktığı",
    "synonyms": [
        "opposed",
        "denied",
        "disagreed"
    ],
    "antonyms": [
        "agreed",
        "confirmed"
    ],
    "mnemonic": "Karşıt olmak, çelişki ile ilgili, geçmiş zaman",
    "context": "The defendant's statement was contradicted by the prosecution's evidence."
},
{
    "id": "410",
    "word": "CONTRADICTION",
    "meaning": "Çelişki, karşıt olma",
    "synonyms": [
        "opposition",
        "disagreement",
        "inconsistency"
    ],
    "antonyms": [
        "agreement",
        "consistency"
    ],
    "mnemonic": "Karşıt olmak, çelişki ile ilgili, isim",
    "context": "The contradiction between the two statements was obvious."
},
{
    "id": "411",
    "word": "CONTRIBUTE",
    "meaning": "Katkıda bulunmak, yardım etmek",
    "synonyms": [
        "donate",
        "give",
        "support"
    ],
    "antonyms": [
        "hinder",
        "obstruct"
    ],
    "mnemonic": "Katkıda bulunmak, yardımda bulunmak",
    "context": "The charity organization will contribute to the disaster relief efforts."
},
{
    "id": "412",
    "word": "CONTRIBUTED",
    "meaning": "Katkıda bulunduğu, yardım ettiği",
    "synonyms": [
        "donated",
        "gave",
        "supported"
    ],
    "antonyms": [
        "hindered",
        "obstructed"
    ],
    "mnemonic": "Katkıda bulunmak, yardımda bulunmak, geçmiş zaman",
    "context": "The company has contributed to the local community for many years."
},
{
    "id": "413",
    "word": "CONTRIBUTION",
    "meaning": "Katkı, yardım",
    "synonyms": [
        "donation",
        "gift",
        "support"
    ],
    "antonyms": [
        "obstruction",
        "hindrance"
    ],
    "mnemonic": "Katkıda bulunmak, yardımda bulunmak, isim",
    "context": "The employee's contribution to the project was significant."
},
{
    "id": "414",
    "word": "CONTROL",
    "meaning": "Kontrol etmek, yönetmek",
    "synonyms": [
        "manage",
        "regulate",
        "govern"
    ],
    "antonyms": [
        "release",
        "abandon"
    ],
    "mnemonic": "Kontrol etmek, yönetmek, güç sahibi olmak",
    "context": "The government will control the flow of information to the public."
},
{
    "id": "415",
    "word": "CONTROVERSIAL",
    "meaning": "Tartışmalı, çelişkili",
    "synonyms": [
        "debated",
        "disputed",
        "polarizing"
    ],
    "antonyms": [
        "uncontroversial",
        "unanimous"
    ],
    "mnemonic": "Tartışmalı olmak, çelişki ile ilgili",
    "context": "The controversial issue has been debated by politicians and experts."
},
{
    "id": "416",
    "word": "CONTROVERSIALLY",
    "meaning": "Tartışmalı bir şekilde, çelişkili olarak",
    "synonyms": [
        "debatably",
        "disputably",
        "polarizingly"
    ],
    "antonyms": [
        "uncontroversially",
        "unanimously"
    ],
    "mnemonic": "Tartışmalı olmak, çelişki ile ilgili, zarf",
    "context": "The company has been acting controversially, sparking public outrage."
},
{
    "id": "417",
    "word": "CONTROVERSIES",
    "meaning": "Tartışmalar, çelişkiler",
    "synonyms": [
        "debates",
        "disputes",
        "polarizations"
    ],
    "antonyms": [
        "agreements",
        "unanimities"
    ],
    "mnemonic": "Tartışmalı olmak, çelişki ile ilgili, çoğul",
    "context": "The politician has been involved in several controversies throughout their career."
},
{
    "id": "418",
    "word": "CONTROVERSY",
    "meaning": "Tartışma, çelişki",
    "synonyms": [
        "debate",
        "dispute",
        "polarization"
    ],
    "antonyms": [
        "agreement",
        "unanimity"
    ],
    "mnemonic": "Tartışmalı olmak, çelişki ile ilgili, isim",
    "context": "The controversy surrounding the new policy has been ongoing for months."
},
{
    "id": "419",
    "word": "CONVENIENT",
    "meaning": "Rahat, uygun",
    "synonyms": [
        "easy",
        "handy",
        "accessible"
    ],
    "antonyms": [
        "inconvenient",
        "difficult"
    ],
    "mnemonic": "Rahat olmak, uygun olmak",
    "context": "The hotel's location was convenient for public transportation."
},
{
    "id": "420",
    "word": "CONVENIENTLY",
    "meaning": "Rahat bir şekilde, uygun olarak",
    "synonyms": [
        "easily",
        "handily",
        "accessibly"
    ],
    "antonyms": [
        "inconveniently",
        "with difficulty"
    ],
    "mnemonic": "Rahat olmak, uygun olmak, zarf",
    "context": "The store is conveniently located near my house."
}
];

// Note: To make this robust, eventually 3000 words will be added, 
// but this sample 50 provides the structure required for the lab features.
