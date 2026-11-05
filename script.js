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

   ※ 文言中の {service} は紹介サービス名、{job} は職種名に自動で置き換わります。
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

  // CTAボタンの文言({service} はサービス名に置き換わります)
  ctaLead: 'あなたのタイプにおすすめのサービス',
  ctaButtonLabel: '{service}に無料登録する',
  ctaNote: '登録は無料です。まずは求人を見るだけでも大丈夫です。',

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
  // 紹介サービスとCTAリンク(職種 × タイプ)
  // ▼ リンクやサービス名を差し替えるときは、ここだけを編集してください。
  //   結果画面の上下2つのCTAボタンに自動で反映されます。
  //   ※ 現在はすべて仮のサービス名・仮URLです。
  // ---------------------------------------------------------
  services: {
    doctor: {
      salary: { name: '(仮)ドクター年収ナビ',     url: 'https://example.com/doctor/salary' },
      wlb:    { name: '(仮)ドクターゆとり求人',   url: 'https://example.com/doctor/wlb' },
      career: { name: '(仮)ドクターキャリア相談', url: 'https://example.com/doctor/career' },
      env:    { name: '(仮)ドクター職場ナビ',     url: 'https://example.com/doctor/env' },
      info:   { name: '(仮)ドクタースカウト',     url: 'https://example.com/doctor/info' },
    },
    pharmacist: {
      salary: { name: '(仮)ファーマ年収ナビ',     url: 'https://example.com/pharmacist/salary' },
      wlb:    { name: '(仮)ファーマゆとり求人',   url: 'https://example.com/pharmacist/wlb' },
      career: { name: '(仮)ファーマキャリア相談', url: 'https://example.com/pharmacist/career' },
      env:    { name: '(仮)ファーマ職場ナビ',     url: 'https://example.com/pharmacist/env' },
      info:   { name: '(仮)ファーマスカウト',     url: 'https://example.com/pharmacist/info' },
    },
    nurse: {
      salary: { name: '(仮)ナース年収ナビ',     url: 'https://example.com/nurse/salary' },
      wlb:    { name: '(仮)ナースゆとり求人',   url: 'https://example.com/nurse/wlb' },
      career: { name: '(仮)ナースキャリア相談', url: 'https://example.com/nurse/career' },
      env:    { name: '(仮)ナース職場ナビ',     url: 'https://example.com/nurse/env' },
      info:   { name: '(仮)ナーススカウト',     url: 'https://example.com/nurse/info' },
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
      { label: '特にきっかけはなく、なんとなく気になっている', score: { info: 3 } },
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
     reason      : ④ おすすめ理由
     suitableFor : ⑤ 向いている人(箇条書き)
     merits      : ⑥ いま動きはじめるメリット(箇条書き)
     message     : ⑦ 迷っている人への一言
     nextSteps   : ⑧ 次にやること(番号付きリスト)
   ※ CTAリンクは CONFIG.services から自動で取得します。
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
    reason: '年収アップを目指すなら、{job}の求人を多く扱い、条件交渉のサポートを受けられるエージェント型のサービスが向いています。{service}では、担当者が給与水準や手当の相場を踏まえて求人を紹介し、自分では切り出しにくい条件面の確認や交渉も相談しながら進められます。',
    suitableFor: [
      'いまの給与が、仕事内容や経験に見合っていないと感じている',
      '自分の市場価値(年収相場)を知りたい',
      '条件交渉を一人で進めるのは不安がある',
      '複数の求人を比較して、納得して選びたい',
    ],
    merits: [
      '自分の経験で、どのくらいの年収が目安になるかを早めに把握できます。',
      '求人は時期によって入れ替わるため、早めに登録しておくと比較できる選択肢が増えます。',
      '登録しても、すぐに転職する必要はありません。相場を知るだけでも、いまの職場での判断材料になります。',
    ],
    message: '「年収を上げたい」と考えるのは、決してわがままではありません。まずは自分の経験がどう評価されるのかを知るところから始めてみませんか。転職するかどうかは、そのあとでゆっくり決めて大丈夫です。',
    nextSteps: [
      '{service}に無料登録する',
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
    reason: '働き方を見直したい方には、日勤のみ・残業少なめ・土日休みなど、勤務条件で求人を探しやすいサービスが向いています。{service}では、{job}向けに勤務時間や休日数などの条件を細かく伝えたうえで求人を紹介してもらえるため、求人票だけではわかりにくい実際の働き方も確認しやすくなります。',
    suitableFor: [
      '夜勤や当直、残業の負担を減らしたい',
      '子育てや介護など、家庭と両立できる職場を探している',
      '休日をしっかり確保したい',
      '体調を崩す前に、働き方を見直したい',
    ],
    merits: [
      '希望する働き方の求人が、どのくらいあるのかを把握できます。',
      '働き方を変える選択肢を知っておくだけでも、気持ちに余裕が生まれます。',
      '登録後も、自分のタイミングで求人を検討できます。',
    ],
    message: '働き方を見直したいと思うのは、仕事をこれからも長く続けるための大切な一歩です。いまの職場で頑張り続けるか、環境を変えるか。比べられる材料をそろえてから決めても遅くはありません。',
    nextSteps: [
      '{service}に無料登録する',
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
    reason: 'キャリアアップを目指すなら、{job}の専門分野や将来像まで踏まえて相談できるエージェント型のサービスが向いています。{service}では、教育体制や扱う症例・業務の幅といった、成長につながる情報を確認しながら求人を検討できます。すぐの転職だけでなく、中長期のキャリア相談として利用するのもひとつの方法です。',
    suitableFor: [
      '専門性を高められる職場で働きたい',
      '認定資格の取得や新しい分野への挑戦を考えている',
      '将来的に管理職やリーダーを目指したい',
      'キャリアの方向性について、第三者の意見を聞きたい',
    ],
    merits: [
      '自分の経験が、どんな分野・ポジションで活かせるかを客観的に知ることができます。',
      '教育体制の整った職場など、条件のよい求人は早く埋まることもあるため、情報を早めに受け取れます。',
      'すぐに転職しない場合でも、これからのキャリアプランを考えるきっかけになります。',
    ],
    message: '挑戦したい気持ちがあるときは、選択肢を広げる絶好のタイミングです。とはいえ、焦って決める必要はありません。まずは「どんな道があるのか」を知ることから始めてみてください。',
    nextSteps: [
      '{service}に無料登録する',
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
    reason: '職場環境を変えたい方には、職場の雰囲気や人間関係、離職率などの内部事情に詳しいサービスが向いています。{service}では、担当者が{job}の職場の様子を把握したうえで求人を紹介してくれるため、入職前に「どんな人が働いているか」「どんな雰囲気か」を確認しやすくなります。',
    suitableFor: [
      '人間関係に悩んでいて、環境を変えたい',
      '次の職場では、雰囲気や人間関係で失敗したくない',
      '離職率や職場の雰囲気など、求人票にない情報を知りたい',
      '自分に合う職場を、相談しながら探したい',
    ],
    merits: [
      '職場の雰囲気や離職率など、自分だけでは調べにくい情報を得られます。',
      '「ほかにも選択肢がある」と知るだけで、いまの職場での気持ちが楽になることもあります。',
      '登録したからといって、必ず転職しなければいけないわけではありません。',
    ],
    message: '職場の人間関係に悩むのは、あなたが弱いからではありません。環境が合っていないだけ、ということもよくあります。まずは話を聞いてもらうだけでも、気持ちの整理につながるはずです。',
    nextSteps: [
      '{service}に無料登録する',
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
    reason: 'まだ情報収集の段階なら、自分のペースで求人を見られるスカウト型やサイト型のサービスが向いています。{service}は、{job}の求人を気軽に閲覧したり、プロフィールを登録して声がかかるのを待ったりできるタイプのサービスです。気になる求人が見つかってから、相談するかどうかを決められます。',
    suitableFor: [
      '転職するかどうか、まだ決めていない',
      'まずは求人の相場や、どんな職場があるかを知りたい',
      '担当者とのやりとりは、最小限にしたい',
      'よい条件の求人があれば考えたい',
    ],
    merits: [
      '求人の相場を知っておくと、いまの職場の条件を客観的に見直せます。',
      'いざ転職したくなったときに、スムーズに動き出せます。',
      '自分のペースで使えるので、忙しい時期でも負担になりにくいです。',
    ],
    message: '「まだ迷っている」というのも、立派なひとつの答えです。情報を知ったうえで、いまの職場に残ると決めるのも前向きな選択。まずは気軽にのぞいてみるところから始めてみませんか。',
    nextSteps: [
      '{service}に無料登録する',
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

// CTAボックスを作る(上下2か所で同じものを使う)
function buildCta(service, vars) {
  const fragment = document.createDocumentFragment();
  fragment.append(createEl('p', 'cta__lead', CONFIG.ctaLead));
  fragment.append(createEl('p', 'cta__service', service.name));

  const link = createEl('a', 'btn btn--cta');
  link.href = service.url;
  link.target = '_blank';
  link.rel = 'noopener sponsored';
  link.append(createEl('span', '', fillText(CONFIG.ctaButtonLabel, vars)));
  const arrow = createEl('span', 'btn__arrow', '→');
  arrow.setAttribute('aria-hidden', 'true');
  link.append(arrow);
  fragment.append(link);

  fragment.append(createEl('p', 'cta__note', CONFIG.ctaNote));
  return fragment;
}

// 結果を表示する
function showResult() {
  const { type, job } = calculateResult();
  const result = RESULTS[type];
  const service = CONFIG.services[job][type];
  const vars = { service: service.name, job: CONFIG.jobs[job] };

  // ① タイプ名
  $('result-job').textContent = `${CONFIG.jobs[job]}のあなたは…`;
  $('result-type-name').textContent = result.name;
  $('result-catch').textContent = result.catchCopy;

  // ② 特徴
  $('result-features').replaceChildren(
    ...result.features.map((line) => createEl('p', '', fillText(line, vars)))
  );

  // ③⑨ CTA(上下2か所)
  document.querySelectorAll('[data-cta-box]').forEach((box) => {
    box.replaceChildren(buildCta(service, vars));
  });

  // ④ おすすめ理由
  $('result-reason').textContent = fillText(result.reason, vars);

  // ⑤ 向いている人
  renderList($('result-suitable'), result.suitableFor, vars);

  // ⑥ メリット
  renderList($('result-merits'), result.merits, vars);

  // ⑦ 迷っている人への一言
  $('result-message').textContent = fillText(result.message, vars);

  // ⑧ 次にやること
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
