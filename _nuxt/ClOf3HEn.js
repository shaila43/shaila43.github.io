import{_ as g}from"./ijs-FELi.js";import{g as x,_ as w}from"./xnfCxk1q.js";import{j as h,k as f,c as l,o as d,a as t,l as u,b as n,w as i,d as a,m as k}from"#entry";const y={class:"relative text-sm"},v={key:0,class:"material-icons-outlined !text-lg"},b={key:1,class:"material-icons-outlined !text-lg"},_=["innerHTML"],$={__name:"CodeWithCopy",props:{code:{type:String,required:!0},lang:{type:String,required:!0}},async setup(p){let o,e;const r=p,s=h(!1),c=()=>{navigator.clipboard.writeText(r.code).then(()=>{s.value=!0,setTimeout(()=>{s.value=!1},2e3)})},m=([o,e]=f(()=>x()),o=await o,e(),o).highlight(r.code,{lang:r.lang});return(B,P)=>(d(),l("div",y,[t("button",{class:"absolute right-2 top-2 bg-gray-600 text-white px-2 rounded-md cursor-pointer py-2 flex items-center justify-center h-8 w-8","aria-label":"Copy code snippet to clipboard",onClick:c},[u(s)?(d(),l("span",v,"check")):(d(),l("span",b,"content_copy"))]),t("div",{class:"p-4 bg-[#272822] rounded-md overflow-auto",innerHTML:u(m)},null,8,_)]))}},S={class:"max-w-3xl mx-auto mt-12"},C={__name:"ScrollOrBack",setup(p){const o=()=>window.scrollTo({top:0,behavior:"smooth"});return(e,r)=>{const s=g;return d(),l("nav",S,[n(s,{to:"/",class:"inline-block text-white py-2 px-4 bg-gradient-brand text-center shadow"},{default:i(()=>[...r[0]||(r[0]=[a(" Back to list ",-1)])]),_:1}),t("button",{onClick:o,class:"fixed right-4 bottom-4 w-12 h-12 rounded-full bg-gradient-brand text-white flex items-center justify-center shadow-lg z-50 cursor-pointer","aria-label":"Back to top"},[...r[1]||(r[1]=[t("span",{class:"material-icons-outlined"},"expand_less",-1)])])])}}},q={class:"max-w-3xl mx-auto"},M={class:"space-y-4 md:space-y-6"},I={class:"text-lg/relaxed text-neutral-700"},E={class:"text-lg/relaxed text-neutral-700"},T={class:"text-lg/relaxed text-neutral-700 list-disc ml-10 space-y-3 marker:text-gray-300"},A=`import { BrowserProvider, getAddress } from "ethers";

const onSignInWithMetamask = async () => {
if(window.ethereum) {
  try {
    const provider = new BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    if (accounts.length) {
      signSiwe(provider, accounts[0], _provider.info.name);
    }
  } catch (error) {
    console.error('Sign-in failed: ' + error);
  }
} else {
  // show message or redirect to Metamask install
}
};

async function getNonce() {
  const res = await axios.get("/api/auth/siwe/nonce");
  return res.data.nonce;
}

async function verifyMessage(message, signature, address) {
  const response = await axios.post("/api/auth/siwe/verify", {
    message,
    signature,
    wallet_address: address
  });
  if(response.data.is_valid) {
    // user is logged in, store response.data.token
  } else {
   // show error
  }
}

const signSiwe = async (provider, baseAddress) => {
  const address = getAddress(baseAddress);
  const nonce = await getNonce();
  const message = new SiweMessage({
    domain: location.host,
    address: address,
    statement: "Please sign with your account",
    uri: location.origin,
    version: "1",
    chainId: 1,
    nonce: nonce,
    issuedAt: new Date().toISOString(),
  });
  const preparedMessage = message.prepareMessage();
  const signer = await provider.getSigner();
  const signature = await signer.signMessage(preparedMessage);
  await verifyMessage(
    preparedMessage,
    signature,
    address,
  );
};
`,j=`<template>
  <button @click="onSignInWithMetamask">
    Sign in with Metamask
  </button>
</template>`,N=`<?php

namespace App\\HttpControllers;

use App\\Http\\Controllers\\Controller;
use AppModels\\Siwe;
use AppModels\\User;
use Ethereum\\EcRecover;
use Illuminate\\Http\\Request;
use Str;

class SiweController extends Controller
{
  public function nonce()
  {
    $siwe = Siwe::create([
        'nonce' => Str::random(32),
        'expires_at' => now()->addMinutes(5)
    ]);
    return response()->json(['nonce' => $siwe->nonce]);
  }

  public function verify(Request $request)
  {
    $request->validate([
      'message' => ['required', 'string'],
      'signature' => ['required', 'string'], 
      'wallet_address' => ['required', 'string']
    ]);

    $message = $request->message;
    $walletAddress = $request->wallet_address;
    $nonce = $this->extractNonceFromMessage($message);
    $siwe = Siwe::where('nonce', $nonce)->where('expires_at', '>', now())->first();
    if ($siwe === null) {
        return response()->json([
          'is_valid' => false, 
          'error' => 'Invalid or expired nonce.'
        ], 401);
    }
    $siwe->delete();
    $verified = EcRecover::personalVerifyEcRecover($message, $request->signature, strtolower($walletAddress));
    if ($verified) {
        $user = User::firstOrCreate(['wallet_address' => $walletAddress]);
        $token = $user->createToken('auth_token');
        return response()->json([
            'is_valid' => true,
            'token' => $token->plainTextToken,
        ]);
    }
    return response()->json([
      'is_valid' => false, 
      'error' => 'Invalid signature'
    ], 401);
  }

  private function extractNonceFromMessage($message)
  {
    preg_match('/Nonce: (w+)/', $message, $matches);
    return $matches[1] ?? null;
  }
}
`,L={__name:"how-to-implement-siwe",setup(p){return(o,e)=>{const r=g,s=$,c=C;return d(),l("div",null,[t("article",q,[e[19]||(e[19]=t("img",{src:w,class:"w-full aspect-16/9 mx-auto"},null,-1)),e[20]||(e[20]=t("h2",{class:"text-2xl md:text-3xl lg:text-4xl my-5 md:my-8 lg:my-10 font-bold text-neutral-800"}," How to implement SIWE | EIP-4361 ",-1)),t("div",M,[e[9]||(e[9]=k('<p class="text-lg/relaxed text-neutral-700"><a class="link-primary" href="https://eips.ethereum.org/EIPS/eip-4361" target="_blank" rel="noopener noreferrer">EIP-4361</a>: Sign-In With Ethereum (SIWE) allows users to authenticate by proving ownership of their Ethereum account. Instead of traditional logins or passwords, users sign a message with their wallet, like MetaMask. <br></p><p class="text-lg/relaxed text-neutral-700"> The SIWE message can be generated either on the frontend or backend. In our setup, it’s created on the frontend, and then sent to the backend for verification. The backend (Laravel in our case) verifies the cryptographic signature to confirm that the message was signed by the correct Ethereum address and generates a Sanctum token for the user. This token is then used to authenticate the user in subsequent requests, providing a secure, passwordless login experience. </p><p class="text-lg/relaxed text-neutral-700">Why Use SIWE:</p><ul class="text-lg/relaxed text-neutral-700 list-disc ml-10 space-y-3 marker:text-gray-300"><li>Passwordless authentication</li><li>Decentralized identity</li><li>Strong cryptographic security</li></ul>',4)),t("p",I,[e[2]||(e[2]=a(" Install the ",-1)),n(r,{class:"link-primary",to:"https://www.npmjs.com/package/siwe",target:"_blank"},{default:i(()=>[...e[0]||(e[0]=[a("siwe",-1)])]),_:1}),e[3]||(e[3]=a(" and ",-1)),n(r,{class:"link-primary",to:"https://www.npmjs.com/package/ethers",target:"_blank"},{default:i(()=>[...e[1]||(e[1]=[a("ethers",-1)])]),_:1}),e[4]||(e[4]=a(" package on the frontend. ",-1))]),n(s,{code:`npm i siwe
npm i ethers`,lang:"shellscript"}),e[10]||(e[10]=t("p",{class:"text-lg/relaxed text-neutral-700"}," Create Sign in with Metamask button and add click event on it. ",-1)),n(s,{code:j,lang:"vue"}),t("p",E,[e[6]||(e[6]=a(" In Laravel project install required ",-1)),n(r,{class:"link-primary",to:"https://packagist.org/packages/digitaldonkey/ecverify",target:"_blank"},{default:i(()=>[...e[5]||(e[5]=[a("digitaldonkey/ecverify",-1)])]),_:1}),e[7]||(e[7]=a(" package. ",-1))]),n(s,{code:"composer require digitaldonkey/ecverify",lang:"shellscript"}),e[11]||(e[11]=t("p",{class:"text-lg/relaxed text-neutral-700"}," Create wallet address field in users table and wallet address field to fillable array in User model. ",-1)),n(s,{code:"php artisan make:migration add_wallet_address_to_users_table",lang:"shellscript"}),n(s,{code:`// migration file
$table->string('wallet_address')->unique()->nullable();`,lang:"php"}),n(s,{code:`// User.php
protected $fillable = [
  // current fields...,
  'wallet_address'
];`,lang:"php"}),e[12]||(e[12]=t("p",{class:"text-lg/relaxed text-neutral-700"}," Create Siwe model, migration and controller. ",-1)),n(s,{code:"php artisan make:model Siwe -mvc",lang:"shellscript"}),n(s,{code:`// migration file
Schema::create('siwes', function (Blueprint $table) {
    $table->id();
    $table->string('nonce')->unique();
    $table->timestamp('expires_at');
    $table->timestamps();
});`,lang:"php"}),n(s,{code:`// Siwe.php    
protected $fillable = [
  'nonce',
  'expires_at'
];`,lang:"php"}),e[13]||(e[13]=t("p",{class:"text-lg/relaxed text-neutral-700"}," Prepare endpoints for nonce and verify. ",-1)),n(s,{code:`// api.php
Route::prefix('auth/siwe')->group(function () {
    Route::get('/nonce', [SiweController::class, 'nonce']);
    Route::post('/verify', [SiweController::class, 'verify']);
});`,lang:"php"}),e[14]||(e[14]=t("p",{class:"text-lg/relaxed text-neutral-700"}," Create controller with required methods. ",-1)),n(s,{code:N,lang:"php"}),e[15]||(e[15]=t("p",{class:"text-lg/relaxed text-neutral-700"}," Nonce is a unique, one-time code that prevents replay attacks. Each login gets a fresh nonce that expires in 5 minutes and can't be reused. ",-1)),e[16]||(e[16]=t("p",{class:"text-lg/relaxed text-neutral-700"}," On frontend side prepare onClick onSignInWithMetamask function. ",-1)),n(s,{code:A,lang:"js"}),e[17]||(e[17]=t("p",{class:"text-lg/relaxed text-neutral-700"}," After verification user token could be saved and used in subsequent requests. ",-1)),e[18]||(e[18]=t("p",{class:"text-lg/relaxed text-neutral-700"},"Useful links:",-1)),t("ul",T,[t("li",null,[n(r,{href:"https://eips.ethereum.org/EIPS/eip-4361",target:"_blank",class:"link-primary"},{default:i(()=>[...e[8]||(e[8]=[a("EIP-4361 specification",-1)])]),_:1})])])])]),n(c)])}}};export{L as default};
