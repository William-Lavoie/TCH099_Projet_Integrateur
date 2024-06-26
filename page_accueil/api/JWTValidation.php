<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);


header("Access-Control-Allow-Origin: http://127.0.0.1:3000, https://huddleharbor.com");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

//auth0
use Auth0\SDK\Auth0;
use Auth0\SDK\Configuration\SdkConfiguration;
use Auth0\SDK\Token;
//library de validation (composer require lcobucci/jwt (library utiliser pour valider))
/*
use Lcobucci\JWT\Validation\Validator;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Validation\Constraint\SignedWith;
use Lcobucci\JWT\Validation\Constraint\IdentifiedBy;
*/

   require ("../../vendor/autoload.php"); // Inclure Composer autoloader

// retourner une erreur approprie 
function returnError($errorMessage, $statusCode = 500) {
    http_response_code($statusCode);
    echo json_encode(['error' => $errorMessage]);
    exit;
}

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'POST') {

    if (preg_match("~valider_token$~", $_SERVER['REQUEST_URI'], $matches)) {



        //recoi token du post
        $authorizationHeader = $_SERVER['HTTP_AUTHORIZATION'];
        $token = str_replace('Bearer ', '', $authorizationHeader);

        if (!$token) {
            returnError('Pas de Token', 400);
        }
        
        $token = new Token(new SdkConfiguration(
            domain: 'https://projet-integrateur-eq2.us.auth0.com/',
            clientId: 'nrLsb1vilAv0TV5kTpyqmP7Gt0NfiXcs',
            audience: ['https://HHValidation/api'],
            cookieSecret: 'null'
        ), $token, Token::TYPE_ID_TOKEN);
        
        if($token->verify()){
            if( $token->validate()){
                echo json_encode(['success' => 'Token est valid']);
            }else {
                // Token n'est pas valide
                returnError('Token n\'est pas valide', 401); // Unauthorized
            }
        }else {
            // Token n'est pas valide (signature)
            returnError('Token n\'est pas signé', 401); // Unauthorized
        }
        
    

        /*
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
    
*/
    }
    }
?>