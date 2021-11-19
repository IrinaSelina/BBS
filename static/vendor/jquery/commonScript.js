
    var setUnauthorisedMenuItems = function () {
    document.getElementById("userInformation").innerHTML = "войти";
    document.getElementById("authorization").innerHTML = `<li class="mdl-menu__item" onclick="javascript:openPage('/registration.html')">` +
    `Зарегистрироватся` +
    '</li>' +
    `<li class="mdl-menu__item" onclick="javascript:openPage('/authorization.html')">` +
    `Войти` +
    '</li>'
};
    var setAuthorisedMenuItems = function (object) {
    var user = object.user;
    var person = user.person ? user.person.name ? user.person.name : user.person.surname ? user.person.surname : user.patronymic: null;
    var userInformation = "нет информации";
    if (person) {
        userInformation = person;
    } else if (user.contact) {
        if (user.contact.email) {
            userInformation = user.contact.email;
        } else if (user.contact.phone) {
            userInformation = user.contact.phone;
        }
    }
    document.getElementById("userInformation").innerHTML = userInformation;
    document.getElementById("authorization").innerHTML = `<li class="mdl-menu__item"><a onclick='logOut()'>выйти</a></li>`
};
    var logOut = function () {
    IO.Auth.logout({success: setUnauthorisedMenuItems});
};

    var setAuthorizationProps = function () {
    IO.Auth.check({success:setAuthorisedMenuItems,fail:setUnauthorisedMenuItems})
};

    function getHashValue(key, defaultValue) {
        var matches = location.hash.match(new RegExp(key+'=([^&]*)'));
        return matches ? matches[1] : defaultValue;
    }

    function getHashValues() {
        var hash = location.hash;
        var params = {};
        if(hash){
            hash.replace("#", "").replace("?", "").split("&").forEach(
                (par)=>{
                    if(par){
                        var parProps = par.split("=");
                        if(parProps.length === 2){
                            params[parProps[0]] = parProps[1];
                        }
                    }
                }
            );
        }
        return params;
    }

    function getPathToPage(page, hashValues){
        hashValues = hashValues || {};
        hashValues.locale = hashValues.locale || getHashValue("locale", "uk");
        var uri = new URI();
        var pathName =  location.pathname.substr(0, location.pathname.lastIndexOf("/"));
        var keys = Object.keys(hashValues);
        var newHash = "?" + keys[0] + "=" + hashValues[keys[0]];
        if(keys.length > 1){
            newHash += keys.slice(1, keys.length).map(
                (key)=>hashValues[key] ? ("&" + key + "=" + hashValues[key]) : ''
            ).join('');
        }
        uri.pathname(pathName + page).hash(newHash);
        return uri.toString();
    }

    function openPage(page, hashParams){
        window.location.href = getPathToPage(page, hashParams);
    }

    function changeHash(key, value) {
        window.location.href = getPathToPage(
            location.pathname.substr(location.pathname.lastIndexOf("/"), location.pathname.length),
            Object.assign(getHashValues(), {[key]: value})
        );
        location.reload();
    }
