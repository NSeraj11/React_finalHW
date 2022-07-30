const BASE_URL = 'https://jsonplaceholder.typicode.com';
const postsPath = 'posts';


const DomSelectors = {
    root: '#root',
    postPage: {
      containerClass: 'container',
      title: 'My Blog',
      postCardsClass: 'cards',
    },
    card: {
      containerClass: 'card',
      header: 'card__header',
      title: 'card__header-title',
      body: 'card__body',
      bodyText: 'card__body-text',
      footer: 'card__footer',
      footerText: 'card__footer-text',
    },
  };

  class State {
    constructor() {
      this._posts = [];
    }
  
    get posts() {
      return this._posts;
    }
  
    set posts(newPosts) {
      this._posts = newPosts;
      renderPostCards(
        this._posts,
        document.querySelector(`.${DomSelectors.postPage.postCardsClass}`)
      );
    }
  }
  
  let state = new State();



const getPosts = () => {
  const postsEndPoint = [BASE_URL, postsPath].join('/');
  return fetch(postsEndPoint).then((response) => {
    return response.json();
  });
};


const deletePost = (id) => {
    const postsEndPoint = [BASE_URL, postsPath, id].join('/');
    return fetch(postsEndPoint, {
      method: 'DELETE',
    }).then((response) => {
      return response.json();
    });
  };

  const render = (tmp, element) => {
    element.innerHTML = tmp;
  };
  
  const renderPostPage = () => {
    const root = document.querySelector(DomSelectors.root);
    const tmp = generatePostPageTmp(DomSelectors.postPage);
    render(tmp, root);
  };
  
  const renderPostCards = (posts, element) => {
    const tmp = posts
      .map((post) => generatePostCardTmp(post, DomSelectors.card))
      .join('');
  
    render(tmp, element);
  };
  
  
  const generatePostPageTmp = ({ title, containerClass, postCardsClass }) => {
    return `<section class="${containerClass}">
              <header> 
                <h1>${title}</h1>
              </header>
              <div class="${postCardsClass}"></div>
            </section>`;
  };
  
  const generatePostCardTmp = (
    post,
    { containerClass, header, title, body, bodyText, footer, footerText }
  ) => {
    return `
    <article class="${containerClass}">
      <header class="${header}">
        <h4 class="${title}">${post.title}</h4>
      </header>
      <div class="${body}">
        <p class="${bodyText}">${post.body}</p>
      </div>
      <footer class="${footer}">
        <p class="${footerText}">Post Id: ${post.id} <button class="btn-delete" name="btn-delete-${post.id}"  >Delete</button></p>
      </footer>
    </article>
   `;
  };
  
  const setUpCardsEvent = (cardsElement) => {
    cardsElement.addEventListener('click', (event) => {
      if (event?.target?.name?.startsWith('btn-delete')) {
        const id = +event.target.name.substring(11);
        deletePost(id).then((data) => {
          state.posts = state.posts.filter((post) => {
            return post.id !== id;
          });
        });
      }
    });
  };
  
  
  
  const init = () => {
    renderPostPage();
    const cardsElement = document.querySelector(
      `.${DomSelectors.postPage.postCardsClass}`
    );
    setUpCardsEvent(cardsElement);
  
    getPosts().then((data) => {
      state.posts = data;
    });
  };
  
  init();






