function trackFacebookLead() {
    console.log('[DEMO] Facebook Lead event simulation');
    // В демо-режиме просто логируем действие
    return true;
}

function loadFacebookPixel() {
    console.log('[DEMO] Facebook Pixel loading simulation');
    // В демо-режиме ничего не загружаем
}

function isPopupBlocked(popupWindow) {
    return !popupWindow || popupWindow.closed || typeof popupWindow.closed === 'undefined';
}

function openAuthFallback(authUrl) {
    console.log('[DEMO] Showing auth fallback');
    const fallbackDiv = document.createElement('div');
    fallbackDiv.style.position = 'fixed';
    fallbackDiv.style.bottom = '20px';
    fallbackDiv.style.left = '20px';
    fallbackDiv.style.padding = '15px';
    fallbackDiv.style.backgroundColor = '#f8f9fa';
    fallbackDiv.style.border = '1px solid #dee2e6';
    fallbackDiv.style.borderRadius = '5px';
    fallbackDiv.style.zIndex = '10000';

    const message = document.createElement('p');
    message.textContent = 'Демо-режим: Для завершения регистрации перейдите по ссылке:';

    const link = document.createElement('a');
    link.href = '#';
    link.textContent = 'Перейти к авторизации (демо)';
    link.style.display = 'block';
    link.style.marginTop = '10px';
    link.style.color = 'blue';
    link.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Это демо-версия. В реальном проекте здесь была бы авторизация.');
    });

    fallbackDiv.appendChild(message);
    fallbackDiv.appendChild(link);
    document.body.appendChild(fallbackDiv);
}

// Main Application
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded (DEMO MODE)');

    // DEMO CONFIG - все чувствительные данные заменены на заглушки
    const DEMO_MODE = true;
    const CRM_PROXY_URL = DEMO_MODE ? null : 'https://real-crm-api.example.com'; // В демо не используется
    const LINK_ID = DEMO_MODE ? 0 : 4; // Демо ID

    // DOM Elements
    const elements = {
        form: document.getElementById('leadForm'),
        nameInput: document.getElementById('nameInput'),
        phoneInput: document.getElementById('phoneInput'),
        submitButton: document.getElementById('submitBtn'),
        thankYouPopup: document.getElementById('thankYouPopup'),
        closePopupBtn: document.getElementById('closePopup'),
        nameError: document.getElementById('nameError'),
        phoneError: document.getElementById('phoneError'),
    };

    // Инициализация ввода телефона (демо-режим)
    let iti;
    if (window.intlTelInput) {
        iti = intlTelInput(elements.phoneInput, {
            initialCountry: 'ru',
            separateDialCode: true,
            preferredCountries: ['ru', 'us', 'gb', 'de', 'fr'],
            utilsScript: DEMO_MODE ? null : './intlTelInputWithUtils.min.js', // В демо utils не нужны
            customPlaceholder: () => '+7 (___) ___-__-__',
        });
    }

    function validateForm() {
        let isValid = true;
        const name = elements.nameInput.value.trim();
        const phone = elements.phoneInput.value.trim();

        elements.nameError.textContent = '';
        elements.phoneError.textContent = '';

        if (!name || name.length < 2) {
            elements.nameError.textContent = 'Введите имя (минимум 2 символа)';
            isValid = false;
        }

        if (!phone) {
            elements.phoneError.textContent = 'Введите номер телефона';
            isValid = false;
        } else if (iti && !iti.isValidNumber()) {
            elements.phoneError.textContent = 'Введите корректный номер в формате: +79123456789';
            isValid = false;
        }

        return isValid;
    }

    elements.form.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!validateForm()) return;

        elements.submitButton.disabled = true;
        elements.submitButton.textContent = 'Отправка...';

        // Демо-задержка для имитации работы
        await new Promise((resolve) => setTimeout(resolve, 1000));

        try {
            // В демо-режине просто логируем данные
            const phoneNumber = iti ? iti.getNumber() : elements.phoneInput.value;
            console.log('[DEMO] Form submitted with data:', {
                name: elements.nameInput.value.trim(),
                phone: phoneNumber,
                email: `user${Date.now()}@meta.ai`,
                country: iti ? iti.getSelectedCountryData().iso2.toUpperCase() : 'RU',
                language: navigator.language.slice(0, 2) || 'ru',
            });

            // Показываем успешное сообщение
            elements.thankYouPopup.style.display = 'flex';
            elements.form.reset();

            // Имитируем трекинг
            trackFacebookLead();

            // Демо-авторизация
            if (DEMO_MODE) {
                console.log('[DEMO] Auto-login simulation');
                const authWindow = window.open('', 'authWindow', 'width=500,height=600');

                setTimeout(() => {
                    if (isPopupBlocked(authWindow)) {
                        openAuthFallback('#');
                    } else {
                        setTimeout(() => {
                            try {
                                if (authWindow && !authWindow.closed) {
                                    authWindow.close();
                                    console.log('[DEMO] Auth window closed');
                                }
                            } catch (e) {
                                console.warn('[DEMO] Auth window close error:', e);
                            }
                        }, 3000);
                    }
                }, 100);
            }
        } catch (error) {
            console.error('[DEMO] Error:', error);
            alert('Демо-ошибка: ' + error.message);
        } finally {
            elements.submitButton.disabled = false;
            elements.submitButton.textContent = 'Оставить заявку';
        }
    });

    elements.closePopupBtn.addEventListener('click', () => {
        elements.thankYouPopup.style.display = 'none';
    });

    elements.thankYouPopup.addEventListener('click', (e) => {
        if (e.target === elements.thankYouPopup) {
            elements.thankYouPopup.style.display = 'none';
        }
    });
});
