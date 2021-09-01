export const keyPressNumbers = (event: any) => {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
        event.preventDefault();
        return false;
    } else {
        return true;
    }
}

export const keyPressPositiveNumbers = (event: any) => {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 1-9
    if ((charCode < 48 || charCode > 57)) {
        event.preventDefault();
        return false;
    } else {
        return true;
    }
}

export const keyPressDecimals = (event: any) => {
    var charCode = (event.which) ? event.which : event.keyCode;
    //Numbers 0-9 and Decimal point
    if ((charCode < 48 || charCode > 57)) {
        if(charCode == 46){
            return true;
        }
        else{
            event.preventDefault();
            return false;
        }
    } else {
        return true;
    }
}