const SERVER_TOKEN = process.env.SERVER_TOKEN;
const config = {
	url: 'https://nomoreparties.co/v1/frontend-st-cohort-201',
	headers: {
		authorization: SERVER_TOKEN,
		'Content-Type': 'application/json',
	},
}

//Функция обрабатывающая ответ сервера
function getResponse(res) {
	if (res.ok) {
		return res.json()
	}
	return Promise.reject(`Ошибка: ${res.status}`)
}

// Функция получения данных пользователя
export function getUserInfo() {
	return fetch(`${config.url}/users/me`, {
		method: 'GET',
		headers: config.headers,
	}).then(getResponse)
}

// Функция обновления данных пользователя
export function updateUserInfo(name, about) {
	return fetch(`${config.url}/users/me`, {
		method: 'PATCH',
		headers: config.headers, 
		body: JSON.stringify({
			name: name,
			about: about,
		}),
	}).then(getResponse)
}

// Функция обновления аватара
export function updateAvatar(link) {
	return fetch(`${config.url}/users/me/avatar`, {
		method: 'PATCH',
		headers: config.headers,
		body: JSON.stringify({
			avatar: link,
		}),
	}).then(getResponse)
}

// Функция получения карточек с сервера
export function getInitialCards() {
	return fetch(`${config.url}/cards`, {
		method: 'GET',
		headers: config.headers,
	}).then(getResponse)
}


// Функция добавления новой карточки
export function addCard(name, link) {
	return fetch(`${config.url}/cards`, {
		method: 'POST',
		headers: config.headers,
		body: JSON.stringify({
			name: name,
			link: link,
		}),
	}).then(getResponse)
}

// Функция удаления карточки
export function deleteCard(id) {
	return fetch(`${config.url}/cards/${id}`, {
		method: 'DELETE',
		headers: config.headers,
	}).then(getResponse)
}


// Функция добавления лайка карточке
export function addLike(id) {
	return fetch(`${config.url}/cards/likes/${id}`, {
		method: 'PUT',
		headers: config.headers,
	}).then(getResponse)
}

// Функция удаления лайка с карточки
export function removeLike(id) {
	return fetch(`${config.url}/cards/likes/${id}`, {
		method: 'DELETE',
		headers: config.headers,
	}).then(getResponse)
}
