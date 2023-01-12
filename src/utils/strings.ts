import isNull from "./isNull";

function isEmpty(txt:string) {
    if(isNull(txt)) return true;
    return txt.trim().length == 0;
}

export { isEmpty }