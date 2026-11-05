/* =========================================================
   医療職のための転職サービス診断 スクリプト
   ---------------------------------------------------------
   このファイルは大きく2つに分かれています。

   【A. 設定・データ(ここを編集すれば中身を変えられます)】
     - CONFIG    : サイト名・CTAリンク・紹介サービスなどの設定値
     - QUESTIONS : 質問文・選択肢・スコア
     - RESULTS   : タイプ別の結果文言

   【B. 動作(ロジック)】
     - 通常は編集不要です。

   ※ 文言中の {service} は紹介サービス名、{job} は職種名、{type} はタイプ名に
     自動で置き換わります。
   ========================================================= */


/* =========================================================
   A-1. CONFIG(設定値)
   ========================================================= */
const CONFIG = {
  // サイト名(フッターなどに表示)
  siteName: '医療職のための転職サービス診断',

  // ステルスマーケティング規制への対応として、広告を含むことを明記します
  prNotice: '※本ページはプロモーション(広告)を含みます。',

  // 結果画面の下部に表示する注意書き
  disclaimer: '※診断結果は回答内容から傾向を分析したもので、転職の成功や条件を保証するものではありません。各サービスの内容・料金・求人状況は変わることがあるため、最新情報は各公式サイトでご確認ください。',

  // 結果画面「おすすめサービス」の見出し・説明
  // ({job} は職種名、{type} はタイプ名に置き換わります)
  servicesHeading: '{type}のあなたにおすすめの転職サービス',
  servicesLead: '診断結果と各公式サイトの情報をもとに、{job}のあなたと相性のよい順にご紹介します。複数のサービスに登録して、求人や担当者との相性を見比べるのもおすすめです。',
  topBadge: 'あなたにいちばんおすすめ',
  reasonHeading: 'あなたにおすすめの理由',
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

  // タイプの判定順。スコアが同点の場合は、この並びで先にあるタイプを優先します。
  // (具体的な希望がはっきりしているタイプほど先に置いています)
  typePriority: ['career', 'salary', 'wlb', 'env', 'info'],

  // ---------------------------------------------------------
  // 紹介サービス(職種ごとに2社)
  // ▼ サービスの追加・削除・差し替えは、ここだけを編集してください。
  //   id       : サービスの識別名(英数字。recommendOrder で使います)
  //   name     : サービス名
  //   operator : 運営会社
  //   url      : リンク先(★現在は公式サイトのトップです。アフィリエイトリンクに差し替えてください)
  //   summary  : 一言での紹介
  //   points   : 特徴(公式サイトに書かれている内容だけを書く。数値は変わりやすいので入れない)
  //   reasons  : タイプ別の「あなたにおすすめの理由」(診断結果のタイプに応じて1つ表示)
  //              salary / wlb / career / env / info の5つすべて書いてください。
  // ---------------------------------------------------------
  services: {
    doctor: [
      {
        id: 'doctorvision',
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
        reasons: {
          salary: '条件交渉の代行や面接への同行があるので、給与や待遇の交渉を一人で抱えずに進められます。',
          wlb: '常勤・非常勤・スポットの求人を扱っていて、ライフプランのヒアリングもあるため、無理のない働き方を相談しやすいサービスです。',
          career: 'キャリアプランのヒアリングをもとに求人を紹介してもらえるので、将来を見すえた職場選びに役立ちます。',
          env: '面接への同行や入職後のフォローがあり、職場が変わることへの不安を相談しながら進められます。',
          info: '非常勤やスポットの求人もあるので、いきなり常勤で転職しなくても、ほかの職場を知るきっかけをつくれます。',
        },
      },
      {
        // ★公式サイトの記載をもとに、内容をご確認ください
        id: 'dr10',
        name: '医師転職ドットコム',
        operator: '株式会社メディウェル',
        url: 'https://www.dr-10.com/',
        summary: '医師専任のコンサルタントが、常勤・非常勤の転職を支援する医師向けの転職支援サービスです。',
        points: [
          '全国・全診療科の常勤・非常勤の求人を扱っています。',
          '希望条件のヒアリングから、キャリアの相談にのってもらえます。',
          '給与などの条件交渉や、面接への同行があります。',
          '利用は無料です。',
        ],
        reasons: {
          salary: '医師専任のコンサルタントが条件交渉まで支援するので、経験に見合った待遇を目指しやすくなります。',
          wlb: '常勤・非常勤の求人を扱っているので、勤務日数や当直の有無など、働き方の希望に合わせて探せます。',
          career: '医師専任のコンサルタントに、今後のキャリアについて相談しながら求人を選べます。',
          env: '面接への同行があるので、職場の雰囲気を確かめながら選考を進められます。',
          info: '全国・全診療科の求人を扱っているので、まずはどんな選択肢があるのかを知るのに向いています。',
        },
      },
    ],
    pharmacist: [
      {
        id: 'mynavi-pharma',
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
        reasons: {
          salary: '年収交渉の代行があり、非公開求人も紹介してもらえるので、条件のよい職場を探しやすくなります。',
          wlb: '調剤薬局・ドラッグストア・病院・企業など幅広い求人から、働き方に合う職場を比べられます。',
          career: '病院や一般企業など、いまとは違う分野の求人も含めてキャリアの選択肢を広げられます。',
          env: '専任のキャリアアドバイザーに、いまの悩みや次の職場に求めることを相談できます。',
          info: '電話やオンラインでも相談できるので、忙しい中でも自分のペースで情報を集められます。',
        },
      },
      {
        id: 'pharmastaff',
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
        reasons: {
          salary: 'コンサルタントが給与や休日の条件交渉まで支援するので、納得できる条件を目指しやすくなります。',
          wlb: '正社員のほか派遣の求人も扱っているので、勤務日数や時間を調整しやすい働き方も選べます。',
          career: '日本調剤の教育ノウハウを活かした教育サービスがあり、転職後も学び続けたい人に向いています。',
          env: '全国の支店で対面の相談ができ、転職後のフォローもあるので、職場の悩みを相談しながら進められます。',
          info: '支店・電話・メール・Webと相談方法を選べるので、気軽に話を聞くところから始められます。',
        },
      },
    ],
    nurse: [
      {
        id: 'mynavi-nurse',
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
        reasons: {
          salary: '条件交渉の代行があり、幅広い職場の求人から条件を比べられるので、待遇の見直しに役立ちます。',
          wlb: 'クリニック・介護施設・訪問看護ステーション・企業など、夜勤の少ない働き方も含めて選択肢を広げられます。',
          career: '病院から企業まで幅広い求人があり、面接対策や書類添削も受けられるので、新しい分野に挑戦しやすくなります。',
          env: 'キャリアアドバイザーが施設に足を運んで現場の情報を集めているので、求人票だけではわからない雰囲気を聞けます。',
          info: '求人紹介から内定まで無料でサポートを受けられるので、まずは相談して選択肢を知るところから始められます。',
        },
      },
      {
        id: 'levwell-nurse',
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
        reasons: {
          salary: '給与や勤務条件の交渉に加えて退職交渉まで相談できるので、条件アップを目指す転職を進めやすくなります。',
          wlb: '勤務地を市区町村・路線・駅から探せるので、通勤しやすさも含めて暮らしに合う職場を選べます。',
          career: '模擬面接や履歴書のサポートがあるので、希望の職場に挑戦するときの選考対策ができます。',
          env: '退職交渉まで相談できるので、いまの職場を円満に離れて新しい環境へ移りやすくなります。',
          info: 'LINEでも相談できるので、すき間時間に気軽に情報を集められます。',
        },
      },
    ],
  },

  // ---------------------------------------------------------
  // タイプ別のおすすめ順(職種ごと)
  // ▼ 診断結果のタイプに合わせて、上の services をこの順に表示します。
  //   先頭のサービスに「あなたにいちばんおすすめ」のバッジが付きます。
  //   書かれていないサービスは、末尾に services の並び順で表示します。
  // ---------------------------------------------------------
  recommendOrder: {
    doctor: {
      salary: ['dr10', 'doctorvision'],
      wlb:    ['doctorvision', 'dr10'],
      career: ['dr10', 'doctorvision'],
      env:    ['doctorvision', 'dr10'],
      info:   ['doctorvision', 'dr10'],
    },
    pharmacist: {
      salary: ['mynavi-pharma', 'pharmastaff'],
      wlb:    ['pharmastaff', 'mynavi-pharma'],
      career: ['pharmastaff', 'mynavi-pharma'],
      env:    ['pharmastaff', 'mynavi-pharma'],
      info:   ['mynavi-pharma', 'pharmastaff'],
    },
    nurse: {
      salary: ['levwell-nurse', 'mynavi-nurse'],
      wlb:    ['mynavi-nurse', 'levwell-nurse'],
      career: ['mynavi-nurse', 'levwell-nurse'],
      env:    ['mynavi-nurse', 'levwell-nurse'],
      info:   ['levwell-nurse', 'mynavi-nurse'],
    },
  },
};


/* =========================================================
   A-2. QUESTIONS(質問・選択肢・スコア)
   ---------------------------------------------------------
   ・1問目は職種を選ぶ質問です(job を持つ選択肢)。スコアには影響しません。
   ・2問目以降の選択肢の score に、加算するタイプと点数を書きます。
       salary : 年収アップ追求タイプ
       wlb    : ワークライフバランス重視タイプ
       career : キャリアアップ挑戦タイプ
       env    : 職場環境リセットタイプ
       info   : じっくり情報収集タイプ
     例) score: { salary: 3, env: 1 } → 年収に3点、職場環境に1点
   ・質問は 8〜10問、選択肢は 3〜4択を目安にしてください。
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
  {
    text: 'いまの職場で、いちばん変えたいことは何ですか?',
    options: [
      { label: '給与や手当',                   score: { salary: 3 } },
      { label: '勤務時間・夜勤や当直・休日',   score: { wlb: 3 } },
      { label: '経験できる業務や成長の機会',   score: { career: 3 } },
      { label: '人間関係や職場の雰囲気',       score: { env: 3 } },
    ],
  },
  {
    text: '転職を考えはじめたきっかけに、いちばん近いものは?',
    options: [
      { label: '頑張りが給与に反映されていないと感じた',     score: { salary: 3 } },
      { label: '体力面や家庭の事情で、働き方を変えたくなった', score: { wlb: 3 } },
      { label: 'もっと専門性を高めたいと思った',             score: { career: 3 } },
      { label: '今の職場で働き続ける事が想像できないため', score: { info: 3 } },
    ],
  },
  {
    text: '転職したい時期は、いつごろですか?',
    options: [
      { label: 'できるだけ早く環境を変えたい',     score: { env: 2, salary: 1 } },
      { label: '半年以内には動きたい',             score: { salary: 1, career: 1, wlb: 1 } },
      { label: 'よいところがあれば考えたい',       score: { info: 2, salary: 1 } },
      { label: 'まだ決めていない',                 score: { info: 3 } },
    ],
  },
  {
    text: '休日の過ごし方として、理想に近いのは?',
    options: [
      { label: '勉強会や学会で知識を深めたい',     score: { career: 3 } },
      { label: '家族や趣味の時間をゆっくり楽しみたい', score: { wlb: 3 } },
      { label: '空いた時間は収入アップにつなげたい', score: { salary: 2 } },
      { label: 'とにかく心身を休めたい',           score: { env: 2, wlb: 1 } },
    ],
  },
  {
    text: '求人を見るとき、いちばん気になる情報は?',
    options: [
      { label: '年収や各種手当',               score: { salary: 3 } },
      { label: '残業時間・休日数・勤務体制',   score: { wlb: 3 } },
      { label: '教育体制や扱う症例・業務の幅', score: { career: 3 } },
      { label: '職場の雰囲気や離職率',         score: { env: 3 } },
    ],
  },
  {
    text: '転職サービスに、いちばん期待することは?',
    options: [
      { label: '給与や条件の交渉を代わりにしてほしい', score: { salary: 3 } },
      { label: '長い目でのキャリア相談にのってほしい', score: { career: 3 } },
      { label: '職場の内部事情を教えてほしい',         score: { env: 3 } },
      { label: '自分のペースで求人を見たい',           score: { info: 3 } },
    ],
  },
  {
    text: '5年後、どんな働き方をしていたいですか?',
    options: [
      { label: 'いまより収入が上がり、余裕のある暮らし', score: { salary: 3 } },
      { label: '仕事とプライベートを無理なく両立',       score: { wlb: 3 } },
      { label: '専門性を活かして、頼られる立場に',       score: { career: 3 } },
      { label: '具体的にはまだ考えていない',             score: { info: 2, env: 1 } },
    ],
  },
];


/* =========================================================
   A-3. RESULTS(タイプ別の結果文言)
   ---------------------------------------------------------
   各項目の意味:
     name        : ① タイプ名
     catchCopy   : タイプ名の下に出る一言
     features    : ② このタイプの特徴(1要素=1行)
     message     : 迷っている人への一言
     nextSteps   : 次にやること(番号付きリスト)
   ※ おすすめサービスは、職種とタイプの組み合わせで CONFIG.recommendOrder の
     順に並び、各サービスの reasons からタイプ別の理由を表示します。
   ========================================================= */
const RESULTS = {
  salary: {
    name: '年収アップ追求タイプ',
    catchCopy: '積み重ねてきた経験を、正当な評価へ。',
    features: [
      'これまでの経験やスキルを、きちんと評価してほしいと考える前向きな現実派です。',
      '条件を比較し、納得したうえで職場を選びたい気持ちが強いタイプです。',
      '必要であれば、給与や手当の交渉にも前向きに取り組めます。',
      '相場の情報と交渉のサポートがあると、強みをより活かしやすくなります。',
    ],
    message: '「年収を上げたい」と考えるのは、決してわがままではありません。まずは自分の経験がどう評価されるのかを知るところから始めてみませんか。転職するかどうかは、そのあとでゆっくり決めて大丈夫です。',
    nextSteps: [
      '気になるサービスに無料登録する(まずは1〜2社でOK)',
      '担当者に、希望年収・勤務地・働き方を伝える',
      '紹介された求人で、年収や手当の相場を確認する',
      '比較したうえで、応募するかどうかをじっくり判断する',
    ],
  },

  wlb: {
    name: 'ワークライフバランス重視タイプ',
    catchCopy: '仕事も、自分の時間も、どちらも大切に。',
    features: [
      '仕事にやりがいを感じつつも、心身や家庭とのバランスを大切にしたいタイプです。',
      '夜勤・当直・残業などの負担を見直し、長く無理なく働ける環境を求めています。',
      '勤務時間や休日数など、働き方の条件をていねいに確認したいと考えています。',
      '希望の条件で絞り込める求人に出会えると、満足度の高い転職につながりやすいタイプです。',
    ],
    message: '働き方を見直したいと思うのは、仕事をこれからも長く続けるための大切な一歩です。いまの職場で頑張り続けるか、環境を変えるか。比べられる材料をそろえてから決めても遅くはありません。',
    nextSteps: [
      '気になるサービスに無料登録する(まずは1〜2社でOK)',
      '勤務時間・休日・夜勤や当直の有無など、希望条件を整理して伝える',
      '紹介された求人の、実際の残業時間や休みの取りやすさを確認する',
      'いまの職場と比べて、納得できる選択肢かどうかを判断する',
    ],
  },

  career: {
    name: 'キャリアアップ挑戦タイプ',
    catchCopy: '専門性を磨いて、次のステージへ。',
    features: [
      '学び続けることに前向きで、専門性を高めたい意欲が強いタイプです。',
      '認定資格の取得や新しい分野への挑戦、管理職へのステップアップを視野に入れています。',
      '目先の条件だけでなく、数年後の自分にとってプラスになる職場を選びたいと考えています。',
      '長い目でキャリアを一緒に考えてくれる相談相手がいると、心強く進められます。',
    ],
    message: '挑戦したい気持ちがあるときは、選択肢を広げる絶好のタイミングです。とはいえ、焦って決める必要はありません。まずは「どんな道があるのか」を知ることから始めてみてください。',
    nextSteps: [
      '気になるサービスに無料登録する(まずは1〜2社でOK)',
      '目指したい専門分野や将来像を、担当者に伝える',
      '教育体制・症例数・業務の幅などを求人ごとに比較する',
      '数年後の自分にとってプラスになるかを基準に判断する',
    ],
  },

  env: {
    name: '職場環境リセットタイプ',
    catchCopy: '自分らしく働ける場所は、きっと見つかる。',
    features: [
      '仕事そのものより、人間関係や職場の雰囲気に悩みを感じているタイプです。',
      '周囲への気配りができる一方で、そのぶん負担を抱えこみやすい面もあります。',
      '次の職場では、安心して働ける雰囲気やチームワークを大切にしたいと考えています。',
      '求人票だけではわからない「職場の中のこと」を知ってから選ぶと、ミスマッチを防ぎやすくなります。',
    ],
    message: '職場の人間関係に悩むのは、あなたが弱いからではありません。環境が合っていないだけ、ということもよくあります。まずは話を聞いてもらうだけでも、気持ちの整理につながるはずです。',
    nextSteps: [
      '気になるサービスに無料登録する(まずは1〜2社でOK)',
      'いまの職場で悩んでいることと、次の職場に求める雰囲気を伝える',
      '気になる求人について、職場の雰囲気や離職率を確認する',
      '可能であれば見学などを通じて、実際の雰囲気を確かめてから判断する',
    ],
  },

  info: {
    name: 'じっくり情報収集タイプ',
    catchCopy: 'まずは知ることから。あなたのペースで。',
    features: [
      '転職に興味はあるものの、まだ具体的には決めていない慎重派です。',
      'いまの職場と比べながら、どんな選択肢があるのかを冷静に見極めたいタイプです。',
      '勢いで決めるより、情報をそろえて納得してから動きたいと考えています。',
      '自分のペースで情報を集められる方法を選ぶと、無理なく検討を進められます。',
    ],
    message: '「まだ迷っている」というのも、立派なひとつの答えです。情報を知ったうえで、いまの職場に残ると決めるのも前向きな選択。まずは気軽にのぞいてみるところから始めてみませんか。',
    nextSteps: [
      '気になるサービスに無料登録する(まずは1〜2社でOK)',
      '気になる地域や働き方で、求人をいくつか見てみる',
      'いまの職場と、給与や働き方を比べてみる',
      '気になる求人が見つかったら、詳しい話を聞くか検討する',
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

// 文言中の {service} {job} {type} を置き換える
function fillText(text, vars) {
  return text
    .replace(/\{service\}/g, vars.service || '')
    .replace(/\{job\}/g, vars.job || '')
    .replace(/\{type\}/g, vars.type || '');
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
  const buttons = question.options.map((option, optionIndex) => {
    const btn = createEl('button', 'option', option.label);
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

// 回答からタイプと職種を判定する
function calculateResult() {
  // 職種は1問目の回答から取得
  let job = null;
  // タイプごとのスコアを 0 で用意
  const scores = Object.fromEntries(CONFIG.typePriority.map((type) => [type, 0]));

  QUESTIONS.forEach((question, qIndex) => {
    const option = question.options[state.answers[qIndex]];
    if (!option) return;
    if (option.job) job = option.job;
    if (option.score) {
      Object.entries(option.score).forEach(([type, point]) => {
        if (type in scores) scores[type] += point;
      });
    }
  });

  // 最高得点のタイプを選ぶ。同点なら typePriority で先にあるタイプが残る
  let bestType = CONFIG.typePriority[0];
  CONFIG.typePriority.forEach((type) => {
    if (scores[type] > scores[bestType]) bestType = type;
  });

  return { type: bestType, job: job || Object.keys(CONFIG.jobs)[0], scores };
}

/* ---------- B-6. 結果画面 ---------- */

// 職種とタイプから、おすすめ順に並べたサービス一覧を返す
function getRecommendedServices(job, type) {
  const services = CONFIG.services[job] || [];
  const order = (CONFIG.recommendOrder[job] || {})[type] || [];
  const rank = (service) => {
    const i = order.indexOf(service.id);
    return i === -1 ? order.length + services.indexOf(service) : i;
  };
  return [...services].sort((a, b) => rank(a) - rank(b));
}

// サービス紹介カードを作る(サービスごとに1枚)
function buildServiceCard(service, type, isTop) {
  const vars = { service: service.name };
  const card = createEl('article', isTop ? 'service-card service-card--top' : 'service-card');
  if (isTop) card.append(createEl('p', 'service-card__badge', CONFIG.topBadge));
  card.append(createEl('h4', 'service-card__name', service.name));
  card.append(createEl('p', 'service-card__operator', `運営:${service.operator}`));
  card.append(createEl('p', 'service-card__summary', service.summary));

  // タイプ別の「おすすめの理由」
  const reason = service.reasons && service.reasons[type];
  if (reason) {
    const box = createEl('div', 'service-card__reason');
    box.append(createEl('p', 'service-card__reason-heading', CONFIG.reasonHeading));
    box.append(createEl('p', 'service-card__reason-text', reason));
    card.append(box);
  }

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
  const { type, job } = calculateResult();
  const result = RESULTS[type];
  const services = getRecommendedServices(job, type);
  const vars = { job: CONFIG.jobs[job], type: result.name };

  // ① タイプ名
  $('result-job').textContent = `${CONFIG.jobs[job]}のあなたは…`;
  $('result-type-name').textContent = result.name;
  $('result-catch').textContent = result.catchCopy;

  // ② 特徴
  $('result-features').replaceChildren(
    ...result.features.map((line) => createEl('p', '', fillText(line, vars)))
  );

  // ③ おすすめサービス(職種×タイプでおすすめ順に)
  $('result-services-heading').textContent = fillText(CONFIG.servicesHeading, vars);
  $('result-services-lead').textContent = fillText(CONFIG.servicesLead, vars);
  $('result-services').replaceChildren(
    ...services.map((service, i) => buildServiceCard(service, type, i === 0))
  );
  $('result-services-note').textContent = CONFIG.servicesNote;

  // ④ 迷っている人への一言
  $('result-message').textContent = fillText(result.message, vars);

  // ⑤ 次にやること
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
