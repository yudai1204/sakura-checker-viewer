const MAX_TRY = 100;

const css = `<style>
    .sakura-checker-parent,.review-meta-parent {
      margin-bottom: 15px;
    }
    .sakura-checker {
      display: block;
      margin-top: 5px;
    }
    .sakura-checker:hover {
      text-decoration: none;
    }
    .sakura-checker:hover .item-info {
      border: 3px solid #ec697b;
      background-color: #fff5f7;
    }
    .sakura-checker * {
      text-decoration: none;
      color: #333;
    }
    .sakura-checker .item-info {
      text-align: center;
      border: 3px solid #ffd5df;
      padding: 10px 5px 10px 0;
    }
    .sakura-checker .item-review-box {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .sakura-checker .item-review-after {
      padding: 0 10px;
    }
    .sakura-checker .item-logo img {
      height: 20px;
    }
    .sakura-checker .item-rating {
      font-size: 18px;
      line-height: 1.1;
      padding: 0;
      color: #666;
    }
    .sakura-checker .item-rating span {
      font-size: 42px;
      background: url(https://sakura-checker.jp/images/icon_star.png) no-repeat left 17px;
      background-size: 22px auto;
      padding-left: 26px;
      color: #e5374f;
      display: inline-flex;
      background-position-y: center;
    }
    .sakura-checker .item-rating span img {
      height: 30px;
      width: auto;
    }
    .sakura-checker .item-num {
      font-size: 13px;
      padding: 3px 0;
    }
    .sakura-checker .boldtxt {
      font-weight: bold;
    }
    .sakura-checker .item-review-level img{
      width: auto;
      height: 60px;
    }
    .sakura-checker .icon {
      max-width: 15px;
      max-height: 15px;
    }
    .review-meta .star-rating {
      padding: 0px 5px 0px 5px;
      border-radius: 5px;
      width: 100px;
      margin: 0 auto;
      margin-bottom: 3px;
      margin-top: 0px;
    }
    .review-meta {
      background-color: #FEFFEF;
    }
    .review-meta:hover {
      text-decoration: none;
    }
    .review-meta .star-rating span, .star-rating-inline span {
      display: block;
      height: 18px;
    }
    .review-meta .star-rating .star-gray {
      width: 90px;
      background: url(https://reviewmeta.com/public/imgs/reviewmeta/rm-star-rating-back.png) repeat-x;
    }
    .review-meta .star-rating .star-orange {
      background: url(https://reviewmeta.com/public/imgs/reviewmeta/rm-star-rating-front.png) repeat-x;
      float: left !important;
    }
    .review-meta fieldset {
      display: block;
      margin-inline-start: 2px;
      margin-inline-end: 2px;
      padding-block-start: 0.35em;
      padding-inline-start: 0.75em;
      padding-inline-end: 0.75em;
      padding-block-end: 0.625em;
      min-inline-size: min-content;
      border-width: 2px;
      border-style: groove;
      border-color: rgb(192, 192, 192);
      border-image: initial;
      border: 1px solid #c0c0c0;
      margin: 0 2px;
      padding: 0.35em 0.625em 0.75em;
    }
    .review-meta fieldset.adj-rtg {
      border: 2px solid #9ebee1;
      padding: 0 1.4em 1.4em 1.4em !important;
      margin: 0 !important;
      -webkit-box-shadow: 0px 0px 0px 0px #000;
      box-shadow: 0px 0px 0px 0px #000;
      text-align: center;
    }
    .review-meta:hover fieldset.adj-rtg {
      border: 2px solid #3D7DC2;
      background-color: #FEFFEF;
    }
    .review-meta legend {
      display: block;
      width: 100%;
      padding: 0;
      margin-bottom: 20px;
      font-size: 21px;
      line-height: inherit;
      color: #333;
      border: 0;
      border-bottom: 1px solid #e5e5e5;
    }
    .review-meta legend.adj-rtg {
      width: inherit;
      padding: 0 10px;
      border-bottom: none;
      margin-bottom: 0px !important;
    }
    .review-meta .orig-rating {
      display: block;
      font-size: 30px;
      color: #2374bb;
      margin: 0;
      font-weight: bold;
      line-height: 1.2;
      text-align: center;
    }
    .review-meta legend img {
      height: 30px;
      width: auto;
      min-width: 115px;
    }

    .sakura-checker .item-rating {
      min-width: 125px;
    }
    @media screen and (min-width: 1280px) {
      .sakura-checker-extension-result {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
      }
      .review-meta,.sakura-checker {
        min-width: 250px;
      }
    }
    </style>`;

const getASIN = function (url) {
  const asinPtn = new RegExp("(?<=/)[A-Z\\d]{10}(?=[/?])");
  const match = url.match(asinPtn);
  if (match === null) {
    return null;
  }
  return match[0];
};

const replacer = (html) => {
  return html
    .replaceAll('src="/', 'src="https://sakura-checker.jp/')
    .replaceAll('href="/', 'src="https://sakura-checker.jp/');
};

const insertMain = () => {
  let maxTry = MAX_TRY;
  const interval = setInterval(() => {
    const insertArea = document.getElementById("averageCustomerReviews");
    if (insertArea !== null) {
      clearInterval(interval);
      insertArea.insertAdjacentHTML("afterend", css);

      const resultBox = document.createElement("div");
      resultBox.classList.add("sakura-checker-extension-result");
      const sakuraCheckerResult = document.createElement("div");
      sakuraCheckerResult.setAttribute("id", "sakura-checker-result");
      const reviewMetaResult = document.createElement("div");
      reviewMetaResult.setAttribute("id", "review-meta-result");
      resultBox.insertAdjacentElement("afterbegin", sakuraCheckerResult);
      resultBox.insertAdjacentElement("beforeend", reviewMetaResult);
      insertArea.insertAdjacentElement("afterend", resultBox);
      return;
    } else {
      maxTry--;
      if (maxTry < 0) {
        clearInterval(interval);
      }
    }
  }, 400);
};

const sakuraChecker = async (asin) => {
  const targetUrl = "https://sakura-checker.jp/search/" + asin;
  const response = await chrome.runtime.sendMessage({
    action: "get",
    url: targetUrl,
  });
  const parser = new DOMParser();
  const doc = parser.parseFromString(response.html, "text/html");
  const score = replacer(doc.querySelector(".item-info").outerHTML);
  const box = document.createElement("a");
  box.classList.add("sakura-checker");
  box.setAttribute("href", targetUrl);
  box.setAttribute("target", "_blank");
  box.insertAdjacentHTML("afterBegin", score);
  const parentBox = document.createElement("div");
  parentBox.classList.add("sakura-checker-parent");
  parentBox.insertAdjacentElement("afterbegin", box);
  // parentBox.insertAdjacentHTML(
  //   "beforeEnd",
  //   `<a href="${targetUrl}" target="_blank" style="margin-left:10px">サクラチェッカーで詳細を見る</a>`
  // );

  let maxTry = MAX_TRY;
  const interval = setInterval(() => {
    const insertArea = document.getElementById("sakura-checker-result");
    if (insertArea !== null) {
      clearInterval(interval);
      insertArea.insertAdjacentElement("afterBegin", parentBox);
    } else {
      maxTry--;
      if (maxTry < 0) {
        clearInterval(interval);
      }
    }
  }, 400);
};

const reviewMeta = async (asin) => {
  const targetUrl = "https://reviewmeta.com/ja/amazon-jp/" + asin;
  const response = await chrome.runtime.sendMessage({
    action: "get",
    url: targetUrl,
  });
  const parser = new DOMParser();
  const doc = parser.parseFromString(response.html, "text/html");
  const score =
    doc.getElementById("adjusted_rating_location")?.outerHTML ??
    `<div class="orig-rating" style="font-size: 20px">no data</div><p>Click here to Analyze data</p>`;
  const fieldset = document.createElement("fieldset");
  fieldset.classList.add("adj-rtg");
  fieldset.insertAdjacentHTML(
    "afterBegin",
    `<legend align="center" class="adj-rtg"><img src="https://reviewmeta.com/public/imgs/reviewmeta/rm-logo.png" alt="ReviewMeta"></legend>`
  );
  const row = document.createElement("div");
  row.insertAdjacentHTML("beforeEnd", score);
  fieldset.insertAdjacentElement("beforeEnd", row);
  const box = document.createElement("a");
  box.classList.add("review-meta");
  box.setAttribute("href", targetUrl);
  box.setAttribute("target", "_blank");
  box.insertAdjacentElement("afterBegin", fieldset);
  const parentBox = document.createElement("div");
  parentBox.classList.add("review-meta-parent");
  parentBox.insertAdjacentElement("afterbegin", box);
  // parentBox.insertAdjacentHTML(
  //   "beforeEnd",
  //   `<a href="${targetUrl}" target="_blank" style="margin-left:10px">ReviewMetaで詳細を見る</a>`
  // );

  let maxTry = MAX_TRY;
  const interval = setInterval(() => {
    const insertArea = document.getElementById("review-meta-result");
    if (insertArea !== null) {
      clearInterval(interval);
      insertArea.insertAdjacentElement("afterBegin", parentBox);
    } else {
      maxTry--;
      if (maxTry < 0) {
        clearInterval(interval);
      }
    }
  }, 400);
};

const main = () => {
  const asin = getASIN(window.location.href);
  if (asin === null) {
    return;
  }

  insertMain();

  sakuraChecker(asin);
  reviewMeta(asin);
};

document.addEventListener("DOMContentLoaded", main);
