// Создание и рендер разметки по массиву данных и предоставленному шаблону.

import galleryData from './gallery-items.js';

// делаем объект ссылок на DOM элементы

const refs = {
  galleryList: document.querySelector('.js-gallery'),
  backdrop: document.querySelector('.lightbox'),
  backdropOverlay: document.querySelector('.lightbox__overlay'),
  backdropContent: document.querySelector('.lightbox__content'),
  closeModalBtn: document.querySelector(
    '.lightbox button[data-action="close-lightbox"]',
  ),
  imageInModalWindow: document.querySelector('.lightbox__image'),
};

// функция генерирования разметки заданного типа (<li><img></li>)

const createGalleryMarkup = obj => {
  const GALLERY_ITEM_CLASS = 'gallery__item';
  const GALLERY_LINK_CLASS = 'gallery__link';
  const GALLERY_IMAGE_CLASS = 'gallery__image';
  return obj.reduce(
    (acc, { preview, original, description }) =>
      acc +
      `<li class="${GALLERY_ITEM_CLASS}"><a class="${GALLERY_LINK_CLASS}" href="${original}"><img class="${GALLERY_IMAGE_CLASS}" src="${preview}" alt="${description}" data-source="${original}"></a></li>`,
    '',
  );
};

// создаем разметку по заданной коллекции и добавляем ее в дерево

const galleryMarkup = createGalleryMarkup(galleryData);

refs.galleryList.innerHTML = galleryMarkup;

// добавляем необходимые элементы в объект ссылок

refs.galleryItem = document.querySelector('.gallery__item');
refs.galleryImage = document.querySelector('.gallery__image');

// Реализация делегирования на галерее ul.js - gallery и получение url большого изображения.

// тут реализация

// Открытие модального окна по клику на элементе галереи.
// Подмена значения атрибута src элемента img.lightbox__image.

refs.galleryList.addEventListener('click', onGalleryImageClick);

function onGalleryImageClick(event) {
  event.preventDefault();
  const target = event.target;

  // проверяем чтоб клик прошел по картинке а не мимо
  if (target.nodeName !== 'IMG') return;

  refs.backdrop.classList.add('is-open');

  // вешаем слушатели клавиатуры
  window.addEventListener('keydown', onEscKeyPress);
  window.addEventListener('keydown', onRightArrowPress);
  window.addEventListener('keydown', onLeftArrowPress);

  // вешаем активный класс на картинку которая открывается в модалке и подменяем src элемента img.lightbox__image (и alt)
  setModalImageSource(target);
  setActiveGalleryElement(target);
}

function setModalImageSource(el) {
  refs.imageInModalWindow.src = el.dataset.source;
  refs.imageInModalWindow.alt = el.alt;
}

function setActiveGalleryElement(el) {
  el.parentNode.parentNode.classList.add('image-in-modal');
}

// Закрытие модального окна по клику на кнопку button[data - action= "close-modal"].

refs.closeModalBtn.addEventListener('click', onCloseModal);

// Очистка значения атрибута src элемента img.lightbox__image.
// Это необходимо для того, чтобы при следующем открытии модального окна, пока грузится изображение, мы не видели предыдущее.
// снимаем активный класс, который используется для листания галлереи
// снимаем слушатели клавиатуры (они нужны на открытой модалке)

function onCloseModal(event) {
  refs.backdrop.classList.remove('is-open');
  refs.imageInModalWindow.src = '';
  document
    .querySelectorAll('.gallery__item')
    .forEach(el => el.classList.remove('image-in-modal'));

  window.removeEventListener('keydown', onEscKeyPress);
  window.removeEventListener('keydown', onRightArrowPress);
  window.removeEventListener('keydown', onLeftArrowPress);
}

// Закрытие модального окна по клику на div.lightbox__overlay.
// реализовано закрытие на ligthbox__content

refs.backdropContent.addEventListener('click', onBackdropClick);

function onBackdropClick(event) {
  if (event.target !== refs.imageInModalWindow) {
    onCloseModal();
  }
}

// Закрытие модального окна по нажатию клавиши ESC.

function onEscKeyPress(event) {
  const ESC_KEY_CODE = 'Escape';
  const isEsc = ESC_KEY_CODE === event.code;
  if (isEsc) {
    onCloseModal();
  }
}

// Пролистывание изображений галереи в открытом модальном окне клавишами "влево" и "вправо".

// открытый элемент коллекции ловим через активный класс, который ставим при открытии модалки
// по соседям ходим через previousElementSibling и nextElementSibling

function onRightArrowPress(event) {
  const RIGHT_ARROW_KEY_CODE = 'ArrowRight';
  const itemInModalBeforeArrowPress = document.querySelector('.image-in-modal');

  if (event.code === RIGHT_ARROW_KEY_CODE) {
    // уходим от ошибки когда нет следующего элемента коллекции
    if (itemInModalBeforeArrowPress === refs.galleryList.lastElementChild)
      return;
    //   выбираем следующий элемент коллекции, даем ему активный класс и присваиывем его scr на модалку
    const itemInModalAfterArrowPress =
      itemInModalBeforeArrowPress.nextElementSibling;
    const imageInModalAfterArrowPress = itemInModalAfterArrowPress.querySelector(
      '.gallery__image',
    );
    setModalImageSource(imageInModalAfterArrowPress);
    itemInModalBeforeArrowPress.classList.remove('image-in-modal');
    setActiveGalleryElement(imageInModalAfterArrowPress);
  }
}

function onLeftArrowPress(event) {
  const LEFT_ARROW_KEY_CODE = 'ArrowLeft';
  const itemInModalBeforeArrowPress = document.querySelector('.image-in-modal');

  if (event.code === LEFT_ARROW_KEY_CODE) {
    // уходим от ошибки когда нет предыдущего элемента коллекции
    if (itemInModalBeforeArrowPress === refs.galleryList.firstElementChild)
      return;
    //   выбираем предыдущий элемент коллекции, даем ему активный класс и присваиывем его scr на модалку
    const itemInModalAfterArrowPress =
      itemInModalBeforeArrowPress.previousElementSibling;
    const imageInModalAfterArrowPress = itemInModalAfterArrowPress.querySelector(
      '.gallery__image',
    );
    setModalImageSource(imageInModalAfterArrowPress);
    itemInModalBeforeArrowPress.classList.remove('image-in-modal');
    setActiveGalleryElement(imageInModalAfterArrowPress);
  }
}
