const css = `<style>
    .sakura-checker {
      display: block;
      margin: 5px 0;
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

const main = () => {
  const asin = getASIN(window.location.href);
  if (asin === null) {
    return;
  }
  const targetUrl = "https://sakura-checker.jp/search/" + asin;

  console.log({ targetUrl });

  chrome.runtime.sendMessage(
    {
      action: "get",
      url: targetUrl,
    },
    (response) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(response.html, "text/html");
      const price = replacer(doc.querySelector(".item-info").outerHTML);
      let maxTry = 100;
      const interval = setInterval(() => {
        const insertArea = document.getElementById("averageCustomerReviews");
        if (insertArea !== null) {
          clearInterval(interval);
          insertArea.insertAdjacentHTML("afterend", css);
          const div = document.createElement("a");
          div.classList.add("sakura-checker");
          div.setAttribute("href", targetUrl);
          div.setAttribute("target", "_blank");
          div.insertAdjacentHTML("afterBegin", price);
          insertArea.insertAdjacentElement("afterend", div);
          return;
        } else {
          maxTry--;
          if (maxTry < 0) {
            clearInterval(interval);
          }
        }
      }, 400);
    }
  );
};

document.addEventListener("DOMContentLoaded", main);
