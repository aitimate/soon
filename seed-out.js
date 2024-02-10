import E from"https://cdn.jsdelivr.net/npm/@metamask/detect-provider@2.0.0/+esm";import{ethers as h}from"https://cdn.jsdelivr.net/npm/ethers@6.11.0/+esm";import{parseBigint as B,parseNumStr as r}from"https://cdn.jsdelivr.net/npm/number-adapter@1.0.2/+esm";document.getElementById("purchaseInputContainer").innerHTML=`
            <input id="purchaseInput" type="text" class="text-block-25" value="0" style="width: 100%;height: 100%;background: transparent;outline:none;border:none;"/>
            <div class="div-block-33">
              <div id="purchaseInputMaxBtn" class="text-block-24">MAX</div>
            </div>
`;const e={$progress:document.getElementById("progress"),$maxPurchaseLimit:document.getElementById("maxPurchaseLimit"),$time:document.getElementById("time"),$remainingAmount:document.getElementById("remainingAmount"),$initialAmount:document.getElementById("initialAmount"),$maxPurchaseLimitTip:document.getElementById("maxPurchaseLimitTip"),$purchased:document.getElementById("purchased"),$purchaseInput:document.getElementById("purchaseInput"),$purchaseInputMaxBtn:document.getElementById("purchaseInputMaxBtn"),$walletMainBtn:document.getElementById("walletMainBtn"),$walletSeedBtn:document.getElementById("walletSeedBtn")},$=(()=>{const n=new Intl.DateTimeFormat("en",{hourCycle:"h23",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"});return(l,p)=>{const i=n.formatToParts(l?new Date(l):new Date).reduce((u,a)=>(u[a.type]=a.value,u),{});return(p||"Y-M-D h:m:s").replace(/Y/g,i.year).replace(/M/g,i.month).replace(/D/g,i.day).replace(/h/g,i.hour).replace(/m/g,i.minute).replace(/s/g,i.second)}})();(async()=>{let n,l;const p=new h.JsonRpcProvider("https://data-seed-prebsc-1-s1.bnbchain.org:8545"),i=new h.Contract("0x5D7A9F1b8e2E7892beC4d16e33B1E464548E604F",[{inputs:[{internalType:"address",name:"user",type:"address"}],name:"userMapGet",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"purchase",outputs:[],stateMutability:"payable",type:"function"},{inputs:[],name:"info",outputs:[{components:[{internalType:"uint256",name:"initialAmount",type:"uint256"},{internalType:"uint112",name:"remainingAmount",type:"uint112"},{internalType:"uint112",name:"maxPurchaseLimit",type:"uint112"},{internalType:"uint32",name:"startTime",type:"uint32"},{internalType:"uint32",name:"deadline",type:"uint32"}],internalType:"struct SoonICO.ICOInfo",name:"i",type:"tuple"}],stateMutability:"view",type:"function"}],p),u=(()=>{let d=!1,c=!1;return async()=>{try{const t=await i.info(),o=(Number(r(t.initialAmount-t.remainingAmount,-18))/r(t.initialAmount,-18)).toFixed(0);e.$progress.style.width=`${o==="0"?1:o}%`,e.$remainingAmount.textContent=`${Number(r(t.initialAmount-t.remainingAmount,-18)).toFixed(2).toLocaleString()} ETH`,e.$initialAmount.textContent=`Fundraise Goal of ${Number(r(t.initialAmount,-18)).toLocaleString()} ETH`,e.$maxPurchaseLimitTip.textContent=`Amount (Max: ${r(t.maxPurchaseLimit,-18)} ETH)`,e.$maxPurchaseLimit.textContent=`${r(t.maxPurchaseLimit,-18)} ETH`;const s=Number(t.startTime*1000n),m=Number(t.deadline*1000n),y=new Date().getTime();n?.length>0&&(y<s?e.$walletSeedBtn.querySelector("div").textContent="Coming...":y>m?e.$walletSeedBtn.querySelector("div").textContent="Ended.":(e.$walletSeedBtn.querySelector("div").textContent="BUY NOW!",c||(c=!0,e.$walletSeedBtn.addEventListener("click",async()=>{const g=B(e.$purchaseInput.value,18);if(g>0n)try{e.$walletSeedBtn.style.pointerEvents="none",await(await i.connect(l).purchase({value:g})).wait(1)}catch(w){console.log(`purchase: ${w}`)}finally{e.$walletSeedBtn.style.pointerEvents="auto"}})))),e.$time.textContent=`${$(new Date(s),"Y.M.D")} - ${$(new Date(m),"Y.M.D")}`,d||(e.$purchaseInputMaxBtn.addEventListener("click",()=>{e.$purchaseInput.value=r(t.maxPurchaseLimit,-18)}),d=!0),n?.length>0&&(e.$purchased.textContent=`You Purchased: ${Number(r(await i.userMapGet(n),-18)).toFixed(2)}`)}catch(t){console.log(`updateSeedInfo: ${t}`)}}})();await u(),setInterval(u,2e3);const a=await E();if(a){let d=function(){async function t(){try{await a.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x61"}]})}catch(s){if(s.code===4902)try{await a.request({method:"wallet_addEthereumChain",params:[{chainId:"0x61",chainName:"bscTestnet",rpcUrls:["https://data-seed-prebsc-2-s1.bnbchain.org:8545","https://data-seed-prebsc-2-s2.bnbchain.org:8545","https://data-seed-prebsc-1-s1.bnbchain.org:8545","https://data-seed-prebsc-1-s2.bnbchain.org:8545"]}]})}catch(m){console.log(`addError: ${m}`);return}else console.log(`switchError: ${s}`)}n=(await a.request({method:"eth_requestAccounts"}))[0],c(),e.$walletMainBtn.removeEventListener("click",t,!0),e.$walletSeedBtn.removeEventListener("click",t,!0)}e.$walletMainBtn.addEventListener("click",t,!0),e.$walletSeedBtn.addEventListener("click",t,!0)},c=function(){e.$walletMainBtn.querySelectorAll("div").forEach(t=>{t.textContent=n.slice(0,6)+".."+n.slice(-4)})};l=await new h.BrowserProvider(a).getSigner(),a._state?.accounts?.length?(n=a._state.accounts[0],c()):d(),a.on("accountsChanged",function(o){o.length===0?(n=void 0,e.$walletSeedBtn.querySelector("div").textContent="CONNECT WALLET",e.$walletMainBtn.querySelectorAll("div").forEach(s=>{s.textContent="CONNECT"}),d(),console.log("Please connect to MetaMask.")):o[0]!==n&&(n=o[0],c())})}else console.error("Please install MetaMask!",error)})();
