const $weatherSection = $('.weather');
const $weatherHeader = $('.weather__header');
const $weatherHeaderText = $('.weather__header-text');
const $weatherDescription = $('.weather__description');
const $weatherPressure = $('.weather__pressure');
const $weatherWind = $('.weather__wind-speed');
const $weatherClouds = $('.weather__clouds');
const $weatherHumidity = $('.weather__humidity');
const $weatherIcon = $('.weather__icon');
const $weatherTemperature = $('.weather__temperature');


const $arrowButton = $('.search__arrow-button');
const $returnButton = $('.fa-arrow-circle-left');
const $button = $('.search__button');
const $input = $('.search__input')
const $inputText = $('.search__input-text');


const key = "b784aef17a2d71609af905819caf9fd4";
const fadeDuration = 100;


let city = '';
let url = '';
let themeCounter = 0;

function roundNumber(number, decimalPlaces)
{
    let factor = Math.pow(10, decimalPlaces);
    return Math.round(number*factor)/factor;
}
function searchButton() {
    $($button).click((e) => {
        if ($input.val() != '') {
            setCity();
            setURL();
            adjustFontsize();
            sendRequest();
        } 
    })
}
function fadingSection(fadeOut, duration) {
    if(fadeOut) {
        $($weatherSection).fadeOut(duration);
    } else {
        $($weatherSection).fadeIn(duration).css('display', 'flex');
    }
}
function changeElementState(element, isOff) {
    if (isOff) {
        $(element).prop('disabled', isOff)
    } else {
        $(element).prop('disabled', isOff)
    }
}
function clearInput(inputName) {
    inputName.val('');
}
function setCity() {
    city = $input.val();
}
function setURL() {
    url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${key}`;
}
function sendRequest() {
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                return Promise.reject(response)
            }
        })
        .then(response => {
            const {
                name,
                main: { temp, humidity, pressure },
                weather: [{ description, icon }],
                wind: { speed: windSpeed },
                clouds: { all: cloudiness },
            } = response;

            $weatherHeaderText.html(name);
            $weatherDescription.text(description);
            $weatherPressure.text(`pressure: ${pressure} hPa`);
            $weatherWind.text(`wind speed: ${windSpeed} m/s`);
            $weatherClouds.text(`cloudines: ${cloudiness}%`);
            $weatherHumidity.text(`humidity: ${humidity}%`)
            $weatherIcon.css('backgroundImage', `url(http://openweathermap.org/img/wn/${icon}@2x.png)`);
            $inputText.html("Enter city...");
            $weatherTemperature.html(`${roundNumber(temp, 0)}&degC`)
            changeIconBgColor(icon);
            fadingSection(false, fadeDuration);
            changeElementState($button, true); // wyłączam button
            changeElementState($input, true);
            clearInput($input); // czyszczę input

            // console.log(changeIconBgColor(icon));
        })
        .catch(error => {
            if (error.status === 404) {
                console.log("Błąd: żądany adres nie istnieje");
                $inputText.html("Incorrect city's name!")
            }
        });
}
function returnButton() {
    $($returnButton).click(()=> {
        changeElementState($button, false); // włączam button i input
        changeElementState($input, false);
        fadingSection(true, fadeDuration)
    })
}
function cutString(string) { // funkcja zwraca wartość wysokości bez jednostek px
    return string.substring(0, string.length-2);
}
function exchangeAppColor() {
    $($arrowButton).click(()=> {
        if(themeCounter%2 == 0) {
            document.documentElement.style.setProperty('--orange', 'rgb(38, 36, 141)');
            $('.header__icon').css('transform', 'rotate(180deg)')
        } else {
            document.documentElement.style.setProperty('--orange', 'rgb(255, 94, 0)');
            $('.header__icon').css('transform', 'rotate(-180deg)')
        }
        themeCounter++;
    }) 
}

function changeIconBgColor(string) {
    const newString = string.substr(string.length-1);
    if(newString == 'd') { // jeśli ostatnia litera stringa jest równa 'd' (dzień) ustawia poniższy background
        $weatherIcon.css('background-color', 'rgb(0, 178, 209)');
        document.documentElement.style.setProperty('--returnButtonColor', 'black');
    } else {
        $weatherIcon.css('background-color', 'rgb(0, 16, 48)');
        document.documentElement.style.setProperty('--returnButtonColor', 'white');
    }
}

function adjustFontsize() {
    const inputLength = $input.val().length;
    if(inputLength > 12 && window.innerHeight > window.innerWidth && window.innerWidth < cutString('768px')) {
        const currentFontSize = cutString($weatherHeaderText.css('font-size'));
        $weatherHeaderText.css('font-size', currentFontSize*0.7 +'px');
    }
}

fadingSection(true, 0); // defaultowo ukrywam drugą sekcje
searchButton(); // nasłuchiwanie dla buttonów
returnButton();
exchangeAppColor();

