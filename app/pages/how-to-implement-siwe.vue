<script setup>
const htmlScriptText = `import { BrowserProvider, getAddress } from "ethers";

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
`;

const htmlTemplateText = `<template>
  <button @click="onSignInWithMetamask">
    Sign in with Metamask
  </button>
</template>`;

const backControllerText = `<?php

namespace App\\Http\Controllers;

use App\\Http\\Controllers\\Controller;
use App\Models\\Siwe;
use App\Models\\User;
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
    preg_match('/Nonce: (\w+)/', $message, $matches);
    return $matches[1] ?? null;
  }
}
`;
</script>

<template>
  <div>
    <article class="max-w-3xl mx-auto">
      <img
        src="/img/multi-injected-provider-discovery-eip-6963.jpeg"
        class="w-full aspect-16/9 mx-auto"
      />
      <h2
        class="text-2xl md:text-3xl lg:text-4xl my-5 md:my-8 lg:my-10 font-bold text-neutral-800"
      >
        How to implement SIWE | EIP-4361
      </h2>
      <div class="space-y-4 md:space-y-6">
        <p class="text-lg/relaxed text-neutral-700">
          <a
            class="link-primary"
            href="https://eips.ethereum.org/EIPS/eip-4361"
            target="_blank"
            rel="noopener noreferrer"
            >EIP-4361</a
          >: Sign-In With Ethereum (SIWE) allows users to authenticate by
          proving ownership of their Ethereum account. Instead of traditional
          logins or passwords, users sign a message with their wallet, like
          MetaMask. <br />
        </p>
        <p class="text-lg/relaxed text-neutral-700">
          The SIWE message can be generated either on the frontend or backend.
          In our setup, it’s created on the frontend, and then sent to the
          backend for verification. The backend (Laravel in our case) verifies
          the cryptographic signature to confirm that the message was signed by
          the correct Ethereum address and generates a Sanctum token for the
          user. This token is then used to authenticate the user in subsequent
          requests, providing a secure, passwordless login experience.
        </p>
        <p class="text-lg/relaxed text-neutral-700">Why Use SIWE:</p>
        <ul
          class="text-lg/relaxed text-neutral-700 list-disc ml-10 space-y-3 marker:text-gray-300"
        >
          <li>Passwordless authentication</li>
          <li>Decentralized identity</li>
          <li>Strong cryptographic security</li>
        </ul>
        <p class="text-lg/relaxed text-neutral-700">
          Install the
          <NuxtLink
            class="link-primary"
            to="https://www.npmjs.com/package/siwe"
            target="_blank"
            >siwe</NuxtLink
          >
          and
          <NuxtLink
            class="link-primary"
            to="https://www.npmjs.com/package/ethers"
            target="_blank"
            >ethers</NuxtLink
          >

          package on the frontend.
        </p>
        <CodeWithCopy
          code="npm i siwe
npm i ethers"
          lang="shellscript"
        />
        <p class="text-lg/relaxed text-neutral-700">
          Create Sign in with Metamask button and add click event on it.
        </p>
        <CodeWithCopy :code="htmlTemplateText" lang="vue" />

        <p class="text-lg/relaxed text-neutral-700">
          In Laravel project install required
          <NuxtLink
            class="link-primary"
            to="https://packagist.org/packages/digitaldonkey/ecverify"
            target="_blank"
            >digitaldonkey/ecverify</NuxtLink
          >
          package.
        </p>
        <CodeWithCopy
          code="composer require digitaldonkey/ecverify"
          lang="shellscript"
        />
        <p class="text-lg/relaxed text-neutral-700">
          Create wallet address field in users table and wallet address field to
          fillable array in User model.
        </p>
        <CodeWithCopy
          code="php artisan make:migration add_wallet_address_to_users_table"
          lang="shellscript"
        />
        <CodeWithCopy
          code="// migration file
$table->string('wallet_address')->unique()->nullable();"
          lang="php"
        />
        <CodeWithCopy
          code="// User.php
protected $fillable = [
  // current fields...,
  'wallet_address'
];"
          lang="php"
        />
        <p class="text-lg/relaxed text-neutral-700">
          Create Siwe model, migration and controller.
        </p>
        <CodeWithCopy
          code="php artisan make:model Siwe -mvc"
          lang="shellscript"
        />
        <CodeWithCopy
          code="// migration file
Schema::create('siwes', function (Blueprint $table) {
    $table->id();
    $table->string('nonce')->unique();
    $table->timestamp('expires_at');
    $table->timestamps();
});"
          lang="php"
        />
        <CodeWithCopy
          code="// Siwe.php    
protected $fillable = [
  'nonce',
  'expires_at'
];"
          lang="php"
        />
        <p class="text-lg/relaxed text-neutral-700">
          Prepare endpoints for nonce and verify.
        </p>
        <CodeWithCopy
          code="// api.php
Route::prefix('auth/siwe')->group(function () {
    Route::get('/nonce', [SiweController::class, 'nonce']);
    Route::post('/verify', [SiweController::class, 'verify']);
});"
          lang="php"
        />
        <p class="text-lg/relaxed text-neutral-700">
          Create controller with required methods.
        </p>
        <CodeWithCopy :code="backControllerText" lang="php" />
        <p class="text-lg/relaxed text-neutral-700">
          Nonce is a unique, one-time code that prevents replay attacks. Each
          login gets a fresh nonce that expires in 5 minutes and can't be
          reused.
        </p>
        <p class="text-lg/relaxed text-neutral-700">
          On frontend side prepare onClick onSignInWithMetamask function.
        </p>
        <CodeWithCopy :code="htmlScriptText" lang="js" />
        <p class="text-lg/relaxed text-neutral-700">
          After verification user token could be saved and used in subsequent
          requests.
        </p>
        <p class="text-lg/relaxed text-neutral-700">Useful links:</p>
        <ul
          class="text-lg/relaxed text-neutral-700 list-disc ml-10 space-y-3 marker:text-gray-300"
        >
          <li>
            <NuxtLink
              href="https://eips.ethereum.org/EIPS/eip-4361"
              target="_blank"
              class="link-primary"
              >EIP-4361 specification</NuxtLink
            >
          </li>
        </ul>
      </div>
    </article>
    <ScrollOrBack />
  </div>
</template>
