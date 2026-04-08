export interface MassProcess {
    img: string;
    label: string;
}

export interface Project {
    id: string;
    name: string;
    nameEn: string;
    location: string;
    area: string;
    usage: string;
    conceptKo: string;
    conceptEn: string;
    shortDesc: string;
    description: string;
    tags: string[];
    mainImg: string;
    galleryImgs: string[];
    processImg: string;
    processDescriptions: string[];
    massProcess: MassProcess[];
}

export const projects: Project[] = [
    {
        id: "gongdabang",
        name: "공 다 방",
        nameEn: "GONGDABANG",
        location: "충남 공주시 백미고을길 5-31",
        area: "200㎡",
        usage: "카페",
        conceptKo: "차경",
        conceptEn: "Borrowed Scenery",
        shortDesc: "공산성 풍경을 차경으로 끌어들인 카페",
        description: "공다방은 공산성의 풍경을 차경으로 끌어들이는 카페입니다.\n외부 풍경을 공간의 일부로 받아들이는 계획을 통해 내부와 외부의 경계를 자연스럽게 열고, 풍경과 함께 사색의 시간을 경험할 수 있는 카페 공간으로 계획했습니다.",
        tags: ["공주 인기매장", "7년차 매장", "SNS 바이럴"],
        mainImg: "/fnb/images/compressed/project/gongdabang/2.webp",
        galleryImgs: [
            "/fnb/images/compressed/project/gongdabang/1.webp",
            "/fnb/images/compressed/project/gongdabang/2.webp",
            "/fnb/images/compressed/project/gongdabang/3.webp",
            "/fnb/images/compressed/project/gongdabang/4.webp",
            "/fnb/images/compressed/project/gongdabang/5.webp",
        ],
        processImg: "/fnb/images/compressed/project/gongdabang/process.webp",
        processDescriptions: [
            "낡고 오래된 경계벽이 만들어 내는 시각적 답답함",
            "기존 경계벽을 철거해 시각적 개방감 확보",
            "3면의 개방을 통한 공간의 확장성",
            "경계를 열어 주변 풍경까지 공간의 일부로 만듦"
        ],
        massProcess: [],
    },
    {
        id: "ba",
        name: "B A(Break Away)",
        nameEn: "BA (Break Away)",
        location: "고양시 덕양구 청초로 10  C동144,145호",
        area: "330㎡",
        usage: "브런치 카페",
        conceptKo: "비밀의 숲",
        conceptEn: "Secret Forest",
        shortDesc: "자연광의 변화를 공간에 담아낸 카페",
        description: "BA는 일상의 평범함 속에서 잠시 벗어나는 시간을 제안하는 카페입니다.\n도심 속 작은 숲을 모티브로 자연의 빛과 기하학적 공간 구성을 통해 감성적인 휴식의 경험을 담았습니다.\n사면으로 들어오는 자연광의 빛의 변화에 따라 다양한 분위기를 경험할 수 있는 공간을 계획했습니다.",
        tags: ["덕은동 인기매장", "오픈 3개월 내 안정화", "SNS 바이럴"],
        mainImg: "/fnb/images/compressed/project/ba/1.webp",
        galleryImgs: [
            "/fnb/images/compressed/project/ba/1.webp",
            "/fnb/images/compressed/project/ba/2.webp",
            "/fnb/images/compressed/project/ba/3.webp",
            "/fnb/images/compressed/project/ba/4.webp",
            "/fnb/images/compressed/project/ba/5.webp",
            "/fnb/images/compressed/project/ba/6.webp",
            "/fnb/images/compressed/project/ba/7.webp",
        ],
        processImg: "/fnb/images/compressed/project/ba/process.webp",
        processDescriptions: [
            "반투명 물성을 이용한 시간에 따른 빛의 유입과 실루엣 효과",
            "전이공간을 통한 사용자의 시퀀스 경험",
            "바닥 레벨을 이용한 홀 구성으로 사용자의 다양한 경험 유도",
            "자연 빛의 의도를 표현한 천장 디자인"
        ],
        massProcess: [],
    },
    {
        id: "dowon",
        name: "도원 스타일",
        nameEn: "DOWON STYLE",
        location: "서울시 영등포구 여의대로 108 더현대서울 6층",
        area: "250㎡",
        usage: "중식 레스토랑",
        conceptKo: "낙원",
        conceptEn: "Paradise",
        shortDesc: "복숭아꽃 낙원을 모티브로 한 레스토랑",
        description: "도원 스타일은 삼국지의 '도원결의'의 장소 복숭아 꽃밭을 공간의 모티브로 '낙원' 컨셉으로 전개되었습니다. 입구부터 이어지는 동선을 따라 고객이 낙원으로 향하듯 브랜드를 자연스럽게 경험하도록 설계하였습니다.",
        tags: ["더현대 인기 매장", "6년차 매장", "현재 컨셉 타 매장 리뉴얼 확산중"],
        mainImg: "/fnb/images/compressed/project/dowon/1.webp",
        galleryImgs: [
            "/fnb/images/compressed/project/dowon/1.webp",
            "/fnb/images/compressed/project/dowon/2.webp",
            "/fnb/images/compressed/project/dowon/3.webp",
            "/fnb/images/compressed/project/dowon/4.webp",
            "/fnb/images/compressed/project/dowon/5.webp",
            "/fnb/images/compressed/project/dowon/6.webp",
            "/fnb/images/compressed/project/dowon/7.webp",
        ],
        processImg: "/fnb/images/compressed/project/dowon/process.webp",
        processDescriptions: [
            "대형 석재 파사드로 시작되는 확장된 공간 경험",
            "낙원으로 향하는 길목 별빛으로 완성한 전이공간",
            "나무의 선과 물의 반사로 구현한 공간 경험"
        ],
        massProcess: [],
    },
    {
        id: "iter",
        name: "이테르  iter",
        nameEn: "ITER",
        location: "서울시 중구 남대문로5길 39  B1",
        area: "200㎡",
        usage: "이탈리아 레스토랑",
        conceptKo: "길",
        conceptEn: "Path",
        shortDesc: "공간의 동선과 빛의 변화로 풀어낸 레스토랑",
        description: "이테르(iter)는 길과 여행을 의미하는 이름아래, 이탈리안과 한식을 잇는 요리 철학을 공간으로 풀어낸 캐주얼 다이닝 입니다.\n지하라는 장소의 특성을 활용해 진입부터 하나의 여정이 되도록 설계했으며 동선과 레벨의 변화를 따라 공간의 시퀀스를 경험하도록 구성했습니다.",
        tags: ["소공동 인기 매장", "오픈 3개월 내 안정화", "SNS 바이럴"],
        mainImg: "/fnb/images/compressed/project/iter/5.webp",
        galleryImgs: [
            "/fnb/images/compressed/project/iter/1.webp",
            "/fnb/images/compressed/project/iter/2.webp",
            "/fnb/images/compressed/project/iter/3.webp",
            "/fnb/images/compressed/project/iter/4.webp",
            "/fnb/images/compressed/project/iter/5.webp",
            "/fnb/images/compressed/project/iter/6.webp",
            "/fnb/images/compressed/project/iter/7.webp",
            "/fnb/images/compressed/project/iter/8.webp",
        ],
        processImg: "/fnb/images/compressed/project/iter/process.webp",
        processDescriptions: [
            "입구에 주방,룸을 배치해 홀의 독립성을 확보한 레이아웃",
            "전이공간의 반사요소와 레벨차로 깊이감과 몰입감을 더한 공간",
            "시원스의 변화와 천정높이 차로 다채로운 공간감을 표현",
            "광천정으로 홀의 높은 천정고를 극대화한 디자인"
        ],
        massProcess: [],
    },
];

export const awards = [
    {
        img: "/fnb/images/compressed/awards/1.webp",
        year: "2018",
        name: "Golden Scale Best Design Award",
        nameKo: "골든 스케일 디자인 어워드  국토부 장관상 수상",
    },
    {
        img: "/fnb/images/compressed/awards/2.webp",
        year: "2021",
        name: "Asia Design Prize _ Winner",
        nameKo: "아시아 디자인 어워드 수상",
    },
    {
        img: "/fnb/images/compressed/awards/3.webp",
        year: "2019",
        name: "Good Design Award _ Winner",
        nameKo: "굿 디자인 어워드  수상",
    },
    {
        img: "/fnb/images/compressed/awards/4.webp",
        year: "2021",
        name: "Golden Scale Best Design Award",
        nameKo: "골든 스케일 디자인 어워드 협회상 수상",
    },
];

export const clients = [
    "한화 푸드테크", "신세계푸드", "진주햄", "삼양에프앤비", "롯데쇼핑",
    "롯데물산", "한화호텔&리조트", "모나미", "서부티앤디", "문학동네",
    "카브루", "SK 플래닛", "포쉬텔", "만다리나덕",
];

export const mobileFaqs = [
    {
        q: "인테리어 비용은 평당 얼마인가요?",
        a: "업종, 면적, 설비, 주방 구성에 따라 비용이 달라집니다.\n공간의 목적과 운영 방식에 맞춘 상담을 통해 현실적인 범위를 안내드립니다.",
    },
    {
        q: "전체 진행 기간은 얼마나 걸리나요?",
        a: "일반적으로 기획 2-4주, 설계 3-5주, 시공 6주-10주 정도가 소요됩니다.\n규모,현장 조건에 따라 달라지며 오픈 일정 기준으로 계획합니다.",
    },
    {
        q: "공상플래닛은 어떤 기준으로 프로젝트를 진행하나요?",
        a: "모든 프로젝트를 수주하기보다 방향성이 맞는 팀과 협업합니다.\n디자인과 수익이 균형 잡힌 공간을 만듭니다.",
    },
    {
        q: "공사중 추가 비용이 발생할 가능성도 있나요?",
        a: "디자인 변경이 없는 한, 추가 비용이 없도록 철저히 점검합니다.\n실측,구조,설비를 사전 점검해 추가 비용이 발생하지 않도록 하고 있습니다.",
    },
    {
        q: "아직 구체적인 계획이 정리되지 않았는데 상담이 가능할까요?",
        a: "가능합니다.\n공간 정보와 운영 방향만으로도 예산과 진행 가능성을 안내드립니다.\n부담 없이 방향 부터 점검해 보셔도 됩니다.",
    },
];

export const pcFaqs = [
    {
        q: "인테리어 비용은 평당 얼마인가요?",
        a: "F&B 공간은 업종의 성격, 면적, 기존 설비상태, 주방 구성 방식에 따라 비용 편차가 큽니다.\n공상플래닛은 단순 평당 단가가 아닌, 공간의 목적과 운영 방식에 맞춘 상담을 통해 현실적인 범위를 안내드립니다",
    },
    {
        q: "전체 진행 기간은 얼마나 걸리나요?",
        a: "일반적으로 기획 2-4주, 설계 3-5주, 시공 6주-10주 정도가 소요됩니다.\n공간 규모와 현장 조건에 따라 달라질 수 있으며, 오픈 일정이 확정된 경우 역산 방식으로 계획을 수립합니다.",
    },
    {
        q: "공상플래닛은 어떤 기준으로 프로젝트를 진행하나요?",
        a: "모든 프로젝트를 수주하기보다 브랜드의 방향성과 공간에 대한 관점이 맞는 팀과 협업합니다.\n공간의 완성도뿐 아니라 실제 운영의 현실까지 함께 고민하며, 디자인과 수익 구조가 균형 있게 작동하는 프로젝트를 지향합니다.",
    },
    {
        q: "공사중 추가 비용이 발생할 가능성도 있나요?",
        a: "공상플래닛은 디자인 변경이 없는 한, 추가 비용이 발생하지 않도록 사전 점검을 철저히 진행합니다.\n현장 실측과 구조 확인, 설비 상태 점검을 기반으로 예상 가능한 변수를 최대한 설계 단계에서 반영합니다.",
    },
    {
        q: "아직 구체적인 계획이 정리되지 않았는데 상담이 가능할까요?",
        a: "가능합니다.\n공간 정보와 대략적인 운영 방향만 있어도 현실적인 예산 범위와 진행 가능성도 안내해 드립니다.\n상담 이후에 진행을 결정하셔도 됩니다. 부담 없이 방향 부터 점검해 보셔도 됩니다.",
    },
];

export const faqs = pcFaqs; // Default fallback
