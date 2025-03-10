package com.senior.project.backend.security.verifiers;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.Instant;

import org.jose4j.jwa.AlgorithmConstraints;
import org.jose4j.jwa.AlgorithmConstraints.ConstraintType;
import org.jose4j.jwk.JsonWebKey;
import org.jose4j.jwk.JsonWebKeySet;
import org.jose4j.jws.AlgorithmIdentifiers;
import org.jose4j.jws.JsonWebSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.senior.project.backend.security.domain.AuthInformation;
import com.senior.project.backend.security.domain.TokenPayload;

/**
 * Token verifier for a Microsoft token
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
@Component
public class MicrosoftEntraIDTokenVerifier implements TokenVerifier {

    private final Logger logger = LoggerFactory.getLogger(MicrosoftEntraIDTokenVerifier.class);

    private JsonWebKeySet keySet;
    private AuthInformation authInformation;
    private MicrosoftKeyset microsoftKeyset;

    public MicrosoftEntraIDTokenVerifier(
        AuthInformation authInformation,
        MicrosoftKeyset microsoftKeyset
    ) {
        this.microsoftKeyset = microsoftKeyset;
        this.authInformation = authInformation;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String verifiyIDToken(String token) throws TokenVerificiationException {
        token = verifyStructure(token);
        String payload = validateSignature(token);
        TokenPayload tokenPayload = validateClaims(payload);
        return tokenPayload.getPrefferedUsername();
    }
    
    /**
     * {@inheritDoc}
     */
    @Override
    public String retrieveName(String token) throws TokenVerificiationException {
        try {
            JsonWebSignature jws = new JsonWebSignature();
            jws.setCompactSerialization(token);
            setKeyForJWS(jws);
            String payload = jws.getPayload();
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            TokenPayload tokenPayload = mapper.readValue(payload, TokenPayload.class);
            return tokenPayload.getName();
        } catch (Exception e) {
            e.printStackTrace();
            throw new TokenVerificiationException("Name could not be extracted");
        }
    }  

    //
    // Private
    //

    /**
     * Verifies the structure of a token
     * 
     * @param token - token being verified
     * @return the strucurally verified token
     * @throws TokenVerificiationException - thrown when token is not structurally correct
     */
    private String verifyStructure(String token) throws TokenVerificiationException {
        String[] segments = token.split("\\.");

        if (segments.length != 3) {
            throw new TokenVerificiationException("Provided token had incorrect number of segments");
        }

        return token;
    }

    /**
     * Validates the signature of the provided token
     * 
     * @param token - token being verified
     * @return - the payload of the token
     * @throws TokenVerificiationException - thrown when signature is invalid
     */
    private String validateSignature(String token) throws TokenVerificiationException {
        try {
            // Parse token and get key set
            JsonWebSignature jws = new JsonWebSignature();
            jws.setAlgorithmConstraints(new AlgorithmConstraints(ConstraintType.WHITELIST, AlgorithmIdentifiers.RSA_USING_SHA256));
            jws.setCompactSerialization(token);
            setKeyForJWS(jws);

            // Verify the token
            if (jws.verifySignature()) {
                return jws.getPayload();
            } else {
                throw new TokenVerificiationException("Token was not validated");
            }

        } catch (Exception e) {
            throw obscureError(e);
        }
    }

    /**
     * Validates the signature of the provided token
     * 
     * @param token - payload being verified
     * @return - the payload of the token
     * @throws TokenVerificiationException - thrown when claims are invalid
     */
    private TokenPayload validateClaims(String payload) throws TokenVerificiationException {
        try {
            // Map to payload class
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            TokenPayload tokenPayload = mapper.readValue(payload, TokenPayload.class);
 
            // Verify time dependent fields
            // The 1000 is because the time fields are recoreded in seconds and Instant.now().toEpochMillis()
            // returns milliseconds
            long now = Instant.now().toEpochMilli() / 1000;
            boolean iatValid = now >= tokenPayload.getIat();
            boolean nbfValid = now >= tokenPayload.getNbf();
            boolean expValid = now < tokenPayload.getExp();

            // Verify aud
            boolean audValid = tokenPayload.getAud().equals(authInformation.getMsClientId());

            // Check results
            if (iatValid && nbfValid && expValid && audValid) return tokenPayload;
            throw new Exception();
        } catch (Exception e) {
            throw new TokenVerificiationException("Error occured validating the token claims");
        }
    }

    /**
     * Creates a the key set from the MicrosoftKeyset
     * @return the keyset
     * @throws TokenVerificiationException 
     */
    private JsonWebKeySet createKeySet() throws TokenVerificiationException {
        String keys;
        JsonWebKeySet keySet = null;
        try {
            keys = microsoftKeyset.getKeySet();
            keySet = new JsonWebKeySet(keys);
        } catch (Exception e) {
            throw obscureError(e);
        }

        return keySet;
    }

    /**
     * Finds the key associated with the token
     * @param kid - key id
     * @return the key or null
     */
    private JsonWebKey extractKey(String kid) {
        for (JsonWebKey key : keySet.getJsonWebKeys()) {
            if (key.getKeyId().equals(kid)) {
                return key;
            }
        }

        return null;
    }

    /**
     * Takes any error produced during the process, prints the error, and throws
     * a new Token Verification Exception;
     * @param e - original error
     * @return - Token Verificiation Exception
     */
    private TokenVerificiationException obscureError(Exception e) {
        StringWriter writer = new StringWriter();
        PrintWriter printWriter = new PrintWriter(writer);
        e.printStackTrace(printWriter);
        logger.error(writer.toString());
        return new TokenVerificiationException(e.getMessage());
    }

    private void setKeyForJWS(JsonWebSignature jws) throws TokenVerificiationException {
        JsonWebKey jwk = null;
        String kid = jws.getKeyIdHeaderValue();
        keySet = createKeySet();

        // Get key for the token
        jwk = extractKey(kid);

        if (jwk == null) {
            // Refetch the keyset if the keys have been rolled over
            microsoftKeyset.invalidateCache();
            keySet = createKeySet();
            jwk = extractKey(kid);

            if (jwk == null) {
                throw new TokenVerificiationException("Token had no key in the key set");
            }
        }

        // Set the key
        jws.setKey(jwk.getKey());
    }
}
