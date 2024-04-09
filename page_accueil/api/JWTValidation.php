<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

require ("./vendor/autoload.php"); // Inclure Composer autoloader

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

// retourner une erreur approprie 
function returnError($errorMessage, $statusCode = 500) {
    http_response_code($statusCode);
    echo json_encode(['error' => $errorMessage]);
    exit;
}

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {

    if (preg_match("~valider_token$~", $_SERVER['REQUEST_URI'], $matches)) {


        //configure au auth0 SDK
        $config = new SdkConfiguration(
            strategy: SdkConfiguration::STRATEGY_API,
            domain: 'https://projet-integrateur-eq2.us.auth0.com',
            audience: ['https://HHValidation/api']
        );

        $auth0 = new Auth0($config);

        //recoi token du post
        $token = $_SERVER['HTTP_AUTHORIZATION'];
       // $token = $_POST['token'] ?? null;

        if (!$token) {
            returnError('Pas de Token', 400);
        }

        // Decode le token
        try {
            $decodedToken = $auth0->decode($token);
        } catch (\Auth0\Exception\CoreException $e) { //exception thrown par auth0
            returnError('Impossible de décoder le token', 400);
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
            returnError('Clé introuvable', 400);
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
                returnError('Token n\'est pas valide', 401); // Unauthorized
            }
        }
    }
}
?>

