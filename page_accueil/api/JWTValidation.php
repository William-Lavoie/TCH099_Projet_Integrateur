<?php

header("Access-Control-Allow-Origin: http://127.0.0.1:3000, https://huddleharbor.com");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

//auth0
use Auth0\SDK\Auth0;
use Auth0\SDK\Configuration\SdkConfiguration;
//library de validation (composer require lcobucci/jwt (library utiliser pour valider))
use Lcobucci\JWT\Validation\Validator;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Validation\Constraint\SignedWith;
use Lcobucci\JWT\Validation\Constraint\IdentifiedBy;

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {

    if (preg_match("~valider_token$~", $_SERVER['REQUEST_URI'], $matches)) {

        require __DIR__ . '/vendor/autoload.php'; // Include Composer autoloader

        //configer au auth0 SDK
        $config = new SdkConfiguration(
            strategy: SdkConfiguration::STRATEGY_API,
            domain: 'https://projet-integrateur-eq2.us.auth0.com',
            audience: ['https://HHValidation/api']
        );

        $auth0 = new Auth0($config);

        //recoi token du post
        $token = $_POST['token'] ?? null;

        if (!$token) {
            echo json_encode(['error' => 'Pas de Token']);
            exit;
        }

        // Decode le token
        try {
            $decodedToken = $auth0->decode($token);
        } catch (\Auth0\Exception\CoreException $e) { //exception thrown par auth0
            echo json_encode(['error' => 'Impossible de décoder le token']);
            return;
        }

        // Get le JWKS de auth0
        $jwksUrl = 'https://projet-integrateur-eq2.us.auth0.com/.well-known/jwks.json';
        $jwksJson = file_get_contents($jwksUrl);
        $jwks = json_decode($jwksJson, true);


        $signingKey = null;

        //trouver cle dans le set
        foreach ($jwks['keys'] as $key) {
            if ($decodedToken->header('kid') === $key['kid']) {
                $signingKey = $key;
                break;
            }
        }

        if (!$signingKey) {
            // Key not found
            echo json_encode(['error' => 'Clé introuvable']);
        } else{

            // Configuration for JWT
            $jwtConfig = Configuration::forAsymmetricSigner(
                new Sha256(),
                JWK::createFromKeyData($signingKey)
            );
            
            $validator = new Validator();
            $constraints = [
                new SignedWith(new Sha256(), $jwtConfig)
            ];

            // Verification de token
            if ($validator->validate($decodedToken, ...$constraints)) {
            // Token est valide
            echo json_encode(['success' => 'Token est valid']);
            } else {
                // Token n'est pas valide
                echo json_encode(['error' => 'Token n\'est pas valid']);
            }
        }
    }
}
?>

