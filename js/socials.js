// update social buttons (nav) and meta tags with proper social links

let meta_twitter = document.querySelectorAll('meta[name*="twitter"]');
let meta_og = document.querySelectorAll('meta[property*="og"]');
fetch("../metadata.json")
    .then(response => response.json())
    .then(data => {
        let fb = `https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fspecials.idsnews.com%2F${data.url}`;
        let twitter = `https://twitter.com/intent/tweet?url=https%3A%2F%2Fspecials.idsnews.com%2F${data.url}%2F&text=${data.headline.split(' ').join('%20')}`;
        let reddit = `https://www.reddit.com/submit?title=${data.headline.split(' ').join('%20')}&url=http%3A%2F%2Fspecials.idsnews.com%2F${data.url}`;

        document.querySelector('li#socials').innerHTML = `
        <a href="${fb}" target="_blank"><i class="fab fa-facebook"></i></a>
        <a href="${twitter}" target="_blank"><i class="fab fa-twitter"></i></a>
        <a href="${reddit}" target="_blank"><i class="fab fa-reddit"></i></a>
        `;

        meta_og[0].content = `https://specials.idsnews.com/${data.url}`;
        meta_og[2].content = data.headline;
        meta_og[3].content = data.abstract;
        meta_og[5].content = data.dom_image;

        meta_twitter[3].content = data.headline;
        meta_twitter[4].content = data.abstract;
        meta_twitter[5].content = data.dom_image;

    })
    .catch(err => console.log(err))
