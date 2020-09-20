// Создание и рендер разметки по массиву данных и предоставленному шаблону.

import galleryData from './gallery-items.js';

// делаем объект ссылок на DOM элементы

const refs = {
  galleryList: document.querySelector('.gallery'),
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

refs.galleryImage.addEventListener('click', onGalleryImageClick);

function onGalleryImageClick(event) {
  refs.backdrop.classList.add('is-open');
  window.addEventListener('keydown', onEscKeyPress);
  event.preventDefault();
  refs.imageInModalWindow.src = event.currentTarget.dataset.source;
  refs.imageInModalWindow.alt = event.currentTarget.alt;
}

// Закрытие модального окна по клику на кнопку button[data - action= "close-modal"].

refs.closeModalBtn.addEventListener('click', onCloseModal);

// Очистка значения атрибута src элемента img.lightbox__image.
// Это необходимо для того, чтобы при следующем открытии модального окна, пока грузится изображение, мы не видели предыдущее.

function onCloseModal(event) {
  refs.backdrop.classList.remove('is-open');
  refs.imageInModalWindow.src = '';
  window.removeEventListener('keydown', onEscKeyPress);
}

// Закрытие модального окна по клику на div.lightbox__overlay.
// тут пока что реализовано закрытие на ligthbox__content

refs.backdropContent.addEventListener('click', onBackdropClick);

function onBackdropClick(event) {
  console.log(event.target);
  console.log(event.currentTarget);
  if (event.target === event.currentTarget) {
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

// Тут реализация
