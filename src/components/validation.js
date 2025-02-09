// Показ ошибки валидации
function showInputError(formElement, inputElement, errorMessage, config) {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.add(config.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(config.errorClass);
};
  
// Скрытие ошибки валидации
function hideInputError(formElement, inputElement, config) {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    if (errorElement) {
        inputElement.classList.remove(config.inputErrorClass);
        errorElement.classList.remove(config.errorClass);
        errorElement.textContent = '';
    };
};
  
// Проверка валидности поля
function checkInputValidity(formElement, inputElement, config) {
    const isUrlInput = inputElement.type === 'url';
    
    if (isUrlInput) {
        // Проверка для полей с типом url (аватар и карточка)
        if (!inputElement.validity.valid) {
            showInputError(formElement, inputElement, inputElement.validationMessage, config);
        } else {
            hideInputError(formElement, inputElement, config);
        }
    } else {
        // Проверка для текстовых полей
        inputElement.setCustomValidity('');
        
        let isValid = true;
        let errorMessage = '';

        if (inputElement.value.length === 0) {
            isValid = false;
            errorMessage = 'Вы пропустили это поле.';
        } else if (inputElement.value.length < inputElement.minLength) {
            isValid = false;
            errorMessage = `Минимальное количество символов: ${inputElement.minLength}. Длина текста сейчас: ${inputElement.value.length} символ.`;
        } else if (!config.inputRegex.test(inputElement.value)) {
            isValid = false;
            errorMessage = inputElement.dataset.errorMessage || 
                "Разрешены только буквы, пробелы, знаки препинания и специальные символы '-','_', '%', '$', ':'";
        }

        if (!isValid) {
            inputElement.setCustomValidity(errorMessage);
            showInputError(formElement, inputElement, errorMessage, config);
        } else {
            hideInputError(formElement, inputElement, config);
        }
    }
}
  
// Проверка валидности всех полей формы
function hasInvalidInput(inputList) {
    return inputList.some((inputElement) => !inputElement.validity.valid);
};
  
// Переключение состояния кнопки
function toggleButtonState(inputList, buttonElement, config) {
    if (hasInvalidInput(inputList)) {
        buttonElement.classList.add(config.inactiveButtonClass);
        buttonElement.disabled = true;
    } else {
        buttonElement.classList.remove(config.inactiveButtonClass);
        buttonElement.disabled = false;
    };
};

// Функция включения валидации
function enableValidation(config) {
    const formList = Array.from(document.querySelectorAll(config.formSelector));
    
    formList.forEach((formElement) => {
        const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
        const buttonElement = formElement.querySelector(config.submitButtonSelector);
    
        inputList.forEach((inputElement) => {
            inputElement.addEventListener('input', () => {
                checkInputValidity(formElement, inputElement, config);
                toggleButtonState(inputList, buttonElement, config);
            });
        });
    });
};

// Функция очистки ошибок валидации
function clearValidation(formElement, config) {
    const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
    const buttonElement = formElement.querySelector(config.submitButtonSelector);
    
    inputList.forEach((inputElement) => {
        hideInputError(formElement, inputElement, config);
    });
    
    toggleButtonState(inputList, buttonElement, config);
};

export { clearValidation, enableValidation };
