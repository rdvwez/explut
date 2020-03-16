exports.success =  (result) =>{
    return{
        status: 'success',
        result: result
    }
}

exports.error =  (message) =>{
    return{
        status: 'error',
        resultat: message
    }
}

exports.isErr = (err) =>{
    return err instanceof Error;
}

exports.checkAndChange = (obj)  =>{
    if (this.isErr(obj)) {
        return this.error(obj.message)
    }else{
        return this.success(obj)
    }
}

exports.trim = (data) =>{ 
    return data.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
};

