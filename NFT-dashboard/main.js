//Moralis.initialize("jAcAyruzIchs5uZcbzGAhz2yDnoHxuOzlT8yBC4a");
//Moralis.serverURL = "https://gt4vx0s0or1s.usemoralis.com:2053/server";

appId= "jAcAyruzIchs5uZcbzGAhz2yDnoHxuOzlT8yBC4a";
serverURL= "https://gt4vx0s0or1s.usemoralis.com:2053/server";
Moralis.start({ serverURL, appId});


const CONTRACT_ADDRESS = "0x339a49bae35cd40b0c82d6edb6ec366573383a87"


function fetchNFTMetadata(NFTs) {
    let promises = [];
    for (let i = 0; i < NFTs.length; i++) {
        let nft = NFTs[i];
        let id = nft.token_id;

        // Call Moralis Cloud function -> Static JSON File
        promises.push(fetch("https://gt4vx0s0or1s.usemoralis.com:2053/server/functions/getNFT?_ApplicationId=jAcAyruzIchs5uZcbzGAhz2yDnoHxuOzlT8yBC4a&nftId=" + id)
        .then(res => res.json())
        .then(res => JSON.parse(res.result))
        .then(res => {nft.metadata = res})
        .then(res => {
            const options = {address: CONTRACT_ADDRESS, token_id: id, chain: "rinkeby" };
            return Moralis.Web3API.token.getTokenIdOwners(options)

        })
        .then( (res) => {console.log(res)}))
    }
    return Promise.all(promises);

}

    function renderInventory(NTFs) {
        const parent = document.getElementById("app");
        for (let i = 0; i < NTFs.length; i++) {
            const nft = NFTs[i];
            let htmlString = `
                <div class="card">
                    <img class="card-img-top" src="${nft.metadata.image}" alt="Card image cap">
                    <div class="card-body">
                        <h5 class="card-title">${nft.metadata.name}</h5>
                        <p class="card-text">${nft.metadata.description}</p>
                        <a href="#" class="btn btn-primary">Go somewhere</a>
                    </div>
                </div>`
            
            let col = document.createElement("div");
            col.className = "col col-md-4"
            col.innerHTML = htmlString; 
            parent.appendChild(col);


        }
    }

    async function initializeApp(){
        let currentUser = Moralis.User.current();
        if(!currentUser){
            currentUser = await Moralis.Web3.authenticate();
        }


        const options = { address: CONTRACT_ADDRESS, chain: "rinkeby"};
        let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
        let NFTWithMetadata = await fetchNFTMetadata(NFTs.result);
        
        renderInventory(NFTWithMetadata);
    }

    initializeApp();


