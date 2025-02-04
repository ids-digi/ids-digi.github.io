const data = {
  url: 'your-url-here',
  slug: 'Meet the local artist who sculpted John Mellencamp',
  headline: 'Meet the local artist who sculpted John Mellencamp',
  title: 'Mellencamp Sculptor',
  pub_date: '{insert your date in metadata.json}',
  bylines: {
    By: {
      name: 'Abby Turner',
      email: 'catchar@iu.edu',
      //   twitter: 'catcharron',
      pfp: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIvqwzRkodgubCVQviowyM3RX_KC0oNBVvMw&s',
      bio: 'TODO: Abby Bio',
    },
    // 'Photos by': {
    //   name: 'Izzy Myszak',
    //   email: 'izzymyszak@iu.edu',
    //   twitter: 'izzymyszak',
    // },
    'Development by': {
      name: 'Sky Angeles',
      email: 'skyangel@iu.edu',
      //   twitter: 'carsonology',
      pfp: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZEYsAVJfucz9zylIS9C1lsP1mQ-0WoBG33Q&s',
      bio: 'Sky has worked at the IDS since 2024 as a web developer.',
    },
    'Design by': {
      name: 'Mansi Kadam',
      email: 'mkadam@iu.edu',
      //   twitter: 'carsonology',
      pfp: 'https://womenandtech.indiana.edu/images/people/mansi-kadam-square-768x768.jpg',
      bio: 'Mansi has worked at the IDS since 2024 as a designer.',
    },
    // 'Graphics by': {
    //   name: 'Vivek Rao',
    //   email: 'vivrao@iu.edu',
    //   twitter: 'vivrao',
    // },
  },
};

// bylines
const byline_types = ['By', 'Development by', 'Design by'];
let bylines_html = '';
let bios_html = '';

for (let type of byline_types) {
  if (data.bylines[type]) {
    if (data.bylines[type].length) {
      data.bylines[type].forEach((author) => setAuthorBio(type, author));
    } else {
      setAuthorBio(type, data.bylines[type]);
    }
  }
}

for (let type of byline_types) {
  if (data.bylines[type]) {
    if (!data.bylines[type].length) {
      bylines_html += `<p>${type} <a href="https://idsnews.com/staff/${data.bylines[
        type
      ].name
        .split(' ')
        .join('-')}">${data.bylines[type].name}</a></p>`;
    } else {
      bylines_html += '<p>' + type;
      for (let index in data.bylines[type]) {
        bylines_html += ` <a href="https://idsnews.com/staff/${data.bylines[
          type
        ][index].name
          .split(' ')
          .join('-')}">${data.bylines[type][index].name}</a>`;
        if (
          index != data.bylines[type].length - 2 &&
          index != data.bylines[type].length - 1
        ) {
          bylines_html += ',';
        } else if (index == data.bylines[type].length - 2) {
          bylines_html += ' and';
        }
      }
      bylines_html += '</p>';
    }
  }
}

function setAuthorBio(type, author) {
  let twitter_link = `<span><a href="https://twitter.com/${author.twitter}" target="_blank">Twitter <i class="fab fa-twitter"></i></a></span>`;
  let email_link = `<span style="padding-right: var(--xs); padding-left: var(--xxs);"><a
        href="mailto:${author.email}" target="_blank">Email <i class="fa fa-envelope"></i></a></span>`;
  if (author.pfp && author.bio) {
    bios_html += `<div class="bio">
                        <div>
                            <img src="${author.pfp}" alt="${author.name}">
                            <div>
                            <p>${type} <a href="https://idsnews.com/staff/${author.name
      .split(' ')
      .join('-')}" target="_blank">${author.name}</a></p>
                            <p>${author.bio}  ${
      author.email ? email_link : ''
    }   ${author.twitter ? twitter_link : ''}</p>
                            </div>
                        </div>
                    </div>`;
  }
}

document.querySelector('#bylines').innerHTML = bylines_html;
document.querySelector('.author-bios').innerHTML = bios_html;

// pubdate
document.querySelector('#pubdate').innerHTML = 'Published ' + data.pub_date;

// title & slug
document.querySelector('title').innerHTML =
  data.title + ' | Indiana Daily Student';
document.querySelector('#slug').innerHTML = data.slug;

// socials
let meta_twitter = document.querySelectorAll('meta[name*="twitter"]');
let meta_og = document.querySelectorAll('meta[property*="og"]');
let fb = `https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fspecials.idsnews.com%2F${data.url}`;
let twitter = `https://twitter.com/intent/tweet?url=https%3A%2F%2Fspecials.idsnews.com%2F${
  data.url
}%2F&text=${data.headline.split(' ').join('%20')}`;
let reddit = `https://www.reddit.com/submit?title=${data.headline
  .split(' ')
  .join('%20')}&url=http%3A%2F%2Fspecials.idsnews.com%2F${data.url}`;

document.querySelector('li#socials').innerHTML = `
        <a href="${fb}" target="_blank"><i class="fab fa-facebook"></i></a>
        <a href="${twitter}" target="_blank"><i class="fab fa-twitter"></i></a>
        <a href="${reddit}" target="_blank"><i class="fab fa-reddit"></i></a>
        `;
