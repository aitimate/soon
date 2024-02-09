import detectEthereumProvider from 'https://cdn.jsdelivr.net/npm/@metamask/detect-provider@2.0.0/+esm';
import {ethers} from 'https://cdn.jsdelivr.net/npm/ethers@6.11.0/+esm';
import {parseBigint, parseNumStr} from 'https://cdn.jsdelivr.net/npm/number-adapter@1.0.2/+esm';

document.getElementById("purchaseInputContainer").innerHTML = `
            <input id="purchaseInput" type="text" class="text-block-25" value="0" style="width: 100%;height: 100%;background: transparent;outline:none;border:none;"/>
            <div class="div-block-33">
              <div id="purchaseInputMaxBtn" class="text-block-24">MAX</div>
            </div>
`;

const DOM = {
    $progress: document.getElementById("progress"), // soon-43ba3f.css:.div-block-26
    $maxPurchaseLimit: document.getElementById("maxPurchaseLimit"), // 5 ETH
    $time: document.getElementById("time"), // 2024.02.19 - 2024.02.20
    $remainingAmount: document.getElementById("remainingAmount"), // 123.45 ETH
    $initialAmount: document.getElementById("initialAmount"), // Fundraise Goal of 1,000 ETH
    $maxPurchaseLimitTip: document.getElementById("maxPurchaseLimitTip"), // Amount (Max: 5 ETH)
    $purchased: document.getElementById("purchased"), // You Purchased: 0.00
    $purchaseInput: document.getElementById("purchaseInput"), // 0.0
    $purchaseInputMaxBtn: document.getElementById("purchaseInputMaxBtn"), // MAX
    $walletMainBtn: document.getElementById("walletMainBtn"),
    $walletSeedBtn: document.getElementById("walletSeedBtn")
};
const formatDate = (() => {
    const DateTimeFormat = new Intl.DateTimeFormat("en", {
        hourCycle: "h23",   // 2022/4 需要主动开启支持：tsconfig.js -> "lib": ["dom","es2020"]
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: "2-digit",
    })

    return (date, format) => {
        const parts = DateTimeFormat.formatToParts(date ? new Date(date) : new Date()).reduce((acc, part) => {
            acc[part.type] = part.value;
            return acc;
        }, {});
        return (format || "Y-M-D h:m:s")
            .replace(/Y/g, parts.year)
            .replace(/M/g, parts.month)
            .replace(/D/g, parts.day)
            .replace(/h/g, parts.hour)
            .replace(/m/g, parts.minute)
            .replace(/s/g, parts.second);
    }
})();

;(async () => {
    let currentAccount;
    // const rpcList = [
    //     "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
    //     "https://data-seed-prebsc-1-s2.bnbchain.org:8545",
    //     "https://data-seed-prebsc-2-s1.bnbchain.org:8545",
    //     "https://data-seed-prebsc-2-s2.bnbchain.org:8545"
    // ]
    const provider = new ethers.JsonRpcProvider("https://data-seed-prebsc-1-s1.bnbchain.org:8545");
    const ico = new ethers.Contract("0x5D7A9F1b8e2E7892beC4d16e33B1E464548E604F", [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                }
            ],
            "name": "userMapGet",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "purchase",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "info",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "uint256",
                            "name": "initialAmount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint112",
                            "name": "remainingAmount",
                            "type": "uint112"
                        },
                        {
                            "internalType": "uint112",
                            "name": "maxPurchaseLimit",
                            "type": "uint112"
                        },
                        {
                            "internalType": "uint32",
                            "name": "startTime",
                            "type": "uint32"
                        },
                        {
                            "internalType": "uint32",
                            "name": "deadline",
                            "type": "uint32"
                        }
                    ],
                    "internalType": "struct SoonICO.ICOInfo",
                    "name": "i",
                    "type": "tuple"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }], provider);
    const updateSeedInfo = (() => {
        let initializedMaxBtn = false;
        return async () => {
            try {
                const info = await ico.info()
                const progress = (Number(parseNumStr(info.initialAmount - info.remainingAmount, -18)) / parseNumStr(info.initialAmount, -18)).toFixed(0);
                DOM.$progress.style.width = `${progress === "0" ? 1 : progress}%`
                DOM.$remainingAmount.textContent = `${Number(parseNumStr(info.initialAmount - info.remainingAmount, -18)).toFixed(2).toLocaleString()} ETH`
                DOM.$initialAmount.textContent = `Fundraise Goal of ${Number(parseNumStr(info.initialAmount, -18)).toLocaleString()} ETH`
                DOM.$maxPurchaseLimitTip.textContent = `Amount (Max: ${parseNumStr(info.maxPurchaseLimit, -18)} ETH)`
                DOM.$maxPurchaseLimit.textContent = `${parseNumStr(info.maxPurchaseLimit, -18)} ETH`
                const startTime = Number(info.startTime * 1000n);
                const deadline = Number(info.deadline * 1000n);
                const now = new Date().getTime();
                if (currentAccount?.length > 0) {
                    if (now < startTime) {
                        DOM.$walletSeedBtn.querySelector("div").textContent = "Coming..."
                    } else if (now > deadline) {
                        DOM.$walletSeedBtn.querySelector("div").textContent = "Ended."
                    } else {
                        DOM.$walletSeedBtn.querySelector("div").textContent = "BUY NOW!"
                        DOM.$walletSeedBtn.addEventListener("click", async () => {
                            const value = parseBigint(DOM.$purchaseInput.value, 18);
                            if (value > 0n) {
                                try {
                                    DOM.$walletSeedBtn.style.pointerEvents = "none";
                                    const res = await ico.purchase({value: value})
                                    await res.wait(1)
                                } catch (e) {
                                    console.log(`purchase: ${e}`)
                                } finally {
                                    DOM.$walletSeedBtn.style.pointerEvents = "auto";
                                }
                            }
                        })
                    }
                }
                DOM.$time.textContent = `${formatDate(new Date(startTime), "Y.M.D")} - ${formatDate(new Date(deadline), "Y.M.D")}`
                if (!initializedMaxBtn) {
                    DOM.$purchaseInputMaxBtn.addEventListener("click", () => {
                        DOM.$purchaseInput.value = parseNumStr(info.maxPurchaseLimit, -18);
                    })
                    initializedMaxBtn = true
                }
                if (currentAccount?.length > 0) {
                    DOM.$purchased.textContent = `You Purchased: ${Number(parseNumStr(await ico.userMapGet(currentAccount), -18)).toFixed(2)}`
                }
            } catch (e) {
                console.log(`updateSeedInfo: ${e}`)
            }
        }
    })();
    await updateSeedInfo()
    setInterval(updateSeedInfo, 2000)

    const wallet = await detectEthereumProvider();
    if (wallet) {
        if (wallet._state?.accounts?.length) {
            currentAccount = wallet._state.accounts[0]
            updateAccount()
        } else {
            registerConnect()
        }

        wallet.on('accountsChanged', function handleAccountsChanged(accounts) {
            if (accounts.length === 0) {
                currentAccount = undefined
                DOM.$walletSeedBtn.querySelector("div").textContent = "CONNECT WALLET"
                DOM.$walletMainBtn.querySelectorAll("div").forEach(item => {
                    item.textContent = "CONNECT"
                })
                registerConnect()
                console.log('Please connect to MetaMask.');
            } else if (accounts[0] !== currentAccount) {
                currentAccount = accounts[0]
                updateAccount()
            }
        });

        function registerConnect() {
            async function connectWallet() {
                try {
                    await wallet.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{chainId: '0x61'}],
                    });
                } catch (switchError) {
                    // This error code indicates that the chain has not been added to MetaMask.
                    if (switchError.code === 4902) {
                        try {
                            await wallet.request({
                                method: 'wallet_addEthereumChain',
                                params: [
                                    {
                                        chainId: '0x61',
                                        chainName: 'bscTestnet',
                                        rpcUrls: [
                                            "https://data-seed-prebsc-2-s1.bnbchain.org:8545",
                                            "https://data-seed-prebsc-2-s2.bnbchain.org:8545",
                                            "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
                                            "https://data-seed-prebsc-1-s2.bnbchain.org:8545",
                                        ],
                                    },
                                ],
                            });
                        } catch (addError) {
                            console.log(`addError: ${addError}`)
                            return
                        }
                    } else {
                        console.log(`switchError: ${switchError}`)
                    }
                }

                const accounts = await wallet.request({method: 'eth_requestAccounts'});
                currentAccount = accounts[0]
                updateAccount()
                DOM.$walletMainBtn.removeEventListener("click", connectWallet, true);
                DOM.$walletSeedBtn.removeEventListener("click", connectWallet, true);
            }

            DOM.$walletMainBtn.addEventListener("click", connectWallet, true)
            DOM.$walletSeedBtn.addEventListener("click", connectWallet, true)
        }


        function updateAccount() {
            DOM.$walletMainBtn.querySelectorAll("div").forEach(item => {
                item.textContent = currentAccount.slice(0, 6) + ".." + currentAccount.slice(-4)
            })
        }
    } else {
        console.error('Please install MetaMask!', error)
    }
})();
