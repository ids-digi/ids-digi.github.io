const idsSVG =
  '<svg viewBox="0 0 163.17 68.85"> <path style="fill: white" d="M0,67.77V1.08H19.89V67.77Z"></path> <path style="fill: white" d="M32.85,67.77V1.08H58.32c19.44,0,38.34,6.21,38.34,33.3,0,26.64-20.07,33.39-39.6,33.39ZM52.74,50.4h5.85c12.06,0,17.91-4.41,17.91-16s-5.67-15.3-18.81-15.3H52.74Z"></path> <path style="fill: white" d="M98.82,59l9.54-13.59c6.66,4.59,15.93,7,23.31,7,9.45,0,11.7-2.16,11.7-4.86s-2.7-3.78-12.51-4.59c-14.31-1.17-28.26-4.86-28.26-21.15C102.6,5.67,115.83,0,131,0c15.84,0,24.48,4.05,29.16,7.83l-9.9,14.31c-3.78-2.52-12.33-4.77-19-4.77s-8.73,1.08-8.73,3.69c0,3.24,2.79,4.05,12.69,4.86,14.94,1.26,28,4.14,28,20.7,0,13.5-11.52,22.23-30.87,22.23C114.66,68.85,105.84,64.53,98.82,59Z"></path> </svg>';

// Format article.publishDate according to AP style guide
function apShortDate(date) {
  const apMonthFormat = [
    "Jan.",
    "Feb.",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug.",
    "Sept.",
    "Oct.",
    "Nov.",
    "Dec.",
  ];
  return `${apMonthFormat[date.month - 1]} ${date.day}, ${date.year}`;
}

// * ---| Latest Articles |---
function setReadStatus(articleURL) {
  let readArticles = window.localStorage.getItem("readArticles").split(",");

  if (!readArticles.includes(articleURL)) {
    readArticles.push(articleURL);
    window.localStorage.setItem("readArticles", readArticles);
  }
}

function getReadStatus(article) {
  let readArticles = window.localStorage.getItem("readArticles").split(",");

  if (readArticles.includes(article.url)) {
    return true;
  } else {
    return false;
  }
}

function getDatelineTag(article, index, isNewestSection) {
  const publishDate = new Date(
    article.publishDate.year,
    article.publishDate.month - 1,
    article.publishDate.day,
    article.publishDate.hour,
    article.publishDate.minute
  );

  // Check if article published within the last 14 days
  const isNew =
    new Date().getTime() - publishDate.getTime() < 14 * 24 * 60 * 60 * 1000;
  // Check if article published within the last 21 days
  const isRecent =
    new Date().getTime() - publishDate.getTime() < 21 * 24 * 60 * 60 * 1000;

  if (isNew) {
    return { text: "New", color: "white", backgroundColor: "#a22522" };
  } else if (isRecent) {
    return { text: "Recent", color: "white", backgroundColor: "#6D84B3" };
  } else if (index == 0 && isNewestSection) {
    // If page hasn't been updated in > 21 days, mark most recent article
    return { text: "Most Recent", color: "white", backgroundColor: "#a22522" };
  } else {
    return undefined;
  }
}

// Returns 3 latest articles
function getLatest(articleJSON) {
  // Get every article
  let allArticles = { articles: [] };

  articleJSON.sections.forEach((section) => {
    section.articles.forEach((article) => {
      allArticles.articles.push(article);
    });
  });

  // Sort articles & return first 3
  const sortedArticles = sortArticles(allArticles);

  return sortedArticles.slice(0, 3);
}

// Generates 'Latest Updates' section
function generateLatest(articleJSON) {
  const latestJSON = getLatest(articleJSON);

  latestJSON.forEach((article, index) => {
    const container = document.querySelector(`[data-section-id="latest"]`);
    const articleCard = createArticleCard(article, index, true);

    container.appendChild(articleCard);
  });
}

// Sorts articles in descending order (most recent first)
function sortArticles(sectionJSON) {
  return sectionJSON.articles.sort((a, b) => {
    const publishDateA = a.publishDate;
    const publishDateB = b.publishDate;

    return (
      new Date(
        publishDateB.year,
        publishDateB.month - 1,
        publishDateB.day,
        publishDateB.hour,
        publishDateB.minute
      ).getTime() -
      new Date(
        publishDateA.year,
        publishDateA.month - 1,
        publishDateA.day,
        publishDateA.hour,
        publishDateA.minute
      ).getTime()
    );
  });
}

// Returns article card element
function createArticleCard(article, index, isVertical) {
  // --+ Article Card - <div> +--
  const articleCard = document.createElement("div");
  articleCard.classList = "card";

  // --+ Top Container - <div> +--
  const topContainer = document.createElement("div");

  // --+ Article Image Anchor - <a> +--
  const imageLink = document.createElement("a");
  imageLink.classList = "image";
  imageLink.href = article.url;
  imageLink.target = "_blank";

  // --+ Article Image +--
  //    <a>
  // +     <img />
  //    </a >
  const articleImage = document.createElement("img");
  articleImage.src = article.featuredImage;

  imageLink.appendChild(articleImage);

  // --+ Article Headline Container - <div> +--
  const headlineContainer = document.createElement("div");
  headlineContainer.classList = "headline";

  // --+ Article Headline Anchor +--
  //  <div>
  // +  <a> Headline </a>
  //  </div >
  const headlineLink = document.createElement("a");
  headlineLink.href = article.url;
  headlineLink.target = "_blank";
  headlineLink.innerHTML = article.headline;

  headlineContainer.appendChild(headlineLink);

  // Article Content Container - <div> +--
  const contentContainer = document.createElement("div");
  contentContainer.classList = "content";

  if (isVertical) {
    //  --+ Vertical Structure +--
    //  <div> Article Card
    // +  <div> Top Container
    // +    <a> Image Link </a>
    // +    <div> Headline </div>
    // +  </div>
    //    ...
    //  </div>
    topContainer.appendChild(imageLink);
    topContainer.appendChild(headlineContainer);
  } else {
    //  --+ Horizontal Structure +--
    //  <div> Article Card
    // +  <a> Image Link </a>
    // +  <div> Content Container
    // +    <div> Headline </div>
    // +  </div>
    //    ...
    //  </div>
    articleCard.appendChild(imageLink);
    contentContainer.appendChild(headlineContainer);
  }

  // --+ Dateline Container - <div> +--
  const datelineContainer = document.createElement("div");
  datelineContainer.classList = "datelineContainer";

  // --+ Article Publish Date +--
  //  <div> Dateline Container
  // +  <div> Publish Date </div>
  //  </div >
  const publishDate = document.createElement("div");
  publishDate.classList = "dateline";
  publishDate.innerHTML = `Published ${apShortDate(article.publishDate)}`;

  datelineContainer.appendChild(publishDate);

  // --+ Dateline Tag +--
  //  <div> Dateline Container
  //    <div> Publish Date </div>
  // +  <div> Dateline Tag </div>
  //  </div >
  const dateTag = getDatelineTag(article, index);

  let tagData = {
    dateTag: dateTag ? dateTag : false,
    specialTag: article.url.includes("specials.idsnews.com")
      ? { text: `${idsSVG} Special`, color: "white", backgroundColor: "black" }
      : false,
  };

  Object.values(tagData).forEach((tag) => {
    if (tag) {
      const datelineTag = document.createElement("div");

      datelineTag.classList = "tag";
      datelineTag.innerHTML = tag.text;
      datelineTag.style.color = tag.color;
      datelineTag.style.backgroundColor = tag.backgroundColor;

      datelineContainer.appendChild(datelineTag);
    }
  });

  // --+ Article Byline +--
  //  <div> Meta Container
  //    <div> Dateline Container </div>
  // +  <div> Byline </div>
  //  </div >
  const byline = document.createElement("div");
  byline.classList = "byline";
  byline.innerHTML = "By ";

  // --+ Article Byline Anchor +--
  //  <div> Meta Container
  //    <div> Dateline Container </div>
  //    <div> Byline
  // +    By <a> Author </a>
  //    </div >
  //  </div >
  article.bylines.by.forEach((author, index, byArray) => {
    const bylineLink = document.createElement("a");
    bylineLink.href = `https://www.idsnews.com/staff/${author.name
      .toLowerCase()
      .split(" ")
      .join("-")}`;
    bylineLink.target = "_blank";
    bylineLink.classList = "story-link";
    bylineLink.innerHTML = author.name;

    byline.appendChild(bylineLink);

    // Separate multiple authors
    if (byArray.length - 1 > 0) {
      if (byArray.length - 1 - index > 1) {
        byline.innerHTML += ", ";
      } else if (index != byArray.length - 1) {
        byline.innerHTML += " and ";
      }
    }
  });

  // --+ Meta Container +--
  // + <div> Meta Container
  //    <div> Dateline Container </div>
  //    <div> Byline
  //      By <a> Author </a>
  //    </div >
  // + </div >
  const metaContainer = document.createElement("div");
  metaContainer.classList = "metaContainer";

  metaContainer.appendChild(datelineContainer);
  metaContainer.appendChild(byline);

  contentContainer.appendChild(metaContainer);

  // Append article excerpt to horizontal cards
  if (!isVertical) {
    // --+ Article Excerpt +--
    //  <div> Content Container
    //    <div> Headline </div>
    //    <div> Meta Container </div>
    // +  <div> Excerpt </div>
    //  </div >
    const excerpt = document.createElement("div");
    excerpt.classList = "excerpt";
    excerpt.innerHTML = article.excerpt;

    contentContainer.appendChild(excerpt);
  }

  // --+ Button Container - <div> +--
  const buttonContainer = document.createElement("div");
  buttonContainer.classList = "buttonContainer";

  // --+ Read Button - <a> +--
  const readButton = document.createElement("a");
  readButton.classList = "readButton";
  readButton.innerHTML = "Read";
  readButton.href = article.url;
  readButton.target = "_blank";

  // --+ Read Button Indicator +--
  //  <a>
  // +  <div> Read Indicator </a>
  //  </a>
  const readIndicator = document.createElement("div");
  // readIndicator.classList = getIndicatorClass(article);
  readIndicator.dataset.url = article.url;

  // Read/unread styling
  if (getReadStatus(article)) {
    readButton.title = "Read";
    readIndicator.title = "Read";
    readIndicator.classList = "indicator read";
  } else {
    readButton.title = "Unread";
    readIndicator.title = "Unread";
    readIndicator.classList = "indicator unread";
  }

  if (isVertical) {
    // Append read indicator to 'Read' button for vertical cards
    readButton.appendChild(readIndicator);
  } else {
    // Append read indicator to card element for horizontal cards
    articleCard.appendChild(readIndicator);
    articleCard.className += " fadeIn";
  }
  buttonContainer.appendChild(readButton);
  metaContainer.appendChild(buttonContainer);

  //  --+ Vertical Article Card +--       |   --+ Horizontal Article Card +--
  //  <div> Article Card                  |   <div> Article Card
  // +  <div> Top Container </div>        |  +  <a>  Article Image </a>
  // +  <div> Content Container </div>    |  +  <div> Read Indicator </div>
  //  </div>                              |  +  <div> Content Container </div>
  //                                      |   </div>
  articleCard.appendChild(topContainer);
  articleCard.appendChild(contentContainer);

  return articleCard;
}

// ! --- Article Data ---
const articleData = {
  sections: [
    {
      sectionID: "mens-basketball",
      header: "Men's Basketball",
      subheader: "",
      description: "",
      articles: [
        {
          url: "https://www.idsnews.com/article/2022/09/trayce-jackson-davis-legacy-indiana-men-basketball",
          featuredImage:
            "https://snworksceo.imgix.net/ids/917f6386-dd7f-41bc-9b0d-47456425182c.sized-1000x1000.jpg?w=1000",
          headline:
            "Trayce Jackson-Davis is back, and he’s set to leave a legacy with Indiana men’s basketball",
          excerpt:
            "Trayce Jackson-Davis could have stayed in the NBA Draft last year, left Indiana men’s basketball and gone on to a professional career. No one would have blamed him.",
          bylines: {
            by: [
              {
                name: "Evan Gerike",
              },
            ],
          },
          publishDate: {
            month: 9,
            day: 28,
            year: 2022,
            hour: 13,
            minute: 29,
          },
        },
        {
          url: "https://www.idsnews.com/article/2022/10/indiana-men-basketball-xavier-johnson-leader-offseason",
          featuredImage:
            "https://snworksceo.imgix.net/ids/4ba9b994-64d0-458d-8575-e71b384fc6b1.sized-1000x1000.jpg?w=1000",
          headline:
            "Indiana men’s basketball’s Xavier Johnson is dialed in as a leader after tough offseason",
          excerpt:
            "Xavier Johnson got comfortable. That’s when the Big Ten got easier for him.",
          bylines: {
            by: [
              {
                name: "Evan Gerike",
              },
            ],
          },
          publishDate: {
            month: 10,
            day: 7,
            year: 2022,
            hour: 15,
            minute: 38,
          },
        },
        {
          url: "https://www.idsnews.com/article/2022/10/jordan-geronimo-jump-next-level-competition",
          featuredImage:
            "https://snworksceo.imgix.net/ids/4d2f4bfb-c1db-4010-924e-63372a8105dd.sized-1000x1000.jpg?w=1000",
          headline:
            "Jordan Geronimo eager to jump to the next level, over his competition in 2022-23",
          excerpt:
            "Geronimo, a junior, recorded the best stretch of his collegiate career during the 2022 NCAA Tournament. He exploded for a career-high 15 points with three put-back jams against the University of Wyoming, followed by a nine-point, six-rebound performance in Indiana’s loss to Saint Mary’s College of California.",
          bylines: {
            by: [
              {
                name: "Emma Pawlitz",
              },
            ],
          },
          publishDate: {
            month: 10,
            day: 4,
            year: 2022,
            hour: 10,
            minute: 59,
          },
        },
        {
          url: "https://www.idsnews.com/article/2022/10/indiana-men-basketball-preview-non-conference-slate",
          featuredImage:
            "https://snworksceo.imgix.net/ids/db01f1d5-54ec-4908-84d4-221d88ec4c50.sized-1000x1000.jpg?w=1000",
          headline:
            "COLUMN: Indiana men’s basketball preview — yikes, that non-conference slate is brutal",
          excerpt:
            "In just under a month, Indiana men’s basketball will begin one of its most anticipated campaigns of the last decade. Head coach Mike Woodson has breathed life into a program running on fumes. ",
          bylines: {
            by: [
              {
                name: "Bradley Hohulin",
              },
            ],
          },
          publishDate: {
            month: 10,
            day: 11,
            year: 2022,
            hour: 11,
            minute: 30,
          },
        },
        {
          url: "https://www.idsnews.com/article/2022/09/thats-all-i-want-iu-mens-basketball-woodson-titles",
          featuredImage:
            "https://snworksceo.imgix.net/ids/1ef4a77e-8415-4d87-b6ce-422c54f28703.sized-1000x1000.jpg?w=1000",
          headline:
            "‘That’s all I want’: Mike Woodson has Indiana men’s basketball ready to compete for titles",
          excerpt:
            "Indiana men’s basketball isn’t focusing on the hype and the spotlight that comes with being a preseason favorite in the Big Ten, but it isn’t shying away from it either. ",
          bylines: {
            by: [
              {
                name: "Evan Gerike",
              },
            ],
          },
          publishDate: {
            month: 9,
            day: 24,
            year: 2022,
            hour: 17,
            minute: 36,
          },
        },
        {
          url: "https://www.idsnews.com/article/2022/10/indiana-men-basketball-win-marian",
          featuredImage:
            "https://snworksceo.imgix.net/ids/0df90862-2f2f-4080-bb5c-6345a20a59f8.sized-1000x1000.jpg?w=1000",
          headline:
            "No TJD? No problem: Back-ups shine in Indiana men’s basketball’s 78-42 win over Marian",
          excerpt:
            "The Indiana men’s basketball team opened its season against Marian University Oct. 29 without its crown jewel: senior forward Trayce Jackson-Davis.",
          bylines: {
            by: [
              {
                name: "Emma Pawlitz",
              },
            ],
          },
          publishDate: {
            month: 10,
            day: 29,
            year: 2022,
            hour: 19,
            minute: 19,
          },
        },
      ],
    },
    {
      sectionID: "womens-basketball",
      header: "Women's Basketball",
      subheader: "",
      description: "",
      articles: [
        {
          url: "https://www.idsnews.com/article/2022/09/all-the-pieces-are-in-place-iu-womens-basketball-expects-championship-level",
          featuredImage:
            "https://snworksceo.imgix.net/ids/553b0127-8b1f-4fb1-80e5-2aebf22569c3.sized-1000x1000.jpg?w=1000",
          headline:
            "‘All the pieces are in place’: Indiana women’s basketball expects championship-level season",
          excerpt:
            "Indiana women’s basketball appeared at the program’s first combined institutional basketball media day Thursday. Head coach Teri Moren and junior guards Sydney Parrish and Chloe Moore-McNeil spoke on the podium for the Hoosiers. ",
          bylines: {
            by: [
              {
                name: "Will Foley",
              },
            ],
          },
          publishDate: {
            month: 9,
            day: 25,
            year: 2022,
            hour: 19,
            minute: 48,
          },
        },
      ],
    },
    {
      sectionID: "general-content",
      header: "General Content",
      subheader: "",
      description: "",
      articles: [
        {
          url: "",
          featuredImage: "",
          headline: "",
          excerpt: "",
          bylines: {
            by: [
              {
                name: "",
              },
            ],
          },
          publishDate: {
            month: null,
            day: null,
            year: 2022,
            hour: null,
            minute: null,
          },
        },
      ],
    },
  ],
};
  


function init() {
  if (!window.localStorage.getItem("readArticles")) {
    window.localStorage.setItem("readArticles", []);
  }

  generateLatest(articleData);
}

init();
