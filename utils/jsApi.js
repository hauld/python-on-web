let js = {
    fetch_json: async function (url){
        let resp = await fetch(url);
        return await resp.json();
    }
};
export default js;