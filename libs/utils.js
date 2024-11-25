const params = () => {
    var url = window.location.search.substring(1);
    var query = url.split('&');
    let ans = {};
    query.forEach(pair => {
       let [a, b] = pair.split('=');
       ans[a] = b;
    });
    return ans;
};
