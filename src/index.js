import { addCard, deleteCard, getInitialCards, getUserInfo, updateAvatar, updateUserInfo } from './components/api.js';
import { createCard } from './components/card.js';
import { closeModal, openModal } from './components/modal.js';
import { clearValidation, enableValidation } from './components/validation.js';
import './pages/index.css';

// DOM 
const avatarEditBtn = document.querySelector('.profile__image');
const popupAvatar = document.querySelector('.popup_type_avatar');
const formAvatar = document.querySelector('.popup__form[name="avatar"]');
const avatarInput = document.querySelector('.popup__input_type_avatar');
const placesList = document.querySelector('.places__list');
const formEditProfile = document.querySelector('.popup__form[name="edit-profile"]');
const formAddCard = document.querySelector('.popup__form[name="new-place"]');
const profileName = document.querySelector('.profile__title'); 
const profileAbout = document.querySelector('.profile__description'); 
const nameInput = document.querySelector('.popup__input_type_name'); 
const jobInput = document.querySelector('.popup__input_type_description'); 
const addCardNameInput = document.querySelector('.popup__input_type_card-name'); 
const addCardLinkInput = document.querySelector('.popup__input_type_url');
const editProfileBtn = document.querySelector('.profile__edit-button');
const popupProfileBtn = document.querySelector('.popup_type_edit');
const closeEditBtn = document.querySelectorAll('.popup__close');
const addBtn = document.querySelector('.profile__add-button');
const popupTypeImage = document.querySelector('.popup_type_image');
const popupImage = document.querySelector('.popup__image');
const popupImageCaption = document.querySelector('.popup__caption');
const popupAddBtn = document.querySelector('.popup_type_new-card');
const popupDeleteCard = document.querySelector('.popup_type_delete-card');
const formDeleteCard = document.querySelector('.popup__form[name="delete-card"]');

const validateRegEx = /^[а-яА-ЯёЁ\d\w\s\-_%$:\?!\.,]+/;

avatarEditBtn.addEventListener('click', () => {
  formAvatar.reset();
  clearValidation(formAvatar, validationConfig);
  openModal(popupAvatar);
});

const popups = document.querySelectorAll('.popup');
popups.forEach((popup) => {
    popup.classList.add('popup_is-animated');
});

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

let userId;
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    userId = userData._id;
    
    profileName.textContent = userData.name;
    profileAbout.textContent = userData.about;
    avatarEditBtn.style.backgroundImage = `url(${userData.avatar})`;
    
    cards.forEach((cardData) => {
      const cardElement = createCard(
        cardData,
        handleDeleteCard,
        openImageClick,
        userId
      );
      placesList.append(cardElement);
    });
  })
  .catch((err) => {
    console.log('Ошибка при загрузке данных:', err);
  });

function openImageClick(item) {
    popupImage.src = item.link;
    popupImage.alt = item.name;
    popupImageCaption.textContent = item.name;
    openModal(popupTypeImage);
};

editProfileBtn.addEventListener('click', () => {
    nameInput.value = profileName.textContent;
    jobInput.value = profileAbout.textContent;

    clearValidation(formEditProfile, {
        formSelector: '.popup__form',
        inputSelector: '.popup__input',
        submitButtonSelector: '.popup__button',
        inactiveButtonClass: 'popup__button_disabled',
        inputErrorClass: 'popup__input_type_error',
        errorClass: 'popup__error_visible',
        inputRegex: validateRegEx
      });

    openModal(popupProfileBtn);
});

formAvatar.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = formAvatar.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';

  updateAvatar(avatarInput.value)
  .then((userData) => {
    avatarEditBtn.style.backgroundImage = `url(${userData.avatar})`;
    closeModal(popupAvatar);
    formAvatar.reset();
  })
  .catch((err) => {
    console.log('Ошибка при обновлении аватара:', err);
  })
  .finally(() => {
    submitButton.textContent = originalText;
  });
});

function handleProfileFormSubmit(evt) {
    evt.preventDefault();
    
    const newName = nameInput.value;
    const newJob = jobInput.value;

    updateUserInfo(newName, newJob)
      .then((userData) => {
        profileName.textContent = userData.name;
        profileAbout.textContent = userData.about;
        closeModal(popupProfileBtn);
      }).catch((err) => {
        console.log('Ошибка при обновлении данных пользователя:', err);
      });
}

formEditProfile.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = formEditProfile.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';

  updateUserInfo(nameInput.value, jobInput.value)
    .then((userData) => {
        profileName.textContent = userData.name;
        profileAbout.textContent = userData.about;
        closeModal(popupProfileBtn);
    })
    .catch((err) => {
        console.log('Ошибка при обновлении профиля:', err);
    })
    .finally(() => {
        submitButton.textContent = originalText;
    });
});

addBtn.addEventListener('click', () => {
  formAddCard.reset();
  clearValidation(formAddCard, {
      formSelector: '.popup__form',
      inputSelector: '.popup__input',
      submitButtonSelector: '.popup__button',
      inactiveButtonClass: 'popup__button_disabled',
      inputErrorClass: 'popup__input_type_error',
      errorClass: 'popup__error_visible',
      inputRegex: validateRegEx
  });
    openModal(popupAddBtn);
});

formAddCard.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = formAddCard.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';

  const newCardName = addCardNameInput.value;
  const newCardLink = addCardLinkInput.value;

  addCard(newCardName, newCardLink)
  .then((newCardData) => {
    const newCardElement = createCard(newCardData, handleDeleteCard, openImageClick, userId);
    placesList.prepend(newCardElement);
    closeModal(popupAddBtn);
    formAddCard.reset();
  })
  .catch((err) => {
    console.log('Ошибка при добавлении карточки:', err);
  })
  .finally(() => {
    submitButton.textContent = originalText;
  });
});

closeEditBtn.forEach(item => {
    item.addEventListener('click', () => {
        const popup = item.closest('.popup');
        if (popup) {
            closeModal(popup);
        };
    });
});

function openDeleteCardPopup(handleDelete) {
  openModal(popupDeleteCard);
  
  const submitHandler = (evt) => {
      evt.preventDefault();
      handleDelete();
      closeModal(popupDeleteCard);
      formDeleteCard.removeEventListener('submit', submitHandler);
  };
  
  formDeleteCard.addEventListener('submit', submitHandler);
}

function handleDeleteCard(cardId, cardElement) {
  openDeleteCardPopup(() => {
    deleteCard(cardId)
      .then(() => {
        cardElement.remove();
        closeModal(popupDeleteCard);
      })
      .catch((err) => {
        console.log('Ошибка при удалении карточки:', err);
      });
  });
}

enableValidation({
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
  inputRegex: /^[A-Za-zА-Яа-яЁё\-\s]+$/
});

export { clearValidation, enableValidation, openDeleteCardPopup, popupDeleteCard };
