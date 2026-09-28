import type { EvidenceCard, KnowledgeChunk, ResearchSource } from "@/lib/types";

// ─────────────────────────────────────────────────────────────
// Seed research sources — all real, publicly accessible references.
// Citations are stored with full metadata; never fabricate.
// ─────────────────────────────────────────────────────────────

export const seedSources: ResearchSource[] = [
  {
    id: "src-who-pa-2020",
    sourceKey: "who-pa-2020",
    title: "WHO Guidelines on Physical Activity and Sedentary Behaviour",
    author: "World Health Organization",
    publicationDate: "2020-11-25",
    sourceType: "who",
    url: "https://www.who.int/publications/i/item/9789240015128",
    evidenceLevel: "meta-analysis",
    population: "Adults and older adults, global",
    context: "Global public-health guidance on weekly activity volumes",
    retrievedAt: "2026-09-01",
  },
  {
    id: "src-holt-lunstad-2010",
    sourceKey: "holt-lunstad-2010",
    title: "Social Relationships and Mortality Risk: A Meta-analytic Review",
    author: "Holt-Lunstad J, Smith TB, Layton JB",
    publicationDate: "2010-07-27",
    sourceType: "peer-reviewed",
    url: "https://doi.org/10.1371/journal.pmed.1000316",
    evidenceLevel: "meta-analysis",
    population: "308,849 participants, average 7.5 years follow-up",
    context: "Meta-analysis of social relationship quality and all-cause mortality",
    retrievedAt: "2026-09-01",
  },
  {
    id: "src-saint-maurice-2020",
    sourceKey: "saint-maurice-2020",
    title: "Association of Daily Step Count and Step Intensity With Mortality Among US Adults",
    author: "Saint-Maurice PF, Troiano RP, Berrigan D, et al.",
    publicationDate: "2020-03-24",
    sourceType: "peer-reviewed",
    url: "https://doi.org/10.1001/jama.2020.1382",
    evidenceLevel: "cohort",
    population: "4,840 US adults aged 40+, NHANES 2003–2006 with mortality linkage",
    context: "Objective accelerometer-measured steps vs all-cause mortality",
    retrievedAt: "2026-09-01",
  },
  {
    id: "src-cappuccio-2010",
    sourceKey: "cappuccio-2010",
    title: "Sleep Duration and All-Cause Mortality: A Systematic Review and Meta-analysis",
    author: "Cappuccio FP, D'Elia L, Strazzullo P, Miller MA",
    publicationDate: "2010-05-01",
    sourceType: "peer-reviewed",
    url: "https://doi.org/10.1093/sleep/33.5.585",
    evidenceLevel: "meta-analysis",
    population: "1,382,999 participants across 16 prospective studies",
    context: "Association of self-reported sleep duration with all-cause mortality",
    retrievedAt: "2026-09-01",
  },
  {
    id: "src-decabo-mattson-2019",
    sourceKey: "decabo-mattson-2019",
    title: "Effects of Intermittent Fasting on Health, Aging, and Disease",
    author: "de Cabo R, Mattson MP",
    publicationDate: "2019-12-26",
    sourceType: "peer-reviewed",
    url: "https://doi.org/10.1056/NEJMra1905136",
    evidenceLevel: "mechanistic",
    population: "Animal models and emerging human trials",
    context: "Review of intermittent-fasting physiology and human evidence to date",
    retrievedAt: "2026-09-01",
  },
  {
    id: "src-momma-2022",
    sourceKey: "momma-2022",
    title: "Muscle-strengthening Activities Are Associated with Lower Risk of Mortality: A Systematic Review and Meta-analysis of Observational Studies",
    author: "Momma H, Kawakami R, Honda T, Sawada SS",
    publicationDate: "2022-02-28",
    sourceType: "peer-reviewed",
    url: "https://doi.org/10.1136/bjsports-2021-103924",
    evidenceLevel: "meta-analysis",
    population: "16 prospective cohorts, 479,856 participants",
    context: "Dose–response of weekly muscle-strengthening activity vs mortality and major disease",
    retrievedAt: "2026-09-01",
  },
  {
    id: "src-bauer-2013",
    sourceKey: "bauer-2013",
    title: "Evidence-based Recommendations for Optimal Dietary Protein Intake in Older People: The PROT-AGE Study Group",
    author: "Bauer J, Biolo G, Cederholm T, et al.",
    publicationDate: "2013-08-01",
    sourceType: "peer-reviewed",
    url: "https://doi.org/10.1016/j.jamda.2013.05.021",
    evidenceLevel: "expert-opinion",
    population: "Older adults; consensus of the PROT-AGE Study Group",
    context: "Expert consensus on protein intake to preserve muscle with age",
    retrievedAt: "2026-09-01",
  },
  {
    id: "src-goyal-2014",
    sourceKey: "goyal-2014",
    title: "Meditation Programs for Psychological Stress and Well-being: A Systematic Review and Meta-analysis",
    author: "Goyal M, Singh S, Sibinga EMS, et al.",
    publicationDate: "2014-03-01",
    sourceType: "peer-reviewed",
    url: "https://doi.org/10.1001/jamainternmed.2013.13036",
    evidenceLevel: "meta-analysis",
    population: "47 trials, 3,515 participants",
    context: "Clinical evidence for mindfulness and other meditation programs",
    retrievedAt: "2026-09-01",
  },
  {
    id: "src-poole-2017",
    sourceKey: "poole-2017",
    title: "Coffee Consumption and Health: Umbrella Review of Meta-analyses of Multiple Health Outcomes",
    author: "Poole R, Kennedy OJ, Roderick P, et al.",
    publicationDate: "2017-11-22",
    sourceType: "peer-reviewed",
    url: "https://doi.org/10.1136/bmj.j5024",
    evidenceLevel: "meta-analysis",
    population: "201 meta-analyses of observational research; 17 meta-analyses of trials",
    context: "Umbrella review of coffee intake across health outcomes",
    retrievedAt: "2026-09-01",
  },
  {
    id: "src-uspstf-2022",
    sourceKey: "uspstf-2022",
    title: "Vitamin, Mineral, and Multivitamin Supplementation to Prevent Cardiovascular Disease and Cancer: US Preventive Services Task Force Recommendation Statement",
    author: "US Preventive Services Task Force",
    publicationDate: "2022-06-21",
    sourceType: "government",
    url: "https://doi.org/10.1001/jama.2022.8097",
    evidenceLevel: "expert-opinion",
    population: "Non-pregnant adults without nutritional deficiencies",
    context: "Evidence review behind the recommendation on routine supplementation",
    retrievedAt: "2026-09-01",
  },
];

// ─────────────────────────────────────────────────────────────
// Evidence cards — one per longevity question (10).
// ─────────────────────────────────────────────────────────────

export const seedEvidenceCards: EvidenceCard[] = [
  {
    id: "ev-fasting-longevity",
    question: "Does fasting improve longevity?",
    shortAnswer:
      "Fasting reliably improves several metabolic markers in animals, and small human trials show weight and insulin improvements — but no study has yet shown that intermittent fasting extends human lifespan.",
    evidenceStrength: "mixed",
    whatStudiesShow:
      "In rodents, various intermittent-fasting regimens extend lifespan under some conditions. In humans, trials of time-restricted eating and 5:2 patterns show modest weight loss and improved insulin sensitivity, broadly comparable to ordinary calorie restriction. Large, decades-long human outcome trials do not exist.",
    whatRemainsUncertain:
      "Whether fasting offers benefits beyond calorie restriction itself, the ideal eating window, long-term effects in older adults, and effects on muscle mass when protein intake is not carefully managed.",
    populationContext:
      "Most animal findings do not transfer directly to humans. Human trials are typically 8–12 months, in adults with overweight or metabolic risk factors, not in healthy older adults.",
    potentialBenefits: [
      "Weight and visceral-fat reduction for some people",
      "Improved insulin sensitivity in trials of adults with metabolic risk",
      "A simple structure that some people find easier than daily calorie counting",
    ],
    potentialRisks: [
      "Under-eating protein or micronutrients if the eating window is poorly planned",
      "Low energy, headaches, and irritability during adaptation",
      "Not appropriate without professional guidance for people with a history of disordered eating, pregnancy, or certain medical conditions",
    ],
    expertPerspectives: [
      "DEMO · Dr. Sofia Reyes (fictional): favours a food-quality-first approach; treats fasting windows as one optional structure, not a requirement.",
      "DEMO · Dr. Amara Lian (fictional): cautions against very late eating windows that compress sleep.",
    ],
    sourceKeys: ["decabo-mattson-2019"],
    tags: ["fasting", "nutrition", "metabolic", "time-restricted-eating"],
  },
  {
    id: "ev-sleep-duration",
    question: "How much sleep do I need for healthy ageing?",
    shortAnswer:
      "Large meta-analytic evidence links short sleep (typically under ~6 hours) to higher all-cause mortality, while long sleep (over ~9 hours) also shows elevated risk — 7–9 hours remains the practical target for most adults.",
    evidenceStrength: "strong",
    whatStudiesShow:
      "A 2010 meta-analysis of 16 prospective cohorts (1.38 million participants) found higher all-cause mortality among both short and long sleepers, with the lowest risk around 7–8 hours. Consistency of sleep timing is increasingly recognised as independently important.",
    whatRemainsUncertain:
      "Causality is hard to prove: illness can both shorten and lengthen sleep. Optimal duration varies by individual, and objective vs self-reported duration can differ.",
    populationContext:
      "General adult populations across multiple countries; older adults may fragment sleep but still benefit from adequate total sleep.",
    potentialBenefits: [
      "Better daytime alertness, mood, and training recovery",
      "Aligned with the lowest observed mortality risk band",
      "Supports appetite regulation and glucose handling",
    ],
    potentialRisks: [
      "Chasing a rigid number can itself create sleep anxiety",
      "Persistent severe insomnia warrants professional evaluation rather than self-experimentation",
    ],
    expertPerspectives: [
      "DEMO · Dr. Amara Lian (fictional): prioritises a consistent wake time and a wind-down buffer over perfect duration numbers.",
    ],
    sourceKeys: ["cappuccio-2010"],
    tags: ["sleep", "restoration", "recovery"],
  },
  {
    id: "ev-strength-healthspan",
    question: "Does strength training extend healthspan?",
    shortAnswer:
      "Meta-analyses of large prospective cohorts associate 30–60 minutes per week of muscle-strengthening activity with meaningfully lower all-cause mortality — roughly a 10–20% risk reduction versus doing none.",
    evidenceStrength: "strong",
    whatStudiesShow:
      "A 2022 meta-analysis of 16 cohorts (n≈479,856) found muscle-strengthening activity was associated with lower all-cause mortality, with the clearest signal around 30–60 min/week; combining it with aerobic activity appeared best. WHO 2020 guidance recommends muscle-strengthening at least 2 days/week for adults.",
    whatRemainsUncertain:
      "Observational data cannot fully exclude reverse causation (healthier people train more). Optimal programming by age and training history is individual.",
    populationContext:
      "General adult populations; benefits extend to older adults, where preserving muscle is a core healthy-ageing strategy.",
    potentialBenefits: [
      "Preserves muscle mass, strength, and function with age",
      "Supports bone density and metabolic health",
      "Associated with lower mortality in cohort data",
    ],
    potentialRisks: [
      "Injury risk from load or technique errors — progress gradually",
      "New to training or returning from illness? Get clearance from a qualified professional",
    ],
    expertPerspectives: [
      "DEMO · Dr. Marcus Adeyemi (fictional): two full-body sessions weekly is the highest-leverage habit for most adults 35+.",
    ],
    sourceKeys: ["momma-2022", "who-pa-2020"],
    tags: ["strength", "exercise", "movement", "muscle"],
  },
  {
    id: "ev-steps-mortality",
    question: "How many steps a day are associated with lower mortality?",
    shortAnswer:
      "In a large objectively measured cohort, mortality risk fell progressively up to about 8,000–12,000 steps/day, with most of the gain realised well before 10,000 — no magic threshold, but higher is generally better up to a point.",
    evidenceStrength: "strong",
    whatStudiesShow:
      "Saint-Maurice et al. (JAMA 2020) followed 4,840 US adults with accelerometers; compared with 4,000 steps/day, 8,000 steps/day was associated with a 51% lower all-cause mortality risk. Intensity added a smaller, additional association.",
    whatRemainsUncertain:
      "Causality and the exact shape of the curve for very high step counts; younger cohorts and non-US populations are less represented.",
    populationContext:
      "US adults aged 40+; habitual activity patterns in free-living conditions.",
    potentialBenefits: [
      "Free, low-injury-risk daily movement",
      "Associated with lower all-cause mortality in dose–response fashion",
      "Practical, measurable daily target",
    ],
    potentialRisks: [
      "Minimal for most; increase gradually if coming from a low base",
    ],
    expertPerspectives: [
      "DEMO · Coach Nadia Rahman (fictional): anchor daily walks to existing routines — the step count takes care of itself.",
    ],
    sourceKeys: ["saint-maurice-2020", "who-pa-2020"],
    tags: ["walking", "steps", "movement", "daily activity"],
  },
  {
    id: "ev-meditation-stress",
    question: "Does meditation reduce stress and support healthy ageing?",
    shortAnswer:
      "Mindfulness programs produce small-to-moderate improvements in anxiety, depression, and stress versus active controls; the evidence for direct effects on biological ageing markers is far weaker.",
    evidenceStrength: "moderate",
    whatStudiesShow:
      "A 2014 JAMA Internal Medicine meta-analysis (47 trials, 3,515 participants) found moderate evidence for improved anxiety, depression, and pain with mindfulness meditation programs. Effects on stress were positive but smaller.",
    whatRemainsUncertain:
      "Long-term adherence, which populations benefit most, effects on telomere/biomarker ageing trajectories, and how practice dose maps to benefit.",
    populationContext:
      "Mostly adults in clinical or community settings with 8-week structured programs (e.g., MBSR-style).",
    potentialBenefits: [
      "Reduced perceived stress and anxiety symptoms",
      "Improved attention and emotional regulation for many practitioners",
      "No equipment or cost",
    ],
    potentialRisks: [
      "Minimal; occasional discomfort when sitting with difficult thoughts",
      "Not a substitute for professional mental-health care where needed",
    ],
    expertPerspectives: [
      "DEMO · Dr. Kenji Watanabe (fictional): consistency beats duration — 8 minutes daily outperforms an hour occasionally.",
    ],
    sourceKeys: ["goyal-2014"],
    tags: ["meditation", "stress", "mind", "mindfulness"],
  },
  {
    id: "ev-protein-older-adults",
    question: "How much protein do adults need as they age?",
    shortAnswer:
      "Expert consensus for older adults recommends roughly 1.0–1.2 g/kg/day — above the basic RDA of 0.8 g/kg — to help preserve muscle, ideally spread across meals and combined with resistance activity.",
    evidenceStrength: "moderate",
    whatStudiesShow:
      "The PROT-AGE consensus group recommends ~1.0–1.2 g/kg/day for most older adults and higher for those doing resistance training or recovering from illness. For adults 35–65, general guidance remains around the RDA with attention to distribution.",
    whatRemainsUncertain:
      "Exact optimal intake varies with kidney function, training load, and total energy intake; individual needs differ.",
    populationContext:
      "Older adults and adults reducing total calories; people with kidney disease need professional guidance.",
    potentialBenefits: [
      "Supports muscle preservation alongside strength training",
      "Improves satiety when losing weight",
    ],
    potentialRisks: [
      "Very high intakes displace other foods",
      "Kidney conditions require individualised medical advice",
    ],
    expertPerspectives: [
      "DEMO · Dr. Sofia Reyes (fictional): a palm-sized protein portion at each meal is the simplest robust pattern.",
    ],
    sourceKeys: ["bauer-2013"],
    tags: ["protein", "nutrition", "muscle", "ageing"],
  },
  {
    id: "ev-coffee-health",
    question: "Is coffee good or bad for longevity?",
    shortAnswer:
      "Umbrella-review evidence associates moderate coffee intake (about 3–4 cups/day) with lower all-cause mortality on average, but causation is unproven and individual tolerance varies.",
    evidenceStrength: "moderate",
    whatStudiesShow:
      "The 2017 BMJ umbrella review found coffee consumption was generally associated with benefit or neutrality across mortality, cardiovascular, and some cancer outcomes, with harm signals limited to high intakes in pregnancy and elevated risk in some subgroups.",
    whatRemainsUncertain:
      "Confounding by lifestyle and smoking status; effects of added sugar/creamer; optimal intake for caffeine-sensitive individuals.",
    populationContext:
      "Mostly observational cohorts in Western and Japanese populations.",
    potentialBenefits: [
      "Alertness and enjoyment",
      "Associated (observationally) with lower risk of several chronic outcomes",
    ],
    potentialRisks: [
      "Sleep disruption — especially within ~8 hours of bedtime",
      "Anxiety and palpitations in sensitive individuals",
      "Sweetened coffee drinks can carry significant sugar load",
    ],
    expertPerspectives: [
      "DEMO · Dr. Amara Lian (fictional): set a personal caffeine cut-off; late coffee is the most common hidden sleep saboteur.",
    ],
    sourceKeys: ["poole-2017"],
    tags: ["coffee", "caffeine", "nutrition"],
  },
  {
    id: "ev-social-connection",
    question: "Can social connection really affect mortality risk?",
    shortAnswer:
      "Yes — a landmark meta-analysis found people with stronger social relationships had a 50% higher odds of survival over an average follow-up, an effect size comparable to well-known behavioural risk factors.",
    evidenceStrength: "strong",
    whatStudiesShow:
      "Holt-Lunstad et al. (PLoS Medicine 2010) pooled 148 studies (308,849 participants); the survival odds advantage for people with robust social ties was 1.5, and held across age, sex, and health status.",
    whatRemainsUncertain:
      "Which mechanisms matter most (support, stress buffering, behaviour), and whether interventions can reliably manufacture the benefit.",
    populationContext:
      "Broad general populations across multiple countries and average 7.5 years follow-up.",
    potentialBenefits: [
      "One of the strongest behavioural correlates of survival",
      "Supports adherence to every other healthy habit",
    ],
    potentialRisks: [
      "Low-quality or isolating relationships can harm; quality matters more than quantity",
    ],
    expertPerspectives: [
      "DEMO · Dr. Kenji Watanabe (fictional): schedule connection like training — recurring, protected, in-person where possible.",
    ],
    sourceKeys: ["holt-lunstad-2010"],
    tags: ["connection", "community", "social", "purpose"],
  },
  {
    id: "ev-supplements-longevity",
    question: "Do multivitamins or supplements extend lifespan?",
    shortAnswer:
      "For generally healthy, non-deficient adults, the USPSTF concludes evidence is insufficient to say multivitamins prevent cardiovascular disease or cancer — food-first remains the defensible default.",
    evidenceStrength: "mixed",
    whatStudiesShow:
      "The 2022 USPSTF recommendation statement found insufficient evidence for multivitamin benefit in preventing major outcomes in healthy non-pregnant adults, and beta-carotene showed possible harm (lung cancer risk in smokers).",
    whatRemainsUncertain:
      "Effects in people with actual deficiencies, optimal formulations, and long-term use patterns; targeted supplementation for documented deficiencies is different and medically guided.",
    populationContext:
      "Non-pregnant adults without known nutritional deficiencies.",
    potentialBenefits: [
      "May help close gaps in restrictive diets (professionally assessed)",
    ],
    potentialRisks: [
      "Cost and false reassurance displacing higher-value habits",
      "Some supplements interact with medications or carry harm at high doses",
    ],
    expertPerspectives: [
      "DEMO · Dr. Sofia Reyes (fictional): audit the diet before the supplement shelf.",
    ],
    sourceKeys: ["uspstf-2022"],
    tags: ["supplements", "multivitamin", "nutrition"],
  },
  {
    id: "ev-mobility-flexibility",
    question: "Does mobility work matter for healthy ageing?",
    shortAnswer:
      "Direct lifespan evidence for stretching/flexibility work is limited, but maintaining range of motion clearly supports function, balance, and injury resilience — all central to staying capable with age.",
    evidenceStrength: "emerging",
    whatStudiesShow:
      "WHO guidance emphasises multicomponent activity — including balance and flexibility elements — for older adults to preserve functional capacity. Direct trials linking flexibility training to mortality are scarce.",
    whatRemainsUncertain:
      "How much dedicated mobility work is needed versus integrated movement; measurement of 'mobility quality' varies across studies.",
    populationContext:
      "Older adults and sedentary populations show the clearest functional gains.",
    potentialBenefits: [
      "Easier daily movement and fewer movement restrictions",
      "Complements strength work and may reduce injury risk",
      "Tai chi/qigong-style practice also trains balance",
    ],
    potentialRisks: [
      "Over-aggressive stretching can strain tissue; keep it gentle and progressive",
    ],
    expertPerspectives: [
      "DEMO · Coach Nadia Rahman (fictional): earn range through strength — loaded mobility lasts longer than passive stretching alone.",
    ],
    sourceKeys: ["who-pa-2020"],
    tags: ["mobility", "flexibility", "balance", "movement"],
  },
];

// ─────────────────────────────────────────────────────────────
// Knowledge chunks — retrieval units for the demo RAG.
// Every chunk retains full source metadata per the RAG contract.
// ─────────────────────────────────────────────────────────────

function chunk(s: ResearchSource, chunkIndex: number, claim: string, content: string, tags: string[]): KnowledgeChunk {
  return {
    sourceId: s.id,
    chunkIndex,
    title: s.title,
    author: s.author,
    publicationDate: s.publicationDate,
    sourceType: s.sourceType,
    url: s.url,
    claim,
    evidenceLevel: s.evidenceLevel,
    population: s.population,
    context: s.context,
    content,
    tags,
  };
}

export const seedChunks: KnowledgeChunk[] = [
  chunk(seedSources[0], 0,
    "Adults should do at least 150–300 min moderate or 75–150 min vigorous aerobic activity weekly, plus muscle-strengthening on 2+ days.",
    "WHO recommends adults accumulate 150–300 minutes of moderate-intensity, or 75–150 minutes of vigorous-intensity, aerobic physical activity per week, and perform muscle-strengthening activity on two or more days. For older adults, multicomponent activity emphasising balance and functional training is additionally recommended.",
    ["exercise", "guidelines", "aerobic", "strength", "older adults"]),
  chunk(seedSources[0], 1,
    "Older adults benefit from multicomponent activity including balance and flexibility elements.",
    "For adults 65+, WHO advises varied multicomponent physical activity that emphasises functional balance and strength three or more days a week, to enhance functional capacity and reduce falls. Flexibility and mobility elements support daily function even where direct mortality evidence is limited.",
    ["mobility", "balance", "older adults", "guidelines", "function"]),

  chunk(seedSources[1], 0,
    "People with stronger social relationships have 50% higher odds of survival over average 7.5-year follow-up.",
    "Across 148 studies (308,849 participants), individuals with adequate social relationships had a 50% greater likelihood of survival, comparable in magnitude to quitting smoking and exceeding many established mortality risk factors. The association held across age, sex, initial health status, and cause of death.",
    ["connection", "social", "mortality", "community", "relationships"]),
  chunk(seedSources[1], 1,
    "Social connection quality matters as much as or more than quantity.",
    "The meta-analysis distinguishes structural (network size), functional (perceived support), and combined measures of social relationships; functional measures such as perceived support showed strong protective associations. Loneliness and isolation are distinct risks and both matter.",
    ["connection", "loneliness", "social", "support"]),

  chunk(seedSources[2], 0,
    "Compared with 4,000 steps/day, 8,000 steps/day was associated with 51% lower all-cause mortality.",
    "In 4,840 US adults aged 40+ wearing accelerometers, all-cause mortality declined progressively with step volume up to roughly 8,000–12,000 steps/day; 8,000 steps/day versus 4,000 was associated with a 51% lower risk. Step intensity contributed a smaller additional association after adjusting for volume.",
    ["steps", "walking", "mortality", "movement", "daily activity"]),
  chunk(seedSources[2], 1,
    "Most mortality benefit accrues below 10,000 steps/day.",
    "The dose–response curve steepens early: risk reductions from raising daily steps are proportionally largest in the 4,000–8,000 range, making modest daily increases meaningful even for currently low-activity adults.",
    ["steps", "walking", "dose-response", "sedentary"]),

  chunk(seedSources[3], 0,
    "Both short (<6 h) and long (>9 h) sleep duration are associated with higher all-cause mortality.",
    "A systematic review and meta-analysis of 16 prospective cohorts (1,382,999 participants) found elevated all-cause mortality risk among short sleepers (relative risk ≈1.12) and long sleepers (≈1.30) compared with the reference 7–8 hour band.",
    ["sleep", "duration", "mortality", "recovery"]),
  chunk(seedSources[3], 1,
    "Sleep regularity and quality, not just duration, matter for health.",
    "Beyond total hours, fragmented sleep and irregular timing are associated with worse cardiometabolic profiles. A consistent wake time and an adequate wind-down window are the highest-leverage behavioural levers identified in sleep-hygiene literature.",
    ["sleep", "regularity", "hygiene", "circadian"]),

  chunk(seedSources[4], 0,
    "Intermittent fasting improves metabolic markers in animals; human lifespan evidence is not yet established.",
    "In rodents, intermittent-fasting regimens can extend lifespan and improve metabolic health. Human trials of time-restricted eating and periodic fasting show modest improvements in weight, insulin sensitivity, and some cardiovascular markers, generally comparable to continuous calorie restriction. Long-term randomised trials with mortality endpoints in humans do not exist.",
    ["fasting", "metabolic", "longevity", "nutrition", "time-restricted-eating"]),
  chunk(seedSources[4], 1,
    "Fasting benefits depend on the quality and adequacy of the eating window.",
    "Reviews caution that compressed eating windows can underdeliver protein and micronutrients, particularly for older adults and highly active people, and that very late eating windows may impair sleep. Individual medical context matters.",
    ["fasting", "protein", "nutrition", "risks"]),

  chunk(seedSources[5], 0,
    "30–60 minutes/week of muscle-strengthening activity is associated with ~10–20% lower all-cause mortality.",
    "Pooled analysis of 16 prospective cohorts (479,856 participants) found muscle-strengthening activity was associated with lower all-cause mortality, with an inverted-J dose–response peaking around 30–60 minutes per week. Combined with aerobic activity, associations were stronger than either alone.",
    ["strength", "resistance", "mortality", "exercise", "muscle"]),
  chunk(seedSources[5], 1,
    "Muscle-strengthening work is also associated with lower diabetes and cardiovascular risk.",
    "The same meta-analysis reported associations between muscle-strengthening activity and lower risk of diabetes, cardiovascular disease, and cancer mortality, supporting resistance work as a core longevity behaviour rather than an aesthetic choice.",
    ["strength", "diabetes", "cardiovascular", "healthspan"]),

  chunk(seedSources[6], 0,
    "Older adults are advised ~1.0–1.2 g protein/kg/day, spread across meals.",
    "The PROT-AGE consensus group recommends 1.0–1.2 g/kg/day protein for most older adults, higher (≈1.2–1.5) for those doing resistance training or recovering from acute illness, with 25–30 g of high-quality protein per meal to support muscle protein synthesis.",
    ["protein", "nutrition", "muscle", "older adults"]),
  chunk(seedSources[6], 1,
    "Protein needs rise with training load and during weight loss.",
    "Consensus guidance notes that energy restriction and inactivity both accelerate muscle loss; adequate protein plus resistance exercise is the countermeasure. Individuals with kidney disease require professional individualisation.",
    ["protein", "weight loss", "resistance", "sarcopenia"]),

  chunk(seedSources[7], 0,
    "Mindfulness meditation programs show small-to-moderate improvements in anxiety, depression, and pain.",
    "A meta-analysis of 47 randomised trials (3,515 participants) found moderate evidence that mindfulness meditation programs improve anxiety, depression, and pain versus active controls, with smaller effects on stress. Evidence quality was graded modest, and effects varied between programs.",
    ["meditation", "mindfulness", "stress", "anxiety", "mind"]),
  chunk(seedSources[7], 1,
    "Meditation evidence does not yet establish direct biological-ageing effects.",
    "The clinical-trial evidence base concerns psychological outcomes; claims that meditation lengthens lifespan or reverses biological ageing are extrapolations beyond current trial evidence and should be treated as uncertain.",
    ["meditation", "ageing", "uncertainty", "evidence"]),

  chunk(seedSources[8], 0,
    "Moderate coffee intake (3–4 cups/day) is associated with lower all-cause mortality in observational data.",
    "An umbrella review of 201 meta-analyses found coffee consumption was generally associated with benefit or neutrality across mortality and major disease outcomes, with the largest benefit seen around 3–4 cups/day; harm signals concentrated in high intake during pregnancy.",
    ["coffee", "caffeine", "mortality", "nutrition"]),
  chunk(seedSources[8], 1,
    "Coffee timing affects sleep; late caffeine is a common sleep disruptor.",
    "Caffeine has a half-life of roughly 5–6 hours; afternoon intake measurably reduces sleep quality in controlled studies. Individual sensitivity varies widely, so a personal cut-off time is a practical experiment.",
    ["caffeine", "sleep", "timing", "experiment"]),

  chunk(seedSources[9], 0,
    "Evidence is insufficient that multivitamins prevent cardiovascular disease or cancer in healthy adults.",
    "The USPSTF found insufficient evidence to assess balance of benefits and harms of multivitamin supplementation for preventing cardiovascular disease and cancer in healthy non-pregnant adults, and recommended against beta-carotene supplementation (possible lung-cancer harm in smokers).",
    ["supplements", "multivitamin", "prevention", "evidence"]),
  chunk(seedSources[9], 1,
    "Food-first remains the default; targeted supplementation addresses documented deficiencies.",
    "The recommendation statement applies to generally healthy, non-deficient adults. Where a deficiency is documented, targeted supplementation under professional guidance is a different scenario from routine preventive multivitamin use.",
    ["supplements", "deficiency", "nutrition", "food-first"]),
];
