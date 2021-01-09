import tabJoursEnOrdre from './Utilitaire/gestionTemps.js'
const CLEFAPI = '';
let resultatsAPI;
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        let long = position.coords.longitude;
        let lat = position.coords.latitude;
        AppelAPI(long, lat);

    }, () => {
        alert('Vous avez refusé la geocalisation, l\'application ne peut pas fonctionner, veulliez activer la geolocalisation');
    })
}

function AppelAPI(long, lat) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely&units=metric&lang=fr&appid=${CLEFAPI}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            resultatsAPI = data;
            $('.temps').text(resultatsAPI.current.weather[0]['description']);
            $('.localisation').text(resultatsAPI.timezone);
            $('.temperature').text(Math.trunc(resultatsAPI.current.temp) + '°');

            // heures /3
            let heureActuelle = new Date().getHours();
            for (let i = 0; i < $(`.heure-nom-prevision`).length; i++) {
                let heureIncr = heureActuelle + i * 3;
                if (heureIncr > 24) {
                    $(`.heure-nom-prevision:eq(${i})`).text((heureIncr - 24) + ' h');
                } else if (heureIncr === 24) {
                    $(`.heure-nom-prevision:eq(${i})`).text('00 h');
                } else {
                    $(`.heure-nom-prevision:eq(${i})`).text(heureIncr + ' h')
                }
            }
            //temp /3
            for (let j = 0; j < $('.heure-prevision-valeur').length; j++) {
                $(`.heure-prevision-valeur:eq(${j})`).text(`${Math.trunc(resultatsAPI.hourly[j * 3].temp)}°`)
            }

            //3 premeire lettres des jours
            for(let k = 0; k < tabJoursEnOrdre.length; k++){
                $(`.jour-prevision-nom:eq(${k})`).text(tabJoursEnOrdre[k].slice(0,3));
            }
            //temp /jour
            for(let m = 0; m < tabJoursEnOrdre.length; m++){
                $(`.jour-prevision-temp:eq(${m})`).text(`${Math.trunc(resultatsAPI.daily[m + 1].temp.day)}°`);
            }
            // icone svg
            resultatsAPI.current.weather[0].icon[2] === 'd' ? $('.logo-meteo').attr('src',`./ressources/jour/${resultatsAPI.current.weather[0].icon}.svg`) : $('.logo-meteo').attr('src',`./ressources/nuit/${resultatsAPI.current.weather[0].icon}.svg`);

            $('.overlay-icone-chargement').addClass('disparition');
        })
}

