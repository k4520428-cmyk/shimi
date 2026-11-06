/* =========================================================
   HIRAQU(医師・薬剤師・看護師の適職診断) スクリプト
   ---------------------------------------------------------
   このファイルは大きく2つに分かれています。

   【A. 設定・データ(ここを編集すれば中身を変えられます)】
     - CONFIG    : サイト名・CTAリンク・紹介サービス・志向(軸)などの設定値
     - QUESTIONS : 質問文・どの志向に加点するか
     - RESULTS   : タイプ別の結果文言と、職種別の「資格を活かせる仕事」

   【B. 動作(ロジック)】
     - 通常は編集不要です。

   ※ 文言中の {service} は紹介サービス名、{job} は職種名に自動で置き換わります。
   ========================================================= */


/* =========================================================
   A-1. CONFIG(設定値)
   ========================================================= */
const CONFIG = {
  // サイト名(フッターなどに表示)
  siteName: 'HIRAQU｜医師・薬剤師・看護師の適職診断',

  // ステルスマーケティング規制への対応として、広告を含むことを明記します
  prNotice: '※本ページはプロモーション(広告)を含みます。',

  // 結果画面の下部に表示する注意書き
  disclaimer: '※診断結果は回答内容から働き方の傾向を示したもので、適性や転職の成功、採用条件を保証するものではありません。仕事によっては、実務経験・専門医や認定などの資格・追加の免許が求められる場合があります。各サービスの内容・求人状況は変わることがあるため、最新情報は各公式サイトでご確認ください。',

  // 結果画面「資格を活かせる仕事」の見出し・説明({job} は職種名に置き換わります)
  jobsHeading: '{job}の資格を活かせる、あなた向きの仕事',
  jobsLead: 'あなたの志向と相性がよい、{job}の国家資格を活かせる仕事の例です。職種名だけで決めず、実際の業務内容や働き方も確かめてみてください。',
  subJobsHeading: 'こちらも相性がよい仕事',

  // 結果画面「おすすめサービス」の見出し・説明({job} は職種名に置き換わります)
  servicesHeading: '{job}におすすめの転職サービス',
  servicesLead: '気になる仕事が見つかったら、{job}向けの転職サービスで求人を探したり、担当者に相談したりできます。複数のサービスに登録して、求人や担当者との相性を見比べるのもおすすめです。',
  servicesNote: '※サービス内容は2026年11月時点の各公式サイトの記載にもとづきます。最新の内容・求人数・対応エリアは、各公式サイトでご確認ください。',

  // CTAボタンの文言({service} はサービス名に置き換わります)
  ctaButtonLabel: '{service}に無料登録する',
  ctaNote: '登録・利用は無料です。まずは求人を見るだけでも大丈夫です。',

  // 選択肢をタップしてから次の質問へ進むまでの時間(ミリ秒)
  // ハイライトを見せるための「間」です。短くしすぎると選択が見えません。
  selectDelay: 320,

  // 職種(最初の質問で選ばれた値と対応します)
  jobs: {
    doctor: '医師',
    pharmacist: '薬剤師',
    nurse: '看護師',
  },

  // ---------------------------------------------------------
  // 志向(診断の軸)
  //   キーの並び順が、結果画面のグラフの表示順になります。
  //   また、得点が同点のときは、この並びで先にある志向を優先します。
  //   各志向の得点が最も高いものが「あなたのタイプ」になります。
  // ---------------------------------------------------------
  traits: {
    care:     '寄り添い志向',
    research: '探究志向',
    system:   '仕組みづくり志向',
    business: 'ビジネス志向',
    teach:    '伝える志向',
    balance:  '両立志向',
  },

  // 5段階の回答(左から1点〜5点)
  likertLabels: [
    'まったく当てはまらない',
    'あまり当てはまらない',
    'どちらともいえない',
    'やや当てはまる',
    'とても当てはまる',
  ],

  // ---------------------------------------------------------
  // 紹介サービス(職種ごとに1〜2社)
  // ▼ サービスの追加・削除・差し替えは、ここだけを編集してください。
  //   並び順がそのまま結果画面の表示順になります。
  //   name     : サービス名
  //   operator : 運営会社
  //   url      : リンク先(★現在は公式サイトのトップです。アフィリエイトリンクに差し替えてください)
  //   summary  : 一言での紹介
  //   points   : 特徴(公式サイトに書かれている内容だけを書く。数値は変わりやすいので入れない)
  // ---------------------------------------------------------
  services: {
    doctor: [
      {
        name: 'ドクタービジョン',
        operator: '株式会社メディカルリソース(日本調剤グループ)',
        url: 'https://www.doctor-vision.com/',
        summary: '常勤・非常勤・スポットの医師求人を、全国47都道府県から探せる転職支援サービスです。',
        points: [
          'キャリアプランやライフプランのヒアリングをもとに、求人を紹介してもらえます。',
          '履歴書・職務経歴書の作成アドバイスや、面接の日程調整をサポートします。',
          '条件交渉の代行や面接への同行など、一人では進めにくい場面も支えてくれます。',
          '入職後のフォローまで、完全無料で利用できます。',
          '「職業紹介優良事業者」に認定されています。',
        ],
      },
    ],
    pharmacist: [
      {
        name: 'マイナビ薬剤師',
        operator: '株式会社マイナビ',
        url: 'https://pharma.mynavi.jp/',
        summary: '薬剤師専任のキャリアアドバイザーが転職をサポートする、マイナビグループのサービスです。',
        points: [
          '調剤薬局・ドラッグストア・病院・一般企業など、幅広い求人から探せます。',
          '来社面談のほか、電話やオンラインでも相談できます。',
          '非公開求人の紹介や、年収交渉・面接日程の調整の代行があります。',
          '入職後のアフターフォローまで、完全無料で利用できます。',
        ],
      },
      {
        name: 'ファルマスタッフ',
        operator: '株式会社メディカルリソース(日本調剤グループ)',
        url: 'https://www.38-8931.com/',
        summary: '調剤薬局を運営する日本調剤グループの、薬剤師専門の求人・転職支援サービスです。',
        points: [
          '全国に支店があり、支店での相談のほか、電話・メール・Webでも相談できます。',
          '必要書類の作成、面接日時の調整、給与や休日の条件交渉までコンサルタントが支援します。',
          '転職後のフォローがあり、正社員のほか派遣の求人も扱っています。',
          '日本調剤の教育ノウハウを活かした教育サービスを提供しています。',
          '求職者は無料で利用できます。',
        ],
      },
    ],
    nurse: [
      {
        name: 'マイナビ看護師',
        operator: '株式会社マイナビ',
        url: 'https://kango.mynavi.jp/',
        summary: '病院・施設・クリニックなど幅広い求人を扱う、マイナビグループの看護師向け転職支援サービスです。',
        points: [
          '病院・クリニック・介護施設・訪問看護ステーション・企業など、さまざまな職場の求人があります。',
          'キャリアアドバイザーが各施設に足を運び、現場の情報を集めています。',
          '面接対策・書類添削のほか、条件交渉や日程調整の代行があります。',
          '求人紹介から内定まで、無料でサポートを受けられます。',
          '「医療分野における適正な有料職業紹介事業者」に認定されています。',
        ],
      },
      {
        name: 'レバウェル看護',
        operator: 'レバウェル株式会社',
        url: 'https://kango-oshigoto.jp/',
        summary: '全国の求人を、都道府県・市区町村・路線・駅から探せる看護師向け転職支援サービスです。',
        points: [
          'LINEでも相談でき、電話での希望条件のヒアリングから始められます。',
          '履歴書のサポートや模擬面接など、選考対策を受けられます。',
          '給与や勤務条件の交渉に加え、退職交渉まで相談できます。',
          '入職後のアフターフォローまで、完全無料で利用できます。',
        ],
      },
    ],
  },
};


/* =========================================================
   A-2. QUESTIONS(質問)
   ---------------------------------------------------------
   ・1問目は職種を選ぶ質問です(job を持つ選択肢)。スコアには影響しません。
   ・2問目以降は5段階で答える質問です。
       trait   : 加点する志向(CONFIG.traits のキー)
       reverse : true のとき点数を反転します(5点→1点、4点→2点…)
     各志向に3問ずつ、同じ志向が続かないように並べています。
   ========================================================= */
const QUESTIONS = [
  {
    text: 'あなたの職種を教えてください。',
    options: [
      { label: '医師',   job: 'doctor' },
      { label: '薬剤師', job: 'pharmacist' },
      { label: '看護師', job: 'nurse' },
    ],
  },
  { trait: 'care',     text: '患者さん(利用者さん)と直接話す時間が、仕事のやりがいの中心だ。' },
  { trait: 'research', text: '新しいガイドラインや論文が出ると、自分から読んで確かめたくなる。' },
  { trait: 'system',   text: '目の前の一人だけでなく、地域や組織全体の健康を良くする仕組みに興味がある。' },
  { trait: 'business', text: '医療を「事業」としてとらえ、売上やコストのことも考えてみたい。' },
  { trait: 'teach',    text: '後輩や学生に教えたり、説明したりするのが好きだ。' },
  { trait: 'balance',  text: '仕事は、生活や家族との時間と無理なく両立できることを最優先したい。' },
  { trait: 'care',     text: '一人の患者さんの経過を、長く見守れる仕事にひかれる。' },
  { trait: 'research', text: 'ひとつの分野を深く掘り下げ、「この領域なら任せて」と言われたい。' },
  { trait: 'system',   text: 'マニュアルや業務の流れ、ルールを整えて、職場を回しやすくするのが得意だ。' },
  { trait: 'business', text: '病院や薬局の外(企業など)で、医療の知識を活かす働き方に興味がある。' },
  { trait: 'teach',    text: '難しい医療の話を、相手に合わせてわかりやすく言い換えるのが得意だ。' },
  { trait: 'balance',  text: '急変や緊急対応が多い職場より、落ち着いたペースで働ける職場が合う。' },
  { trait: 'care',     text: '患者さんと接する機会がほとんどない仕事でも、満足して働けると思う。', reverse: true },
  { trait: 'research', text: '「なぜそうなるのか」がわからないことは、そのままにしておけない。' },
  { trait: 'system',   text: '制度や法律、統計データから医療のあり方を考えることには、あまり興味がない。', reverse: true },
  { trait: 'business', text: '成果が数字ではっきり評価される環境のほうが、やる気が出る。' },
  { trait: 'teach',    text: '文章や資料、講演などで、多くの人に情報を届ける仕事にひかれる。' },
  { trait: 'balance',  text: '夜勤・当直やオンコールがあっても、やりがいがあれば気にならない。', reverse: true },
];


/* =========================================================
   A-3. RESULTS(タイプ別の結果文言)
   ---------------------------------------------------------
   キーは CONFIG.traits と同じです(いちばん強い志向 = タイプ)。
     name        : タイプ名
     catchCopy   : タイプ名の下に出る一言
     features    : このタイプの特徴(1要素=1段落)
     watchOut    : 気をつけたいこと
     jobs        : 職種ごとの「資格を活かせる仕事」
                     title : 仕事名
                     desc  : 一言説明(必要な経験や追加資格があれば書く)
                   ※ 結果画面では上から順に表示します。
                     2番目に強い志向のタイプからも、上から2つを「こちらも相性がよい仕事」として表示します。
     message     : 迷っている人への一言
     nextSteps   : 次にやること(番号付きリスト)
   ========================================================= */
const RESULTS = {
  care: {
    name: '伴走ケアラー',
    catchCopy: '「ありがとう」が、いちばんの原動力。',
    features: [
      '患者さんや利用者さんと向き合い、その人の暮らしまで想像しながら関われるタイプです。',
      '検査値や処方だけでなく、表情や言葉の端から変化に気づける観察力があります。',
      '一度きりの対応より、継続して関わり、信頼関係を育てていく働き方で力を発揮します。',
    ],
    watchOut: '相手に寄り添うぶん、自分の疲れを後回しにしがちです。一人で抱えこまず、チームで支え合える体制がある職場かどうかも確かめましょう。',
    jobs: {
      doctor: [
        { title: '在宅医療(訪問診療)の医師', desc: '通院が難しい患者さんの自宅や施設を訪問し、生活の場で診療します。看取りまで長く関わることもあります。' },
        { title: '総合診療医・家庭医', desc: '臓器や年齢を限らず、地域の患者さんの「かかりつけ」として幅広く診ます。' },
        { title: '緩和ケア医', desc: 'がんなどの患者さんの苦痛をやわらげ、本人と家族の時間を支えます。' },
        { title: '地域のクリニックの医師', desc: '外来で同じ患者さんを継続して診ながら、顔の見える関係を築けます。' },
        { title: '地域の中小病院の勤務医', desc: '外来と入院の両方で、地域の患者さんを継続して診られます。退院後の生活まで見すえた診療ができます。' },
      ],
      pharmacist: [
        { title: '在宅訪問薬剤師', desc: '患者さんの自宅や施設に薬を届け、服薬状況や残薬を確認して医師に提案します。' },
        { title: 'かかりつけ薬剤師', desc: '一人の患者さんの服薬を継続して管理し、相談に乗る地域の窓口です(一定の勤務経験などの要件があります)。' },
        { title: '病院の病棟薬剤師', desc: '病棟で入院患者さんに服薬指導を行い、医師・看護師と治療に関わります。' },
        { title: 'がん・緩和ケアに関わる薬剤師', desc: '抗がん剤や痛み止めの使い方を支え、つらい治療に寄り添います。' },
      ],
      nurse: [
        { title: '訪問看護師', desc: '利用者さんの自宅で、医療的ケアから生活の相談まで担います。一人ひとりと深く関われます。' },
        { title: '緩和ケア病棟・ホスピスの看護師', desc: '残された時間をその人らしく過ごせるよう、本人と家族を支えます。' },
        { title: '回復期リハビリテーション病棟の看護師', desc: '退院後の生活を見すえ、回復していく過程に長く寄り添います。' },
        { title: '慢性期・療養病棟の看護師', desc: '長期入院の患者さんと関係を築き、日々の小さな変化を大切にするケアができます。' },
        { title: '一般病院の病棟看護師(内科系など)', desc: '入院から退院まで患者さんを受け持ち、日々のケアを通じて回復を支えます。' },
      ],
    },
    message: '人に寄り添う力は、どの職場でも求められる大切な強みです。ただ、その力を発揮できるかどうかは、患者さんと関わる時間をどれだけ持てるかに左右されます。今の職場でそれが難しいなら、場所を変えるのもひとつの方法です。',
    nextSteps: [
      '気になる仕事について、1日の流れや患者さんと関わる時間を調べる',
      '転職サービスに無料登録し、希望する関わり方を担当者に伝える',
      '訪問や在宅の仕事は、可能であれば同行見学で雰囲気を確かめる',
      '今の職場と比べて、納得できる選択肢かどうかを判断する',
    ],
  },

  research: {
    name: '探究スペシャリスト',
    catchCopy: '「なぜ?」を突きつめて、専門性を武器に。',
    features: [
      '新しい知見を自分で確かめ、理解できるまで掘り下げられるタイプです。',
      'ひとつの領域を深めることにやりがいを感じ、専門家として頼られることで力を発揮します。',
      'エビデンスにもとづいて考える姿勢は、臨床でも企業でも評価されやすい強みです。',
    ],
    watchOut: 'こだわりが強いぶん、「深める時間」が取れない職場では不満がたまりやすくなります。症例の幅や研究・研修の機会を、求人を選ぶ段階で確かめましょう。',
    jobs: {
      doctor: [
        { title: '大学病院・研究機関の医師', desc: '診療と並行して臨床研究や基礎研究に取り組み、新しい治療につなげます。' },
        { title: '専門病院・高度医療機関の専門医', desc: '特定の領域の症例を数多く経験し、専門性を磨き続けられます。' },
        { title: '製薬企業の臨床開発に関わる医師', desc: '新薬の治験を計画・評価し、医学的な判断を担います。' },
        { title: '医薬品の安全性評価に関わる医師', desc: '製薬企業などで副作用の情報を集めて評価し、薬の安全を守ります。' },
        { title: '症例数の多い急性期の市中病院の勤務医', desc: '幅広い疾患や救急の症例を数多く経験し、臨床力と専門性を磨けます。' },
      ],
      pharmacist: [
        { title: '専門・認定薬剤師をめざす病院薬剤師', desc: 'がん・感染制御など専門領域の知識を深め、チーム医療で頼られる存在になります。' },
        { title: '製薬企業の研究・開発職', desc: '新薬の研究や製剤開発、臨床開発に関わります。分野によっては大学院での研究経験が求められます。' },
        { title: '治験コーディネーター(CRC)', desc: '病院などで治験が正しく進むよう、患者さん・医師・製薬企業の間を調整します。' },
        { title: '大学・研究機関の研究職', desc: '薬学の研究や後進の育成に携わります。多くの場合、博士号などが求められます。' },
      ],
      nurse: [
        { title: '認定看護師・専門看護師', desc: '感染管理・がん・救急など特定分野の高い専門性を活かします(所定の教育課程と認定審査が必要です)。' },
        { title: '特定行為研修を修了した看護師', desc: '研修を修了すると、手順書にもとづいて一部の医療行為を行えるようになります。' },
        { title: '大学病院・高度急性期病院の看護師', desc: '最新の治療や難しい症例に関われ、学びの機会が多い環境です。' },
        { title: '治験コーディネーター(CRC)', desc: '看護の知識を活かし、治験に参加する患者さんの安全と試験の質を支えます。' },
        { title: '急性期病院の看護師(救急・ICU・手術室など)', desc: '重症度の高い患者さんや高度な治療に関わり、判断力と専門的な技術を磨けます。' },
      ],
    },
    message: '専門性を深めたい気持ちは、数年後の選択肢を大きく広げてくれます。どの領域を、どんな環境で深めたいのか。まずは道筋を知ることから始めてみましょう。',
    nextSteps: [
      '深めたい領域と、そのために必要な資格や経験年数を調べる',
      '転職サービスに無料登録し、症例数・研修制度・研究への関わり方を質問する',
      '気になる職場の教育体制や、資格取得の支援制度を比べる',
      '数年後の自分にとってプラスになるかを基準に判断する',
    ],
  },

  system: {
    name: '仕組みデザイナー',
    catchCopy: '一人を診る力で、たくさんの人を守る。',
    features: [
      '目の前の一人だけでなく、その背景にある組織や地域、制度に目が向くタイプです。',
      'ルールや流れを整えて、みんなが働きやすく、安全な状態をつくることが得意です。',
      '臨床で得た経験を「仕組み」に変えることで、より多くの人の健康に関われます。',
    ],
    watchOut: '仕組みづくりの仕事は、成果が出るまで時間がかかり、患者さんからの直接の感謝は少なくなりがちです。それでもやりがいを感じられるか、事前に考えておきましょう。',
    jobs: {
      doctor: [
        { title: '公衆衛生医師(保健所・自治体)', desc: '感染症対策や健康づくり、地域の医療体制づくりを担います。' },
        { title: '産業医', desc: '企業で働く人の健康管理や職場環境の改善を担います(所定の研修の修了などの要件があります)。' },
        { title: '保険会社の社医', desc: '生命保険の加入時の診査や、医学的な査定を担当します。' },
        { title: '医系技官(厚生労働省など)', desc: '国の立場から、医療制度や保健医療政策の企画・立案に関わります。' },
        { title: '矯正医官', desc: '刑務所などの矯正施設で、収容されている人の健康を守ります(国家公務員)。' },
      ],
      pharmacist: [
        { title: '行政薬剤師(保健所・都道府県など)', desc: '薬局や医薬品販売業の監視・指導、食品衛生や環境衛生の業務などを担います。' },
        { title: '麻薬取締官', desc: '厚生労働省の職員として、薬物犯罪の捜査や麻薬などの適正な流通の監督を行います。' },
        { title: '医薬品の審査・安全対策(PMDAなど)', desc: '新薬などの承認審査や、市販後の安全対策に関わります。' },
        { title: '製薬企業の品質保証・薬事', desc: '医薬品の品質を守る仕組みや、承認申請・法令対応を担います。' },
        { title: '学校薬剤師', desc: '学校の飲み水や空気などの環境衛生を確認し、薬物乱用防止の教育も担います(多くは薬局業務との兼務です)。' },
        { title: '調剤薬局の管理薬剤師', desc: '薬局の医薬品管理や法令の順守、スタッフの業務の流れづくりを担う、店舗の責任者です。' },
      ],
      nurse: [
        { title: '産業看護師(企業の健康管理室)', desc: '社員の健康診断のフォローや健康相談、職場の健康づくりを担います。' },
        { title: '感染管理を担う看護師', desc: '病院全体の感染対策の仕組みをつくり、職員への教育も行います。' },
        { title: '医療安全管理者', desc: 'インシデントを分析し、事故を防ぐ仕組みを院内に広げます。' },
        { title: '看護管理者(主任・看護師長など)', desc: '人員配置や業務改善を通じて、病棟全体の看護の質を高めます。' },
        { title: '保険会社の診査・査定業務', desc: '看護の知識を活かし、保険加入時の診査や医療情報の確認を担います。' },
      ],
    },
    message: '「もっと根本から良くしたい」という思いは、医療を支える大切な視点です。仕組みに関わる仕事は求人が表に出にくいものもあるため、早めに情報を集めておくと選択肢が広がります。',
    nextSteps: [
      '気になる仕事の応募条件(経験年数・資格・試験の有無)を調べる',
      '公務員の仕事は、自治体や省庁の採用ページで募集時期を確認する',
      '転職サービスに無料登録し、企業や施設の管理部門の求人がないか相談する',
      '臨床から離れることも含めて、納得できるかを考えて判断する',
    ],
  },

  business: {
    name: 'メディカルビジネス開拓者',
    catchCopy: '医療の知識を、新しい価値に変える。',
    features: [
      '医療を「事業」や「サービス」としてもとらえられる、視野の広いタイプです。',
      '成果が目に見える環境や、新しいことに挑戦できる環境でやる気が高まります。',
      '医療職の知識とビジネスの視点を両方持つ人材は、企業や医療機関の経営で求められています。',
    ],
    watchOut: '企業では、病院や薬局とは評価のされ方や仕事の進め方が大きく異なります。年収だけで選ばず、求められる成果や働き方まで確かめてから判断しましょう。',
    jobs: {
      doctor: [
        { title: '製薬企業のメディカルドクター', desc: '医学的な専門知識で、新薬の開発や安全性の評価、医療者への情報提供を支えます。' },
        { title: 'ヘルステック企業の医師', desc: 'オンライン診療やアプリなど、医療サービスの企画・監修を担います。' },
        { title: '医療系コンサルタント', desc: '病院の経営改善や、企業の医療分野への参入を医師の立場から支援します。' },
        { title: '医療機関の経営に関わる医師(院長・理事など)', desc: '診療に加えて、組織運営や経営判断を担います。開業という選択肢もあります。' },
      ],
      pharmacist: [
        { title: 'MR(医薬情報担当者)', desc: '製薬企業の立場から、医療機関に医薬品の情報を届けます。' },
        { title: '薬局のエリアマネージャー・本部職', desc: '複数店舗の運営や人材育成、店舗の数字の管理を担います。' },
        { title: '薬局の開業・経営', desc: '地域に必要とされる薬局を、自分で形にします。経営の知識も求められます。' },
        { title: 'CRA(臨床開発モニター)', desc: '製薬企業やCROで、治験が計画どおりに進んでいるかを確認します。' },
      ],
      nurse: [
        { title: '医療機器メーカーのクリニカルスペシャリスト', desc: '看護の経験を活かし、医療機器の使い方を医療現場に説明・支援します。' },
        { title: '美容クリニックの看護師', desc: '自由診療の現場で、カウンセリングや施術の補助を担います。接客の力も活かせます。' },
        { title: 'ヘルスケア企業の企画・営業職', desc: '看護の知識を活かし、医療・介護向けのサービスや商品を届けます。' },
        { title: '訪問看護ステーションの管理者・開業', desc: '事業所の運営や採用、地域の医療機関との連携まで担います(管理者には要件があります)。' },
      ],
    },
    message: '病院や薬局の外にも、医療職の資格を活かせる場所はたくさんあります。ただ、企業への転職は求人の情報が限られがちです。まずは「どんな仕事があるのか」を知るところから始めてみましょう。',
    nextSteps: [
      '気になる仕事の具体的な業務内容と、求められる経験を調べる',
      '転職サービスに無料登録し、企業や管理職の求人がないか相談する',
      '臨床経験をどう活かせるか、職務経歴書で言葉にしておく',
      '評価のされ方や働き方の違いを理解したうえで判断する',
    ],
  },

  teach: {
    name: 'ナレッジメッセンジャー',
    catchCopy: '知っていることを、伝わる言葉で届ける。',
    features: [
      '難しい医療の話を、相手に合わせてわかりやすく伝えられるタイプです。',
      '後輩の成長や、相手が「わかった」と言ってくれる瞬間にやりがいを感じます。',
      '説明する力は、教育・情報提供・執筆など、臨床の外にも活かせる場が広い強みです。',
    ],
    watchOut: '伝える仕事は、自分が最新の知識を学び続けていることが前提になります。学ぶ時間と、教える役割の両方が持てる環境かを確かめましょう。',
    jobs: {
      doctor: [
        { title: 'MSL(メディカルサイエンスリエゾン)', desc: '製薬企業で、専門医などと最新の医学情報について学術的な意見交換を行います。' },
        { title: '大学教員・研修医の指導医', desc: '診療と並行して、医学生や研修医の教育を担います。' },
        { title: '医療メディアの監修・執筆', desc: '一般の人に向けて、正しい医療情報を発信します。副業から始める人もいます。' },
        { title: '健康相談・オンライン医療相談の医師', desc: '電話やチャットで、相談者の不安に寄り添いながら情報を伝えます。' },
      ],
      pharmacist: [
        { title: 'DI(医薬品情報)担当薬剤師', desc: '病院などで医薬品の情報を集めて整理し、医師や看護師からの問い合わせに答えます。' },
        { title: '製薬企業のくすり相談窓口', desc: '医療者や患者さんからの、医薬品に関する問い合わせに対応します。' },
        { title: 'MSL(メディカルサイエンスリエゾン)', desc: '製薬企業で、医療者と専門性の高い学術的な情報交換を行います。' },
        { title: 'メディカルライター', desc: '治験の文書や医療者向けの資料、一般向けの記事などを作成します。' },
      ],
      nurse: [
        { title: '看護教員(看護学校・大学)', desc: '看護学生の講義や実習の指導を担います(実務経験や所定の研修などが求められます)。' },
        { title: '病院の教育担当・臨床指導者', desc: '新人看護師の研修を企画し、現場で育成を担います。' },
        { title: '電話健康相談の看護師', desc: '保険会社や自治体の窓口などで、健康や受診の相談に応じます。' },
        { title: '医療ライター・看護系メディアの編集', desc: '看護の経験を活かし、医療や健康の情報をわかりやすく発信します。' },
      ],
    },
    message: '伝える力は、目立たないけれど医療の質を支える大きな強みです。教える仕事や情報を届ける仕事は、臨床の経験があるからこそ説得力が生まれます。今の経験をどう活かせるか、一度整理してみましょう。',
    nextSteps: [
      'これまでに教えた経験や、作った資料・マニュアルを書き出す',
      '気になる仕事に必要な経験や資格を調べる',
      '転職サービスに無料登録し、教育担当や企業の求人がないか相談する',
      '学び続けられる環境かどうかも含めて判断する',
    ],
  },

  balance: {
    name: 'ライフバランス・ナビゲーター',
    catchCopy: '資格を活かして、無理なく長く。',
    features: [
      '仕事も生活も大切にしながら、自分のペースで長く働き続けたいタイプです。',
      '落ち着いた環境で、目の前の業務にていねいに取り組むことで力を発揮します。',
      '医療職の資格は、働き方の選択肢が多いのが強み。条件を整えれば、無理なく専門性を活かせます。',
    ],
    watchOut: '「楽そう」という印象だけで選ぶと、業務の幅や給与の面で物足りなさを感じることがあります。勤務時間・休日・業務内容を、具体的に比べてから決めましょう。',
    jobs: {
      doctor: [
        { title: '介護老人保健施設(老健)の医師', desc: '入所者の健康管理や、在宅復帰に向けた医療を担います。夜間の急変対応が比較的少ない職場が多いです。' },
        { title: '健診センター・人間ドックの医師', desc: '健康診断や結果説明が中心で、勤務時間が決まっていることが多い仕事です。' },
        { title: '療養型病院の医師', desc: '状態が安定した患者さんを中心に、落ち着いたペースで診療できます。' },
        { title: '非常勤・スポット勤務の組み合わせ', desc: '外来や健診などを組み合わせ、働く日数や時間を自分で調整できます。' },
        { title: '当直なし・少なめの病院の常勤医', desc: '常勤として安定した収入を得ながら、当直やオンコールの負担をおさえて働けます(条件は病院によって異なります)。' },
      ],
      pharmacist: [
        { title: '地域の調剤薬局の薬剤師', desc: '営業時間が決まっている薬局が多く、生活リズムを整えやすい働き方です。' },
        { title: 'ドラッグストアの薬剤師(調剤併設など)', desc: '勤務地の選択肢が多く、通いやすい職場を見つけやすいのが特徴です。' },
        { title: '派遣薬剤師', desc: '働く期間や曜日、時間を選びやすく、生活に合わせた働き方ができます。' },
        { title: '介護施設などに薬を届ける薬局の薬剤師', desc: '施設への調剤が中心で、夜間の急ぎの対応が少ない職場もあります。' },
      ],
      nurse: [
        { title: 'クリニック(外来)の看護師', desc: '夜勤がなく、診療時間に合わせて働けることが多い職場です。' },
        { title: '健診センターの看護師', desc: '採血や検査の案内などが中心で、土日休みの職場もあります。' },
        { title: '介護施設(特養・老健・デイサービスなど)の看護師', desc: '入所者や利用者の健康管理が中心です。夜勤の有無は施設によって異なります。' },
        { title: '保育園・企業などの看護師', desc: '子どもや社員の健康管理を担います。勤務時間が決まっていることが多い仕事です。' },
        { title: '夜勤なし・日勤のみの病院の看護師', desc: '病院の看護に関わりながら、生活リズムを整えやすい働き方です。外来や日勤専従などの求人があります。' },
      ],
    },
    message: '働き方を見直したいと思うのは、資格をこれからも長く活かしていくための大切な一歩です。今の職場で頑張り続けるか、環境を変えるか。比べられる材料をそろえてから決めても遅くはありません。',
    nextSteps: [
      '勤務時間・休日・夜勤や当直の有無など、ゆずれない条件を整理する',
      '転職サービスに無料登録し、希望の条件を担当者に伝える',
      '紹介された求人の、実際の残業時間や休みの取りやすさを確認する',
      '今の職場と比べて、納得できる選択肢かどうかを判断する',
    ],
  },
};


/* =========================================================
   B. 動作(ロジック)
   ---------------------------------------------------------
   ここから下は、通常は編集不要です。
   ========================================================= */

/* ---------- B-1. 状態管理 ---------- */
const state = {
  current: 0,        // いま表示している質問の番号(0始まり)
  answers: [],       // 各質問で選んだ選択肢の番号(戻ったときの復元に使用)
  isLocked: false,   // アニメーション中の連打を防ぐためのフラグ
};

/* ---------- B-2. よく使う要素 ---------- */
const $ = (id) => document.getElementById(id);

const els = {
  screens: {
    start: $('screen-start'),
    question: $('screen-question'),
    result: $('screen-result'),
  },
  progressCurrent: $('progress-current'),
  progressTotal: $('progress-total'),
  progressBar: $('progress-bar'),
  progressFill: $('progress-fill'),
  questionBody: $('question-body'),
  questionNumber: $('question-number'),
  questionText: $('question-text'),
  options: $('options'),
  btnStart: $('btn-start'),
  btnBack: $('btn-back'),
  btnRetry: $('btn-retry'),
};

/* ---------- B-3. 汎用関数 ---------- */

// 文言中の {service} {job} を置き換える
function fillText(text, vars) {
  return text
    .replace(/\{service\}/g, vars.service || '')
    .replace(/\{job\}/g, vars.job || '');
}

// 要素を作ってテキストを入れる(HTMLとして解釈しないので安全)
function createEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

// 配列の内容を <li> にして一覧へ入れる
function renderList(listEl, items, vars) {
  listEl.replaceChildren(...items.map((item) => createEl('li', '', fillText(item, vars))));
}

// 画面を切り替える(フェードイン)
function showScreen(name) {
  Object.entries(els.screens).forEach(([key, screen]) => {
    screen.classList.toggle('is-active', key === name);
  });
  window.scrollTo({ top: 0, behavior: 'auto' });
}

// アニメーション用クラスを付け直す(同じアニメーションを再生し直すため)
function playAnimation(el, className) {
  el.classList.remove('is-leaving', 'is-entering', 'is-entering-back');
  void el.offsetWidth; // 再描画を強制してアニメーションをリセット
  el.classList.add(className);
}

// 質問の選択肢ラベル(職種の質問はそのまま、5段階の質問は共通ラベル)
function getOptionLabels(question) {
  return question.options
    ? question.options.map((option) => option.label)
    : CONFIG.likertLabels;
}

/* ---------- B-4. 質問画面 ---------- */

// いまの質問を表示する
function renderQuestion() {
  const index = state.current;
  const question = QUESTIONS[index];
  const total = QUESTIONS.length;

  // プログレスバー(回答済みの数ではなく「いま何問目か」を表示)
  els.progressCurrent.textContent = index + 1;
  els.progressTotal.textContent = total;
  els.progressBar.setAttribute('aria-valuemax', total);
  els.progressBar.setAttribute('aria-valuenow', index + 1);
  els.progressFill.style.width = `${((index + 1) / total) * 100}%`;

  // 質問文
  els.questionNumber.textContent = `Q${index + 1}`;
  els.questionText.textContent = question.text;

  // 選択肢
  els.options.classList.toggle('options--likert', !question.options);
  const buttons = getOptionLabels(question).map((label, optionIndex) => {
    const btn = createEl('button', 'option', label);
    btn.type = 'button';
    btn.setAttribute('role', 'listitem');

    // 戻ってきたときは、前に選んだ選択肢をハイライトして復元
    if (state.answers[index] === optionIndex) {
      btn.classList.add('is-selected');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      btn.setAttribute('aria-pressed', 'false');
    }

    btn.addEventListener('click', () => selectOption(optionIndex, btn));
    return btn;
  });
  els.options.replaceChildren(...buttons);
}

// 選択肢が選ばれたとき
function selectOption(optionIndex, btn) {
  if (state.isLocked) return;
  state.isLocked = true;

  // 選んだ瞬間にハイライト
  els.options.querySelectorAll('.option').forEach((el) => {
    el.classList.remove('is-selected');
    el.setAttribute('aria-pressed', 'false');
  });
  btn.classList.add('is-selected');
  btn.setAttribute('aria-pressed', 'true');

  state.answers[state.current] = optionIndex;

  // 少し間をおいてから次へ
  setTimeout(() => {
    if (state.current < QUESTIONS.length - 1) {
      goToQuestion(state.current + 1, 'forward');
    } else {
      showResult();
      state.isLocked = false;
    }
  }, CONFIG.selectDelay);
}

// 指定の質問へ移動する(direction: 'forward' | 'back')
function goToQuestion(nextIndex, direction) {
  state.isLocked = true;
  playAnimation(els.questionBody, 'is-leaving');

  // フェードアウトが終わったら中身を差し替えてフェードイン
  setTimeout(() => {
    state.current = nextIndex;
    renderQuestion();
    playAnimation(els.questionBody, direction === 'back' ? 'is-entering-back' : 'is-entering');
    state.isLocked = false;
  }, 200);
}

// 「前の質問に戻る」
function goBack() {
  if (state.isLocked) return;
  if (state.current === 0) {
    // 1問目ならスタート画面へ
    showScreen('start');
    return;
  }
  goToQuestion(state.current - 1, 'back');
}

/* ---------- B-5. 判定 ---------- */

// 回答から職種・志向ごとの得点・タイプを判定する
function calculateResult() {
  const traitKeys = Object.keys(CONFIG.traits);
  const scores = Object.fromEntries(traitKeys.map((key) => [key, 0]));
  const maxScores = Object.fromEntries(traitKeys.map((key) => [key, 0]));
  const scaleMax = CONFIG.likertLabels.length;
  let job = null;

  QUESTIONS.forEach((question, qIndex) => {
    const answer = state.answers[qIndex];
    if (answer === undefined) return;

    if (question.options) {
      // 職種の質問
      const option = question.options[answer];
      if (option && option.job) job = option.job;
      return;
    }

    if (!(question.trait in scores)) return;
    const point = answer + 1; // 1〜5点
    scores[question.trait] += question.reverse ? scaleMax + 1 - point : point;
    maxScores[question.trait] += scaleMax;
  });

  // 志向を得点の高い順に並べる(同点は CONFIG.traits の並び順を優先)
  const ranked = [...traitKeys].sort((a, b) => scores[b] - scores[a]);

  return {
    job: job || Object.keys(CONFIG.jobs)[0],
    type: ranked[0],
    subType: ranked[1],
    scores,
    maxScores,
  };
}

/* ---------- B-6. 結果画面 ---------- */

// 志向のバランス(横棒グラフ)を作る
function buildTraitChart(scores, maxScores, type) {
  return Object.entries(CONFIG.traits).map(([key, label]) => {
    // 最低点(1点×問題数)を0%、最高点を100%として表示
    const count = maxScores[key] / CONFIG.likertLabels.length;
    const min = count;
    const range = maxScores[key] - min;
    const percent = range > 0 ? Math.round(((scores[key] - min) / range) * 100) : 0;

    const row = createEl('div', 'trait' + (key === type ? ' is-top' : ''));
    row.append(createEl('span', 'trait__label', label));
    const bar = createEl('span', 'trait__bar');
    bar.setAttribute('role', 'img');
    bar.setAttribute('aria-label', `${label} ${percent}%`);
    const fill = createEl('span', 'trait__fill');
    fill.style.width = `${Math.max(percent, 3)}%`;
    bar.append(fill);
    row.append(bar);
    row.append(createEl('span', 'trait__value', `${percent}%`));
    return row;
  });
}

// 仕事カードを作る
function buildJobCard(item) {
  const card = createEl('article', 'job-card');
  card.append(createEl('h4', 'job-card__title', item.title));
  card.append(createEl('p', 'job-card__desc', item.desc));
  return card;
}

// サービス紹介カードを作る(サービスごとに1枚)
function buildServiceCard(service) {
  const vars = { service: service.name };
  const card = createEl('article', 'service-card');
  card.append(createEl('h4', 'service-card__name', service.name));
  card.append(createEl('p', 'service-card__operator', `運営:${service.operator}`));
  card.append(createEl('p', 'service-card__summary', service.summary));

  const list = createEl('ul', 'check-list service-card__points');
  renderList(list, service.points, vars);
  card.append(list);

  const link = createEl('a', 'btn btn--cta');
  link.href = service.url;
  link.target = '_blank';
  link.rel = 'noopener sponsored';
  link.append(createEl('span', '', fillText(CONFIG.ctaButtonLabel, vars)));
  const arrow = createEl('span', 'btn__arrow', '→');
  arrow.setAttribute('aria-hidden', 'true');
  link.append(arrow);
  card.append(link);

  card.append(createEl('p', 'cta__note', CONFIG.ctaNote));
  return card;
}

// 結果を表示する
function showResult() {
  const { type, subType, job, scores, maxScores } = calculateResult();
  const result = RESULTS[type];
  const sub = RESULTS[subType];
  const services = CONFIG.services[job];
  const vars = { job: CONFIG.jobs[job] };

  // ① タイプ名
  $('result-job').textContent = `${CONFIG.jobs[job]}のあなたは…`;
  // 「〇〇」と「タイプ」の間で折り返せるよう <wbr> を入れる
  $('result-type-name').replaceChildren(result.name, document.createElement('wbr'), 'タイプ');
  $('result-catch').textContent = result.catchCopy;

  // ② 志向のバランス
  $('result-traits').replaceChildren(...buildTraitChart(scores, maxScores, type));
  $('result-traits-note').textContent =
    `いちばん強いのは「${CONFIG.traits[type]}」、次に強いのは「${CONFIG.traits[subType]}」です。`;

  // ③ 特徴・気をつけたいこと
  $('result-features').replaceChildren(
    ...result.features.map((line) => createEl('p', '', fillText(line, vars)))
  );
  $('result-watch').textContent = fillText(result.watchOut, vars);

  // ④ 資格を活かせる仕事(タイプ別 × 職種別)
  $('result-jobs-heading').textContent = fillText(CONFIG.jobsHeading, vars);
  $('result-jobs-lead').textContent = fillText(CONFIG.jobsLead, vars);
  $('result-jobs').replaceChildren(...result.jobs[job].map(buildJobCard));

  // 2番目に強い志向のタイプから、重複しない仕事を2つ
  const mainTitles = new Set(result.jobs[job].map((item) => item.title));
  const subJobs = sub.jobs[job].filter((item) => !mainTitles.has(item.title)).slice(0, 2);
  $('result-subjobs-heading').textContent =
    `${CONFIG.subJobsHeading}(${CONFIG.traits[subType]}から)`;
  $('result-subjobs').replaceChildren(...subJobs.map(buildJobCard));

  // ⑤ おすすめサービス(職種ごと)
  $('result-services-heading').textContent = fillText(CONFIG.servicesHeading, vars);
  $('result-services-lead').textContent = fillText(CONFIG.servicesLead, vars);
  $('result-services').replaceChildren(...services.map(buildServiceCard));
  $('result-services-note').textContent = CONFIG.servicesNote;

  // ⑥ 迷っている人への一言
  $('result-message').textContent = fillText(result.message, vars);

  // ⑦ 次にやること
  renderList($('result-steps'), result.nextSteps, vars);

  showScreen('result');
}

/* ---------- B-7. 開始・リセット ---------- */

function startDiagnosis() {
  state.current = 0;
  state.answers = [];
  state.isLocked = false;
  renderQuestion();
  els.questionBody.classList.remove('is-leaving', 'is-entering', 'is-entering-back');
  showScreen('question');
}

function restart() {
  state.current = 0;
  state.answers = [];
  state.isLocked = false;
  showScreen('start');
}

/* ---------- B-8. 初期化 ---------- */

function init() {
  // 設定値をページに反映
  document.querySelectorAll('[data-pr-notice]').forEach((el) => {
    el.textContent = CONFIG.prNotice;
  });
  $('disclaimer').textContent = CONFIG.disclaimer;
  $('footer-copy').textContent = `© ${new Date().getFullYear()} ${CONFIG.siteName}`;

  // ボタンのイベント
  els.btnStart.addEventListener('click', startDiagnosis);
  els.btnBack.addEventListener('click', goBack);
  els.btnRetry.addEventListener('click', restart);
}

document.addEventListener('DOMContentLoaded', init);
