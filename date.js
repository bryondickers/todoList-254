
exports.getDate = getDate;



function getDate() {
    var date = new Date();

    var options = {
        day:"numeric",
        month:"long",
        year:"numeric",
    }
    return  date.toLocaleDateString("en-US",options);

}


exports.getDay = getDay;

function getDay() {
    var date = new Date();

    var options = {
        day:"numeric"

    }
    return  date.toLocaleDateString("en-US",options);

}
