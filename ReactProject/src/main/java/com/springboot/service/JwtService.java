package com.springboot.service;

import com.springboot.config.CustomUser;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
    
    private final String SECRET_KEY = "5gS0VrP4UiYldc1StGVgUb9D3vprm7Qip3kbaR6q/I4=";

    public JwtService() throws NoSuchAlgorithmException {
        
        // generating key
        /*KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
            
        SecretKey sk = keyGen.generateKey();
            
        SECRET_KEY = Base64.getEncoder().encodeToString(sk.getEncoded());*/
        
        System.out.println("Secret key: " + SECRET_KEY);
        
    }
    
    
    // Generate JWT Token
    public String generateToken(String username) {
        
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", username);
        
        return Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 60*60*24*1000  ))
                .signWith(getKey())
                .compact();
        
        
    }

    private Key getKey() {
        
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
        
    }
    
    private Claims extractAllClaims(String token){
        
        return Jwts.parser().verifyWith(decryptKey(SECRET_KEY)).build()
                .parseSignedClaims(token)
                .getPayload();
        
    }
    
    private <T> T extractClaims(String token, Function<Claims, T> claimResolver){
        
        Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
        
    }
    
     private SecretKey decryptKey(String secretkey) {
        
        byte[] keyBytes = Decoders.BASE64.decode(secretkey);
        return Keys.hmacShaKeyFor(keyBytes);
         
    }
     
    public String extractUsername(String token) {
        
        return extractClaims(token, Claims::getSubject);
    }
    
    public Date extractExpirationDate(String token){
         return extractClaims(token, Claims::getExpiration);
    }

    public Boolean validateToken(String token, CustomUser user) {
        
        String username = extractUsername(token);
        Boolean isExpired = isTokenExpired(token);
        
        return username.equals(user.getUsername()) && !isExpired;
        
    }

    public Boolean isTokenExpired(String token) {
        
        Date expireDate = extractExpirationDate(token);
        
        return expireDate.before(new Date());
        
    }
     
    
}
