class Translator{
    static async translateString(inputString, sourceLang = 'JA', targetLang = 'EN') {
        var params = new URLSearchParams();
        params.append("auth_key", process.env.DEEPL_TOKEN);
        params.append("source_lang", sourceLang);
        params.append("target_lang", targetLang);
        params.append("text", inputString);
        return fetch("https://api-free.deepl.com/v2/translate", {
            method: "POST",
            body: params
        }).then(res => res.json());
    }
}

export default Translator;