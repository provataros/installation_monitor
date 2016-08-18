var Target_LINK="http://localhost/smartafc/sysadmin/user/signup/CreateUserInfo.dev"
function post(path, params) {   
    var form = document.createElement("form");   
    form.setAttribute("method", "post");   
    form.setAttribute("action", path);   
    for(var key in params) {  
        if(params.hasOwnProperty(key)) {        
            var hiddenField = document.createElement("input");      
            hiddenField.setAttribute("name", key);      
            hiddenField.setAttribute("value", params[key]);         
            form.appendChild(hiddenField);  
        }   
    }
    document.body.appendChild(form);  
    form.submit(); 
}   
parsed_params={
    cardNum : "3001010000011503",
    frstNm : "performance",
    lastNm : "performance",
    userId : "rand"+Math.floor((Math.random() * 10000) + 1),
    userBirthday : "20161212",
    mobilno : "123456789",
    nPwd : "1211",
    langCd : "en",
    test : "true",
}; 
post(Target_LINK, parsed_params); 