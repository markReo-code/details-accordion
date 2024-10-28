class Accordion {
    static #OPENED = "opened"; //開いている時
    static #OPENING = "opening"; //開いている途中
    static #CLOSED = "closed"; //閉じている時
    static #CLOSING = "closing"; //閉じている途中
  
    #details;
    #summary;
    #content;
    #duration = 300;
    #timingFunction = "ease";
    #delay = 0 ;
    #activeClass = "accordionIsOpen"
    #_status;  // 現在のアコーディオンの状態を格納
  
    constructor(options) {
      this.#details = options.target;
      this.#summary = this.#details.querySelector("summary");
      this.#content = this.#details.querySelector("summary + *");
      this.#status = Accordion.#CLOSED;
  
      // オプションで指定されていればそれを使用、なければデフォルト値を使用
      this.#duration = options.duration ?? this.#duration;
      this.#timingFunction = options.timingFunction ?? this.#timingFunction;
      this.#delay = options.delay ?? this.#delay;
  
       // detailsタグにアニメーションの設定を適用
      this.#details.style.transition = `height ${this.#duration}ms ${this.#timingFunction} ${this.#delay}ms`
      this.#details.style.overflow = "hidden";
      this.#activeClass = options.activeClass ?? this.#activeClass; // 開閉時に使用するクラスを設定
  
      this.#summary.addEventListener("click", (e) => {
        this.#toggle(e);
      });
  
      this.#details.addEventListener('transitionend', () => {
          this.#onTransitionEnd();
      })
    }
  
    get #status() {
      return this.#_status;
    }
  
    set #status(status) {
      this.#_status = status; // 状態を更新
  
      switch (status) {
        case Accordion.#OPENED:
          this.#details.setAttribute("open", ""); //open属性あり
          this.#details.classList.add(this.#activeClass);
          this.#details.style.height = "auto"; // 高さを自動調整
          break;
  
        case Accordion.#OPENING:
          this.#details.setAttribute("open", ""); //open属性あり
          this.#details.classList.add(this.#activeClass);
          this.#details.style.height = this.#openingHeight; // 高さを自動調整
          break;
  
        case Accordion.#CLOSED:
          this.#details.removeAttribute("open"); //open属性なし
          this.#details.classList.remove(this.#activeClass);
          this.#details.style.height = "auto"; // 高さを自動調整
          break;
  
        case Accordion.#CLOSING:
          this.#details.setAttribute("open", ""); //open属性あり
          this.#details.classList.remove(this.#activeClass);
          this.#details.style.height = this.#closingHeight; // 閉じる時の高さを設定
          break;
      }
    }
  
    // 開くときの高さを計算
    get #openingHeight() {
      return (
        this.#summary.getBoundingClientRect().height + //summaryタグの高さ
        this.#content.getBoundingClientRect().height + //コンテンツ部分の高さ
        this.#getVerticalBorderWidth() + // ボーダーの上下の合計を取得
        "px"
      );
    }
  
    // 閉じるときの高さを計算（summaryタグの高さのみ）
    get #closingHeight() {
      return (
          this.#summary.getBoundingClientRect().height + 
          this.#getVerticalBorderWidth() +
          "px"
      )
    }
  
    // detailsの上下ボーダーの合計値を取得
    #getVerticalBorderWidth() {
      const computedStyle = getComputedStyle(this.#details)
      const borderTopWidth = parseInt(
          computedStyle.getPropertyValue("border-top-width")
      );
      const borderBottomWidth = parseInt(
          computedStyle.getPropertyValue("border-bottom-width")
      );
      return borderTopWidth + borderBottomWidth;  // 上下のボーダー幅を足す
    }
  
    // アコーディオンの開閉を制御する関数
    #toggle(e) {
      e.preventDefault();
  
      switch (this.#status) {
        case Accordion.#OPENED:
          this.#details.style.height = this.#openingHeight; // 一旦固定の値にする
          setTimeout(() => {
            this.#status = Accordion.#CLOSING; // 一瞬遅らせて#statusを変える
          }, 10);
          break;
  
        case Accordion.#OPENING:
          this.#status = Accordion.#CLOSING;
          break;
  
        case Accordion.#CLOSED:
          this.#details.style.height = this.#closingHeight;
          setTimeout(() => {
            this.#status = Accordion.#OPENING; // 一瞬遅らせて#statusを変える
          }, 10);
          break;
  
        case Accordion.#CLOSING:
          this.#status = Accordion.#OPENING;
          break;
      }
    }
  
    // トランジション終了時に呼ばれる関数
    #onTransitionEnd() {
      if (this.#status === Accordion.#CLOSING) {
          this.#status = Accordion.#CLOSED;　// 閉じ終わったら状態をCLOSEDに変更
          return; // 処理終了
      }
  
      if (this.#status === Accordion.#OPENING) {
          this.#status = Accordion.#OPENED; // 開き終わったら状態をOPENEDに変更
          return; // 処理終了
      }
    }
    
  }
  
  // 各detailsタグに対してアコーディオンを初期化
  document.querySelectorAll(".accordion").forEach((element, index) => {
    new Accordion({
      target: element,
      duration: 300,
      timingFunction: "ease",
      delay: 50,
    });
  });
  